# Firebase 설정 가이드 (단계별)

blog 프로젝트의 데이터(글 목록, 조회수, 관리자 로그인)를 담을 Firebase 프로젝트를 만드는 과정입니다. 이미 Firebase(Google 계정)에 가입하셨다면 1단계부터 진행하면 됩니다. 콘솔에서 클릭하는 부분은 직접 해주셔야 하고, 그 결과(설정값)를 저에게 알려주시면 코드에는 제가 반영합니다.

## 1단계 — Firebase 프로젝트 만들기

1. https://console.firebase.google.com 접속 → **프로젝트 추가**
2. 프로젝트 이름 입력 (예: `giroku-changgo` — "기록 창고"의 영문 표기, 원하는 이름으로 자유롭게)
3. Google Analytics 연결 여부를 물어보면 **사용**으로 켜두기 — sitemap.md에서 방문자 통계를 GA4로 쓰기로 했으므로 여기서 같이 켜는 게 편합니다. 계정은 기본값(신규 만들기)으로 진행.
4. **프로젝트 만들기** 클릭 → 몇 십 초 기다리면 완료.

## 2단계 — Firestore Database 만들기

1. 왼쪽 메뉴 **빌드 > Firestore Database** → **데이터베이스 만들기**
2. **위치(리전)**: `asia-northeast3 (서울)` 선택 — 한 번 정하면 이후 변경 불가능하니 꼭 서울로 선택해주세요.
3. **보안 규칙**: "프로덕션 모드에서 시작"을 선택 (테스트 모드는 30일 후 모든 접근이 막히므로 프로덕션 모드로 시작하는 게 낫습니다. 규칙은 아래 4단계에서 바로 채웁니다.)
4. 생성이 끝나면 **규칙(Rules)** 탭으로 이동해서, 이 저장소의 `firestore.rules` 파일 내용을 그대로 복사해서 붙여넣고 **게시(Publish)** 를 눌러주세요.
   - 이 규칙은 "발행된 글은 누구나 읽을 수 있고, 쓰기는 로그인한 관리자만 가능"하게 되어 있습니다.

## 3단계 — Authentication (관리자 로그인) 설정

1. 왼쪽 메뉴 **빌드 > Authentication** → **시작하기**
2. **Sign-in method** 탭에서 **이메일/비밀번호** 제공업체를 선택하고 **사용 설정** 켜기 → 저장.
3. **Users** 탭 → **사용자 추가** → 관리자로 쓸 이메일/비밀번호를 직접 입력해서 계정을 하나 만듭니다.
   - 이 계정이 나중에 `admin/login.html`에서 로그인할 계정입니다. (일반 "회원가입" 폼은 따로 만들지 않고, 관리자 1명만 콘솔에서 직접 만드는 방식 — 개인 블로그라 이게 제일 간단합니다.)

## 4단계 — 웹 앱 등록 & SDK 설정값 받기

1. 프로젝트 개요 화면(집 모양 아이콘 옆) → **프로젝트 설정**(⚙️) → **일반** 탭 → 아래로 스크롤
2. **내 앱** 섹션에서 **앱 추가** → 플랫폼으로 **웹(`</>` 아이콘)** 선택
3. 앱 닉네임 입력 (예: `blog-web`), Firebase Hosting은 체크 안 해도 됩니다(Vercel 쓸 예정이므로).
4. **앱 등록**을 누르면 아래처럼 `firebaseConfig` 객체가 화면에 나타납니다:
   ```js
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abcdef..."
   };
   ```
5. **이 6개 값을 저에게 그대로 알려주세요.** (이 apiKey는 서버 비밀키가 아니라 클라이언트에 공개되는 식별자라, 실제 보안은 위 2단계의 Firestore 규칙과 3단계의 로그인 계정이 담당합니다 — 붙여넣어도 안전합니다.) 알려주시면 `blog/assets/firebase.js`의 `firebaseConfig`에 바로 반영하겠습니다.

## 5단계 — 코드에 반영 (제가 처리)

받은 값을 아래 파일에 넣습니다 (이미 자리가 만들어져 있습니다):

```
blog/assets/firebase.js
```

반영 후에는 `isFirebaseConfigured`가 자동으로 `true`가 되면서 `index.html`(글 목록), `post.html`(글 상세), `admin/login.html`(로그인)이 목업 대신 실제 Firestore/Auth를 사용하기 시작합니다.

## 6단계 — 동작 확인

1. 로컬에서 `blog/admin/login.html`을 브라우저로 열고, 3단계에서 만든 이메일/비밀번호로 로그인 시도 → `dashboard.html`로 이동하면 성공.
2. Firestore 콘솔의 **데이터** 탭에서 `posts` 컬렉션을 아직 만들지 않았다면, 홈 화면(`index.html`)은 계속 목업 카드를 보여줍니다 (정상 동작 — 문서가 없으면 자동으로 정적 데모 콘텐츠를 유지하도록 만들어 뒀습니다).
3. phase2에서 "새 글 쓰기" 폼을 붙이면 그때부터 `posts` 컬렉션에 실제 글이 쌓이고, 홈/상세 화면이 실데이터로 바뀝니다.

## 참고 — 지금 범위 밖 (다음에 결정)

- Firestore 인덱스: `posts` 컬렉션에 `status`+`createdAt` 복합 색인이 필요합니다. 처음 글 목록을 불러올 때 브라우저 콘솔에 색인 생성 링크가 뜨면 그걸 클릭해서 만들면 됩니다(1~2분 소요, 자동 안내).
- Storage(이미지 업로드), 방문자 통계 GA4 연동은 sitemap.md의 2~3단계에서 진행합니다.
