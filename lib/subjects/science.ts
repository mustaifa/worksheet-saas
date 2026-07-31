import { Topic, Gen, makeHelpers } from "./types";

export const SCIENCE_TOPICS: Topic[] = [
  { id: "living_nonliving", label: "Living vs Non-living", grades: [1, 2], aliases: ["living", "nonliving", "non-living"] },
  { id: "five_senses", label: "The Five Senses", grades: [1, 2], aliases: ["five senses", "senses"] },
  { id: "animal_habitats", label: "Animal Habitats", grades: [1, 2, 3], aliases: ["habitat", "animal home"] },
  { id: "plant_parts", label: "Parts of a Plant", grades: [2, 3, 4], aliases: ["plant part", "roots", "stem", "leaves"] },
  { id: "states_of_matter", label: "States of Matter", grades: [3, 4, 5], aliases: ["states of matter", "solid liquid gas"] },
  { id: "water_cycle", label: "The Water Cycle", grades: [3, 4, 5, 6], aliases: ["water cycle", "evaporation", "condensation"] },
  { id: "simple_machines", label: "Simple Machines", grades: [4, 5, 6], aliases: ["simple machine", "lever", "pulley", "wedge"] },
  { id: "food_chain", label: "Food Chains", grades: [3, 4, 5, 6], aliases: ["food chain", "producer", "consumer", "predator"] },
  { id: "solar_system", label: "The Solar System", grades: [3, 4, 5, 6, 7], aliases: ["solar system", "planet", "orbit"] },
  { id: "human_body_systems", label: "Human Body Systems (Mixed)", grades: [5, 6, 7, 8], aliases: ["body system", "organ"], group: "Human Body" },
  { id: "body_circulatory", label: "Circulatory System", grades: [5, 6, 7, 8], aliases: ["circulatory", "heart", "blood"], group: "Human Body" },
  { id: "body_digestive", label: "Digestive System", grades: [5, 6, 7, 8], aliases: ["digestive", "stomach", "digestion"], group: "Human Body" },
  { id: "body_respiratory", label: "Respiratory System", grades: [5, 6, 7, 8], aliases: ["respiratory", "lungs", "breathing"], group: "Human Body" },
  { id: "body_skeletal_muscular", label: "Skeletal & Muscular System", grades: [5, 6, 7, 8], aliases: ["skeletal", "muscular", "bones", "muscles"], group: "Human Body" },
  { id: "cell_biology", label: "Cell Biology", grades: [6, 7, 8], aliases: ["cell", "mitochondria", "nucleus", "organelle"] },
  { id: "ecosystems", label: "Ecosystems", grades: [6, 7, 8, 9], aliases: ["ecosystem", "biome", "symbiosis"] },
  { id: "periodic_table_basics", label: "Periodic Table Basics", grades: [7, 8, 9], aliases: ["periodic table", "element symbol", "atomic number"] },
  { id: "forces_motion", label: "Forces & Motion", grades: [6, 7, 8, 9], aliases: ["force", "motion", "speed", "newton's law"] },
  { id: "earth_science", label: "Earth Science", grades: [6, 7, 8, 9], aliases: ["rock cycle", "plate tectonics", "weather", "earthquake"] },
  { id: "chemistry_basics", label: "Chemistry Basics (Mixed)", grades: [8, 9, 10], aliases: ["chemistry", "chemical reaction"], group: "Chemistry" },
  { id: "chemistry_atoms", label: "Atoms & Elements", grades: [8, 9, 10], aliases: ["atom", "element", "proton", "electron"], group: "Chemistry" },
  { id: "chemistry_compounds", label: "Compounds & Molecules", grades: [8, 9, 10], aliases: ["compound", "molecule", "chemical formula"], group: "Chemistry" },
  { id: "chemistry_reactions", label: "Chemical Reactions", grades: [8, 9, 10], aliases: ["chemical reaction", "exothermic", "endothermic"], group: "Chemistry" },
  { id: "physics_formulas", label: "Physics Formulas", grades: [9, 10, 11, 12], aliases: ["physics", "velocity", "acceleration", "density", "kinetic energy"] },
  { id: "genetics_basics", label: "Genetics Basics", grades: [9, 10, 11, 12], aliases: ["genetics", "dominant", "recessive", "punnett square", "dna"] },
  { id: "biology_advanced", label: "Advanced Biology", grades: [10, 11, 12], aliases: ["photosynthesis", "mitosis", "meiosis", "biology"] },
];

// ---------- curated fact banks: [question, answer] ----------
const LIVING_NONLIVING: [string, string][] = [
  ["Is a tree living or non-living?", "living"], ["Is a rock living or non-living?", "non-living"],
  ["Is a butterfly living or non-living?", "living"], ["Is water living or non-living?", "non-living"],
  ["Is a mushroom living or non-living?", "living"], ["Is the sun living or non-living?", "non-living"],
  ["Name one thing all living things need to survive.", "food, water, air, or shelter (any one)"],
];
const FIVE_SENSES: [string, string][] = [
  ["Which sense organ do we use to see?", "eyes"], ["Which sense organ do we use to hear?", "ears"],
  ["Which sense organ do we use to smell?", "nose"], ["Which sense organ do we use to taste?", "tongue"],
  ["Which sense do we use to feel if something is hot?", "touch"],
  ["Name the five senses.", "sight, hearing, smell, taste, touch"],
];
const ANIMAL_HABITATS: [string, string][] = [
  ["Where does a fish live?", "in water / ocean or river"], ["Where does a polar bear live?", "the Arctic / cold, icy areas"],
  ["Where does a camel live?", "the desert"], ["Where does a monkey usually live?", "the rainforest / jungle"],
  ["Where does a penguin live?", "Antarctica / cold coastal areas"], ["What do we call an animal's natural home?", "habitat"],
];
const PLANT_PARTS: [string, string][] = [
  ["Which part of the plant absorbs water from the soil?", "roots"], ["Which part of the plant makes food using sunlight?", "leaves"],
  ["Which part of the plant supports it and carries water up?", "stem"], ["Which part of the plant attracts pollinators?", "flower"],
  ["What process do plants use to make their own food?", "photosynthesis"], ["Which part of the plant becomes fruit after pollination?", "the flower/ovary"],
];
const STATES_OF_MATTER: [string, string][] = [
  ["Is ice a solid, liquid, or gas?", "solid"], ["Is water vapor a solid, liquid, or gas?", "gas"],
  ["Is milk a solid, liquid, or gas?", "liquid"], ["What is it called when a solid turns into a liquid?", "melting"],
  ["What is it called when a liquid turns into a gas?", "evaporation"], ["What is it called when a gas turns into a liquid?", "condensation"],
  ["What is it called when a liquid turns into a solid?", "freezing"],
];
const WATER_CYCLE: [string, string][] = [
  ["What is the process where water turns into vapor and rises?", "evaporation"], ["What is the process where water vapor turns back into liquid droplets?", "condensation"],
  ["What is falling rain, snow, or hail called?", "precipitation"], ["What is it called when water flows over land back to rivers/oceans?", "runoff / collection"],
  ["What powers the water cycle?", "the sun (heat energy)"],
];
const SIMPLE_MACHINES: [string, string][] = [
  ["Name a simple machine that helps lift heavy objects using a bar and fulcrum.", "lever"],
  ["What simple machine is a wheel with a groove that holds a rope?", "pulley"],
  ["What simple machine is a sloped surface used to raise objects?", "inclined plane"],
  ["What simple machine is used to hold objects together, like a screw?", "screw"],
  ["What simple machine splits things apart, like an axe head?", "wedge"],
  ["What simple machine is a rod and wheel that rotate together, like a doorknob?", "wheel and axle"],
];
const FOOD_CHAIN: [string, string][] = [
  ["What do we call an organism that makes its own food, like a plant?", "producer"],
  ["What do we call an animal that eats only plants?", "herbivore"],
  ["What do we call an animal that eats only meat?", "carnivore"],
  ["What do we call an animal that eats both plants and meat?", "omnivore"],
  ["What is an organism that breaks down dead material called?", "decomposer"],
  ["In a food chain, where does energy originally come from?", "the sun"],
];
const SOLAR_SYSTEM: [string, string][] = [
  ["Which planet is closest to the sun?", "Mercury"], ["Which planet is known as the Red Planet?", "Mars"],
  ["Which planet has the most well-known ring system?", "Saturn"], ["Which planet do we live on?", "Earth"],
  ["What is the name of the star at the center of our solar system?", "the Sun"],
  ["Which planet is the largest in our solar system?", "Jupiter"],
  ["What natural satellite orbits the Earth?", "the Moon"],
  ["How many planets are in our solar system?", "8"],
];
const HUMAN_BODY_SYSTEMS: [string, string][] = [
  ["Which organ pumps blood through the body?", "the heart"], ["Which system helps you breathe?", "the respiratory system"],
  ["Which organ digests food?", "the stomach"], ["Which system carries blood through the body?", "the circulatory system"],
  ["Which organ controls the whole body?", "the brain"], ["Which system helps your body move and gives it structure?", "the skeletal system (and muscular system)"],
  ["What is the largest organ of the human body?", "the skin"],
];
const BODY_CIRCULATORY: [string, string][] = [
  ["Which organ pumps blood through the body?", "the heart"],
  ["What are the tubes that carry blood away from the heart called?", "arteries"],
  ["What are the tubes that carry blood back to the heart called?", "veins"],
  ["What red blood cells carry oxygen around the body?", "red blood cells (they carry hemoglobin)"],
  ["How many chambers does the human heart have?", "4"],
  ["What liquid part of blood carries blood cells around the body?", "plasma"],
  ["What do we call the system of the heart, blood, and blood vessels together?", "the circulatory system"],
];
const BODY_DIGESTIVE: [string, string][] = [
  ["Which organ first breaks down food using acid?", "the stomach"],
  ["Where does most nutrient absorption happen?", "the small intestine"],
  ["What organ produces bile to help digest fat?", "the liver"],
  ["What is the long tube that carries food from your mouth to your stomach called?", "the esophagus"],
  ["What do we call the process of breaking food into nutrients the body can use?", "digestion"],
  ["What organ absorbs water and forms solid waste?", "the large intestine"],
];
const BODY_RESPIRATORY: [string, string][] = [
  ["Which organs do you use to breathe?", "the lungs"],
  ["What gas do we breathe in that our body needs?", "oxygen"],
  ["What gas do we breathe out as waste?", "carbon dioxide"],
  ["What muscle below the lungs helps you breathe in and out?", "the diaphragm"],
  ["What is the tube that carries air from your throat to your lungs called?", "the trachea (windpipe)"],
  ["What tiny air sacs in the lungs is where oxygen enters the blood?", "alveoli"],
];
const BODY_SKELETAL_MUSCULAR: [string, string][] = [
  ["About how many bones does an adult human body have?", "206"],
  ["What is the hardest, outer layer of bone called?", "compact bone"],
  ["What connects muscle to bone?", "a tendon"],
  ["What connects bone to bone at a joint?", "a ligament"],
  ["What system gives your body its shape and protects your organs?", "the skeletal system"],
  ["What do muscles do when they contract (get shorter)?", "pull on bones to create movement"],
  ["What is the largest bone in the human body?", "the femur (thigh bone)"],
];
const CELL_BIOLOGY: [string, string][] = [
  ["What is the basic unit of life?", "the cell"], ["Which part of the cell controls its activities and holds DNA?", "the nucleus"],
  ["Which part of the cell produces energy?", "the mitochondria"], ["What structure surrounds and protects a plant cell (that animal cells lack)?", "the cell wall"],
  ["Which green structures in plant cells carry out photosynthesis?", "chloroplasts"],
  ["What thin layer controls what enters and exits a cell?", "the cell membrane"],
];
const ECOSYSTEMS: [string, string][] = [
  ["What do we call a community of living things and their environment?", "an ecosystem"],
  ["What is it called when two organisms live closely together, and both benefit?", "mutualism"],
  ["What is it called when one organism benefits and the other is harmed?", "parasitism"],
  ["What do we call all the populations of different species living in one area?", "a community"],
  ["What is a large area with a distinct climate and organisms called, like a desert or rainforest?", "a biome"],
];
const PERIODIC_TABLE: [string, string][] = [
  ["What is the chemical symbol for Oxygen?", "O"], ["What is the chemical symbol for Hydrogen?", "H"],
  ["What is the chemical symbol for Gold?", "Au"], ["What is the chemical symbol for Sodium?", "Na"],
  ["What is the chemical symbol for Iron?", "Fe"], ["What is the chemical symbol for Carbon?", "C"],
  ["What number on the periodic table tells you the number of protons in an atom?", "the atomic number"],
  ["What is the chemical symbol for Helium?", "He"],
];
const EARTH_SCIENCE: [string, string][] = [
  ["What are the three main types of rock?", "igneous, sedimentary, and metamorphic"],
  ["What is it called when the Earth's plates shift and cause shaking?", "an earthquake"],
  ["What layer of the Earth do we live on?", "the crust"],
  ["What causes weather patterns like wind?", "differences in air pressure/temperature"],
  ["What is molten rock below the Earth's surface called?", "magma"],
  ["What do we call molten rock once it reaches the surface?", "lava"],
];
const CHEMISTRY_BASICS: [string, string][] = [
  ["What do we call a substance made of two or more elements chemically bonded?", "a compound"],
  ["What is the smallest unit of an element that retains its properties?", "an atom"],
  ["What is the chemical formula for water?", "H₂O"],
  ["What is the chemical formula for table salt?", "NaCl"],
  ["What do we call a reaction that releases heat?", "exothermic"],
  ["What do we call a reaction that absorbs heat?", "endothermic"],
  ["What are the three main particles found in an atom?", "protons, neutrons, and electrons"],
];
const CHEMISTRY_ATOMS: [string, string][] = [
  ["What is the smallest unit of an element that retains its properties?", "an atom"],
  ["What are the three main particles found in an atom?", "protons, neutrons, and electrons"],
  ["Which particle in an atom has a positive charge?", "the proton"],
  ["Which particle in an atom has a negative charge?", "the electron"],
  ["Which particle in an atom has no charge?", "the neutron"],
  ["Where are protons and neutrons located in an atom?", "in the nucleus"],
  ["What number on the periodic table tells you the number of protons?", "the atomic number"],
];
const CHEMISTRY_COMPOUNDS: [string, string][] = [
  ["What do we call a substance made of two or more elements chemically bonded?", "a compound"],
  ["What is the chemical formula for water?", "H₂O"],
  ["What is the chemical formula for table salt?", "NaCl"],
  ["What is the chemical formula for carbon dioxide?", "CO₂"],
  ["What do we call the smallest unit of a compound that keeps its properties?", "a molecule"],
  ["What is a substance made of only one type of atom called?", "an element"],
];
const CHEMISTRY_REACTIONS: [string, string][] = [
  ["What do we call a reaction that releases heat?", "exothermic"],
  ["What do we call a reaction that absorbs heat?", "endothermic"],
  ["What do we call the starting substances in a chemical reaction?", "reactants"],
  ["What do we call the new substances formed by a chemical reaction?", "products"],
  ["What law says matter can't be created or destroyed in a reaction?", "the law of conservation of mass"],
  ["Name one common sign that a chemical reaction has happened.", "bubbles, color change, temperature change, or a new smell (any one)"],
];
const BIOLOGY_ADVANCED: [string, string][] = [
  ["Write the general word equation for photosynthesis.", "carbon dioxide + water (+ light) → glucose + oxygen"],
  ["What is the process of cell division that produces two identical cells called?", "mitosis"],
  ["What is the process of cell division that produces sex cells (with half the chromosomes) called?", "meiosis"],
  ["What molecule carries genetic information in cells?", "DNA"],
  ["What is the term for an organism's observable traits?", "phenotype"],
  ["What is the term for an organism's genetic makeup?", "genotype"],
];

function randomFrom<T>(rng: () => number, arr: T[]): T {
  const { pick } = makeHelpers(rng);
  return pick(arr);
}

function bankGen(bank: [string, string][]): Gen {
  return (grade, diff, rng) => {
    const [q, a] = randomFrom(rng, bank);
    return { q, a };
  };
}

// ---------- computed generators ----------
const genForcesMotion: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const kind = pick(diff === "easy" ? ["speed"] : ["speed", "speed", "define"]);
  if (kind === "define") {
    const facts: [string, string][] = [
      ["What is the SI unit of force?", "Newton (N)"],
      ["What is Newton's First Law about?", "an object stays at rest or in motion unless acted on by a force (inertia)"],
      ["What is the formula for speed?", "speed = distance ÷ time"],
    ];
    return pick(facts.map(([q, a]) => ({ q, a })));
  }
  const distance = randInt(2, 20) * (diff === "hard" ? 5 : 10);
  const time = randInt(2, 10);
  // ensure clean division
  const cleanDistance = time * randInt(2, diff === "hard" ? 30 : 15);
  return { q: `An object travels ${cleanDistance} meters in ${time} seconds. What is its speed?`, a: `${cleanDistance / time} m/s` };
};

const genPhysicsFormulas: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const kind = pick(["speed", "force", "density"]);
  if (kind === "speed") {
    const time = randInt(2, 10);
    const speed = randInt(2, diff === "hard" ? 40 : 20);
    return { q: `A car travels at ${speed} m/s for ${time} seconds. How far does it travel?`, a: `${speed * time} m` };
  }
  if (kind === "force") {
    const mass = randInt(2, 20);
    const accel = randInt(2, 10);
    return { q: `Using F = ma, find the force on an object with mass ${mass} kg accelerating at ${accel} m/s².`, a: `${mass * accel} N` };
  }
  const mass = randInt(4, 50);
  const volume = randInt(2, 10);
  const cleanMass = volume * randInt(2, diff === "hard" ? 15 : 8);
  return { q: `Using density = mass ÷ volume, find the density of an object with mass ${cleanMass} g and volume ${volume} cm³.`, a: `${cleanMass / volume} g/cm³` };
};

const genGeneticsBasics: Gen = (grade, diff, rng) => {
  const { pick } = makeHelpers(rng);
  const kind = pick(["facts", "cross"]);
  if (kind === "facts") {
    const facts: [string, string][] = [
      ["In genetics, what do we call a trait that shows up even with only one copy of the gene?", "dominant"],
      ["In genetics, what do we call a trait that only shows up with two copies of the gene?", "recessive"],
      ["What tool shows the possible gene combinations of offspring?", "a Punnett square"],
      ["What are the different forms of a gene called?", "alleles"],
    ];
    return pick(facts.map(([q, a]) => ({ q, a })));
  }
  // Aa x Aa cross -> classic 1:2:1 genotype, 3:1 phenotype ratio
  return {
    q: "In a cross between two heterozygous parents (Aa × Aa), what is the phenotype ratio of dominant to recessive offspring?",
    a: "3 : 1",
  };
};

export const SCIENCE_GENERATORS: Record<string, Gen> = {
  living_nonliving: bankGen(LIVING_NONLIVING),
  five_senses: bankGen(FIVE_SENSES),
  animal_habitats: bankGen(ANIMAL_HABITATS),
  plant_parts: bankGen(PLANT_PARTS),
  states_of_matter: bankGen(STATES_OF_MATTER),
  water_cycle: bankGen(WATER_CYCLE),
  simple_machines: bankGen(SIMPLE_MACHINES),
  food_chain: bankGen(FOOD_CHAIN),
  solar_system: bankGen(SOLAR_SYSTEM),
  human_body_systems: bankGen(HUMAN_BODY_SYSTEMS),
  body_circulatory: bankGen(BODY_CIRCULATORY),
  body_digestive: bankGen(BODY_DIGESTIVE),
  body_respiratory: bankGen(BODY_RESPIRATORY),
  body_skeletal_muscular: bankGen(BODY_SKELETAL_MUSCULAR),
  cell_biology: bankGen(CELL_BIOLOGY),
  ecosystems: bankGen(ECOSYSTEMS),
  periodic_table_basics: bankGen(PERIODIC_TABLE),
  earth_science: bankGen(EARTH_SCIENCE),
  chemistry_basics: bankGen(CHEMISTRY_BASICS),
  chemistry_atoms: bankGen(CHEMISTRY_ATOMS),
  chemistry_compounds: bankGen(CHEMISTRY_COMPOUNDS),
  chemistry_reactions: bankGen(CHEMISTRY_REACTIONS),
  biology_advanced: bankGen(BIOLOGY_ADVANCED),
  forces_motion: genForcesMotion,
  physics_formulas: genPhysicsFormulas,
  genetics_basics: genGeneticsBasics,
};
