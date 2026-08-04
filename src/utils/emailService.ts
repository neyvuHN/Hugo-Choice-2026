import emailjs from '@emailjs/browser';
import { VotingState } from '../types';
import { EMAIL_TEMPLATE_CONFIG } from '../config/emailTemplateConfig';
import {
  getResolvedTeamName,
  getResolvedBestMemberName,
  getResolvedEventName,
  getResolvedRookieName,
  getResolvedDuoName
} from './ballotHelpers';

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

export interface AutoEmailResult {
  success: boolean;
  message: string;
}

export async function sendBallotEmailAuto(votingState: VotingState): Promise<AutoEmailResult> {
  const targetEmail = votingState.userEmail;
  const userName = votingState.userName || 'Member';

  if (!targetEmail) {
    return {
      success: false,
      message: 'Missing Email/Gmail information for auto-sending.'
    };
  }

  const submittedDate = votingState.submittedAt
    ? new Date(votingState.submittedAt).toLocaleString('vi-VN')
    : new Date().toLocaleString('vi-VN');

  const ballotPayload = {
    userEmail: targetEmail,
    userName: userName,
    emailConfig: EMAIL_TEMPLATE_CONFIG,
    ballot: {
      team: getResolvedTeamName(votingState.selectedTeam),
      member: getResolvedBestMemberName(votingState.selectedBestMember),
      event: getResolvedEventName(votingState.selectedBestEvent),
      rookie: getResolvedRookieName(votingState.selectedRookie),
      duo: getResolvedDuoName(votingState.selectedDuo),
      submittedAt: votingState.submittedAt || new Date().toISOString()
    }
  };

  // 1. Direct System Backend Email via /api/send-email (if backend server is active)
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ballotPayload)
    });

    const contentType = response.headers.get('content-type') || '';
    if (response.ok && contentType.includes('application/json')) {
      const data = await response.json();
      recordSentEmailLog(targetEmail, votingState);
      return {
        success: true,
        message: `✉️ Confirmation email automatically sent to ${targetEmail}!`
      };
    }
  } catch (err) {
    console.warn('Backend endpoint notice, switching to EmailJS:', err);
  }

  // 2. EmailJS sending
  if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY) {
    try {
      emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

      const templateParams = {
        to_email: targetEmail,
        to_name: userName,
        user_name: userName,
        user_email: targetEmail,
        reply_to: targetEmail,
        email: targetEmail,
        name: userName,
        message: `KẾT QUẢ BÌNH CHỌN HUGO AWARD 2026:
• Best Team: ${ballotPayload.ballot.team}
• Best Member: ${ballotPayload.ballot.member}
• Best Event: ${ballotPayload.ballot.event}
• Best Rookie: ${ballotPayload.ballot.rookie}
• Perfect Duo: ${ballotPayload.ballot.duo}`,
        submitted_at: submittedDate,
        intro_heading: EMAIL_TEMPLATE_CONFIG.introHeading,
        intro_message: EMAIL_TEMPLATE_CONFIG.introMessage,
        footer_note: EMAIL_TEMPLATE_CONFIG.footerNote,
        club_signature: EMAIL_TEMPLATE_CONFIG.clubSignature,
        selected_team: ballotPayload.ballot.team,
        selected_member: ballotPayload.ballot.member,
        selected_event: ballotPayload.ballot.event,
        selected_rookie: ballotPayload.ballot.rookie,
        selected_duo: ballotPayload.ballot.duo,
        team: ballotPayload.ballot.team,
        member: ballotPayload.ballot.member,
        event: ballotPayload.ballot.event,
        rookie: ballotPayload.ballot.rookie,
        duo: ballotPayload.ballot.duo
      };

      const result = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        { publicKey: EMAILJS_PUBLIC_KEY }
      );

      console.log('✅ EmailJS success:', result.status, result.text);
      recordSentEmailLog(targetEmail, votingState);
      return {
        success: true,
        message: `✉️ Confirmation email sent to ${targetEmail} successfully!`
      };
    } catch (err: any) {
      console.error('❌ EmailJS send error:', err);
      return {
        success: false,
        message: `⚠️ EmailJS error (${err?.text || err?.message || 'Failed to send email'}). Please check EmailJS Service/Template settings!`
      };
    }
  } else {
    console.warn('⚠️ Missing EmailJS Environment Variables:', {
      hasServiceId: !!EMAILJS_SERVICE_ID,
      hasTemplateId: !!EMAILJS_TEMPLATE_ID,
      hasPublicKey: !!EMAILJS_PUBLIC_KEY
    });
  }

  recordSentEmailLog(targetEmail, votingState);
  return {
    success: false,
    message: `⚠️ Missing EmailJS environment variables configuration (VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, VITE_EMAILJS_PUBLIC_KEY)!`
  };
}

function recordSentEmailLog(email: string, state: VotingState) {
  try {
    const raw = localStorage.getItem('hugo_sent_email_logs');
    const logs = raw ? JSON.parse(raw) : [];
    logs.push({
      email,
      userName: state.userName,
      sentAt: new Date().toISOString(),
      ballot: {
        team: state.selectedTeam,
        member: state.selectedBestMember,
        event: state.selectedBestEvent,
        rookie: state.selectedRookie,
        duo: state.selectedDuo
      }
    });
    localStorage.setItem('hugo_sent_email_logs', JSON.stringify(logs));
  } catch (e) {
    console.error('Failed to log sent email', e);
  }
}
