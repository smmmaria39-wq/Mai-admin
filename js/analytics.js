import { api } from './dashboard.js';
const $=id=>document.getElementById(id);
export async function loadAnalytics(){try{const r=await api('/maria-ai/admin/dashboard'),d=r.data||{};$('analyticsKnowledge').textContent=d.knowledgeCount??0;$('analyticsPublished').textContent=d.publishedCount??0;$('analyticsConversations').textContent=d.conversationCount??0;$('analyticsUnanswered').textContent=d.unansweredCount??'Not tracked';}catch(e){$('analyticsKnowledge').textContent='—';$('analyticsPublished').textContent='—';$('analyticsConversations').textContent='—';$('analyticsUnanswered').textContent='Unavailable';}}
export function initAnalytics(){$('refreshAnalytics').onclick=loadAnalytics;}
