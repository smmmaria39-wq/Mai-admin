import { initKnowledge, loadKnowledge } from './knowledge.js';
import { initUploads } from './uploads.js';
import { initConversations, loadConversations } from './conversations.js';
import { initAnalytics, loadAnalytics } from './analytics.js';
import { initSettings } from './settings.js';

const DEFAULT_API = 'https://ai-assistant-production-3804f48e.up.railway.app/api/v1';
const LEGACY_API = 'https://smmmaria-backend-production-4513.up.railway.app/api/v1';
const savedApi = localStorage.getItem('maria_admin_api_base');
if (!savedApi || savedApi.replace(/\/+$/, '') === LEGACY_API) {
  localStorage.setItem('maria_admin_api_base', DEFAULT_API);
}
export const API_BASE = (localStorage.getItem('maria_admin_api_base') || DEFAULT_API).replace(/\/+$/, '');
const TOKEN_KEY = 'maria_ai_admin_token';
export const getToken = () => sessionStorage.getItem(TOKEN_KEY);
export async function api(path, options = {}) {
  const headers = { ...(options.body ? {'Content-Type':'application/json'} : {}), ...(options.headers || {}) };
  if (getToken()) headers.Authorization = `Bearer ${getToken()}`;
  let response;
  try { response = await fetch(`${(localStorage.getItem('maria_admin_api_base') || DEFAULT_API).replace(/\/$/, '')}${path}`, { ...options, headers }); }
  catch { throw new Error('Could not reach the backend. Check the API URL, network and CORS settings.'); }
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.success === false) {
    if (response.status === 401 && !path.endsWith('/login')) sessionStorage.removeItem(TOKEN_KEY);
    throw new Error(payload.message || `Request failed (${response.status}).`);
  }
  return payload;
}
export function toast(message) { const el=document.getElementById('toast'); el.textContent=message; el.classList.add('show'); clearTimeout(toast.timer); toast.timer=setTimeout(()=>el.classList.remove('show'),3000); }
export function escapeHtml(value='') { return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
export function formatDate(value) { if(!value)return '—'; const n=Number(value); const d=new Date(n>0&&n<1e12?n*1000:n); return Number.isNaN(d.getTime())?'—':d.toLocaleString(); }
function showApp(admin={}) { document.getElementById('loginView').classList.add('hidden'); document.getElementById('appView').classList.remove('hidden'); document.getElementById('adminName').textContent=admin.username||'Administrator'; }
function showLogin() { sessionStorage.removeItem(TOKEN_KEY); document.getElementById('appView').classList.add('hidden'); document.getElementById('loginView').classList.remove('hidden'); }
function navigate(page) { document.querySelectorAll('.page').forEach(x=>x.classList.toggle('active',x.id===`page-${page}`)); document.querySelectorAll('.nav-link').forEach(x=>x.classList.toggle('active',x.dataset.page===page)); const labels={dashboard:'Overview',knowledge:'Knowledge base',uploads:'Media & links',conversations:'Conversations',analytics:'Analytics',settings:'Settings'}; document.getElementById('pageTitle').textContent=labels[page]||'Overview'; document.getElementById('sidebar').classList.remove('open'); if(page==='dashboard')loadDashboard(); if(page==='knowledge')loadKnowledge(); if(page==='conversations')loadConversations(); if(page==='analytics')loadAnalytics(); }
async function loadDashboard(){try{const r=await api('/maria-ai/admin/dashboard');const d=r.data||{};document.getElementById('statKnowledge').textContent=d.knowledgeCount??0;document.getElementById('statPublished').textContent=d.publishedCount??0;document.getElementById('statConversations').textContent=d.conversationCount??0;document.getElementById('statUnanswered').textContent=d.unansweredCount??'Not tracked';}catch(e){notice(e.message);}}
function notice(message){const n=document.getElementById('globalNotice');n.textContent=message;n.classList.remove('hidden');}
function initNavigation(){document.querySelectorAll('.nav-link').forEach(b=>b.addEventListener('click',()=>navigate(b.dataset.page)));document.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>navigate(b.dataset.go)));document.getElementById('menuButton').addEventListener('click',()=>document.getElementById('sidebar').classList.toggle('open'));document.getElementById('logoutButton').addEventListener('click',showLogin);document.getElementById('refreshDashboard').addEventListener('click',loadDashboard);}
function initLogin(){document.getElementById('loginForm').addEventListener('submit',async e=>{e.preventDefault();const btn=document.getElementById('loginButton'),err=document.getElementById('loginError');btn.disabled=true;btn.textContent='Signing in…';err.textContent='';try{const r=await api('/maria-ai/admin/login',{method:'POST',body:JSON.stringify({username:document.getElementById('adminUsername').value.trim(),password:document.getElementById('adminPassword').value})});if(!r.token)throw new Error('The backend did not return an admin token.');sessionStorage.setItem(TOKEN_KEY,r.token);showApp(r.admin);navigate('dashboard');toast('Welcome to Maria AI Admin');}catch(x){err.textContent=x.message;}finally{btn.disabled=false;btn.textContent='Sign in';}});}
initNavigation();initLogin();initKnowledge();initUploads();initConversations();initAnalytics();initSettings();
if(getToken()){showApp({username:'Administrator'});navigate('dashboard');}
