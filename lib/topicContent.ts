import { SubjectId } from "@/lib/subjects";

/**
 * One- or two-sentence description of what each topic covers. Rendered on the
 * public /worksheets topic pages so every page carries its own explanation
 * instead of only a templated title — that's what makes these pages useful
 * (and indexable) rather than near-duplicates of each other.
 */
const TOPIC_DESCRIPTIONS: Record<SubjectId, Record<string, string>> = {
  math: {
    addsub: "Practice adding and subtracting whole numbers, building fact fluency and the habit of checking an answer by working backwards.",
    counting: "Counting forwards and backwards, skip counting, and finishing number sequences — the foundation for place value and early addition.",
    comparing: "Deciding which number is greater or smaller and using the >, < and = symbols correctly.",
    shapes: "Naming common 2D and 3D shapes and counting their sides, corners and faces.",
    placevalue: "Reading the value of each digit in a number and rounding to the nearest ten, hundred or thousand.",
    multdiv: "Multiplication and division facts, and seeing how the two operations undo each other.",
    fractions_intro: "What a fraction means — parts of a whole, numerators and denominators — with simple fractions of shapes and sets.",
    decimals_intro: "Tenths and hundredths, reading and writing decimals, and how decimals connect to fractions and place value.",
    wordproblems: "Short real-life stories that ask students to choose the right operation and solve — reading carefully is half the skill.",
    fractions: "A mixed set covering the main fraction skills: simplifying, comparing, and adding, subtracting, multiplying and dividing fractions.",
    fractions_add_sub: "Adding and subtracting fractions, including finding a common denominator and simplifying the result.",
    fractions_mul_div: "Multiplying fractions straight across and dividing by multiplying by the reciprocal.",
    fractions_simplify: "Reducing fractions to lowest terms by dividing the numerator and denominator by their greatest common factor.",
    fractions_compare: "Ordering and comparing fractions, using common denominators or cross-multiplication.",
    decimals: "A mixed set of decimal skills: adding, subtracting, multiplying, dividing, rounding and comparing decimals.",
    decimals_add_sub: "Adding and subtracting decimals by lining up the decimal point.",
    decimals_mul_div: "Multiplying and dividing decimals and placing the decimal point correctly in the answer.",
    decimals_round: "Rounding decimals to the nearest whole number, tenth or hundredth.",
    decimals_compare: "Comparing and ordering decimals by looking at place value digit by digit.",
    geometry: "A mixed set of area and volume problems for rectangles, parallelograms, triangles and rectangular prisms.",
    geometry_area_rect: "Finding the area of rectangles and parallelograms with area = base × height.",
    geometry_area_triangle: "Finding the area of triangles with area = ½ × base × height.",
    geometry_volume: "Finding the volume of rectangular prisms with volume = length × width × height.",
    stats: "A mixed set on describing data: mean, median, mode and range.",
    stats_central_tendency: "Calculating the mean, median and mode of a data set and knowing what each one tells you.",
    stats_range: "Finding the range of a data set to describe how spread out the values are.",
    order: "Evaluating expressions in the right order — brackets, exponents, multiplication and division, then addition and subtraction.",
    ratios: "A mixed set on ratios and rates: simplifying ratios, equivalent ratios and unit rates.",
    ratios_simplify: "Writing ratios in simplest form by dividing both parts by a common factor.",
    ratios_equivalent: "Finding equivalent ratios by multiplying or dividing both parts by the same number.",
    ratios_unit_rate: "Working out a rate per one unit, such as price per item or distance per hour.",
    percent: "A mixed set of percentage skills: finding a percent of a number, converting between forms, and percent word problems.",
    percent_find: "Finding a given percent of a number, such as 25% of 80.",
    percent_convert: "Converting between fractions, decimals and percentages.",
    percent_word_problems: "Percentages in everyday situations: discounts, tax, tips and percent increase or decrease.",
    integers: "A mixed set of positive and negative number operations.",
    integers_add_sub: "Adding and subtracting positive and negative integers, using the number line and sign rules.",
    integers_mul_div: "Multiplying and dividing integers and applying the sign rules for the result.",
    expressions: "A mixed set on evaluating expressions and solving one-step equations.",
    expressions_evaluate: "Substituting values for variables and evaluating algebraic expressions.",
    expressions_one_step: "Solving one-step equations with inverse operations to isolate the variable.",
    proportions: "Setting up and solving proportions, often by cross-multiplying.",
    linear: "Solving linear equations and working with slope and the straight-line form y = mx + b.",
    exponents: "Powers and the laws of exponents: multiplying and dividing powers, powers of powers, and zero and negative exponents.",
    algebra_basics: "A mixed set of core algebra skills: combining like terms, the distributive property and solving for x.",
    algebra_combine_terms: "Simplifying expressions by combining like terms.",
    algebra_distribute: "Expanding expressions with the distributive property, a(b + c) = ab + ac.",
    algebra_solve: "Solving multi-step equations for x.",
    systems: "Solving pairs of linear equations by substitution or elimination.",
    quadratics: "Solving quadratic equations by factoring and finding their roots.",
    radicals: "Simplifying square roots and other radicals and working with roots.",
    pythagorean: "Finding a missing side of a right triangle with a² + b² = c².",
    circle_geo: "Finding the area and circumference of circles from the radius or diameter.",
    coordinate_geo: "Distance, midpoint and slope between points on the coordinate plane.",
    quadratic_formula: "Solving quadratics with the quadratic formula and finding the vertex of a parabola.",
    exponential: "Exponential growth and decay models, such as population growth, interest and half-life.",
    logarithms: "Evaluating logarithms and moving between logarithmic and exponential form.",
    sequences: "Arithmetic and geometric sequences: finding terms, the common difference or ratio, and sums.",
    trig_ratios: "Using sine, cosine and tangent to find missing sides and angles in right triangles.",
    polynomials: "Adding, subtracting, multiplying and factoring polynomials.",
    area_perimeter: "Finding the area and perimeter of rectangles and squares, missing side lengths, L-shaped rooms and real-life problems like fencing a garden.",
    surface_area: "Finding the surface area of cubes, rectangular prisms and triangular prisms by adding the areas of all their faces.",
    volume_prisms_cylinders: "Finding the volume of rectangular and triangular prisms and cylinders, and working backwards to find a missing dimension.",
    probability: "Finding the probability of simple and compound events and writing it as a fraction, decimal or percent.",
  },
  english: {
    phonics: "Matching letters to the sounds they make and finding words that rhyme.",
    sight_words: "Recognising high-frequency words that early readers need to know by sight.",
    nouns_verbs: "Telling naming words (nouns) apart from action words (verbs) in simple sentences.",
    spelling: "Spotting and correcting commonly misspelled words for the grade level.",
    punctuation: "Using full stops, question marks, exclamation marks, commas and apostrophes correctly.",
    grammar_tenses: "Choosing the right past, present or future form of a verb.",
    synonyms_antonyms: "A mixed set of synonyms (words with similar meanings) and antonyms (words with opposite meanings).",
    just_synonyms: "Finding words with the same or a similar meaning to build vocabulary.",
    just_antonyms: "Finding words with the opposite meaning.",
    parts_of_speech: "Identifying nouns, verbs, adjectives, adverbs and prepositions in a sentence.",
    pos_adjectives_adverbs: "Telling adjectives (which describe nouns) apart from adverbs (which describe verbs, adjectives or other adverbs).",
    pos_prepositions: "Spotting prepositions — words that show position, direction or time, such as under, between and during.",
    idioms: "Understanding what common idioms and expressions really mean, beyond their literal words.",
    analogies: "Completing word analogies by working out the relationship between pairs of words.",
    vocabulary: "Grade-level vocabulary: matching words to their meanings and using them in context.",
    sentence_types: "Telling simple, compound, complex and compound-complex sentences apart, and declarative, interrogative, imperative and exclamatory sentences.",
    literary_devices: "Recognising devices such as metaphor, simile, personification, alliteration, hyperbole and irony in short examples.",
    grammar_advanced: "Harder grammar points such as subject–verb agreement, clauses, active and passive voice, and common usage errors.",
    reading_comprehension: "A short passage followed by questions that check understanding, detail and inference.",
  },
  science: {
    living_nonliving: "Sorting things into living and non-living, and what all living things need.",
    five_senses: "The five senses — sight, hearing, smell, taste and touch — and the body parts we use for each.",
    animal_habitats: "Where animals live — forests, oceans, deserts, polar regions and more — and how they are suited to them.",
    plant_parts: "The parts of a plant — roots, stem, leaves, flower and seeds — and what each part does.",
    states_of_matter: "Solids, liquids and gases, and how matter changes state when it is heated or cooled.",
    water_cycle: "Evaporation, condensation, precipitation and collection — how water moves around the Earth.",
    simple_machines: "The six simple machines — lever, pulley, wheel and axle, inclined plane, wedge and screw — and how they make work easier.",
    food_chain: "How energy passes from the sun to producers, consumers and decomposers in a food chain.",
    solar_system: "A mixed set on the planets, the Sun, the Moon and how they move.",
    solar_system_planets: "The eight planets: their order from the Sun, their sizes and their key features.",
    solar_system_earth_moon: "How the Earth, Sun and Moon interact: day and night, seasons, phases of the Moon and eclipses.",
    human_body_systems: "A mixed set on the circulatory, digestive, respiratory, skeletal and muscular systems.",
    body_circulatory: "The heart, blood and blood vessels — arteries, veins and capillaries — and how blood carries oxygen around the body.",
    body_digestive: "How food is broken down as it passes through the mouth, oesophagus, stomach and intestines.",
    body_respiratory: "How we breathe: the lungs, trachea and diaphragm, and the exchange of oxygen and carbon dioxide.",
    body_skeletal_muscular: "Bones, joints and muscles, and how they work together to support and move the body.",
    body_nervous: "The brain, spinal cord and nerves — how messages travel through the body, the parts of the brain, neurons and reflexes.",
    electricity: "Circuits, conductors and insulators, series and parallel circuits, units of current and voltage, and Ohm's law for older grades.",
    light_sound: "How light travels, reflects and refracts, transparent and opaque materials, shadows, and how vibrations make sounds of different pitch and volume.",
    magnetism: "Magnetic poles, attraction and repulsion, magnetic materials, compasses and electromagnets.",
    cell_biology: "Cell structure and the jobs of organelles such as the nucleus, cell membrane and mitochondria, plus plant vs animal cells.",
    ecosystems: "A mixed set on the roles living things play in an ecosystem, biomes and symbiosis.",
    ecosystem_roles: "Producers, consumers and decomposers, and how energy and nutrients flow through an ecosystem.",
    ecosystem_relationships: "Biomes and the relationships between species: mutualism, commensalism, parasitism and predation.",
    periodic_table_basics: "How the periodic table is organised, element symbols, and atomic number.",
    forces_motion: "A mixed set on speed calculations, forces and Newton's laws of motion.",
    forces_speed: "Calculating speed, distance and time with speed = distance ÷ time.",
    forces_laws: "Forces such as gravity and friction, and Newton's three laws of motion.",
    earth_science: "A mixed set on rocks, plate tectonics, weather and the water cycle.",
    earth_rocks_tectonics: "The rock cycle — igneous, sedimentary and metamorphic rocks — and how tectonic plates move.",
    earth_weather: "Weather, climate, the atmosphere and the water cycle.",
    chemistry_basics: "A mixed set on atoms, elements, compounds and chemical reactions.",
    chemistry_atoms: "Protons, neutrons and electrons, and how atoms make up elements.",
    chemistry_compounds: "How elements combine into compounds and molecules, and reading chemical formulas.",
    chemistry_reactions: "Reactants and products, types of chemical reactions, and signs that a reaction has happened.",
    physics_formulas: "Applying core physics formulas such as speed, force (F = ma), work, power and density.",
    genetics_basics: "A mixed set on genetics vocabulary and Punnett square crosses.",
    genetics_vocabulary: "Key genetics terms: gene, allele, dominant, recessive, genotype and phenotype.",
    genetics_punnett: "Predicting offspring with Punnett squares and working out genotype and phenotype ratios.",
    biology_advanced: "A mixed set on photosynthesis, cellular respiration, mitosis and meiosis.",
    bio_photosynthesis_respiration: "Photosynthesis and cellular respiration: their inputs, outputs and where each takes place in the cell.",
    bio_cell_division: "The stages of mitosis and meiosis and how the two kinds of cell division differ.",
  },
};

export function topicDescription(subject: SubjectId, topicId: string): string | null {
  return TOPIC_DESCRIPTIONS[subject]?.[topicId] ?? null;
}

export function gradeBand(grade: number): string {
  if (grade <= 2) return "early elementary";
  if (grade <= 5) return "upper elementary";
  if (grade <= 8) return "middle school";
  return "high school";
}

/** Practical, grade-appropriate advice shown on every topic page. */
export function howToUse(grade: number): string[] {
  if (grade <= 2) {
    return [
      "Keep it short: a few questions at a time works better than a whole page at once for young learners.",
      "Read the questions aloud together if your child is still building reading confidence.",
      "Check the answers straight after, while the thinking is still fresh, and praise effort as well as results.",
    ];
  }
  if (grade <= 5) {
    return [
      "Use it as a 10–15 minute warm-up or homework task rather than a long drill.",
      "Ask students to show their working so you can see where a mistake started, not just that it happened.",
      "Mark it with the answer key together, then print a fresh version of the same topic to practise the questions they missed.",
    ];
  }
  if (grade <= 8) {
    return [
      "Works well as a bell-ringer, exit ticket, homework set or quick quiz.",
      "Have students self-check with the answer key, then correct their own mistakes before you review.",
      "Generate a new version of the same topic for a re-test, so students can't just memorise the answers.",
    ];
  }
  return [
    "Use it for revision before a test, as homework, or as a timed practice set.",
    "Students can self-mark with the answer key and note which question types they got wrong.",
    "Generate several versions of the same topic for spaced practice in the weeks before an exam.",
  ];
}

/** "Grade 7 (US) · Year 8 (UK) · Class 7 (India) · ages 12–13" — helps UK and
 * Indian visitors, who search by Year and Class, find the right grade. */
export function gradeEquivalents(grade: number) {
  return { ukYear: grade + 1, indiaClass: grade, ages: `${grade + 5}–${grade + 6}` };
}

/** What a typical grade band practises in each subject (shown on grade pages). */
export function gradeOverview(subject: "math" | "english" | "science", grade: number): string {
  const band = grade <= 2 ? 0 : grade <= 5 ? 1 : grade <= 8 ? 2 : 3;
  const text: Record<string, string[]> = {
    math: [
      "Early grades build number sense: counting, comparing numbers, adding and subtracting, and recognizing shapes. Short, frequent practice matters more than long sessions at this age.",
      "Upper elementary math moves from whole numbers to multiplication and division, place value, fractions and decimals, area and perimeter, and multi-step word problems.",
      "Middle school math bridges arithmetic and algebra: ratios, percentages, negative numbers, expressions and equations, geometry with area, surface area and volume, and statistics.",
      "High school math covers algebra and beyond: linear and quadratic equations, exponents and radicals, geometry and the Pythagorean theorem, trigonometry, sequences, logarithms and probability.",
    ],
    english: [
      "Early grades focus on phonics, sight words, spelling simple words, and telling nouns from verbs — the building blocks of confident reading and writing.",
      "Upper elementary English develops spelling, punctuation, verb tenses, synonyms and antonyms, parts of speech, and understanding what a passage says.",
      "Middle school English deepens grammar and vocabulary: parts of speech, sentence structure, idioms, analogies, and reading for inference as well as detail.",
      "High school English is about precision and analysis: advanced grammar and usage, academic vocabulary, sentence variety, literary devices and close reading.",
    ],
    science: [
      "Early science is about noticing the world: living and non-living things, the five senses, animals and their habitats, and plants.",
      "Upper elementary science explores plants, states of matter, the water cycle, food chains, simple machines, light, sound, magnets and the solar system.",
      "Middle school science covers human body systems, cells, ecosystems, forces and motion, electricity, earth science and the periodic table.",
      "High school science goes deeper into chemistry, physics formulas, genetics and Punnett squares, photosynthesis and respiration, and cell division.",
    ],
  };
  return text[subject][band];
}
