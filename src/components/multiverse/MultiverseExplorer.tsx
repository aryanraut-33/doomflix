import React, { useState } from 'react';
import { 
  Compass, 
  Layers, 
  ShieldAlert, 
  ExternalLink, 
  Info, 
  Flame, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle,
  ChevronRight,
  X
} from 'lucide-react';
import { MULTIVERSE_GRAPH_NODES, MultiverseNode } from '../../data/multiverseGraph';
import { MARVEL_TITLES, MarvelTitle } from '../../data/marvelCatalogue';
import { CinematicImage } from '../common/CinematicImage';
import { GeometricCube } from '../common/GeometricCube';

interface MultiverseExplorerProps {
  onOpenTitleDetails: (title: MarvelTitle) => void;
}

export const MultiverseExplorer: React.FC<MultiverseExplorerProps> = ({ onOpenTitleDetails }) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('earth-616');
  const [filterCategory, setFilterCategory] = useState<'all' | 'timeline' | 'organization' | 'incursion'>('all');

  const selectedNode = MULTIVERSE_GRAPH_NODES.find(n => n.id === selectedNodeId) || MULTIVERSE_GRAPH_NODES[0];

  const filteredNodes = MULTIVERSE_GRAPH_NODES.filter(node => {
    if (filterCategory !== 'all' && node.category !== filterCategory) return false;
    return true;
  });

  // Calculate lines between connected nodes
  const nodeConnections = React.useMemo(() => {
    const lines: Array<{ from: MultiverseNode; to: MultiverseNode; id: string }> = [];
    const seen = new Set<string>();

    MULTIVERSE_GRAPH_NODES.forEach(source => {
      source.connectedTo.forEach(targetId => {
        const target = MULTIVERSE_GRAPH_NODES.find(n => n.id === targetId);
        if (target) {
          const key = [source.id, target.id].sort().join('--');
          if (!seen.has(key)) {
            seen.add(key);
            lines.push({ from: source, to: target, id: key });
          }
        }
      });
    });
    return lines;
  }, []);

  return (
    <div className="space-y-8 pb-20">
      {/* 1. Explorer Header Banner */}
      <div className="doom-metallic-card rounded-3xl p-6 md:p-8 border border-border flex flex-col md:flex-row items-center justify-between gap-6 shadow-card">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-doom-950 border border-doom-emerald/40 px-3 py-1 rounded-full text-xs font-mono text-doom-emerald">
            <Compass size={13} />
            <span>INTERACTIVE MULTIVERSE ATLAS & INCURSION NEXUS</span>
          </div>

          <h2 className="font-cinematic text-4xl sm:text-6xl text-white uppercase tracking-wider ">
            MULTIVERSE EXPLORER
          </h2>

          <p className="text-xs sm:text-sm text-gray-400 font-sans leading-relaxed">
            Navigate intersecting timelines, alternate realities, and looming Incursions. Understand how Earth-616, Fox mutants, the TVA, and the Fantastic Four converge toward Doctor Doom's Battleworld.
          </p>
        </div>

        <div className="shrink-0 flex flex-col items-center">
          <GeometricCube size={140} />
          <span className="text-[9px] font-mono tracking-widest text-doom-emerald uppercase bg-doom-950/80 px-2.5 py-0.5 rounded-full border border-doom-emerald/40 mt-1 font-bold">
            ✦ Chronal Core
          </span>
        </div>
      </div>

      {/* 2. Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 doom-metallic-card p-4 rounded-2xl border border-border">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-marvel uppercase tracking-wider text-gray-400 font-bold mr-1">
            Category Filter:
          </span>
          {[
            { id: 'all', label: 'All Realities' },
            { id: 'timeline', label: 'Alternate Earths' },
            { id: 'organization', label: 'TVA & Cosmic Realms' },
            { id: 'incursion', label: 'Incursions & Doom' },
          ].map(opt => (
            <button
              key={opt.id}
              onClick={() => setFilterCategory(opt.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-marvel uppercase tracking-wider transition-all ${
                filterCategory === opt.id
                  ? 'bg-gradient-to-r from-doom-emerald-dark to-doom-emerald text-white font-bold shadow-sm'
                  : 'bg-doom-900 text-gray-400 hover:text-white border border-border'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="text-xs text-gray-400 font-mono">
          Select any node below to inspect timeline details
        </div>
      </div>

      {/* 3. Interactive Multiverse Map & Dossier Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Graph Canvas (7 cols on Desktop) */}
        <div className="lg:col-span-7 doom-metallic-card rounded-3xl p-6 border border-border relative min-h-[460px] flex flex-col justify-between overflow-hidden bg-doom-950 shadow-card">
          <div className="absolute inset-0 bg-subtle-grid pointer-events-none opacity-50" />

          {/* SVG Line Connections */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {nodeConnections.map(line => {
              const isHighlighted = line.from.id === selectedNodeId || line.to.id === selectedNodeId;
              return (
                <line
                  key={line.id}
                  x1={`${line.from.coordinates.x}%`}
                  y1={`${line.from.coordinates.y}%`}
                  x2={`${line.to.coordinates.x}%`}
                  y2={`${line.to.coordinates.y}%`}
                  stroke={isHighlighted ? '#F0141E' : '#222838'}
                  strokeWidth={isHighlighted ? 2.5 : 1.2}
                  strokeDasharray={isHighlighted ? '4 2' : 'none'}
                  className={isHighlighted ? 'animate-pulse' : ''}
                />
              );
            })}
          </svg>

          {/* Nodes placed via coordinates */}
          <div className="relative w-full h-[400px] z-10">
            {filteredNodes.map(node => {
              const isSelected = selectedNodeId === node.id;
              let badgeColor = 'bg-doom-800 text-gray-300 border-doom-border';

              if (node.id === 'earth-616') {
                badgeColor = isSelected ? 'bg-doom-red text-white border-doom-red shadow-sm' : 'bg-doom-red/20 text-doom-red border-doom-red/40';
              } else if (node.category === 'incursion') {
                badgeColor = isSelected ? 'bg-doom-red text-white border-doom-red shadow-sm animate-pulse' : 'bg-red-950 text-red-300 border-red-800';
              } else if (node.category === 'organization') {
                badgeColor = isSelected ? 'bg-doom-gold text-doom-950 border-doom-gold shadow-sm' : 'bg-amber-950 text-doom-gold border-amber-800';
              } else {
                badgeColor = isSelected ? 'bg-doom-blue text-white border-doom-blue shadow-sm' : 'bg-blue-950 text-blue-300 border-blue-800';
              }

              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  style={{
                    left: `${node.coordinates.x}%`,
                    top: `${node.coordinates.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  className={`absolute cursor-pointer transition-all duration-300 group`}
                >
                  <div className={`px-3 py-2 rounded-xl border flex items-center gap-2 shadow-lg ${badgeColor} ${isSelected ? 'scale-110 z-20' : 'hover:scale-105'}`}>
                    <span className="w-2 h-2 rounded-full bg-current shrink-0" />
                    <span className="text-xs font-marvel font-bold tracking-wide whitespace-nowrap">
                      {node.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-[10px] text-gray-500 font-mono text-center pt-2 border-t border-doom-border/60 z-10">
            ✦ Nodes represent anchor realities, timeline authorities, and incursion convergence zones.
          </div>
        </div>

        {/* Selected Reality Dossier Panel (5 cols on Desktop) */}
        <div className="lg:col-span-5 metallic-card rounded-3xl p-6 md:p-8 border border-doom-border/90 bg-gradient-to-b from-doom-900 to-doom-950 space-y-6">
          {/* Node Header */}
          <div className="space-y-2 border-b border-doom-border/80 pb-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-marvel uppercase tracking-wider text-doom-gold font-bold">
                REALITY DOSSIER
              </span>
              <span className={`text-[10px] font-marvel uppercase px-2 py-0.5 rounded font-bold ${
                selectedNode.status === 'Confirmed Canon'
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  : 'bg-amber-950 text-amber-400 border border-amber-800'
              }`}>
                {selectedNode.status}
              </span>
            </div>

            <h3 className="font-cinematic text-3xl uppercase tracking-wider text-white">
              {selectedNode.label}
            </h3>

            <p className="text-xs text-gray-400 font-mono">
              Classification: <strong className="text-white">{selectedNode.universeName}</strong>
            </p>
          </div>

          {/* Overview */}
          <div className="space-y-1">
            <div className="text-xs font-marvel uppercase tracking-wider text-gray-400 font-bold">
              Summary
            </div>
            <p className="text-xs text-gray-300 font-sans leading-relaxed">
              {selectedNode.description}
            </p>
          </div>

          {/* Incursion Threat Level */}
          <div className="bg-doom-950 p-4 rounded-xl border border-doom-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame size={16} className={
                selectedNode.details.multiverseThreatLevel === 'Cataclysmic' ? 'text-doom-red animate-pulse' : 'text-doom-gold'
              } />
              <span className="text-xs text-gray-300 font-sans">Multiverse Threat Level:</span>
            </div>
            <span className={`text-xs font-marvel uppercase px-2.5 py-0.5 rounded font-bold ${
              selectedNode.details.multiverseThreatLevel === 'Cataclysmic'
                ? 'bg-red-950 text-red-400 border border-red-800'
                : selectedNode.details.multiverseThreatLevel === 'Critical'
                ? 'bg-amber-950 text-amber-400 border border-amber-800'
                : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
            }`}>
              {selectedNode.details.multiverseThreatLevel}
            </span>
          </div>

          {/* Crucial Lore Context */}
          <div className="space-y-1">
            <div className="text-xs font-marvel uppercase tracking-wider text-doom-gold font-bold">
              Incursion & Convergence Lore
            </div>
            <p className="text-xs text-gray-300 font-sans leading-relaxed italic bg-doom-950/60 p-3 rounded-lg border border-doom-border/60">
              "{selectedNode.details.crucialContext}"
            </p>
          </div>

          {/* Key Figures */}
          <div className="space-y-1.5">
            <div className="text-xs font-marvel uppercase tracking-wider text-gray-400 font-bold">
              Key Anchors & Figures
            </div>
            <div className="flex flex-wrap gap-1.5">
              {selectedNode.details.keyFigures.map((fig, idx) => (
                <span
                  key={idx}
                  className="bg-doom-950 text-white text-[11px] px-2.5 py-1 rounded-md border border-doom-border"
                >
                  {fig}
                </span>
              ))}
            </div>
          </div>

          {/* Associated Titles in Watchlist */}
          {selectedNode.details.associatedMedia.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-doom-border">
              <div className="text-xs font-marvel uppercase tracking-wider text-gray-400 font-bold">
                Connected Watchlist Titles
              </div>
              <div className="space-y-2">
                {selectedNode.details.associatedMedia.map(mId => {
                  const media = MARVEL_TITLES.find(t => t.id === mId);
                  if (!media) return null;
                  return (
                    <div
                      key={media.id}
                      onClick={() => onOpenTitleDetails(media)}
                      className="p-2.5 rounded-xl bg-doom-950 border border-doom-border hover:border-doom-red/50 cursor-pointer transition-colors flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <div className="w-7 h-10 shrink-0 rounded overflow-hidden">
                          <CinematicImage
                            src={media.posterPath}
                            alt={media.title}
                            fallbackTitle={media.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-xs text-white font-medium truncate">{media.title}</span>
                      </div>
                      <ChevronRight size={14} className="text-gray-500 shrink-0" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
