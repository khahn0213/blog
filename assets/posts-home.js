// 홈 화면 — Firestore에서 발행된 글 목록을 불러와 카드 그리드를 채웁니다.
// firebase.js에 아직 본인 프로젝트 설정을 넣지 않았다면 정적 목업 카드가 그대로 보입니다(점진적 개선 방식).
import { db, isFirebaseConfigured } from "./firebase.js";
import {
  collection, query, where, orderBy, limit, getDocs
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

function escapeHtml(str) {
  return String(str ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

function postCardHtml(post) {
  const title = escapeHtml(post.title);
  const excerpt = escapeHtml(post.excerpt);
  const cat = escapeHtml(post.category);
  const date = escapeHtml(post.dateLabel);
  const read = escapeHtml(post.readLabel);
  const slug = encodeURIComponent(post.slug || post.id);
  return `
    <a class="card card-hover" style="overflow:hidden;display:flex;flex-direction:column;color:inherit" href="post.html?slug=${slug}">
      <div class="thumb-placeholder">thumbnail 16:9</div>
      <div style="padding:20px 20px 22px;display:flex;flex-direction:column;gap:10px;flex:1">
        <span class="cat-badge">${cat}</span>
        <h3 style="font-size:18px;line-height:1.45;font-weight:700">${title}</h3>
        <p style="font-size:14px;line-height:1.65;color:var(--text-muted)">${excerpt}</p>
        <div style="margin-top:auto;padding-top:10px;display:flex;gap:10px;font-size:13px;color:var(--text-faint)">
          <span>${date}</span><span>·</span><span>${read}</span>
        </div>
      </div>
    </a>`;
}

async function loadPosts() {
  const grid = document.getElementById("post-grid");
  if (!grid || !isFirebaseConfigured || !db) return; // 설정 전에는 정적 목업을 그대로 둔다

  try {
    const q = query(
      collection(db, "posts"),
      where("status", "==", "published"),
      orderBy("createdAt", "desc"),
      limit(6)
    );
    const snap = await getDocs(q);
    if (snap.empty) return; // 글이 아직 없으면 목업 유지

    const html = snap.docs.map((d) => {
      const data = d.data();
      return postCardHtml({
        id: d.id,
        slug: data.slug,
        title: data.title,
        excerpt: data.excerpt,
        category: data.category,
        dateLabel: data.dateLabel || "",
        readLabel: data.readLabel || ""
      });
    }).join("");

    grid.innerHTML = html;
    grid.dataset.fallback = "false";
  } catch (err) {
    // Firestore 인덱스 미생성 등으로 실패해도 화면은 정적 목업으로 정상 노출
    console.warn("[기록 창고] 글 목록을 불러오지 못했습니다:", err);
  }
}

loadPosts();
