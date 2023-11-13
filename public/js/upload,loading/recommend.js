//const toastTrigger = document.getElementById('liveToastBtn')
//const toastLiveExample = document.getElementById('liveToast')
//if (toastTrigger) {
//  toastTrigger.addEventListener('click', () => {
//   const toast = new bootstrap.Toast(toastLiveExample)
//
//    toast.show()
//  })
//}
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import { app } from "../firebase.js";

const auth = getAuth(app)
const toastTrigger = document.getElementById('liveToastBtn');
const toastLiveExample = document.getElementById('liveToast');

if (toastTrigger && toastLiveExample) {
    toastTrigger.addEventListener('click', () => {
        onAuthStateChanged(auth, (user) => {
            const toast = new bootstrap.Toast(toastLiveExample);

            if (user && user.uid) {
                console.log(`Current user ID is ${user.uid}`);
                // user.uid가 존재할 때 처리하는 로직 추가 예정
                toast.show();
            } else {
                //console.log("No user is currently logged in.");
                showToast_notUID("로그인 후 다시 추천 버튼을 눌러주세요.");
            }
        });
    });
}

function showToast_notUID(message) {
    const toastBody = document.getElementById("toastBody");
    if (toastBody) {
        toastBody.textContent = message;
    }

    const liveToast = new bootstrap.Toast(document.getElementById('liveToast'));
    liveToast.show();
}

