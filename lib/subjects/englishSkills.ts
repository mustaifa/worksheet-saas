/**
 * English skills for the curriculum book (Common Core ELA, grades 1–12).
 * Rule-based generators where the rules are reliable (ABC order, plurals,
 * possessives, comparatives, rhyme schemes, anagrams); curated banks for
 * everything that needs judgement (see englishSkillBanks.ts).
 */
import { Topic, Gen, Difficulty, makeHelpers, skillTopic as T } from "./types";
import { bankGen, mixGen } from "./bank";
import * as K from "./englishSkillBanks";
import { pastTense } from "./english";

const by = <V,>(d: Difficulty, v: Record<Difficulty, V>): V => v[d];

export const ENGLISH_SKILL_TOPICS: Topic[] = [
  // ---- foundational
  T("vowel_sounds", "Short & Long Vowel Sounds", ["short vowel", "long vowel", "silent e", "vowel teams"], "Hearing short and long vowels, the silent-e rule and common vowel teams like ai, ee and oa."),
  T("digraphs_blends", "Digraphs & Blends", ["digraph", "blend", "sh ch th", "consonant blend"], "Letter pairs that make one sound (sh, ch, th) and blends where you hear each letter (bl, st, str)."),
  T("syllables", "Counting Syllables", ["syllable", "clap syllables"], "Breaking words into syllables by their vowel sounds."),
  T("abc_order", "Alphabetical Order", ["abc order", "alphabetical order", "alphabetize"], "Putting words in ABC order, including words that start with the same letter."),
  // ---- grammar
  T("plural_nouns", "Plural Nouns (Regular & Irregular)", ["plural", "plurals", "irregular plural"], "Making nouns plural with -s, -es and -ies, and learning irregular plurals like children and mice."),
  T("pronouns", "Pronouns", ["pronoun", "he she they", "reflexive pronoun"], "Using personal, possessive and reflexive pronouns in place of nouns."),
  T("possessives", "Possessive Nouns", ["possessive", "apostrophe s", "possessive noun"], "Using apostrophes to show ownership with singular and plural nouns."),
  T("contractions", "Contractions", ["contraction", "apostrophe"], "Joining two words into one with an apostrophe, and expanding contractions back."),
  T("compound_words", "Compound Words", ["compound word"], "Joining two small words into one and using the parts to work out the meaning."),
  T("irregular_verbs", "Irregular Past-Tense Verbs", ["irregular verb", "past tense irregular", "past participle"], "Past tense and past participle forms of common irregular verbs like go–went–gone."),
  T("comparatives", "Comparative & Superlative Adjectives", ["comparative", "superlative", "er est", "more most"], "Comparing with -er/-est and more/most, including spelling changes and irregular forms."),
  T("conjunctions", "Conjunctions", ["conjunction", "and but or", "correlative conjunction"], "Joining ideas with and, but, or, so, because and correlative pairs like either/or."),
  T("articles", "Articles: A or An", ["a or an", "article"], "Choosing a or an by the first sound of the next word."),
  T("subject_verb", "Subject–Verb Agreement", ["subject verb agreement", "agreement"], "Matching singular and plural subjects with the right verb form."),
  T("relative_pronouns", "Relative Pronouns", ["relative pronoun", "who whose whom which that"], "Using who, whose, whom, which, that, where and when to join ideas."),
  T("verb_tenses_adv", "Progressive & Perfect Tenses", ["progressive tense", "perfect tense", "present perfect", "past perfect"], "Forming and naming progressive and perfect tenses, and fixing tense shifts."),
  T("fragments_runons", "Fragments & Run-On Sentences", ["fragment", "run-on", "comma splice"], "Spotting incomplete sentences and run-ons, and fixing them."),
  T("pronoun_usage", "Pronoun Case & Clarity", ["pronoun case", "vague pronoun", "pronoun shift", "intensive pronoun"], "Choosing subject or object pronouns and fixing vague or shifting pronouns."),
  T("phrases_clauses", "Phrases & Clauses", ["phrase", "clause", "dependent clause", "independent clause"], "Telling phrases from clauses and naming independent, dependent and noun, adjective and adverb clauses."),
  T("misplaced_modifiers", "Misplaced & Dangling Modifiers", ["misplaced modifier", "dangling modifier"], "Finding describing words and phrases in the wrong place and fixing them."),
  T("verbals", "Verbals: Gerunds, Participles & Infinitives", ["gerund", "participle", "infinitive", "verbal"], "Verb forms used as nouns, adjectives and adverbs."),
  T("active_passive", "Active & Passive Voice", ["active voice", "passive voice"], "Recognizing and rewriting sentences in the active and passive voice."),
  T("verb_moods", "Verb Moods", ["verb mood", "subjunctive", "imperative mood", "conditional"], "Indicative, imperative, interrogative, conditional and subjunctive moods."),
  T("parallelism", "Parallel Structure", ["parallel structure", "parallelism"], "Keeping items in a list or comparison in the same grammatical form."),
  // ---- mechanics
  T("capitalization", "Capitalization", ["capital letter", "capitalize", "proper noun"], "Capitalizing sentence starts, names, places, days, months, holidays and titles."),
  T("homophones", "Homophones", ["homophone", "their there they're", "to too two"], "Choosing between words that sound the same but have different meanings and spellings."),
  T("commas_quotes", "Commas & Quotation Marks", ["comma", "quotation marks", "dialogue punctuation"], "Commas in lists, dates, addresses, introductions and compound sentences, and punctuating dialogue."),
  T("punctuation_adv", "Semicolons, Colons, Dashes & Hyphens", ["semicolon", "colon", "dash", "hyphen", "ellipsis"], "Using semicolons, colons, dashes, hyphens and ellipses correctly."),
  T("confused_words", "Commonly Confused Words", ["affect effect", "fewer less", "commonly confused words"], "Word pairs that trip up writers, such as affect/effect, fewer/less and lay/lie."),
  // ---- vocabulary
  T("prefix_suffix", "Prefixes & Suffixes", ["prefix", "suffix"], "Using prefixes and suffixes to work out and build new words."),
  T("roots", "Greek & Latin Roots", ["greek root", "latin root", "root word"], "Common Greek and Latin roots and how they unlock the meaning of new words."),
  T("context_clues", "Context Clues", ["context clue", "word meaning from context"], "Working out the meaning of unknown words from the words around them."),
  T("shades_meaning", "Shades of Meaning & Connotation", ["shades of meaning", "connotation", "denotation"], "Ordering words by strength and telling positive, negative and neutral connotations apart."),
  T("figurative_language", "Figurative Language", ["figurative language", "simile", "metaphor", "hyperbole"], "Similes, metaphors, personification, hyperbole, onomatopoeia and alliteration — and what they mean."),
  // ---- reading literature
  T("story_elements", "Story Elements: Character, Setting & Plot", ["story elements", "character", "setting", "plot", "conflict"], "Characters, setting, plot, conflict and resolution, and how stories are built."),
  T("point_of_view", "Point of View", ["point of view", "first person", "third person", "narrator"], "First, second and third person, limited and omniscient narrators, and why point of view matters."),
  T("themes", "Theme & Moral", ["theme", "moral", "lesson of the story"], "Finding the lesson or message of fables and short stories, and telling a theme from a topic."),
  T("poetry_terms", "Poetry Elements", ["poetry", "stanza", "haiku", "limerick", "sonnet"], "Stanzas, rhyme, rhythm, meter and poem forms like haiku, limerick and sonnet."),
  T("rhyme_scheme", "Rhyme Scheme", ["rhyme scheme", "aabb", "abab"], "Labelling the pattern of rhymes at the ends of lines with letters (AABB, ABAB, ABCB...)."),
  T("tone_mood", "Tone & Mood", ["tone", "mood", "author attitude"], "Telling the author's tone from the mood a passage creates, and naming both."),
  // ---- reading informational
  T("main_idea", "Main Idea & Supporting Details", ["main idea", "supporting detail", "topic sentence"], "Finding the main idea of a short passage and the details that support it."),
  T("fact_opinion", "Fact & Opinion", ["fact or opinion", "fact and opinion"], "Telling statements that can be proven from statements of belief or feeling."),
  T("author_purpose", "Author's Purpose", ["author's purpose", "persuade inform entertain", "pie"], "Deciding whether a text is written to inform, persuade or entertain, and spotting bias."),
  T("text_features", "Text Features", ["text features", "glossary", "index", "caption", "table of contents"], "Using headings, captions, glossaries, indexes, diagrams and other features to find information."),
  T("text_structure", "Text Structure", ["text structure", "cause and effect", "compare and contrast", "problem and solution"], "Recognizing sequence, cause and effect, compare and contrast, problem and solution, and description."),
  T("argument_claims", "Claims, Evidence & Counterclaims", ["claim", "evidence", "counterclaim", "argument"], "Telling claims, evidence, reasoning and counterclaims apart in an argument."),
  T("rhetoric", "Rhetorical Appeals & Devices", ["ethos pathos logos", "rhetorical appeal", "rhetorical device"], "Ethos, pathos and logos, and devices such as rhetorical questions, repetition and antithesis."),
  T("fallacies", "Logical Fallacies", ["logical fallacy", "fallacy", "ad hominem", "straw man"], "Spotting faulty reasoning such as bandwagon, ad hominem, straw man and slippery slope."),
  // ---- writing & research
  T("transitions", "Transition Words", ["transition words", "linking words"], "Choosing transitions that show order, addition, contrast, examples and cause and effect."),
  T("sources", "Sources, Credibility & Citation", ["primary source", "secondary source", "credible source", "plagiarism"], "Primary and secondary sources, judging credibility, and giving credit to avoid plagiarism."),
  // ---- challenge
  T("challenge_anagrams", "Challenge: Anagram Puzzles", ["anagram", "unscramble"], "Unscramble the letters to find the word — a clue helps narrow it down."),
  T("challenge_riddles", "Challenge: Word Riddles", ["riddle", "word riddle"], "Classic riddles that play with the double meanings of words."),
];

// ===================================================================== word study
const genSyllables: Gen = (grade, diff, rng) => {
  const { pick } = makeHelpers(rng);
  const pool = K.SYLLABLE_WORDS.filter(([, n]) => by(diff, { easy: n <= 2, medium: n >= 2 && n <= 3, hard: n >= 3 }));
  const [w, n] = pick(pool);
  return { q: `How many syllables are in the word '${w}'?`, a: `${n}` };
};

const ABC_WORDS = [
  "apple", "ant", "arm", "ball", "bear", "book", "boat", "cat", "cake", "cloud", "corn", "dog", "duck", "door", "egg", "elf", "fish", "frog",
  "fox", "goat", "game", "grape", "hat", "hen", "house", "ice", "ink", "jam", "jet", "kite", "king", "lamp", "leaf", "lion", "moon", "milk",
  "mouse", "nest", "nose", "owl", "orange", "pig", "pen", "plant", "queen", "rain", "rock", "rose", "sun", "star", "ship", "snow", "tree",
  "tiger", "train", "top", "umbrella", "van", "vase", "wind", "wolf", "web", "yak", "yarn", "zoo", "zebra",
];
const genAbcOrder: Gen = (grade, diff, rng) => {
  const { pick, randInt } = makeHelpers(rng);
  const n = by(diff, { easy: 3, medium: 4, hard: 5 });
  let words: string[] = [];
  if (diff === "easy") {
    // different first letters
    while (words.length < n) { const w = pick(ABC_WORDS); if (!words.some((x) => x[0] === w[0])) words.push(w); }
  } else {
    // at least two words share a first letter, so the second letter decides
    const letter = pick(["b", "c", "f", "g", "h", "l", "m", "p", "r", "s", "t", "w"]);
    const same = ABC_WORDS.filter((w) => w[0] === letter);
    const k = Math.min(same.length, diff === "hard" ? randInt(3, 4) : 2);
    while (words.length < k) { const w = pick(same); if (!words.includes(w)) words.push(w); }
    while (words.length < n) { const w = pick(ABC_WORDS); if (!words.includes(w)) words.push(w); }
  }
  // Fisher–Yates so the order is the same in every JS engine for a given seed
  const shuffled = [...words];
  for (let i = shuffled.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; }
  if (shuffled.join() === [...words].sort((a, b) => a.localeCompare(b)).join()) shuffled.reverse();
  return { q: `Put these words in ABC order: ${shuffled.join(", ")}`, a: [...words].sort((a, b) => a.localeCompare(b)).join(", ") };
};

// ===================================================================== grammar (rule-based)
const REGULAR_NOUNS = ["cat", "dog", "book", "tree", "car", "hat", "pen", "girl", "boy", "frog", "cup", "star"];
const ES_NOUNS = ["bus", "box", "fox", "dish", "wish", "church", "brush", "glass", "lunch", "watch", "dress", "bench"];
const Y_NOUNS = ["baby", "city", "puppy", "story", "berry", "lady", "party", "pony", "family", "cherry"];
const VOWEL_Y_NOUNS = ["day", "boy", "toy", "key", "monkey", "turkey", "tray"];
function plural(w: string): string {
  if (/(s|x|z|ch|sh)$/.test(w)) return `${w}es`;
  if (/[^aeiou]y$/.test(w)) return `${w.slice(0, -1)}ies`;
  return `${w}s`;
}
const genPlurals: Gen = (grade, diff, rng) => {
  const { pick } = makeHelpers(rng);
  const r = rng();
  if (diff === "easy" || (diff === "medium" && r < 0.6) || (diff === "hard" && r < 0.3)) {
    const w = pick(diff === "easy" ? (rng() < 0.6 ? REGULAR_NOUNS : ES_NOUNS) : [...ES_NOUNS, ...Y_NOUNS, ...VOWEL_Y_NOUNS]);
    return { q: `Write the plural of '${w}'.`, a: plural(w) };
  }
  const [s, p] = pick(K.IRREGULAR_PLURALS);
  return rng() < 0.75 ? { q: `Write the plural of '${s}'.`, a: p } : { q: `Write the singular of '${p}'.`, a: s };
};

const OWNERS_SING = ["dog", "girl", "teacher", "cat", "boy", "bird", "baby", "farmer"];
const OWNERS_PLUR = ["dogs", "girls", "teachers", "cats", "boys", "birds", "farmers", "players"];
const OWNERS_IRREG: [string, string][] = [["children", "children's"], ["men", "men's"], ["women", "women's"], ["people", "people's"], ["mice", "mice's"]];
const THINGS = ["toy", "book", "ball", "hat", "bowl", "bike", "coat", "nest"];
const genPossessives: Gen = (grade, diff, rng) => {
  const { pick } = makeHelpers(rng);
  const kind = pick(by(diff, { easy: ["sing"], medium: ["sing", "plural"], hard: ["plural", "irreg", "names", "plural"] }));
  const thing = pick(THINGS);
  if (kind === "sing") { const o = pick(OWNERS_SING); return { q: `Rewrite using a possessive: 'the ${thing} that belongs to the ${o}'`, a: `the ${o}'s ${thing}` }; }
  if (kind === "plural") { const o = pick(OWNERS_PLUR); return { q: `Rewrite using a possessive: 'the ${thing}s that belong to the ${o}'`, a: `the ${o}' ${thing}s` }; }
  if (kind === "irreg") { const [o, p] = pick(OWNERS_IRREG); return { q: `Rewrite using a possessive: 'the ${thing}s that belong to the ${o}'`, a: `the ${p} ${thing}s` }; }
  const name = pick(["James", "Chris", "Lucas", "Ross"]);
  return { q: `Write the possessive form of the name '${name}' (one person): '___ ${thing}'`, a: `${name}'s ${thing} (${name}' ${thing} is also accepted in some style guides)` };
};

const genContractions: Gen = (grade, diff, rng) => {
  const { pick } = makeHelpers(rng);
  const pool = diff === "easy" ? K.CONTRACTIONS.slice(0, 10) : K.CONTRACTIONS;
  const [full, short] = pick(pool);
  return rng() < (diff === "hard" ? 0.5 : 0.7) ? { q: `Write the contraction for '${full}'.`, a: short } : { q: `What two words make the contraction '${short}'?`, a: full };
};

const genIrregularVerbs: Gen = (grade, diff, rng) => {
  const { pick } = makeHelpers(rng);
  const pool = diff === "easy" ? K.IRREGULAR_VERBS.slice(0, 15) : K.IRREGULAR_VERBS;
  const [base, past, pp] = pick(pool);
  if (diff === "hard" && rng() < 0.5) return { q: `Complete with the past participle: 'I have ___ (${base}).'`, a: pp };
  if (diff !== "easy" && rng() < 0.3) return { q: `'${pastTense(base)}' is not a real word. What is the correct past tense of '${base}'?`, a: past };
  return { q: `Write the past tense of '${base}'.`, a: past };
};

type Adj = [string, string, string];
const ADJ_RULE: Adj[] = [
  ["tall", "taller", "tallest"], ["fast", "faster", "fastest"], ["small", "smaller", "smallest"], ["cold", "colder", "coldest"], ["loud", "louder", "loudest"],
  ["nice", "nicer", "nicest"], ["large", "larger", "largest"], ["wide", "wider", "widest"],
  ["big", "bigger", "biggest"], ["hot", "hotter", "hottest"], ["sad", "sadder", "saddest"], ["thin", "thinner", "thinnest"],
  ["happy", "happier", "happiest"], ["funny", "funnier", "funniest"], ["busy", "busier", "busiest"], ["easy", "easier", "easiest"],
];
const ADJ_MORE: Adj[] = [["beautiful", "more beautiful", "most beautiful"], ["careful", "more careful", "most careful"], ["interesting", "more interesting", "most interesting"], ["important", "more important", "most important"], ["delicious", "more delicious", "most delicious"]];
const ADJ_IRREG: Adj[] = [["good", "better", "best"], ["bad", "worse", "worst"], ["many", "more", "most"], ["little (amount)", "less", "least"], ["far", "farther", "farthest"]];
const genComparatives: Gen = (grade, diff, rng) => {
  const { pick } = makeHelpers(rng);
  const pool = by(diff, { easy: ADJ_RULE.slice(0, 8), medium: ADJ_RULE, hard: [...ADJ_RULE.slice(8), ...ADJ_MORE, ...ADJ_IRREG] });
  const [base, comp, sup] = pick(pool);
  const which = rng() < 0.5 ? "comparative" : "superlative";
  if (diff !== "easy" && !ADJ_IRREG.some((x) => x[0] === base) && rng() < 0.35) {
    return which === "comparative"
      ? { q: `Complete: 'This one is ___ than that one.' (${base})`, a: comp }
      : { q: `Complete: 'This is the ___ one of all.' (${base})`, a: sup };
  }
  return which === "comparative" ? { q: `Write the comparative form of '${base}' (comparing two).`, a: comp } : { q: `Write the superlative form of '${base}' (comparing three or more).`, a: sup };
};

const genArticles: Gen = (grade, diff, rng) => {
  const { pick } = makeHelpers(rng);
  const lvl = by(diff, { easy: [1], medium: [1, 2], hard: [2, 3, 3] });
  const [w, a] = pick(K.ARTICLE_WORDS.filter((x) => lvl.includes(x[2])));
  return { q: `Write a or an: '___ ${w}'`, a: `${a} ${w}` };
};

// ===================================================================== poetry
// Families must not rhyme with each other, or the scheme letters would be wrong.
const RHYME_FAMILIES = [
  ["cat", "hat", "mat", "bat"], ["day", "play", "say", "way"], ["night", "light", "bright", "kite"], ["tree", "see", "free", "bee"],
  ["moon", "soon", "spoon", "tune"], ["cold", "gold", "old", "bold"], ["rain", "train", "plain", "chain"], ["sky", "high", "fly", "why"],
  ["sing", "ring", "king", "spring"], ["door", "floor", "more", "roar"], ["sun", "fun", "run", "done"],
];
const genRhymeScheme: Gen = (grade, diff, rng) => {
  const { pick } = makeHelpers(rng);
  const patterns = by(diff, { easy: ["AABB", "ABAB"], medium: ["AABB", "ABAB", "ABCB", "ABBA"], hard: ["ABCB", "ABBA", "AABBA", "ABABCC"] });
  const pat = pick(patterns);
  const letters = [...new Set(pat.split(""))];
  const fams: string[][] = [];
  while (fams.length < letters.length) { const f = pick(RHYME_FAMILIES); if (!fams.includes(f)) fams.push(f); }
  const used = new Map<string, number>();
  const ends = pat.split("").map((L) => { const f = fams[letters.indexOf(L)]; const i = used.get(L) ?? 0; used.set(L, i + 1); return f[i % f.length]; });
  return { q: `A poem's lines end with these words, in order: ${ends.join(" / ")}. What is the rhyme scheme?`, a: pat };
};

// ===================================================================== challenge
const genAnagrams: Gen = (grade, diff, rng) => {
  const { pick } = makeHelpers(rng);
  const lvl = by(diff, { easy: [1], medium: [1, 2], hard: [2, 3] });
  const [w, clue] = pick(K.ANAGRAM_WORDS.filter((x) => lvl.includes(x[2])));
  let s = w;
  for (let tries = 0; tries < 20 && s === w; tries++) {
    const a = w.split("");
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    s = a.join("");
  }
  if (s === w) s = w.split("").reverse().join("");
  return { q: `Unscramble the letters: ${s.toUpperCase()} (clue: ${clue})`, a: w };
};

export const ENGLISH_SKILL_GENERATORS: Record<string, Gen> = {
  vowel_sounds: bankGen(K.VOWEL_SOUNDS),
  digraphs_blends: bankGen(K.DIGRAPHS_BLENDS),
  syllables: genSyllables,
  abc_order: genAbcOrder,
  plural_nouns: genPlurals,
  pronouns: bankGen(K.PRONOUNS),
  possessives: genPossessives,
  contractions: genContractions,
  compound_words: bankGen(K.COMPOUND_WORDS),
  irregular_verbs: genIrregularVerbs,
  comparatives: genComparatives,
  conjunctions: bankGen(K.CONJUNCTIONS),
  articles: genArticles,
  subject_verb: bankGen(K.SUBJECT_VERB),
  relative_pronouns: bankGen(K.RELATIVE_PRONOUNS),
  verb_tenses_adv: bankGen(K.VERB_TENSES_ADV),
  fragments_runons: bankGen(K.FRAGMENTS_RUNONS),
  pronoun_usage: bankGen(K.PRONOUN_USAGE),
  phrases_clauses: bankGen(K.PHRASES_CLAUSES),
  misplaced_modifiers: bankGen(K.MISPLACED_MODIFIERS),
  verbals: bankGen(K.VERBALS),
  active_passive: bankGen(K.ACTIVE_PASSIVE),
  verb_moods: bankGen(K.VERB_MOODS),
  parallelism: bankGen(K.PARALLELISM),
  capitalization: bankGen(K.CAPITALIZATION),
  homophones: bankGen(K.HOMOPHONES),
  commas_quotes: bankGen(K.COMMAS_QUOTES),
  punctuation_adv: bankGen(K.PUNCTUATION_ADV),
  confused_words: bankGen(K.CONFUSED_WORDS),
  prefix_suffix: bankGen(K.PREFIX_SUFFIX),
  roots: bankGen(K.ROOTS),
  context_clues: bankGen(K.CONTEXT_CLUES),
  shades_meaning: bankGen(K.SHADES_MEANING),
  figurative_language: bankGen(K.FIGURATIVE_LANG),
  story_elements: bankGen(K.STORY_ELEMENTS),
  point_of_view: bankGen(K.POINT_OF_VIEW),
  themes: bankGen(K.THEMES),
  poetry_terms: bankGen(K.POETRY_TERMS),
  rhyme_scheme: mixGen(genRhymeScheme, 0.85, K.POETRY_TERMS),
  tone_mood: bankGen(K.TONE_MOOD),
  main_idea: bankGen(K.MAIN_IDEA),
  fact_opinion: bankGen(K.FACT_OPINION),
  author_purpose: bankGen(K.AUTHOR_PURPOSE),
  text_features: bankGen(K.TEXT_FEATURES),
  text_structure: bankGen(K.TEXT_STRUCTURE),
  argument_claims: bankGen(K.ARGUMENT_CLAIMS),
  rhetoric: bankGen(K.RHETORIC),
  fallacies: bankGen(K.FALLACIES),
  transitions: bankGen(K.TRANSITIONS),
  sources: bankGen(K.SOURCES),
  challenge_anagrams: genAnagrams,
  challenge_riddles: bankGen(K.RIDDLES),
};

