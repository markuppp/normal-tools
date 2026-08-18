"use client";

import { useMemo, useState } from "react";
import JSZip from "jszip";
import { PDFDocument } from "pdf-lib";
import { ToolFrame } from "./shared";

const PDF_POINTS_PER_MM = 72 / 25.4;
const PRESETS = [10, 15, 20, 25];

type EntryState = "loading" | "ready" | "success" | "error";
type ProgressState = "waiting" | "processing" | "success" | "error";

type PdfEntry = {
  id: string;
  file: File;
  pageCount: number | null;
  pageHeights: number[];
  state: EntryState;
  error: string;
};

type ProgressEntry = {
  id: string;
  name: string;
  state: ProgressState;
  message: string;
  percent: number;
};

function mmToPoints(mm: number) {
  return mm * PDF_POINTS_PER_MM;
}

function croppedName(filename: string) {
  return `${filename.replace(/\.pdf$/i, "")}-cropped.pdf`;
}

function errorMessage(caught: unknown) {
  const text = caught instanceof Error ? caught.message.toLowerCase() : String(caught).toLowerCase();
  if (text.includes("encrypted") || text.includes("password")) return "Encrypted or password-protected PDF.";
  if (text.includes("invalid") || text.includes("parse") || text.includes("header") || text.includes("pdf")) return "Invalid or unsupported PDF.";
  return "Could not read this PDF.";
}

function outputName(filename: string, used: Set<string>) {
  const base = croppedName(filename);
  if (!used.has(base)) {
    used.add(base);
    return base;
  }
  const stem = base.replace(/\.pdf$/i, "");
  let index = 2;
  let candidate = `${stem}-${index}.pdf`;
  while (used.has(candidate)) candidate = `${stem}-${++index}.pdf`;
  used.add(candidate);
  return candidate;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function fileKey(file: File) {
  return `${file.name}:${file.size}:${file.lastModified}`;
}

function fileError(caught: unknown, entry: PdfEntry) {
  if (caught instanceof Error && caught.message.startsWith("The crop amount")) return caught.message;
  if (entry.pageCount === null) return errorMessage(caught);
  return caught instanceof Error ? caught.message : "Could not crop this PDF.";
}

export function PdfBottomCropperTool({ name }: { name: string }) {
  const [entries, setEntries] = useState<PdfEntry[]>([]);
  const [amount, setAmount] = useState("15");
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<ProgressEntry[]>([]);
  const [summary, setSummary] = useState("");
  const [notice, setNotice] = useState("");

  const numericAmount = Number(amount);
  const loading = entries.some((entry) => entry.state === "loading");
  const amountMessage = useMemo(() => {
    if (!Number.isFinite(numericAmount) || numericAmount < 0) return "Enter a crop amount of 0 mm or more.";
    if (numericAmount === 0) return "0 mm will not remove anything from the PDFs.";
    const cropPoints = mmToPoints(numericAmount);
    const oversized = entries.find((entry) => entry.pageHeights.some((height) => cropPoints >= height));
    return oversized ? `The crop amount would remove an entire page in ${oversized.file.name}.` : "";
  }, [entries, numericAmount]);

  const addFiles = (incoming: FileList | File[]) => {
    const existing = new Set(entries.map((entry) => fileKey(entry.file)));
    const pdfs = Array.from(incoming).filter((file) => {
      const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
      return isPdf && !existing.has(fileKey(file));
    });
    if (!pdfs.length) {
      setNotice("Choose one or more PDF files.");
      return;
    }
    setNotice("");
    setSummary("");
    const nextEntries: PdfEntry[] = pdfs.map((file) => ({
      id: crypto.randomUUID(), file, pageCount: null, pageHeights: [], state: "loading", error: "",
    }));
    setEntries((current) => [...current, ...nextEntries]);
    nextEntries.forEach(async (entry) => {
      try {
        const document = await PDFDocument.load(await entry.file.arrayBuffer());
        const pages = document.getPages();
        setEntries((current) => current.map((item) => item.id === entry.id ? {
          ...item, pageCount: pages.length, pageHeights: pages.map((page) => page.getCropBox().height), state: "ready", error: "",
        } : item));
      } catch (caught) {
        setEntries((current) => current.map((item) => item.id === entry.id ? {
          ...item, state: "error", error: errorMessage(caught),
        } : item));
      }
    });
  };

  const removeFile = (id: string) => {
    setEntries((current) => current.filter((entry) => entry.id !== id));
    setProgress((current) => current.filter((item) => item.id !== id));
  };

  const cropFile = async (entry: PdfEntry, cropPoints: number) => {
    const document = await PDFDocument.load(await entry.file.arrayBuffer());
    const pages = document.getPages();
    const tooLarge = pages.findIndex((page) => cropPoints >= page.getCropBox().height);
    if (tooLarge !== -1) throw new Error(`The crop amount would remove all of page ${tooLarge + 1}.`);
    pages.forEach((page) => {
      const { x, y, width, height } = page.getCropBox();
      page.setCropBox(x, y + cropPoints, width, height - cropPoints);
    });
    return document.save();
  };

  const updateProgress = (id: string, update: Partial<ProgressEntry>) => {
    setProgress((current) => current.map((item) => item.id === id ? { ...item, ...update } : item));
  };

  const process = async () => {
    if (busy || !entries.length || loading || amountMessage && !amountMessage.startsWith("0 mm")) return;
    if (numericAmount === 0 && !window.confirm("The crop amount is 0 mm, so the visible page area will not change. Continue?")) return;
    setBusy(true);
    setNotice("");
    setSummary("");
    const statuses: ProgressEntry[] = entries.map((entry) => ({ id: entry.id, name: entry.file.name, state: "waiting", message: "Waiting", percent: 0 }));
    setProgress(statuses);
    const zip = new JSZip();
    const usedNames = new Set<string>();
    let succeeded = 0;
    let failed = 0;
    const cropPoints = mmToPoints(numericAmount);

    for (const entry of entries) {
      updateProgress(entry.id, { state: "processing", message: "Cropping pages…", percent: 45 });
      try {
        const bytes = await cropFile(entry, cropPoints);
        zip.file(outputName(entry.file.name, usedNames), bytes);
        updateProgress(entry.id, { state: "success", message: "Ready", percent: 100 });
        succeeded += 1;
      } catch (caught) {
        updateProgress(entry.id, { state: "error", message: fileError(caught, entry), percent: 100 });
        failed += 1;
      }
    }

    if (succeeded) downloadBlob(await zip.generateAsync({ type: "blob" }), "cropped-pdfs.zip");
    setSummary(`${succeeded} succeeded${failed ? `, ${failed} failed` : ""}`);
    setBusy(false);
  };

  const statusClass = (state: ProgressState) => `pdf-crop-status pdf-crop-status-${state}`;

  return (
    <ToolFrame title={name} status="processed locally">
      <div className="pdf-cropper-shell">
        <label
          className={`pdf-crop-dropzone${dragging ? " is-dragging" : ""}`}
          onDragEnter={(event) => { event.preventDefault(); setDragging(true); }}
          onDragOver={(event) => event.preventDefault()}
          onDragLeave={(event) => { if (event.currentTarget === event.target) setDragging(false); }}
          onDrop={(event) => { event.preventDefault(); setDragging(false); addFiles(event.dataTransfer.files); }}
        >
          <input className="visually-hidden-file" type="file" accept="application/pdf,.pdf" multiple onChange={(event) => { if (event.target.files) addFiles(event.target.files); event.currentTarget.value = ""; }} />
          <span className="pdf-crop-document-mark" aria-hidden="true">PDF</span>
          <strong>Drop PDFs here</strong>
          <span>or choose files from your computer</span>
          <span className="plain-button file-button">Add PDFs</span>
        </label>

        <div className="pdf-crop-section-heading"><h2>Files</h2><span>{entries.length} {entries.length === 1 ? "file" : "files"}</span></div>
        <div className="pdf-crop-list">
          {!entries.length && <p className="pdf-crop-empty">No PDFs selected yet.</p>}
          {entries.map((entry) => (
            <div className="pdf-crop-file-row" key={entry.id}>
              <span className="pdf-crop-file-symbol" aria-hidden="true">PDF</span>
              <strong title={entry.file.name}>{entry.file.name}</strong>
              <span className={entry.error ? "pdf-crop-error-text" : "pdf-crop-page-count"}>{entry.error || (entry.pageCount === null ? "Reading…" : `${entry.pageCount} ${entry.pageCount === 1 ? "page" : "pages"}`)}</span>
              <button className="pdf-crop-remove" type="button" aria-label={`Remove ${entry.file.name}`} disabled={busy} onClick={() => removeFile(entry.id)}>×</button>
            </div>
          ))}
        </div>

        <div className="pdf-crop-controls">
          <label className="field"><span>Remove from bottom</span><span className="input-with-suffix"><input type="number" min={0} step="0.1" value={amount} onChange={(event) => setAmount(event.target.value)} disabled={busy} /><b>mm</b></span></label>
          <div className="pdf-crop-presets" aria-label="Crop amount presets">
            {PRESETS.map((preset) => <button key={preset} className={numericAmount === preset ? "is-selected" : ""} type="button" aria-pressed={numericAmount === preset} disabled={busy} onClick={() => setAmount(String(preset))}>{preset} mm</button>)}
          </div>
        </div>
        {amountMessage && <p className={amountMessage.startsWith("0 mm") ? "notice-output" : "error-output"} role="status">{amountMessage}</p>}
        {notice && <p className="error-output" role="status">{notice}</p>}
        <div className="pdf-crop-action"><button className="plain-button primary-button" type="button" disabled={busy || !entries.length || loading || Boolean(amountMessage && !amountMessage.startsWith("0 mm"))} onClick={process}>{busy ? "Cropping…" : "Crop PDFs"}</button></div>

        {progress.length > 0 && <>
          <div className="pdf-crop-section-heading pdf-crop-progress-heading"><h2>Progress</h2><span>{summary}</span></div>
          <div className="pdf-crop-list pdf-crop-progress-list">
            {progress.map((item) => <div className="pdf-crop-progress-row" key={item.id}><strong title={item.name}>{item.name}</strong><span className={statusClass(item.state)}>{item.message}</span><span className="pdf-crop-progress-track"><i style={{ width: `${item.percent}%` }} /></span>{item.state === "success" && <b aria-label="Success">✓</b>}{item.state === "error" && <b aria-label="Failed">!</b>}</div>)}
          </div>
        </>}
      </div>
      <p className="tool-caution">Pages are cropped with PDF coordinate boxes, so vector text and image quality stay intact. Source files are never changed or uploaded.</p>
    </ToolFrame>
  );
}
