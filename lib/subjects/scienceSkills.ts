/**
 * Science skills for the NGSS-aligned curriculum book, grades 1–12.
 * Formula skills (density, F = ma, half-life, molar mass, Ohm's law...) are
 * computed; conceptual skills draw from curated banks.
 */
import { Topic, Gen, Difficulty, makeHelpers, skillTopic as T } from "./types";
import { bankGen, mixGen } from "./bank";
import { num, round, frac, fStr } from "./mathUtil";
import * as A from "./scienceSkillBanksElem";
import * as B from "./scienceSkillBanksUpper";

const by = <V,>(d: Difficulty, v: Record<Difficulty, V>): V => v[d];
/** "A" or "An" before a spoken number: an 8, an 11, an 18, an 80… */
const An = (n: number) => { const t = `${n}`; return t[0] === "8" || t === "11" || t === "18" || /^1[18]\d{3}$/.test(t) ? "An" : "A"; };

export const SCIENCE_SKILL_TOPICS: Topic[] = [
  // ---- grades 1–2
  T("sound_vibrations", "Sound & Vibrations", ["sound", "vibration", "vibrate"], "How vibrating objects make sound, and how sound travels."),
  T("light_shadows", "Light, Shadows & Materials", ["shadow", "transparent", "translucent", "opaque"], "Why we need light to see, how shadows form, and transparent, translucent and opaque materials."),
  T("parents_offspring", "Parents & Offspring", ["baby animals", "offspring", "young animals"], "How young animals and plants are like their parents, and how parents help offspring survive."),
  T("structures_survival", "Plant & Animal Body Parts for Survival", ["animal body parts", "plant parts survive", "biomimicry"], "How body parts help plants and animals survive — and how people copy them in inventions."),
  T("sky_patterns", "Patterns in the Sky", ["sun moon stars", "sunrise sunset", "daylight hours"], "Patterns of the sun, moon and stars, and how daylight changes with the seasons."),
  T("properties_materials", "Properties of Materials", ["properties of matter", "hard soft", "flexible", "absorbent"], "Describing materials by properties such as hardness, flexibility and absorbency, and choosing the right one for a job."),
  T("heat_changes", "Heating, Cooling & Reversible Changes", ["reversible change", "irreversible change", "melting freezing"], "What heating and cooling do to materials, and which changes can be undone."),
  T("plant_needs", "What Plants Need to Grow", ["plant needs", "sunlight water"], "Why plants need water, light, air and nutrients — and how to test it fairly."),
  T("pollination_seeds", "Pollination & Seed Dispersal", ["pollination", "seed dispersal", "pollinator"], "How animals, wind and water help plants make and spread seeds."),
  T("landforms_water", "Landforms & Bodies of Water", ["landform", "mountain", "island", "lake", "river"], "Mountains, valleys, plains, islands, rivers, lakes and oceans, and where Earth's water is found."),
  T("earth_changes", "Earth Changes: Fast & Slow", ["erosion", "fast and slow changes", "landslide"], "Volcanoes, earthquakes and floods change land quickly; wind and water change it slowly."),
  // ---- grades 3–5
  T("balanced_forces", "Balanced & Unbalanced Forces", ["balanced forces", "unbalanced forces", "push and pull"], "How balanced and unbalanced pushes and pulls change an object's motion."),
  T("life_cycles", "Life Cycles", ["life cycle", "metamorphosis"], "Life cycles of plants and animals, including complete and incomplete metamorphosis."),
  T("inherited_traits", "Inherited Traits & the Environment", ["inherited trait", "learned behavior", "traits"], "Traits passed from parents, behaviors that are learned, and how the environment affects traits."),
  T("adaptations", "Adaptations & Survival", ["adaptation", "camouflage", "hibernation", "migration"], "Body and behavior adaptations that help living things survive in their habitats."),
  T("fossils", "Fossils", ["fossil", "extinct", "paleontologist"], "What fossils are, how they form, and what they tell us about life and environments long ago."),
  T("animal_groups", "Living in Groups", ["animal groups", "herd", "pack", "colony"], "Why some animals live in groups and how groups help them survive."),
  T("weather_climate", "Weather & Climate", ["weather", "climate", "thermometer", "rain gauge"], "Measuring weather, telling weather from climate, and climates around the world."),
  T("natural_hazards", "Natural Hazards", ["natural hazard", "tornado", "hurricane", "flood", "drought"], "Storms, floods, droughts and earthquakes, and designs that reduce their damage."),
  T("energy_forms", "Energy & Energy Transfer", ["forms of energy", "kinetic energy", "energy transfer"], "Forms of energy, how energy changes form and moves, and why it is never used up."),
  T("waves_basic", "Waves: Amplitude & Wavelength", ["wave", "amplitude", "wavelength", "crest"], "Parts of a wave, what waves carry, and how light lets us see."),
  T("rocks_erosion", "Weathering, Erosion & Rock Layers", ["weathering", "erosion", "deposition", "rock layers"], "How weathering, erosion and deposition shape land, and what rock layers reveal."),
  T("earth_patterns", "Earthquakes, Volcanoes & Mountains", ["earthquake", "volcano", "ring of fire"], "Where earthquakes, volcanoes and mountains form, and the patterns they make on maps."),
  T("energy_resources", "Energy Resources", ["renewable", "nonrenewable", "fossil fuels"], "Renewable and nonrenewable energy sources and their effects on the environment."),
  T("matter_particles", "Matter: Particles, Mixtures & Solutions", ["matter", "mixture", "solution", "dissolve"], "Matter is made of tiny particles; mixing, dissolving and separating substances."),
  T("conservation_mass", "Conservation of Mass", ["conservation of mass", "law of conservation"], "In mixing, dissolving and reactions in a closed system, total mass stays the same."),
  T("gravity_basic", "Gravity", ["gravity", "weight on the moon"], "Gravity pulls objects toward Earth's center and keeps the moon and planets in orbit."),
  T("food_energy", "Plants Make Food: Energy from the Sun", ["photosynthesis basic", "energy from the sun", "plants make food"], "How plants use sunlight to make food and how that energy reaches animals."),
  T("matter_cycles", "Decomposers & Matter Cycles", ["decomposer", "compost", "matter cycle"], "How decomposers recycle matter back into the soil and air."),
  T("earth_spheres", "Earth's Spheres", ["geosphere", "hydrosphere", "atmosphere", "biosphere"], "Earth's four spheres and how they interact."),
  T("earth_water", "Earth's Water: Fresh & Salt", ["fresh water", "salt water", "groundwater"], "How much of Earth's water is salty, fresh or frozen, and why fresh water is precious."),
  T("protect_earth", "Protecting Earth's Resources", ["recycle", "pollution", "conservation"], "How communities reduce pollution and protect land, water and living things."),
  T("stars_shadows", "Stars, Shadows & Earth's Rotation", ["day and night", "rotation", "constellation"], "Day and night, changing shadows, the sun as a star, and seasonal star patterns."),
  // ---- middle school
  T("sci_method", "The Scientific Method & Variables", ["scientific method", "hypothesis", "independent variable", "dependent variable"], "Hypotheses, independent, dependent and controlled variables, and fair tests."),
  T("lab_measurement", "Metric Measurement in the Lab", ["metric measurement", "milliliters", "lab measurement"], "Converting metric units of length, mass and volume used in science labs."),
  T("density", "Density", ["density", "mass and volume", "sink or float"], "Calculating density, mass and volume, and predicting whether objects sink or float."),
  T("temperature_scales", "Temperature Scales", ["celsius", "fahrenheit", "kelvin"], "Converting between Celsius, Fahrenheit and Kelvin."),
  T("moon_seasons", "Seasons, Moon Phases & Eclipses", ["moon phases", "eclipse", "seasons tilt"], "How Earth's tilt causes seasons, why the moon has phases, and how eclipses happen."),
  T("gravity_orbits", "Gravity & Orbits", ["orbit", "gravity mass distance"], "How mass and distance affect gravity, and how gravity shapes orbits and the solar system."),
  T("geologic_time", "Geologic Time & Earth's History", ["geologic time", "superposition", "index fossil"], "The geologic time scale, relative and absolute dating, and reading rock layers."),
  T("atmosphere_oceans", "Atmosphere & Ocean Circulation", ["atmosphere layers", "air mass", "ocean currents"], "Layers of the atmosphere, air masses and fronts, and how ocean currents affect climate."),
  T("climate_change", "Climate Change", ["climate change", "greenhouse effect", "global warming"], "The greenhouse effect, causes and evidence of climate change, and ways to reduce it."),
  T("heat_transfer", "Heat Transfer", ["conduction", "convection", "radiation", "insulator"], "Conduction, convection and radiation, and conductors versus insulators."),
  T("microscope", "Microscope Magnification", ["microscope", "magnification"], "Calculating total magnification and using microscope parts."),
  T("reproduction", "Reproduction in Plants & Animals", ["sexual reproduction", "asexual reproduction"], "Sexual and asexual reproduction and behaviors and structures that help reproduction succeed."),
  T("natural_selection", "Natural Selection & Adaptation", ["natural selection", "evolution", "darwin"], "Variation, mutation and natural selection, and how populations change over generations."),
  T("energy_pyramid", "Energy Pyramids (10% Rule)", ["energy pyramid", "10 percent rule", "trophic level"], "How only about 10% of energy passes to each level of a food chain."),
  T("phys_chem_changes", "Physical & Chemical Changes", ["physical change", "chemical change"], "Telling physical changes from chemical changes and recognizing signs of a reaction."),
  T("substances_mixtures", "Elements, Compounds & Mixtures", ["element", "compound", "mixture", "pure substance"], "Classifying matter as elements, compounds and homogeneous or heterogeneous mixtures."),
  T("kinetic_potential", "Kinetic & Potential Energy", ["kinetic energy", "potential energy", "ke pe"], "Calculating kinetic energy (½mv²) and gravitational potential energy (mgh)."),
  T("wave_equation", "Wave Speed, Frequency & Wavelength", ["wave speed", "frequency", "v = f lambda"], "Using v = f × λ to find wave speed, frequency and wavelength."),
  T("em_spectrum", "The Electromagnetic Spectrum", ["electromagnetic spectrum", "radio waves", "x-rays", "ultraviolet"], "The types of electromagnetic waves, their uses and dangers, from radio to gamma rays."),
  T("work_power", "Work & Power", ["work", "power", "joules", "watts"], "Calculating work (W = Fd) and power (P = W/t)."),
  // ---- high school biology
  T("biomolecules", "Biomolecules", ["carbohydrate", "lipid", "protein", "nucleic acid", "enzyme"], "Carbohydrates, lipids, proteins and nucleic acids, and how enzymes work."),
  T("cell_transport", "Cell Transport & Homeostasis", ["diffusion", "osmosis", "active transport", "homeostasis"], "Diffusion, osmosis and active transport, and how cells keep stable conditions."),
  T("dna_protein", "DNA, RNA & Protein Synthesis", ["dna", "rna", "transcription", "translation", "complementary strand"], "DNA structure, base pairing, transcription and translation — including writing complementary strands."),
  T("ecology_populations", "Population Ecology", ["carrying capacity", "population growth", "limiting factor"], "Population growth, limiting factors, carrying capacity and biodiversity."),
  T("classification", "Classification & Taxonomy", ["taxonomy", "classification", "binomial nomenclature"], "Domains, kingdoms and scientific names, and how organisms are classified."),
  // ---- high school chemistry
  T("atomic_structure", "Atomic Structure & Isotopes", ["protons neutrons electrons", "isotope", "mass number", "atomic number"], "Finding protons, neutrons and electrons from atomic number, mass number and charge."),
  T("electron_config", "Electron Shells & Valence Electrons", ["electron configuration", "valence electrons", "electron shells"], "Arranging electrons in shells for the first 20 elements and finding valence electrons."),
  T("periodic_trends", "Periodic Table Groups & Trends", ["periodic trends", "atomic radius", "electronegativity", "groups and periods"], "Groups, periods and trends in atomic radius, ionization energy and electronegativity."),
  T("bonding", "Ionic, Covalent & Metallic Bonds", ["ionic bond", "covalent bond", "metallic bond"], "How atoms bond by transferring or sharing electrons, and the properties that result."),
  T("balancing_equations", "Balancing Chemical Equations", ["balance equation", "balancing equations", "coefficients"], "Using coefficients to balance chemical equations so atoms are conserved."),
  T("reaction_types", "Types of Chemical Reactions", ["synthesis", "decomposition", "replacement reaction", "combustion"], "Synthesis, decomposition, single and double replacement and combustion reactions."),
  T("molar_mass", "Moles & Molar Mass", ["mole", "molar mass", "grams to moles"], "Calculating molar mass and converting between grams and moles."),
  T("acids_bases", "Acids, Bases & pH", ["acid", "base", "ph scale", "neutralization"], "The pH scale, properties of acids and bases, neutralization and calculating pH."),
  T("gas_laws", "Gas Laws", ["boyle's law", "charles's law", "gas law"], "Boyle's and Charles's laws for how gas pressure, volume and temperature are related."),
  T("molarity", "Solution Concentration (Molarity)", ["molarity", "concentration", "solution"], "Calculating molarity and how much solute is needed to make a solution."),
  // ---- high school physics
  T("kinematics", "Kinematics: Speed, Velocity & Acceleration", ["kinematics", "acceleration", "velocity"], "Calculating average speed, acceleration and distance for accelerating objects."),
  T("newton_second_law", "Newton's Second Law (F = ma)", ["f = ma", "newton's second law", "net force"], "Using F = ma to find force, mass or acceleration, including net force."),
  T("momentum", "Momentum & Collisions", ["momentum", "collision", "impulse"], "Calculating momentum and using conservation of momentum in collisions."),
  T("circuits", "Electric Circuits", ["ohm's law", "series circuit", "parallel circuit", "electric power"], "Ohm's law, series and parallel resistance, and electric power."),
  T("specific_heat", "Specific Heat (Q = mcΔT)", ["specific heat", "thermal energy", "q = mc delta t"], "Calculating heat energy with Q = mcΔT."),
  T("gravitation", "Universal Gravitation", ["universal gravitation", "inverse square law"], "How gravitational force changes with mass and distance (the inverse-square law)."),
  T("half_life", "Radioactivity & Half-Life", ["half-life", "radioactive decay", "radiometric dating"], "Calculating how much of a radioactive sample remains, and dating with half-lives."),
  // ---- high school earth & space
  T("universe", "Stars, Galaxies & the Big Bang", ["big bang", "galaxy", "star life cycle", "light-year"], "How stars shine and evolve, galaxies, and evidence for the Big Bang."),
  T("earth_systems_hs", "Plate Tectonics & Earth's Systems", ["plate boundary", "seafloor spreading", "feedback loop"], "Plate boundaries, Earth's interior and feedbacks between Earth's systems."),
  T("keplers_laws", "Kepler's Laws & Orbits", ["kepler's laws", "orbital period"], "Using Kepler's third law (T² = a³) to relate a planet's orbit size and period."),
  T("sustainability", "Human Impact & Sustainability", ["sustainability", "carbon footprint", "human impact"], "How human activity affects Earth's systems and how to use resources sustainably."),
  // ---- challenge
  T("challenge_science_riddles", "Challenge: Science Riddles", ["science riddle"], "Riddles about planets, animals, weather and matter for young scientists."),
  T("challenge_science_thinking", "Challenge: Think Like a Scientist", ["science puzzle", "thought experiment"], "Surprising questions and thought experiments that test real scientific reasoning."),
];

// ===================================================================== computed
const genConservationMass: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const a = randInt(5, 60), b = randInt(5, 60);
  const kind = pick(by(diff, { easy: ["dissolve", "melt"], medium: ["dissolve", "react", "melt"], hard: ["react", "missing", "open"] }));
  if (kind === "dissolve") return { q: `${a} g of salt is dissolved in ${b * 2} g of water. What is the mass of the salt water?`, a: `${a + b * 2} g` };
  if (kind === "melt") return { q: `A ${a} g ice cube melts completely in a sealed bag. What is the mass of the water?`, a: `${a} g` };
  if (kind === "react") return { q: `In a sealed container, ${a} g of one substance reacts with ${b} g of another. What is the total mass of the products?`, a: `${a + b} g` };
  if (kind === "missing") return { q: `In a closed system, ${a} g of A reacts with some B to make ${a + b} g of products. How much B reacted?`, a: `${b} g` };
  return { q: `Vinegar and baking soda (${a + b} g together) react in an OPEN cup, and the mass afterward is ${a + b - randInt(1, 4)} g. Where did the missing mass go?`, a: "a gas (carbon dioxide) escaped into the air" };
};

type Conv = [string, string, number];
const LAB_CONV: Conv[] = [["L", "mL", 1000], ["kg", "g", 1000], ["g", "mg", 1000], ["m", "cm", 100], ["cm", "mm", 10], ["km", "m", 1000]];
const genLabMeasurement: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const [big, small, f] = pick(LAB_CONV);
  const kind = pick(by(diff, { easy: ["down", "cm3"], medium: ["down", "up", "cm3"], hard: ["upDec", "down", "tool"] }));
  if (kind === "cm3") { const v = randInt(2, 90); return { q: `A sample has a volume of ${v} cm³. How many milliliters is that?`, a: `${v} mL` }; }
  if (kind === "tool") return pick([
    { q: "Which tool measures the volume of a liquid?", a: "a graduated cylinder" }, { q: "Which tool measures mass?", a: "a balance (scale)" },
    { q: "Which tool measures temperature?", a: "a thermometer" }, { q: "What is the SI unit of mass?", a: "the kilogram" },
  ]);
  const n = randInt(2, 15);
  if (kind === "down") return { q: `${n} ${big} = ___ ${small}`, a: `${n * f} ${small}` };
  if (kind === "up") return { q: `${n * f} ${small} = ___ ${big}`, a: `${n} ${big}` };
  const m = randInt(1, 9) * (f / 10) + n * f;
  return { q: `${m} ${small} = ___ ${big}`, a: `${num(m / f)} ${big}` };
};

const genDensity: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const d = diff === "easy" ? randInt(1, 9) : pick([0.5, 0.8, 1.5, 2.5, 2.7, 7.9, 11.3, 0.9, 3, 4]);
  const v = randInt(2, 20) * (d % 1 ? 2 : 1);
  const m = round(d * v, 2);
  const kind = pick(by(diff, { easy: ["d"], medium: ["d", "m", "v", "float"], hard: ["m", "v", "float", "unit"] }));
  if (kind === "d") return { q: `An object has a mass of ${num(m)} g and a volume of ${v} cm³. What is its density?`, a: `${num(d)} g/cm³` };
  if (kind === "m") return { q: `A material has a density of ${num(d)} g/cm³. What is the mass of ${v} cm³ of it?`, a: `${num(m)} g` };
  if (kind === "v") return { q: `An object has a mass of ${num(m)} g and a density of ${num(d)} g/cm³. What is its volume?`, a: `${v} cm³` };
  if (kind === "unit") { const vv = randInt(2, 30); return { q: `A rock is dropped into a graduated cylinder and the water rises from 50 mL to ${50 + vv} mL. The rock's mass is ${num(round(vv * d, 2))} g. What is its density?`, a: `${num(d)} g/cm³` }; }
  return { q: `An object has a density of ${num(d)} g/cm³. Will it sink or float in water (1 g/cm³)?`, a: d > 1 ? "sink" : "float" };
};

const genTemperature: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const c = randInt(-8, 20) * 5;
  const f = (c * 9) / 5 + 32;
  const kind = pick(by(diff, { easy: ["facts", "cToK"], medium: ["cToF", "fToC", "cToK"], hard: ["cToF", "fToC", "kToC", "kToF"] }));
  if (kind === "facts") return pick([
    { q: "At what temperature does water freeze in °C?", a: "0 °C" }, { q: "At what temperature does water boil at sea level in °C?", a: "100 °C" },
    { q: "At what temperature does water freeze in °F?", a: "32 °F" }, { q: "At what temperature does water boil at sea level in °F?", a: "212 °F" },
    { q: "What is normal human body temperature in °C (approximately)?", a: "37 °C" },
  ]);
  if (kind === "cToF") return { q: `Convert ${c} °C to °F. (°F = 9/5 × °C + 32)`, a: `${f} °F` };
  if (kind === "fToC") return { q: `Convert ${f} °F to °C. (°C = 5/9 × (°F − 32))`, a: `${c} °C` };
  if (kind === "cToK") return { q: `Convert ${c} °C to kelvin. (K = °C + 273)`, a: `${c + 273} K` };
  if (kind === "kToC") return { q: `Convert ${c + 273} K to °C.`, a: `${c} °C` };
  return { q: `Convert ${c + 273} K to °F.`, a: `${f} °F` };
};

const genMicroscope: Gen = (grade, diff, rng) => {
  const { pick } = makeHelpers(rng);
  const ocular = pick([10, 15]), obj = pick([4, 10, 40, 100]);
  const kind = pick(by(diff, { easy: ["total", "parts"], medium: ["total", "objective"], hard: ["objective", "size", "total"] }));
  if (kind === "total") return { q: `The eyepiece is ${ocular}× and the objective lens is ${obj}×. What is the total magnification?`, a: `${ocular * obj}×` };
  if (kind === "objective") return { q: `The total magnification is ${ocular * obj}× and the eyepiece is ${ocular}×. What is the objective lens?`, a: `${obj}×` };
  if (kind === "parts") return pick([
    { q: "Which microscope part do you look through?", a: "the eyepiece (ocular lens)" }, { q: "Which part holds the slide?", a: "the stage" },
    { q: "Which knob should you use first to focus on low power?", a: "the coarse adjustment knob" }, { q: "Which knob makes small focus changes on high power?", a: "the fine adjustment knob" },
  ]);
  const real = pick([0.01, 0.02, 0.05, 0.1]);
  return { q: `A cell appears ${num(real * ocular * obj)} mm long at ${ocular * obj}× magnification. What is its actual length?`, a: `${num(real)} mm` };
};

const genEnergyPyramid: Gen = (grade, diff, rng) => {
  const { pick } = makeHelpers(rng);
  const base = pick([1000, 2000, 5000, 10000, 20000, 50000, 100000]);
  const levels = ["producers", "primary consumers", "secondary consumers", "tertiary consumers"];
  const kind = pick(by(diff, { easy: ["percent", "next"], medium: ["next", "two"], hard: ["two", "three", "back"] }));
  if (kind === "percent") return { q: "About what percent of energy passes from one level of an energy pyramid to the next?", a: "about 10%" };
  if (kind === "next") return { q: `Producers have ${base.toLocaleString("en-US")} kJ of energy. About how much reaches the primary consumers?`, a: `${(base / 10).toLocaleString("en-US")} kJ` };
  if (kind === "two") return { q: `Producers have ${base.toLocaleString("en-US")} kJ of energy. About how much reaches the ${levels[2]}?`, a: `${(base / 100).toLocaleString("en-US")} kJ` };
  if (kind === "three") return { q: `Producers have ${base.toLocaleString("en-US")} kJ of energy. About how much reaches the ${levels[3]}?`, a: `${num(base / 1000)} kJ` };
  return { q: `Secondary consumers get ${num(base / 100)} kJ. About how much energy did the producers have?`, a: `${base.toLocaleString("en-US")} kJ` };
};

const genKineticPotential: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const m = randInt(1, 20) * (diff === "easy" ? 2 : 1), v = randInt(1, 12), h = randInt(1, 30);
  const kind = pick(by(diff, { easy: ["ke", "pe"], medium: ["ke", "pe", "which"], hard: ["vFromKe", "hFromPe", "drop", "ke"] }));
  if (kind === "ke") return { q: `${An(m)} ${m} kg object moves at ${v} m/s. What is its kinetic energy? (KE = ½mv²)`, a: `${num(0.5 * m * v * v)} J` };
  if (kind === "pe") return { q: `${An(m)} ${m} kg object is ${h} m above the ground. What is its potential energy? (PE = mgh, g = 10 m/s²)`, a: `${m * 10 * h} J` };
  if (kind === "which") return pick([
    { q: "A roller coaster is at the very top of a hill. Is its potential energy at a maximum or minimum?", a: "maximum" },
    { q: "If an object's speed doubles, what happens to its kinetic energy?", a: "it becomes 4 times as large" },
    { q: "If an object's mass doubles at the same speed, what happens to its kinetic energy?", a: "it doubles" },
  ]);
  if (kind === "vFromKe") { const mm = randInt(1, 10) * 2; return { q: `${An(mm)} ${mm} kg ball has ${num(0.5 * mm * v * v)} J of kinetic energy. How fast is it moving?`, a: `${v} m/s` }; }
  if (kind === "hFromPe") return { q: `${An(m)} ${m} kg box has ${m * 10 * h} J of potential energy. How high is it? (g = 10 m/s²)`, a: `${h} m` };
  return { q: `${An(m)} ${m} kg ball is dropped from ${h} m. Ignoring air resistance, what is its kinetic energy just before it hits the ground? (g = 10 m/s²)`, a: `${m * 10 * h} J` };
};

const genWaveEquation: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const f = randInt(2, 50), lam = randInt(1, 20) / (diff === "hard" ? 2 : 1);
  const v = round(f * lam, 2);
  const kind = pick(by(diff, { easy: ["v"], medium: ["v", "f", "lam"], hard: ["f", "lam", "period"] }));
  if (kind === "v") return { q: `A wave has a frequency of ${f} Hz and a wavelength of ${num(lam)} m. What is its speed? (v = fλ)`, a: `${num(v)} m/s` };
  if (kind === "f") return { q: `A wave travels at ${num(v)} m/s with a wavelength of ${num(lam)} m. What is its frequency?`, a: `${f} Hz` };
  if (kind === "lam") return { q: `A wave travels at ${num(v)} m/s with a frequency of ${f} Hz. What is its wavelength?`, a: `${num(lam)} m` };
  const T = pick([2, 4, 5, 10, 20]);
  return { q: `A wave has a period of 1/${T} s. What is its frequency?`, a: `${T} Hz` };
};

const genWorkPower: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const F = randInt(5, 100), d = randInt(2, 20), t = pick([2, 4, 5, 10]);
  const W = F * d;
  const kind = pick(by(diff, { easy: ["w"], medium: ["w", "p", "d"], hard: ["p", "f", "noWork"] }));
  if (kind === "w") return { q: `A force of ${F} N pushes a box ${d} m. How much work is done? (W = Fd)`, a: `${W} J` };
  if (kind === "p") return { q: `${W} J of work is done in ${t} s. What is the power? (P = W/t)`, a: `${num(W / t)} W` };
  if (kind === "d") return { q: `${W} J of work is done with a force of ${F} N. How far did the object move?`, a: `${d} m` };
  if (kind === "f") return { q: `A motor does ${W} J of work lifting a load ${d} m. What force did it apply?`, a: `${F} N` };
  return { q: `You push hard on a wall for ${t} s but it doesn't move. How much work did you do on the wall?`, a: "0 J (no distance moved)" };
};

const COMP: Record<string, string> = { A: "T", T: "A", C: "G", G: "C" };
const genDnaStrands: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const len = by(diff, { easy: 6, medium: 9, hard: 12 });
  const s = Array.from({ length: len }, () => pick(["A", "T", "C", "G"])).join("");
  const kind = pick(by(diff, { easy: ["comp"], medium: ["comp", "mrna"], hard: ["mrna", "codons", "comp"] }));
  if (kind === "comp") return { q: `Write the complementary DNA strand for: ${s}`, a: s.split("").map((b) => COMP[b]).join("") };
  const mrna = s.split("").map((b) => (b === "A" ? "U" : COMP[b])).join("");
  if (kind === "mrna") return { q: `Transcribe this DNA template strand into mRNA: ${s}`, a: mrna };
  const bases = len * randInt(1, 3); // len is a multiple of 3
  return { q: `How many codons are in an mRNA strand that is ${bases} bases long?`, a: `${bases / 3}` };
};

// [symbol, name, Z, common mass number]
const ELEMENTS: [string, string, number, number][] = [
  ["H", "hydrogen", 1, 1], ["He", "helium", 2, 4], ["Li", "lithium", 3, 7], ["Be", "beryllium", 4, 9], ["B", "boron", 5, 11],
  ["C", "carbon", 6, 12], ["N", "nitrogen", 7, 14], ["O", "oxygen", 8, 16], ["F", "fluorine", 9, 19], ["Ne", "neon", 10, 20],
  ["Na", "sodium", 11, 23], ["Mg", "magnesium", 12, 24], ["Al", "aluminum", 13, 27], ["Si", "silicon", 14, 28], ["P", "phosphorus", 15, 31],
  ["S", "sulfur", 16, 32], ["Cl", "chlorine", 17, 35], ["Ar", "argon", 18, 40], ["K", "potassium", 19, 39], ["Ca", "calcium", 20, 40],
];
const IONS: [string, number][] = [["Na", 1], ["K", 1], ["Mg", 2], ["Ca", 2], ["Al", 3], ["Cl", -1], ["F", -1], ["O", -2], ["S", -2], ["N", -3]];
const genAtomicStructure: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const [sym, name, Z, A] = pick(ELEMENTS.slice(diff === "easy" ? 0 : 2));
  const kind = pick(by(diff, { easy: ["p", "e", "n"], medium: ["n", "isotope", "p"], hard: ["isotope", "ion", "massNum"] }));
  if (kind === "p") return { q: `How many protons does an atom of ${name} (${sym}, atomic number ${Z}) have?`, a: `${Z}` };
  if (kind === "e") return { q: `How many electrons does a neutral atom of ${name} (atomic number ${Z}) have?`, a: `${Z}` };
  if (kind === "n") return { q: `${name[0].toUpperCase() + name.slice(1)}-${A} has atomic number ${Z}. How many neutrons does it have?`, a: `${A - Z}` };
  if (kind === "isotope") { const A2 = A + randInt(1, 3); return { q: `An isotope of ${name} (atomic number ${Z}) has a mass number of ${A2}. How many protons and neutrons does it have?`, a: `${Z} protons, ${A2 - Z} neutrons` }; }
  if (kind === "massNum") return { q: `An atom has ${Z} protons and ${A - Z} neutrons. What is its mass number, and which element is it?`, a: `${A}, ${name}` };
  const [isym, ch] = pick(IONS);
  const el = ELEMENTS.find((e) => e[0] === isym)!;
  const label = `${isym}${Math.abs(ch) === 1 ? "" : Math.abs(ch)}${ch > 0 ? "+" : "−"}`;
  return { q: `How many electrons does the ion ${label} have? (${el[1]}, atomic number ${el[2]})`, a: `${el[2] - ch}` };
};

const genElectronConfig: Gen = (grade, diff, rng) => {
  const { pick } = makeHelpers(rng);
  const [sym, name, Z] = pick(ELEMENTS.filter((e) => by(diff, { easy: e[2] <= 10, medium: e[2] <= 18, hard: true })));
  const shells: number[] = [];
  let left = Z;
  for (const cap of [2, 8, 8, 2]) { if (left <= 0) break; const n = Math.min(cap, left); shells.push(n); left -= n; }
  const valence = shells[shells.length - 1];
  const kind = pick(by(diff, { easy: ["shells", "valence"], medium: ["shells", "valence", "count"], hard: ["valence", "count", "group"] }));
  if (kind === "shells") return { q: `Write the electron arrangement (electrons per shell) for ${name}, atomic number ${Z}.`, a: shells.join(", ") };
  if (kind === "valence") return { q: `How many valence electrons does ${name} (${sym}, atomic number ${Z}) have?`, a: `${valence}` };
  if (kind === "count") return { q: `How many electron shells does a ${name} atom (atomic number ${Z}) have?`, a: `${shells.length}` };
  const group = Z === 2 ? 18 : valence <= 2 ? valence : valence + 10;
  return { q: `${name[0].toUpperCase() + name.slice(1)} has electron arrangement ${shells.join(", ")}. Which group of the periodic table is it in?`, a: `group ${group}` };
};

const MASS: Record<string, number> = { H: 1, C: 12, N: 14, O: 16, Na: 23, Mg: 24, Al: 27, S: 32, Cl: 35.5, K: 39, Ca: 40 };
const COMPOUNDS: [string, string, [string, number][]][] = [
  ["H₂O", "water", [["H", 2], ["O", 1]]], ["CO₂", "carbon dioxide", [["C", 1], ["O", 2]]], ["NaCl", "sodium chloride", [["Na", 1], ["Cl", 1]]],
  ["CH₄", "methane", [["C", 1], ["H", 4]]], ["NH₃", "ammonia", [["N", 1], ["H", 3]]], ["O₂", "oxygen gas", [["O", 2]]],
  ["MgO", "magnesium oxide", [["Mg", 1], ["O", 1]]], ["CaCO₃", "calcium carbonate", [["Ca", 1], ["C", 1], ["O", 3]]],
  ["H₂SO₄", "sulfuric acid", [["H", 2], ["S", 1], ["O", 4]]], ["C₆H₁₂O₆", "glucose", [["C", 6], ["H", 12], ["O", 6]]],
  ["NaOH", "sodium hydroxide", [["Na", 1], ["O", 1], ["H", 1]]], ["HCl", "hydrochloric acid", [["H", 1], ["Cl", 1]]],
  ["Al₂O₃", "aluminum oxide", [["Al", 2], ["O", 3]]], ["KCl", "potassium chloride", [["K", 1], ["Cl", 1]]],
];
/** Only the atomic masses a question needs, e.g. "(Mg = 24, O = 16)" */
const massHint = (parts: [string, number][]) => `(${parts.map(([el]) => `${el} = ${MASS[el]}`).join(", ")})`;
const genMolarMass: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const [formula, name, parts] = pick(diff === "easy" ? COMPOUNDS.slice(0, 7) : COMPOUNDS);
  const M = parts.reduce((s, [el, k]) => s + MASS[el] * k, 0);
  const kind = pick(by(diff, { easy: ["mm"], medium: ["mm", "moles", "grams"], hard: ["moles", "grams", "particles"] }));
  if (kind === "mm") return { q: `What is the molar mass of ${formula} (${name})? ${massHint(parts)}`, a: `${num(M)} g/mol` };
  const n = pick([0.5, 1, 2, 3, 4, 0.25, 5]);
  if (kind === "moles") return { q: `How many moles are in ${num(n * M)} g of ${formula}? ${massHint(parts)}`, a: `${num(n)} mol` };
  if (kind === "grams") return { q: `What is the mass of ${num(n)} mol of ${formula}? ${massHint(parts)}`, a: `${num(n * M)} g` };
  const k = randInt(1, 5);
  const count = round(k * 6.02, 2);
  return { q: `How many molecules are in ${k} mol of ${formula}? (Avogadro's number = 6.02 × 10^23)`, a: count >= 10 ? `${num(round(count / 10, 3))} × 10^24` : `${num(count)} × 10^23` };
};

const genAcidsBases: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const p = randInt(1, 13);
  return pick([
    { q: `A solution has [H⁺] = 1 × 10^-${p} mol/L. What is its pH?`, a: `${p}` },
    { q: `A solution has pH ${p}. Is it acidic, basic or neutral?`, a: p < 7 ? "acidic" : p > 7 ? "basic" : "neutral" },
    { q: `A solution has pH ${p}. What is [H⁺]?`, a: `1 × 10^-${p} mol/L` },
  ]);
};

const genGasLaws: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const kind = pick(by(diff, { easy: ["boyleConcept", "boyle"], medium: ["boyle", "charles"], hard: ["boyle", "charlesC", "charles"] }));
  if (kind === "boyleConcept") return pick([
    { q: "At constant temperature, if the volume of a gas decreases, what happens to its pressure?", a: "it increases" },
    { q: "At constant pressure, if a gas is heated, what happens to its volume?", a: "it increases" },
    { q: "What temperature scale must be used in gas law calculations?", a: "kelvin" },
  ]);
  if (kind === "boyle") { const P1 = randInt(1, 6) * 50, V1 = randInt(2, 12), k = pick([2, 3, 4]); const up = rng() < 0.5; return up
    ? { q: `A gas at ${P1} kPa has a volume of ${V1 * k} L. At constant temperature, the pressure rises to ${P1 * k} kPa. What is the new volume?`, a: `${V1} L` }
    : { q: `A gas at ${P1 * k} kPa has a volume of ${V1} L. At constant temperature, the volume grows to ${V1 * k} L. What is the new pressure?`, a: `${P1} kPa` }; }
  if (kind === "charles") { const T1 = pick([200, 250, 300, 400]), V1 = randInt(2, 10), k = pick([2, 1.5]); return { q: `A gas has a volume of ${V1} L at ${T1} K. At constant pressure it is heated to ${T1 * k} K. What is its new volume?`, a: `${num(V1 * k)} L` }; }
  const V1 = randInt(2, 10) * 3;
  return { q: `A gas has a volume of ${V1} L at 27 °C. At constant pressure it is heated to 127 °C. What is its new volume? (K = °C + 273)`, a: `${num((V1 * 400) / 300)} L` };
};

const genMolarity: Gen = (grade, diff, rng) => {
  const { pick } = makeHelpers(rng);
  const mol = pick([0.5, 1, 1.5, 2, 3, 0.25]), L = pick([0.5, 1, 2, 0.25]);
  const kind = pick(by(diff, { easy: ["M"], medium: ["M", "mol"], hard: ["mol", "grams", "dilute"] }));
  if (kind === "M") return { q: `${num(mol)} mol of solute is dissolved to make ${num(L)} L of solution. What is the molarity?`, a: `${num(mol / L)} M` };
  if (kind === "mol") return { q: `How many moles of solute are in ${num(L)} L of a ${num(mol / L)} M solution?`, a: `${num(mol)} mol` };
  if (kind === "grams") return { q: `How many grams of NaCl (58.5 g/mol) are needed to make ${num(L)} L of a ${num(mol / L)} M solution?`, a: `${num(mol * 58.5)} g` };
  const M1 = pick([2, 4, 6]), V1 = pick([100, 200, 250]), k = pick([2, 4]);
  return { q: `${V1} mL of a ${M1} M solution is diluted to ${V1 * k} mL. What is the new molarity? (M₁V₁ = M₂V₂)`, a: `${num(M1 / k)} M` };
};

const genKinematics: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const t = randInt(2, 10), a = randInt(1, 6), vi = diff === "easy" ? 0 : randInt(0, 20);
  const vf = vi + a * t;
  const kind = pick(by(diff, { easy: ["speed", "accel"], medium: ["accel", "vf", "speed"], hard: ["dist", "vf", "accel", "decel"] }));
  if (kind === "speed") { const d = randInt(2, 50) * t; return { q: `A car travels ${d} m in ${t} s. What is its average speed?`, a: `${num(d / t)} m/s` }; }
  if (kind === "accel") return { q: `A car speeds up from ${vi} m/s to ${vf} m/s in ${t} s. What is its acceleration?`, a: `${a} m/s²` };
  if (kind === "vf") return { q: `A bike moving at ${vi} m/s accelerates at ${a} m/s² for ${t} s. What is its final speed?`, a: `${vf} m/s` };
  if (kind === "decel") return { q: `A car moving at ${vf} m/s brakes to a stop in ${t} s. What is its acceleration?`, a: `-${a} m/s²` };
  return { q: `An object starts from rest and accelerates at ${a} m/s² for ${t} s. How far does it travel? (d = ½at²)`, a: `${num(0.5 * a * t * t)} m` };
};

const genNewton2: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const m = randInt(1, 50), a = randInt(1, 12), F = m * a;
  const kind = pick(by(diff, { easy: ["F"], medium: ["F", "a", "m"], hard: ["net", "a", "m", "weight"] }));
  if (kind === "F") return { q: `What force is needed to accelerate a ${m} kg object at ${a} m/s²?`, a: `${F} N` };
  if (kind === "a") return { q: `A net force of ${F} N acts on a ${m} kg object. What is its acceleration?`, a: `${a} m/s²` };
  if (kind === "m") return { q: `A net force of ${F} N gives an object an acceleration of ${a} m/s². What is its mass?`, a: `${m} kg` };
  if (kind === "weight") return { q: `What is the weight of a ${m} kg object on Earth? (g = 9.8 m/s²)`, a: `${num(round(m * 9.8, 1))} N` };
  const fr = randInt(1, F - 1 || 1);
  return { q: `${An(m)} ${m} kg box is pushed with ${F + fr} N while friction pushes back with ${fr} N. What is its acceleration?`, a: `${a} m/s²` };
};

const genMomentum: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const m = randInt(1, 20), v = randInt(1, 15);
  const kind = pick(by(diff, { easy: ["p"], medium: ["p", "v", "stick"], hard: ["stick", "recoil", "impulse"] }));
  if (kind === "p") return { q: `What is the momentum of a ${m} kg object moving at ${v} m/s?`, a: `${m * v} kg·m/s` };
  if (kind === "v") return { q: `${An(m)} ${m} kg object has a momentum of ${m * v} kg·m/s. How fast is it moving?`, a: `${v} m/s` };
  if (kind === "stick") { const m2 = randInt(1, 20); const vf = frac(m * v, m + m2); return { q: `${An(m)} ${m} kg cart moving at ${v} m/s hits a ${m2} kg cart at rest, and they stick together. What is their speed afterward?`, a: `${vf.d === 1 ? vf.n : num(round(vf.n / vf.d, 2))} m/s` }; }
  if (kind === "recoil") { const M = m * randInt(2, 5); const vr = frac(m * v, M); return { q: `${An(M)} ${M} kg cannon fires a ${m} kg ball at ${v} m/s. What is the cannon's recoil speed?`, a: `${vr.d === 1 ? vr.n : num(round(vr.n / vr.d, 2))} m/s` }; }
  const t = pick([0.1, 0.2, 0.5]);
  return { q: `${An(m)} ${m} kg ball's speed changes by ${v} m/s in ${t} s. What average force acted on it? (FΔt = mΔv)`, a: `${num(round((m * v) / t, 2))} N` };
};

const genCircuits: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const I = randInt(1, 5), R = randInt(2, 20), V = I * R;
  const kind = pick(by(diff, { easy: ["V", "I"], medium: ["R", "series", "power"], hard: ["parallel", "series", "power2", "energy"] }));
  if (kind === "V") return { q: `A current of ${I} A flows through a ${R} Ω resistor. What is the voltage? (V = IR)`, a: `${V} V` };
  if (kind === "I") return { q: `${V} V is applied across a ${R} Ω resistor. What is the current?`, a: `${I} A` };
  if (kind === "R") return { q: `${V} V drives a current of ${I} A. What is the resistance?`, a: `${R} Ω` };
  if (kind === "series") { const R2 = randInt(2, 20), R3 = randInt(2, 20); return { q: `Resistors of ${R} Ω, ${R2} Ω and ${R3} Ω are connected in series. What is the total resistance?`, a: `${R + R2 + R3} Ω` }; }
  if (kind === "parallel") { const [r1, r2] = pick([[6, 3], [12, 6], [4, 4], [10, 10], [20, 5], [12, 4], [30, 15], [6, 12]]); return { q: `Resistors of ${r1} Ω and ${r2} Ω are connected in parallel. What is the total resistance?`, a: `${num((r1 * r2) / (r1 + r2))} Ω` }; }
  if (kind === "power") return { q: `A device uses ${I} A at ${V} V. What power does it use? (P = VI)`, a: `${I * V} W` };
  if (kind === "power2") return { q: `A current of ${I} A flows through a ${R} Ω resistor. What power is used? (P = I²R)`, a: `${I * I * R} W` };
  const P = pick([60, 100, 1000, 1500]), h = pick([2, 3, 5, 10]);
  return { q: `${An(P)} ${P} W appliance runs for ${h} hours. How much energy does it use in kilowatt-hours?`, a: `${num((P * h) / 1000)} kWh` };
};

const genSpecificHeat: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const [mat, c] = pick([["water", 4.18], ["aluminum", 0.9], ["iron", 0.45], ["copper", 0.39]] as const);
  const m = randInt(1, 20) * 10, dT = randInt(2, 40);
  const Q = round(m * c * dT, 2);
  const kind = pick(by(diff, { easy: ["Q"], medium: ["Q", "dT"], hard: ["dT", "m", "compare"] }));
  if (kind === "Q") return { q: `How much heat is needed to raise ${m} g of ${mat} by ${dT} °C? (c = ${c} J/g·°C)`, a: `${num(Q)} J` };
  if (kind === "dT") return { q: `${num(Q)} J of heat is added to ${m} g of ${mat} (c = ${c} J/g·°C). By how much does its temperature rise?`, a: `${dT} °C` };
  if (kind === "m") return { q: `${num(Q)} J raises the temperature of some ${mat} (c = ${c} J/g·°C) by ${dT} °C. What is its mass?`, a: `${m} g` };
  return { q: "Equal masses of water (c = 4.18) and iron (c = 0.45) get the same amount of heat. Which warms up more?", a: "iron" };
};

const genGravitation: Gen = (grade, diff, rng) => {
  const { pick } = makeHelpers(rng);
  const k = pick([2, 3, 4]);
  const kind = pick(by(diff, { easy: ["mass", "facts"], medium: ["mass", "dist"], hard: ["dist", "both", "closer"] }));
  if (kind === "facts") return pick([
    { q: "Who described the law of universal gravitation?", a: "Isaac Newton" },
    { q: "Does every object with mass attract every other object with mass?", a: "yes" },
    { q: "What happens to gravitational force as two objects get closer?", a: "it gets stronger" },
    { q: "Why don't we feel the gravitational pull of a book on a desk?", a: "the book's mass is too small for the force to be noticeable" },
    { q: "What is the acceleration due to gravity near Earth's surface?", a: "about 9.8 m/s²" },
  ]);
  if (kind === "mass") return { q: `If the mass of one object is multiplied by ${k}, what happens to the gravitational force between two objects?`, a: `it is multiplied by ${k}` };
  if (kind === "dist") return { q: `If the distance between two objects is multiplied by ${k}, what happens to the gravitational force?`, a: `it becomes 1/${k * k} as strong` };
  if (kind === "closer") return { q: `If the distance between two objects is divided by ${k}, what happens to the gravitational force?`, a: `it becomes ${k * k} times as strong` };
  return { q: `Both masses are doubled and the distance is doubled. What happens to the gravitational force?`, a: "it stays the same" };
};

const genHalfLife: Gen = (grade, diff, rng) => {
  const { randInt, pick } = makeHelpers(rng);
  const start = pick([80, 160, 200, 320, 400, 640, 800, 1000]), h = pick([5, 8, 10, 12, 20, 30, 5730]), n = randInt(1, by(diff, { easy: 2, medium: 3, hard: 4 }));
  const left = start / Math.pow(2, n);
  const kind = pick(by(diff, { easy: ["left"], medium: ["left", "time"], hard: ["time", "frac", "left"] }));
  const unit = h === 5730 ? "years" : "days";
  if (kind === "left") return { q: `${An(start)} ${start} g sample has a half-life of ${h} ${unit}. How much remains after ${h * n} ${unit}?`, a: `${num(left)} g` };
  if (kind === "time") return { q: `A sample with a half-life of ${h} ${unit} drops from ${start} g to ${num(left)} g. How much time has passed?`, a: `${(h * n).toLocaleString("en-US")} ${unit}` };
  return { q: `What fraction of a radioactive sample remains after ${n} half-lives?`, a: fStr(frac(1, Math.pow(2, n))) };
};

const genKepler: Gen = (grade, diff, rng) => {
  const { pick } = makeHelpers(rng);
  const [a, T] = pick([[1, 1], [4, 8], [9, 27], [16, 64], [25, 125], [100, 1000]] as const);
  const kind = pick(by(diff, { easy: ["law"], medium: ["T", "law"], hard: ["T", "a"] }));
  if (kind === "law") return pick([
    { q: "What is one astronomical unit (AU)?", a: "the average distance from Earth to the sun" },
    { q: "Who discovered the three laws of planetary motion?", a: "Johannes Kepler" },
    { q: "What is a planet's orbital period?", a: "the time it takes to orbit the sun once" },
    { q: "Where is a planet moving slowest in its orbit?", a: "at its farthest point from the sun (aphelion)" },
    { q: "What shape is a planet's orbit, according to Kepler's first law?", a: "an ellipse, with the sun at one focus" },
    { q: "According to Kepler's second law, does a planet move faster or slower when it is closer to the sun?", a: "faster" },
    { q: "Do planets farther from the sun take more or less time to orbit?", a: "more time" },
  ]);
  if (kind === "T") return { q: `Using T² = a³ (T in years, a in AU), what is the orbital period of an object at ${a} AU?`, a: `${T} years` };
  return { q: `Using T² = a³ (T in years, a in AU), an object orbits the sun in ${T} years. How far is it from the sun?`, a: `${a} AU` };
};

const genBalancing: Gen = (grade, diff, rng) => {
  const { pick } = makeHelpers(rng);
  const lvl = by(diff, { easy: [1, 2], medium: [1, 2], hard: [2, 3] });
  const [u, b] = pick(B.BALANCING.filter((x) => lvl.includes(x[2])));
  return { q: `Balance the equation: ${u}`, a: b };
};

export const SCIENCE_SKILL_GENERATORS: Record<string, Gen> = {
  sound_vibrations: bankGen(A.SOUND_VIBRATIONS), light_shadows: bankGen(A.LIGHT_SHADOWS), parents_offspring: bankGen(A.PARENTS_OFFSPRING),
  structures_survival: bankGen(A.STRUCTURES_SURVIVAL), sky_patterns: bankGen(A.SKY_PATTERNS), properties_materials: bankGen(A.PROPERTIES_MATERIALS),
  heat_changes: bankGen(A.HEAT_CHANGES), plant_needs: bankGen(A.PLANT_NEEDS), pollination_seeds: bankGen(A.POLLINATION_SEEDS),
  landforms_water: bankGen(A.LANDFORMS_WATER), earth_changes: bankGen(A.EARTH_CHANGES), balanced_forces: bankGen(A.BALANCED_FORCES),
  life_cycles: bankGen(A.LIFE_CYCLES), inherited_traits: bankGen(A.INHERITED_TRAITS), adaptations: bankGen(A.ADAPTATIONS), fossils: bankGen(A.FOSSILS),
  animal_groups: bankGen(A.ANIMAL_GROUPS), weather_climate: bankGen(A.WEATHER_CLIMATE), natural_hazards: bankGen(A.NATURAL_HAZARDS),
  energy_forms: bankGen(A.ENERGY_FORMS), waves_basic: bankGen(A.WAVES_BASIC), rocks_erosion: bankGen(A.ROCKS_EROSION), earth_patterns: bankGen(A.EARTH_PATTERNS),
  energy_resources: bankGen(A.ENERGY_RESOURCES), matter_particles: bankGen(A.MATTER_PARTICLES), conservation_mass: genConservationMass,
  gravity_basic: bankGen(A.GRAVITY_BASIC), food_energy: bankGen(A.FOOD_ENERGY), matter_cycles: bankGen(A.MATTER_CYCLES), earth_spheres: bankGen(A.EARTH_SPHERES),
  earth_water: bankGen(A.EARTH_WATER), protect_earth: bankGen(A.PROTECT_EARTH), stars_shadows: bankGen(A.STARS_SHADOWS),
  sci_method: bankGen(B.SCI_METHOD), lab_measurement: genLabMeasurement, density: genDensity, temperature_scales: genTemperature,
  moon_seasons: bankGen(B.MOON_SEASONS), gravity_orbits: bankGen(B.GRAVITY_ORBITS), geologic_time: bankGen(B.GEOLOGIC_TIME),
  atmosphere_oceans: bankGen(B.ATMOSPHERE_OCEANS), climate_change: bankGen(B.CLIMATE_CHANGE), heat_transfer: bankGen(B.HEAT_TRANSFER),
  microscope: genMicroscope, reproduction: bankGen(B.REPRODUCTION), natural_selection: bankGen(B.NATURAL_SELECTION), energy_pyramid: genEnergyPyramid,
  phys_chem_changes: bankGen(B.PHYS_CHEM_CHANGES), substances_mixtures: bankGen(B.SUBSTANCES_MIXTURES), kinetic_potential: genKineticPotential,
  wave_equation: genWaveEquation, em_spectrum: bankGen(B.EM_SPECTRUM), work_power: genWorkPower,
  biomolecules: bankGen(B.BIOMOLECULES), cell_transport: bankGen(B.CELL_TRANSPORT), dna_protein: mixGen(genDnaStrands, 0.4, B.DNA_PROTEIN),
  ecology_populations: bankGen(B.ECOLOGY_POPULATIONS), classification: bankGen(B.CLASSIFICATION),
  atomic_structure: genAtomicStructure, electron_config: genElectronConfig, periodic_trends: bankGen(B.PERIODIC_TRENDS), bonding: bankGen(B.BONDING),
  balancing_equations: genBalancing, reaction_types: bankGen(B.REACTION_TYPES), molar_mass: genMolarMass,
  acids_bases: mixGen(genAcidsBases, 0.4, B.ACIDS_BASES), gas_laws: genGasLaws, molarity: genMolarity,
  kinematics: genKinematics, newton_second_law: genNewton2, momentum: genMomentum, circuits: genCircuits, specific_heat: genSpecificHeat,
  gravitation: genGravitation, half_life: genHalfLife,
  universe: bankGen(B.UNIVERSE), earth_systems_hs: bankGen(B.EARTH_SYSTEMS_HS), keplers_laws: genKepler, sustainability: bankGen(B.SUSTAINABILITY),
  challenge_science_riddles: bankGen(A.SCIENCE_RIDDLES), challenge_science_thinking: bankGen(B.SCIENCE_THINKING),
};
