(() => {
  "use strict";
  const input = document.getElementById("shutter-file");
  if (!input || input.dataset.initialized === "true") return;
  input.dataset.initialized = "true";

  const drop = document.getElementById("shutter-drop");
  const result = document.getElementById("shutter-result");
  const success = document.getElementById("shutter-success");
  const missing = document.getElementById("shutter-missing");
  const status = document.getElementById("shutter-status");
  const value = document.getElementById("shutter-value");
  const source = document.getElementById("shutter-source");
  const message = document.getElementById("shutter-message");
  const fileName = document.getElementById("meta-file");
  const camera = document.getElementById("meta-camera");
  const date = document.getElementById("meta-date");
  const another = document.getElementById("shutter-another");
  const typeSizes = { 1: 1, 2: 1, 3: 2, 4: 4, 5: 8, 7: 1, 9: 4, 10: 8 };

  function inBounds(view, offset, length = 1) {
    return offset >= 0 && length >= 0 && offset + length <= view.byteLength;
  }

  function get16(view, offset, little) {
    return inBounds(view, offset, 2) ? view.getUint16(offset, little) : null;
  }

  function get32(view, offset, little) {
    return inBounds(view, offset, 4) ? view.getUint32(offset, little) : null;
  }

  function bytesEqual(view, offset, bytes) {
    if (!inBounds(view, offset, bytes.length)) return false;
    return bytes.every((byte, index) => view.getUint8(offset + index) === byte);
  }

  function locateTiff(view) {
    const tiffHeader = (offset) =>
      bytesEqual(view, offset, [0x49, 0x49, 0x2a, 0x00]) ||
      bytesEqual(view, offset, [0x4d, 0x4d, 0x00, 0x2a]);
    if (tiffHeader(0)) return 0;
    if (!bytesEqual(view, 0, [0xff, 0xd8])) return null;
    let offset = 2;
    while (inBounds(view, offset, 4)) {
      if (view.getUint8(offset) !== 0xff) { offset += 1; continue; }
      const marker = view.getUint8(offset + 1);
      if (marker === 0xda || marker === 0xd9) break;
      const length = view.getUint16(offset + 2, false);
      if (marker === 0xe1 && length >= 8 && bytesEqual(view, offset + 4, [0x45, 0x78, 0x69, 0x66, 0, 0])) {
        const tiffOffset = offset + 10;
        if (tiffHeader(tiffOffset)) return tiffOffset;
      }
      offset += Math.max(2, length + 2);
    }
    return null;
  }

  function readEntries(view, ifdPosition, tiffBase, little) {
    const count = get16(view, ifdPosition, little);
    if (count === null || count > 1000) return [];
    const entries = [];
    for (let index = 0; index < count; index += 1) {
      const position = ifdPosition + 2 + index * 12;
      if (!inBounds(view, position, 12)) break;
      const tag = get16(view, position, little);
      const type = get16(view, position + 2, little);
      const itemCount = get32(view, position + 4, little);
      const size = (typeSizes[type] || 1) * itemCount;
      const storedOffset = get32(view, position + 8, little);
      const valuePosition = size <= 4 ? position + 8 : tiffBase + storedOffset;
      if (tag !== null && itemCount !== null && valuePosition !== null && inBounds(view, valuePosition, Math.min(size, 1))) {
        entries.push({ tag, type, count: itemCount, size, position: valuePosition });
      }
    }
    return entries;
  }

  function readEntry(view, entry, little) {
    if (!entry) return null;
    if (entry.type === 2) {
      const bytes = new Uint8Array(view.buffer, view.byteOffset + entry.position, Math.max(0, entry.count - 1));
      return new TextDecoder("utf-8").decode(bytes).replace(/\0/g, "").trim();
    }
    if (entry.type === 3) return get16(view, entry.position, little);
    if (entry.type === 4) return get32(view, entry.position, little);
    if (entry.type === 9 && inBounds(view, entry.position, 4)) return view.getInt32(entry.position, little);
    if ((entry.type === 1 || entry.type === 7) && entry.count === 1) return view.getUint8(entry.position);
    return null;
  }

  function findInnerTiff(view, start, length) {
    const end = Math.min(view.byteLength - 8, start + Math.min(length, 48));
    for (let offset = start; offset <= end; offset += 1) {
      if (bytesEqual(view, offset, [0x49, 0x49, 0x2a, 0x00]) || bytesEqual(view, offset, [0x4d, 0x4d, 0x00, 0x2a])) return offset;
    }
    return null;
  }

  function validCount(candidate) {
    return Number.isInteger(candidate) && candidate >= 0 && candidate < 100000000;
  }

  function readMakerCount(view, maker, outerTiff, outerLittle, make) {
    if (!maker || maker.size < 8) return null;
    const makerStart = maker.position;
    const makerLength = Math.min(maker.size, view.byteLength - makerStart);
    const innerTiff = findInnerTiff(view, makerStart, makerLength);

    if (innerTiff !== null) {
      const innerLittle = view.getUint16(innerTiff, false) === 0x4949;
      const firstOffset = get32(view, innerTiff + 4, innerLittle);
      if (firstOffset !== null) {
        const entries = readEntries(view, innerTiff + firstOffset, innerTiff, innerLittle);
        const nikonCount = readEntry(view, entries.find((entry) => entry.tag === 0x00a7), innerLittle);
        if (validCount(nikonCount)) return { count: nikonCount, source: "Nikon maker-note ShutterCount" };
        const sonyCount = readEntry(view, entries.find((entry) => entry.tag === 0x0846), innerLittle);
        if (validCount(sonyCount)) return { count: sonyCount, source: "Sony maker-note ShutterCount" };
      }
    }

    const headerLength = /olympus/i.test(make) ? 12 : /sony/i.test(make) ? 12 : 0;
    const directPosition = makerStart + headerLength;
    const directEntries = readEntries(view, directPosition, outerTiff, outerLittle);
    const directSony = readEntry(view, directEntries.find((entry) => entry.tag === 0x0846), outerLittle);
    if (validCount(directSony)) return { count: directSony, source: "Sony maker-note ShutterCount" };
    return null;
  }

  function scanTextCount(buffer) {
    const sample = new Uint8Array(buffer, 0, Math.min(buffer.byteLength, 5 * 1024 * 1024));
    const text = new TextDecoder("latin1").decode(sample);
    const patterns = [
      /(?:ShutterCount|Shutter Count|TotalShutterReleases|ExposureCount)[^0-9]{0,80}([0-9]{1,8})/i,
      /(?:ImageCount|ImageNumber)[^0-9]{0,80}([0-9]{1,8})/i,
    ];
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        const count = Number(match[1]);
        if (validCount(count)) return { count, source: "Embedded XMP image-count metadata" };
      }
    }
    return null;
  }

  function parseMetadata(buffer) {
    const view = new DataView(buffer);
    const tiff = locateTiff(view);
    if (tiff === null) {
      const textCount = scanTextCount(buffer);
      return { countResult: textCount, make: "", model: "", captured: "", hasExif: false };
    }
    const little = view.getUint16(tiff, false) === 0x4949;
    const firstIfdOffset = get32(view, tiff + 4, little);
    if (firstIfdOffset === null) throw new Error("Incomplete EXIF header");
    const ifd0 = readEntries(view, tiff + firstIfdOffset, tiff, little);
    const make = readEntry(view, ifd0.find((entry) => entry.tag === 0x010f), little) || "";
    const model = readEntry(view, ifd0.find((entry) => entry.tag === 0x0110), little) || "";
    const exifPointer = readEntry(view, ifd0.find((entry) => entry.tag === 0x8769), little);
    const exif = validCount(exifPointer) ? readEntries(view, tiff + exifPointer, tiff, little) : [];
    const captured = readEntry(view, exif.find((entry) => entry.tag === 0x9003), little) ||
      readEntry(view, ifd0.find((entry) => entry.tag === 0x0132), little) || "";
    const imageNumber = readEntry(view, exif.find((entry) => entry.tag === 0x9211), little);
    const maker = exif.find((entry) => entry.tag === 0x927c);
    const makerResult = readMakerCount(view, maker, tiff, little, make);
    const standardResult = validCount(imageNumber) && imageNumber > 0
      ? { count: imageNumber, source: "Standard EXIF ImageNumber" }
      : null;
    return {
      countResult: makerResult || scanTextCount(buffer) || standardResult,
      make,
      model,
      captured,
      hasExif: true,
    };
  }

  function prettyDate(raw) {
    if (!raw) return "Not found";
    const match = String(raw).match(/^(\d{4}):(\d{2}):(\d{2})[ T](.*)$/);
    return match ? `${match[1]}-${match[2]}-${match[3]} ${match[4]}` : String(raw);
  }

  function reset() {
    input.value = "";
    result.hidden = true;
    drop.hidden = false;
    success.hidden = true;
    missing.hidden = true;
    status.textContent = "Ready";
  }

  async function inspect(file) {
    if (!file) return;
    if (file.size > 100 * 1024 * 1024) {
      status.textContent = "File too large";
      return;
    }
    status.textContent = "Reading metadata…";
    drop.classList.add("is-reading");
    try {
      const buffer = await file.arrayBuffer();
      const metadata = parseMetadata(buffer);
      fileName.textContent = `${file.name} (${(file.size / 1024 / 1024).toFixed(1)} MB)`;
      camera.textContent = [metadata.make, metadata.model].filter(Boolean).join(" ").replace(/\s+/g, " ").trim() || "Not found";
      date.textContent = prettyDate(metadata.captured);
      drop.hidden = true;
      result.hidden = false;
      if (metadata.countResult) {
        success.hidden = false;
        missing.hidden = true;
        value.textContent = metadata.countResult.count.toLocaleString();
        source.textContent = `Found in: ${metadata.countResult.source}`;
        status.textContent = "Count found";
      } else {
        success.hidden = true;
        missing.hidden = false;
        message.textContent = metadata.hasExif
          ? "Camera metadata was found, but this model does not expose a readable count in the uploaded file. Try a different original photo from the camera."
          : "No original camera metadata was found. Use an unedited file copied directly from the camera card.";
        status.textContent = "No count found";
      }
    } catch {
      drop.hidden = true;
      result.hidden = false;
      success.hidden = true;
      missing.hidden = false;
      fileName.textContent = file.name;
      camera.textContent = "Not found";
      date.textContent = "Not found";
      message.textContent = "We could not read this file. Try an original JPEG or TIFF copied directly from the camera.";
      status.textContent = "Could not read file";
    } finally {
      drop.classList.remove("is-reading");
    }
  }

  input.addEventListener("change", () => inspect(input.files[0]));
  ["dragenter", "dragover"].forEach((eventName) => drop.addEventListener(eventName, (event) => {
    event.preventDefault();
    drop.classList.add("is-dragging");
  }));
  ["dragleave", "drop"].forEach((eventName) => drop.addEventListener(eventName, (event) => {
    event.preventDefault();
    drop.classList.remove("is-dragging");
  }));
  drop.addEventListener("drop", (event) => inspect(event.dataTransfer.files[0]));
  another.addEventListener("click", reset);
})();
