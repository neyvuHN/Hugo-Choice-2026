import { TeamInfo, Candidate, EventOption, DuoPair, LiveResultsData, TeamMoment } from '../types';
import { getMediaUrl } from '../utils/mediaHelpers';

export const TEAMS: TeamInfo[] = [
  {
    id: 'prs',
    name: 'Power Rangers',
    icon: '⚡',
    image: '/assets/teams/PRs.png',
    activeImage: '/assets/teams/PRs2.png',
    heroLogo: getMediaUrl('/team_logo/POWER RANGERS.png'),
    description: 'Justice for all',
    color: '#ef4444',
    glow: 'rgba(239, 68, 68, 0.6)'
  },
  {
    id: 'hc',
    name: 'Heroes Company',
    icon: '🛡️',
    image: '/assets/teams/HC.png',
    activeImage: '/assets/teams/HC2.png',
    heroLogo: getMediaUrl('/team_logo/Heroes.png'),
    description: 'Stronger Together',
    color: '#3b82f6',
    glow: 'rgba(59, 130, 246, 0.6)'
  },
  {
    id: 'bnn',
    name: 'Banana',
    icon: '🍌',
    image: '/assets/teams/BNN.png',
    activeImage: '/assets/teams/BNN2.png',
    heroLogo: getMediaUrl('/team_logo/BANANA.png'),
    description: 'We come in bunch',
    color: '#eab308',
    glow: 'rgba(234, 179, 8, 0.6)'
  },
  {
    id: 'niff',
    name: 'Nifflers',
    icon: '🐾',
    image: '/assets/teams/Niff.png',
    activeImage: '/assets/teams/Niff2.png',
    heroLogo: getMediaUrl('/team_logo/NIFFLER.png'),
    description: 'Friends forever',
    color: '#a855f7',
    glow: 'rgba(168, 85, 247, 0.6)'
  }
];

export const INITIAL_TEAM_MOMENTS: TeamMoment[] = [];


export const BEST_EVENTS: EventOption[] = [
  {
    id: 'e1',
    name: 'Live Stream: ÔN THI TIẾNG ANH ĐẦU VÀO MIỄN PHÍ',
    icon: '📺',
    avatar: '/assets/profile_image/TheBestEvent/Workshop.png',
    description: 'Special online livestream helping members ace English placement exams.',
    tag: 'ONLINE LIVESTREAM'
  },
  {
    id: 'e2',
    name: '[HUGO 𝐂𝐇𝐑𝐈𝐒𝐓𝐌𝐀𝐒 𝟐𝟎𝟐𝟓] - 𝐓𝐇𝐄 𝐆𝐎𝐋𝐃𝐄𝐍 𝐇𝐎𝐔𝐑 🎄✨',
    icon: '🎄',
    avatar: '/assets/profile_image/TheBestEvent/Camping.png',
    description: 'Magical Christmas party with heartwarming activities and golden memories.',
    tag: 'HOLIDAY CELEBRATION'
  },
  {
    id: 'e3',
    name: '[𝐎𝐍𝐋𝐈𝐍𝐄 𝐓𝐀𝐋𝐊𝐒𝐇𝐎𝐖 - 𝐇𝐔𝐆𝐎 𝐄𝐍𝐆𝐋𝐈𝐒𝐇 𝐂𝐋𝐔𝐁] | TẤM VÉ VIỄN PHƯƠNG',
    icon: '🎙️',
    avatar: '/assets/profile_image/TheBestEvent/angel.png',
    description: 'Inspiring online talkshow sharing valuable overseas and career journeys.',
    tag: 'TALKSHOW'
  },
  {
    id: 'e4',
    name: '[𝐖𝐄𝐋𝐂𝐎𝐌𝐄 𝐍𝐄𝐖𝐁𝐈𝐄 𝟐𝟎𝟐𝟔] - 𝐄𝐂𝐋𝐈𝐏𝐒𝐄',
    icon: '🌘',
    avatar: '/assets/profile_image/TheBestEvent/WN.png',
    description: 'Grand welcome celebration for the 2026 rookie cohort.',
    tag: 'WELCOME EVENT'
  },
  {
    id: 'e5',
    name: '[𝐇𝐔𝐆𝐎 𝐖𝐎𝐑𝐊𝐒𝐇𝐎𝐏] - 𝐈𝐍𝐒𝐈𝐃𝐄𝐑 𝐒𝐄𝐂𝐑𝐄𝐓𝐒 🔥',
    icon: '🔥',
    avatar: '/assets/profile_image/TheBestEvent/yearinink.png',
    description: 'Exclusive skill-building workshop unlocking insider communication secrets.',
    tag: 'WORKSHOP'
  },
  {
    id: 'e6',
    name: '📣 [𝐇𝐔𝐆𝐎 𝐂𝐀𝐌𝐏𝐈𝐍𝐆 𝟐𝟎𝟐𝟔 - 𝐄𝐌𝐁𝐄𝐑𝐋𝐈𝐍𝐄] 📣',
    icon: '🏕️',
    avatar: '/assets/profile_image/TheBestEvent/Camping.png',
    description: 'Unforgettable outdoor camping retreat around Emberline campfire.',
    tag: 'CAMPING RETREAT'
  },
  {
    id: 'e7',
    name: '[𝐖𝐄𝐋𝐂𝐎𝐌𝐄 𝐍𝐄𝐖𝐁𝐈𝐄 𝟐𝟎𝟐5] - FLAREON',
    icon: '✨',
    avatar: '/assets/profile_image/TheBestEvent/WN.png',
    description: 'Fiery and vibrant welcome gathering for the 2025 club members.',
    tag: 'WELCOME EVENT'
  }
];

export const INITIAL_LIVE_RESULTS: LiveResultsData = {
  totalSubmissions: 0,
  teams: {
    prs: 0,
    hc: 0,
    bnn: 0,
    niff: 0
  },
  bestMember: {},
  bestEvent: {},
  rookie: {},
  perfectDuo: {}
};
