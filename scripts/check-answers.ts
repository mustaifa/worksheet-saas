// Tests for lenient answer marking used by Live Quiz and Family Challenge.
//   npx tsx scripts/check-answers.ts
import { answersMatch } from "../lib/challenge";
const T: [string, string, boolean][] = [
  ["the Arctic (cold, icy areas)", "arctic", true], ["food, water, air, or shelter (any one)", "water", true],
  ["wind, water, animals, or bursting pods (any two)", "wind and animals", true],
  ["3 (2 hydrogen, 1 oxygen)", "3", true], ["red blood cells", "white blood cells", false], ["the heart", "heart", true],
  ["simple (compound verb)", "simple", true], ["1/12", "1/12", true], ["1/12", "1 / 12", true], ["2 1/12", "2", false],
  ["adjective (even though it ends in -ly)", "adjective", true], ["a decomposer", "decomposer", true],
  ["3 : 1", "3:1", true], ["75%", "75", true], ["I will climb every day.", "I'll climb every day", true],
  ["I walked every day.", "I walked every day", true], ["She has danced all morning.", "she has danced all morning", true],
  [">", ">", true], ["<", ">", false], ["Mercury", "mercury", true], ["Venus (its thick atmosphere traps heat)", "venus", true],
];
let bad = 0; for (const [c, s, want] of T) { const got = answersMatch(c, s); if (got !== want) { bad++; console.log("✗", c, "|", s, "got", got); } }
console.log(bad ? `${bad} failures` : "all match tests pass");
if (bad) process.exit(1);
