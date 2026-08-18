"use client";

import { CalculatorTool, calculatorSlugs } from "./tools/calculator-tools";
import { ExpandedCalculatorTool, expandedCalculatorSlugs } from "./tools/expanded-calculator-tools";
import { ExpandedTextTool, expandedTextSlugs } from "./tools/expanded-text-tools";
import { AgeTool, ChmodTool, NetworkTool, PasswordTool, RandomNumberTool, TimeZoneTool, UnitTool, UtmTool } from "./tools/expanded-special-tools";
import { ImageUtilityTool, PdfMergerTool, PdfSplitterTool, QrTool } from "./tools/essential-file-tools";
import { SecondCalculatorTool, secondCalculatorSlugs } from "./tools/second-calculator-tools";
import { SecondFileTool, secondFileSlugs } from "./tools/second-file-tools";
import { SecondSpecialTool, secondSpecialSlugs } from "./tools/second-special-tools";
import { SecondTextTool, secondTextSlugs } from "./tools/second-text-tools";
import { BankPdfTool, DwgTool, Mp3MidiTool, PsdTool, StlTool } from "./tools/file-tools";
import {
  AspectTool, ColorTool, ContractTool, CronTool, DiffTool, DomainTool, EstimateTool,
  FaviconTool, GradientTool, HashTool, JwtTool, NameTool, RegexTool, SeatingTool,
  TimestampTool, UuidTool,
} from "./tools/special-tools";
import { TextTool, textSlugs } from "./tools/text-tools";

export function ToolWorkbench({ slug, name }: { slug: string; name: string }) {
  if (calculatorSlugs.has(slug)) return <CalculatorTool slug={slug} name={name} />;
  if (expandedCalculatorSlugs.has(slug)) return <ExpandedCalculatorTool slug={slug} name={name} />;
  if (textSlugs.has(slug)) return <TextTool slug={slug} name={name} />;
  if (expandedTextSlugs.has(slug)) return <ExpandedTextTool slug={slug} name={name} />;
  if (secondCalculatorSlugs.has(slug)) return <SecondCalculatorTool slug={slug} name={name} />;
  if (secondTextSlugs.has(slug)) return <SecondTextTool slug={slug} name={name} />;
  if (secondSpecialSlugs.has(slug)) return <SecondSpecialTool slug={slug} name={name} />;
  if (secondFileSlugs.has(slug)) return <SecondFileTool slug={slug} name={name} />;

  switch (slug) {
    case "construction-estimate-generator": return <EstimateTool name={name} />;
    case "bank-statement-pdf-to-csv-converter": return <BankPdfTool name={name} />;
    case "psd-to-png-converter": return <PsdTool name={name} />;
    case "mp3-to-midi-converter": return <Mp3MidiTool name={name} />;
    case "dwg-to-pdf-converter": return <DwgTool name={name} />;
    case "stl-to-g-code-converter": return <StlTool name={name} />;
    case "wedding-seating-chart-builder": return <SeatingTool name={name} />;
    case "photography-contract-generator": return <ContractTool name={name} />;
    case "regex-tester": return <RegexTool name={name} />;
    case "jwt-decoder": return <JwtTool name={name} />;
    case "cron-expression-generator": return <CronTool name={name} />;
    case "domain-age-checker": return <DomainTool name={name} />;
    case "text-diff-checker": return <DiffTool name={name} />;
    case "uuid-generator": return <UuidTool name={name} />;
    case "hash-generator": return <HashTool name={name} />;
    case "favicon-generator": return <FaviconTool name={name} />;
    case "color-picker": return <ColorTool name={name} />;
    case "css-gradient-generator": return <GradientTool name={name} />;
    case "hex-to-rgb-converter": return <ColorTool name={name} hexOnly />;
    case "timestamp-converter": return <TimestampTool name={name} />;
    case "aspect-ratio-calculator": return <AspectTool name={name} />;
    case "podcast-name-generator": return <NameTool name={name} kind="podcast" />;
    case "band-name-generator": return <NameTool name={name} kind="band" />;
    case "dnd-name-generator": return <NameTool name={name} kind="dnd" />;
    case "clan-name-generator": return <NameTool name={name} kind="clan" />;
    case "chmod-calculator": return <ChmodTool name={name} />;
    case "cidr-calculator": return <NetworkTool name={name} />;
    case "subnet-calculator": return <NetworkTool name={name} subnet />;
    case "utm-link-builder": return <UtmTool name={name} />;
    case "password-generator": return <PasswordTool name={name} />;
    case "qr-code-generator": return <QrTool name={name} />;
    case "age-calculator": return <AgeTool name={name} />;
    case "unit-converter": return <UnitTool name={name} />;
    case "image-resizer": return <ImageUtilityTool name={name} slug={slug} />;
    case "image-compressor": return <ImageUtilityTool name={name} slug={slug} />;
    case "jpg-to-png-converter": return <ImageUtilityTool name={name} slug={slug} />;
    case "png-to-jpg-converter": return <ImageUtilityTool name={name} slug={slug} />;
    case "webp-to-jpg-converter": return <ImageUtilityTool name={name} slug={slug} />;
    case "pdf-merger": return <PdfMergerTool name={name} />;
    case "pdf-splitter": return <PdfSplitterTool name={name} />;
    case "random-number-generator": return <RandomNumberTool name={name} />;
    case "time-zone-converter": return <TimeZoneTool name={name} />;
    default: return null;
  }
}
