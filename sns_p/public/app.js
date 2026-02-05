let postImageBase64 = "";

async function loadPosts() {
    const res = await fetch('/posts');
    const posts = await res.json();
    const postsDiv = document.getElementById('posts');
    
    document.getElementById('mainName').innerText = localStorage.getItem('userName') || "名前変えれます";
    const currentAvatar = localStorage.getItem('userAvatar') || "";
    document.getElementById('mainAvatar').style.backgroundImage = currentAvatar ? `url(${currentAvatar})` : `none`;

    postsDiv.innerHTML = posts.map(p => `
        <div class="post">
            <div class="post-avatar" style="background-image: url(${p.avatar || ''})"></div>
            <div class="post-body">
                <div class="post-header"><strong>${p.name}</strong> <small>・${p.time}</small></div>
                <div style="white-space: pre-wrap;">${escapeHTML(p.text)}</div>
                ${p.postImage ? `<img src="${p.postImage}" class="attached-image">` : ''}
            </div>
            <div class="menu-btn" onclick="toggleMenu('${p.id}')">…</div>
            <div id="menu-${p.id}" class="delete-menu"><button onclick="deletePost('${p.id}')">削除する</button></div>
        </div>
    `).join('');
}

function previewPostImage() {
    const file = document.getElementById('postFileInput').files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
        postImageBase64 = reader.result;
        const img = document.getElementById('postImgPreview');
        img.src = postImageBase64;
        img.style.display = 'block';
    };
    if (file) reader.readAsDataURL(file);
}

async function postMessage(customText = null, customImg = null) {
    const text = customText || document.getElementById('messageInput').value;
    const img = customImg || postImageBase64;
    if (!text.trim() && !img) return;

    await fetch('/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            name: localStorage.getItem('userName') || "名前変えれます",
            avatar: localStorage.getItem('userAvatar') || "",
            text: text,
            postImage: img
        })
    });
    
    if(!customText) {
        document.getElementById('messageInput').value = '';
        document.getElementById('postImgPreview').style.display = 'none';
        postImageBase64 = "";
    }
    loadPosts();
}

function toggleMenu(id) {
    const menu = document.getElementById(`menu-${id}`);
    const isVisible = menu.style.display === 'block';
    document.querySelectorAll('.delete-menu').forEach(m => m.style.display = 'none');
    if (!isVisible) menu.style.display = 'block';
}

async function deletePost(id) {
    if (!confirm("削除しますか？")) return;
    await fetch(`/posts/${id}`, { method: 'DELETE' });
    loadPosts();
}

function escapeHTML(str) {
    return str.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

// 5秒後の初期投稿（人生で1回だけ）
setTimeout(() => {
    if (!localStorage.getItem('hasInitialPost')) {
        postMessage("【機能紹介】プロフィールの写真変えられます！左のボタンから試してみてね。📸");
        localStorage.setItem('hasInitialPost', 'true');
    }
}, 5000);

loadPosts();
