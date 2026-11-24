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
        directUrl: 'https://www.hotstar.com/in/movies/iron-man/1660000038',
        searchUrl: 'https://www.hotstar.com/in/explore?search_query=Iron+Man',
        lastVerifiedAt: 'Nov 2026'
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
        directUrl: 'https://www.hotstar.com/in/shows/wandavision/1260051344',
        searchUrl: 'https://www.hotstar.com/in/explore?search_query=WandaVision',
        lastVerifiedAt: 'Nov 2026'
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
        directUrl: 'https://www.hotstar.com/in/movies/thor-ragnarok/1660010577',
        searchUrl: 'https://www.hotstar.com/in/explore?search_query=Thor+Ragnarok',
        lastVerifiedAt: 'Nov 2026'
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
        directUrl: 'https://www.hotstar.com/in/movies/logan/1770016994',
        searchUrl: 'https://www.hotstar.com/in/explore?search_query=Logan',
        lastVerifiedAt: 'Nov 2026'
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
    <div className="space-y-5 pb-20">
      {/* 1. Discover Header & Search Bar — Minimal & Subtle */}
      <div className="pb-3 border-b border-white/5 space-y-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Discover
          </h2>
          <p className="text-xs text-gray-400 font-sans mt-0.5">
            Search movies, series, characters, and sagas across the Marvel Cinematic Universe.
          </p>
        </div>

        {/* Search Input Bar - Sleek & Compact */}
        <div className="relative max-w-xl">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
          <input
            type="text"
            placeholder="Search titles, characters, actors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/10 focus:border-emerald-500/40 rounded-xl pl-9 pr-9 py-2 text-xs text-white placeholder:text-gray-500 focus:outline-none transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-400 hover:text-white px-1 py-0.5"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* 2. Category Pills & Filter Toolbar — Minimal & Subtle */}
      <div className="p-2 sm:p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-2.5">
        {/* Curated Category Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {[
            { id: 'All', label: 'All' },
            { id: 'Trending', label: 'Trending' },
            { id: 'Multiverse', label: 'Multiverse' },
            { id: 'Avengers', label: 'Avengers' },
            { id: 'Mutants', label: 'X-Men & Mutants' },
          ].map((tag) => (
            <button
              key={tag.id}
              onClick={() => setSelectedTag(tag.id as any)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                selectedTag === tag.id
                  ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/40 shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>

        {/* Media & Genre Selectors */}
        <div className="grid grid-cols-2 md:flex items-center gap-2">
          <select
            value={selectedMediaType}
            onChange={(e) => setSelectedMediaType(e.target.value as any)}
            className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-gray-300 focus:outline-none focus:border-emerald-500/40"
          >
            <option value="all">All Types</option>
            <option value="movie">Movies</option>
            <option value="tv">TV Series</option>
          </select>

          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-gray-300 focus:outline-none focus:border-emerald-500/40"
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
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-gray-400 font-mono px-0.5 gap-2">
          <span className="whitespace-nowrap">{filteredTitles.length} Titles</span>
          <span className="truncate text-right">Target: <strong className="text-white">{activeCol?.name}</strong></span>
        </div>

        {filteredTitles.length === 0 ? (
          <div className="rounded-2xl p-12 text-center space-y-3 bg-white/[0.02] border border-white/5">
            <Film size={28} className="mx-auto text-gray-500" />
            <h3 className="text-lg font-semibold uppercase tracking-wider text-white">
              No Titles Found
            </h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto font-sans">
              No matching cinematic entries for "{searchQuery}". Try searching for another movie, series, or character.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 sm:gap-3.5">
            {filteredTitles.map((title) => {
              const inCollection = isInActiveCollection(title.id);
              return (
                <div
                  key={title.id}
                  className="p-2.5 sm:p-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Poster Image */}
                    <div 
                      onClick={() => onOpenTitleDetails(title)}
                      className="relative aspect-[2/3] w-full rounded-xl overflow-hidden bg-doom-950 cursor-pointer"
                    >
                      <CinematicImage
                        src={title.posterPath}
                        alt={title.title}
                        fallbackTitle={title.title}
                        fallbackSubtitle={String(title.releaseYear)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-doom-950/80 via-transparent to-transparent opacity-60" />

                      {/* Media Type Badge */}
                      <span className="absolute top-2 left-2 px-1.5 py-0.5 text-[9px] rounded font-mono font-bold bg-black/60 text-white/90 backdrop-blur-sm border border-white/10 uppercase">
                        {title.mediaType === 'tv' ? 'TV' : 'MOVIE'}
                      </span>

                      {/* Rating Pill */}
                      <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm border border-white/10 px-1.5 py-0.5 rounded text-[10px] text-amber-400 font-mono flex items-center gap-1">
                        <Star size={9} fill="currentColor" />
                        <span>{title.rating.toFixed(1)}</span>
                      </div>

                      {/* In Watchlist Indicator Pill */}
                      {inCollection && (
                        <div className="absolute bottom-2 left-2 bg-emerald-500/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm backdrop-blur-sm">
                          <Check size={9} />
                          <span>In List</span>
                        </div>
                      )}
                    </div>

                    {/* Title & Metadata */}
                    <div className="pt-2">
                      <h4 
                        onClick={() => onOpenTitleDetails(title)}
                        className="text-xs sm:text-sm font-semibold text-white truncate cursor-pointer hover:text-emerald-300 transition-colors leading-tight"
                        title={title.title}
                      >
                        {title.title}
                      </h4>
                      <div className="text-[10px] text-gray-400 font-mono mt-0.5 truncate">
                        {title.releaseYear} • {title.genres[0]}
                      </div>
                    </div>
                  </div>

                  {/* Compact Action Buttons */}
                  <div className="pt-2 mt-1.5 border-t border-white/5 flex items-center gap-1.5">
                    <button
                      onClick={() => setModalTitle(title)}
                      className={`flex-1 py-1 px-2 rounded-md font-medium text-[10px] sm:text-[11px] flex items-center justify-center gap-1 transition-all truncate ${
                        inCollection
                          ? 'bg-white/5 text-gray-300 hover:text-white border border-white/10'
                          : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25'
                      }`}
                      title={inCollection ? 'Add to another collection' : `Add to ${activeCol?.name || 'List'}`}
                    >
                      <Plus size={11} />
                      <span className="truncate">{inCollection ? 'Add Other' : 'Add to List'}</span>
                    </button>

                    <button
                      onClick={() => onOpenTitleDetails(title)}
                      className="p-1 rounded-md bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white transition-colors shrink-0"
                      title="View Details"
                    >
                      <Info size={12} />
                    </button>
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
