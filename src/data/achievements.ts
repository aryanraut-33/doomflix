export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlockCondition: string;
  icon: string;
  badgeColor: 'red' | 'gold' | 'emerald' | 'blue' | 'purple';
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-watch',
    name: 'First Watch',
    description: 'Mark your first movie or series as watched.',
    unlockCondition: 'Mark at least 1 title as watched',
    icon: 'film',
    badgeColor: 'red',
    rarity: 'Common'
  },
  {
    id: 'timeline-keeper',
    name: 'Timeline Keeper',
    description: 'Complete any full Phase sequence within Multiverse Essentials.',
    unlockCondition: 'Complete all titles in Phase 1, Phase 2, or Phase 3',
    icon: 'hourglass',
    badgeColor: 'gold',
    rarity: 'Epic'
  },
  {
    id: 'multiverse-explorer',
    name: 'Multiverse Explorer',
    description: 'Watch all 5 essential Multiverse Phase titles (Loki S1 & S2, No Way Home, MoM, Deadpool & Wolverine).',
    unlockCondition: 'Complete Phase 02 — The Multiverse',
    icon: 'compass',
    badgeColor: 'emerald',
    rarity: 'Epic'
  },
  {
    id: 'avengers-founding',
    name: 'Earth\'s Mightiest',
    description: 'Complete the entire Avengers Foundation: Cap 1, Avengers 1, Civil War, Infinity War, and Endgame.',
    unlockCondition: 'Complete Phase 01 — The Avengers Foundation',
    icon: 'shield',
    badgeColor: 'blue',
    rarity: 'Epic'
  },
  {
    id: 'episode-binger',
    name: 'TVA Field Agent',
    description: 'Complete all 6 episodes of any season of Loki.',
    unlockCondition: 'Mark all 6 episodes of Loki Season 1 or 2 as watched',
    icon: 'tv',
    badgeColor: 'gold',
    rarity: 'Rare'
  },
  {
    id: 'first-fans',
    name: 'First Fans',
    description: 'Create and complete your first custom collection.',
    unlockCondition: 'Create a custom collection and mark all its titles watched',
    icon: 'bookmark',
    badgeColor: 'purple',
    rarity: 'Rare'
  },
  {
    id: 'knowledge-master',
    name: 'Knowledge Master',
    description: 'Score 80% or higher on any Knowledge Arena quiz attempt.',
    unlockCondition: 'Achieve >= 80% accuracy in a quiz',
    icon: 'award',
    badgeColor: 'gold',
    rarity: 'Rare'
  },
  {
    id: 'perfect-lore',
    name: 'Sacred Omniscience',
    description: 'Score a flawless 100% on a 10+ question Knowledge Arena quiz.',
    unlockCondition: 'Score 100% on any quiz with at least 10 questions',
    icon: 'sparkles',
    badgeColor: 'emerald',
    rarity: 'Legendary'
  },
  {
    id: 'doom-ready',
    name: 'Doomsday Ready',
    description: 'Complete all 18 titles in the Multiverse Essentials watchlist. You are prepared for Avengers: Doomsday.',
    unlockCondition: 'Complete all 18 titles in Multiverse Essentials',
    icon: 'crown',
    badgeColor: 'red',
    rarity: 'Legendary'
  }
];
