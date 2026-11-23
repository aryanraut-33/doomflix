export interface QuizQuestion {
  id: string;
  category: 
    | 'Characters & Origins'
    | 'Infinity Saga'
    | 'Multiverse'
    | 'TVA & Timelines'
    | 'Alternate Realities'
    | 'Incursions'
    | 'Fantastic Four'
    | 'X-Men & Mutants'
    | 'Doctor Doom'
    | 'Avengers History';
  difficulty: 'beginner' | 'intermediate' | 'expert';
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  relatedMovieId: string; // matches marvelCatalogue ID for spoiler protection
  spoilerSeason?: number;
  spoilerEpisode?: number;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // 1. TVA & Timelines
  {
    id: 'q-tva-01',
    category: 'TVA & Timelines',
    difficulty: 'beginner',
    question: 'In Loki Season 1, what does the TVA use as harmless paperweights in their office desks?',
    options: ['Infinity Stones', 'Vibranium shards', 'Pym Particle vials', 'Arc reactors'],
    correctAnswer: 'Infinity Stones',
    explanation: 'Casey casually reveals that workers use redundant Infinity Stones from pruned variants as paperweights, showing that outside normal space-time, the Stones have zero power.',
    relatedMovieId: 'loki-s1',
    spoilerSeason: 1,
    spoilerEpisode: 1
  },
  {
    id: 'q-tva-02',
    category: 'TVA & Timelines',
    difficulty: 'intermediate',
    question: 'Who created the Time Variance Authority and isolated the Sacred Timeline to prevent a multiversal war?',
    options: ['He Who Remains', 'Victor Timely', 'The Living Tribunal', 'Ravonna Renslayer'],
    correctAnswer: 'He Who Remains',
    explanation: 'He Who Remains, a 31st-century variant of Kang, weaponized Alioth to defeat his alternate selves and established the TVA to isolate a single Sacred Timeline.',
    relatedMovieId: 'loki-s1',
    spoilerSeason: 1,
    spoilerEpisode: 6
  },
  {
    id: 'q-tva-03',
    category: 'TVA & Timelines',
    difficulty: 'expert',
    question: 'In the finale of Loki Season 2, into what mythical cosmic structure does Loki transform the dying timeline branches?',
    options: ['Yggdrasil (The World Tree)', 'The Quantum Spire', 'The Bifrost Core', 'The Nexus of All Realities'],
    correctAnswer: 'Yggdrasil (The World Tree)',
    explanation: 'Loki gathers the dying timeline threads with his green magical energy and shapes them into Yggdrasil, the Norse World Tree, giving every branch life and free will.',
    relatedMovieId: 'loki-s2',
    spoilerSeason: 2,
    spoilerEpisode: 6
  },
  {
    id: 'q-tva-04',
    category: 'TVA & Timelines',
    difficulty: 'intermediate',
    question: 'What is the phenomenon called that Loki suffers from in Season 2 where he is pulled uncontrollably across time?',
    options: ['Time-Slipping', 'Quantum Phasing', 'Temporal Divergence', 'Timeline Bleed'],
    correctAnswer: 'Time-Slipping',
    explanation: 'O.B. explains that time-slipping is impossible inside the TVA, making Loki\'s condition unprecedented before he learns to control it.',
    relatedMovieId: 'loki-s2',
    spoilerSeason: 2,
    spoilerEpisode: 1
  },

  // 2. Incursions & Multiverse
  {
    id: 'q-inc-01',
    category: 'Incursions',
    difficulty: 'beginner',
    question: 'According to Doctor Strange in the Multiverse of Madness, what is an "Incursion"?',
    options: [
      'The collision and destruction of two universes',
      'A breach by the Dark Dimension',
      'The rebirth of a dead Celestial',
      'A temporal paradox created by time travel'
    ],
    correctAnswer: 'The collision and destruction of two universes',
    explanation: 'Reed Richards on Earth-838 explains that when someone travels between universes or dreamwalks, the boundary destabilizes until two universes collide, wiping out one or both.',
    relatedMovieId: 'dr-strange-multiverse-madness'
  },
  {
    id: 'q-inc-02',
    category: 'Incursions',
    difficulty: 'intermediate',
    question: 'Which mysterious sorceress appears in the mid-credits of Multiverse of Madness to recruit Strange to fix an Incursion?',
    options: ['Clea', 'Morgan le Fay', 'Jennifer Kale', 'Satana'],
    correctAnswer: 'Clea',
    explanation: 'Clea (played by Charlize Theron) confronts Doctor Strange in New York, slashes a tear into the Dark Dimension, and asks him to help fix an Incursion he caused.',
    relatedMovieId: 'dr-strange-multiverse-madness'
  },
  {
    id: 'q-inc-03',
    category: 'Incursions',
    difficulty: 'expert',
    question: 'What dark occult grimoire was used by both Wanda Maximoff and alternate Stranges to execute "dreamwalking"?',
    options: ['The Darkhold', 'The Book of Vishanti', 'The Casket of Ancient Winters', 'The Necronomicon'],
    correctAnswer: 'The Darkhold',
    explanation: 'The Darkhold (authored by the elder god Chthon) grants corrupting knowledge of dreamwalking into alternate versions of oneself across the multiverse.',
    relatedMovieId: 'dr-strange-multiverse-madness'
  },

  // 3. Characters & Origins
  {
    id: 'q-char-01',
    category: 'Characters & Origins',
    difficulty: 'beginner',
    question: 'What substance was extracted from the petrified Celestial Tiamut in Captain America: Brave New World?',
    options: ['Adamantium', 'Vibranium', 'Uru Metal', 'Carbonadium'],
    correctAnswer: 'Adamantium',
    explanation: 'President Ross announces that the crystalline anomaly protruding from the Indian Ocean (Celestial Tiamut from Eternals) contains the indestructible metal Adamantium.',
    relatedMovieId: 'captain-america-brave-new-world'
  },
  {
    id: 'q-char-02',
    category: 'Characters & Origins',
    difficulty: 'intermediate',
    question: 'In Captain America: The First Avenger, who was the German scientist who invented the Super-Soldier Serum?',
    options: ['Dr. Abraham Erskine', 'Dr. Arnim Zola', 'Dr. Werner Schmidt', 'Dr. Josef Reinstein'],
    correctAnswer: 'Dr. Abraham Erskine',
    explanation: 'Dr. Abraham Erskine defected to the Strategic Scientific Reserve and chose Steve Rogers for Project Rebirth because a weak man knows the value of strength.',
    relatedMovieId: 'cap-first-avenger'
  },
  {
    id: 'q-char-03',
    category: 'Characters & Origins',
    difficulty: 'expert',
    question: 'What is the name of the cosmic being who devours planets in The Fantastic Four: First Steps?',
    options: ['Galactus', 'Ego', 'Eson the Searcher', 'Dormammu'],
    correctAnswer: 'Galactus',
    explanation: 'Galactus (voiced by Ralph Ineson) travels the cosmos consuming the life force of planets, accompanied by his herald Shalla-Bal.',
    relatedMovieId: 'fantastic-four-first-steps'
  },

  // 4. Doctor Doom
  {
    id: 'q-doom-01',
    category: 'Doctor Doom',
    difficulty: 'beginner',
    question: 'Which sovereign European nation is ruled by Victor Von Doom in Marvel lore?',
    options: ['Latveria', 'Sokovia', 'Genosha', 'Madripoor'],
    correctAnswer: 'Latveria',
    explanation: 'Doctor Doom is the supreme monarch of Latveria, governing with an iron fist, personal Doombots, and diplomatic immunity.',
    relatedMovieId: 'fantastic-four-first-steps'
  },
  {
    id: 'q-doom-02',
    category: 'Doctor Doom',
    difficulty: 'intermediate',
    question: 'Which actor was officially announced at San Diego Comic-Con 2024 to portray Victor Von Doom in Avengers: Doomsday?',
    options: ['Robert Downey Jr.', 'Cillian Murphy', 'Mads Mikkelsen', 'Viggo Mortensen'],
    correctAnswer: 'Robert Downey Jr.',
    explanation: 'In a historic Comic-Con reveal by the Russo Brothers, Robert Downey Jr. stepped out in Doom\'s green cloak and mask to portray Victor Von Doom.',
    relatedMovieId: 'fantastic-four-first-steps'
  },
  {
    id: 'q-doom-03',
    category: 'Doctor Doom',
    difficulty: 'expert',
    question: 'In Marvel Comics Secret Wars (2015), what patchwork planet does "God Emperor Doom" create from the remnants of colliding universes?',
    options: ['Battleworld', 'Chronopolis', 'Counter-Earth', 'The Savage Land'],
    correctAnswer: 'Battleworld',
    explanation: 'During the final Incursion between Earth-616 and Earth-1610, Doom steals the power of the Beyonders and salvages fragments of dying realities into Battleworld.',
    relatedMovieId: 'dr-strange-multiverse-madness'
  },

  // 5. Alternate Realities
  {
    id: 'q-alt-01',
    category: 'Alternate Realities',
    difficulty: 'beginner',
    question: 'In Deadpool & Wolverine, what is the term used by Agent Paradox for an essential being whose demise causes a universe to slowly decay?',
    options: ['Anchor Being', 'Nexus Anchor', 'Prime Pillar', 'Keystone Being'],
    correctAnswer: 'Anchor Being',
    explanation: 'Agent Paradox explains that Logan was the Anchor Being of Earth-10005, and with his death in the future, that entire reality began a slow thousands-year fade.',
    relatedMovieId: 'deadpool-and-wolverine'
  },
  {
    id: 'q-alt-02',
    category: 'Alternate Realities',
    difficulty: 'intermediate',
    question: 'Which fan-favourite mutant played by Channing Tatum finally made his live-action debut in the Void in Deadpool & Wolverine?',
    options: ['Gambit (Remy LeBeau)', 'Havok', 'Bishop', 'Cannonball'],
    correctAnswer: 'Gambit (Remy LeBeau)',
    explanation: 'After years in development hell for a standalone film, Channing Tatum debuted as Cajun card-thrower Gambit in the Void alongside Blade and Elektra.',
    relatedMovieId: 'deadpool-and-wolverine'
  },
  {
    id: 'q-alt-03',
    category: 'Alternate Realities',
    difficulty: 'expert',
    question: 'On Earth-838 in Multiverse of Madness, who served as the leader of the Illuminati before being obliterated by Wanda?',
    options: ['Professor Charles Xavier', 'Mr. Fantastic', 'Captain Carter', 'Black Bolt'],
    correctAnswer: 'Professor Charles Xavier',
    explanation: 'Patrick Stewart\'s Professor Xavier led the Earth-838 Illuminati in his signature 1990s animated yellow hoverchair before Wanda snapped his neck in the psychic astral plane.',
    relatedMovieId: 'dr-strange-multiverse-madness'
  },

  // 6. X-Men & Mutants
  {
    id: 'q-xmen-01',
    category: 'X-Men & Mutants',
    difficulty: 'beginner',
    question: 'In X2: X-Men United, where is the clandestine military facility located where Wolverine\'s skeleton was bonded with adamantium?',
    options: ['Alkali Lake', 'Weapon X Bunker', 'Three Mile Island', 'Trask Labs'],
    correctAnswer: 'Alkali Lake',
    explanation: 'Colonel William Stryker operated his covert Weapon X experiments beneath the frozen dam at Alkali Lake.',
    relatedMovieId: 'x2-united'
  },
  {
    id: 'q-xmen-02',
    category: 'X-Men & Mutants',
    difficulty: 'intermediate',
    question: 'In X-Men: Days of Future Past, who is sent back through time to 1973 to stop Mystique from killing Bolivar Trask?',
    options: ['Wolverine', 'Professor X', 'Kitty Pryde', 'Magneto'],
    correctAnswer: 'Wolverine',
    explanation: 'Because Wolverine\'s mutant healing factor can withstand the physical and mental trauma of decades of consciousness transfer, he is sent back by Kitty Pryde.',
    relatedMovieId: 'x-men-days-of-future-past'
  },
  {
    id: 'q-xmen-03',
    category: 'X-Men & Mutants',
    difficulty: 'expert',
    question: 'What iconic song plays during Quicksilver\'s slow-motion kitchen breakout scene in X-Men: Days of Future Past?',
    options: ['Time in a Bottle by Jim Croce', 'Sweet Dreams by Eurythmics', 'Stayin\' Alive by Bee Gees', 'Don\'t Stop Me Now by Queen'],
    correctAnswer: 'Time in a Bottle by Jim Croce',
    explanation: 'Peter Maximoff (Evan Peters) puts on his stereo headphones to Jim Croce\'s 1973 hit "Time in a Bottle" while effortlessly redirecting bullets and guards.',
    relatedMovieId: 'x-men-days-of-future-past'
  },

  // 7. Infinity Saga
  {
    id: 'q-inf-01',
    category: 'Infinity Saga',
    difficulty: 'beginner',
    question: 'Which Infinity Stone was encased inside Loki\'s Scepter during The Avengers (2012)?',
    options: ['The Mind Stone', 'The Space Stone', 'The Power Stone', 'The Soul Stone'],
    correctAnswer: 'The Mind Stone',
    explanation: 'The blue gem atop Loki\'s scepter housed the yellow Mind Stone, gifted by Thanos to conquer Earth, later harvested by Ultron to bring Vision to life.',
    relatedMovieId: 'the-avengers'
  },
  {
    id: 'q-inf-02',
    category: 'Infinity Saga',
    difficulty: 'intermediate',
    question: 'How many alternate futures did Doctor Strange view on Titan in Avengers: Infinity War, and in how many did the Avengers win?',
    options: [
      '14,000,605 futures, and only 1 victory',
      '14,000,000 futures, and 14 victories',
      '10,000,000 futures, and 3 victories',
      '1,000,000 futures, and 1 victory'
    ],
    correctAnswer: '14,000,605 futures, and only 1 victory',
    explanation: 'Doctor Strange peered through possible timelines with the Time Stone and declared there was only one path out of 14,000,605 where they prevailed.',
    relatedMovieId: 'avengers-infinity-war'
  },
  {
    id: 'q-inf-03',
    category: 'Infinity Saga',
    difficulty: 'expert',
    question: 'In Avengers: Endgame, what year and location do Tony Stark and Steve Rogers travel to after their 2012 New York plan fails?',
    options: [
      '1970 Camp Lehigh, New Jersey',
      '1945 Arctic Tundra',
      '1989 Pym Technologies HQ',
      '1995 Los Angeles'
    ],
    correctAnswer: '1970 Camp Lehigh, New Jersey',
    explanation: 'They travel to the military base Camp Lehigh in 1970, where Tony reconciles with his father Howard Stark and Steve steals additional Pym particles from young Hank Pym.',
    relatedMovieId: 'avengers-endgame'
  },

  // 8. Fantastic Four
  {
    id: 'q-ff-01',
    category: 'Fantastic Four',
    difficulty: 'beginner',
    question: 'What time period aesthetic is the world of The Fantastic Four: First Steps set in?',
    options: ['1960s Retro-Futuristic', '1980s Cyberpunk', '1920s Art Deco', 'Far-future 3000s'],
    correctAnswer: '1960s Retro-Futuristic',
    explanation: 'Director Matt Shakman confirmed the film takes place on an alternate Earth with a distinctive 1960s space-age optimistic retro-futuristic aesthetic.',
    relatedMovieId: 'fantastic-four-first-steps'
  },
  {
    id: 'q-ff-02',
    category: 'Fantastic Four',
    difficulty: 'intermediate',
    question: 'What is the name of the friendly, hover-capable robotic assistant of the Fantastic Four?',
    options: ['H.E.R.B.I.E.', 'J.A.R.V.I.S.', 'F.R.I.D.A.Y.', 'Doombot Zero'],
    correctAnswer: 'H.E.R.B.I.E.',
    explanation: 'H.E.R.B.I.E. (Humanoid Experimental Robot, B-type, Integrated Electronics) is the classic family robot built by Reed Richards.',
    relatedMovieId: 'fantastic-four-first-steps'
  },

  // 9. Avengers History
  {
    id: 'q-avg-01',
    category: 'Avengers History',
    difficulty: 'beginner',
    question: 'In Captain America: Civil War, what international agreement requires all enhanced individuals to register with the United Nations?',
    options: ['The Sokovia Accords', 'The Geneva Superhuman Convention', 'The Raft Treaty', 'The Wakandan Protocols'],
    correctAnswer: 'The Sokovia Accords',
    explanation: 'Ratified by 117 nations following the tragedy in Lagos and the destruction of Sokovia, the Accords caused the Avengers to split down the middle.',
    relatedMovieId: 'captain-america-civil-war'
  },
  {
    id: 'q-avg-02',
    category: 'Avengers History',
    difficulty: 'intermediate',
    question: 'What code name did Baron Helmut Zemo use to frame the Winter Soldier for bombing the UN conference in Vienna?',
    options: ['James Buchanan Barnes', 'Dr. Theo Broussard', 'The Ghost of Siberia', 'Operative Delta'],
    correctAnswer: 'Dr. Theo Broussard',
    explanation: 'Zemo murdered the UN psychological profiler Dr. Broussard and assumed his identity to gain access to Bucky Barnes inside the Joint Counter Terrorist Centre.',
    relatedMovieId: 'captain-america-civil-war'
  },
  {
    id: 'q-avg-03',
    category: 'Avengers History',
    difficulty: 'expert',
    question: 'In Captain America: The First Avenger, which German town was the location of HYDRA\'s main weapons facility where Bucky and the 107th were held captive?',
    options: ['Kreischberg, Austria', 'Munich, Germany', 'Nuremberg, Germany', 'Stuttgart, Germany'],
    correctAnswer: 'Kreischberg, Austria',
    explanation: 'Steve Rogers went rogue and marched thirty miles behind enemy lines into Kreischberg to liberate Bucky Barnes and 400 soldiers of the 107th Infantry.',
    relatedMovieId: 'cap-first-avenger'
  },

  // 10. Multiverse Saga
  {
    id: 'q-multi-01',
    category: 'Multiverse',
    difficulty: 'beginner',
    question: 'In Spider-Man: No Way Home, which villain from the Marc Webb universe turns from blue electric form to yellow electricity upon arriving in the MCU?',
    options: ['Electro (Max Dillon)', 'The Lizard', 'Green Goblin', 'Rhino'],
    correctAnswer: 'Electro (Max Dillon)',
    explanation: 'Max Dillon comments on the different energy signatures in the MCU, causing his electricity to change from blue to comic-accurate yellow.',
    relatedMovieId: 'spider-man-no-way-home'
  },
  {
    id: 'q-multi-02',
    category: 'Multiverse',
    difficulty: 'intermediate',
    question: 'What is America Chavez\'s unique power that Scarlet Witch hunts across realities to obtain?',
    options: [
      'Punching star-shaped portals directly between multiversal dimensions',
      'Freezing time across quantum realms',
      'Altering probability hexes',
      'Summoning variant doppelgangers'
    ],
    correctAnswer: 'Punching star-shaped portals directly between multiversal dimensions',
    explanation: 'America Chavez is unique in the entire multiverse—having no variants—with the innate power to punch physical star portals through the fabric of realities.',
    relatedMovieId: 'dr-strange-multiverse-madness'
  },
  {
    id: 'q-multi-03',
    category: 'Multiverse',
    difficulty: 'expert',
    question: 'In Thunderbolts*, which powerful being known as "Bob" possesses the power of one million exploding suns?',
    options: ['Robert Reynolds / The Sentry', 'Adam Warlock', 'Wonder Man', 'Hyperion'],
    correctAnswer: 'Robert Reynolds / The Sentry',
    explanation: 'Lewis Pullman portrays "Bob" / Robert Reynolds, the human host of The Sentry and his terrifying dark alter-ego The Void.',
    relatedMovieId: 'thunderbolts-2025'
  }
];

export const QUIZ_CATEGORIES = [
  'All Categories',
  'Characters & Origins',
  'Infinity Saga',
  'Multiverse',
  'TVA & Timelines',
  'Alternate Realities',
  'Incursions',
  'Fantastic Four',
  'X-Men & Mutants',
  'Doctor Doom',
  'Avengers History'
] as const;
