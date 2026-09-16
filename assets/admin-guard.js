// 관리자 화면 공통 가드 — 로그인 안 된 상태면 로그인 페이지로 보내고, 로그아웃 버튼을 연결합니다.
// firebase.js 설정 전(개발 중)에는 가드를 건너뛰어 화면을 계속 볼 수 있게 합니다.
import { auth, isFirebaseConfigured } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

function loginPath() {
  return window.location.pathname.includes("/am/posts/") ? "../login.html" : "login.html";
}

if (isFirebaseConfigured && auth) {
  onAuthStateChanged(auth, (user) => {
    if (!user) window.location.href = loginPath();
  });

  document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("logout-btn");
    if (btn) {
      btn.addEventListener("click", async () => {
        await signOut(auth);
        window.location.href = loginPath();
      });
    }
  });
} else {
  console.warn("[기록 창고 admin] Firebase가 아직 설정되지 않아 로그인 가드를 건너뜁니다 (assets/firebase.js 확인).");
}
