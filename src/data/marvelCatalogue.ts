export interface Episode {
  episodeNumber: number;
  seasonNumber: number;
  title: string;
  runtime: number; // minutes
  overview: string;
  stillPath: string;
  airDate: string;
}

export interface Season {
  seasonNumber: number;
  name: string;
  episodeCount: number;
  overview: string;
  posterPath: string;
  episodes: Episode[];
}

export interface StreamingProviderInfo {
  provider: 'JioHotstar' | 'Disney+ Hotstar' | 'Prime Video' | 'Netflix' | 'SonyLIV' | 'Apple TV' | 'Zee5';
  providerLogo?: string;
  availabilityStatus: 'available' | 'subscription' | 'rent' | 'unverified';
  directUrl?: string;
  searchUrl: string;
  notes?: string;
  lastVerifiedAt: string;
}

export interface MarvelTitle {
  id: string;
  tmdbId: number;
  mediaType: 'movie' | 'tv';
  title: string;
  originalTitle?: string;
  releaseYear: number;
  releaseDate: string;
  runtime: number;
  rating: number;
  voteCount: number;
  genres: string[];
  director: string;
  cast: string[];
  synopsis: string;
  posterPath: string;
  backdropPath: string;
  
  defaultPhaseGroup: 'Phase 01 — The Avengers Foundation' | 'Phase 02 — The Multiverse' | 'Phase 03 — New Generation and Returning Universes' | 'Optional Viewing';
  defaultSequenceNumber: number;
  defaultPriority: 'essential' | 'optional';
  
  whyItMatters: string;
  charactersIntroduced: string[];
  relevantPlotPoints: string[];
  universeConnections: string[];
  multiverseSignificance: string;
  canonStatus: 'Confirmed Canon' | 'Official Alternate Reality' | 'Upcoming Production' | 'Speculation / Theory';
  
  streamingIndia: StreamingProviderInfo[];
  seasons?: Season[];
}

export const MARVEL_TITLES: MarvelTitle[] = [
  // ==========================================
  // PHASE 01 — THE AVENGERS FOUNDATION
  // ==========================================
  {
    id: 'cap-first-avenger',
    tmdbId: 1771,
    mediaType: 'movie',
    title: 'Captain America: The First Avenger',
    releaseYear: 2011,
    releaseDate: '2011-07-22',
    runtime: 124,
    rating: 7.0,
    voteCount: 21500,
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    director: 'Joe Johnston',
    cast: ['Chris Evans', 'Hayley Atwell', 'Sebastian Stan', 'Hugo Weaving', 'Tommy Lee Jones'],
    synopsis: 'During World War II, Steve Rogers is transformed into the super-soldier Captain America to stop the Red Skull and the rogue Nazi division HYDRA from using the Space Stone (Tesseract) to conquer the world.',
    posterPath: 'https://image.tmdb.org/t/p/w780/vSNxAJTlD0r02V9sPYpOjqDZXUK.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/original/yFuKvT4Vm3sKHdFY4eG6I4ldAnn.jpg',
    defaultPhaseGroup: 'Phase 01 — The Avengers Foundation',
    defaultSequenceNumber: 1,
    defaultPriority: 'essential',
    whyItMatters: 'Introduces the Tesseract (Space Stone) which drives the Infinity Saga, establishes the emotional core of Steve Rogers and Bucky Barnes, and lays down the historical foundation for SHIELD and HYDRA.',
    charactersIntroduced: ['Steve Rogers (Captain America)', 'Peggy Carter', 'Bucky Barnes (Winter Soldier)', 'Johann Schmidt (Red Skull)', 'Howard Stark'],
    relevantPlotPoints: [
      'Discovery and weaponization of the Tesseract by HYDRA.',
      'Super-Soldier Serum creation and loss of Dr. Abraham Erskine.',
      'Bucky Barnes falls from the train into the ravine, setting up the Winter Soldier program.',
      'Steve Rogers crashes the Valkyrie in Arctic ice and awakens in modern Manhattan.'
    ],
    universeConnections: ['The Avengers', 'Captain America: The Winter Soldier', 'Avengers: Infinity War', 'Avengers: Endgame'],
    multiverseSignificance: 'The original Sacred Timeline anchor for the Super-Soldier era; alternate branch explored directly in What If...? with Captain Carter.',
    canonStatus: 'Confirmed Canon',
    streamingIndia: [
      {
        provider: 'JioHotstar',
        availabilityStatus: 'available',
        directUrl: 'https://www.hotstar.com/in/movies/captain-america-the-first-avenger/1260017163',
        searchUrl: 'https://www.hotstar.com/in/search?q=Captain+America',
        notes: 'Stream in 4K HDR & IMAX Enhanced with English & Hindi audio',
        lastVerifiedAt: '2026-11-20'
      }
    ]
  },
  {
    id: 'the-avengers',
    tmdbId: 24428,
    mediaType: 'movie',
    title: 'The Avengers',
    releaseYear: 2012,
    releaseDate: '2012-05-04',
    runtime: 143,
    rating: 7.7,
    voteCount: 29800,
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    director: 'Joss Whedon',
    cast: ['Robert Downey Jr.', 'Chris Evans', 'Mark Ruffalo', 'Chris Hemsworth', 'Scarlett Johansson', 'Jeremy Renner', 'Tom Hiddleston'],
    synopsis: 'Earth\'s mightiest heroes must learn to fight as a team if they are going to stop the mischievous Loki and his alien army of Chitauri from enslaving humanity under Thanos\' orders.',
    posterPath: 'https://image.tmdb.org/t/p/w780/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/original/9BBTo63ANSmhC4e6r62OJFuK2GL.jpg',
    defaultPhaseGroup: 'Phase 01 — The Avengers Foundation',
    defaultSequenceNumber: 2,
    defaultPriority: 'essential',
    whyItMatters: 'The landmark crossover defining the MCU team dynamic. First appearance of Thanos in the mid-credits, introduction of the Mind Stone inside Loki\'s scepter, and the Battle of New York that echoes across every subsequent saga.',
    charactersIntroduced: ['Thanos (The Mad Titan)', 'Maria Hill', 'The Other (Chitauri leader)'],
    relevantPlotPoints: [
      'Loki invades Earth wielding the Scepter (Mind Stone) and seeks the Tesseract.',
      'Battle of New York unites Iron Man, Captain America, Thor, Hulk, Black Widow, and Hawkeye.',
      'Mid-credits scene reveals Thanos backing the invasion, initiating the decade-long Infinity Stones arc.'
    ],
    universeConnections: ['Avengers: Age of Ultron', 'Loki (2021)', 'Avengers: Endgame', 'Hawkeye'],
    multiverseSignificance: 'The 2012 Battle of New York is the pivotal nexus moment revisited in Avengers: Endgame time heist, which inadvertently spawns the variant Loki who leads to the TVA and Multiverse unraveling.',
    canonStatus: 'Confirmed Canon',
    streamingIndia: [
      {
        provider: 'JioHotstar',
        availabilityStatus: 'available',
        directUrl: 'https://www.hotstar.com/in/movies/marvels-the-avengers/1260017164',
        searchUrl: 'https://www.hotstar.com/in/search?q=The+Avengers',
        notes: 'Included in Disney+ Hotstar / JioHotstar Super & Premium plans',
        lastVerifiedAt: '2026-11-20'
      }
    ]
  },
  {
    id: 'captain-america-civil-war',
    tmdbId: 271110,
    mediaType: 'movie',
    title: 'Captain America: Civil War',
    releaseYear: 2016,
    releaseDate: '2016-05-06',
    runtime: 147,
    rating: 7.4,
    voteCount: 22400,
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    director: 'Anthony Russo, Joe Russo',
    cast: ['Chris Evans', 'Robert Downey Jr.', 'Sebastian Stan', 'Chadwick Boseman', 'Tom Holland', 'Anthony Mackie', 'Paul Rudd'],
    synopsis: 'Political pressure mounts to install a system of accountability when the actions of the Avengers lead to collateral damage. The new status quo fractures the team into two opposing factions led by Steve Rogers and Tony Stark.',
    posterPath: 'https://image.tmdb.org/t/p/w780/rAGiXaUfPzY7CDEyNKUofk3Kw2e.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/original/7FWlcZq3r6525LWOcvO9kNWurN1.jpg',
    defaultPhaseGroup: 'Phase 01 — The Avengers Foundation',
    defaultSequenceNumber: 3,
    defaultPriority: 'essential',
    whyItMatters: 'Fractures the Avengers, leaving Earth vulnerable to Thanos. Officially introduces MCU Spider-Man (Peter Parker) and Black Panther (T\'Challa), and demonstrates how grief and manipulation (Zemo) can dismantle superhuman alliances.',
    charactersIntroduced: ['Peter Parker (Spider-Man MCU)', 'T\'Challa (Black Panther)', 'Helmut Zemo', 'Aunt May', 'Everett Ross'],
    relevantPlotPoints: [
      'The Sokovia Accords polarize superheroes into registered and unregistered camps.',
      'Airport clash in Leipzig tests loyalties between Stark and Rogers.',
      'Zemo uncovers the Siberian tape showing the Winter Soldier killing Howard and Maria Stark.',
      'Steve Rogers breaks his allies out of the Raft, leaving Tony Stark an emergency flip phone.'
    ],
    universeConnections: ['Spider-Man: Homecoming', 'Black Panther', 'Avengers: Infinity War', 'Thunderbolts*'],
    multiverseSignificance: 'Zemo\'s ideological campaign and the collapse of the Avengers directly enabled Thanos to acquire the Stones unopposed in Infinity War.',
    canonStatus: 'Confirmed Canon',
    streamingIndia: [
      {
        provider: 'JioHotstar',
        availabilityStatus: 'available',
        directUrl: 'https://www.hotstar.com/in/movies/captain-america-civil-war/1260017166',
        searchUrl: 'https://www.hotstar.com/in/search?q=Civil+War',
        notes: 'IMAX Enhanced version available in India',
        lastVerifiedAt: '2026-11-20'
      }
    ]
  },
  {
    id: 'avengers-infinity-war',
    tmdbId: 299536,
    mediaType: 'movie',
    title: 'Avengers: Infinity War',
    releaseYear: 2018,
    releaseDate: '2018-04-27',
    runtime: 149,
    rating: 8.3,
    voteCount: 29500,
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    director: 'Anthony Russo, Joe Russo',
    cast: ['Robert Downey Jr.', 'Chris Hemsworth', 'Mark Ruffalo', 'Chris Evans', 'Scarlett Johansson', 'Benedict Cumberbatch', 'Josh Brolin'],
    synopsis: 'The Avengers and their allies must be willing to sacrifice all in an attempt to defeat the powerful Thanos before his blitz of devastation and ruin puts an end to half of all life in the universe.',
    posterPath: 'https://image.tmdb.org/t/p/w780/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/original/mDfJG3LC3Dqb67AZ52x3Z0jU0uB.jpg',
    defaultPhaseGroup: 'Phase 01 — The Avengers Foundation',
    defaultSequenceNumber: 4,
    defaultPriority: 'essential',
    whyItMatters: 'The culmination of 10 years of storytelling. Thanos systematically gathers all six Infinity Stones (Power, Space, Reality, Soul, Time, Mind) and executes the Decimation (The Blip), wiping out 50% of all universal life.',
    charactersIntroduced: ['Eitri', 'Black Order (Proxima Midnight, Corvus Glaive, Cull Obsidian, Ebony Maw)'],
    relevantPlotPoints: [
      'Destruction of the Statesman and death of Loki at Thanos\' hands.',
      'Doctor Strange views 14,000,605 alternate futures and surrenders the Time Stone to spare Tony Stark.',
      'Thor forges Stormbreaker in Nidavellir.',
      'Battle of Wakanda culminates in the Snap, turning half the heroes to dust.'
    ],
    universeConnections: ['Avengers: Endgame', 'Thor: Ragnarok', 'Doctor Strange in the Multiverse of Madness'],
    multiverseSignificance: 'Doctor Strange\'s temporal scan of 14,000,605 timelines is the first explicit cinematic demonstration of probability branching and singular timeline victory condition in the MCU.',
    canonStatus: 'Confirmed Canon',
    streamingIndia: [
      {
        provider: 'JioHotstar',
        availabilityStatus: 'available',
        directUrl: 'https://www.hotstar.com/in/movies/avengers-infinity-war/1260017168',
        searchUrl: 'https://www.hotstar.com/in/search?q=Infinity+War',
        notes: 'Includes Dolby Vision & Atmos tracks on supported devices',
        lastVerifiedAt: '2026-11-20'
      }
    ]
  },
  {
    id: 'avengers-endgame',
    tmdbId: 299534,
    mediaType: 'movie',
    title: 'Avengers: Endgame',
    releaseYear: 2019,
    releaseDate: '2019-04-26',
    runtime: 181,
    rating: 8.3,
    voteCount: 25400,
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    director: 'Anthony Russo, Joe Russo',
    cast: ['Robert Downey Jr.', 'Chris Evans', 'Mark Ruffalo', 'Chris Hemsworth', 'Scarlett Johansson', 'Jeremy Renner', 'Paul Rudd'],
    synopsis: 'After the devastating events of Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more to reverse Thanos\' actions and restore balance to the universe through a quantum time heist.',
    posterPath: 'https://image.tmdb.org/t/p/w780/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/original/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg',
    defaultPhaseGroup: 'Phase 01 — The Avengers Foundation',
    defaultSequenceNumber: 5,
    defaultPriority: 'essential',
    whyItMatters: 'Closes the Infinity Saga. Introduces the Quantum Realm as a mechanism to navigate alternate timelines without altering the past, establishes the concept of branching realities, and passes the mantle to new champions.',
    charactersIntroduced: ['Morgan Stark', 'Older Cassie Lang', 'Akihiko'],
    relevantPlotPoints: [
      'Five-year time jump establishes the post-snap broken world.',
      'Tony Stark formulates the GPS mobius strip for Quantum Realm time navigation.',
      'Time Heist to 2012 New York, 2013 Asgard, 2014 Morag, and 1970 Camp Lehigh.',
      '2012 Loki escapes with the Tesseract, setting up the Loki TV series.',
      'Tony Stark uses the nano-gauntlet to snap 2014 Thanos out of existence at the cost of his own life.'
    ],
    universeConnections: ['Loki (2021)', 'Spider-Man: Far From Home', 'The Falcon and the Winter Soldier', 'Avengers: Doomsday'],
    multiverseSignificance: 'The Ancient One explains the branching multiverse mechanics to Bruce Banner. Directly sparks the TVA\'s intervention on Loki.',
    canonStatus: 'Confirmed Canon',
    streamingIndia: [
      {
        provider: 'JioHotstar',
        availabilityStatus: 'available',
        directUrl: 'https://www.hotstar.com/in/movies/avengers-endgame/1260017169',
        searchUrl: 'https://www.hotstar.com/in/search?q=Avengers+Endgame',
        notes: 'IMAX Enhanced version available in India',
        lastVerifiedAt: '2026-11-20'
      }
    ]
  },

  // ==========================================
  // PHASE 02 — THE MULTIVERSE
  // ==========================================
  {
    id: 'loki-s1',
    tmdbId: 84958,
    mediaType: 'tv',
    title: 'Loki — Season 1',
    releaseYear: 2021,
    releaseDate: '2021-06-09',
    runtime: 50,
    rating: 8.2,
    voteCount: 11400,
    genres: ['Sci-Fi', 'Action', 'Adventure', 'Fantasy'],
    director: 'Kate Herron',
    cast: ['Tom Hiddleston', 'Owen Wilson', 'Sophia Di Martino', 'Gugu Mbatha-Raw', 'Wunmi Mosaku', 'Jonathan Majors'],
    synopsis: 'After stealing the Tesseract in Endgame, an alternate Loki is brought to the mysterious Time Variance Authority (TVA), a bureaucratic organization that exists outside of time and space to preserve the Sacred Timeline.',
    posterPath: 'https://image.tmdb.org/t/p/w780/kEl2t3OhXc3Zb9FBh1AuYzRTgZp.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/original/q3jHCb4dMfYF6ojikKuHd6LscxC.jpg',
    defaultPhaseGroup: 'Phase 02 — The Multiverse',
    defaultSequenceNumber: 6,
    defaultPriority: 'essential',
    whyItMatters: 'CRITICAL LORE KEYSTONE: Defines how the Multiverse works, introduces the TVA, the concept of timeline variants, the Void at the end of time, Alioth, and He Who Remains (Kang variant), culminating in the uncurling of infinite branching timelines.',
    charactersIntroduced: ['Mobius M. Mobius', 'Sylvie (Loki Variant)', 'Ravonna Renslayer', 'Hunter B-15', 'Miss Minutes', 'Classic Loki', 'He Who Remains'],
    relevantPlotPoints: [
      'Loki learns the Infinity Stones are rendered powerless paperweights inside the TVA.',
      'Sylvie bombs the Sacred Timeline with reset charges, creating massive branch events.',
      'Loki and Sylvie navigate the Void and tame Alioth to reach the Citadel at the End of Time.',
      'Sylvie kills He Who Remains against Loki\'s warnings, unleashing the Multiverse and Kang variants.'
    ],
    universeConnections: ['Loki — Season 2', 'Ant-Man and the Wasp: Quantumania', 'Deadpool & Wolverine', 'Avengers: Secret Wars'],
    multiverseSignificance: 'The exact point where the single unified Sacred Timeline fractures into the infinite multiversal war, setting up the entire Multiverse Saga.',
    canonStatus: 'Confirmed Canon',
    streamingIndia: [
      {
        provider: 'JioHotstar',
        availabilityStatus: 'available',
        directUrl: 'https://www.hotstar.com/in/shows/loki/1260063451',
        searchUrl: 'https://www.hotstar.com/in/search?q=Loki',
        notes: 'Complete Season 1 (6 Episodes) in 4K HDR',
        lastVerifiedAt: '2026-11-20'
      }
    ],
    seasons: [
      {
        seasonNumber: 1,
        name: 'Season 1',
        episodeCount: 6,
        overview: 'Loki faces trial at the TVA and embarks on a multiversal pursuit of his variant Sylvie.',
        posterPath: 'https://image.tmdb.org/t/p/w780/kEl2t3OhXc3Zb9FBh1AuYzRTgZp.jpg',
        episodes: [
          { episodeNumber: 1, seasonNumber: 1, title: 'Glorious Purpose', runtime: 51, overview: 'After taking the Tesseract, Loki lands in the Gobi Desert and is captured by the Minutemen of the TVA.', stillPath: 'https://image.tmdb.org/t/p/w780/q3jHCb4dMfYF6ojikKuHd6LscxC.jpg', airDate: '2021-06-09' },
          { episodeNumber: 2, seasonNumber: 1, title: 'The Variant', runtime: 54, overview: 'Mobius puts Loki to work investigating a lethal variant stalking TVA squads across apocalypse events.', stillPath: 'https://image.tmdb.org/t/p/w780/q3jHCb4dMfYF6ojikKuHd6LscxC.jpg', airDate: '2021-06-16' },
          { episodeNumber: 3, seasonNumber: 1, title: 'Lamentis', runtime: 43, overview: 'Loki and Sylvie are trapped on Lamentis-1 in 2077 during an impending planetary collision with no TemPad power.', stillPath: 'https://image.tmdb.org/t/p/w780/q3jHCb4dMfYF6ojikKuHd6LscxC.jpg', airDate: '2021-06-23' },
          { episodeNumber: 4, seasonNumber: 1, title: 'The Nexus Event', runtime: 49, overview: 'Faced with imminent doom on Lamentis, Loki and Sylvie generate a mutual bond creating a historic nexus spike.', stillPath: 'https://image.tmdb.org/t/p/w780/q3jHCb4dMfYF6ojikKuHd6LscxC.jpg', airDate: '2021-06-30' },
          { episodeNumber: 5, seasonNumber: 1, title: 'Journey Into Mystery', runtime: 50, overview: 'Pruned into the Void at the end of time, Loki meets classic, kid, alligator, and boaster variants running from Alioth.', stillPath: 'https://image.tmdb.org/t/p/w780/q3jHCb4dMfYF6ojikKuHd6LscxC.jpg', airDate: '2021-07-07' },
          { episodeNumber: 6, seasonNumber: 1, title: 'For All Time. Always.', runtime: 55, overview: 'Inside the Citadel at the End of Time, He Who Remains presents Loki and Sylvie with an impossible choice.', stillPath: 'https://image.tmdb.org/t/p/w780/q3jHCb4dMfYF6ojikKuHd6LscxC.jpg', airDate: '2021-07-14' }
        ]
      }
    ]
  },
  {
    id: 'loki-s2',
    tmdbId: 84958,
    mediaType: 'tv',
    title: 'Loki — Season 2',
    releaseYear: 2023,
    releaseDate: '2023-10-05',
    runtime: 52,
    rating: 8.4,
    voteCount: 9600,
    genres: ['Sci-Fi', 'Action', 'Adventure', 'Fantasy'],
    director: 'Justin Benson, Aaron Moorhead',
    cast: ['Tom Hiddleston', 'Sophia Di Martino', 'Owen Wilson', 'Ke Huy Quan', 'Gugu Mbatha-Raw', 'Wunmi Mosaku'],
    synopsis: 'Loki navigates an ever-expanding and increasingly dangerous multiverse in search of Sylvie, Judge Renslayer, and Miss Minutes, whilst racing against time to prevent the catastrophic overload of the Temporal Loom.',
    posterPath: 'https://image.tmdb.org/t/p/w780/kEl2t3OhXc3Zb9FBh1AuYzRTgZp.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/original/q3jHCb4dMfYF6ojikKuHd6LscxC.jpg',
    defaultPhaseGroup: 'Phase 02 — The Multiverse',
    defaultSequenceNumber: 7,
    defaultPriority: 'essential',
    whyItMatters: 'THE CROWNING MULTIVERSE MASTERPIECE: Loki transforms from the God of Mischief into the God of Stories / God of the Multiverse, personally holding together the branches of Yggdrasil to give every timeline free will and life.',
    charactersIntroduced: ['Ouroboros (O.B.)', 'Victor Timely (Kang Variant)', 'General Dox'],
    relevantPlotPoints: [
      'Loki suffers from "time-slipping", uncontrollably skipping across past, present, and future.',
      'O.B. and Mobius attempt to refit the Temporal Loom with a Throughput Multiplier.',
      'Victor Timely is brought from 1868 Chicago to help stabilize the temporal machinery.',
      'Loki spends centuries learning temporal mechanics and physics across infinite iterations.',
      'Loki destroys the Loom and weaves the dying timeline threads with his own magic, taking the lonely throne at the centre of time.'
    ],
    universeConnections: ['Deadpool & Wolverine', 'Avengers: Doomsday', 'Avengers: Secret Wars'],
    multiverseSignificance: 'Establishes the current status quo of the Multiverse: Loki now sustains the World Tree (Yggdrasil) allowing all timelines to flourish independently without being pruned by the TVA.',
    canonStatus: 'Confirmed Canon',
    streamingIndia: [
      {
        provider: 'JioHotstar',
        availabilityStatus: 'available',
        directUrl: 'https://www.hotstar.com/in/shows/loki/1260063451',
        searchUrl: 'https://www.hotstar.com/in/search?q=Loki+Season+2',
        notes: 'Complete Season 2 (6 Episodes) in 4K HDR & IMAX audio',
        lastVerifiedAt: '2026-11-20'
      }
    ],
    seasons: [
      {
        seasonNumber: 2,
        name: 'Season 2',
        episodeCount: 6,
        overview: 'Loki fights to stabilize the TVA and the infinite branches of time, culminating in his supreme sacrifice.',
        posterPath: 'https://image.tmdb.org/t/p/w780/kEl2t3OhXc3Zb9FBh1AuYzRTgZp.jpg',
        episodes: [
          { episodeNumber: 1, seasonNumber: 2, title: 'Ouroboros', runtime: 47, overview: 'Loki slips between past, present, and future inside the TVA while Mobius seeks assistance from repairs guru O.B.', stillPath: 'https://image.tmdb.org/t/p/w780/q3jHCb4dMfYF6ojikKuHd6LscxC.jpg', airDate: '2023-10-05' },
          { episodeNumber: 2, seasonNumber: 2, title: 'Breaking Brad', runtime: 50, overview: 'Loki and Mobius hunt down Hunter X-5 on the Sacred Timeline where he lives as an actor named Brad Wolfe.', stillPath: 'https://image.tmdb.org/t/p/w780/q3jHCb4dMfYF6ojikKuHd6LscxC.jpg', airDate: '2023-10-12' },
          { episodeNumber: 3, seasonNumber: 2, title: '1893', runtime: 55, overview: 'Loki and Mobius travel to Chicago World\'s Fair in 1893 to track down Victor Timely and Miss Minutes.', stillPath: 'https://image.tmdb.org/t/p/w780/q3jHCb4dMfYF6ojikKuHd6LscxC.jpg', airDate: '2023-10-19' },
          { episodeNumber: 4, seasonNumber: 2, title: 'Heart of the TVA', runtime: 51, overview: 'With the Temporal Loom on the verge of critical meltdown, the team makes a daring gambit with Timely.', stillPath: 'https://image.tmdb.org/t/p/w780/q3jHCb4dMfYF6ojikKuHd6LscxC.jpg', airDate: '2023-10-26' },
          { episodeNumber: 5, seasonNumber: 2, title: 'Science/Fiction', runtime: 46, overview: 'Following the Loom explosion, Loki time-slips into the original civilian lives of his TVA friends.', stillPath: 'https://image.tmdb.org/t/p/w780/q3jHCb4dMfYF6ojikKuHd6LscxC.jpg', airDate: '2023-11-02' },
          { episodeNumber: 6, seasonNumber: 2, title: 'Glorious Purpose', runtime: 57, overview: 'Loki masters his time-slipping ability, reliving centuries of trial and error before taking his eternal mantle as the God of Stories.', stillPath: 'https://image.tmdb.org/t/p/w780/q3jHCb4dMfYF6ojikKuHd6LscxC.jpg', airDate: '2023-11-09' }
        ]
      }
    ]
  },
  {
    id: 'spider-man-no-way-home',
    tmdbId: 634649,
    mediaType: 'movie',
    title: 'Spider-Man: No Way Home',
    releaseYear: 2021,
    releaseDate: '2021-12-17',
    runtime: 148,
    rating: 8.0,
    voteCount: 19800,
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    director: 'Jon Watts',
    cast: ['Tom Holland', 'Zendaya', 'Benedict Cumberbatch', 'Jacob Batalon', 'Tobey Maguire', 'Andrew Garfield', 'Willem Dafoe', 'Alfred Molina'],
    synopsis: 'Peter Parker seeks the help of Doctor Strange to make everyone forget he is Spider-Man. When the spell goes awry, the multiverse ruptures, pulling in villains and alternate Spider-Men from past Sony cinema universes.',
    posterPath: 'https://image.tmdb.org/t/p/w780/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/original/iQFcwSGbZXMkeyKrxbPnwnRo5fl.jpg',
    defaultPhaseGroup: 'Phase 02 — The Multiverse',
    defaultSequenceNumber: 8,
    defaultPriority: 'essential',
    whyItMatters: 'The first cinematic live-action union of three generations of Spider-Man films (Tobey Maguire / Sam Raimi universe + Andrew Garfield / Marc Webb universe + Tom Holland MCU). Demonstrates how multiversal breaches happen and shows the tragic cost of meddling with reality.',
    charactersIntroduced: ['Matt Murdock (Daredevil canonical MCU debut)', 'Alternate Spider-Men (Peter-Two & Peter-Three into MCU canon)'],
    relevantPlotPoints: [
      'The Runes of Kof-Kol spell goes unstable due to Peter\'s continuous alterations.',
      'Arrival of Norman Osborn (Green Goblin), Otto Octavius (Doc Ock), Flint Marko (Sandman), Curt Connors (Lizard), and Max Dillon (Electro).',
      'Death of Aunt May: "With great power comes great responsibility".',
      'Statue of Liberty battle sees three Spider-Men cure the villains.',
      'Peter makes the ultimate sacrifice: Doctor Strange casts a spell erasing all memory of Peter Parker from the world.'
    ],
    universeConnections: ['Doctor Strange in the Multiverse of Madness', 'Daredevil: Born Again', 'Spider-Man 4'],
    multiverseSignificance: 'Proves cinematic universes created decades apart share an interconnected multiverse and can bleed into each other.',
    canonStatus: 'Confirmed Canon',
    streamingIndia: [
      {
        provider: 'Netflix',
        availabilityStatus: 'available',
        directUrl: 'https://www.netflix.com/title/81436990',
        searchUrl: 'https://www.netflix.com/search?q=No+Way+Home',
        notes: 'Streaming on Netflix India in 4K UHD',
        lastVerifiedAt: '2026-11-20'
      },
      {
        provider: 'Prime Video',
        availabilityStatus: 'available',
        directUrl: 'https://www.primevideo.com/detail/Spider-Man-No-Way-Home/0R2J3H8B6W9',
        searchUrl: 'https://www.primevideo.com/search?phrase=No+Way+Home',
        notes: 'Available on Prime Video store / rent & stream',
        lastVerifiedAt: '2026-11-20'
      }
    ]
  },
  {
    id: 'dr-strange-multiverse-madness',
    tmdbId: 453395,
    mediaType: 'movie',
    title: 'Doctor Strange in the Multiverse of Madness',
    releaseYear: 2022,
    releaseDate: '2022-05-06',
    runtime: 126,
    rating: 7.3,
    voteCount: 16100,
    genres: ['Fantasy', 'Action', 'Adventure', 'Horror'],
    director: 'Sam Raimi',
    cast: ['Benedict Cumberbatch', 'Elizabeth Olsen', 'Xochitl Gomez', 'Benedict Wong', 'Rachel McAdams', 'Chiwetel Ejiofor', 'Patrick Stewart'],
    synopsis: 'Doctor Strange teams up with America Chavez, a teenager with the unique ability to punch star-shaped portals across the multiverse, to escape a grief-corrupted Wanda Maximoff (Scarlet Witch) armed with the Darkhold.',
    posterPath: 'https://image.tmdb.org/t/p/w780/ddJcSKbcp4rKZTmuyWaMhuwcfMz.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/original/AdyJH8kDm8xT8IKTlgpEC15ny4u.jpg',
    defaultPhaseGroup: 'Phase 02 — The Multiverse',
    defaultSequenceNumber: 9,
    defaultPriority: 'essential',
    whyItMatters: 'CRITICAL LORE CONCEPT: Formally defines "INCURSIONS" — the catastrophic collision and mutual destruction of two colliding universes caused by multiversal travel and dreamwalking, which directly sets up Secret Wars and Avengers: Doomsday.',
    charactersIntroduced: ['America Chavez', 'The Illuminati of Earth-838 (Professor Charles Xavier, Reed Richards / Mr. Fantastic, Captain Carter, Black Bolt, Captain Marvel Maria Rambeau)', 'Clea (Post-credits)'],
    relevantPlotPoints: [
      'Wanda Maximoff embraces the Scarlet Witch prophecy and seeks America Chavez\'s power to live with her sons Billy and Tommy.',
      'Strange and America journey through dozens of alternate dimensions before landing on Earth-838.',
      'Earth-838 Reed Richards explains Incursions and how alternate Doctor Strange destroyed an entire reality.',
      'Wanda dreamwalks into Earth-838 and brutally massacres the Illuminati.',
      'Strange dreamwalks into the corpse of Defender Strange using the Darkhold to defeat Wanda at Mount Wundagore.',
      'Clea recruits Strange to fix an Incursion he triggered.'
    ],
    universeConnections: ['WandaVision', 'The Fantastic Four: First Steps', 'Avengers: Doomsday', 'Avengers: Secret Wars'],
    multiverseSignificance: 'Introduces Earth-838, Reed Richards, Professor Xavier, and explicitly names the Incursion threat that Doctor Doom will exploit.',
    canonStatus: 'Confirmed Canon',
    streamingIndia: [
      {
        provider: 'JioHotstar',
        availabilityStatus: 'available',
        directUrl: 'https://www.hotstar.com/in/movies/doctor-strange-in-the-multiverse-of-madness/1260103750',
        searchUrl: 'https://www.hotstar.com/in/search?q=Doctor+Strange',
        notes: 'Available on JioHotstar / Disney+ Hotstar in IMAX Enhanced',
        lastVerifiedAt: '2026-11-20'
      }
    ]
  },
  {
    id: 'deadpool-and-wolverine',
    tmdbId: 533535,
    mediaType: 'movie',
    title: 'Deadpool & Wolverine',
    releaseYear: 2024,
    releaseDate: '2024-07-26',
    runtime: 128,
    rating: 7.7,
    voteCount: 6800,
    genres: ['Action', 'Comedy', 'Sci-Fi'],
    director: 'Shawn Levy',
    cast: ['Ryan Reynolds', 'Hugh Jackman', 'Emma Corrin', 'Matthew Macfadyen', 'Dafne Keen', 'Channing Tatum', 'Wesley Snipes', 'Jennifer Garner'],
    synopsis: 'A listless Wade Wilson is plucked from his quiet life by the TVA and given an opportunity to join the MCU, only to discover his home universe (Earth-10005) is dying after the loss of its Anchor Being (Logan). He recruits a variant Wolverine to save it.',
    posterPath: 'https://image.tmdb.org/t/p/w780/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/original/by8z9Fe8y7p4jo2YlW2SZDnptyT.jpg',
    defaultPhaseGroup: 'Phase 02 — The Multiverse',
    defaultSequenceNumber: 10,
    defaultPriority: 'essential',
    whyItMatters: 'Officially incorporates the 20th Century Fox Marvel legacy (X-Men, Blade, Elektra, Gambit) into MCU continuity via the TVA and the Void. Introduces the concept of "Anchor Beings" and rogue TVA Time-Rippers.',
    charactersIntroduced: ['Cassandra Nova (Professor X\'s psychic twin)', 'Mr. Paradox (Rogue TVA Agent)', 'Gambit (Channing Tatum canon debut)', 'Nicepool & Dogpool'],
    relevantPlotPoints: [
      'TVA Agent Paradox reveals the Fox universe (Earth-10005) is decaying due to the death of Logan.',
      'Paradox constructs an unsanctioned "Time-Ripper" to accelerate the death of dying timelines.',
      'Wade searches the multiverse for a substitute Wolverine and lands the "worst Wolverine".',
      'Both are banished to the Void, where Cassandra Nova rules from the giant skeleton of Ant-Man.',
      'Teaming with Blade, Elektra, Gambit, and X-23 (Laura), they storm Cassandra\'s fortress.',
      'Deadpool and Wolverine sacrifice themselves together to overload the Time-Ripper, stabilizing Earth-10005.'
    ],
    universeConnections: ['Loki (2021-2023)', 'Logan (2017)', 'X-Men (2000)', 'Avengers: Doomsday'],
    multiverseSignificance: 'Shows the TVA operating post-Loki Season 2 and establishes how entire legacy universes can be rescued or merged.',
    canonStatus: 'Confirmed Canon',
    streamingIndia: [
      {
        provider: 'JioHotstar',
        availabilityStatus: 'available',
        directUrl: 'https://www.hotstar.com/in/movies/deadpool-wolverine/1271317589',
        searchUrl: 'https://www.hotstar.com/in/search?q=Deadpool+and+Wolverine',
        notes: 'Streaming now in 4K UHD, HDR10, and Dolby Atmos on JioHotstar',
        lastVerifiedAt: '2026-11-20'
      }
    ]
  },

  // ==========================================
  // PHASE 03 — NEW GENERATION AND RETURNING UNIVERSES
  // ==========================================
  {
    id: 'x-men-2000',
    tmdbId: 36657,
    mediaType: 'movie',
    title: 'X-Men',
    releaseYear: 2000,
    releaseDate: '2000-07-14',
    runtime: 104,
    rating: 7.0,
    voteCount: 11200,
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    director: 'Bryan Singer',
    cast: ['Hugh Jackman', 'Patrick Stewart', 'Ian McKellen', 'Famke Janssen', 'James Marsden', 'Halle Berry', 'Anna Paquin'],
    synopsis: 'In a world where mutants exist and are feared by humanity, two mutant groups with differing philosophies clash: Professor Charles Xavier\'s peaceful X-Men and Magneto\'s militant Brotherhood of Mutants.',
    posterPath: 'https://image.tmdb.org/t/p/w780/bRDAc4GogyS9ci3ow7UnInOcriN.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/original/3QUVzbcNyfGe3ocWkYAT8emK8Co.jpg',
    defaultPhaseGroup: 'Phase 03 — New Generation and Returning Universes',
    defaultSequenceNumber: 11,
    defaultPriority: 'essential',
    whyItMatters: 'The grandfather of modern superhero cinema that launched Hugh Jackman as Wolverine and Patrick Stewart as Xavier. Establishes the original Earth-10005 continuity that directly connects to Deadpool & Wolverine and the upcoming mutant collision in Doomsday.',
    charactersIntroduced: ['Logan (Wolverine - Original)', 'Charles Xavier (Professor X)', 'Erik Lehnsherr (Magneto)', 'Rogue', 'Jean Grey', 'Cyclops', 'Storm', 'Mystique'],
    relevantPlotPoints: [
      'Rogue runs away from home and meets Logan in Northern Alberta.',
      'Sabretooth attacks them and they are rescued by Cyclops and Storm.',
      'Magneto constructs a machine powered by his energy to mutate world leaders at Ellis Island.',
      'Wolverine uses his adamantium claws and healing factor to save Rogue atop the Statue of Liberty.'
    ],
    universeConnections: ['X2: X-Men United', 'Deadpool & Wolverine', 'Doctor Strange in the Multiverse of Madness'],
    multiverseSignificance: 'The foundational baseline of the Fox X-Men Universe (Earth-10005) whose characters are now cross-pollinating into the MCU Multiverse.',
    canonStatus: 'Official Alternate Reality',
    streamingIndia: [
      {
        provider: 'JioHotstar',
        availabilityStatus: 'available',
        directUrl: 'https://www.hotstar.com/in/movies/x-men/1770000858',
        searchUrl: 'https://www.hotstar.com/in/search?q=X-Men',
        notes: 'Included with JioHotstar / Disney+ Hotstar subscription',
        lastVerifiedAt: '2026-11-20'
      }
    ]
  },
  {
    id: 'x2-united',
    tmdbId: 36658,
    mediaType: 'movie',
    title: 'X2: X-Men United',
    releaseYear: 2003,
    releaseDate: '2003-05-02',
    runtime: 134,
    rating: 7.1,
    voteCount: 10100,
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    director: 'Bryan Singer',
    cast: ['Hugh Jackman', 'Patrick Stewart', 'Ian McKellen', 'Brian Cox', 'Alan Cumming', 'Famke Janssen', 'Halle Berry'],
    synopsis: 'When anti-mutant military scientist William Stryker raids the Xavier mansion, the X-Men must form an uneasy alliance with their bitter enemy Magneto to stop Stryker from weaponizing Cerebro against all mutants on Earth.',
    posterPath: 'https://image.tmdb.org/t/p/w780/bst4alFUXCxISwdRUKSMhhkrX1M.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/original/s8ftvFvafWWEhApISamHx32bx6h.jpg',
    defaultPhaseGroup: 'Phase 03 — New Generation and Returning Universes',
    defaultSequenceNumber: 12,
    defaultPriority: 'essential',
    whyItMatters: 'Unpacks Wolverine\'s Weapon X trauma and origin at Alkali Lake, explores government weaponization against superhumans, and sets up the mutant struggle that echoes in Marvel\'s Phase 5 and 6 mutant integration.',
    charactersIntroduced: ['Kurt Wagner (Nightcrawler)', 'Colonel William Stryker', 'Yuriko Oyama (Lady Deathstrike)', 'Pyro (John Allerdyce)'],
    relevantPlotPoints: [
      'Nightcrawler\'s mind-controlled assassination attempt on the U.S. President in the Oval Office.',
      'Stryker\'s military forces raid the Xavier Institute, drugging students and capturing Xavier.',
      'Wolverine confronts Stryker at the Alkali Lake Weapon X facility and uncovers his adamantium bonding history.',
      'Jean Grey sacrifices herself to hold back the collapsing dam waters so the X-Jet can escape.'
    ],
    universeConnections: ['X-Men: Days of Future Past', 'Deadpool & Wolverine', 'Logan'],
    multiverseSignificance: 'Deepens the emotional backstory of Hugh Jackman\'s Wolverine and Nightcrawler/Pyro, who reappear in Deadpool & Wolverine in the Void.',
    canonStatus: 'Official Alternate Reality',
    streamingIndia: [
      {
        provider: 'JioHotstar',
        availabilityStatus: 'available',
        directUrl: 'https://www.hotstar.com/in/movies/x2/1770000859',
        searchUrl: 'https://www.hotstar.com/in/search?q=X2',
        notes: 'Streaming on JioHotstar with English and Hindi audio',
        lastVerifiedAt: '2026-11-20'
      }
    ]
  },
  {
    id: 'thunderbolts-2025',
    tmdbId: 986056,
    mediaType: 'movie',
    title: 'Thunderbolts*',
    releaseYear: 2025,
    releaseDate: '2025-05-02',
    runtime: 132,
    rating: 7.5,
    voteCount: 1500,
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    director: 'Jake Schreier',
    cast: ['Florence Pugh', 'Sebastian Stan', 'David Harbour', 'Wyatt Russell', 'Hannah John-Kamen', 'Julia Louis-Dreyfus', 'Lewis Pullman'],
    synopsis: 'An irreverent team-up of reformed anti-heroes and disillusioned government operatives—including Yelena Belova, Bucky Barnes, Red Guardian, and U.S. Agent—find themselves on an unsanctioned suicide mission after being sent to their deaths by the CIA.',
    posterPath: 'https://image.tmdb.org/t/p/w780/hqcexYHbiTBfDIdDWxrxPtVndBX.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/original/rthMuZfFv4fqEU4JVbgSW9wQ8rs.jpg',
    defaultPhaseGroup: 'Phase 03 — New Generation and Returning Universes',
    defaultSequenceNumber: 13,
    defaultPriority: 'essential',
    whyItMatters: 'Direct bridge between the street/political grounded MCU and the cosmic multiversal fallout. Establishes who defends Earth when the traditional Avengers are missing, introduces Bob/Sentry (Lewis Pullman), and answers the mysterious asterisk in the title.',
    charactersIntroduced: ['Bob / The Sentry (Robert Reynolds)', 'Valentina Allegra de Fontaine (expanded leader role)'],
    relevantPlotPoints: [
      'Valentina contracts several former Black Widows, assassins, and super-soldiers to recover a clandestine asset.',
      'The team realizes they were trapped together in an incinerator vault to tie up government loose ends.',
      'Bucky Barnes intervenes as a newly sworn congressman with his own moral agenda.',
      'Unleashing of The Sentry/The Void—one of Marvel\'s most god-tier overpowered psychological beings.'
    ],
    universeConnections: ['Black Widow', 'The Falcon and the Winter Soldier', 'Captain America: Brave New World', 'Avengers: Doomsday'],
    multiverseSignificance: 'Earth\'s premier operational strike team leading right into the events where Doctor Doom begins his geopolitical and dimensional assault.',
    canonStatus: 'Confirmed Canon',
    streamingIndia: [
      {
        provider: 'JioHotstar',
        availabilityStatus: 'unverified',
        searchUrl: 'https://www.hotstar.com/in/search?q=Thunderbolts',
        notes: 'Theatrical release scheduled; streaming release on JioHotstar will follow theatrical run',
        lastVerifiedAt: '2026-11-20'
      }
    ]
  },
  {
    id: 'fantastic-four-first-steps',
    tmdbId: 617126,
    mediaType: 'movie',
    title: 'The Fantastic Four: First Steps',
    releaseYear: 2025,
    releaseDate: '2025-07-25',
    runtime: 135,
    rating: 7.8,
    voteCount: 1200,
    genres: ['Sci-Fi', 'Action', 'Adventure'],
    director: 'Matt Shakman',
    cast: ['Pedro Pascal', 'Vanessa Kirby', 'Joseph Quinn', 'Ebon Moss-Bachrach', 'Ralph Ineson', 'Julia Garner'],
    synopsis: 'Set against the vibrant backdrop of a 1960s retro-futuristic alternate universe, Marvel\'s First Family—Reed Richards, Sue Storm, Johnny Storm, and Ben Grimm—must defend their world from the planet-devouring Galactus and his herald Shalla-Bal.',
    posterPath: 'https://image.tmdb.org/t/p/w780/nf5qaSEvyYSNeFH0YhSs5EsBLX9.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/original/s94NjfKkcSczZ1FembwmQZwsuwY.jpg',
    defaultPhaseGroup: 'Phase 03 — New Generation and Returning Universes',
    defaultSequenceNumber: 14,
    defaultPriority: 'essential',
    whyItMatters: 'CRITICAL DOOMSDAY PRELUDE: Origin of Marvel\'s First Family set directly in an alternate retro-futuristic Earth. The Fantastic Four are confirmed to cross over from their dying or incursion-bound universe directly into Avengers: Doomsday and Avengers: Secret Wars.',
    charactersIntroduced: ['Reed Richards / Mister Fantastic (Pedro Pascal)', 'Sue Storm / Invisible Woman (Vanessa Kirby)', 'Johnny Storm / Human Torch (Joseph Quinn)', 'Ben Grimm / The Thing (Ebon Moss-Bachrach)', 'Galactus (Ralph Ineson)', 'Shalla-Bal / Silver Surfer (Julia Garner)', 'H.E.R.B.I.E.'],
    relevantPlotPoints: [
      'A standalone 1960s retro-futuristic alternate timeline unconnected to the main 616 timeline.',
      'Galactus arrives to consume the Earth, sending Shalla-Bal as the herald of cosmic judgment.',
      'The Baxter Building serves as the center of revolutionary quantum and multiversal physics.',
      'Sets up the family\'s inevitable dimensional evacuation as Incursions collapse realities around them.'
    ],
    universeConnections: ['Doctor Strange in the Multiverse of Madness (Earth-838 variant)', 'Avengers: Doomsday', 'Avengers: Secret Wars'],
    multiverseSignificance: 'Directly introduces the universe and characters that will collide with Earth-616, setting the stage for Victor Von Doom\'s rise.',
    canonStatus: 'Confirmed Canon',
    streamingIndia: [
      {
        provider: 'JioHotstar',
        availabilityStatus: 'unverified',
        searchUrl: 'https://www.hotstar.com/in/search?q=Fantastic+Four',
        notes: 'Theatrical release scheduled; JioHotstar streaming release will follow',
        lastVerifiedAt: '2026-11-20'
      }
    ]
  },

  // ==========================================
  // OPTIONAL VIEWING
  // ==========================================
  {
    id: 'black-panther-wakanda-forever',
    tmdbId: 505642,
    mediaType: 'movie',
    title: 'Black Panther: Wakanda Forever',
    releaseYear: 2022,
    releaseDate: '2022-11-11',
    runtime: 161,
    rating: 7.1,
    voteCount: 6500,
    genres: ['Action', 'Adventure', 'Drama', 'Sci-Fi'],
    director: 'Ryan Coogler',
    cast: ['Letitia Wright', 'Angela Bassett', 'Tenoch Huerta Mejía', 'Danai Gurira', 'Lupita Nyong\'o', 'Winston Duke', 'Dominique Thorne'],
    synopsis: 'Following the death of King T\'Challa, Queen Ramonda, Shuri, M\'Baku, and the Dora Milaje fight to protect their nation from intervening world powers and an undersea civilization led by Namor.',
    posterPath: 'https://image.tmdb.org/t/p/w780/sv1xJUazXeYqALzczSZ3O6nkH75.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/original/83H0C66AcvkwpG2738VCTHMY9uv.jpg',
    defaultPhaseGroup: 'Optional Viewing',
    defaultSequenceNumber: 15,
    defaultPriority: 'optional',
    whyItMatters: 'Expands the geopolitics of Vibranium, introduces Talokan and Namor (the Sub-Mariner), establishes Shuri as the new Black Panther, and debuts Riri Williams (Ironheart). Vibranium geopolitical scarcity will play heavily into Doctor Doom\'s Latverian sovereignty.',
    charactersIntroduced: ['Namor (The Feathered Serpent)', 'Riri Williams (Ironheart)', 'Aneka', 'Prince Toussaint (T\'Challa II)'],
    relevantPlotPoints: [
      'The international race for underwater vibranium deposits outside of Wakanda.',
      'Namor infiltrates Wakandan territory and demands an alliance against the surface world.',
      'Attack on Golden City and death of Queen Ramonda.',
      'Shuri synthesizes a synthetic Heart-Shaped Herb with vibranium residue and confronts Namor in the desert.'
    ],
    universeConnections: ['Ironheart', 'Captain America: Brave New World', 'Thunderbolts*'],
    multiverseSignificance: 'Namor and Wakanda represent crucial sovereign powerhouses that Victor Von Doom will face or manipulate on the road to Battleworld.',
    canonStatus: 'Confirmed Canon',
    streamingIndia: [
      {
        provider: 'JioHotstar',
        availabilityStatus: 'available',
        directUrl: 'https://www.hotstar.com/in/movies/black-panther-wakanda-forever/1260126487',
        searchUrl: 'https://www.hotstar.com/in/search?q=Wakanda+Forever',
        notes: 'IMAX Enhanced available in English, Hindi, Tamil, Telugu, and Malayalam',
        lastVerifiedAt: '2026-11-20'
      }
    ]
  },
  {
    id: 'captain-america-brave-new-world',
    tmdbId: 822119,
    mediaType: 'movie',
    title: 'Captain America: Brave New World',
    releaseYear: 2025,
    releaseDate: '2025-02-14',
    runtime: 130,
    rating: 7.2,
    voteCount: 1800,
    genres: ['Action', 'Thriller', 'Sci-Fi'],
    director: 'Julius Onah',
    cast: ['Anthony Mackie', 'Harrison Ford', 'Danny Ramirez', 'Shira Haas', 'Carl Lumbly', 'Giancarlo Esposito', 'Tim Blake Nelson'],
    synopsis: 'Sam Wilson finds himself in the middle of an international incident after meeting with newly elected U.S. President Thaddeus Ross, uncovering a sinister global conspiracy centered on Adamantium and the frozen Celestial Tiamut.',
    posterPath: 'https://image.tmdb.org/t/p/w780/pzIddUEMWhWzfvLI3TwxUG2wGoi.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/original/ce3prrjh9ZehEl5JinNqr4jIeaB.jpg',
    defaultPhaseGroup: 'Optional Viewing',
    defaultSequenceNumber: 16,
    defaultPriority: 'optional',
    whyItMatters: 'CRITICAL WORLD-BUILDING: Officially brings Adamantium into the main MCU via the petrified corpse of Celestial Tiamut in the Indian Ocean, introduces President Thaddeus "Thunderbolt" Ross as Red Hulk, and tests Sam Wilson\'s leadership as Captain America.',
    charactersIntroduced: ['Red Hulk (President Thaddeus Ross)', 'Samuel Sterns (The Leader)', 'Joaquin Torres (New Falcon)', 'Seth Voelker (Sidewinder / Serpent Society)'],
    relevantPlotPoints: [
      'President Ross offers Captain America an official military commission to rebuild the Avengers.',
      'Discovery of Adamantium inside the petrified Celestial Tiamut in the ocean triggers a global resource rush.',
      'Mind-control frequency activates Isaiah Bradley during a White House summit.',
      'The Leader manipulates gamma radiation to trigger Ross\'s transformation into the raging Red Hulk.'
    ],
    universeConnections: ['The Falcon and the Winter Soldier', 'The Incredible Hulk (2008)', 'Thunderbolts*', 'Avengers: Doomsday'],
    multiverseSignificance: 'Connects the grounded international arms race directly to the arrival of mutants and adamantium in the broader MCU.',
    canonStatus: 'Confirmed Canon',
    streamingIndia: [
      {
        provider: 'JioHotstar',
        availabilityStatus: 'unverified',
        searchUrl: 'https://www.hotstar.com/in/search?q=Captain+America+Brave+New+World',
        notes: 'Theatrical release scheduled; streaming on JioHotstar expected post-theatrical window',
        lastVerifiedAt: '2026-11-20'
      }
    ]
  },
  {
    id: 'shang-chi',
    tmdbId: 566525,
    mediaType: 'movie',
    title: 'Shang-Chi and the Legend of the Ten Rings',
    releaseYear: 2021,
    releaseDate: '2021-09-03',
    runtime: 132,
    rating: 7.6,
    voteCount: 9400,
    genres: ['Action', 'Adventure', 'Fantasy'],
    director: 'Destin Daniel Cretton',
    cast: ['Simu Liu', 'Tony Leung Chiu-wai', 'Awkwafina', 'Meng\'er Zhang', 'Fala Chen', 'Michelle Yeoh', 'Ben Kingsley'],
    synopsis: 'Shang-Chi, a martial artist living quietly in San Francisco, is confronted by his mysterious past when he is drawn into the clandestine Ten Rings organization led by his immortal father Wenwu.',
    posterPath: 'https://image.tmdb.org/t/p/w780/9f2Q0U3IOsLgrI2HkvldwSABZy5.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/original/r7K6Xt0RX4Mw0cAbZVw5cyb1Tux.jpg',
    defaultPhaseGroup: 'Optional Viewing',
    defaultSequenceNumber: 17,
    defaultPriority: 'optional',
    whyItMatters: 'Introduces the mystical artifact The Ten Rings—thousands of years old and emitting a cosmic beacon to an unknown extraterrestrial or multiversal recipient. Destin Daniel Cretton was originally tapped for Avengers: Kang Dynasty before the creative shift to Doomsday.',
    charactersIntroduced: ['Shang-Chi', 'Xu Wenwu (The real Mandarin)', 'Katy Chen', 'Xu Xialing', 'Ta Lo civilization', 'Dweller-in-Darkness'],
    relevantPlotPoints: [
      'Wenwu discovers the Ten Rings over a thousand years ago, granting him immortality and godlike concussive force.',
      'Shang-Chi confronts his father in the mystical realm of Ta Lo.',
      'The Dweller-in-Darkness escapes its dark gate and is destroyed by Shang-Chi with the Great Protector dragon.',
      'Post-credits scene with Bruce Banner and Captain Marvel reveals the rings are transmitting a mysterious signal across the cosmos.'
    ],
    universeConnections: ['Iron Man 3', 'She-Hulk', 'Avengers: Doomsday'],
    multiverseSignificance: 'The origin of the Ten Rings (likely tied to Kang technology or multiversal origins like Ms. Marvel\'s bangles) remains an active cosmic thread leading into Secret Wars.',
    canonStatus: 'Confirmed Canon',
    streamingIndia: [
      {
        provider: 'JioHotstar',
        availabilityStatus: 'available',
        directUrl: 'https://www.hotstar.com/in/movies/shang-chi-and-the-legend-of-the-ten-rings/1260072682',
        searchUrl: 'https://www.hotstar.com/in/search?q=Shang+Chi',
        notes: 'IMAX Enhanced on JioHotstar with Dolby Atmos',
        lastVerifiedAt: '2026-11-20'
      }
    ]
  },
  {
    id: 'x-men-days-of-future-past',
    tmdbId: 127585,
    mediaType: 'movie',
    title: 'X-Men: Days of Future Past',
    releaseYear: 2014,
    releaseDate: '2014-05-23',
    runtime: 132,
    rating: 7.5,
    voteCount: 15100,
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    director: 'Bryan Singer',
    cast: ['Hugh Jackman', 'James McAvoy', 'Michael Fassbender', 'Jennifer Lawrence', 'Patrick Stewart', 'Ian McKellen', 'Peter Dinklage'],
    synopsis: 'In a dystopian future where unstoppable Sentinels hunt mutants and humans alike to extinction, the surviving X-Men send Wolverine\'s consciousness back to 1973 to prevent Mystique from assassinating Sentinel creator Bolivar Trask.',
    posterPath: 'https://image.tmdb.org/t/p/w780/tYfijzolzgoMOtegh1Y7j2Enorg.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/original/3czpqXzFy5UcNuD1AubecRLWkwD.jpg',
    defaultPhaseGroup: 'Optional Viewing',
    defaultSequenceNumber: 18,
    defaultPriority: 'optional',
    whyItMatters: 'The ultimate blueprint for timeline manipulation and rewriting cinematic continuity in comic book history. Unites both generations of X-Men casts (Stewart/McKellen + McAvoy/Fassbender) and shows the devastating consequence of timeline divergence.',
    charactersIntroduced: ['Bolivar Trask', 'Quicksilver (Peter Maximoff - Fox version)', 'Bishop', 'Blink', 'Warpath', 'Sunspot'],
    relevantPlotPoints: [
      'Kitty Pryde phases Wolverine\'s consciousness back 50 years into his 1973 body.',
      'Pentagon heist: Quicksilver\'s iconic "Time in a Bottle" super-speed rescue of young Magneto.',
      'Magneto commandeers prototype Sentinels with railroad tracks and drops RFK Stadium around the White House.',
      'Mystique chooses not to kill Trask, altering history and wiping the dystopian Sentinel future from existence.'
    ],
    universeConnections: ['X-Men: First Class', 'Deadpool & Wolverine', 'Avengers: Secret Wars'],
    multiverseSignificance: 'Demonstrated how timeline branches can overwrite or spawn parallel realities in Marvel cinematic lore.',
    canonStatus: 'Official Alternate Reality',
    streamingIndia: [
      {
        provider: 'JioHotstar',
        availabilityStatus: 'available',
        directUrl: 'https://www.hotstar.com/in/movies/x-men-days-of-future-past/1770000863',
        searchUrl: 'https://www.hotstar.com/in/search?q=Days+of+Future+Past',
        notes: 'Available on JioHotstar / Disney+ Hotstar',
        lastVerifiedAt: '2026-11-20'
      }
    ]
  }
];

export const PHASE_ORDER = [
  'Phase 01 — The Avengers Foundation',
  'Phase 02 — The Multiverse',
  'Phase 03 — New Generation and Returning Universes',
  'Optional Viewing'
] as const;
