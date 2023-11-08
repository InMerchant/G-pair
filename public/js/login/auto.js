// auth.js
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "./firebase"; // app을 firebase.js 파일에서 가져옵니다.

const auth = getAuth(app);

let currentUserId = null; // 현재 로그인한 사용자의 UID를 저장할 변수

onAuthStateChanged(auth, (user) => {
  if (user) {
    // 사용자가 로그인한 경우
    currentUserId = user.uid;
    // 필요하다면 다른 처리를 할 수 있습니다.
  } else {
    // 사용자가 로그아웃한 경우
    currentUserId = null;
  }
});

export const getUserId = () => currentUserId;
