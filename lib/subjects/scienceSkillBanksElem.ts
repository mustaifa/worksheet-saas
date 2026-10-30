/**
 * Curated science banks for the NGSS-aligned curriculum book, grades 1–5.
 * Each item is [question, answer, level]; level 1 = recall, 2 = understand, 3 = apply/explain.
 */
import type { Item } from "./bank";

// ---------------------------------------------------------------- grade 1
export const SOUND_VIBRATIONS: Item[] = [
  ["What makes sound?", "vibrations", 1],
  ["What do you feel if you touch your throat while you hum?", "vibrations", 1],
  ["Is a drum louder when you hit it hard or softly?", "hard", 1],
  ["What happens to a guitar string when you pluck it?", "it vibrates", 1],
  ["Which makes a sound: a still bell or a ringing bell?", "a ringing bell", 1],
  ["Rice on a drum jumps when the drum is hit. Why?", "the drum skin vibrates", 2],
  ["If a bell stops vibrating, what happens to the sound?", "the sound stops", 2],
  ["Name a way people use sound to send a message over a distance.", "a whistle, bell, drum or phone (any one)", 2],
  ["Does a short guitar string or a long one make a higher sound?", "a short string", 3],
  ["Why can you hear a friend through a wall?", "sound vibrations travel through the wall", 3],
  ["A tuning fork is put in water. What do you see?", "the water splashes from the vibrations", 3],
  ["Why can't sound travel in outer space?", "there is no air (matter) to carry the vibrations", 3],
];

export const LIGHT_SHADOWS: Item[] = [
  ["What do we need to see things?", "light", 1],
  ["Can you see in a completely dark room?", "no", 1],
  ["What forms when an object blocks light?", "a shadow", 1],
  ["Name a light source.", "the sun, a lamp or a flashlight (any one)", 1],
  ["Does light pass through a window: all, some or none?", "all (it is transparent)", 1],
  ["Does light pass through a book: all, some or none?", "none (it is opaque)", 2],
  ["Does light pass through wax paper: all, some or none?", "some (it is translucent)", 2],
  ["What does a mirror do to light?", "it reflects (bounces) it", 2],
  ["Is clear plastic wrap transparent, translucent or opaque?", "transparent", 2],
  ["Is a wooden door transparent, translucent or opaque?", "opaque", 2],
  ["Your shadow is long in the morning and short at noon. Why?", "the sun is low in the morning and high at noon", 3],
  ["How could you make a shadow bigger?", "move the object closer to the light", 3],
  ["Why is the moon bright at night if it makes no light?", "it reflects light from the sun", 3],
];

export const PARENTS_OFFSPRING: Item[] = [
  ["What is a baby dog called?", "a puppy", 1],
  ["What is a baby cat called?", "a kitten", 1],
  ["What is a baby cow called?", "a calf", 1],
  ["What is a baby frog called?", "a tadpole", 1],
  ["What is a baby sheep called?", "a lamb", 1],
  ["What is a young plant called?", "a seedling", 1],
  ["Do baby animals look exactly like their parents?", "no — similar, but not exactly the same", 2],
  ["How do bird parents help their chicks survive?", "they bring food and keep them warm", 2],
  ["Why does a baby kangaroo stay in its mother's pouch?", "to stay safe and warm and to feed", 2],
  ["Name a way young plants are like their parent plants.", "same kind of leaves, flowers or shape (any one)", 2],
  ["A puppy cries. What does the parent dog usually do?", "comes to help or feed it", 3],
  ["Which baby animal does NOT look like its parent: kitten, tadpole or calf?", "tadpole", 3],
  ["Two puppies from the same parents look different. Is that normal?", "yes — offspring vary", 3],
];

export const STRUCTURES_SURVIVAL: Item[] = [
  ["What do birds use to fly?", "wings", 1],
  ["What do fish use to breathe underwater?", "gills", 1],
  ["What part of a plant takes in water from the soil?", "roots", 1],
  ["What does a turtle use to protect itself?", "its shell", 1],
  ["What helps a cactus keep animals away?", "spines", 1],
  ["Why does a duck have webbed feet?", "to help it swim", 2],
  ["Why do eagles have sharp claws?", "to catch and hold food", 2],
  ["How does a porcupine protect itself?", "with sharp quills", 2],
  ["Which human invention copies a bird's wings?", "an airplane", 2],
  ["Which human invention copies a turtle's shell?", "a helmet (or armor)", 3],
  ["Which human invention copies a duck's webbed feet?", "swim fins (flippers)", 3],
  ["Why do plants grow toward a window?", "they grow toward light", 3],
  ["Why does a giraffe have a long neck?", "to reach leaves high in trees", 3],
];

export const SKY_PATTERNS: Item[] = [
  ["What gives Earth light during the day?", "the sun", 1],
  ["Where does the sun rise?", "in the east", 1],
  ["Where does the sun set?", "in the west", 1],
  ["Can we see stars during the day?", "no (the sun is too bright)", 1],
  ["What can we usually see in the sky at night?", "the moon and stars", 1],
  ["Does the moon's shape look the same every night?", "no — it seems to change", 2],
  ["Which season has the most hours of daylight?", "summer", 2],
  ["Which season has the fewest hours of daylight?", "winter", 2],
  ["Does the sun really move across the sky?", "no — Earth spins, so it looks like it moves", 3],
  ["About how long does the moon take to go through all its shapes?", "about a month", 3],
  ["Why is the sun higher at noon than in the morning?", "Earth has turned so we face the sun more directly", 3],
];

// ---------------------------------------------------------------- grade 2
export const PROPERTIES_MATERIALS: Item[] = [
  ["Is a rock hard or soft?", "hard", 1],
  ["Is a pillow hard or soft?", "soft", 1],
  ["Does a sponge soak up water?", "yes (it is absorbent)", 1],
  ["Is a rubber band flexible or stiff?", "flexible", 1],
  ["Which material is best for a window: glass, wood or cloth?", "glass", 1],
  ["Which material is best for a raincoat: paper, plastic or cotton?", "plastic", 2],
  ["Why are pots made of metal?", "metal is strong and heats up well", 2],
  ["Why are towels made of cotton?", "cotton absorbs water", 2],
  ["Does a metal spoon sink or float in water?", "sink", 2],
  ["Does a wooden block sink or float in water?", "float", 2],
  ["A house is built from many small bricks. What does this show?", "big objects can be made from small pieces", 3],
  ["Why would a paper bridge be a bad idea?", "paper is weak and gets soggy", 3],
  ["Which property tells how something feels: color, texture or shape?", "texture", 3],
];

export const HEAT_CHANGES: Item[] = [
  ["What happens to ice when it is heated?", "it melts into water", 1],
  ["What happens to water when it is put in a freezer?", "it freezes into ice", 1],
  ["What happens to butter in a hot pan?", "it melts", 1],
  ["What happens to bread when it is toasted?", "it turns brown and crunchy", 1],
  ["Can melted chocolate become solid again?", "yes (cool it)", 2],
  ["Can a cooked egg become raw again?", "no", 2],
  ["Can toast turn back into bread?", "no", 2],
  ["Is melting ice a reversible or irreversible change?", "reversible", 2],
  ["Is burning wood a reversible or irreversible change?", "irreversible", 2],
  ["Is freezing juice into a popsicle reversible or irreversible?", "reversible", 3],
  ["Is baking a cake reversible or irreversible?", "irreversible", 3],
  ["Why can't burned paper turn back into paper?", "burning makes new materials (ash and smoke)", 3],
];

export const PLANT_NEEDS: Item[] = [
  ["What do plants need to grow?", "water, light, air and nutrients (soil)", 1],
  ["What happens to a plant with no water?", "it wilts and can die", 1],
  ["Where do most plants get water?", "from the soil, through their roots", 1],
  ["What do leaves need to make food?", "sunlight", 1],
  ["A plant is kept in a dark closet. What happens?", "it turns pale and weak", 2],
  ["Why do farmers water their crops?", "plants need water to grow", 2],
  ["Two plants get the same water, but one gets sunlight. Which grows better?", "the one in sunlight", 2],
  ["In an experiment about light, what should stay the same for both plants?", "water, soil and pot (everything except light)", 3],
  ["Why do plants in a forest grow tall?", "to reach the sunlight", 3],
  ["What gas do plants take in from the air?", "carbon dioxide", 3],
];

export const POLLINATION_SEEDS: Item[] = [
  ["What insect carries pollen from flower to flower?", "a bee", 1],
  ["What does a seed grow into?", "a new plant", 1],
  ["How does a dandelion seed travel?", "by wind", 1],
  ["How can a burr seed travel?", "it sticks to animal fur", 1],
  ["Why do bees visit flowers?", "to collect nectar (and pollen)", 2],
  ["How do coconuts travel to new islands?", "they float on water", 2],
  ["How do birds help spread seeds?", "they eat fruit and drop the seeds elsewhere", 2],
  ["What is pollination?", "moving pollen so a plant can make seeds", 2],
  ["Why is it good for seeds to travel away from the parent plant?", "they get more space, light and water", 3],
  ["Name an animal besides a bee that pollinates flowers.", "butterfly, hummingbird or bat (any one)", 3],
  ["Why do some flowers have bright colors and sweet smells?", "to attract pollinators", 3],
];

export const LANDFORMS_WATER: Item[] = [
  ["What is a very tall landform called?", "a mountain", 1],
  ["What is flat land called?", "a plain", 1],
  ["What is land with water all around it called?", "an island", 1],
  ["What is a large body of salt water called?", "an ocean", 1],
  ["What is flowing fresh water called?", "a river", 1],
  ["What is a body of water with land all around it called?", "a lake", 2],
  ["Is most water on Earth fresh or salt water?", "salt water", 2],
  ["Where is most of Earth's fresh water frozen?", "in glaciers and ice caps", 2],
  ["What is a low area between hills or mountains called?", "a valley", 2],
  ["What does a map key (legend) tell you?", "what the symbols on the map mean", 3],
  ["On a map, what color usually shows water?", "blue", 3],
  ["Where can water be found as a solid on Earth?", "glaciers, ice caps and snow", 3],
];

export const EARTH_CHANGES: Item[] = [
  ["Which changes Earth quickly: a volcano or a river carving a canyon?", "a volcano", 1],
  ["Which changes Earth slowly: an earthquake or wind wearing down rock?", "wind wearing down rock", 1],
  ["What do we call wind or water carrying soil away?", "erosion", 1],
  ["Is a landslide a fast or slow change?", "fast", 1],
  ["How was the Grand Canyon made?", "a river wore away rock over millions of years", 2],
  ["How can people stop soil from washing away?", "plant grass or trees, or build walls", 2],
  ["Why do people build levees near rivers?", "to stop flooding", 2],
  ["What can break rocks into smaller pieces?", "water, ice, wind and plant roots", 2],
  ["Why do tree roots help hold soil in place?", "they grip the soil so wind and water can't carry it off", 3],
  ["Which is faster: a flood changing a river bank or a glacier carving a valley?", "a flood", 3],
  ["Name one way to protect a house near a beach from wind and waves.", "sea walls, sand dunes or plants (any one)", 3],
];

// ---------------------------------------------------------------- grade 3
export const BALANCED_FORCES: Item[] = [
  ["What is a push or a pull called?", "a force", 1],
  ["What happens to a ball when you kick it?", "it moves (changes motion)", 1],
  ["If two teams pull a rope equally hard, does it move?", "no — the forces are balanced", 1],
  ["What force pulls objects down toward Earth?", "gravity", 1],
  ["What force slows a sliding box?", "friction", 1],
  ["Balanced or unbalanced? A book resting on a table.", "balanced", 2],
  ["Balanced or unbalanced? A soccer ball speeding up after a kick.", "unbalanced", 2],
  ["Balanced or unbalanced? A car stopping at a red light.", "unbalanced", 2],
  ["What two things describe a force?", "its strength and its direction", 2],
  ["A swing goes back and forth. Is its motion a pattern you can predict?", "yes", 3],
  ["Why does a ball roll farther on a smooth floor than on carpet?", "there is less friction on the smooth floor", 3],
  ["Pushes of 5 N to the right and 3 N to the left act on a box. Which way does it move?", "to the right", 3],
];

export const LIFE_CYCLES: Item[] = [
  ["What are the stages of a butterfly's life cycle?", "egg, larva (caterpillar), pupa (chrysalis), adult", 1],
  ["What hatches from a frog egg?", "a tadpole", 1],
  ["What does a seed grow into first?", "a seedling (sprout)", 1],
  ["What is the stage between caterpillar and butterfly?", "pupa (chrysalis)", 1],
  ["What are the stages of a frog's life cycle?", "egg, tadpole, froglet, adult frog", 2],
  ["What are the stages of a plant's life cycle?", "seed, seedling, adult plant, flower, fruit with seeds", 2],
  ["What is metamorphosis?", "a big change in body form during an animal's life", 2],
  ["Does a dog go through metamorphosis?", "no", 2],
  ["What is the same about all life cycles?", "birth, growth, reproduction and death", 3],
  ["Why do plants make flowers?", "to make seeds (reproduce)", 3],
  ["A grasshopper hatches looking like a small adult. What is this called?", "incomplete metamorphosis", 3],
];

export const INHERITED_TRAITS: Item[] = [
  ["Is eye color inherited or learned?", "inherited", 1],
  ["Is riding a bike inherited or learned?", "learned", 1],
  ["Is a dog's fur color inherited or learned?", "inherited", 1],
  ["Is speaking Spanish inherited or learned?", "learned", 1],
  ["Is a bird's beak shape inherited or learned?", "inherited", 1],
  ["Is a dog sitting on command inherited or learned?", "learned", 2],
  ["What is a trait?", "a feature or characteristic of a living thing", 2],
  ["A plant gets little water and grows short. Is its height caused by the environment or inheritance?", "the environment", 2],
  ["Can a trait be affected by both inheritance and the environment?", "yes", 3],
  ["Why might a person who inherited 'tall' genes still be short?", "poor nutrition or other environment factors", 3],
  ["Two brown rabbits have a white baby. Is this possible?", "yes — offspring can vary", 3],
];

export const ADAPTATIONS: Item[] = [
  ["What is an adaptation?", "a trait that helps a living thing survive in its environment", 1],
  ["Why do polar bears have thick fur?", "to stay warm in the cold", 1],
  ["Why do cactuses have thick stems?", "to store water", 1],
  ["Why do some animals have colors that match their surroundings?", "camouflage — to hide", 1],
  ["Why do some birds fly south in winter?", "to find food and warmth (migration)", 2],
  ["Why do bears hibernate?", "to save energy when food is scarce", 2],
  ["Why do camels have humps?", "to store fat for energy", 2],
  ["Why do fish have streamlined bodies?", "to move easily through water", 2],
  ["What may happen to animals if their habitat changes a lot?", "they may move, adapt or die out", 3],
  ["Why do owls have large eyes?", "to see well at night", 3],
  ["A brown moth lives on dark tree bark. Will it survive better than a white moth there?", "yes — it is better camouflaged", 3],
];

export const FOSSILS: Item[] = [
  ["What is a fossil?", "the preserved remains or traces of a living thing from long ago", 1],
  ["In what kind of rock are most fossils found?", "sedimentary rock", 1],
  ["Can footprints become fossils?", "yes (trace fossils)", 1],
  ["What scientist studies fossils?", "a paleontologist", 1],
  ["What can fossils tell us?", "what living things and environments were like long ago", 2],
  ["A fish fossil is found on a mountain. What does that suggest?", "the area was once under water", 2],
  ["What does extinct mean?", "no longer living anywhere on Earth", 2],
  ["Are deeper rock layers usually older or younger?", "older", 3],
  ["Fossil ferns are found in a cold place. What was the climate like long ago?", "warm and wet", 3],
  ["Why are fossils of soft-bodied animals rare?", "soft parts rot before they can be preserved", 3],
];

export const ANIMAL_GROUPS: Item[] = [
  ["Why do wolves hunt in packs?", "to catch bigger prey by working together", 1],
  ["What is a group of fish swimming together called?", "a school", 1],
  ["Why do bees live in groups?", "to share jobs and survive", 1],
  ["What is a group of lions called?", "a pride", 1],
  ["How does living in a herd help zebras?", "it protects them from predators", 2],
  ["What job does a worker ant do?", "finds food and cares for the colony", 2],
  ["What is a group of geese flying together called?", "a flock (or skein)", 2],
  ["Why do penguins huddle together?", "to stay warm", 2],
  ["Name one way living in a group can be harder for animals.", "they must share food (or spread disease)", 3],
  ["How do some animals warn their group about danger?", "with sounds or signals", 3],
];

export const WEATHER_CLIMATE: Item[] = [
  ["What tool measures temperature?", "a thermometer", 1],
  ["What tool measures rainfall?", "a rain gauge", 1],
  ["What tool shows wind direction?", "a wind vane", 1],
  ["What is weather?", "the conditions of the air at a place and time", 1],
  ["What is climate?", "the usual weather of a place over many years", 2],
  ["Weather or climate? 'It is snowing today.'", "weather", 2],
  ["Weather or climate? 'Deserts are dry most of the year.'", "climate", 2],
  ["What kind of climate do polar areas have?", "very cold", 2],
  ["Why do scientists keep weather records?", "to find patterns and predict the weather", 3],
  ["Which season usually has the most rain in a tropical monsoon climate?", "the wet (monsoon) season", 3],
  ["What weather do dark, tall clouds often bring?", "thunderstorms (rain)", 3],
];

export const NATURAL_HAZARDS: Item[] = [
  ["What is a strong spinning windstorm over land called?", "a tornado", 1],
  ["What is a huge storm that forms over warm oceans called?", "a hurricane", 1],
  ["What is it called when water covers land that is normally dry?", "a flood", 1],
  ["What is a long period with very little rain called?", "a drought", 1],
  ["How do lightning rods protect buildings?", "they carry lightning safely into the ground", 2],
  ["Why do people build houses on stilts near rivers?", "to stay above flood water", 2],
  ["Why are storm shelters built underground?", "to protect people from tornado winds", 2],
  ["What does a tsunami warning system do?", "warns people to move to high ground", 2],
  ["How do earthquake-safe buildings help?", "they bend or sway instead of falling", 3],
  ["Why do weather forecasts help reduce damage from hurricanes?", "people get time to prepare or leave", 3],
];

// ---------------------------------------------------------------- grade 4
export const ENERGY_FORMS: Item[] = [
  ["What kind of energy does a moving car have?", "kinetic (motion) energy", 1],
  ["What kind of energy does a lamp give off?", "light energy (and heat)", 1],
  ["What kind of energy does a battery store?", "chemical energy", 1],
  ["What kind of energy makes a fan spin?", "electrical energy", 1],
  ["What kind of energy do we get from food?", "chemical energy", 1],
  ["A faster ball has more or less energy than a slower one?", "more", 2],
  ["What energy changes happen in a flashlight?", "chemical → electrical → light (and heat)", 2],
  ["What energy changes happen when you rub your hands together?", "motion → heat", 2],
  ["What happens to energy when two cars collide?", "it is transferred and changed into sound, heat and motion", 2],
  ["Can energy be created or destroyed?", "no — it only changes form or moves", 3],
  ["What energy change happens in a solar panel?", "light → electrical", 3],
  ["Why does a bouncing ball bounce lower each time?", "some energy changes to heat and sound", 3],
];

export const WAVES_BASIC: Item[] = [
  ["What is the top of a wave called?", "the crest", 1],
  ["What is the bottom of a wave called?", "the trough", 1],
  ["What is the height of a wave from its middle called?", "the amplitude", 1],
  ["What is the distance from one crest to the next called?", "the wavelength", 1],
  ["Do waves carry water across the ocean, or energy?", "energy", 2],
  ["A louder sound has a bigger or smaller amplitude?", "bigger", 2],
  ["A cork bobs up and down as a wave passes. Does it travel with the wave?", "no — it stays in about the same place", 2],
  ["Name two kinds of waves.", "sound, light, water or earthquake waves (any two)", 2],
  ["If waves get closer together, does the wavelength get longer or shorter?", "shorter", 3],
  ["How do we see objects?", "light reflects off them and enters our eyes", 3],
  ["How is information sent using patterns?", "with codes like Morse code, binary or light signals", 3],
];

export const ROCKS_EROSION: Item[] = [
  ["What is weathering?", "breaking rock into smaller pieces", 1],
  ["What is erosion?", "moving weathered rock and soil to a new place", 1],
  ["What is deposition?", "dropping sediment in a new place", 1],
  ["Name something that causes weathering.", "water, ice, wind or plant roots (any one)", 1],
  ["How does ice break rocks?", "water freezes in cracks, expands and splits the rock", 2],
  ["What forms when a river drops sediment where it meets the sea?", "a delta", 2],
  ["What carved U-shaped valleys?", "glaciers", 2],
  ["What landform does wind erosion make in a desert?", "sand dunes (or arches)", 2],
  ["Rock layers show a fish fossil below a land-plant fossil. What changed?", "the area was once water, then became land", 3],
  ["Why are the lowest rock layers usually the oldest?", "they were deposited first", 3],
  ["Why do mountains in old ranges look rounder?", "they have been weathered and eroded for longer", 3],
];

export const EARTH_PATTERNS: Item[] = [
  ["Where do most earthquakes happen?", "along the edges of tectonic plates", 1],
  ["What comes out of a volcano?", "lava, ash and gases", 1],
  ["What is the Ring of Fire?", "a ring of volcanoes and earthquakes around the Pacific Ocean", 2],
  ["Why do volcanoes and earthquakes happen in the same places?", "both happen where plates meet", 2],
  ["What is magma called once it reaches the surface?", "lava", 2],
  ["What does a map of earthquakes help scientists see?", "patterns along plate boundaries", 3],
  ["What landform can form when two plates push together?", "mountains", 3],
  ["What deep ocean feature forms where one plate sinks under another?", "a trench", 3],
  ["What is the shaking of the ground caused by moving rock called?", "an earthquake", 1],
  ["What is an opening in Earth's crust where lava erupts called?", "a volcano", 1],
  ["What are the giant moving pieces of Earth's crust called?", "tectonic plates", 1],
  ["What instrument measures earthquakes?", "a seismograph", 2],
  ["Why do scientists map earthquakes and volcanoes?", "to find patterns and warn people about danger", 2],
  ["Which island chain formed from volcanoes in the middle of a plate: Hawaii or Japan?", "Hawaii", 3],
];

export const ENERGY_RESOURCES: Item[] = [
  ["Renewable or nonrenewable? Solar energy", "renewable", 1],
  ["Renewable or nonrenewable? Coal", "nonrenewable", 1],
  ["Renewable or nonrenewable? Wind", "renewable", 1],
  ["Renewable or nonrenewable? Oil", "nonrenewable", 1],
  ["Renewable or nonrenewable? Natural gas", "nonrenewable", 1],
  ["Renewable or nonrenewable? Water (hydroelectric)", "renewable", 1],
  ["What are fossil fuels made from?", "remains of ancient plants and animals", 2],
  ["Name one problem with burning fossil fuels.", "air pollution or climate change (any one)", 2],
  ["Name one problem with wind energy.", "it only works when the wind blows (or noise, bird deaths)", 3],
  ["Why is solar power harder to use at night?", "there is no sunlight", 3],
  ["How can people save energy at home?", "turn off lights, use efficient devices (any one)", 3],
  ["Why will fossil fuels run out someday?", "they take millions of years to form and we use them much faster", 3],
  ["What is one benefit and one drawback of hydroelectric dams?", "benefit: clean power; drawback: floods land and affects fish", 3],
  ["Why is geothermal energy only used in some places?", "the hot rock must be near the surface", 3],
];

// ---------------------------------------------------------------- grade 5
export const MATTER_PARTICLES: Item[] = [
  ["What is matter?", "anything that has mass and takes up space", 1],
  ["What is matter made of?", "tiny particles too small to see", 1],
  ["Is air matter?", "yes", 1],
  ["What is a mixture?", "two or more substances combined that keep their own properties", 1],
  ["Is salad a mixture?", "yes", 1],
  ["What is a solution?", "a mixture where one substance dissolves evenly in another", 2],
  ["How can you separate sand from water?", "filter it", 2],
  ["How can you separate salt from water?", "let the water evaporate", 2],
  ["How can you separate iron filings from sand?", "use a magnet", 2],
  ["Why does a balloon get bigger when you blow air in?", "air particles take up space", 2],
  ["Is mixing vinegar and baking soda a physical or chemical change?", "chemical (a gas forms)", 3],
  ["Sugar seems to disappear in water. Is it gone?", "no — it dissolved; the particles are still there", 3],
  ["What evidence shows a new substance formed?", "gas bubbles, color change, light, heat or a new smell", 3],
];

export const GRAVITY_BASIC: Item[] = [
  ["Which way does gravity pull objects near Earth?", "down, toward Earth's center", 1],
  ["Why does a ball fall when you drop it?", "gravity pulls it down", 1],
  ["Does gravity act on the moon?", "yes", 1],
  ["What keeps the moon orbiting Earth?", "gravity", 2],
  ["What keeps Earth orbiting the sun?", "the sun's gravity", 2],
  ["Would you weigh more or less on the moon?", "less", 2],
  ["Why do people in Australia not fall off Earth?", "gravity pulls everyone toward Earth's center", 3],
  ["Does your mass change when you go to the moon?", "no — only your weight changes", 3],
  ["A ball is thrown straight up. Why does it come back down?", "gravity pulls it back toward Earth", 2],
  ["Which pulls harder on you: Earth's gravity or the moon's?", "Earth's gravity", 2],
  ["Why do raindrops fall down instead of floating?", "gravity pulls them toward Earth's center", 3],
  ["Why do objects of different weights fall at the same rate without air?", "gravity speeds all objects up equally", 3],
  ["What would happen to the moon if Earth's gravity disappeared?", "it would move off in a straight line into space", 3],
];

export const FOOD_ENERGY: Item[] = [
  ["Where does the energy in food first come from?", "the sun", 1],
  ["What do plants make during photosynthesis?", "food (sugar) and oxygen", 1],
  ["What do plants need to make food?", "sunlight, water and carbon dioxide", 1],
  ["What do animals get from eating food?", "energy and materials to grow", 1],
  ["Do plants get their food from the soil?", "no — they make it from air and water using sunlight", 2],
  ["What gas do plants give off that animals breathe?", "oxygen", 2],
  ["Why do animals need to eat plants or other animals?", "they can't make their own food", 2],
  ["How does energy from the sun get into a hawk?", "sun → plant → mouse → hawk", 3],
  ["Where does most of a tree's mass come from?", "carbon dioxide from the air", 3],
  ["What do decomposers return to the soil?", "nutrients (matter)", 3],
];

export const MATTER_CYCLES: Item[] = [
  ["What are decomposers?", "living things that break down dead plants and animals", 1],
  ["Name a decomposer.", "fungi (mushrooms), bacteria or worms (any one)", 1],
  ["What happens to a fallen leaf over time?", "it breaks down and becomes part of the soil", 1],
  ["Why are decomposers important?", "they recycle nutrients back to the soil", 2],
  ["What would happen if there were no decomposers?", "dead things would pile up and soil would lose nutrients", 2],
  ["What gas do animals breathe out that plants use?", "carbon dioxide", 2],
  ["Trace matter: grass → rabbit → fox → ? → soil", "decomposers", 3],
  ["Why is a compost pile warm inside?", "decomposers give off heat as they break things down", 3],
  ["Where does the carbon in a dead tree go when it decays?", "into the soil and the air as carbon dioxide", 3],
  ["Why do farmers add compost to soil?", "it adds nutrients that help plants grow", 3],
  ["In a sealed jar with a plant and a snail, why can both survive for a while?", "the plant makes oxygen and food; the snail gives off carbon dioxide and waste", 3],
];

export const EARTH_SPHERES: Item[] = [
  ["Which sphere is the layer of air around Earth?", "atmosphere", 1],
  ["Which sphere is all of Earth's water?", "hydrosphere", 1],
  ["Which sphere is the rock and land?", "geosphere", 1],
  ["Which sphere is all living things?", "biosphere", 1],
  ["Rain falling on a mountain: which two spheres interact?", "hydrosphere and geosphere (from the atmosphere)", 2],
  ["Plants taking in carbon dioxide: which two spheres interact?", "biosphere and atmosphere", 2],
  ["Ocean waves eroding a cliff: which two spheres interact?", "hydrosphere and geosphere", 2],
  ["A volcano erupts ash into the sky: which two spheres interact?", "geosphere and atmosphere", 3],
  ["How does the ocean affect the weather?", "it stores heat and adds moisture to the air", 3],
  ["Wind blowing sand into dunes: which two spheres interact?", "atmosphere and geosphere", 3],
  ["Animals drinking from a river: which two spheres interact?", "biosphere and hydrosphere", 3],
  ["Tree roots breaking rock: which two spheres interact?", "biosphere and geosphere", 3],
];

export const EARTH_WATER: Item[] = [
  ["About what fraction of Earth's water is salt water?", "about 97%", 1],
  ["Where is most of Earth's fresh water?", "frozen in glaciers and ice caps", 1],
  ["Can people drink ocean water safely?", "no — it is too salty", 1],
  ["Is lake water usually fresh or salt water?", "fresh (most lakes)", 2],
  ["What is water stored underground called?", "groundwater", 2],
  ["Why is fresh water precious?", "only a tiny part of Earth's water is fresh and easy to reach", 2],
  ["Of all Earth's water, about what percent is fresh water?", "about 3%", 3],
  ["Name a way to save water at home.", "shorter showers, fix leaks, turn off the tap (any one)", 3],
  ["Why do some countries remove salt from seawater (desalination)?", "they don't have enough fresh water", 3],
  ["How does groundwater get into a well?", "rain soaks into the ground and fills spaces in rock and soil", 3],
  ["Why does melting glaciers matter for drinking water?", "glaciers store fresh water that feeds rivers", 3],
];

export const PROTECT_EARTH: Item[] = [
  ["What does it mean to recycle?", "turn used materials into new products", 1],
  ["What are the three Rs?", "reduce, reuse, recycle", 1],
  ["What is pollution?", "harmful materials added to air, water or land", 1],
  ["Name a way to reduce air pollution.", "walk, bike, use public transport or clean energy (any one)", 2],
  ["Why is cutting down forests a problem?", "animals lose homes and less carbon dioxide is absorbed", 2],
  ["What is a protected area such as a national park for?", "to protect land, plants and animals", 2],
  ["Why is plastic in the ocean harmful?", "animals eat it or get tangled", 3],
  ["How can a community protect a river?", "stop dumping waste, plant trees on banks, clean-ups (any one)", 3],
  ["Why is reusing a bottle better than recycling it?", "reusing saves the energy needed to recycle", 3],
  ["How do wind farms help protect Earth's air?", "they make electricity without burning fuel", 3],
  ["Why do some cities plant more trees?", "trees clean the air, give shade and absorb carbon dioxide", 3],
];

export const STARS_SHADOWS: Item[] = [
  ["What is the closest star to Earth?", "the sun", 1],
  ["Why does the sun look bigger than other stars?", "it is much closer", 1],
  ["Why do we have day and night?", "Earth spins (rotates) on its axis", 1],
  ["How long does Earth take to rotate once?", "about 24 hours (one day)", 1],
  ["How long does Earth take to orbit the sun?", "about 365 days (one year)", 2],
  ["Why do shadows change length during the day?", "the sun's position in the sky changes", 2],
  ["Why do we see different constellations in different seasons?", "Earth's orbit means we face different parts of space at night", 2],
  ["Why can't we see stars in the daytime?", "sunlight makes the sky too bright", 3],
  ["At what time of day are shadows shortest?", "around noon", 3],
  ["Some stars look dim. Does that mean they are small?", "not necessarily — they may be farther away", 3],
];

export const SCIENCE_RIDDLES: Item[] = [
  ["I am a star that you can see in the daytime. What am I?", "the sun", 1],
  ["I fall from the sky but am not rain. I am cold and white. What am I?", "snow", 1],
  ["I have roots but I am not a tooth, and I have leaves but I am not a book. What am I?", "a tree", 1],
  ["I am the only planet known to have life. What am I?", "Earth", 1],
  ["I change from a caterpillar into something with wings. What am I?", "a butterfly", 1],
  ["I am water you can't pour because I am frozen. What am I?", "ice", 1],
  ["I pull everything toward Earth but you can't see me. What am I?", "gravity", 2],
  ["I am a mammal that can fly. What am I?", "a bat", 2],
  ["I am the hottest planet, even though I am not the closest to the sun. What am I?", "Venus", 2],
  ["I am the hardest natural mineral. What am I?", "diamond", 2],
  ["I travel at 300,000 km every second. What am I?", "light", 3],
  ["I am a metal that is liquid at room temperature. What am I?", "mercury", 3],
  ["I am a gas that makes up most of the air you breathe. What am I?", "nitrogen", 3],
  ["I can't be seen, but without me a fire goes out. What am I?", "oxygen", 3],
];
