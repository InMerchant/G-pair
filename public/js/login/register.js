// register.js

import { auth } from '../firebase.js'; // 경로는 실제 상황에 맞게 조정해야 합니다.
import { db } from '../firebase.js'; // 경로는 실제 상황에 맞게 조정해야 합니다.
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

// 회원가입 함수
function registerUser(email, password, gender, ageGroup) {
  createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      // 회원가입 성공
      const user = userCredential.user;
      console.log(`New user created: ${user.email}`);

      // Firestore USER 컬렉션에 문서 생성
      const userDocRef = doc(db, "USER", user.uid);
      await setDoc(userDocRef, {
        email: user.email,
        gender: gender, // 성별 데이터 추가
        ageGroup: ageGroup, // 연령대 데이터 추가
      });

      // 회원가입 성공 후 로그인 페이지로 리다이렉션
      window.location.href = '/login';
    })
    .catch((error) => {
      // 회원가입 실패 시 오류 메시지 표시
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(`Error ${errorCode}: ${errorMessage}`);
      alert('회원가입 실패: ' + errorMessage);
    });
}

// 이벤트 리스너: 회원가입 폼 제출
document.querySelector('.user').addEventListener('submit', (e) => {
  e.preventDefault();

  // 입력 필드에서 이메일, 비밀번호, 비밀번호 확인 값을 가져옵니다.
  const email = document.getElementById('exampleInputEmail').value;
  const password = document.getElementById('exampleInputPassword').value;
  const repeatPassword = document.getElementById('exampleRepeatPassword').value;

  // 성별 라디오 버튼이 선택되었는지 확인합니다.
  const genderRadio = document.querySelector('input[name="gender"]:checked');
  const gender = genderRadio ? genderRadio.value : null;
  const ageGroup = document.getElementById('ageGroup').value;

  // 비밀번호 확인
  if (password !== repeatPassword) {
    alert('비밀번호가 일치하지 않습니다.');
    return;
  }

  // 성별 확인
  if (!gender) {
    alert('성별을 선택해 주세요.');
    return;
  }

  // 회원가입 함수를 호출하여 사용자를 등록합니다.
  registerUser(email, password, gender, ageGroup);
});
