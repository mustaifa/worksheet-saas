import { Topic, Gen, makeHelpers } from "./types";

export const ENGLISH_TOPICS: Topic[] = [
  { id: "phonics", label: "Letter Sounds & Rhyming", grades: [1], aliases: ["phonics", "letter sound", "rhyme", "rhyming"] },
  { id: "sight_words", label: "Sight Words", grades: [1, 2], aliases: ["sight word"] },
  { id: "nouns_verbs", label: "Nouns & Verbs", grades: [1, 2, 3], aliases: ["noun", "verb", "naming word", "action word"] },
  { id: "spelling", label: "Spelling", grades: [2, 3, 4, 5], aliases: ["spelling", "spell the word", "correct spelling"] },
  { id: "punctuation", label: "Punctuation", grades: [2, 3, 4, 5], aliases: ["punctuation", "comma", "period", "question mark"] },
  { id: "grammar_tenses", label: "Verb Tenses", grades: [3, 4, 5, 6], aliases: ["verb tense", "past tense", "future tense", "present tense"] },
  { id: "synonyms_antonyms", label: "Synonyms & Antonyms", grades: [3, 4, 5, 6, 7, 8], aliases: ["synonym", "antonym", "opposite", "same meaning"] },
  { id: "parts_of_speech", label: "Parts of Speech", grades: [4, 5, 6, 7], aliases: ["part of speech", "adjective", "adverb", "preposition"] },
  { id: "idioms", label: "Idioms & Expressions", grades: [5, 6, 7, 8, 9], aliases: ["idiom", "expression means"] },
  { id: "analogies", label: "Analogies", grades: [6, 7, 8, 9, 10], aliases: ["analogy", "is to as"] },
  { id: "vocabulary", label: "Vocabulary Building", grades: [6, 7, 8, 9, 10, 11, 12], aliases: ["vocabulary", "define", "word meaning"] },
  { id: "sentence_types", label: "Sentence Structure", grades: [7, 8, 9, 10], aliases: ["sentence structure", "simple sentence", "compound sentence", "complex sentence"] },
  { id: "literary_devices", label: "Literary Devices", grades: [8, 9, 10, 11, 12], aliases: ["literary device", "metaphor", "simile", "personification", "alliteration"] },
  { id: "grammar_advanced", label: "Advanced Grammar", grades: [9, 10, 11, 12], aliases: ["subject verb agreement", "clause", "grammar rule"] },
  { id: "reading_comprehension", label: "Reading Comprehension", grades: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], aliases: ["reading comprehension", "reading passage", "comprehension"] },
];

function pickAndFormat<T>(rng: () => number, arr: T[]): T {
  const { randInt } = makeHelpers(rng);
  return arr[randInt(0, arr.length - 1)];
}

// ---------- word banks ----------
const LETTER_WORDS: [string, string][] = [
  ["cat", "c"], ["dog", "d"], ["fish", "f"], ["ball", "b"], ["sun", "s"], ["moon", "m"],
  ["tree", "t"], ["house", "h"], ["car", "c"], ["apple", "a"], ["egg", "e"], ["ice", "i"],
];
const RHYME_PAIRS: [string, string[]][] = [
  ["cat", ["hat", "bat", "mat", "rat"]], ["dog", ["log", "fog", "jog"]], ["sun", ["fun", "run", "bun"]],
  ["tree", ["bee", "see", "free"]], ["ball", ["fall", "tall", "wall"]], ["pig", ["big", "wig", "dig"]],
];
const SIGHT_WORDS = ["the", "and", "was", "you", "they", "have", "said", "were", "there", "because", "again", "friend", "people", "would", "could"];
const NOUN_VERB_SENTENCES: [string, string, "noun" | "verb"][] = [
  ["The dog runs fast.", "dog", "noun"], ["The dog runs fast.", "runs", "verb"],
  ["She reads a book.", "book", "noun"], ["She reads a book.", "reads", "verb"],
  ["Birds fly south.", "Birds", "noun"], ["Birds fly south.", "fly", "verb"],
  ["The children played outside.", "children", "noun"], ["The children played outside.", "played", "verb"],
  ["My teacher writes on the board.", "teacher", "noun"], ["My teacher writes on the board.", "writes", "verb"],
];
const SPELLING_WORDS = [
  ["recieve", "receive"], ["definately", "definitely"], ["seperate", "separate"], ["occured", "occurred"],
  ["begining", "beginning"], ["neccessary", "necessary"], ["accomodate", "accommodate"], ["wich", "which"],
  ["freind", "friend"], ["thier", "their"], ["untill", "until"], ["truely", "truly"],
  ["writting", "writing"], ["comming", "coming"], ["adress", "address"],
];
const PUNCTUATION_ITEMS: [string, string][] = [
  ["Do you like pizza___", "?"], ["What a wonderful surprise___", "!"], ["I went to the store___", "."],
  ["My favorite colors are red, blue___ and green.", ","], ["She asked, ___Are we there yet?___", '"'],
  ["It's my sister___s birthday today.", "'"], ["We need eggs, milk, and bread___", "."],
];
const REGULAR_VERBS = ["walk", "jump", "play", "cook", "clean", "watch", "paint", "climb", "dance", "listen", "help", "laugh", "talk", "wash", "smile"];
const IRREGULAR_VERBS: [string, string, string][] = [
  ["go", "went", "will go"], ["eat", "ate", "will eat"], ["run", "ran", "will run"], ["see", "saw", "will see"],
  ["write", "wrote", "will write"], ["buy", "bought", "will buy"], ["bring", "brought", "will bring"],
  ["think", "thought", "will think"], ["catch", "caught", "will catch"], ["swim", "swam", "will swim"],
];
const SYNONYM_ANTONYM_PAIRS: [string, string, string][] = [
  // word, synonym, antonym
  ["happy", "joyful", "sad"], ["big", "large", "small"], ["fast", "quick", "slow"], ["cold", "chilly", "hot"],
  ["easy", "simple", "difficult"], ["begin", "start", "end"], ["brave", "courageous", "cowardly"],
  ["beautiful", "lovely", "ugly"], ["strong", "powerful", "weak"], ["quiet", "silent", "loud"],
  ["ancient", "old", "modern"], ["generous", "giving", "stingy"], ["genuine", "authentic", "fake"],
  ["reluctant", "hesitant", "eager"], ["abundant", "plentiful", "scarce"],
];
const PARTS_OF_SPEECH: [string, string, string][] = [
  ["The bright sun rose quickly.", "bright", "adjective"], ["The bright sun rose quickly.", "quickly", "adverb"],
  ["She walked into the room.", "into", "preposition"], ["He is very tall.", "very", "adverb"],
  ["The tiny kitten slept.", "tiny", "adjective"], ["They arrived before noon.", "before", "preposition"],
  ["The loud thunder scared us.", "loud", "adjective"], ["She sings beautifully.", "beautifully", "adverb"],
];
const IDIOMS: [string, string][] = [
  ["break the ice", "to start a conversation or ease tension"], ["piece of cake", "something very easy"],
  ["hit the books", "to study hard"], ["under the weather", "feeling sick"],
  ["spill the beans", "to reveal a secret"], ["cost an arm and a leg", "to be very expensive"],
  ["once in a blue moon", "something that rarely happens"], ["let the cat out of the bag", "to reveal a secret"],
  ["bite the bullet", "to do something difficult that can't be avoided"], ["hit the sack", "to go to bed"],
];
const ANALOGIES: [string, string, string, string][] = [
  ["bird", "sky", "fish", "water"], ["puppy", "dog", "kitten", "cat"], ["hot", "cold", "up", "down"],
  ["author", "book", "painter", "painting"], ["doctor", "hospital", "teacher", "school"],
  ["leaf", "tree", "petal", "flower"], ["finger", "hand", "toe", "foot"], ["chef", "kitchen", "pilot", "airplane"],
];
const VOCAB_WORDS: [string, string][] = [
  ["ubiquitous", "present everywhere"], ["ephemeral", "lasting a very short time"], ["candid", "honest and direct"],
  ["meticulous", "very careful and precise"], ["resilient", "able to recover quickly from difficulty"],
  ["ambiguous", "open to more than one interpretation"], ["benevolent", "kind and generous"],
  ["pragmatic", "dealing with things practically"], ["tenacious", "persistent, not giving up easily"],
  ["eloquent", "fluent and persuasive in speaking"], ["frugal", "careful with money, not wasteful"],
  ["skeptical", "having doubts, not easily convinced"], ["novice", "a beginner"], ["diligent", "hard-working and careful"],
  ["arbitrary", "based on random choice, not reason"], ["concise", "brief and clear"],
];
const LITERARY_DEVICES: [string, string][] = [
  ["The wind whispered through the trees.", "personification"], ["Her smile was as bright as the sun.", "simile"],
  ["Time is a thief.", "metaphor"], ["Peter Piper picked a peck of pickled peppers.", "alliteration"],
  ["The classroom was a zoo.", "metaphor"], ["The stars danced in the night sky.", "personification"],
  ["He was as brave as a lion.", "simile"], ["Sally sells seashells by the seashore.", "alliteration"],
];
const SENTENCE_EXAMPLES: [string, string][] = [
  ["The dog barked.", "simple"], ["I like tea, but she likes coffee.", "compound"],
  ["Although it rained, we went outside.", "complex"], ["The sun rose and the birds sang.", "compound"],
  ["She smiled because she was happy.", "complex"], ["We ran fast.", "simple"],
  ["He studied hard, so he passed the test.", "compound"], ["When the bell rang, the students left.", "complex"],
];
const GRAMMAR_ADVANCED: [string, string][] = [
  ["Neither of the boys ___ (is/are) ready.", "is"], ["Each of the students ___ (has/have) a book.", "has"],
  ["The team ___ (was/were) celebrating its win.", "was"], ["Everybody ___ (need/needs) to sign in.", "needs"],
  ["The scissors ___ (is/are) on the table.", "are"], ["The news ___ (was/were) surprising.", "was"],
];

const genPhonics: Gen = (grade, diff, rng) => {
  const { pick } = makeHelpers(rng);
  if (rng() < 0.5) { const [word, letter] = pick(LETTER_WORDS); return { q: `Which letter does "${word}" start with?`, a: letter }; }
  const [word, rhymes] = pick(RHYME_PAIRS);
  return { q: `Name a word that rhymes with "${word}".`, a: rhymes.join(" / ") };
};
const genSightWords: Gen = (grade, diff, rng) => {
  const { pick } = makeHelpers(rng);
  const word = pick(SIGHT_WORDS);
  return { q: `Spell this word out loud, then write it: "${word}"`, a: word };
};
const genNounsVerbs: Gen = (grade, diff, rng) => {
  const { pick } = makeHelpers(rng);
  const [sentence, word, type] = pick(NOUN_VERB_SENTENCES);
  return { q: `In the sentence "${sentence}", is "${word}" a noun or a verb?`, a: type };
};
const genSpelling: Gen = (grade, diff, rng) => {
  const { pick } = makeHelpers(rng);
  const [wrong, right] = pick(SPELLING_WORDS);
  return { q: `Correct the spelling: "${wrong}"`, a: right };
};
const genPunctuation: Gen = (grade, diff, rng) => {
  const { pick } = makeHelpers(rng);
  const [sentence, mark] = pick(PUNCTUATION_ITEMS);
  return { q: `What punctuation belongs in the blank? "${sentence}"`, a: mark };
};
const genGrammarTenses: Gen = (grade, diff, rng) => {
  const { pick } = makeHelpers(rng);
  if (diff !== "easy" && rng() < 0.4) {
    const [base, past, future] = pick(IRREGULAR_VERBS);
    const which = pick(["past", "future"]);
    return { q: `Change to the ${which} tense: "I ${base} to school."`, a: which === "past" ? `I ${past} to school.` : `I ${future} to school.` };
  }
  const verb = pick(REGULAR_VERBS);
  const which = pick(["past", "future"]);
  return { q: `Change to the ${which} tense: "I ${verb} every day."`, a: which === "past" ? `I ${verb}ed every day.` : `I will ${verb} every day.` };
};
const genSynonymsAntonyms: Gen = (grade, diff, rng) => {
  const { pick } = makeHelpers(rng);
  const [word, syn, ant] = pick(SYNONYM_ANTONYM_PAIRS);
  const wantSyn = rng() < 0.5;
  return wantSyn ? { q: `Give a synonym for "${word}".`, a: syn } : { q: `Give an antonym for "${word}".`, a: ant };
};
const genPartsOfSpeech: Gen = (grade, diff, rng) => {
  const { pick } = makeHelpers(rng);
  const [sentence, word, part] = pick(PARTS_OF_SPEECH);
  return { q: `In "${sentence}", what part of speech is "${word}"?`, a: part };
};
const genIdioms: Gen = (grade, diff, rng) => {
  const { pick } = makeHelpers(rng);
  const [idiom, meaning] = pick(IDIOMS);
  return { q: `What does the idiom "${idiom}" mean?`, a: meaning };
};
const genAnalogies: Gen = (grade, diff, rng) => {
  const { pick } = makeHelpers(rng);
  const [a, b, c, d] = pick(ANALOGIES);
  return { q: `${a[0].toUpperCase()}${a.slice(1)} is to ${b} as ${c} is to ___?`, a: d };
};
const genVocabulary: Gen = (grade, diff, rng) => {
  const { pick } = makeHelpers(rng);
  const [word, def] = pick(VOCAB_WORDS);
  return { q: `Define: "${word}"`, a: def };
};
const genSentenceTypes: Gen = (grade, diff, rng) => {
  const { pick } = makeHelpers(rng);
  const [sentence, type] = pick(SENTENCE_EXAMPLES);
  return { q: `Is this sentence simple, compound, or complex? "${sentence}"`, a: type };
};
const genLiteraryDevices: Gen = (grade, diff, rng) => {
  const { pick } = makeHelpers(rng);
  const [sentence, device] = pick(LITERARY_DEVICES);
  return { q: `Identify the literary device: "${sentence}"`, a: device };
};
const genGrammarAdvanced: Gen = (grade, diff, rng) => {
  const { pick } = makeHelpers(rng);
  const [sentence, answer] = pick(GRAMMAR_ADVANCED);
  return { q: `Choose the correct word: "${sentence}"`, a: answer };
};

export const ENGLISH_GENERATORS: Record<string, Gen> = {
  phonics: genPhonics, sight_words: genSightWords, nouns_verbs: genNounsVerbs,
  spelling: genSpelling, punctuation: genPunctuation, grammar_tenses: genGrammarTenses,
  synonyms_antonyms: genSynonymsAntonyms, parts_of_speech: genPartsOfSpeech, idioms: genIdioms,
  analogies: genAnalogies, vocabulary: genVocabulary, sentence_types: genSentenceTypes,
  literary_devices: genLiteraryDevices, grammar_advanced: genGrammarAdvanced,
};
