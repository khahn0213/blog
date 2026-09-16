// Firebase 초기화 — 프로젝트: edu-ax
// 값을 다시 확인/변경하려면: Firebase 콘솔 > 프로젝트 설정 > 일반 > 내 앱 > SDK 설정 및 구성
// (CDN에서 바로 불러오는 방식이라 npm install/번들러 없이 정적 HTML에서 그대로 동작합니다)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { getAnalytics, isSupported as isAnalyticsSupported } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-analytics.js";

export const firebaseConfig = {
  apiKey: "AIzaSyDjKq_AxdwKHqYf2Z7XpfBOHqoB8Pd1MBM",
  authDomain: "edu-ax.firebaseapp.com",
  projectId: "edu-ax",
  storageBucket: "edu-ax.firebasestorage.app",
  messagingSenderId: "271208552092",
  appId: "1:271208552092:web:4865195bb1840e5a437f59",
  measurementId: "G-5P2X2EZMQH"
};

// firebaseConfig가 아직 채워지지 않았는지 판별 (초기 상태에서 페이지가 깨지지 않도록 사용)
export const isFirebaseConfigured = firebaseConfig.apiKey !== "YOUR_API_KEY";

export const app = initializeApp(firebaseConfig);
export const db = isFirebaseConfigured ? getFirestore(app) : null;
export const auth = isFirebaseConfigured ? getAuth(app) : null;

// GA4 방문자 통계 — sitemap.md 3단계 항목이라 지금은 초기화만 해두고, 대시보드 연동은 나중에 진행합니다.
export let analytics = null;
if (isFirebaseConfigured) {
  isAnalyticsSupported().then((ok) => {
    if (ok) analytics = getAnalytics(app);
  });
}
