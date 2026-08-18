import type { Tool } from "./tools";

export type ToolSeoContent = {
  steps: [string, string, string];
  about: [string, string];
  example: string;
  uses: [string, string, string];
  keywords: string[];
};

const trimSentence = (value: string) => value.trim().replace(/[.?!]+$/, "");
const lowerFirst = (value: string) => value.charAt(0).toLowerCase() + value.slice(1);
const plainName = (tool: Tool) => tool.name.replace(/^Online /, "").replace(/ Online$/, "");

const hasMoneyWord = (value: string) => /\b(fee|profit|earnings|revenue|payout|royalty)\b/.test(value);

function resultLabel(tool: Tool) {
  const name = tool.name.toLowerCase();
  if (tool.slug === "construction-estimate-generator") return "the line items, subtotal, tax, overhead, and project total";
  if (tool.slug === "wedding-seating-chart-builder") return "the table assignments, seat counts, and remaining guests";
  if (tool.slug === "photography-contract-generator") return "the names, services, dates, fees, and delivery terms";
  if (tool.slug === "bulk-meta-description-generator") return "the generated descriptions and character counts";
  if (tool.slug === "uuid-generator") return "the generated UUIDs and requested quantity";
  if (tool.slug === "hash-generator") return "the selected algorithm and generated hash";
  if (tool.slug === "password-generator") return "the password length, character choices, and generated password";
  if (tool.slug === "qr-code-generator") return "the encoded text, image size, and QR code preview";
  if (tool.slug === "favicon-generator") return "the icon preview, colors, and image size";
  if (tool.slug === "color-palette-generator") return "the palette colors, harmony, and copied values";
  if (hasMoneyWord(name)) return "the fee, payout, profit, margin, and break-even figures";
  if (name.includes("calculator")) return "the calculated totals, units, and assumptions";
  if (name.includes("converter")) return "the converted result";
  if (name.includes("generator")) return "the generated options";
  if (/formatter|beautifier/.test(name)) return "the formatted output and any syntax message";
  if (name.includes("validator")) return "the validation result and reported error location";
  if (name.includes("counter")) return "the live counts and limits";
  if (/tester|checker/.test(name)) return "the test result and any values that look unusual";
  if (name.includes("minifier")) return "the minified output and file-size difference";
  if (name.includes("builder")) return "the generated plan and each editable field";
  return "the result shown beside the controls";
}

function inputInstruction(tool: Tool) {
  const slug = tool.slug;
  if (slug === "gamepad-tester") return "Connect the controller by USB or Bluetooth, press a button so the browser can detect it, then move every stick and trigger.";
  if (slug === "touchscreen-dead-zone-tester") return "Open the page on the touch device, enter full screen, and drag a finger slowly through every row and column of the grid.";
  if (slug === "camera-shutter-count-checker") return "Choose an original JPEG or TIFF copied from the camera. Edited images and photos saved by messaging apps often lose the needed metadata.";
  if (slug === "image-resizer") return "Choose an image, enter the new width and height, and decide whether to preserve the original aspect ratio.";
  if (slug === "image-compressor") return "Choose a JPEG, PNG, or WebP image, then adjust the quality while comparing the preview and file size.";
  if (slug === "image-cropper") return "Choose an image, select an aspect ratio, and adjust the crop area before downloading the result.";
  if (slug === "jpg-to-png-converter") return "Choose a JPEG image and review the PNG preview before downloading the converted file.";
  if (slug === "png-to-jpg-converter") return "Choose a PNG image, select the JPEG quality and background color, then review the preview.";
  if (slug === "webp-to-jpg-converter") return "Choose a WebP image, select the JPEG quality and background color, then review the preview.";
  if (slug === "svg-to-png-converter") return "Paste SVG markup or choose an SVG file, then set the output width and height.";
  if (slug === "image-to-base64-converter") return "Choose an image, then copy the complete data URL or the CSS-ready value.";
  if (slug === "psd-to-png-converter") return "Choose a PSD file and wait for the flattened composite preview to appear.";
  if (slug === "pdf-merger") return "Choose two or more PDF files, arrange them in the order you want, and remove any file that does not belong in the final document.";
  if (slug === "pdf-splitter") return "Choose a PDF, then enter the page range you want or select the option that creates one file per page.";
  if (slug.includes("bank-statement")) return "Choose a text-based bank statement PDF and inspect the detected transaction rows before exporting them.";
  if (slug.includes("mp3-to-midi")) return "Choose a clean, single-note MP3 or other browser-readable audio file and wait for the pitch analysis to finish.";
  if (slug.includes("dwg-to-pdf")) return "Choose the DWG drawing and review the local preview before printing or saving it as a PDF.";
  if (slug.includes("stl-to-g-code")) return "Choose an ASCII or binary STL file, set the layer height and movement speed, and generate the draft outline G-code.";
  if (slug === "csv-viewer") return "Paste CSV text or open a CSV file, confirm the delimiter, then search or sort the parsed table.";
  if (slug === "jsonpath-tester") return "Paste valid JSON and enter a JSONPath expression such as $.store.book[*].title.";
  if (slug === "css-gradient-generator") return "Choose the two colors and gradient type. Set an angle for a linear gradient while watching the preview.";
  if (slug === "markdown-preview") return "Paste or write Markdown in the editor, then compare it with the rendered preview.";
  if (slug === "markdown-table-generator") return "Paste rows separated by commas, tabs, or vertical bars, then choose or detect the separator.";
  if (slug === "csv-delimiter-converter") return "Paste CSV data, choose the current delimiter and the new delimiter, then review the converted rows.";
  if (/json|yaml|xml|sql|html|css|javascript|code-beautifier|base64|url-encoder|binary|markdown-preview|markdown-table|csv-delimiter|html-encoder/.test(slug)) return "Paste the source text or code, then choose the conversion or formatting mode.";
  if (slug === "regex-tester") return "Enter the regular expression without slash delimiters, choose the flags, then paste test text and an optional replacement pattern.";
  if (slug === "jwt-decoder") return "Paste the complete three-part JWT. Read the decoded header and payload without treating them as signature-verified data.";
  if (slug === "cron-expression-generator") return "Choose the minute, hour, day, month, and weekday values that match the schedule you need.";
  if (slug === "domain-age-checker") return "Enter a bare domain name such as example.com and run the public RDAP lookup.";
  if (slug === "robots-txt-generator") return "Enter the site hostname, choose the crawler policy, and check the sitemap URL in the generated robots.txt file.";
  if (slug === "csp-header-generator") return "Choose a policy preset, add the origins your site loads resources from, and review every directive before using the header.";
  if (slug === "nginx-redirect-generator") return "Enter each old path and destination URL on its own line, then choose the correct permanent or temporary status code.";
  if (slug === "hreflang-tag-generator") return "Enter one language code and full page URL per line, including the self-reference and x-default page when needed.";
  if (slug === "utm-link-builder") return "Enter the destination URL, campaign source, medium, and campaign name. Add term or content values only when they help separate ads or links.";
  if (slug === "chmod-calculator") return "Select read, write, and execute permissions for the owner, group, and others.";
  if (/cidr|subnet/.test(slug)) return "Enter the IPv4 address and CIDR prefix, then confirm that the prefix matches the network you intend to inspect.";
  if (slug === "password-generator") return "Choose the password length and allowed character sets. Exclude ambiguous characters if the password will be typed by hand.";
  if (slug === "uuid-generator") return "Enter how many UUID v4 values you need, up to the page limit, then generate a fresh batch.";
  if (slug === "hash-generator") return "Paste the exact text to hash and choose SHA-1, SHA-256, SHA-384, or SHA-512.";
  if (slug === "favicon-generator") return "Enter a letter or emoji, choose the foreground and background colors, and select the PNG size.";
  if (slug === "color-picker") return "Choose a color visually or type its HEX value, then adjust alpha if you need an RGBA color.";
  if (slug === "color-palette-generator") return "Choose a starting color and harmony rule, then regenerate until the palette fits the design.";
  if (slug === "qr-code-generator") return "Enter the text or URL the QR code should contain, then choose its size and error-correction level.";
  if (slug === "podcast-name-generator") return "Describe the podcast topic, then choose a voice and naming style before generating a batch.";
  if (slug === "band-name-generator") return "Describe the genre, mood, or reference point, then choose the energy and name shape.";
  if (slug === "dnd-name-generator") return "Describe the character, choose an ancestry and name type, then generate a batch that fits those cues.";
  if (slug === "clan-name-generator") return "Describe the game, play style, or group identity, then choose the energy and name shape.";
  if (slug === "lorem-ipsum-generator") return "Choose paragraphs, sentences, or words, enter the amount, and generate the placeholder copy.";
  if (slug === "case-converter") return "Paste the text, then choose upper, lower, title, sentence, camel, snake, or kebab case.";
  if (slug === "slug-generator") return "Paste one or more titles, with each title on its own line, to create lowercase URL slugs.";
  if (slug === "remove-duplicate-lines-online") return "Paste one item per line, then choose whether to trim spaces or ignore letter case when matching duplicates.";
  if (slug === "word-counter") return "Paste or type the text you want to count. The word, sentence, paragraph, and time estimates update with the text.";
  if (slug === "character-counter") return "Paste or type the text you want to measure. The character, line, byte, word, and platform counts update with the text.";
  if (slug === "readability-score-checker") return "Paste the article, email, or page copy you want to score for reading ease and grade level.";
  if (slug === "text-diff-checker") return "Paste the original text on the left and the changed text on the right, then review each added, removed, or changed line.";
  if (slug === "bulk-meta-description-generator") return "Enter one page per line as title, keyword, and detail separated by vertical bars, then review the generated CSV rows.";
  if (slug === "number-to-words-converter") return "Enter a whole number or decimal, then choose plain-number or currency wording.";
  if (slug === "roman-numeral-converter") return "Enter an Arabic number or Roman numeral, then choose the direction of conversion.";
  if (slug === "wedding-seating-chart-builder") return "Paste one guest name per line, set the seats per table, and review how the list is divided.";
  if (slug === "photography-contract-generator") return "Enter the photographer, client, services, event date, location, fee, retainer, and delivery time.";
  if (slug === "construction-estimate-generator") return "Name the project, add each labor and material line, then enter quantity, rate, tax, and overhead.";
  if (slug === "stopwatch") return "Press Start when the activity begins, use Lap for intermediate times, and pause only when timing should stop.";
  if (slug === "countdown-timer") return "Set the minutes and seconds, then start the countdown and leave the tab open until it finishes.";
  if (slug === "dice-roller") return "Choose the dice type, number of dice, and modifier, then roll and read the individual values and total.";
  if (slug === "coin-flip") return "Choose how many coins to flip, run the toss, and read the heads, tails, and streak totals.";
  if (slug === "time-zone-converter") return "Choose the date, time, source zone, and destination zone. Check the date as well as the clock time.";
  if (slug === "random-number-generator") return "Enter the minimum, maximum, and quantity, then choose whether repeated values are allowed.";
  if (slug === "age-calculator") return "Enter the birth date and comparison date, using the local calendar dates rather than approximate years.";
  if (slug === "date-difference-calculator") return "Enter the start and end date and time, then choose whether business days should exclude weekends.";
  if (/(^|-)(fee|profit|payout|royalty|earnings|revenue|roas)(-|$)/.test(slug)) return "Enter the sale or revenue amount, your direct costs, and the current platform or payment rates shown on your account.";
  if (/loan|mortgage|compound-interest/.test(slug)) return "Enter the starting amount, interest rate, term, and any payment or contribution details requested above.";
  if (/tip|sales-tax|discount|percentage/.test(slug)) return "Enter the original amount and the percentage, tax rate, discount, split, or comparison values that apply.";
  if (slug === "bmi-calculator") return "Enter your height and weight, then choose metric or US units to calculate body mass index.";
  if (slug === "calorie-calculator") return "Enter your age, height, weight, sex factor, and activity level to estimate daily calorie needs.";
  if (/gpa|grade-calculator/.test(slug)) return "Add each course or assignment with its credits or weight, then enter the grade or grade points.";
  if (slug === "fuel-trip-cost-calculator") return "Enter trip distance, fuel economy, fuel price, travelers, and any reserve or stop assumptions.";
  if (slug === "ev-charging-cost-calculator") return "Enter battery capacity, starting and ending charge, charging efficiency, electricity rate, and miles added.";
  if (slug === "recipe-cost-calculator") return "Enter ingredient, packaging, labor, and overhead costs for the full batch, then add the serving count.";
  if (/roof|deck|fence|concrete|gravel|mulch|wallpaper|tile|drywall|paint|sod|stair|string|board-foot|paver|retaining|topsoil|pond|french-drain|asphalt|shingle|stud-wall|insulation|pipe-volume|gutter|ramp-slope/.test(slug)) return "Measure the project, enter the dimensions in the units shown, and add the waste, spacing, coverage, or material settings that apply.";
  if (/hvac|ac-tonnage/.test(slug)) return "Enter the conditioned area, ceiling or climate details, and the heat-load adjustments shown in the form.";
  if (/wire-size|voltage-drop|ohms-law|led-resistor/.test(slug)) return "Enter the known electrical values with the correct units, then check the proposed current, voltage, resistance, or wire result.";
  if (/battery|ups-runtime|solar-battery|solar-panel|generator-wattage/.test(slug)) return "Enter the rated capacity or power, expected load, losses, and safety allowance from the equipment labels or plan.";
  if (slug === "speaker-box-volume-calculator") return "Enter the enclosure dimensions and subtract the driver, port, bracing, and panel displacement.";
  if (slug === "projector-throw-distance-calculator") return "Enter the projector throw ratio and desired image or screen size, then compare the placement range with the room.";
  if (/tv-viewing|screen-ppi/.test(slug)) return "Enter the screen diagonal and its pixel resolution or viewing preference using the units shown.";
  if (/pallet-loading|shipping-dimensional/.test(slug)) return "Enter the package and pallet dimensions, weight, height limit, and carrier divisor where requested.";
  if (/aquarium|pool-volume/.test(slug)) return "Enter the inside length, width, and water depth, then choose the shape and displacement assumptions.";
  if (slug === "sewing-fabric-yardage-calculator") return "Enter each piece size, quantity, fabric width, and extra allowance for pattern direction or waste.";
  if (slug === "coffee-ratio-calculator") return "Enter the brew-water amount, preferred water-to-coffee ratio, and number of servings.";
  if (/pizza-dough|sourdough|bread-hydration/.test(slug)) return "Enter the flour or dough target, hydration, starter or yeast, salt, and batch size shown above.";
  if (/turkey-thaw|meat-cooking/.test(slug)) return "Choose the food type or thawing method, enter the weight and start time, and check the planned finish window.";
  if (slug === "cake-pan-size-converter") return "Enter the original and new pan shapes and dimensions, then compare their areas before scaling the batter.";
  if (slug === "yeast-converter") return "Enter the yeast amount and choose the source and target yeast types and units.";
  if (slug === "rice-water-ratio-calculator") return "Choose the rice type and cooking method, then enter the dry rice amount and desired servings.";
  if (slug === "cocktail-dilution-calculator") return "Enter the spirit volumes and ABV values, then choose a dilution target for stirring or shaking.";
  if (slug === "unit-converter") return "Choose a measurement category, source unit, target unit, and value.";
  if (slug === "px-to-rem-converter") return "Enter the pixel value and the page's root font size to calculate the matching rem value.";
  if (slug === "hex-to-rgb-converter") return "Enter a HEX color to see its RGB, RGBA, HSL, and CSS-ready values.";
  if (slug === "timestamp-converter") return "Choose Unix seconds, Unix milliseconds, or a date string, then enter the timestamp or date to convert.";
  if (slug === "aspect-ratio-calculator") return "Enter the original width and height, then add a new width to calculate the matching height.";
  if (slug === "twitch-bits-to-usd-converter") return "Enter the number of Twitch Bits to calculate the standard creator value in US dollars.";
  if (slug === "youtube-rpm-calculator") return "Enter the view count and estimated RPM. Add actual revenue to calculate the RPM from a real result.";
  if (slug === "propane-usage-calculator") return "Enter the appliance BTU rate, daily use, tank size, planning period, and propane price.";
  return `Enter the information requested by the ${plainName(tool)} and check that every unit or option matches your source.`;
}

function exportInstruction(tool: Tool) {
  const slug = tool.slug;
  if (/gamepad|touchscreen|domain-age|camera-shutter/.test(slug)) return "Repeat the test once if the result looks unusual, then record the final reading you want to keep.";
  if (slug === "stopwatch") return "Record the final time or lap values you need, then reset the stopwatch before timing a new activity.";
  if (slug === "countdown-timer") return "Pause or reset the countdown when needed. Set a new duration before starting another timer.";
  if (slug === "dice-roller") return "Use the total and individual die values shown in the latest roll. Clear the history before a separate session if needed.";
  if (slug === "coin-flip") return "Use the heads, tails, and streak totals shown for the latest set of flips. Reset before a separate session if needed.";
  if (slug === "random-number-generator") return "Copy the generated numbers you need, or generate a fresh set with the same range and options.";
  if (/image|pdf|psd|mp3|dwg|stl|qr-code|favicon|jpg-to-png|png-to-jpg|webp-to-jpg|svg-to-png/.test(slug)) return "Preview the finished file, then download it. Open the download once to make sure it has the expected size and content.";
  if (/construction-estimate|wedding-seating|photography-contract/.test(slug)) return "Edit any remaining details, then print, save as PDF, or copy the finished document.";
  if (/counter|checker|tester/.test(tool.name.toLowerCase())) return "Copy or download the result if you need a record of the check.";
  if (/calculator|converter|counter|checker|tester/.test(tool.name.toLowerCase())) return "Change one input at a time to compare another case, then copy or save the result you plan to use.";
  return "Check the output against the source, then copy or download the finished result.";
}

function reviewInstruction(tool: Tool) {
  const slug = tool.slug;
  if (slug.includes("name-generator")) return "Read the full batch aloud and remove names that are hard to say, too close to an existing name, or disconnected from the cue. Change the style or format for a different direction.";
  if (/gamepad|touchscreen/.test(slug)) return "Repeat the same movement across the full test area. A problem that appears in the same place on each pass is more useful than a single missed input.";
  if (slug === "camera-shutter-count-checker") return "Check the reported camera model, capture date, metadata field, and shutter count. Try another original photo if the count is missing.";
  if (/image-(resizer|compressor|cropper)|jpg-to-png|png-to-jpg|webp-to-jpg|svg-to-png|image-to-base64/.test(slug)) return "Check the preview, dimensions, format, and file size before downloading. Open the saved image once to make sure it works.";
  if (slug === "pdf-merger") return "Check that every source file is present and arranged in the correct page order before downloading the merged PDF.";
  if (slug === "pdf-splitter") return "Check the selected page range or the number of separate pages before downloading the split PDF files.";
  if (slug === "bank-statement-pdf-to-csv-converter") return "Review the detected transaction rows, dates, descriptions, amounts, and balances before downloading the CSV.";
  if (slug === "psd-to-png-converter") return "Check the flattened preview and image dimensions before downloading the PNG. Open the saved image once to make sure it works.";
  if (slug === "mp3-to-midi-converter") return "Review the detected notes and timing before downloading the MIDI file. A clean single-note recording produces the most useful result.";
  if (slug === "dwg-to-pdf-converter") return "Check the drawing bounds and visible geometry in the preview before opening the print dialog.";
  if (slug === "stl-to-g-code-converter") return "Review the layer height, movement speed, outline coordinates, and printer commands before downloading the draft G-code.";
  if (slug === "css-gradient-generator") return "Check the gradient preview, colors, type, and angle before copying the CSS declaration.";
  if (slug === "remove-duplicate-lines-online") return "Review the remaining lines and removed count. Check the trim and letter-case options if an expected line is missing.";
  if (slug === "domain-age-checker") return "Check the registration date, calculated age, registrar, and RDAP status. Registration records may be unavailable or incomplete.";
  if (slug === "readability-score-checker") return "Review the reading-ease score, grade level, sentence length, and difficult-word count. Revise the text and run the check again to compare it.";
  if (slug === "text-diff-checker") return "Review every added, removed, and changed line. Confirm that formatting-only changes are intentional.";
  if (/json|yaml|xml|sql|html|css|javascript|code-beautifier|regex|jwt|base64|url-encoder|binary|markdown|csv|csp|nginx|hreflang|robots|chmod|cidr|subnet/.test(slug)) return `Review ${resultLabel(tool)}. Check syntax, escaping, and edge cases against the source before using the result in a live project.`;
  if (slug === "stopwatch") return "Review the elapsed time and lap history before resetting the stopwatch.";
  if (slug === "countdown-timer") return "Check the remaining time and timer status. Keep the tab open if you need the completion alert.";
  if (slug === "dice-roller") return "Review the individual dice, modifier, total, and roll history before rolling again.";
  if (slug === "coin-flip") return "Review the latest flips, heads and tails totals, and streak before flipping again.";
  if (slug === "random-number-generator") return "Review the range, quantity, and repeat setting with the generated numbers before using them.";
  if (/calculator/.test(tool.name.toLowerCase())) return `Review ${resultLabel(tool)}. Check the inputs and units before relying on the result.`;
  if (/generator|builder/.test(tool.name.toLowerCase())) return `Review ${resultLabel(tool)}. Edit anything that does not fit, or change the controls and generate another version.`;
  if (/converter/.test(tool.name.toLowerCase())) return `Compare the converted result with the source. Check the selected direction, format, and options before copying it.`;
  if (/counter|checker|tester/.test(tool.name.toLowerCase())) return `Review ${resultLabel(tool)}. Repeat the check with the same input if the result looks unexpected.`;
  return `Review ${resultLabel(tool)}. If the result seems wrong, check the entered values, units, and optional settings.`;
}

const exactExamples: Record<string, string> = {
  "gamepad-tester": "A controller with stick drift may show an axis value that keeps moving or never settles close to 0 while the stick is untouched.",
  "touchscreen-dead-zone-tester": "If every grid square turns green except the same narrow patch after two passes, that patch may be missing touch input.",
  "camera-shutter-count-checker": "A recent JPEG copied straight from a camera card may contain an ImageNumber or ShutterCount tag that an edited copy no longer has.",
  "roof-pitch-rafter-calculator": "A roof with a 12-foot run and 6-foot rise has a 6-in-12 pitch. Add the building length and overhang to estimate rafter length and roof area.",
  "deck-material-calculator": "For a 16-by-12-foot deck, enter the board face width, gap, joist spacing, and waste percentage to estimate decking and fasteners.",
  "regex-tester": "Use (normal)\\s+(tools) with the gi flags to find both words regardless of case and inspect each capture group.",
  "base64-encoder": "Encode a short Unicode string, copy the Base64 result, then decode it again to confirm that accented characters and emoji survive the round trip.",
  "jwt-decoder": "Paste a token beginning with eyJ to inspect its alg, sub, iat, and exp claims. The decoded payload is readable even when the signature has not been verified.",
  "cron-expression-generator": "A weekday schedule at 9:00 AM commonly produces 0 9 * * 1-5. Confirm the scheduler's timezone before using it.",
  "domain-age-checker": "Enter example.com to retrieve its public registration event and calculate the elapsed years, months, and days.",
  "uuid-generator": "Generate 25 UUID v4 values for test records, fixture data, or database identifiers, then copy the batch as one value per line.",
  "hash-generator": "Hash the same text twice with SHA-256. Identical input produces the same digest, while a one-character change produces a different value.",
  "color-picker": "Choose #267047 to see its matching RGB and HSL forms, then copy the version your stylesheet or design file needs.",
  "css-gradient-generator": "Combine two HEX colors at 135 degrees, preview the blend, and copy the resulting linear-gradient declaration.",
  "timestamp-converter": "Convert Unix timestamp 0 to see the start of the Unix epoch in UTC and in your local timezone.",
  "aspect-ratio-calculator": "Enter 1920 by 1080 to get 16:9, then set a new width of 1280 to calculate the matching 720 pixel height.",
  "binary-converter": "Convert the text A to binary to get 01000001, then reverse the conversion to check the original character.",
  "word-counter": "Paste a draft article to check its word count, sentence count, reading time, and speaking time before publishing or recording it.",
  "character-counter": "Paste a social caption to compare characters with spaces, characters without spaces, bytes, words, and platform limits.",
  "podcast-name-generator": "Enter internet culture, choose an investigative voice, and compare clean titles with more editorial names before copying a shortlist.",
  "band-name-generator": "Enter noisy romantic, choose a dreamy energy, and mix two-word names with short phrases and coined words.",
  "dnd-name-generator": "Enter exiled fire mage, choose tiefling, and generate full names or names with an epithet for a player character or NPC.",
  "clan-name-generator": "Enter tactical FPS, choose cyber, and generate short clan names with readable two-to-four-character tags.",
  "percentage-calculator": "Enter 25 as the part and 200 as the whole to calculate 12.5 percent. You can also compare 80 and 100 to find a 25 percent increase.",
  "loan-calculator": "A $25,000 loan at 7.5 percent for five years can be compared with the same loan plus an extra monthly payment.",
  "mortgage-calculator": "Enter a $450,000 home price, $90,000 down payment, interest rate, taxes, insurance, and HOA to estimate the full monthly payment.",
  "tip-calculator": "For an $86 dinner, compare an 18 percent and 20 percent tip, then divide the total among four people.",
  "sales-tax-calculator": "Add 7 percent tax to a $100 subtotal, or reverse a $107 tax-inclusive total to recover the original subtotal.",
  "discount-calculator": "Apply a 25 percent discount to an $80 item to get a $60 sale price, then add a second discount if the promotion stacks.",
  "compound-interest-calculator": "Compare a $10,000 starting balance at 6 percent with and without a $200 monthly contribution over ten years.",
  "bmi-calculator": "Enter 180 pounds and 5 feet 8 inches to calculate BMI and its standard screening range.",
  "age-calculator": "Enter a birth date and today's date to see exact age, total days lived, and the time until the next birthday.",
  "unit-converter": "Convert 10 kilometers to miles, 72 Fahrenheit to Celsius, or 5 gallons to liters without changing pages.",
  "image-resizer": "Resize a 2400 by 1600 pixel photo to 1200 by 800 while preserving its 3:2 aspect ratio.",
  "image-compressor": "Open a large JPEG, compare 80 percent and 60 percent quality, and download the smallest version that still looks acceptable.",
  "pdf-merger": "Add a cover page, invoice, and receipt PDF in that order, then merge them into one document.",
  "pdf-splitter": "Extract pages 3 through 7 from a long PDF, or export every page as a separate file.",
  "json-formatter": "Paste minified JSON such as {\"name\":\"Normal Tools\",\"live\":true} and format it with readable indentation.",
  "json-validator": "Paste JSON with a missing comma or closing brace to locate the parse error before using it in an API request.",
  "time-zone-converter": "Convert a 3:00 PM meeting from New York to London, then check whether the destination falls on a different date.",
  "date-difference-calculator": "Compare January 31 with March 1 to see calendar months and days separately from the total day count.",
  "stopwatch": "Start the timer for a workout and press Lap after each interval while the main clock keeps running.",
  "countdown-timer": "Set 25 minutes for a focus session, pause if the session stops, and use full-screen digits across the room.",
  "dice-roller": "Roll 2d6+3 to see both die results, the modifier, and the final total.",
  "coin-flip": "Flip 100 virtual coins to compare heads and tails while keeping the full toss history.",
  "color-palette-generator": "Start with #267047 and compare analogous, complementary, and triadic palettes before copying the HEX values.",
  "markdown-preview": "Type a heading, list, link, and inline code to check the rendered HTML before copying it into a page or note.",
  "construction-estimate-generator": "Create a kitchen estimate with 24 labor hours at $65, one $1,450 material line, tax, and overhead, then print the finished total as a PDF.",
  "bank-statement-pdf-to-csv-converter": "Open a text-based monthly statement, inspect the detected date, description, and amount columns, then download the transactions as CSV.",
  "psd-to-png-converter": "Choose a PSD with a composite preview and export that flattened appearance as a PNG for a browser, message, or quick review.",
  "mp3-to-midi-converter": "Use a clean recording of a single-note melody, then export the detected pitches and timing as an experimental MIDI file.",
  "dwg-to-pdf-converter": "Open a compatible 2D DWG, check the drawing bounds in the preview, then use the browser print dialog to save a PDF.",
  "stl-to-g-code-converter": "Choose an ASCII STL, set a 0.2 mm layer height, and inspect the outline moves before sending anything to a printer.",
  "wedding-seating-chart-builder": "Paste 72 guests, set eight seats per table, and review nine table lists before printing the chart.",
  "photography-contract-generator": "Enter a wedding date, venue, $2,500 fee, $500 retainer, and six-week delivery period to create an editable agreement draft.",
  "yaml-validator": "Paste YAML with one list item indented at the wrong level to find the line that breaks the document structure.",
  "favicon-generator": "Enter the letter N, choose a green background and white foreground, then download 32, 180, and 512 pixel PNG versions.",
  "code-beautifier": "Paste compressed JSON, JavaScript, CSS, HTML, XML, or SQL, choose its language, and compare the indented result with the source.",
  "twitch-bits-to-usd-converter": "Enter 1,000 Bits to calculate the standard $10 creator value. The viewer's purchase price can be different.",
  "jpg-to-png-converter": "Open a JPEG product photo and export a PNG copy when an editor, upload form, or design file requires PNG format.",
  "png-to-jpg-converter": "Convert a transparent PNG to JPEG by choosing a white background and testing the quality setting before downloading.",
  "youtube-rpm-calculator": "Enter 250,000 views and a $4.50 RPM to estimate revenue, or enter actual earnings to calculate the channel's effective RPM.",
  "propane-usage-calculator": "Enter a 40,000 BTU appliance, daily run time, tank size, propane energy value, and price to estimate runtime and refill cost.",
  "jsonpath-tester": "Run $.store.book[*].title against a sample catalog to return every matching title with its full path.",
  "csv-delimiter-converter": "Convert a comma-separated export to tabs for a spreadsheet while preserving commas and line breaks inside quoted cells.",
  "image-cropper": "Open a landscape photo, choose a 1:1 crop, set the crop rectangle, and download a square copy without changing the original.",
  "image-to-base64-converter": "Choose a small PNG icon and copy its data:image/png;base64 value into CSS, HTML, or a test fixture.",
  "svg-to-png-converter": "Paste a self-contained SVG with a 400 by 240 viewBox, set the PNG width to 1200 pixels, and keep the background transparent.",
  "webp-to-jpg-converter": "Open a WebP image, choose a white background for transparent areas, set JPEG quality, and download a more widely compatible copy.",
  "csv-viewer": "Open a product CSV, search for one SKU, and sort the price column to inspect the data without importing it into a spreadsheet.",
  "airbnb-host-payout-calculator": "Enter a $180 nightly rate for three nights, a $75 cleaning fee, the host service fee, and your cleaning and operating costs to estimate the payout and profit.",
  "patreon-earnings-calculator": "Enter $2,000 in monthly member revenue, 100 members, and the applicable platform, processing, and fixed fees to estimate take-home earnings.",
  "kdp-royalty-calculator": "Enter a $14.99 list price, the royalty rate, print or delivery cost, and 100 sales to estimate royalty per sale and total royalties.",
  "kickstarter-fee-calculator": "Enter $20,000 in pledges, 300 backers, failed pledges, platform and payment fees, and fulfillment costs to estimate net campaign funds.",
  "twitch-subscription-revenue-calculator": "Enter the Tier 1, Tier 2, Tier 3, and Prime subscription counts, then apply the channel's revenue share to estimate monthly subscription revenue.",
  "redbubble-profit-calculator": "Enter the product base price, artist markup, account fee, customer discount, and quantity to estimate artist margin and total profit.",
  "teespring-profit-calculator": "Enter the sale price, base product cost, discount, payment fee, and quantity to estimate profit per item and for the full order.",
  "fourthwall-profit-calculator": "Enter the selling price, base cost, discount, payment fee, and quantity to estimate creator profit per item and total profit.",
  "shopify-break-even-roas-calculator": "Enter average order value, product cost, shipping subsidy, payment and app fees, handling cost, and target margin to calculate break-even and target ROAS.",
};

function exampleFor(tool: Tool) {
  const slug = tool.slug;
  const name = plainName(tool);
  if (exactExamples[slug]) return exactExamples[slug];
  if (/(^|-)(fee|profit|payout|royalty|earnings|revenue)(-|$)/.test(slug)) return `For the ${name}, try a $40 sale, $12 product cost, and $5 shipping expense. Replace the sample fee rate with the rate shown by the platform.`;
  if (slug.includes("roas")) return "Enter product revenue and contribution costs to find the ad spend that reduces profit to zero, then set a higher target ROAS for a profit buffer.";
  if (slug.includes("concrete")) return "Enter a 12 by 10 foot slab at 4 inches thick, then compare the required 60 pound and 80 pound bag counts.";
  if (["gravel-calculator", "mulch-calculator", "topsoil-calculator"].includes(slug)) return `Use the ${name} for a 20-by-10-foot area at the planned depth, then add waste before ordering bags, yards, or tons.`;
  if (slug.includes("paint")) return "Enter the wall lengths, ceiling height, doors, windows, coats, and paint coverage to estimate gallons without counting openings as painted area.";
  if (slug === "tile-calculator-with-waste") return "Measure a 12-by-10-foot surface, enter the tile dimensions, and add a waste allowance for cuts and breakage.";
  if (slug === "paver-calculator") return "Measure a 12-by-10-foot surface, enter the paver dimensions, and add a waste allowance for cuts and breakage.";
  if (slug.includes("drywall")) return "Enter the room walls and ceiling, choose the sheet size, and include waste to estimate sheets, screws, tape, and compound.";
  if (slug.includes("fence")) return "For a 120-foot fence, enter panel or picket width, post spacing, rail count, and gate openings before estimating materials.";
  if (slug.includes("sod")) return "Measure the lawn sections, total their square footage, and add waste to estimate rolls or pallets of sod.";
  if (slug.includes("stair")) return "Enter the total rise and desired tread depth to compare riser count, exact rise, run, angle, and stringer length.";
  if (slug.includes("board-foot")) return "A board 1 inch thick, 8 inches wide, and 10 feet long contains 6.67 board feet before multiplying by quantity and price.";
  if (slug.includes("wallpaper")) return "Enter wall width and height, roll dimensions, and pattern repeat to estimate strips and whole rolls.";
  if (slug.includes("retaining-wall")) return "Enter wall length, height, block face size, base depth, and drainage zone to estimate blocks, caps, gravel, and geogrid.";
  if (slug.includes("pond-liner")) return "A 10 by 8 foot pond that is 3 feet deep needs extra liner on both sides for depth and edge overlap.";
  if (slug.includes("french-drain")) return "Enter trench length, width, depth, and pipe diameter to estimate gravel volume, fabric area, and pipe length.";
  if (slug.includes("asphalt")) return "Use driveway length, width, compacted depth, asphalt density, and price per ton to estimate material and truckloads.";
  if (slug.includes("shingle")) return "Enter total roof area and waste to convert square feet into roofing squares, bundles, underlayment, nails, and ridge caps.";
  if (slug.includes("stud-wall")) return "Enter wall length, height, and 16-inch or 24-inch stud spacing to estimate studs, plates, blocking, and lumber length.";
  if (slug.includes("insulation")) return "Enter the wall or attic area, subtract openings, choose package coverage, and add waste to estimate batts, rolls, or bags.";
  if (/hvac|ac-tonnage/.test(slug)) return `Use the ${name} for a 1,500 square foot conditioned space, then adjust for climate, ceiling height, windows, and occupancy.`;
  if (slug.includes("pipe-volume")) return "Enter the pipe's inside diameter and run length to calculate cubic volume, gallons, liters, and water weight.";
  if (slug.includes("gutter")) return "Enter roof drainage area, pitch, and rainfall intensity to estimate runoff, gutter size, and downspout count.";
  if (slug.includes("ramp-slope")) return "A 24-inch rise at a 1:12 ratio requires 24 feet of run before accounting for landings.";
  if (slug.includes("wire-size")) return "Enter a 30-amp load, system voltage, one-way run length, phase, and voltage-drop target to estimate copper wire gauge.";
  if (slug.includes("voltage-drop")) return "Compare wire gauges for the same current and distance to see how resistance changes voltage at the load and power lost in the cable.";
  if (slug.includes("ohms-law")) return "Enter 12 volts and 6 ohms to calculate 2 amps and 24 watts using Ohm's law.";
  if (slug.includes("led-resistor")) return "For a 5-volt supply and a 2-volt LED at 20 mA, calculate the series resistance and choose a standard resistor with enough power rating.";
  if (slug.includes("speaker-box")) return "Enter the inside enclosure dimensions, then subtract the driver, port, and bracing displacement to find net internal volume.";
  if (slug.includes("projector-throw")) return "Use a 1.5 throw ratio and a 100-inch 16:9 image to estimate lens distance and screen dimensions.";
  if (/ups-runtime|battery-runtime/.test(slug)) return "Enter battery voltage and capacity with a 300-watt load, then account for usable capacity and efficiency for a more realistic runtime estimate.";
  if (slug.includes("solar-panel")) return "A 6 kW array with 5.2 peak sun hours and 18 percent system losses can be converted into daily, monthly, and annual energy estimates.";
  if (slug.includes("solar-battery")) return "Enter daily watt-hour use, days of autonomy, system voltage, depth of discharge, and losses to estimate battery capacity.";
  if (slug.includes("generator-wattage")) return "Add the running watts of every device, include the largest motor startup surge, then add headroom before choosing a generator size.";
  if (slug.includes("tv-viewing")) return "Enter a 65-inch 4K television and compare the simple diagonal rule with the chosen field-of-view distance.";
  if (slug.includes("screen-ppi")) return "A 3840-by-2160 display with a 27-inch diagonal is about 163 PPI and has a much smaller pixel pitch than a same-size 1080p screen.";
  if (slug.includes("pallet-loading")) return "Compare 16-by-12-inch cartons in both orientations on a 48-by-40-inch pallet, then apply the maximum loaded height.";
  if (slug.includes("shipping-dimensional")) return "For an 18-by-14-by-10-inch box, divide cubic inches by the carrier's DIM divisor and compare that weight with the scale weight.";
  if (slug.includes("aquarium")) return "Use inside dimensions and the actual water height, then subtract displacement from rock and substrate to estimate usable gallons.";
  if (slug.includes("pool-volume")) return "Enter a 24 by 12 foot rectangular pool with a 4 foot average depth to estimate gallons, water weight, and fill time.";
  if (slug.includes("sewing-fabric")) return "Lay out eight 24-by-18-inch pieces across 44-inch fabric, then add extra yardage for one-way print direction and shrinkage.";
  if (slug.includes("coffee-ratio")) return "For 500 grams of water at a 16:1 ratio, use 31.25 grams of coffee before adjusting grind and strength to taste.";
  if (slug.includes("pizza-dough")) return "Set four 260 gram dough balls at 65 percent hydration to calculate the flour, water, salt, yeast, and oil for the batch.";
  if (slug.includes("sourdough")) return "Enter the target flour, hydration, starter percentage, and salt to scale one loaf or a full batch by baker's percentage.";
  if (slug.includes("bread-hydration")) return "Combine 500 grams flour, 350 grams water, and 100 grams of 100 percent hydration starter to calculate true dough hydration.";
  if (slug.includes("turkey-thaw")) return "Enter a 16-pound frozen turkey and compare refrigerator thawing with the faster cold-water method before choosing a start time.";
  if (slug.includes("meat-cooking")) return "Choose the cut and doneness, enter its weight and oven start time, then use the finish window as a planning estimate rather than a temperature reading.";
  if (slug.includes("cake-pan")) return "Compare a 9-inch round pan with a 9-by-13-inch pan to calculate the batter multiplier from surface area.";
  if (slug.includes("yeast-converter")) return "Convert 7 grams of instant yeast into active dry or fresh yeast, then switch the output between grams, teaspoons, and ounces.";
  if (slug.includes("rice-water")) return "Enter 2 cups of jasmine rice and choose the stovetop method to estimate water, cooked yield, servings, and timing.";
  if (slug.includes("cocktail-dilution")) return "Enter 2 ounces of 40 percent spirit plus the other ingredients, then add a dilution target to estimate final volume and ABV.";
  if (slug.includes("json-to-csv")) return "Paste an array of flat JSON objects to create CSV headers from the object keys and quote commas inside cell values.";
  if (slug.includes("csv-to-json")) return "Paste a CSV header and two data rows to produce an array of JSON objects with matching property names.";
  if (slug.includes("yaml-to-json")) return "Paste a small YAML mapping with a list, then inspect the formatted JSON structure before copying it.";
  if (slug.includes("xml-formatter")) return "Paste a compact XML document to check that tags close correctly and view the same document with readable indentation.";
  if (slug.includes("sql-formatter")) return "Paste a long SELECT statement with joins and conditions to put major SQL clauses on separate lines.";
  if (slug.includes("minifier")) return `Paste a readable source file into the ${name}, compare the before and after byte counts, then test the minified output in its normal environment.`;
  if (slug.includes("url-encoder")) return "Encode a query value containing spaces, an ampersand, or Unicode, then decode it to check the original text.";
  if (slug.includes("html-encoder")) return "Encode <strong>Tea & Coffee</strong> to display it as text rather than HTML, then decode the entities when needed.";
  if (slug.includes("slug-generator")) return "Turn Summer Menu: Coffee & Tea into summer-menu-coffee-tea, or paste several titles to create one slug per line.";
  if (slug.includes("px-to-rem")) return "With a 16 pixel root size, 24 pixels converts to 1.5rem. Change the root if the site's base font size is different.";
  if (slug.includes("hex-to-rgb")) return "Convert #267047 to its RGB and HSL equivalents, then copy the CSS-ready value.";
  if (slug.includes("case-converter")) return "Paste My New Project and compare title case, sentence case, camelCase, snake_case, and kebab-case outputs.";
  if (slug.includes("readability")) return "Paste a product page or article draft to compare reading ease, grade level, sentence length, and difficult-word counts.";
  if (slug.includes("text-diff")) return "Paste an original paragraph on the left and its revision on the right to see added, removed, and changed lines.";
  if (slug.includes("robots")) return "Enter example.com, allow normal crawling, and confirm that the generated sitemap line points to https://example.com/sitemap.xml.";
  if (slug.includes("csp-header")) return "Start with a self-only policy, then add the exact CDN or font origins the page needs rather than allowing every source.";
  if (slug.includes("nginx-redirect")) return "Map /old-page to https://example.com/new-page and generate a 301 rule for a permanent move.";
  if (slug.includes("hreflang")) return "Enter en-US, en-GB, es, and x-default versions of the same page to generate a reciprocal hreflang set.";
  if (slug.includes("utm-link")) return "Add source=newsletter, medium=email, and campaign=summer_launch to a landing-page URL, then copy the encoded campaign link.";
  if (slug.includes("chmod")) return "Select read, write, and execute for the owner plus read and execute for everyone else to produce chmod 755.";
  if (/cidr|subnet/.test(slug)) return `Enter 192.168.1.0/24 in the ${name} to inspect the mask, network range, broadcast address, and usable hosts.`;
  if (slug.includes("password-generator")) return "Generate a 20-character password with upper- and lowercase letters, numbers, and symbols, then regenerate if it must be entered on another device.";
  if (slug.includes("qr-code")) return "Enter a full HTTPS link, generate the QR image, then scan the downloaded code with another device before printing it.";
  if (slug.includes("lorem-ipsum")) return "Generate three paragraphs for a page mockup or 20 words for a compact card without copying filler from another site.";
  if (slug.includes("remove-duplicate")) return "Paste a list containing repeated email domains or product SKUs, then choose case-sensitive or trimmed matching before removing duplicates.";
  if (slug.includes("markdown-table")) return "Paste tab-separated headings and rows from a spreadsheet to create a Markdown table with escaped cell separators.";
  if (slug.includes("bulk-meta")) return "Paste page titles and descriptions in bulk, then review character length and edit any result that reads poorly in search results.";
  if (slug.includes("number-to-words")) return "Convert 1,245.50 into words for a check, invoice, or form, with currency mode enabled when needed.";
  if (slug.includes("roman-numeral")) return "Convert 2026 to MMXXVI, or enter XIV to get 14 and check the numeral's structure.";
  if (slug.includes("random-number")) return "Generate 10 unique integers between 1 and 100 for a draw, sample, or test dataset.";
  if (slug.includes("gpa")) return "Enter a 3-credit course at 4.0 and a 4-credit course at 3.0 to calculate the credit-weighted semester GPA.";
  if (slug.includes("grade-calculator")) return "Enter completed assignment weights and scores, then add the final exam weight to find the score needed for a target course grade.";
  if (slug.includes("calorie")) return "Enter age, weight, height, sex factor, and activity level to compare estimated maintenance calories with modest loss or gain targets.";
  if (slug.includes("fuel-trip")) return "For a 600-mile trip at 30 MPG and $3.50 per gallon, estimate fuel cost and divide it among the travelers.";
  if (slug.includes("ev-charging")) return "Charge a 75 kWh battery from 20 to 80 percent at a $0.16 electricity rate, including charging losses, to estimate session cost.";
  if (slug.includes("recipe-cost")) return "Add $28 ingredients, $4 packaging, $22 labor, and $6 overhead for 12 servings to calculate batch and per-serving cost.";
  return `Use a small, familiar input first in the ${name}. Compare the result with a known value, then replace it with the real data for your task.`;
}

function usesFor(tool: Tool): [string, string, string] {
  const purpose = lowerFirst(trimSentence(tool.shortDescription));
  const exact: Record<string, [string, string, string]> = {
    "gamepad-tester": ["check controller buttons and triggers", "find analog-stick drift or a bad axis", "test a used gamepad before keeping it"],
    "touchscreen-dead-zone-tester": ["find unresponsive areas on a phone or tablet", "check a screen protector or recent repair", "compare touch coverage before and after a restart"],
    "camera-shutter-count-checker": ["check a used camera before purchase", "record shutter actuations before service", "confirm image-count metadata before resale"],
    "podcast-name-generator": ["name a new podcast", "rename an existing show", "build titles for a limited series or recurring segment"],
    "band-name-generator": ["name a band or solo project", "test names against a genre and mood", "build a shortlist before handle and trademark checks"],
    "dnd-name-generator": ["name a player character", "create NPC names during preparation", "match a fantasy name to ancestry and backstory"],
    "clan-name-generator": ["name a gaming clan or guild", "create a short, readable team tag", "match a group name to a game's tone"],
    "stopwatch": ["time an activity", "record lap times", "compare repeated attempts"],
    "countdown-timer": ["time a focused work session", "track a cooking or practice interval", "run a visible countdown on another screen"],
    "dice-roller": ["roll dice for a tabletop game", "apply a modifier to a roll", "keep a short history of recent rolls"],
    "coin-flip": ["make a simple random choice", "flip several coins at once", "track heads, tails, and streaks"],
    "random-number-generator": ["draw numbers from a chosen range", "create a unique sample without repeats", "generate test values"],
  };
  if (exact[tool.slug]) return exact[tool.slug];
  const directUse = purpose;
  const type = tool.name.toLowerCase();
  if (/calculator|estimator/.test(type)) return [directUse, "compare results after changing one input", "save an estimate for planning or comparison"];
  if (/converter/.test(type)) return [directUse, "compare the converted result with the source", "prepare the output for another task or program"];
  if (/generator|builder/.test(type)) return [directUse, "change the controls to produce a different result", "copy a useful result into the project it belongs to"];
  if (/formatter|beautifier|minifier|validator/.test(type)) return [directUse, "check source text for structural or syntax problems", "prepare a clean version for testing or reuse"];
  if (/counter|checker|tester/.test(type)) return [directUse, "repeat the check after changing the input", "save a result for later reference"];
  return [directUse, "compare the result with the original input", "copy or save the finished output for later use"];
}

function keywordsFor(tool: Tool) {
  const base = plainName(tool).toLowerCase();
  const values = [base, `online ${base}`, `free ${base}`];
  if (base.includes(" calculator")) values.push(base.replace(" calculator", " estimator"));
  if (base.includes(" converter")) values.push(base.replace(" converter", " conversion"));
  if (base.includes(" checker")) values.push(base.replace(" checker", " check"));
  if (base.includes(" tester")) values.push(base.replace(" tester", " test"));
  if (base.includes(" generator")) values.push(base.replace(" generator", " ideas"));
  return [...new Set(values)];
}

function textVariant(tool: Tool) {
  return [...tool.slug].reduce((total, character) => total + character.charCodeAt(0), 0) % 5;
}

export function getToolSeoContent(tool: Tool): ToolSeoContent {
  const name = tool.slug === "remove-duplicate-lines-online" ? "Remove Duplicate Lines tool" : plainName(tool);
  const uses = usesFor(tool);
  const purpose = lowerFirst(trimSentence(tool.slug === "qr-code-generator"
    ? "Create and download a QR code for text or a URL."
    : tool.shortDescription));
  const openings = [
    `The ${name} lets you ${purpose}. The controls cover only the inputs needed for the result.`,
    `Use the ${name} to ${purpose}. The result changes when you adjust the values or options above.`,
    `${name} helps you ${purpose}. The input and result appear together for easy comparison.`,
    `Use the ${name} to ${purpose}. Change the inputs to compare another result.`,
    `Use the ${name} to ${purpose}. Each control affects a specific part of the result.`,
  ];
  const variant = textVariant(tool);
  return {
    steps: [
      inputInstruction(tool),
      reviewInstruction(tool),
      exportInstruction(tool),
    ],
    about: [openings[variant], `You can also use it to ${uses[1]}.`],
    example: exampleFor(tool),
    uses,
    keywords: keywordsFor(tool),
  };
}
