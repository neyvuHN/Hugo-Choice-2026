import { TEAMS, BEST_EVENTS } from '../data/mockData';
import { getAllMembers, ClubMember } from '../data/membersData';

export function getResolvedTeam(teamId: string | null) {
  if (!teamId) return null;
  return TEAMS.find(t => t.id === teamId || t.name === teamId) || null;
}

export function getResolvedTeamName(teamId: string | null, fallback = 'N/A'): string {
  const teamObj = getResolvedTeam(teamId);
  return teamObj ? `${teamObj.icon} ${teamObj.name}` : (teamId || fallback);
}

export function getMemberByIdOrName(val: string | null): ClubMember | null {
  if (!val) return null;
  return getAllMembers().find(m => m.id === val || m.name === val) || null;
}

export function getResolvedBestMemberName(val: string[] | string | null, fallback = 'Incomplete (1 required)'): string {
  if (!val) return fallback;
  const arr = Array.isArray(val) ? val : [val];
  if (arr.length === 0) return fallback;
  return arr.map(id => {
    const mem = getMemberByIdOrName(id);
    return mem ? mem.name : id;
  }).join(', ');
}

export function getResolvedBestMemberArray(val: string[] | string | null): string[] {
  if (!val) return [];
  const arr = Array.isArray(val) ? val : [val];
  return arr.map(id => {
    const mem = getMemberByIdOrName(id);
    return mem ? mem.name : id;
  });
}

export function getResolvedEvent(eventId: string | null) {
  if (!eventId) return null;
  return BEST_EVENTS.find(e => e.id === eventId || e.name === eventId) || null;
}

export function getResolvedEventName(val: string[] | string | null, fallback = 'Incomplete (1 required)'): string {
  if (!val) return fallback;
  const arr = Array.isArray(val) ? val : [val];
  if (arr.length === 0) return fallback;
  return arr.map(id => {
    const eventObj = getResolvedEvent(id);
    return eventObj ? `${eventObj.icon} ${eventObj.name}` : id;
  }).join(', ');
}

export function getResolvedEventArray(val: string[] | string | null): string[] {
  if (!val) return [];
  const arr = Array.isArray(val) ? val : [val];
  return arr.map(id => {
    const eventObj = getResolvedEvent(id);
    return eventObj ? `${eventObj.icon} ${eventObj.name}` : id;
  });
}

export function getResolvedRookieName(val: string[] | string | null, fallback = 'Incomplete (1 required)'): string {
  if (!val) return fallback;
  const arr = Array.isArray(val) ? val : [val];
  if (arr.length === 0) return fallback;
  return arr.map(id => {
    const mem = getMemberByIdOrName(id);
    return mem ? mem.name : id;
  }).join(', ');
}

export function getResolvedRookieArray(val: string[] | string | null): string[] {
  if (!val) return [];
  const arr = Array.isArray(val) ? val : [val];
  return arr.map(id => {
    const mem = getMemberByIdOrName(id);
    return mem ? mem.name : id;
  });
}

export function getResolvedDuoName(val: string[] | string | null, fallback = 'Incomplete (1 required)'): string {
  if (!val) return fallback;
  const arr = Array.isArray(val) ? val : [val];
  if (arr.length === 0) return fallback;
  return arr.map(singleDuo => {
    const parts = singleDuo.split(/\s*&\s*/);
    if (parts.length >= 2) {
      const memA = getMemberByIdOrName(parts[0]);
      const memB = getMemberByIdOrName(parts[1]);
      const nameA = memA ? memA.name : parts[0];
      const nameB = memB ? memB.name : parts[1];
      return `${nameA} & ${nameB}`;
    }
    const singleMem = getMemberByIdOrName(singleDuo);
    return singleMem ? singleMem.name : singleDuo;
  }).join('  |  ');
}

export function getResolvedDuoArray(val: string[] | string | null): string[] {
  if (!val) return [];
  const arr = Array.isArray(val) ? val : [val];
  return arr.map(singleDuo => {
    const parts = singleDuo.split(/\s*&\s*/);
    if (parts.length >= 2) {
      const memA = getMemberByIdOrName(parts[0]);
      const memB = getMemberByIdOrName(parts[1]);
      const nameA = memA ? memA.name : parts[0];
      const nameB = memB ? memB.name : parts[1];
      return `${nameA} & ${nameB}`;
    }
    const singleMem = getMemberByIdOrName(singleDuo);
    return singleMem ? singleMem.name : singleDuo;
  });
}
