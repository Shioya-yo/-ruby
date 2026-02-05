async function loadPosts() {
    const res = await fetch('/posts');
    const posts = await res.json();
    const postsDiv = document.getElementById('posts');
    postsDiv.innerHTML = posts.map(p => `
        <div class="card">
            <div class="avatar"></div>
            <div>
                <div>
                    <span class="name">${p.name}</span>
                    <span class="handle">${p.handle}</span>
                    <span class="time">・${p.time}</span>
                </div>
                <div class="text">${escapeHTML(p.text)}</div>
                <div class="like-btn" onclick="likePost('${p.id}')">
                    <span>❤️</span> ${p.likes}
                </div>
            </div>
        </div>
    `).join('');
}

async function postMessage() {
    const input = document.getElementById('messageInput');
    if (!input.value.trim()) return;

    await fetch('/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input.value })
    });
    input.value = '';
    loadPosts();
}

async function likePost(id) {
    await fetch(`/posts/${id}/like`, { method: 'POST' });
    loadPosts();
}

function escapeHTML(s) {
    return s.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

window.onload = loadPosts;