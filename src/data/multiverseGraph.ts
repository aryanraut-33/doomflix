export interface MultiverseNode {
  id: string;
  label: string;
  universeName: string;
  category: 'timeline' | 'character' | 'organization' | 'nexus_event' | 'incursion';
  status: 'Confirmed Canon' | 'Official Alternate Reality' | 'Official Announcement' | 'Speculation / Theory';
  description: string;
  connectedTo: string[]; // ids of connected nodes
  details: {
    origin: string;
    keyFigures: string[];
    multiverseThreatLevel: 'Low' | 'Moderate' | 'Critical' | 'Cataclysmic';
    crucialContext: string;
    associatedMedia: string[]; // movie IDs from marvelCatalogue
  };
  coordinates: { x: number; y: number }; // 2D layout representation
}

export const MULTIVERSE_GRAPH_NODES: MultiverseNode[] = [
  {
    id: 'earth-616',
    label: 'Earth-616 (Sacred Timeline)',
    universeName: 'The Main MCU Universe',
    category: 'timeline',
    status: 'Confirmed Canon',
    description: 'The primary continuity where the Avengers assembled, defeated Thanos, and where the core MCU narrative unfolds.',
    connectedTo: ['tva-void', 'earth-838', 'fox-earth-10005', 'sony-spiderverses', 'retro-earth-ff', 'battleworld-doom'],
    details: {
      origin: 'Formed after the First Multiversal War; previously isolated by He Who Remains.',
      keyFigures: ['Iron Man', 'Captain America', 'Thor', 'Doctor Strange', 'Spider-Man', 'Sam Wilson'],
      multiverseThreatLevel: 'Critical',
      crucialContext: 'Currently destabilizing due to dimensional breaches, dreamwalking by Wanda Maximoff, and incoming Incursions.',
      associatedMedia: ['the-avengers', 'avengers-infinity-war', 'avengers-endgame', 'cap-first-avenger']
    },
    coordinates: { x: 50, y: 50 }
  },
  {
    id: 'tva-void',
    label: 'The TVA & The Void',
    universeName: 'Beyond Space-Time / End of Time',
    category: 'organization',
    status: 'Confirmed Canon',
    description: 'An omnipresent temporal authority monitoring timelines. At the center sits Loki as the God of Stories, holding the World Tree (Yggdrasil).',
    connectedTo: ['earth-616', 'fox-earth-10005', 'battleworld-doom'],
    details: {
      origin: 'Engineered by He Who Remains at the Citadel at the End of Time.',
      keyFigures: ['Loki (God of Stories)', 'Mobius M. Mobius', 'Sylvie', 'Hunter B-15', 'O.B.', 'Alioth'],
      multiverseThreatLevel: 'Moderate',
      crucialContext: 'No longer prunes variant timelines. Instead safeguards the infinite branches of Yggdrasil from temporal collapses.',
      associatedMedia: ['loki-s1', 'loki-s2', 'deadpool-and-wolverine']
    },
    coordinates: { x: 50, y: 18 }
  },
  {
    id: 'earth-838',
    label: 'Earth-838 (Illuminati Realm)',
    universeName: 'Alternate High-Tech Reality',
    category: 'timeline',
    status: 'Confirmed Canon',
    description: 'A technologically advanced alternate world where the Illuminati ruled peacefully until Wanda Maximoff dreamwalked and decimated their council.',
    connectedTo: ['earth-616'],
    details: {
      origin: 'Alternate branch where the Ultron program was successfully perfected and civilized.',
      keyFigures: ['Reed Richards (Mister Fantastic)', 'Professor Charles Xavier', 'Captain Carter', 'Black Bolt', 'Maria Rambeau'],
      multiverseThreatLevel: 'Critical',
      crucialContext: 'Suffered catastrophic destabilization after Wanda\'s massacre. High probability of entering Incursion collapse with Earth-616.',
      associatedMedia: ['dr-strange-multiverse-madness']
    },
    coordinates: { x: 22, y: 35 }
  },
  {
    id: 'fox-earth-10005',
    label: 'Earth-10005 (Fox X-Men Timeline)',
    universeName: 'The Legacy Mutant Universe',
    category: 'timeline',
    status: 'Official Alternate Reality',
    description: 'The original 20th Century Fox cinematic universe where mutants were born and fought for coexistence. Saved from temporal decay by Deadpool and Wolverine.',
    connectedTo: ['earth-616', 'tva-void'],
    details: {
      origin: 'Began with the 2000 X-Men film, rewritten during Days of Future Past.',
      keyFigures: ['Logan / Wolverine', 'Wade Wilson / Deadpool', 'Professor X', 'Magneto', 'Laura / X-23'],
      multiverseThreatLevel: 'Moderate',
      crucialContext: 'Temporarily stabilized after Deadpool and Wolverine destroyed the rogue Time-Ripper in the Void.',
      associatedMedia: ['x-men-2000', 'x2-united', 'x-men-days-of-future-past', 'deadpool-and-wolverine']
    },
    coordinates: { x: 18, y: 72 }
  },
  {
    id: 'sony-spiderverses',
    label: 'Raimi & Webb Realities',
    universeName: 'Legacy Spider-Man Dimensions',
    category: 'timeline',
    status: 'Confirmed Canon',
    description: 'The distinct universes of Peter-Two (Tobey Maguire) and Peter-Three (Andrew Garfield), bridged during the spell malfunction in New York.',
    connectedTo: ['earth-616'],
    details: {
      origin: '2002 Sam Raimi trilogy universe & 2012 Marc Webb Amazing Spider-Man universe.',
      keyFigures: ['Peter Parker (Earth-96283)', 'Peter Parker (Earth-120703)', 'Norman Osborn', 'Otto Octavius'],
      multiverseThreatLevel: 'Low',
      crucialContext: 'Cured villains returned to altered branches; proof that external film franchises share the greater Marvel multiverse.',
      associatedMedia: ['spider-man-no-way-home']
    },
    coordinates: { x: 82, y: 35 }
  },
  {
    id: 'retro-earth-ff',
    label: 'Retro-Futuristic 1960s Earth',
    universeName: 'Fantastic Four: First Steps Universe',
    category: 'timeline',
    status: 'Confirmed Canon',
    description: 'A vibrant 1960s space-age alternate Earth where the Fantastic Four are beloved global champions facing the cosmic hunger of Galactus.',
    connectedTo: ['earth-616', 'battleworld-doom'],
    details: {
      origin: 'Distinct alternate Earth with advanced quantum and cosmic radiation science.',
      keyFigures: ['Reed Richards', 'Sue Storm', 'Johnny Storm', 'Ben Grimm', 'Galactus', 'Shalla-Bal'],
      multiverseThreatLevel: 'Cataclysmic',
      crucialContext: 'Confirmed to cross into Earth-616 continuity in Avengers: Doomsday as their home dimension falls victim to cosmic doom.',
      associatedMedia: ['fantastic-four-first-steps']
    },
    coordinates: { x: 82, y: 72 }
  },
  {
    id: 'battleworld-doom',
    label: 'Battleworld & Incursion Nexus',
    universeName: 'Victor Von Doom\'s Domain',
    category: 'incursion',
    status: 'Official Announcement',
    description: 'The inevitable collision point of all dying realities. When Incursions destroy the multiverse, Doctor Doom will reconstruct the shards into a singular realm.',
    connectedTo: ['earth-616', 'retro-earth-ff', 'fox-earth-10005', 'tva-void'],
    details: {
      origin: 'Predicted cosmic result of widespread universal Incursions and multiversal collapse.',
      keyFigures: ['Victor Von Doom (Robert Downey Jr.)', 'God Emperor Doom', 'The Beyonders (Lore)'],
      multiverseThreatLevel: 'Cataclysmic',
      crucialContext: 'Official focus of Avengers: Doomsday (2026) and Avengers: Secret Wars (2027). Robert Downey Jr. portrays Victor Von Doom.',
      associatedMedia: ['fantastic-four-first-steps', 'dr-strange-multiverse-madness', 'avengers-endgame']
    },
    coordinates: { x: 50, y: 88 }
  }
];
