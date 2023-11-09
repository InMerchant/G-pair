

import { auth } from '../firebase.js'; // 경로는 실제 상황에 맞게 조정해야 합니다.
import { db } from '../firebase.js'; // 경로는 실제 상황에 맞게 조정해야 합니다.
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

function registerUser(email, password) {
  createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      // 회원가입 성공
      const user = userCredential.user;
      console.log(`New user created: ${user.email}`);

      // Firestore USER 컬렉션에 문서 생성
      const userDocRef = doc(db, "USER", user.uid);
      await setDoc(userDocRef, {
        email: user.email,
        // 여기에 추가로 저장할 필드를 넣을 수 있습니다.
      });

      // 회원가입 성공 후 페이지 리다이렉션, 예: 로그인 페이지로 이동
      window.location.href = 'login.html';
    })
    .catch((error) => {
      // 회원가입 실패
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(`Error ${errorCode}: ${errorMessage}`);
      // 사용자에게 회원가입 실패 메시지 표시
      alert('회원가입 실패: ' + errorMessage);
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
  alert('비밀번호가 일치하지 않습니다.');
  return;
}

registerUser(email, password);
});