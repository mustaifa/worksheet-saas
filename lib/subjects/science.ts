import { Topic, Gen, makeHelpers } from "./types";
import * as B from "./scienceBanks";
import type { BankItem } from "./scienceBanks";

export const SCIENCE_TOPICS: Topic[] = [
  { id: "living_nonliving", label: "Living vs Non-living", grades: [1, 2], aliases: ["living", "nonliving", "non-living"] },
  { id: "five_senses", label: "The Five Senses", grades: [1, 2], aliases: ["five senses", "senses"] },
  { id: "animal_habitats", label: "Animal Habitats", grades: [1, 2, 3], aliases: ["habitat", "animal home"] },
  { id: "plant_parts", label: "Parts of a Plant", grades: [2, 3, 4], aliases: ["plant part", "roots", "stem", "leaves"] },
  { id: "states_of_matter", label: "States of Matter", grades: [3, 4, 5], aliases: ["states of matter", "solid liquid gas"] },
  { id: "water_cycle", label: "The Water Cycle", grades: [3, 4, 5, 6], aliases: ["water cycle", "evaporation", "condensation"] },
  { id: "simple_machines", label: "Simple Machines", grades: [4, 5, 6], aliases: ["simple machine", "lever", "pulley", "wedge"] },
  { id: "food_chain", label: "Food Chains", grades: [3, 4, 5, 6], aliases: ["food chain", "producer", "consumer", "predator"] },
  { id: "solar_system", label: "The Solar System (Mixed)", grades: [3, 4, 5, 6, 7], aliases: ["solar system"], group: "Solar System" },
  { id: "solar_system_planets", label: "The Planets", grades: [3, 4, 5, 6, 7], aliases: ["planet", "planets in order"], group: "Solar System" },
  { id: "solar_system_earth_moon", label: "Earth, Sun & Moon", grades: [3, 4, 5, 6, 7], aliases: ["orbit", "moon phases", "day and night", "seasons"], group: "Solar System" },
  { id: "human_body_systems", label: "Human Body Systems (Mixed)", grades: [5, 6, 7, 8], aliases: ["body system", "organ"], group: "Human Body" },
  { id: "body_circulatory", label: "Circulatory System", grades: [5, 6, 7, 8], aliases: ["circulatory", "heart", "blood"], group: "Human Body" },
  { id: "body_digestive", label: "Digestive System", grades: [5, 6, 7, 8], aliases: ["digestive", "stomach", "digestion"], group: "Human Body" },
  { id: "body_respiratory", label: "Respiratory System", grades: [5, 6, 7, 8], aliases: ["respiratory", "lungs", "breathing"], group: "Human Body" },
  { id: "body_skeletal_muscular", label: "Skeletal & Muscular System", grades: [5, 6, 7, 8], aliases: ["skeletal", "muscular", "bones", "muscles"], group: "Human Body" },
  { id: "cell_biology", label: "Cell Biology", grades: [6, 7, 8], aliases: ["cell", "mitochondria", "nucleus", "organelle"] },
  { id: "ecosystems", label: "Ecosystems (Mixed)", grades: [6, 7, 8, 9], aliases: ["ecosystem"], group: "Ecosystems" },
  { id: "ecosystem_roles", label: "Producers, Consumers & Decomposers", grades: [6, 7, 8, 9], aliases: ["producer", "consumer", "decomposer", "food web"], group: "Ecosystems" },
  { id: "ecosystem_relationships", label: "Biomes & Symbiosis", grades: [6, 7, 8, 9], aliases: ["biome", "symbiosis", "mutualism", "parasitism"], group: "Ecosystems" },
  { id: "periodic_table_basics", label: "Periodic Table Basics", grades: [7, 8, 9], aliases: ["periodic table", "element symbol", "atomic number"] },
  { id: "forces_motion", label: "Forces & Motion (Mixed)", grades: [6, 7, 8, 9], aliases: ["force", "motion"], group: "Forces & Motion" },
  { id: "forces_speed", label: "Speed & Motion Calculations", grades: [6, 7, 8, 9], aliases: ["speed", "distance", "motion calculation"], group: "Forces & Motion" },
  { id: "forces_laws", label: "Forces & Newton's Laws", grades: [6, 7, 8, 9], aliases: ["newton's law", "gravity", "friction"], group: "Forces & Motion" },
  { id: "earth_science", label: "Earth Science (Mixed)", grades: [6, 7, 8, 9], aliases: ["earth science"], group: "Earth Science" },
  { id: "earth_rocks_tectonics", label: "Rocks & Plate Tectonics", grades: [6, 7, 8, 9], aliases: ["rock cycle", "plate tectonics", "earthquake"], group: "Earth Science" },
  { id: "earth_weather", label: "Weather & Water Cycle", grades: [6, 7, 8, 9], aliases: ["weather", "water cycle", "evaporation"], group: "Earth Science" },
  { id: "chemistry_basics", label: "Chemistry Basics (Mixed)", grades: [8, 9, 10], aliases: ["chemistry", "chemical reaction"], group: "Chemistry" },
  { id: "chemistry_atoms", label: "Atoms & Elements", grades: [8, 9, 10], aliases: ["atom", "element", "proton", "electron"], group: "Chemistry" },
  { id: "chemistry_compounds", label: "Compounds & Molecules", grades: [8, 9, 10], aliases: ["compound", "molecule", "chemical formula"], group: "Chemistry" },
  { id: "chemistry_reactions", label: "Chemical Reactions", grades: [8, 9, 10], aliases: ["chemical reaction", "exothermic", "endothermic"], group: "Chemistry" },
  { id: "physics_formulas", label: "Physics Formulas", grades: [9, 10, 11, 12], aliases: ["physics", "velocity", "acceleration", "density", "kinetic energy"] },
  { id: "genetics_basics", label: "Genetics Basics (Mixed)", grades: [9, 10, 11, 12], aliases: ["genetics"], group: "Genetics" },
  { id: "genetics_vocabulary", label: "Genetics Vocabulary", grades: [9, 10, 11, 12], aliases: ["dominant", "recessive", "allele", "dna"], group: "Genetics" },
  { id: "genetics_punnett", label: "Punnett Squares & Crosses", grades: [9, 10, 11, 12], aliases: ["punnett square", "genetic cross"], group: "Genetics" },
  { id: "biology_advanced", label: "Advanced Biology (Mixed)", grades: [10, 11, 12], aliases: ["biology"], group: "Advanced Biology" },
  { id: "bio_photosynthesis_respiration", label: "Photosynthesis & Respiration", grades: [10, 11, 12], aliases: ["photosynthesis", "cellular respiration"], group: "Advanced Biology" },
  { id: "bio_cell_division", label: "Mitosis & Meiosis", grades: [10, 11, 12], aliases: ["mitosis", "meiosis", "cell division"], group: "Advanced Biology" },
];

// ---------- curated fact banks (see scienceBanks.ts) ----------
// Which levels each difficulty draws from, with weights. Hard still mixes in
// some medium questions so small banks can fill a worksheet without repeats.
const LEVEL_WEIGHTS = {
  easy: { 1: 3, 2: 1, 3: 0 },
  medium: { 1: 1, 2: 3, 3: 1 },
  hard: { 1: 0, 2: 1, 3: 3 },
} as const;

function tieredBankGen(...banks: BankItem[][]): Gen {
  const all = banks.flat();
  return (grade, diff, rng) => {
    const w = LEVEL_WEIGHTS[diff];
    // Younger grades lean easier; older grades lean harder within a topic.
    const pool = all.filter(([, , lvl]) => w[lvl] > 0);
    const weighted: BankItem[] = [];
    for (const item of pool) for (let i = 0; i < w[item[2]]; i++) weighted.push(item);
    const [q, a] = weighted[Math.floor(rng() * weighted.length)];
    return { q, a };
  };
}

// ---------- computed generators ----------
const genForcesSpeed: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const kinds = diff === "easy" ? ["speed"] : diff === "medium" ? ["speed", "distance", "time"] : ["distance", "time", "kmh", "average"];
  const kind = pick(kinds);
  const time = randInt(2, 10);
  const speed = randInt(2, diff === "hard" ? 30 : 15);
  const distance = speed * time;
  if (kind === "speed") return { q: `An object travels ${distance} meters in ${time} seconds. What is its speed?`, a: `${speed} m/s` };
  if (kind === "distance") return { q: `A cyclist rides at ${speed} m/s for ${time} seconds. How far does she travel?`, a: `${distance} m` };
  if (kind === "time") return { q: `A runner covers ${distance} meters at a steady ${speed} m/s. How many seconds does it take?`, a: `${time} s` };
  if (kind === "kmh") {
    const h = randInt(2, 5), v = randInt(4, 12) * 10;
    return { q: `A train travels ${v * h} km in ${h} hours. What is its average speed in km/h?`, a: `${v} km/h` };
  }
  // average speed over two legs
  const t1 = randInt(2, 5), t2 = randInt(2, 5), v1 = randInt(3, 9) * 10, total = v1 * t1 + randInt(3, 9) * 10 * t2;
  const avg = total / (t1 + t2);
  if (!Number.isInteger(avg)) return { q: `A bus travels ${v1 * t1} km in ${t1} hours. What is its average speed?`, a: `${v1} km/h` };
  return { q: `A car travels ${total} km in total over ${t1 + t2} hours. What is its average speed?`, a: `${avg} km/h` };
};

const genForcesNewton: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const m = randInt(2, 25), acc = randInt(2, 10), f = m * acc;
  const kind = pick(diff === "hard" ? ["m", "a", "weight"] : ["f", "f", "weight"]);
  if (kind === "f") return { q: `Using F = ma, find the force on a ${m} kg object accelerating at ${acc} m/s².`, a: `${f} N` };
  if (kind === "m") return { q: `A force of ${f} N gives an object an acceleration of ${acc} m/s². What is its mass? (F = ma)`, a: `${m} kg` };
  if (kind === "a") return { q: `A force of ${f} N acts on a ${m} kg object. What is its acceleration? (F = ma)`, a: `${acc} m/s²` };
  return { q: `Taking g = 10 N/kg, what is the weight of a ${m} kg object on Earth?`, a: `${m * 10} N` };
};

const genForcesMotion: Gen = (grade, diff, rng) => {
  const r = rng();
  if (r < 0.4) return genForcesSpeed(grade, diff, rng);
  if (r < 0.6 && diff !== "easy") return genForcesNewton(grade, diff, rng);
  return tieredBankGen(B.FORCES_LAWS)(grade, diff, rng);
};

const genPhysicsFormulas: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const kinds = diff === "easy" ? ["speed", "force", "density"] : diff === "medium"
    ? ["speed", "force", "density", "work", "power", "accel"]
    : ["work", "power", "accel", "ke", "gpe", "density_inv", "fact"];
  const kind = pick(kinds);
  if (kind === "speed") {
    const time = randInt(2, 10), speed = randInt(2, 30);
    return { q: `A car travels at ${speed} m/s for ${time} seconds. How far does it travel?`, a: `${speed * time} m` };
  }
  if (kind === "force") {
    const mass = randInt(2, 20), accel = randInt(2, 10);
    return { q: `Using F = ma, find the force on an object with mass ${mass} kg accelerating at ${accel} m/s².`, a: `${mass * accel} N` };
  }
  if (kind === "density") {
    const volume = randInt(2, 10), d = randInt(2, 12);
    return { q: `Using density = mass ÷ volume, find the density of an object with mass ${volume * d} g and volume ${volume} cm³.`, a: `${d} g/cm³` };
  }
  if (kind === "density_inv") {
    const volume = randInt(2, 20), d = randInt(2, 9);
    return { q: `A metal has a density of ${d} g/cm³. What is the mass of ${volume} cm³ of it?`, a: `${d * volume} g` };
  }
  if (kind === "work") {
    const f = randInt(5, 60), dist = randInt(2, 15);
    return { q: `A ${f} N force pushes a box ${dist} m in the direction of the force. How much work is done? (W = F × d)`, a: `${f * dist} J` };
  }
  if (kind === "power") {
    const t = randInt(2, 10), p = randInt(5, 60) * 5;
    return { q: `A motor does ${p * t} J of work in ${t} seconds. What is its power? (P = W ÷ t)`, a: `${p} W` };
  }
  if (kind === "accel") {
    const t = randInt(2, 8), a = randInt(1, 6), u = randInt(0, 10);
    return { q: `A car speeds up from ${u} m/s to ${u + a * t} m/s in ${t} seconds. What is its acceleration? (a = Δv ÷ t)`, a: `${a} m/s²` };
  }
  if (kind === "ke") {
    const m = pick([2, 4, 6, 8, 10, 20, 50]), v = randInt(2, 12);
    return { q: `Find the kinetic energy of a ${m} kg object moving at ${v} m/s. (KE = ½mv²)`, a: `${(m * v * v) / 2} J` };
  }
  if (kind === "gpe") {
    const m = randInt(2, 30), h = randInt(2, 20);
    return { q: `Taking g = 10 N/kg, find the gravitational potential energy gained by a ${m} kg object lifted ${h} m. (GPE = mgh)`, a: `${m * 10 * h} J` };
  }
  return tieredBankGen(B.ENERGY_FACTS, B.FORCES_LAWS)(grade, diff, rng);
};

// Punnett crosses are computed, so every question and ratio is checked by code.
const GENOTYPES = ["AA", "Aa", "aa"] as const;
function crossResult(p1: string, p2: string) {
  const counts = { AA: 0, Aa: 0, aa: 0 } as Record<string, number>;
  for (const x of p1) for (const y of p2) {
    const g = [x, y].sort().join(""); // uppercase sorts first → "Aa"
    counts[g]++;
  }
  const dominant = counts.AA + counts.Aa;
  return { counts, dominant, recessive: counts.aa };
}
function describe(g: string) {
  return g === "AA" ? "homozygous dominant (AA)" : g === "Aa" ? "heterozygous (Aa)" : "homozygous recessive (aa)";
}
const TRAITS: [string, string, string, string][] = [
  ["T", "tall", "short", "pea plants"],
  ["P", "purple flowers", "white flowers", "pea plants"],
  ["B", "brown fur", "white fur", "rabbits"],
  ["R", "round seeds", "wrinkled seeds", "pea plants"],
  ["Y", "yellow seeds", "green seeds", "pea plants"],
  ["W", "wire-haired coat", "smooth coat", "dogs"],
];
const genGeneticsPunnett: Gen = (grade, diff, rng) => {
  const { pick } = makeHelpers(rng);
  const p1 = pick([...GENOTYPES]), p2 = pick([...GENOTYPES]);
  const { counts, dominant, recessive } = crossResult(p1, p2);
  const [L, dom, rec, org] = pick(TRAITS);
  const fmt = (g: string) => g.replace(/A/g, L).replace(/a/g, L.toLowerCase());
  const pct = (n: number) => `${(n / 4) * 100}%`;
  const kind = pick(diff === "easy" ? ["pct", "basic"] : diff === "medium" ? ["pct", "ratio", "genotype"] : ["genotype", "ratio", "word", "backcross"]);
  if (kind === "basic") {
    return { q: `In ${org}, the allele for ${dom} (${L}) is dominant over the allele for ${rec} (${L.toLowerCase()}). What trait does a ${fmt("Aa")} ${org.replace(/s$/, "")} show?`, a: dom };
  }
  if (kind === "pct") {
    return { q: `Cross ${fmt(p1)} × ${fmt(p2)}. What percentage of offspring are expected to show the dominant trait?`, a: pct(dominant) };
  }
  if (kind === "ratio") {
    const ratio = recessive === 0 ? "all dominant (4 : 0)" : dominant === 0 ? "all recessive (0 : 4)" : `${dominant} : ${recessive}`;
    return { q: `Cross ${fmt(p1)} × ${fmt(p2)}. What is the expected ratio of dominant to recessive phenotypes?`, a: ratio };
  }
  if (kind === "genotype") {
    const parts = (["AA", "Aa", "aa"] as const).filter((g) => counts[g] > 0).map((g) => `${counts[g]} ${fmt(g)}`);
    return { q: `Use a Punnett square to cross ${fmt(p1)} × ${fmt(p2)}. What is the expected genotype ratio (out of 4)?`, a: parts.join(" : ") };
  }
  if (kind === "word") {
    return {
      q: `In ${org}, the allele for ${dom} (${L}) is dominant over the allele for ${rec} (${L.toLowerCase()}). A ${describe(p1).replace(/\(.*\)/, "").trim()} parent is crossed with a ${describe(p2).replace(/\(.*\)/, "").trim()} parent. What percentage of offspring are expected to have ${rec}?`,
      a: pct(recessive),
    };
  }
  // test cross: unknown dominant × aa
  return {
    q: `A ${org.replace(/s$/, "")} with ${dom} is crossed with one with ${rec}. Half the offspring have ${rec}. What is the genotype of the parent with ${dom}?`,
    a: `${fmt("Aa")} (heterozygous)`,
  };
};

const genGeneticsBasics: Gen = (grade, diff, rng) =>
  rng() < 0.5 ? genGeneticsPunnett(grade, diff, rng) : tieredBankGen(B.GENETICS_VOCAB)(grade, diff, rng);

export const SCIENCE_GENERATORS: Record<string, Gen> = {
  living_nonliving: tieredBankGen(B.LIVING_NONLIVING),
  five_senses: tieredBankGen(B.FIVE_SENSES),
  animal_habitats: tieredBankGen(B.ANIMAL_HABITATS),
  plant_parts: tieredBankGen(B.PLANT_PARTS),
  states_of_matter: tieredBankGen(B.STATES_OF_MATTER),
  water_cycle: tieredBankGen(B.WATER_CYCLE),
  simple_machines: tieredBankGen(B.SIMPLE_MACHINES),
  food_chain: tieredBankGen(B.FOOD_CHAIN),
  solar_system: tieredBankGen(B.SOLAR_SYSTEM_PLANETS, B.SOLAR_SYSTEM_EARTH_MOON),
  solar_system_planets: tieredBankGen(B.SOLAR_SYSTEM_PLANETS),
  solar_system_earth_moon: tieredBankGen(B.SOLAR_SYSTEM_EARTH_MOON),
  human_body_systems: tieredBankGen(B.BODY_CIRCULATORY, B.BODY_DIGESTIVE, B.BODY_RESPIRATORY, B.BODY_SKELETAL_MUSCULAR),
  body_circulatory: tieredBankGen(B.BODY_CIRCULATORY),
  body_digestive: tieredBankGen(B.BODY_DIGESTIVE),
  body_respiratory: tieredBankGen(B.BODY_RESPIRATORY),
  body_skeletal_muscular: tieredBankGen(B.BODY_SKELETAL_MUSCULAR),
  cell_biology: tieredBankGen(B.CELL_BIOLOGY),
  ecosystems: tieredBankGen(B.ECOSYSTEM_ROLES, B.ECOSYSTEM_RELATIONSHIPS),
  ecosystem_roles: tieredBankGen(B.ECOSYSTEM_ROLES),
  ecosystem_relationships: tieredBankGen(B.ECOSYSTEM_RELATIONSHIPS),
  periodic_table_basics: tieredBankGen(B.PERIODIC_TABLE),
  earth_science: tieredBankGen(B.EARTH_ROCKS_TECTONICS, B.EARTH_WEATHER),
  earth_rocks_tectonics: tieredBankGen(B.EARTH_ROCKS_TECTONICS),
  earth_weather: tieredBankGen(B.EARTH_WEATHER, B.WATER_CYCLE),
  chemistry_basics: tieredBankGen(B.CHEMISTRY_ATOMS, B.CHEMISTRY_COMPOUNDS, B.CHEMISTRY_REACTIONS),
  chemistry_atoms: tieredBankGen(B.CHEMISTRY_ATOMS),
  chemistry_compounds: tieredBankGen(B.CHEMISTRY_COMPOUNDS),
  chemistry_reactions: tieredBankGen(B.CHEMISTRY_REACTIONS),
  biology_advanced: tieredBankGen(B.BIO_PHOTOSYNTHESIS_RESPIRATION, B.BIO_CELL_DIVISION, B.GENETICS_VOCAB),
  bio_photosynthesis_respiration: tieredBankGen(B.BIO_PHOTOSYNTHESIS_RESPIRATION),
  bio_cell_division: tieredBankGen(B.BIO_CELL_DIVISION),
  forces_motion: genForcesMotion,
  forces_speed: genForcesSpeed,
  forces_laws: (grade, diff, rng) => (diff !== "easy" && rng() < 0.35 ? genForcesNewton(grade, diff, rng) : tieredBankGen(B.FORCES_LAWS)(grade, diff, rng)),
  physics_formulas: genPhysicsFormulas,
  genetics_basics: genGeneticsBasics,
  genetics_vocabulary: tieredBankGen(B.GENETICS_VOCAB),
  genetics_punnett: genGeneticsPunnett,
};
