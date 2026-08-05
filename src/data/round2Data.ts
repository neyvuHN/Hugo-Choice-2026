import { HugoTeam } from '../types';

export interface Round2Candidate {
  id: string;
  name: string;
  avatar: string;
  teamId?: HugoTeam;
  teamName?: string; // Full team names: Heroes Company, Power Rangers, Banana, Nifflers
  teamLogo?: string;
  icon?: string; // For events
  tag?: string;  // For events
  description?: string; // For events
}

export const ROUND2_ROOKIES: Round2Candidate[] = [
  { id: 'rookie-1', name: 'Thái Thành Tài', avatar: '/Nominees/Rookie/Thai Thanh Tai.webm', teamId: 'hc', teamName: 'Heroes Company', teamLogo: '/team_logo/Heroes.png' },
  { id: 'rookie-2', name: 'Lê Long Vũ', avatar: '/Nominees/Rookie/Le Long Vu.webm', teamId: 'niff', teamName: 'Nifflers', teamLogo: '/team_logo/NIFFLER.png' },
  { id: 'rookie-3', name: 'Huỳnh Thị Thanh Lịch', avatar: '/Nominees/Rookie/Huynh Thi Thanh Lich.webm', teamId: 'prs', teamName: 'Power Rangers', teamLogo: '/team_logo/POWER RANGERS.png' },
  { id: 'rookie-4', name: 'Nguyễn Đại Phú', avatar: '/Nominees/Rookie/Nguyen Dai Phu.webm', teamId: 'hc', teamName: 'Heroes Company', teamLogo: '/team_logo/Heroes.png' },
  { id: 'rookie-5', name: 'Nguyễn Tấn Sinh Thời', avatar: '/Nominees/Rookie/Nguyen Tan Sinh Thoi.webm', teamId: 'prs', teamName: 'Power Rangers', teamLogo: '/team_logo/POWER RANGERS.png' }
];

export const ROUND2_EVENTS: Round2Candidate[] = [
  { id: 'e2', name: '[HUGO 𝐂𝐇𝐑𝐈𝐒𝐓𝐌𝐀𝐒 𝟐𝟎𝟐𝟓] - 𝐓𝐇𝐄 𝐆𝐎𝐋𝐃𝐄𝐍 𝐇𝐎𝐔𝐑 🎄✨', avatar: '/Nominees/Best_event/Hugo Christmas.webm', icon: '🎄', tag: 'Holiday Celebration', description: 'Magical Christmas party with heartwarming activities and golden memories.' },
  { id: 'e3', name: '[𝐎𝐍𝐋𝐈𝐍𝐄 𝐓𝐀𝐋𝐊𝐒𝐇𝐎𝐖 - 𝐇𝐔𝐆𝐎 𝐄𝐍𝐆𝐋𝐈𝐒𝐇 𝐂𝐋𝐔𝐁] | TẤM VÉ VIỄN PHƯƠNG', avatar: '/Nominees/Best_event/Online Talkshow.webm', icon: '🎙️', tag: 'Talkshow', description: 'Inspiring online talkshow sharing valuable overseas and career journeys.' },
  { id: 'e4', name: '[𝐖𝐄𝐋𝐂𝐎𝐌𝐄 𝐍𝐄𝐖𝐁𝐈𝐄 𝟐𝟎𝟐𝟔] - 𝐄𝐂𝐋𝐈𝐏𝐒𝐄', avatar: '/Nominees/Best_event/Welcome Newbie 2026.webm', icon: '🌘', tag: 'Welcome Event', description: 'Grand welcome celebration for the 2026 rookie cohort.' },
  { id: 'e6', name: '📣 [𝐇𝐔𝐆𝐎 𝐂𝐀𝐌𝐏𝐈𝐍𝐆 𝟐𝟎𝟐𝟔] - 𝐄𝐌𝐁𝐄𝐑𝐋𝐈𝐍𝐄 📣', avatar: '/Nominees/Best_event/Hugo Camping.webm', icon: '🏕️', tag: 'Camping Retreat', description: 'Unforgettable outdoor camping retreat around Emberline campfire.' },
  { id: 'e7', name: '[𝐖𝐄𝐋𝐂𝐎𝐌𝐄 𝐍𝐄𝐖𝐁𝐈𝐄 𝟐𝟎𝟐5] - FLAREON', avatar: '/Nominees/Best_event/Welcome Newbie 2025.webm', icon: '✨', tag: 'Welcome Event', description: 'Fiery and vibrant welcome gathering for the 2025 club members.' }
];

export const ROUND2_DUOS: Round2Candidate[] = [
  { id: 'duo-1', name: 'Nguyễn Hữu Lập & Phạm Thanh Pha', avatar: '/Nominees/Perfect_duo/Nguyen Huu Lap & Pham Thanh Pha.webm', teamName: 'Power Rangers' },
  { id: 'duo-2', name: 'Lê Long Vũ & Nguyễn Hữu Hòa Bình', avatar: '/Nominees/Perfect_duo/Le Long Vu & Nguyen Huu Hoa Binh.webm', teamName: 'Nifflers' },
  { id: 'duo-3', name: 'Đoàn Thanh Hậu & Hoàng Bảo Ngọc', avatar: '/Nominees/Perfect_duo/Doan Thanh Hau & Hoang Bao Ngoc.webm', teamName: 'Heroes Company' },
  { id: 'duo-4', name: 'Huỳnh Thị Thanh Lịch & Trần Dĩ Kha', avatar: '/Nominees/Perfect_duo/Huynh Thi Thanh Lich & Tran Di Kha.webm', teamName: 'Power Rangers' },
  { id: 'duo-5', name: 'Nguyễn Thị Thu Hiền & Trần Quốc Thái', avatar: '/Nominees/Perfect_duo/Nguyen Thi Thu Hien & Tran Quoc Thai.webm', teamName: 'Nifflers & Heroes Company' }
];

export const ROUND2_BEST_MEMBERS: Record<HugoTeam, Round2Candidate[]> = {
  bnn: [
    { id: 'bnn-1', name: 'Bạch Nhật Minh', avatar: '/Nominees/Best_mem/Banana/Bach Nhat Minh.webm', teamId: 'bnn', teamName: 'Banana', teamLogo: '/team_logo/BANANA.png' },
    { id: 'bnn-2', name: 'Nguyễn Trần Uyên Trang', avatar: '/Nominees/Best_mem/Banana/Nguyen Tran Uyen Trang.webm', teamId: 'bnn', teamName: 'Banana', teamLogo: '/team_logo/BANANA.png' },
    { id: 'bnn-3', name: 'Hồ Thị Mỹ Duyên', avatar: '/Nominees/Best_mem/Banana/Ho Thi My Duyen.webm', teamId: 'bnn', teamName: 'Banana', teamLogo: '/team_logo/BANANA.png' },
    { id: 'bnn-4', name: 'Mai Vũ Phúc', avatar: '/Nominees/Best_mem/Banana/Mai Vu Phuc.webm', teamId: 'bnn', teamName: 'Banana', teamLogo: '/team_logo/BANANA.png' },
    { id: 'bnn-5', name: 'Phạm Phan Bảo Trúc', avatar: '/Nominees/Best_mem/Banana/Pham Phan Bao Truc.webm', teamId: 'bnn', teamName: 'Banana', teamLogo: '/team_logo/BANANA.png' }
  ],
  niff: [
    { id: 'niff-1', name: 'Trương Thị Trà My', avatar: '/Nominees/Best_mem/Niff/Truong Thi Tra My.webm', teamId: 'niff', teamName: 'Nifflers', teamLogo: '/team_logo/NIFFLER.png' },
    { id: 'niff-2', name: 'Trần Trương Đức Lộc', avatar: '/Nominees/Best_mem/Niff/Tran Truong Duc Loc.webm', teamId: 'niff', teamName: 'Nifflers', teamLogo: '/team_logo/NIFFLER.png' },
    { id: 'niff-3', name: 'Lê Long Vũ', avatar: '/Nominees/Best_mem/Niff/Le Long Vu.webm', teamId: 'niff', teamName: 'Nifflers', teamLogo: '/team_logo/NIFFLER.png' },
    { id: 'niff-4', name: 'Nguyễn Hữu Hòa Bình', avatar: '/Nominees/Best_mem/Niff/Nguyen Huu Hoa Binh.webm', teamId: 'niff', teamName: 'Nifflers', teamLogo: '/team_logo/NIFFLER.png' },
    { id: 'niff-5', name: 'Nguyễn Thị Thu Hiền', avatar: '/Nominees/Best_mem/Niff/Nguyen Thi Thu Hien.webm', teamId: 'niff', teamName: 'Nifflers', teamLogo: '/team_logo/NIFFLER.png' }
  ],
  prs: [
    { id: 'prs-1', name: 'Nguyễn Hữu Lập', avatar: '/Nominees/Best_mem/PR/Nguyen Huu Lap.webm', teamId: 'prs', teamName: 'Power Rangers', teamLogo: '/team_logo/POWER RANGERS.png' },
    { id: 'prs-2', name: 'Trần Dĩ Kha', avatar: '/Nominees/Best_mem/PR/Tran Di Kha.webm', teamId: 'prs', teamName: 'Power Rangers', teamLogo: '/team_logo/POWER RANGERS.png' },
    { id: 'prs-3', name: 'Phạm Thanh Pha', avatar: '/Nominees/Best_mem/PR/Pham Thanh Pha.webm', teamId: 'prs', teamName: 'Power Rangers', teamLogo: '/team_logo/POWER RANGERS.png' },
    { id: 'prs-4', name: 'Nguyễn Tấn Sinh Thời', avatar: '/Nominees/Best_mem/PR/Nguyen Tan Sinh Thoi.webm', teamId: 'prs', teamName: 'Power Rangers', teamLogo: '/team_logo/POWER RANGERS.png' },
    { id: 'prs-5', name: 'Phạm Mạnh Dũng', avatar: '/Nominees/Best_mem/PR/Pham Manh Dung.webm', teamId: 'prs', teamName: 'Power Rangers', teamLogo: '/team_logo/POWER RANGERS.png' }
  ],
  hc: [
    { id: 'hc-1', name: 'Trương Thị Ngọc Huyền', avatar: '/Nominees/Best_mem/HC/Truong Thi Ngoc Huyen.webm', teamId: 'hc', teamName: 'Heroes Company', teamLogo: '/team_logo/Heroes.png' },
    { id: 'hc-2', name: 'Hoàng Bảo Ngọc', avatar: '/Nominees/Best_mem/HC/Hoang Bao Ngoc.webm', teamId: 'hc', teamName: 'Heroes Company', teamLogo: '/team_logo/Heroes.png' },
    { id: 'hc-3', name: 'Thái Thành Tài', avatar: '/Nominees/Best_mem/HC/Thai Thanh Tai.webm', teamId: 'hc', teamName: 'Heroes Company', teamLogo: '/team_logo/Heroes.png' },
    { id: 'hc-4', name: 'Vũ Thanh Trà', avatar: '/Nominees/Best_mem/HC/Vu Thanh Tra.webm', teamId: 'hc', teamName: 'Heroes Company', teamLogo: '/team_logo/Heroes.png' },
    { id: 'hc-5', name: 'Nguyễn Đại Phú', avatar: '/Nominees/Best_mem/HC/Nguyen Dai Phu.webm', teamId: 'hc', teamName: 'Heroes Company', teamLogo: '/team_logo/Heroes.png' }
  ]
};
