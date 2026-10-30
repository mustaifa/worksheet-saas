/**
 * Picture-based skills for the youngest learners (Grade 1–2): counting
 * pictures, picture patterns, beginning letters, rhyming pictures and sorting
 * living and non-living things. Each question carries a `pic` spec so the
 * worksheet can draw it (lib/worksheetVisuals → picVisual); the question text
 * still makes sense on its own, except counting, which needs the picture and is
 * kept out of Live Quiz / Family Challenge (see FREE_TEXT_TOPICS).
 */
import { Topic, Gen, Difficulty, makeHelpers, skillTopic as T } from "./types";
import { ICONS, type Icon } from "../icons";

const by = <V,>(d: Difficulty, v: Record<Difficulty, V>): V => v[d];
const all = Object.values(ICONS);
/** Things a child would count one by one (not "bunches of grapes"). */
const COUNTABLE = all.filter((i) => i.word !== "grapes" && i.kind !== "nature" || ["star", "flower", "leaf", "tree", "shell", "rock", "cloud", "sun"].includes(i.word)).filter((i) => i.word !== "sun" && i.word !== "moon");
const an = (w: string) => (/^[aeiou]/.test(w) ? `an ${w}` : `a ${w}`);

export const PICTURE_MATH_TOPICS: Topic[] = [
  T("count_objects", "Count the Pictures", ["count objects", "how many", "counting pictures", "count and write"], "Counting groups of pictures one by one and writing how many there are."),
  T("picture_patterns", "Picture Patterns", ["patterns", "what comes next", "repeating pattern", "picture pattern"], "Spotting repeating picture patterns (AB, AAB, ABC…) and working out what comes next."),
];
export const PICTURE_ENGLISH_TOPICS: Topic[] = [
  T("beginning_sounds", "Beginning & Ending Letters", ["beginning sounds", "first letter", "starts with", "initial sound", "ending sound"], "Matching pictures to the letter they start (or end) with."),
  T("rhyming_pictures", "Rhyming Pictures", ["rhyming pictures", "rhymes with", "rhyming words"], "Finding the picture whose name rhymes with another — cat and hat, star and car."),
];
export const PICTURE_SCIENCE_TOPICS: Topic[] = [
  T("sort_living", "Sorting Living & Non-living Things", ["sort living", "living or non-living", "living and nonliving pictures"], "Looking at pictures of animals, plants and objects and sorting them into living and non-living."),
];

function pickDistinct(rng: () => number, pool: Icon[], n: number, ok: (i: Icon, chosen: Icon[]) => boolean): Icon[] {
  const { pick } = makeHelpers(rng);
  const out: Icon[] = [];
  for (let tries = 0; out.length < n && tries < 400; tries++) {
    const c = pick(pool);
    if (!out.includes(c) && ok(c, out)) out.push(c);
  }
  return out;
}

const shuffle = <V,>(rng: () => number, arr: V[]) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
};

export const PICTURE_GENERATORS: Record<string, Gen> = {
  count_objects: (_g, d, rng) => {
    const { randInt, pick } = makeHelpers(rng);
    const icon = pick(COUNTABLE);
    const n = by(d, { easy: randInt(3, 8), medium: randInt(6, 14), hard: randInt(11, 20) });
    return { q: `Count the ${icon.plural}. How many are there?`, a: String(n), pic: `count:${icon.word}:${n}` };
  },

  picture_patterns: (_g, d, rng) => {
    const { pick } = makeHelpers(rng);
    const unit = by(d, { easy: pick(["AB", "AB", "ABB"]), medium: pick(["AAB", "ABB", "ABC"]), hard: pick(["ABC", "AABB", "ABBC", "AABC"]) });
    const letters = [...new Set(unit.split(""))];
    const icons = pickDistinct(rng, all.filter((i) => i.word.length <= 7), letters.length, () => true);
    const map = Object.fromEntries(letters.map((l, i) => [l, icons[i].word]));
    const shown = unit.length <= 2 ? 7 : unit.length === 3 ? 8 : 9;
    const seq = Array.from({ length: shown + 1 }, (_, i) => map[unit[i % unit.length]]);
    const answer = seq.pop()!;
    return { q: `What comes next? ${seq.join(", ")}, ___`, a: answer, pic: `pattern:${seq.join(",")}` };
  },

  beginning_sounds: (_g, d, rng) => {
    const { pick } = makeHelpers(rng);
    const ending = d === "hard" || (d === "medium" && rng() < 0.35);
    const letter = (i: Icon) => (ending ? i.word[i.word.length - 1] : i.word[0]);
    const pool = all.filter((i) => i.word.length <= 8 && (!ending || !/[ey]$/.test(i.word)));
    const target = pick(pool);
    const others = pickDistinct(rng, pool, 2, (c, chosen) => letter(c) !== letter(target) && chosen.every((x) => letter(x) !== letter(c)));
    const opts = shuffle(rng, [target, ...others]).map((i) => i.word);
    return {
      q: `Which picture ${ending ? "ends" : "starts"} with the letter ${letter(target)}: ${opts[0]}, ${opts[1]}, or ${opts[2]}?`,
      a: target.word,
      pic: `pics:${opts.join(",")}`,
    };
  },

  rhyming_pictures: (_g, _d, rng) => {
    const { pick } = makeHelpers(rng);
    const families = new Map<string, Icon[]>();
    for (const i of all) if (i.rhyme) families.set(i.rhyme, [...(families.get(i.rhyme) || []), i]);
    const usable = [...families.values()].filter((f) => f.length >= 2);
    const fam = pick(usable);
    const [target, match] = shuffle(rng, fam);
    const others = pickDistinct(rng, all.filter((i) => i.rhyme !== target.rhyme && i.word.length <= 7), 2, (c) => c.word.slice(-2) !== target.word.slice(-2));
    const opts = shuffle(rng, [match, ...others]).map((i) => i.word);
    return { q: `Which picture rhymes with ${target.word}: ${opts[0]}, ${opts[1]}, or ${opts[2]}?`, a: match.word, pic: `rhyme:${target.word}|${opts.join(",")}` };
  },

  sort_living: (_g, _d, rng) => {
    const { pick } = makeHelpers(rng);
    const living = all.filter((i) => i.living);
    const nonLiving = all.filter((i) => !i.living && i.word !== "heart" && (i.kind === "thing" || ["rock", "cloud", "star", "sun", "moon"].includes(i.word)));
    const icon = rng() < 0.5 ? pick(living) : pick(nonLiving);
    return { q: `Is ${an(icon.word)} living or non-living?`, a: icon.living ? "living" : "non-living", pic: `icon:${icon.word}` };
  },
};
