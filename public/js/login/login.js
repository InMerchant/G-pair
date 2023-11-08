import { auth } from './firebase.js'; // 경로가 정확한지 확인하세요

function loginUser() {
  const email = document.getElementById('exampleInputEmail').value;
  const password = document.getElementById('exampleInputPassword').value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // 로그인 성공
      const user = userCredential.user;
      // 로그인 후 원하는 페이지로 리다이렉트하거나 사용자에게 알림
      alert("로그인 성공!");
      window.location = 'index.html'; // 또는 대상 페이지
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // 여기서 오류를 처리하세요, 예를 들어 사용자에게 메시지를 표시
      alert(`오류: ${errorMessage}`);
    });
}
