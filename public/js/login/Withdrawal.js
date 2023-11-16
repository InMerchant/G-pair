
import { auth } from '../firebase.js'; // 실제 경로로 변경해주세요.
import { db } from '../firebase.js'; // 실제 경로로 변경해주세요.
import { deleteUser, reauthenticateWithCredential, EmailAuthProvider } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import { doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

document.getElementById('loginForm').addEventListener('submit', (e) => {
  e.preventDefault();

  // 사용자가 입력한 이메일과 비밀번호를 가져옵니다.
  const email = document.getElementById('exampleInputEmail').value;
  const password = document.getElementById('exampleInputPassword').value;

  // 현재 로그인한 사용자를 가져옵니다.
  const user = auth.currentUser;

  if (user && user.email === email) {
    // 사용자를 재인증합니다.
    const credential = EmailAuthProvider.credential(email, password);
    reauthenticateWithCredential(user, credential)
      .then(() => {
        // Firestore에서 사용자 데이터를 삭제합니다.
        deleteDoc(doc(db, "USER", user.uid))
          .then(() => {
            console.log("User data deleted from Firestore.");

            // Authentication에서 사용자를 삭제합니다.
            deleteUser(user)
              .then(() => {
                console.log("User deleted from Authentication.");
                alert("회원 탈퇴가 완료되었습니다.");
                window.location.href = 'index.html'; // 메인 페이지로 리다이렉션
              })
              .catch((error) => {
                console.error("Error deleting user from Authentication: ", error);
                alert("인증 시스템에서 사용자를 삭제하는 데 실패했습니다.");
              });
          })
          .catch((error) => {
            console.error("Error deleting user data from Firestore: ", error);
            alert("Firestore에서 사용자 데이터를 삭제하는 데 실패했습니다.");
          });
      })
      .catch((error) => {
        console.error("User re-authentication failed: ", error);
        alert("사용자 재인증 실패: " + error.message);
      });
  } else {
    alert("로그인 정보가 올바르지 않습니다.");
  }
});


