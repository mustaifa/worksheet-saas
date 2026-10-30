/**
 * Curated science banks for the NGSS-aligned curriculum book, grades 6–12.
 * Each item is [question, answer, level]; level 1 = recall, 2 = understand, 3 = apply/explain.
 */
import type { Item } from "./bank";

// ---------------------------------------------------------------- practices & middle school
export const SCI_METHOD: Item[] = [
  ["What is a hypothesis?", "a testable prediction or explanation", 1],
  ["What is the variable you change on purpose called?", "the independent variable", 1],
  ["What is the variable you measure called?", "the dependent variable", 1],
  ["What are the things you keep the same called?", "controlled variables (constants)", 1],
  ["What is the first step of the scientific method?", "ask a question (make an observation)", 1],
  ["Experiment: Does the amount of sunlight change plant height? What is the independent variable?", "the amount of sunlight", 2],
  ["Experiment: Does the amount of sunlight change plant height? What is the dependent variable?", "plant height", 2],
  ["Experiment: Does water temperature change how fast sugar dissolves? Name a controlled variable.", "amount of water, amount of sugar or stirring (any one)", 2],
  ["Why do scientists repeat an experiment several times?", "to make sure results are reliable", 2],
  ["What is a control group?", "a group that does not get the treatment, used for comparison", 2],
  ["Observation or inference? 'The grass is wet.'", "observation", 2],
  ["Observation or inference? 'It must have rained last night.'", "inference", 2],
  ["A student tests two fertilizers but uses different plants and pots. What is wrong?", "more than one variable changed, so results can't be compared", 3],
  ["What should you do if your data does not support your hypothesis?", "report it honestly and revise the hypothesis", 3],
  ["Which graph best shows how temperature changes over a day: bar or line?", "line graph", 3],
  ["Why is a large sample size better?", "it reduces the effect of chance and makes results more reliable", 3],
];

export const MOON_SEASONS: Item[] = [
  ["What causes Earth's seasons?", "the tilt of Earth's axis", 1],
  ["About how much is Earth's axis tilted?", "about 23.5°", 1],
  ["What do we call the moon phase when we see none of the lit side?", "new moon", 1],
  ["What do we call the moon phase when we see the whole lit side?", "full moon", 1],
  ["About how long is the moon's cycle of phases?", "about 29.5 days", 1],
  ["Why does the moon have phases?", "we see different amounts of its sunlit half as it orbits Earth", 2],
  ["What is a solar eclipse?", "the moon blocks the sun's light from reaching part of Earth", 2],
  ["What is a lunar eclipse?", "Earth's shadow falls on the moon", 2],
  ["In which moon phase can a solar eclipse happen?", "new moon", 2],
  ["In which moon phase can a lunar eclipse happen?", "full moon", 2],
  ["When it is summer in the Northern Hemisphere, what season is it in the Southern Hemisphere?", "winter", 2],
  ["Is Earth closer to the sun in summer? Explain.", "no — seasons are caused by tilt, not distance", 3],
  ["Why are summer days longer?", "your hemisphere is tilted toward the sun", 3],
  ["Why don't we have an eclipse every month?", "the moon's orbit is tilted compared to Earth's orbit", 3],
  ["What phase follows a waxing gibbous moon?", "full moon", 3],
  ["What phase comes after a full moon?", "waning gibbous", 3],
];

export const GRAVITY_ORBITS: Item[] = [
  ["What force keeps planets in orbit around the sun?", "gravity", 1],
  ["Which has more gravity: Earth or the moon?", "Earth", 1],
  ["What is the path of a planet around the sun called?", "an orbit", 1],
  ["What two things affect the strength of gravity between objects?", "their masses and the distance between them", 2],
  ["If two objects move farther apart, does gravity get stronger or weaker?", "weaker", 2],
  ["Which planet has the strongest gravity in our solar system?", "Jupiter", 2],
  ["Why do astronauts in the space station seem weightless?", "they are falling around Earth (in free fall) with the station", 3],
  ["What shape are planetary orbits?", "ellipses (slightly oval)", 3],
  ["What pulled gas and dust together to form the solar system?", "gravity", 3],
];

export const GEOLOGIC_TIME: Item[] = [
  ["About how old is Earth?", "about 4.6 billion years", 1],
  ["What is the geologic time scale?", "a timeline of Earth's history divided into eras and periods", 1],
  ["In which era did dinosaurs live?", "the Mesozoic Era", 1],
  ["Which era are we in now?", "the Cenozoic Era", 1],
  ["What is the law of superposition?", "in undisturbed rock layers, older layers are below younger ones", 2],
  ["What is an index fossil?", "a fossil of an organism that lived briefly but widely, used to date rock layers", 2],
  ["What event likely ended the age of dinosaurs?", "an asteroid impact about 66 million years ago", 2],
  ["What is relative dating?", "ordering rock layers or events from oldest to youngest", 2],
  ["What is absolute (radiometric) dating?", "finding a rock's age in years using radioactive decay", 3],
  ["A fault cuts through three rock layers. Is the fault older or younger than the layers?", "younger", 3],
  ["Why are fossils of the same species found on different continents?", "the continents were once joined", 3],
];

export const ATMOSPHERE_OCEANS: Item[] = [
  ["Which gas makes up most of the atmosphere?", "nitrogen (about 78%)", 1],
  ["In which layer of the atmosphere does weather happen?", "the troposphere", 1],
  ["Which layer contains the ozone layer?", "the stratosphere", 1],
  ["What does the ozone layer protect us from?", "harmful ultraviolet (UV) rays", 1],
  ["What is an air mass?", "a large body of air with similar temperature and humidity", 2],
  ["What usually forms where a cold front meets warm air?", "storms and rain", 2],
  ["What drives ocean surface currents?", "wind (and Earth's rotation)", 2],
  ["Why do coastal areas have milder climates?", "water heats and cools slowly, keeping temperatures steady", 2],
  ["What is the Coriolis effect?", "Earth's rotation curves winds and currents", 3],
  ["Does air pressure increase or decrease as you go up a mountain?", "decrease", 3],
  ["Why does warm air rise?", "it is less dense than cool air", 3],
  ["What is a sea breeze?", "cool wind blowing from the sea to land during the day", 3],
];

export const CLIMATE_CHANGE: Item[] = [
  ["What is the greenhouse effect?", "gases in the atmosphere trap heat near Earth's surface", 1],
  ["Name a greenhouse gas.", "carbon dioxide, methane or water vapor (any one)", 1],
  ["What human activity adds the most carbon dioxide to the air?", "burning fossil fuels", 1],
  ["Is global average temperature rising or falling?", "rising", 1],
  ["Why are sea levels rising?", "melting ice and warming water expanding", 2],
  ["How does cutting forests affect carbon dioxide levels?", "fewer trees absorb CO₂, so levels rise", 2],
  ["What is the difference between weather and climate?", "weather is day-to-day; climate is the long-term pattern", 2],
  ["Name one way to reduce greenhouse gas emissions.", "renewable energy, efficiency or less driving (any one)", 2],
  ["Why is the greenhouse effect needed for life?", "without it Earth would be too cold", 3],
  ["What do ice cores tell scientists?", "past temperatures and gas levels in the atmosphere", 3],
  ["How does melting Arctic ice speed up warming?", "less white ice reflects sunlight, so more heat is absorbed", 3],
];

export const HEAT_TRANSFER: Item[] = [
  ["Which type of heat transfer happens through direct contact?", "conduction", 1],
  ["Which type of heat transfer happens through moving fluids (liquids or gases)?", "convection", 1],
  ["Which type of heat transfer can travel through empty space?", "radiation", 1],
  ["Does heat flow from hot to cold, or cold to hot?", "from hot to cold", 1],
  ["Conduction, convection or radiation? A metal spoon gets hot in soup.", "conduction", 2],
  ["Conduction, convection or radiation? Warmth from a campfire on your face.", "radiation", 2],
  ["Conduction, convection or radiation? Hot air rising from a heater.", "convection", 2],
  ["Is metal a good conductor or a good insulator?", "a good conductor", 2],
  ["Why are pot handles made of plastic or wood?", "they are insulators, so they don't get hot", 2],
  ["How does a thermos keep drinks hot?", "a vacuum layer stops conduction and convection; shiny walls reduce radiation", 3],
  ["Why does a tile floor feel colder than a rug at the same temperature?", "tile conducts heat away from your feet faster", 3],
  ["What happens to particles when a substance is heated?", "they move faster", 3],
];

export const REPRODUCTION: Item[] = [
  ["How many parents are needed for sexual reproduction?", "two", 1],
  ["How many parents are needed for asexual reproduction?", "one", 1],
  ["Are offspring from asexual reproduction identical to the parent?", "yes", 1],
  ["Name a living thing that reproduces asexually.", "bacteria, yeast, or a strawberry plant by runners (any one)", 1],
  ["What is the advantage of sexual reproduction?", "it creates variety, helping species adapt", 2],
  ["What is the advantage of asexual reproduction?", "it is fast and needs no partner", 2],
  ["How do bright flowers help plants reproduce?", "they attract pollinators", 2],
  ["Why do some birds sing or display bright feathers?", "to attract a mate", 2],
  ["Why do frogs lay so many eggs?", "most eggs and tadpoles will not survive", 3],
  ["How does a bee benefit from pollinating a flower?", "it gets nectar and pollen for food", 3],
];

export const NATURAL_SELECTION: Item[] = [
  ["Who developed the theory of evolution by natural selection?", "Charles Darwin", 1],
  ["What is natural selection?", "individuals with helpful traits survive and reproduce more", 1],
  ["What is a mutation?", "a change in DNA", 1],
  ["What is variation?", "differences in traits among individuals of a species", 1],
  ["Why do bacteria become resistant to antibiotics?", "resistant bacteria survive and pass on the trait", 2],
  ["What is artificial selection?", "humans breeding plants or animals for chosen traits", 2],
  ["Give an example of artificial selection.", "dog breeds or crop varieties (any one)", 2],
  ["Darwin's finches had different beak shapes. Why?", "beaks adapted to different foods on different islands", 2],
  ["Do individuals evolve during their lifetime?", "no — populations evolve over generations", 3],
  ["What evidence supports evolution?", "fossils, DNA similarities and similar body structures", 3],
  ["Peppered moths turned darker during the Industrial Revolution. Why?", "dark moths were better hidden on sooty trees and survived more", 3],
];

export const PHYS_CHEM_CHANGES: Item[] = [
  ["Physical or chemical change? Ice melting", "physical", 1],
  ["Physical or chemical change? Wood burning", "chemical", 1],
  ["Physical or chemical change? Cutting paper", "physical", 1],
  ["Physical or chemical change? Iron rusting", "chemical", 1],
  ["Physical or chemical change? Dissolving sugar in tea", "physical", 1],
  ["Physical or chemical change? Baking bread", "chemical", 2],
  ["Physical or chemical change? Milk going sour", "chemical", 2],
  ["Physical or chemical change? Boiling water", "physical", 2],
  ["Physical or chemical change? A firework exploding", "chemical", 2],
  ["Name two signs of a chemical change.", "gas bubbles, color change, new smell, light or heat, precipitate (any two)", 2],
  ["Physical or chemical change? Digesting food", "chemical", 3],
  ["Physical or chemical change? Crushing a can", "physical", 3],
  ["Why is dissolving salt in water a physical change?", "no new substance forms; you can get the salt back by evaporation", 3],
];

export const SUBSTANCES_MIXTURES: Item[] = [
  ["Element, compound or mixture? Oxygen (O₂)", "element", 1],
  ["Element, compound or mixture? Water (H₂O)", "compound", 1],
  ["Element, compound or mixture? Salad", "mixture", 1],
  ["Element, compound or mixture? Gold", "element", 1],
  ["Element, compound or mixture? Salt (NaCl)", "compound", 1],
  ["Element, compound or mixture? Air", "mixture", 2],
  ["Element, compound or mixture? Carbon dioxide (CO₂)", "compound", 2],
  ["Element, compound or mixture? Salt water", "mixture", 2],
  ["Homogeneous or heterogeneous mixture? Lemonade", "homogeneous", 2],
  ["Homogeneous or heterogeneous mixture? Trail mix", "heterogeneous", 2],
  ["What is the difference between a compound and a mixture?", "a compound is chemically bonded in a fixed ratio; a mixture is physically combined in any ratio", 3],
  ["Can a compound be separated by filtering?", "no — it needs a chemical reaction", 3],
  ["Homogeneous or heterogeneous mixture? Muddy water", "heterogeneous", 3],
];

export const EM_SPECTRUM: Item[] = [
  ["Which electromagnetic waves can we see?", "visible light", 1],
  ["Which waves are used to cook food quickly?", "microwaves", 1],
  ["Which waves are used to see bones?", "X-rays", 1],
  ["Which waves cause sunburn?", "ultraviolet (UV)", 1],
  ["Which waves carry radio and TV signals?", "radio waves", 1],
  ["Which waves do we feel as heat?", "infrared", 2],
  ["Which waves have the longest wavelength?", "radio waves", 2],
  ["Which waves have the highest energy?", "gamma rays", 2],
  ["Do all electromagnetic waves travel at the same speed in a vacuum?", "yes — the speed of light", 2],
  ["Order from longest to shortest wavelength: X-rays, radio, visible", "radio, visible, X-rays", 3],
  ["Why are X-rays and gamma rays dangerous?", "they have high energy that can damage cells and DNA", 3],
  ["Which color of visible light has the longest wavelength?", "red", 3],
  ["Can electromagnetic waves travel through empty space?", "yes", 3],
];

// ---------------------------------------------------------------- biology
export const BIOMOLECULES: Item[] = [
  ["What are the four main biomolecules?", "carbohydrates, lipids, proteins and nucleic acids", 1],
  ["Which biomolecule is the body's main quick energy source?", "carbohydrates", 1],
  ["Which biomolecule stores genetic information?", "nucleic acids (DNA and RNA)", 1],
  ["Which biomolecule makes up most enzymes?", "proteins", 1],
  ["Which biomolecule includes fats and oils?", "lipids", 1],
  ["What are the building blocks of proteins?", "amino acids", 2],
  ["What are the building blocks of nucleic acids?", "nucleotides", 2],
  ["What is glucose an example of?", "a carbohydrate (simple sugar)", 2],
  ["What do enzymes do?", "speed up chemical reactions (act as catalysts)", 2],
  ["Which biomolecule forms most of the cell membrane?", "lipids (phospholipids)", 2],
  ["Why can high fever damage enzymes?", "heat changes their shape (denatures them)", 3],
  ["Which test turns blue-black with starch?", "the iodine test", 3],
  ["Why are lipids good for long-term energy storage?", "they store more energy per gram than carbohydrates", 3],
];

export const CELL_TRANSPORT: Item[] = [
  ["What is diffusion?", "movement of particles from high to low concentration", 1],
  ["What is osmosis?", "diffusion of water across a membrane", 1],
  ["Does passive transport need energy?", "no", 1],
  ["Does active transport need energy?", "yes (ATP)", 1],
  ["What controls what enters and leaves a cell?", "the cell membrane", 1],
  ["A cell is placed in very salty water. What happens to it?", "water leaves and the cell shrinks", 2],
  ["A cell is placed in pure water. What happens to an animal cell?", "water enters and it swells (may burst)", 2],
  ["What is homeostasis?", "keeping stable conditions inside the body or cell", 2],
  ["What does a hypotonic solution have compared with the cell?", "lower solute concentration (more water)", 2],
  ["Why don't plant cells burst in fresh water?", "the cell wall stops them", 3],
  ["What is endocytosis?", "a cell taking in large particles by wrapping its membrane around them", 3],
  ["Why do slugs shrivel when salt is put on them?", "water leaves their cells by osmosis", 3],
];

export const DNA_PROTEIN: Item[] = [
  ["What does DNA stand for?", "deoxyribonucleic acid", 1],
  ["What shape is DNA?", "a double helix", 1],
  ["Which base pairs with adenine (A) in DNA?", "thymine (T)", 1],
  ["Which base pairs with cytosine (C)?", "guanine (G)", 1],
  ["In RNA, which base replaces thymine?", "uracil (U)", 1],
  ["What is transcription?", "copying DNA into messenger RNA", 2],
  ["What is translation?", "reading mRNA to build a protein at the ribosome", 2],
  ["Where does translation happen?", "at the ribosome", 2],
  ["How many bases make one codon?", "three", 2],
  ["What is a gene?", "a section of DNA that codes for a protein", 2],
  ["What can a mutation in a gene do?", "change the protein, which may change a trait", 3],
  ["Why is DNA replication called semi-conservative?", "each new DNA molecule keeps one original strand", 3],
  ["Where is DNA found in a eukaryotic cell?", "mainly in the nucleus (also mitochondria)", 3],
];

export const ECOLOGY_POPULATIONS: Item[] = [
  ["What is carrying capacity?", "the largest population an environment can support", 1],
  ["Name a limiting factor for a population.", "food, water, space, predators or disease (any one)", 1],
  ["What is a population?", "all the members of one species in an area", 1],
  ["What is a community?", "all the populations living in an area", 1],
  ["What happens to a deer population if wolves are removed?", "it grows, then may crash when food runs out", 2],
  ["Exponential growth looks like what shape on a graph?", "a J-shaped curve", 2],
  ["Logistic growth looks like what shape on a graph?", "an S-shaped curve", 2],
  ["What is biodiversity?", "the variety of life in an area", 2],
  ["What is an invasive species?", "a non-native species that spreads and harms an ecosystem", 3],
  ["Why do ecosystems with more biodiversity recover better?", "more species can fill roles if some are lost", 3],
  ["What is ecological succession?", "gradual change in the species of a community over time", 3],
];

export const CLASSIFICATION: Item[] = [
  ["Who created the two-name naming system for living things?", "Carl Linnaeus", 1],
  ["What is the two-part scientific name called?", "binomial nomenclature", 1],
  ["Which is the broadest level: domain, genus or species?", "domain", 1],
  ["What are the three domains of life?", "Bacteria, Archaea and Eukarya", 2],
  ["Put in order from broadest to most specific: species, kingdom, genus, family", "kingdom, family, genus, species", 2],
  ["In 'Homo sapiens', which word is the genus?", "Homo", 2],
  ["Which kingdom includes mushrooms?", "Fungi", 2],
  ["What is a dichotomous key?", "a tool that identifies organisms through a series of two-choice steps", 3],
  ["Are prokaryotes cells with or without a nucleus?", "without a nucleus", 3],
  ["Why do scientists use DNA to classify organisms?", "it shows how closely species are related", 3],
];

// ---------------------------------------------------------------- chemistry
export const PERIODIC_TRENDS: Item[] = [
  ["What are rows of the periodic table called?", "periods", 1],
  ["What are columns of the periodic table called?", "groups (families)", 1],
  ["Elements in the same group have the same number of what?", "valence electrons", 1],
  ["Where are metals found on the periodic table?", "on the left and center", 1],
  ["Which group contains the noble gases?", "group 18", 1],
  ["Why are noble gases unreactive?", "they have full outer electron shells", 2],
  ["Which group contains the alkali metals?", "group 1", 2],
  ["Does atomic radius increase or decrease going down a group?", "increase", 2],
  ["Does atomic radius increase or decrease going across a period (left to right)?", "decrease", 2],
  ["Which element is the most electronegative?", "fluorine", 3],
  ["Does ionization energy increase or decrease across a period?", "increase", 3],
  ["Why are alkali metals so reactive?", "they easily lose their single valence electron", 3],
];

export const BONDING: Item[] = [
  ["Ionic or covalent? NaCl", "ionic", 1],
  ["Ionic or covalent? H₂O", "covalent", 1],
  ["Ionic or covalent? CO₂", "covalent", 1],
  ["Ionic or covalent? MgO", "ionic", 1],
  ["In an ionic bond, are electrons shared or transferred?", "transferred", 1],
  ["In a covalent bond, are electrons shared or transferred?", "shared", 1],
  ["Ionic bonds usually form between which types of elements?", "a metal and a nonmetal", 2],
  ["Covalent bonds usually form between which types of elements?", "nonmetals", 2],
  ["What holds atoms together in a metal?", "a sea of shared (delocalized) electrons — metallic bonding", 2],
  ["Why do ionic compounds have high melting points?", "strong attractions between oppositely charged ions", 3],
  ["Why is water a polar molecule?", "oxygen pulls the shared electrons more, and the molecule is bent", 3],
  ["How many covalent bonds does carbon usually form?", "four", 3],
];

/** [unbalanced equation, balanced equation] */
export const BALANCING: [string, string, 1 | 2 | 3][] = [
  ["H₂ + O₂ → H₂O", "2H₂ + O₂ → 2H₂O", 1],
  ["Na + Cl₂ → NaCl", "2Na + Cl₂ → 2NaCl", 1],
  ["Mg + O₂ → MgO", "2Mg + O₂ → 2MgO", 1],
  ["N₂ + H₂ → NH₃", "N₂ + 3H₂ → 2NH₃", 2],
  ["Fe + O₂ → Fe₂O₃", "4Fe + 3O₂ → 2Fe₂O₃", 2],
  ["CH₄ + O₂ → CO₂ + H₂O", "CH₄ + 2O₂ → CO₂ + 2H₂O", 2],
  ["KClO₃ → KCl + O₂", "2KClO₃ → 2KCl + 3O₂", 2],
  ["Al + O₂ → Al₂O₃", "4Al + 3O₂ → 2Al₂O₃", 3],
  ["C₃H₈ + O₂ → CO₂ + H₂O", "C₃H₈ + 5O₂ → 3CO₂ + 4H₂O", 3],
  ["Zn + HCl → ZnCl₂ + H₂", "Zn + 2HCl → ZnCl₂ + H₂", 2],
  ["C₆H₁₂O₆ + O₂ → CO₂ + H₂O", "C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O", 3],
  ["Ca + H₂O → Ca(OH)₂ + H₂", "Ca + 2H₂O → Ca(OH)₂ + H₂", 3],
];

export const REACTION_TYPES: Item[] = [
  ["Reaction type? A + B → AB", "synthesis", 1],
  ["Reaction type? AB → A + B", "decomposition", 1],
  ["Reaction type? A + BC → AC + B", "single replacement", 1],
  ["Reaction type? AB + CD → AD + CB", "double replacement", 1],
  ["Reaction type? CH₄ + 2O₂ → CO₂ + 2H₂O", "combustion", 2],
  ["Reaction type? 2H₂O → 2H₂ + O₂", "decomposition", 2],
  ["Reaction type? Zn + CuSO₄ → ZnSO₄ + Cu", "single replacement", 2],
  ["Reaction type? 2Na + Cl₂ → 2NaCl", "synthesis", 2],
  ["Reaction type? NaCl + AgNO₃ → NaNO₃ + AgCl", "double replacement", 3],
  ["What are the products of the complete combustion of a hydrocarbon?", "carbon dioxide and water", 3],
  ["Is a reaction that releases heat exothermic or endothermic?", "exothermic", 3],
  ["What does a catalyst do?", "speeds up a reaction without being used up", 3],
];

export const ACIDS_BASES: Item[] = [
  ["What is the pH of pure water?", "7 (neutral)", 1],
  ["Is a pH of 3 acidic or basic?", "acidic", 1],
  ["Is a pH of 11 acidic or basic?", "basic", 1],
  ["Is lemon juice acidic or basic?", "acidic", 1],
  ["Is soap acidic or basic?", "basic", 1],
  ["What color does litmus paper turn in an acid?", "red", 2],
  ["What color does litmus paper turn in a base?", "blue", 2],
  ["What do an acid and a base make when they neutralize?", "a salt and water", 2],
  ["Acids release which ion in water?", "hydrogen ions (H⁺)", 2],
  ["Bases release which ion in water?", "hydroxide ions (OH⁻)", 2],
  ["How many times more acidic is pH 3 than pH 5?", "100 times", 3],
  ["Why do people take antacids for heartburn?", "the base neutralizes excess stomach acid", 3],
];

// ---------------------------------------------------------------- physics & earth/space
export const UNIVERSE: Item[] = [
  ["What is a galaxy?", "a huge system of stars, gas and dust held together by gravity", 1],
  ["What galaxy do we live in?", "the Milky Way", 1],
  ["What powers a star?", "nuclear fusion", 1],
  ["What is a light-year?", "the distance light travels in one year", 1],
  ["What theory describes the origin of the universe?", "the Big Bang theory", 1],
  ["What element do stars mainly fuse in their cores?", "hydrogen (into helium)", 2],
  ["What evidence shows the universe is expanding?", "light from distant galaxies is redshifted", 2],
  ["What is the cosmic microwave background?", "leftover radiation from the early universe", 2],
  ["What will our sun become at the end of its life?", "a red giant, then a white dwarf", 2],
  ["What forms when a very massive star collapses?", "a neutron star or a black hole", 3],
  ["Where do elements heavier than iron mostly form?", "in supernova explosions (and neutron star mergers)", 3],
  ["Why do hotter stars look blue?", "they emit more short-wavelength light", 3],
];

export const EARTH_SYSTEMS_HS: Item[] = [
  ["What drives the movement of tectonic plates?", "convection currents in the mantle", 1],
  ["What is Earth's outermost solid layer?", "the crust", 1],
  ["What type of plate boundary forms mid-ocean ridges?", "divergent", 1],
  ["What type of plate boundary forms the Himalayas?", "convergent (continent–continent)", 2],
  ["What type of plate boundary is the San Andreas Fault?", "transform", 2],
  ["What is a feedback loop in Earth's systems?", "a change that causes effects which increase or reduce the original change", 2],
  ["Melting ice exposes dark ocean, which absorbs more heat and melts more ice. Positive or negative feedback?", "positive feedback", 3],
  ["How does seafloor spreading support plate tectonics?", "new crust forms at ridges and rocks get older farther away", 3],
  ["How do scientists learn about Earth's interior?", "by studying how seismic waves travel through it", 3],
  ["Why can't S-waves travel through the outer core?", "the outer core is liquid", 3],
];

export const SUSTAINABILITY: Item[] = [
  ["What does sustainable mean?", "meeting today's needs without harming future generations", 1],
  ["Name a renewable energy source.", "solar, wind, hydro or geothermal (any one)", 1],
  ["What is a carbon footprint?", "the total greenhouse gases caused by a person or activity", 1],
  ["Why is soil erosion a problem for farming?", "it removes fertile topsoil", 2],
  ["How can cities reduce flooding?", "green spaces, permeable pavement and better drainage (any one)", 2],
  ["What is biodiversity loss?", "the decline in the variety of species", 2],
  ["What is one cost and one benefit of building a dam?", "benefit: clean power or water storage; cost: floods habitats and blocks fish", 3],
  ["Why do scientists use computer models to study climate?", "to predict future changes and test 'what if' scenarios", 3],
  ["How does overfishing affect ocean ecosystems?", "it removes key species and disrupts food webs", 3],
];

export const SCIENCE_THINKING: Item[] = [
  ["On the Moon (no air), a hammer and a feather are dropped together. Which lands first?", "they land at the same time", 1],
  ["Does a kilogram of feathers weigh more than a kilogram of iron?", "no — they weigh the same", 1],
  ["Ice floats in water. What does that tell you about its density?", "ice is less dense than liquid water", 1],
  ["Why does a metal ship float when a metal nail sinks?", "the ship's shape displaces enough water; its average density is less than water", 2],
  ["You are in a closed room with a candle, a match and a lamp. What do you light first?", "the match", 2],
  ["Why does your breath make fog on a cold window?", "water vapor in your breath condenses on the cold glass", 2],
  ["If Earth stopped spinning, how long would one day (sunrise to sunrise) be?", "about one year", 3],
  ["Why do you see lightning before you hear thunder?", "light travels much faster than sound", 3],
  ["Why is the sky blue?", "air scatters short blue wavelengths of sunlight more than red", 3],
  ["A ball is thrown straight up. What is its speed at the very top?", "zero (for an instant)", 3],
  ["Why does a spinning ice skater spin faster when she pulls her arms in?", "conservation of angular momentum", 3],
  ["If you could fold a sheet of paper 42 times, roughly how thick would it be?", "far enough to reach the Moon (about 440,000 km)", 3],
];
