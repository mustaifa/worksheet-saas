import { RNG, makeHelpers } from "./types";

export type ComprehensionPassage = {
  id: string;
  minGrade: number;
  maxGrade: number;
  title: string;
  passage: string;
  questions: { q: string; a: string }[];
};

export const PASSAGES: ComprehensionPassage[] = [
  // ---------- grades 2-3 ----------
  {
    id: "the-lost-kite",
    minGrade: 2, maxGrade: 3,
    title: "The Lost Kite",
    passage: `Mia flew her red kite at the park every Saturday. One windy day, the string snapped, and the kite sailed away over the trees. Mia felt sad and ran to find it. She looked behind the big oak tree and near the pond, but the kite was gone. Just as she was about to give up, she saw a flash of red stuck high in a bush. Mia's neighbor, Mr. Lopez, helped her reach it with a long stick. Mia was so happy to have her kite back that she gave Mr. Lopez a big thank-you card the next day.`,
    questions: [
      { q: "What color was Mia's kite?", a: "red" },
      { q: "What happened to the kite's string?", a: "it snapped" },
      { q: "Where did Mia find the kite?", a: "stuck in a bush" },
      { q: "Who helped Mia get the kite back?", a: "Mr. Lopez" },
      { q: "How did Mia feel when the kite flew away?", a: "sad" },
    ],
  },
  {
    id: "the-new-puppy",
    minGrade: 2, maxGrade: 3,
    title: "The New Puppy",
    passage: `Sam's family brought home a new puppy named Buddy. Buddy was small and brown with floppy ears. At first, Buddy was scared of loud noises and hid under the table. Sam sat quietly next to the table every day and spoke softly to Buddy. After a week, Buddy started to come out and play with Sam's ball. By the end of the month, Buddy loved running around the yard and was not scared anymore.`,
    questions: [
      { q: "What was the puppy's name?", a: "Buddy" },
      { q: "What color was Buddy?", a: "brown" },
      { q: "Why did Buddy hide under the table at first?", a: "he was scared of loud noises" },
      { q: "What did Sam do to help Buddy feel better?", a: "sat quietly and spoke softly to him" },
      { q: "How did Buddy feel by the end of the month?", a: "not scared / happy" },
    ],
  },

  // ---------- grades 4-6 ----------
  {
    id: "the-community-garden",
    minGrade: 4, maxGrade: 6,
    title: "The Community Garden",
    passage: `On an empty lot at the end of Maple Street, neighbors decided to build something together. Instead of leaving the lot full of weeds, they cleared it out and planted a community garden. Each family took care of a small section, growing tomatoes, peppers, herbs, and flowers. At first, only a few people helped, but as the garden grew, more neighbors got curious and joined in. By summer, the garden was full of color, and every Saturday morning, families gathered there to water their plants and share vegetables with each other. The garden didn't just grow food — it helped the neighbors get to know one another better than they ever had before.`,
    questions: [
      { q: "Where was the empty lot located?", a: "at the end of Maple Street" },
      { q: "What was growing in the lot before the garden?", a: "weeds" },
      { q: "Name two things the neighbors grew in the garden.", a: "tomatoes and peppers (or herbs/flowers)" },
      { q: "What day did families gather at the garden?", a: "Saturday" },
      { q: "According to the passage, what did the garden do besides grow food?", a: "helped neighbors get to know each other" },
    ],
  },
  {
    id: "the-science-fair-surprise",
    minGrade: 4, maxGrade: 6,
    title: "The Science Fair Surprise",
    passage: `Jordan had spent three weeks building a volcano model for the school science fair, using baking soda and vinegar to create a bubbling eruption. The night before the fair, Jordan tested the volcano one last time — and nothing happened. No bubbles, no eruption, just a quiet, disappointing fizz. Jordan almost gave up, but instead decided to figure out what went wrong. After checking each step, Jordan realized the baking soda had gotten wet and lost its power. With a fresh batch and only hours to spare, Jordan tried again. This time, the volcano erupted perfectly, and the next day, it was one of the most popular projects at the fair.`,
    questions: [
      { q: "What was Jordan's science fair project?", a: "a volcano model" },
      { q: "What two ingredients made the volcano erupt?", a: "baking soda and vinegar" },
      { q: "What went wrong the night before the fair?", a: "the baking soda got wet and lost its power" },
      { q: "What did Jordan do after discovering the problem?", a: "got a fresh batch of baking soda and tried again" },
      { q: "How did the project turn out at the fair?", a: "it was one of the most popular projects" },
    ],
  },

  // ---------- grades 7-9 ----------
  {
    id: "the-power-of-a-single-vote",
    minGrade: 7, maxGrade: 9,
    title: "The Power of a Single Vote",
    passage: `It's easy to assume that one vote doesn't matter much in an election with thousands of participants, but history tells a different story. In several notable elections, the outcome was decided by only a handful of votes — sometimes just one. These close results remind us that elections are, in the end, the sum of individual choices, and no single choice is guaranteed to be canceled out by someone else's. Beyond the direct effect on the outcome, voting also carries a less measurable but equally important value: participation itself signals to leaders which issues communities actually care about. Even in elections that aren't razor-thin, patterns in who votes — and who doesn't — shape which concerns politicians prioritize once in office. In this sense, a single vote does two things at once: it contributes to a final count, and it adds a small but real data point to how power listens.`,
    questions: [
      { q: "According to the passage, what do close election results remind us?", a: "elections are the sum of individual choices / one vote matters" },
      { q: "Besides deciding the outcome, what other value does voting have, according to the passage?", a: "it signals to leaders which issues communities care about" },
      { q: "What does the passage say shapes which concerns politicians prioritize?", a: "patterns in who votes and who doesn't" },
      { q: "What two things does the passage say a single vote does at once?", a: "contributes to the final count and signals what people care about" },
      { q: "Is the main idea of this passage that voting rarely matters, or that it matters more than people assume? Explain using the text.", a: "it matters more than people assume — because elections are decided by individual choices and voting patterns influence what leaders prioritize" },
    ],
  },
  {
    id: "why-bridges-sway",
    minGrade: 7, maxGrade: 9,
    title: "Why Bridges Sway",
    passage: `When engineers design a bridge, one of their biggest challenges isn't just supporting weight — it's managing motion. Wind, traffic, and even the footsteps of pedestrians create vibrations that travel through a bridge's structure. If a bridge were built to be perfectly rigid, these vibrations would have nowhere to go, and the stress could eventually cause cracks or structural failure. Instead, many modern bridges are engineered to sway slightly, allowing built-in flexibility to absorb and dissipate energy safely. This is why some suspension bridges visibly move in strong winds — that motion isn't a design flaw, but a deliberate safety feature. Engineers calculate exactly how much flexibility a bridge needs so it can bend without breaking, similar to how a tree's branches bend in a storm rather than snapping.`,
    questions: [
      { q: "According to the passage, what is one of the biggest challenges in bridge design besides supporting weight?", a: "managing motion / vibration" },
      { q: "What three things does the passage say create vibrations in a bridge?", a: "wind, traffic, and pedestrian footsteps" },
      { q: "What could happen if a bridge were built to be perfectly rigid?", a: "cracks or structural failure" },
      { q: "Why do some suspension bridges visibly move in strong winds?", a: "it's a deliberate safety feature, not a flaw" },
      { q: "What comparison does the passage use to explain why flexibility helps?", a: "a tree's branches bending in a storm instead of snapping" },
    ],
  },

  // ---------- grades 10-12 ----------
  {
    id: "the-paradox-of-choice",
    minGrade: 10, maxGrade: 12,
    title: "The Paradox of Choice",
    passage: `Conventional wisdom holds that more options lead to greater satisfaction — that a consumer choosing between thirty flavors of jam will end up happier than one choosing between six. Research in behavioral psychology complicates this assumption considerably. In a frequently cited study, shoppers presented with a smaller selection of jams were, counterintuitively, more likely to make a purchase and report higher satisfaction than those presented with an extensive selection. Psychologists attribute this to the cognitive burden of comparison: as the number of options grows, so does the mental effort required to evaluate them, along with the anxiety that a better, unchosen option might exist. This phenomenon, often termed the "paradox of choice," extends well beyond grocery aisles. It has been observed in decisions ranging from retirement fund selection to romantic partner choice, suggesting that the relationship between freedom and well-being is not simply linear. Beyond a certain threshold, additional options may impose a psychological cost that outweighs their theoretical benefit.`,
    questions: [
      { q: "What is the conventional wisdom the passage begins by describing?", a: "that more options lead to greater satisfaction" },
      { q: "In the cited study, which group of shoppers was more likely to purchase and report higher satisfaction?", a: "those with the smaller selection" },
      { q: "What two things does the passage say grow along with the number of options?", a: "the mental effort of comparison and anxiety about a better unchosen option" },
      { q: "According to the passage, in what areas beyond groceries has this phenomenon been observed?", a: "retirement fund selection and romantic partner choice" },
      { q: "What does the passage conclude about the relationship between freedom (choice) and well-being?", a: "it is not simply linear — too many options can impose a psychological cost" },
    ],
  },
  {
    id: "silent-spring-and-environmental-policy",
    minGrade: 10, maxGrade: 12,
    title: "A Turning Point in Environmental Policy",
    passage: `Public environmental awareness in the mid-twentieth century was shaped significantly by a single publication that challenged the unquestioned use of agricultural chemicals. The book documented, in accessible language, the ecological consequences of widespread pesticide use — particularly its effects on bird populations, whose declining numbers gave the work its resonant title. Critics from the chemical industry attempted to discredit both the research and its author, arguing the claims were exaggerated and economically damaging. Despite this backlash, the book's central argument gained traction with the public and, eventually, with policymakers. Within a decade, it had contributed to a broader shift in environmental regulation, including new restrictions on certain pesticides and the eventual creation of a federal agency dedicated to environmental protection. The episode is frequently cited as an example of how a single, well-researched piece of writing can reshape not just public opinion, but the machinery of government itself.`,
    questions: [
      { q: "What did the publication described in the passage document, according to the text?", a: "the ecological consequences of widespread pesticide use" },
      { q: "What gave the book its resonant title, according to the passage?", a: "declining bird populations" },
      { q: "How did critics from the chemical industry respond to the book?", a: "they tried to discredit the research and author, calling the claims exaggerated" },
      { q: "What two policy outcomes does the passage say followed within a decade?", a: "new pesticide restrictions and creation of a federal environmental agency" },
      { q: "What broader point does the passage make using this example?", a: "a single well-researched piece of writing can reshape public opinion and government policy" },
    ],
  },
];

export function pickPassageForGrade(grade: number, rng: RNG): ComprehensionPassage {
  const { pick } = makeHelpers(rng);
  const eligible = PASSAGES.filter((p) => grade >= p.minGrade && grade <= p.maxGrade);
  if (eligible.length > 0) return pick(eligible);
  // fallback: pick the closest grade band if nothing matches exactly
  const sorted = [...PASSAGES].sort(
    (a, b) => Math.abs((a.minGrade + a.maxGrade) / 2 - grade) - Math.abs((b.minGrade + b.maxGrade) / 2 - grade)
  );
  return sorted[0];
}
