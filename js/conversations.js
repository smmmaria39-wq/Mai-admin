import { api, escapeHtml, formatDate } from './dashboard.js';
const $ = id => document.getElementById(id);
let conversations = [];

export async function loadConversations() {
    const body = $('conversationTable');
    body.innerHTML = '<tr><td colspan="5" class="empty">Loading...</td></tr>';
    try {
        const response = await api('/maria-ai/admin/conversations');
        conversations = Array.isArray(response.data) ? response.data : [];
        body.innerHTML = conversations.length ? conversations.map(item => `
            <tr>
                <td><button class="table-action" data-conversation="${escapeHtml(item.id)}">${escapeHtml(item.title || 'Untitled conversation')}</button></td>
                <td>${escapeHtml(item.userId || '—')}</td>
                <td>${item.messageCount ?? 0}</td>
                <td>${formatDate(item.createdAt)}</td>
                <td>${formatDate(item.updatedAt)}</td>
            </tr>
        `).join('') : '<tr><td colspan="5" class="empty">No saved conversations found.</td></tr>';
        document.querySelectorAll('[data-conversation]').forEach(button => {
            button.onclick = () => showConversation(button.dataset.conversation);
        });
    } catch (error) {
        body.innerHTML = `<tr><td colspan="5" class="empty">${escapeHtml(error.message)}</td></tr>`;
    }
}

async function showConversation(id) {
    const summary = conversations.find(item => item.id === id);
    $('conversationDetail').classList.remove('hidden');
    $('detailTitle').textContent = summary?.title || 'Conversation';
    $('detailMeta').textContent = `User: ${summary?.userId || '—'} · Created: ${formatDate(summary?.createdAt)}`;
    $('messageList').innerHTML = '<p class="muted">Loading messages...</p>';
    try {
        const response = await api(`/maria-ai/admin/conversations/${encodeURIComponent(id)}`);
        const item = response.data || {};
        const messages = Array.isArray(item.messages) ? item.messages : [];
        $('detailTitle').textContent = item.title || summary?.title || 'Conversation';
        $('detailMeta').textContent = `User: ${item.userId || '—'} · Created: ${formatDate(item.createdAt)}`;
        $('messageList').innerHTML = messages.length ? messages.map(message => `
            <article class="message-item">
                <div class="message-item__header"><strong>${escapeHtml(message.role || 'message')}</strong><small>${formatDate(message.createdAt)}</small></div>
                <p>${escapeHtml(message.content || '')}</p>
            </article>
        `).join('') : '<p class="muted">This conversation has no saved messages.</p>';
    } catch (error) {
        $('messageList').innerHTML = `<p class="muted">${escapeHtml(error.message)}</p>`;
    }
}

export function initConversations() {
    $('refreshConversations').onclick = loadConversations;
    $('closeConversationDetail').onclick = () => $('conversationDetail').classList.add('hidden');
}
