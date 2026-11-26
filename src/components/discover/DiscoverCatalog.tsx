import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Check,
  Star,
  Film,
  Info,
  X,
} from 'lucide-react';
import { MARVEL_TITLES, MarvelTitle } from '../../data/marvelCatalogue';
import { useAppStore } from '../../services/store';
import { MoveCollectionModal } from '../watchlist/MoveCollectionModal';
import { CinematicImage } from '../common/CinematicImage';

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
        lastVerifiedAt: 'Nov 2026',
      },
    ],
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
        lastVerifiedAt: 'Nov 2026',
      },
    ],
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
    whyItMatters: "Destruction of Asgard, Odin's passing, Thor losing Mjolnir and awakening his true lightning godhood, directly leading into the opening frames of Infinity War.",
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
        lastVerifiedAt: 'Nov 2026',
      },
    ],
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
        lastVerifiedAt: 'Nov 2026',
      },
    ],
  },
];

interface DiscoverCatalogProps {
  onOpenTitleDetails: (title: MarvelTitle) => void;
}

export const DiscoverCatalog: React.FC<DiscoverCatalogProps> = ({ onOpenTitleDetails }) => {
  const { collections, activeCollectionId } = useAppStore();
  const activeCol = collections.find((c) => c.id === activeCollectionId) || collections[0];

  const allAvailableTitles = useMemo(() => {
    const map = new Map<string, MarvelTitle>();
    MARVEL_TITLES.forEach((t) => map.set(t.id, t));
    ADDITIONAL_DISCOVERY_TITLES.forEach((t) => map.set(t.id, t));
    return Array.from(map.values());
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<'All' | 'Trending' | 'Multiverse' | 'Avengers' | 'Mutants'>('All');
  const [selectedMediaType, setSelectedMediaType] = useState<'all' | 'movie' | 'tv'>('all');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [modalTitle, setModalTitle] = useState<MarvelTitle | null>(null);

  const filteredTitles = useMemo(() => {
    return allAvailableTitles.filter((title) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = title.title.toLowerCase().includes(q);
        const matchCast = title.cast.some((c) => c.toLowerCase().includes(q));
        const matchDirector = title.director.toLowerCase().includes(q);
        const matchChar = title.charactersIntroduced.some((ci) => ci.toLowerCase().includes(q));
        if (!matchTitle && !matchCast && !matchDirector && !matchChar) return false;
      }

      if (selectedMediaType !== 'all' && title.mediaType !== selectedMediaType) return false;
      if (selectedGenre !== 'All' && !title.genres.includes(selectedGenre)) return false;

      if (selectedTag === 'Trending') return title.releaseYear >= 2021;
      if (selectedTag === 'Multiverse') {
        return (
          title.defaultPhaseGroup === 'Phase 02 — The Multiverse' ||
          title.id.includes('loki') ||
          title.id.includes('strange')
        );
      }
      if (selectedTag === 'Avengers') {
        return title.title.includes('Avengers') || title.title.includes('Captain America');
      }
      if (selectedTag === 'Mutants') {
        return (
          title.title.includes('X-Men') ||
          title.title.includes('Wolverine') ||
          title.title.includes('Deadpool') ||
          title.title.includes('Logan')
        );
      }

      return true;
    });
  }, [allAvailableTitles, searchQuery, selectedTag, selectedMediaType, selectedGenre]);

  const isInActiveCollection = (movieId: string) => {
    return activeCol?.items.some((i) => i.movieId === movieId);
  };

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedTag('All');
    setSelectedMediaType('all');
    setSelectedGenre('All');
  };

  return (
    <div className="space-y-5 pb-20">
      {/* Header & Search */}
      <div className="pb-4 border-b border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
          Discover
        </h1>

        <div className="relative w-full md:max-w-md">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            size={15}
            aria-hidden="true"
          />
          <input
            type="search"
            aria-label="Search titles, characters, or actors"
            placeholder="Search titles, characters, actors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="ui-field w-full h-9 bg-[#0f131b] border border-white/14 rounded-xl pl-10 pr-9 text-xs sm:text-sm text-white placeholder:text-slate-500"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
              className="ui-press ui-press--on-dark ui-focus absolute right-1.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-md text-slate-400 hover:text-white flex items-center justify-center"
            >
              <X size={13} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {/* Category & Filter Bar */}
      <div className="p-2 rounded-xl bg-[#0f131b] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-2.5">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: 'All', label: 'All' },
            { id: 'Trending', label: 'Trending' },
            { id: 'Multiverse', label: 'Multiverse' },
            { id: 'Avengers', label: 'Avengers' },
            { id: 'Mutants', label: 'X-Men & Mutants' },
          ].map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => setSelectedTag(tag.id as any)}
              aria-pressed={selectedTag === tag.id}
              className={`ui-press ui-press--on-dark ui-focus h-8 px-3 rounded-full text-xs font-medium whitespace-nowrap shrink-0 border ${
                selectedTag === tag.id
                  ? 'bg-emerald-500/15 text-emerald-300 font-semibold border-emerald-500/35'
                  : 'text-slate-400 hover:text-white border-transparent hover:bg-white/[0.06]'
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:flex items-center gap-2 shrink-0">
          <select
            aria-label="Filter by media type"
            value={selectedMediaType}
            onChange={(e) => setSelectedMediaType(e.target.value as any)}
            className="doom-select ui-field h-8 border border-white/14 rounded-lg px-2.5 text-xs text-slate-200"
          >
            <option value="all">All Types</option>
            <option value="movie">Movies</option>
            <option value="tv">TV Series</option>
          </select>

          <select
            aria-label="Filter by genre"
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="doom-select ui-field h-8 border border-white/14 rounded-lg px-2.5 text-xs text-slate-200"
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

      {/* Results Header & Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400 px-0.5 gap-2">
          <span className="font-mono tabular-nums whitespace-nowrap">
            {filteredTitles.length} {filteredTitles.length === 1 ? 'Title' : 'Titles'}
          </span>
          <span className="truncate text-right">
            Active list: <strong className="text-slate-200 font-medium">{activeCol?.name}</strong>
          </span>
        </div>

        {filteredTitles.length === 0 ? (
          <div className="rounded-2xl p-12 text-center space-y-3 bg-[#0f131b] border border-white/10">
            <Film size={24} className="mx-auto text-slate-400" aria-hidden="true" />
            <h3 className="text-base font-semibold text-white">No matching titles</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {searchQuery
                ? `No entries match "${searchQuery}".`
                : 'No entries match your active filters.'}
            </p>
            <button
              type="button"
              onClick={resetAllFilters}
              className="ui-press ui-focus h-9 px-4 rounded-lg bg-white text-doom-950 text-xs font-semibold inline-flex items-center justify-center"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {filteredTitles.map((title) => {
              const inCollection = isInActiveCollection(title.id);
              return (
                <article
                  key={title.id}
                  className="p-2 rounded-2xl bg-[#0f131b] hover:bg-[#131823] border border-white/10 hover:border-white/20 transition-[background-color,border-color] duration-150 flex flex-col justify-between group"
                >
                  <div>
                    <button
                      type="button"
                      onClick={() => onOpenTitleDetails(title)}
                      aria-label={`View details for ${title.title}`}
                      className="ui-press ui-press--surface ui-press--on-dark ui-focus relative aspect-[2/3] w-full rounded-lg overflow-hidden bg-doom-950 block text-left"
                    >
                      <CinematicImage
                        src={title.posterPath}
                        alt={title.title}
                        fallbackTitle={title.title}
                        fallbackSubtitle={String(title.releaseYear)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 will-change-transform"
                        loading="lazy"
                      />
                      <div
                        data-ui-overlap
                        className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none"
                      />

                      <span
                        data-ui-overlap
                        className="absolute top-2 left-2 px-1.5 py-0.5 text-[10px] rounded font-mono font-semibold bg-black/75 text-white/90 backdrop-blur-sm uppercase pointer-events-none"
                      >
                        {title.mediaType === 'tv' ? 'TV' : 'Movie'}
                      </span>

                      <div
                        data-ui-overlap
                        className="absolute top-2 right-2 bg-black/75 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] text-amber-400 font-mono flex items-center gap-1 pointer-events-none"
                      >
                        <Star size={10} fill="currentColor" aria-hidden="true" />
                        <span className="tabular-nums">{title.rating.toFixed(1)}</span>
                      </div>

                      {inCollection && (
                        <div
                          data-ui-overlap
                          className="absolute bottom-2 left-2 bg-emerald-500 text-doom-950 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 pointer-events-none"
                        >
                          <Check size={10} strokeWidth={2.5} aria-hidden="true" />
                          <span>In List</span>
                        </div>
                      )}
                    </button>

                    <div className="pt-2 px-0.5">
                      <button
                        type="button"
                        onClick={() => onOpenTitleDetails(title)}
                        className="ui-dim ui-focus block w-full text-left text-xs sm:text-sm font-semibold text-white truncate hover:text-emerald-300 leading-tight"
                        title={title.title}
                      >
                        {title.title}
                      </button>
                      <div className="text-[11px] text-slate-400 font-mono tabular-nums mt-1 truncate">
                        {title.releaseYear} · {title.genres[0]}
                      </div>
                    </div>
                  </div>

                  {/* Uniform 32px action bar */}
                  <div className="pt-2 mt-2 border-t border-white/[0.06] flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setModalTitle(title)}
                      className={`ui-press ui-press--on-dark ui-focus flex-1 h-8 px-2.5 rounded-lg font-medium text-xs flex items-center justify-center gap-1.5 truncate border ${
                        inCollection
                          ? 'bg-white/[0.06] text-slate-200 border-white/12 hover:text-white'
                          : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/35 hover:bg-emerald-500/25'
                      }`}
                      title={
                        inCollection
                          ? 'Add to another collection'
                          : `Add to ${activeCol?.name || 'List'}`
                      }
                    >
                      <Plus size={13} className="shrink-0" aria-hidden="true" />
                      <span className="truncate">{inCollection ? 'Add Other' : 'Add to List'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onOpenTitleDetails(title)}
                      aria-label={`Details for ${title.title}`}
                      className="ui-press ui-press--on-dark ui-focus w-8 h-8 rounded-lg bg-white/[0.04] border border-white/12 text-slate-400 hover:text-white flex items-center justify-center shrink-0"
                      title="View Details"
                    >
                      <Info size={13} aria-hidden="true" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      <MoveCollectionModal
        isOpen={!!modalTitle}
        title={modalTitle}
        onClose={() => setModalTitle(null)}
      />
    </div>
  );
};
