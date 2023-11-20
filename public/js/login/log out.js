
import { signOut } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import { auth } from "../firebase.js"; 
const logoutButton = document.getElementById('logout-button'); // 로그아웃 버튼의 ID로 대체하세요.
logoutButton.addEventListener('click', () => {
  signOut(auth).then(() => {
    // 로그아웃 성공 시 처리
    console.log('User signed out.');
    window.location.href = '/login';
  }).catch((error) => {
    // 로그아웃 실패 시 처리
    console.error('Sign out error', error);
  });
});
