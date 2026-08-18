export type NameKind = "podcast" | "band" | "dnd" | "clan";

type Option = [value: string, label: string];

export const nameGeneratorControls: Record<NameKind, {
  cueLabel: string;
  cuePlaceholder: string;
  styleLabel: string;
  styles: Option[];
  formatLabel: string;
  formats: Option[];
}> = {
  podcast: {
    cueLabel: "What is the show about?",
    cuePlaceholder: "e.g. internet culture, architecture, true crime",
    styleLabel: "Voice",
    styles: [["smart", "Smart"], ["casual", "Conversational"], ["investigative", "Investigative"], ["playful", "Playful"]],
    formatLabel: "Naming style",
    formats: [["mixed", "Best mix"], ["clean", "Clean & direct"], ["editorial", "Editorial"], ["conceptual", "Conceptual"]],
  },
  band: {
    cueLabel: "Genre, mood, or reference",
    cuePlaceholder: "e.g. dream pop, Detroit techno, noisy romantic",
    styleLabel: "Energy",
    styles: [["indie", "Indie"], ["dark", "Dark"], ["dreamy", "Dreamy"], ["electronic", "Electronic"], ["raw", "Raw"]],
    formatLabel: "Name shape",
    formats: [["mixed", "Best mix"], ["two-word", "Two words"], ["phrase", "Short phrase"], ["coined", "Invented word"]],
  },
  dnd: {
    cueLabel: "Character cue",
    cuePlaceholder: "e.g. exiled fire mage, charming thief, sea captain",
    styleLabel: "Ancestry",
    styles: [["human", "Human"], ["elf", "Elf"], ["dwarf", "Dwarf"], ["orc", "Orc"], ["tiefling", "Tiefling"]],
    formatLabel: "Name type",
    formats: [["mixed", "Best mix"], ["full", "First & family"], ["first", "First name only"], ["titled", "Name & epithet"]],
  },
  clan: {
    cueLabel: "Game, play style, or identity",
    cuePlaceholder: "e.g. tactical FPS, stealth, chaotic friends",
    styleLabel: "Energy",
    styles: [["tactical", "Tactical"], ["mythic", "Mythic"], ["cyber", "Cyber"], ["dark", "Dark"], ["chaotic", "Chaotic"]],
    formatLabel: "Name shape",
    formats: [["mixed", "Best mix"], ["short", "Short"], ["full", "Full name"], ["tagged", "Name + tag"]],
  },
};

function seededRandom(seed: number) {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let next = value;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(items: T[], random: () => number): T {
  return items[Math.floor(random() * items.length)];
}

function titleWords(value: string) {
  return value
    .trim()
    .replace(/[^a-zA-Z0-9' -]+/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 5)
    .map((word) => word.length <= 3 && /^(and|the|for|of|in|on|to)$/i.test(word)
      ? word.toLowerCase()
      : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function compactCue(value: string) {
  const stop = new Set(["a", "an", "and", "for", "from", "in", "of", "on", "the", "to", "with"]);
  return titleWords(value).split(" ").filter((word) => !stop.has(word.toLowerCase())).slice(0, 2).join(" ");
}

const podcastBanks = {
  smart: {
    adjectives: ["Clear", "Hidden", "Second", "Working", "Useful", "Open", "Sharp", "Common"],
    nouns: ["Draft", "Signal", "Index", "Context", "Practice", "Method", "Question", "Footnote"],
    subtitles: ["A Closer Look", "In Plain Sight", "Without the Noise", "From First Principles", "The Working Theory", "Notes from the Field"],
  },
  casual: {
    adjectives: ["Honest", "Late", "Good", "Real", "Loose", "Long", "Sunday", "Side"],
    nouns: ["Chat", "Table", "Room", "Hang", "Thread", "Story", "Catch-Up", "Side Note"],
    subtitles: ["Let’s Talk About It", "One More Thing", "Between Friends", "Off the Record", "The Long Version", "Worth a Conversation"],
  },
  investigative: {
    adjectives: ["Missing", "Buried", "Untold", "False", "Cold", "Quiet", "Final", "Hidden"],
    nouns: ["File", "Record", "Lead", "Witness", "Archive", "Motive", "Trace", "Account"],
    subtitles: ["What Really Happened", "Inside the Story", "Following the Evidence", "The Unfinished Record", "Behind the Version", "A Second Look"],
  },
  playful: {
    adjectives: ["Odd", "Tiny", "Very", "Soft", "Unlikely", "Accidental", "Wrong", "Curious"],
    nouns: ["Rabbit Hole", "Side Quest", "Group Chat", "Brainstorm", "Detour", "Obsession", "Plot Twist", "Open Tab"],
    subtitles: ["No One Asked", "Hear Me Out", "It Gets Weird", "A Little Too Much", "For Some Reason", "We Need to Talk"],
  },
};

function podcastName(cueValue: string, style: string, format: string, random: () => number) {
  const cue = titleWords(cueValue);
  const bank = podcastBanks[style as keyof typeof podcastBanks] ?? podcastBanks.smart;
  const adjective = pick(bank.adjectives, random);
  const noun = pick(bank.nouns, random);
  const subtitle = pick(bank.subtitles, random);
  const fallback = pick([`${adjective} ${noun}`, `The ${noun}`, subtitle, `${noun} in Progress`], random);
  const patterns: Record<string, Array<() => string>> = {
    clean: [() => `${cue} ${noun}`, () => `The ${cue} ${noun}`, () => `${cue}, Explained`, () => `Inside ${cue}`, () => `${cue} in Practice`],
    editorial: [() => `${cue}: ${subtitle}`, () => `The ${adjective} Side of ${cue}`, () => `Notes on ${cue}`, () => `${cue}, Reconsidered`, () => `Beyond ${cue}`],
    conceptual: [() => `${adjective} ${noun}`, () => `${noun} Theory`, () => `${cue} After Hours`, () => `The ${noun} Between`, () => `${subtitle}`],
  };
  const selected = format === "mixed" ? pick(["clean", "editorial", "conceptual"], random) : format;
  if (!cue) return fallback;
  return pick(patterns[selected] ?? patterns.clean, random)();
}

const bandBanks = {
  indie: { first: ["Paper", "Sunday", "Local", "Soft", "Minor", "Public", "Little", "Modern", "Empty", "Borrowed"], second: ["Weather", "Cinema", "Letters", "Gardens", "Company", "Figures", "Season", "Houses", "Language", "Holiday"], coined: ["Velora", "Morroway", "Halflight", "Palisade", "Sundress", "Lowfield", "Marrowline", "Sonder", "Bellwether", "Everplain"] },
  dark: { first: ["Black", "Hollow", "Dead", "Night", "Cold", "Grave", "Ash", "Last", "Pale", "Silent"], second: ["Ritual", "Choir", "Mercy", "Static", "Chapel", "Teeth", "Season", "Signal", "Oath", "Machine"], coined: ["Nocturne", "Gravemind", "Vesperine", "Ashenfold", "Mordant", "Nightwell", "Sablekin", "Voidward", "Palehouse", "Tenebra"] },
  dreamy: { first: ["Velvet", "Silver", "Slow", "Blue", "Glass", "Lunar", "Soft", "Distant", "Golden", "Cloud"], second: ["Bloom", "Halo", "Cinema", "Sleep", "Orchard", "Echo", "Islands", "Flowers", "Light", "Parade"], coined: ["Veloura", "Lunelle", "Aurelia", "Somnara", "Bluevale", "Echolily", "Serein", "Halora", "Opaline", "Silvering"] },
  electronic: { first: ["Neon", "Digital", "Chrome", "Zero", "Static", "Laser", "Circuit", "Night", "Future", "Signal"], second: ["Transit", "Memory", "System", "Pulse", "Operator", "Channel", "Pattern", "Theory", "Protocol", "Phase"], coined: ["Nullex", "Chromatek", "Synthera", "Voltline", "Neonode", "Phasework", "Datara", "Modulor", "Bitcrush", "Oscilla"] },
  raw: { first: ["Cheap", "Broken", "Bad", "Concrete", "Riot", "Rust", "Loose", "Street", "Burnt", "No"], second: ["Teeth", "Permission", "Future", "Parents", "Control", "Exit", "Sleep", "Heroes", "Apology", "Witness"], coined: ["Rotmouth", "Scrapline", "Rattletrap", "Burnunit", "Cheapshot", "Riotwork", "Rustbelt", "Grindhouse", "Wreckage", "Feralist"] },
};

function bandName(cueValue: string, style: string, format: string, random: () => number) {
  const cueWords = compactCue(cueValue).split(" ").filter((word) => word.length > 3);
  const cue = cueWords.length ? pick(cueWords, random) : "";
  const bank = bandBanks[style as keyof typeof bandBanks] ?? bandBanks.indie;
  const first = pick(bank.first, random);
  const second = pick(bank.second, random);
  const patterns = {
    "two-word": [() => `${first} ${second}`, () => cue ? `${cue} ${second}` : `${first} ${second}`, () => `The ${first} ${second}`],
    phrase: [() => `${second} After Midnight`, () => `${first} in Public`, () => `No ${second}`, () => `${cue || second} on Fire`, () => `Everyone Leaves ${first}`],
    coined: [() => pick(bank.coined, random), () => `${pick(bank.coined, random)} Club`, () => `The ${pick(bank.coined, random)}`],
  };
  const selected = format === "mixed" ? pick(["two-word", "two-word", "phrase", "coined"], random) : format;
  return pick(patterns[selected as keyof typeof patterns] ?? patterns["two-word"], random)();
}

const fantasyBanks = {
  human: { starts: ["Al", "Ber", "Cor", "Ed", "Gar", "Hel", "Mar", "Ren", "The", "Wil"], middles: ["a", "en", "er", "ia", "o", "or"], ends: ["dan", "ric", "mond", "win", "ard", "eth", "en", "a"], families: ["Ashford", "Vale", "Morrow", "Blackwell", "Thorne", "Hawke", "Redmere", "Voss"] },
  elf: { starts: ["Ae", "Ela", "Fae", "Ili", "Lio", "Nae", "Sae", "Syl", "Tha", "Vae"], middles: ["l", "r", "th", "v", "n"], ends: ["ion", "ael", "ira", "eth", "orin", "iel", "ara", "yn"], families: ["Moonfall", "Silverleaf", "Dawnweaver", "Starbough", "Evenwood", "Mistvale", "Nightbloom", "Lightstep"] },
  dwarf: { starts: ["Ba", "Bro", "Da", "Dru", "Gar", "Kha", "Mor", "Or", "Tho", "Ulf"], middles: ["d", "gr", "kk", "m", "r"], ends: ["in", "ar", "ek", "un", "or", "a", "ild", "um"], families: ["Ironhand", "Deepdelver", "Stonebrow", "Emberbeard", "Coppervein", "Anvilborn", "Goldmantle", "Oathhammer"] },
  orc: { starts: ["Br", "Dr", "Gar", "Gho", "Kra", "Mog", "Rag", "Sha", "Thr", "Vor"], middles: ["a", "o", "u", "ag", "ur"], ends: ["g", "ka", "nak", "ra", "th", "ug", "ash", "ok"], families: ["Bonebreaker", "Redfang", "Ironjaw", "Stormscar", "Ashwalker", "Warsong", "Wolfblood", "Skullbrand"] },
  tiefling: { starts: ["Aza", "Bel", "Dama", "Kali", "Luci", "Mala", "Nyx", "Rava", "Sere", "Zev"], middles: ["r", "z", "th", "v", "x"], ends: ["iel", "ara", "os", "eth", "ion", "ira", "yx", "an"], families: ["Vex", "Ember", "Sable", "Mirth", "Ruin", "Mercy", "Vice", "Ash"] },
};

const epithets = ["the Ashen", "the Unbroken", "of the Low Road", "the Quiet Blade", "the Last Lantern", "Storm-Bound", "the Fox", "without a Banner", "the Oathless", "of Nine Doors"];

function fantasyFirst(style: string, random: () => number) {
  const bank = fantasyBanks[style as keyof typeof fantasyBanks] ?? fantasyBanks.human;
  return `${pick(bank.starts, random)}${pick(bank.middles, random)}${pick(bank.ends, random)}`;
}

function dndName(cueValue: string, style: string, format: string, random: () => number) {
  const bank = fantasyBanks[style as keyof typeof fantasyBanks] ?? fantasyBanks.human;
  const first = fantasyFirst(style, random);
  const cue = compactCue(cueValue);
  const cueEpithet = cue && cue.length < 22 ? `the ${cue}` : "";
  const patterns = {
    first: [() => first],
    full: [() => `${first} ${pick(bank.families, random)}`],
    titled: [() => `${first} ${random() < 0.35 && cueEpithet ? cueEpithet : pick(epithets, random)}`],
  };
  const selected = format === "mixed" ? pick(["first", "full", "full", "titled"], random) : format;
  return pick(patterns[selected as keyof typeof patterns] ?? patterns.full, random)();
}

const clanBanks = {
  tactical: { first: ["Vanguard", "Vector", "First", "Clear", "Strike", "Apex", "Delta", "Rapid", "Prime", "Dead"], second: ["Unit", "Line", "Watch", "Angle", "Order", "Team", "Point", "Sector", "Mark", "Command"] },
  mythic: { first: ["Iron", "Golden", "Last", "Wild", "Storm", "Dragon", "Raven", "Titan", "Fallen", "Sacred"], second: ["Oath", "Guard", "Legion", "Crown", "Wolves", "Keep", "Order", "Flame", "Raid", "Banner"] },
  cyber: { first: ["Zero", "Ghost", "Null", "Neon", "Black", "Proxy", "Cipher", "Static", "Chrome", "Void"], second: ["Core", "Shift", "Packet", "Signal", "Stack", "Protocol", "Node", "Grid", "Loop", "System"] },
  dark: { first: ["Night", "Grave", "Hollow", "Ash", "Blood", "Dread", "Pale", "Lost", "Black", "Silent"], second: ["Oath", "Choir", "Guard", "Hunt", "Wolves", "Veil", "Throne", "Order", "Hand", "Crows"] },
  chaotic: { first: ["Bad", "Loose", "Lucky", "No", "Tiny", "Wrong", "Wild", "Last", "Free", "Stray"], second: ["Plan", "Adults", "Aim", "Witnesses", "Rules", "Sleep", "Chance", "Problem", "Signal", "Idea"] },
};

function clanTag(name: string) {
  const words = name.replace(/[^a-zA-Z0-9 ]/g, "").split(/\s+/).filter(Boolean);
  if (words.length > 1) return words.map((word) => word[0]).join("").slice(0, 4).toUpperCase();
  const consonants = name.replace(/[^bcdfghjklmnpqrstvwxyz0-9]/gi, "");
  return (consonants || name).slice(0, 4).toUpperCase();
}

function clanName(cueValue: string, style: string, format: string, random: () => number) {
  const cue = compactCue(cueValue);
  const bank = clanBanks[style as keyof typeof clanBanks] ?? clanBanks.tactical;
  const first = pick(bank.first, random);
  const second = pick(bank.second, random);
  const base = random() < 0.2 && cue ? `${first} ${cue}` : `${first} ${second}`;
  const patterns = {
    short: [() => `${first}${second}`, () => first, () => `${first} ${second}`],
    full: [() => `${first} ${second}`, () => `The ${first} ${second}`, () => `${second} of ${first}`],
    tagged: [() => `${base} [${clanTag(base)}]`, () => `[${clanTag(base)}] ${base}`],
  };
  const selected = format === "mixed" ? pick(["short", "full", "full", "tagged"], random) : format;
  return pick(patterns[selected as keyof typeof patterns] ?? patterns.full, random)();
}

export function generateNames({ kind, cue, style, format, count = 12, seed = 1 }: {
  kind: NameKind;
  cue: string;
  style: string;
  format: string;
  count?: number;
  seed?: number;
}) {
  const random = seededRandom(seed);
  const names = new Set<string>();
  let attempts = 0;
  while (names.size < count && attempts < 1000) {
    attempts += 1;
    const generated = kind === "podcast"
      ? podcastName(cue, style, format, random)
      : kind === "band"
        ? bandName(cue, style, format, random)
        : kind === "dnd"
          ? dndName(cue, style, format, random)
          : clanName(cue, style, format, random);
    const cleaned = generated.replace(/\s+/g, " ").trim();
    if (cleaned.length >= 3 && cleaned.length <= 52) names.add(cleaned);
  }
  return [...names];
}
