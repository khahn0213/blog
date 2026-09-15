// 게시글 상세 — URL의 ?slug= 값으로 Firestore에서 글을 찾아 렌더링합니다.
// slug가 없거나 Firebase 설정 전이거나 문서를 찾지 못하면 정적 샘플 글이 그대로 보입니다.
import { db, isFirebaseConfigured } from "./firebase.js";
import {
  collection, query, where, limit, getDocs
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

function escapeHtml(str) {
  return String(str ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

// 본문은 아직 마크다운 에디터가 없는 1단계이므로, 빈 줄 기준으로 문단만 나눠 렌더링합니다.
// (리치 텍스트/코드 블록은 2단계에서 마크다운 에디터를 붙일 때 고도화합니다 — docs/firebase-setup.md 참고)
function bodyToHtml(body) {
  return String(body ?? "")
    .split(/\n{2,}/)
    .map((para) => `<p style="margin:0 0 22px">${escapeHtml(para).replace(/\n/g, "<br>")}</p>`)
    .join("");
}

async function loadPost() {
  const slug = new URLSearchParams(window.location.search).get("slug");
  if (!slug || !isFirebaseConfigured || !db) return;

  try {
    const q = query(collection(db, "posts"), where("slug", "==", slug), limit(1));
    const snap = await getDocs(q);
    if (snap.empty) return; // 못 찾으면 정적 샘플 유지

    const data = snap.docs[0].data();

    const catEl = document.getElementById("post-cat-badge");
    if (catEl) catEl.textContent = data.category || "";

    const titleEl = document.getElementById("post-title");
    if (titleEl) titleEl.textContent = data.title || "";

    const metaEl = document.getElementById("post-meta");
    if (metaEl) {
      const parts = [data.dateLabel, data.readLabel, data.viewsLabel ? `조회 ${data.viewsLabel}` : null]
        .filter(Boolean);
      metaEl.textContent = parts.join(" · ");
    }

    document.title = `${data.title || "게시글"} — 기록 창고`;

    const sectionsEl = document.getElementById("post-dynamic-sections");
    if (sectionsEl) {
      sectionsEl.innerHTML = bodyToHtml(data.body);
    }
  } catch (err) {
    console.warn("[기록 창고] 게시글을 불러오지 못했습니다:", err);
  }
}

loadPost();
