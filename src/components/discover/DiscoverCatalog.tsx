import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Check, 
  Star, 
  Film, 
  Tv, 
  Sparkles, 
  Info,
  Clock,
  Layers,
  Flame,
  Compass
} from 'lucide-react';
import { MARVEL_TITLES, MarvelTitle } from '../../data/marvelCatalogue';
import { useAppStore } from '../../services/store';
import { MoveCollectionModal } from '../watchlist/MoveCollectionModal';
import { CinematicImage } from '../common/CinematicImage';

// Extended discovery titles library for rich exploration
const ADDITIONAL_DISCOVERY_TITLES: MarvelTitle[] = [
  {
    id: 'mcu-iron-man-1',
    tmdbId: 1726,
    mediaType: 'movie',
    title: 'Iron Man',
    releaseYear: 2008,
    releaseDate: '2008-05-02',
    runtime: 126,
    rating: 7.6,
    voteCount: 26000,
    genres: ['Action', 'Sci-Fi', 'Adventure'],
    director: 'Jon Favreau',
    cast: ['Robert Downey Jr.', 'Gwyneth Paltrow', 'Jeff Bridges', 'Terrence Howard'],
    synopsis: 'After being held captive in an Afghan cave, billionaire engineer Tony Stark creates a unique weaponized suit of armor to fight evil, sparking the birth of the Marvel Cinematic Universe.',
    posterPath: 'https://image.tmdb.org/t/p/w780/78lPtwv72eTNqFW9COBYI0dWDJa.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/original/cKvDv2LpwVEqbdXWoQl4XgGN6le.jpg',
    defaultPhaseGroup: 'Optional Viewing',
    defaultSequenceNumber: 99,
    defaultPriority: 'optional',
    whyItMatters: 'The birth of the MCU. Tony Stark declares "I am Iron Man" to the world. Now, Robert Downey Jr. returns as Victor Von Doom in Doomsday.',
    charactersIntroduced: ['Tony Stark (Iron Man)', 'Pepper Potts', 'Nick Fury (Post-credits)'],
    relevantPlotPoints: ['Mark I cave escape', 'Arc Reactor invention', 'Nick Fury mentions the Avengers Initiative'],
    universeConnections: ['The Avengers', 'Avengers: Endgame', 'Avengers: Doomsday'],
    multiverseSignificance: 'The original Sacred Timeline origin point.',
    canonStatus: 'Confirmed Canon',
    streamingIndia: [
      {
        provider: 'JioHotstar',
        availabilityStatus: 'available',
        directUrl: 'https://www.hotstar.com/in/movies/iron-man/1260017162',
        searchUrl: 'https://www.hotstar.com/in/search?q=Iron+Man',
        lastVerifiedAt: '2026-11-20'
      }
    ]
  },
  {
    id: 'mcu-wandavision',
    tmdbId: 85271,
    mediaType: 'tv',
    title: 'WandaVision',
    releaseYear: 2021,
    releaseDate: '2021-01-15',
    runtime: 35,
    rating: 8.2,
    voteCount: 11000,
    genres: ['Sci-Fi', 'Mystery', 'Drama'],
    director: 'Matt Shakman',
    cast: ['Elizabeth Olsen', 'Paul Bettany', 'Kathryn Hahn', 'Teyonah Parris'],
    synopsis: 'Living idealized suburban lives in the town of Westview, super-powered newlyweds Wanda and Vision begin to suspect that everything is not as it seems.',
    posterPath: 'https://image.tmdb.org/t/p/w780/glKDfE6btIRcVB5zrjspRIs4r52.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/original/cq62fLH3vwOmiaLKMqkDI86tPtH.jpg',
    defaultPhaseGroup: 'Optional Viewing',
    defaultSequenceNumber: 99,
    defaultPriority: 'optional',
    whyItMatters: 'Wanda Maximoff fulfills the prophecy of the Scarlet Witch and unlocks the Darkhold, leading directly into Multiverse of Madness and Incursions.',
    charactersIntroduced: ['Agatha Harkness', 'Monica Rambeau (Photon)', 'Billy & Tommy Maximoff'],
    relevantPlotPoints: ['Hex creation over Westview', 'White Vision activation', 'Unlocking of the Darkhold'],
    universeConnections: ['Doctor Strange in the Multiverse of Madness', 'Agatha All Along'],
    multiverseSignificance: 'Introduced the mystical chaos magic and Darkhold that causes multiversal dreamwalking.',
    canonStatus: 'Confirmed Canon',
    streamingIndia: [
      {
        provider: 'JioHotstar',
        availabilityStatus: 'available',
        directUrl: 'https://www.hotstar.com/in/shows/wandavision/1260051318',
        searchUrl: 'https://www.hotstar.com/in/search?q=WandaVision',
        lastVerifiedAt: '2026-11-20'
      }
    ]
  },
  {
    id: 'mcu-thor-ragnarok',
    tmdbId: 284053,
    mediaType: 'movie',
    title: 'Thor: Ragnarok',
    releaseYear: 2017,
    releaseDate: '2017-11-03',
    runtime: 130,
    rating: 7.6,
    voteCount: 20100,
    genres: ['Action', 'Adventure', 'Comedy', 'Sci-Fi'],
    director: 'Taika Waititi',
    cast: ['Chris Hemsworth', 'Tom Hiddleston', 'Cate Blanchett', 'Mark Ruffalo', 'Tessa Thompson'],
    synopsis: 'Imprisoned on the garbage planet Sakaar, Thor must race against time to return to Asgard and stop Ragnarok—the destruction of his world at the hands of the ruthless Hela.',
    posterPath: 'https://image.tmdb.org/t/p/w780/rzRwTcFvttcN1ZpX2xv4j3tSdJu.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/original/vLmHH8jAy8Jq8uBsLucd3592WGh.jpg',
    defaultPhaseGroup: 'Optional Viewing',
    defaultSequenceNumber: 99,
    defaultPriority: 'optional',
    whyItMatters: 'Destruction of Asgard, Odin\'s passing, Thor losing Mjolnir and awakening his true lightning godhood, directly leading into the opening frames of Infinity War.',
    charactersIntroduced: ['Valkyrie', 'Hela (Goddess of Death)', 'Grandmaster', 'Korg'],
    relevantPlotPoints: ['Mjolnir shattered', 'Surtur unleashes Ragnarok', 'Thanos sanctuary ship intercepts the refugee fleet'],
    universeConnections: ['Avengers: Infinity War', 'Loki (2021)'],
    multiverseSignificance: 'The refugee Asgardian timeline branch explored repeatedly in What If...?',
    canonStatus: 'Confirmed Canon',
    streamingIndia: [
      {
        provider: 'JioHotstar',
        availabilityStatus: 'available',
        directUrl: 'https://www.hotstar.com/in/movies/thor-ragnarok/1260017167',
        searchUrl: 'https://www.hotstar.com/in/search?q=Thor+Ragnarok',
        lastVerifiedAt: '2026-11-20'
      }
    ]
  },
  {
    id: 'fox-logan-2017',
    tmdbId: 263115,
    mediaType: 'movie',
    title: 'Logan',
    releaseYear: 2017,
    releaseDate: '2017-03-03',
    runtime: 137,
    rating: 7.8,
    voteCount: 19100,
    genres: ['Action', 'Drama', 'Sci-Fi'],
    director: 'James Mangold',
    cast: ['Hugh Jackman', 'Patrick Stewart', 'Dafne Keen', 'Boyd Holbrook', 'Stephen Merchant'],
    synopsis: 'In the near future, a weary Logan cares for an ailing Professor X in a hideout on the Mexican border. But his attempts to hide from the world are upended when a young mutant closely resembling him arrives.',
    posterPath: 'https://image.tmdb.org/t/p/w780/fnbjcRDYn6YviCcePDnGdyAkYsB.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/original/4DZxWNSAyksN6N3JkvpJ53Yq6zU.jpg',
    defaultPhaseGroup: 'Optional Viewing',
    defaultSequenceNumber: 99,
    defaultPriority: 'optional',
    whyItMatters: 'LOGAN IS THE ANCHOR BEING OF EARTH-10005. His heroic death saving Laura (X-23) triggers the gradual decay of the entire Fox timeline in Deadpool & Wolverine.',
    charactersIntroduced: ['Laura / X-23 (Dafne Keen)', 'Donald Pierce (Reavers)', 'X-24'],
    relevantPlotPoints: ['Death of Charles Xavier', 'Transigen clone experiments', 'Logan sacrifices his life against X-24'],
    universeConnections: ['Deadpool & Wolverine', 'X-Men (2000)'],
    multiverseSignificance: 'Defines the Anchor Being rule established by the TVA.',
    canonStatus: 'Official Alternate Reality',
    streamingIndia: [
      {
        provider: 'JioHotstar',
        availabilityStatus: 'available',
        directUrl: 'https://www.hotstar.com/in/movies/logan/1770001314',
        searchUrl: 'https://www.hotstar.com/in/search?q=Logan',
        lastVerifiedAt: '2026-11-20'
      }
    ]
  }
];

interface DiscoverCatalogProps {
  onOpenTitleDetails: (title: MarvelTitle) => void;
}

export const DiscoverCatalog: React.FC<DiscoverCatalogProps> = ({ onOpenTitleDetails }) => {
  const { collections, activeCollectionId } = useAppStore();
  const activeCol = collections.find(c => c.id === activeCollectionId) || collections[0];

  const allAvailableTitles = useMemo(() => {
    const map = new Map<string, MarvelTitle>();
    MARVEL_TITLES.forEach(t => map.set(t.id, t));
    ADDITIONAL_DISCOVERY_TITLES.forEach(t => map.set(t.id, t));
    return Array.from(map.values());
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<'All' | 'Trending' | 'Multiverse' | 'Avengers' | 'Mutants'>('All');
  const [selectedMediaType, setSelectedMediaType] = useState<'all' | 'movie' | 'tv'>('all');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');

  // Modal to add to collection
  const [modalTitle, setModalTitle] = useState<MarvelTitle | null>(null);

  // Filtered titles
  const filteredTitles = useMemo(() => {
    return allAvailableTitles.filter(title => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = title.title.toLowerCase().includes(q);
        const matchCast = title.cast.some(c => c.toLowerCase().includes(q));
        const matchDirector = title.director.toLowerCase().includes(q);
        const matchChar = title.charactersIntroduced.some(ci => ci.toLowerCase().includes(q));
        if (!matchTitle && !matchCast && !matchDirector && !matchChar) return false;
      }

      // Media type
      if (selectedMediaType !== 'all' && title.mediaType !== selectedMediaType) return false;

      // Genre
      if (selectedGenre !== 'All' && !title.genres.includes(selectedGenre)) return false;

      // Category tags
      if (selectedTag === 'Trending') {
        return title.releaseYear >= 2021;
      }
      if (selectedTag === 'Multiverse') {
        return title.defaultPhaseGroup === 'Phase 02 — The Multiverse' || title.id.includes('loki') || title.id.includes('strange');
      }
      if (selectedTag === 'Avengers') {
        return title.title.includes('Avengers') || title.title.includes('Captain America');
      }
      if (selectedTag === 'Mutants') {
        return title.title.includes('X-Men') || title.title.includes('Wolverine') || title.title.includes('Deadpool') || title.title.includes('Logan');
      }

      return true;
    });
  }, [allAvailableTitles, searchQuery, selectedTag, selectedMediaType, selectedGenre]);

  const isInActiveCollection = (movieId: string) => {
    return activeCol?.items.some(i => i.movieId === movieId);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* 1. Discover Header & Search Bar */}
      <div className="metallic-card rounded-3xl p-6 md:p-10 border border-doom-border/90 bg-gradient-to-r from-doom-900 via-doom-850 to-doom-950">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-doom-950 border border-doom-gold/40 px-3 py-1 rounded-full text-xs font-mono text-doom-gold">
            <Sparkles size={12} />
            <span>TMDB-POWERED MARVEL CATALOGUE</span>
          </div>

          <h2 className="font-cinematic text-4xl sm:text-6xl text-white uppercase tracking-wider text-glow-red">
            DISCOVER & EXPAND
          </h2>

          <p className="text-xs sm:text-sm text-gray-400 font-sans leading-relaxed">
            Search across the Multiverse. Explore verified Marvel cinematic releases, add essential canon to your custom watchlists, and inspect character arcs.
          </p>

          {/* Search Input Bar */}
          <div className="relative pt-2">
            <Search className="absolute left-4 top-5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by title, character (e.g. Wolverine, Loki), or actor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-doom-950 border border-doom-border/80 focus:border-doom-red rounded-2xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none transition-colors shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-5 text-xs text-gray-500 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Category Pills & Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-doom-950/80 p-4 rounded-2xl border border-doom-border">
        {/* Curated Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'All', label: 'All Catalog' },
            { id: 'Trending', label: 'Trending / Modern' },
            { id: 'Multiverse', label: 'Multiverse Arc' },
            { id: 'Avengers', label: 'Avengers Saga' },
            { id: 'Mutants', label: 'Mutants & X-Men' },
          ].map((tag) => (
            <button
              key={tag.id}
              onClick={() => setSelectedTag(tag.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-marvel uppercase tracking-wider transition-all ${
                selectedTag === tag.id
                  ? 'bg-doom-red text-white font-bold shadow-glow-red'
                  : 'bg-doom-900 text-gray-400 hover:text-white border border-doom-border'
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>

        {/* Media & Genre Selectors */}
        <div className="flex items-center gap-2">
          <select
            value={selectedMediaType}
            onChange={(e) => setSelectedMediaType(e.target.value as any)}
            className="bg-doom-900 border border-doom-border rounded-lg px-2.5 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-doom-red"
          >
            <option value="all">All Media Types</option>
            <option value="movie">Movies Only</option>
            <option value="tv">TV Series Only</option>
          </select>

          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="bg-doom-900 border border-doom-border rounded-lg px-2.5 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-doom-red"
          >
            <option value="All">All Genres</option>
            <option value="Action">Action</option>
            <option value="Sci-Fi">Sci-Fi</option>
            <option value="Adventure">Adventure</option>
            <option value="Fantasy">Fantasy</option>
            <option value="Drama">Drama</option>
          </select>
        </div>
      </div>

      {/* 3. Results Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
          <span>Showing {filteredTitles.length} Titles</span>
          <span>Target Destination: <strong className="text-white">{activeCol?.name}</strong></span>
        </div>

        {filteredTitles.length === 0 ? (
          <div className="metallic-card rounded-2xl p-12 text-center space-y-3 border border-doom-border">
            <Film size={32} className="mx-auto text-gray-500" />
            <h3 className="font-cinematic text-2xl uppercase tracking-wider text-white">
              No Titles Found
            </h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto font-sans">
              No matching cinematic entries for "{searchQuery}". Try searching for another movie, series, or character.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {filteredTitles.map((title) => {
              const inCollection = isInActiveCollection(title.id);
              return (
                <div
                  key={title.id}
                  className="group metallic-card rounded-2xl overflow-hidden border border-doom-border hover:border-doom-red/50 transition-all flex flex-col justify-between"
                >
                  {/* Poster Image */}
                  <div 
                    onClick={() => onOpenTitleDetails(title)}
                    className="relative aspect-[2/3] w-full overflow-hidden bg-doom-950 cursor-pointer"
                  >
                    <CinematicImage
                      src={title.posterPath}
                      alt={title.title}
                      fallbackTitle={title.title}
                      fallbackSubtitle={String(title.releaseYear)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-doom-950 via-transparent to-transparent opacity-60" />

                    {/* Media Type Badge */}
                    <span className="absolute top-2.5 left-2.5 marvel-badge px-1.5 py-0.5 text-[9px] rounded">
                      {title.mediaType === 'tv' ? 'TV' : 'MOVIE'}
                    </span>

                    {/* Rating Pill */}
                    <div className="absolute top-2.5 right-2.5 bg-black/70 backdrop-blur-sm border border-white/10 px-1.5 py-0.5 rounded text-[10px] text-doom-gold font-mono flex items-center gap-1">
                      <Star size={10} fill="currentColor" />
                      <span>{title.rating.toFixed(1)}</span>
                    </div>

                    {/* In Watchlist Indicator Pill */}
                    {inCollection && (
                      <div className="absolute bottom-2.5 left-2.5 bg-doom-emerald/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                        <Check size={10} />
                        <span>In Watchlist</span>
                      </div>
                    )}
                  </div>

                  {/* Body Info */}
                  <div className="p-3.5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] text-gray-500 font-mono mb-0.5">
                        {title.releaseYear} • {title.genres[0]}
                      </div>
                      <h4 
                        onClick={() => onOpenTitleDetails(title)}
                        className="font-marvel text-sm sm:text-base font-bold text-white tracking-wide truncate cursor-pointer hover:text-doom-red transition-colors"
                      >
                        {title.title}
                      </h4>
                      <p className="text-[11px] text-gray-400 line-clamp-2 mt-1 font-sans">
                        {title.synopsis}
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div className="pt-3 mt-3 border-t border-doom-border/60 flex items-center gap-2">
                      <button
                        onClick={() => setModalTitle(title)}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1 ${
                          inCollection
                            ? 'bg-doom-950 text-gray-400 hover:text-white border border-doom-border'
                            : 'bg-doom-red hover:bg-doom-red-bright text-white shadow-glow-red'
                        }`}
                        title={inCollection ? 'Add to another collection' : 'Add to collection'}
                      >
                        <Plus size={13} />
                        <span className="truncate">{inCollection ? 'Add to Other' : 'Add to List'}</span>
                      </button>

                      <button
                        onClick={() => onOpenTitleDetails(title)}
                        className="p-1.5 rounded-lg bg-doom-950 hover:bg-doom-800 border border-doom-border text-gray-300 hover:text-white transition-colors"
                        title="View Full Cinematic Lore & Details"
                      >
                        <Info size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add to Collection Modal */}
      <MoveCollectionModal
        isOpen={!!modalTitle}
        title={modalTitle}
        onClose={() => setModalTitle(null)}
      />
    </div>
  );
};
