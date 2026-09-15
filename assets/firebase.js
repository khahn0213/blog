// Firebase 초기화 — 프로젝트 생성 후 아래 firebaseConfig 값을 본인 프로젝트 값으로 교체하세요.
// 값을 얻는 방법: docs/firebase-setup.md 참고 (Firebase 콘솔 > 프로젝트 설정 > 일반 > 내 앱 > SDK 설정 및 구성)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// firebaseConfig가 아직 채워지지 않았는지 판별 (초기 상태에서 페이지가 깨지지 않도록 사용)
export const isFirebaseConfigured = firebaseConfig.apiKey !== "YOUR_API_KEY";

export const app = initializeApp(firebaseConfig);
export const db = isFirebaseConfigured ? getFirestore(app) : null;
export const auth = isFirebaseConfigured ? getAuth(app) : null;
