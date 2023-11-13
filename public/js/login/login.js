import { auth } from '../firebase.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";

// 로그인 함수
function loginUser(email, password) {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // 로그인 성공
      const user = userCredential.user;
      // 로그인 후 처리할 코드
      console.log(`Logged in as: ${user.email}`);
      // 로그인 성공 후 페이지 리다이렉션
      window.location.href = '/'; // 로그인 후 이동할 페이지
    })
    .catch((error) => {
      // 로그인 실패
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(`Error ${errorCode}: ${errorMessage}`);
      // 사용자에게 로그인 실패 메시지 표시
      alert('Login failed: ' + errorMessage);
    });
}

// 이벤트 리스너: 로그인 폼 제출
document.querySelector('.user').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('exampleInputEmail').value;
  const password = document.getElementById('exampleInputPassword').value;
  loginUser(email, password);
});
