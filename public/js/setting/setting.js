import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";

const auth = getAuth();

onAuthStateChanged(auth, (user) => {
  const logoutButton = document.getElementById('logout-button');
  const withdrawalButton = document.getElementById('withdrawal-button'); // ID로 버튼 선택
  const loginButton = document.getElementById('login-button');

  if (user) {
    // 사용자가 로그인한 상태
    if(logoutButton) logoutButton.style.display = 'block';
    if(withdrawalButton) withdrawalButton.style.display = 'block';
    if(loginButton) loginButton.style.display = 'none';
  } else {
    // 사용자가 로그인하지 않은 상태
    if(logoutButton) logoutButton.style.display = 'none';
    if(withdrawalButton) withdrawalButton.style.display = 'none';
    if(loginButton) loginButton.style.display = 'block';
  }
});



document.addEventListener('DOMContentLoaded', function() {
  // 버튼 요소 찾기
  const withdrawalButton = document.getElementById('withdrawal-button');

  // 버튼에 클릭 이벤트 리스너 추가
  withdrawalButton.addEventListener('click', function() {
      // '/Withdrawal' 페이지로 이동
      window.location.href = '/Withdrawal';
  });
});