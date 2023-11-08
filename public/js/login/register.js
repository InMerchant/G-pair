

import { auth } from '../firebase.js'; // 경로는 실제 상황에 맞게 조정해야 합니다.
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";

// 회원가입 함수
function registerUser(email, password) {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // 회원가입 성공
        const user = userCredential.user;
        console.log(`New user created: ${user.email}`);
        // 회원가입 성공 후 페이지 리다이렉션, 예: 로그인 페이지로 이동
        window.location.href = 'login.html';
      })
      .catch((error) => {
        // 회원가입 실패
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(`Error ${errorCode}: ${errorMessage}`);
        // 사용자에게 회원가입 실패 메시지 표시
        alert('Registration failed: ' + errorMessage);
      });
  }
  
  // 이벤트 리스너: 회원가입 폼 제출
  document.querySelector('.user').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('exampleInputEmail').value;
    const password = document.getElementById('exampleInputPassword').value;
    const repeatPassword = document.getElementById('exampleRepeatPassword').value;
  
    // 비밀번호 확인
    if(password !== repeatPassword) {
      alert('Passwords do not match.');
      return;
    }
  
    registerUser(email, password);
  });
  