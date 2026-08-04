export type ScreenStep =
  | 'landing'
  | 'process'
  | 'name_input'
  | 'team_selection'
  | 'best_member'
  | 'best_event'
  | 'rookie'
  | 'perfect_duo'
  | 'submission'
  | 'completed'
  | 'statistics';

export type HugoTeam = 'prs' | 'hc' | 'bnn' | 'niff';

export interface TeamInfo {
  id: HugoTeam;
  name: string;
  icon?: string;
  image?: string;
  activeImage?: string;
  description: string;
  color: string;
  glow: string;
  heroLogo?: string;
}

export interface TeamMoment {
  id: string;
  teamId: HugoTeam;
  imageUrl: string;
  caption: string;
  author: string;
  authorAvatar?: string;
  likes: number;
  date: string;
  tag?: string;
}

export interface Candidate {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
}

export interface EventOption {
  id: string;
  name: string;
  icon?: string;
  avatar?: string;
  description?: string;
  tag?: string;
}

export interface DuoPair {
  id: string;
  name: string;
  avatar?: string;
  personA1?: string;
  personA2?: string;
  personB1?: string;
  personB2?: string;
}

export interface VotingState {
  userName: string;
  userEmail?: string;
  userAvatar?: string;
  selectedTeam: HugoTeam | null;
  selectedBestMember: string[];
  selectedBestEvent: string[];
  selectedRookie: string[];
  selectedDuo: string[];
  isSubmitted: boolean;
  submittedAt?: string;
}

export interface CategoryVotes {
  [candidateId: string]: number;
}

export interface LiveResultsData {
  teams: Record<HugoTeam, number>;
  bestMember: CategoryVotes;
  bestEvent: CategoryVotes;
  rookie: CategoryVotes;
  perfectDuo: CategoryVotes;
  totalSubmissions: number;
}
