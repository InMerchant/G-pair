import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import { app } from "../firebase.js";
import { recommend } from "../recommend.js"

const auth = getAuth(app)
const toastTrigger = document.getElementById('liveToastBtn');
const toastLiveExample = document.getElementById('liveToast');

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const episodeStr = urlParams.get("id");
const webtoonID = urlParams.get("webtoonID");

function extractNumberFromString(str) {
    const matches = str.match(/\d+/); // 숫자가 하나 이상 연속되는 부분을 찾기
    return matches ? parseInt(matches[0], 10) : null; // 찾은 숫자를 정수로 변환
}
const episodeID = extractNumberFromString(episodeStr); // 정수로 변환된 값 저장

if (toastTrigger && toastLiveExample) {
    toastTrigger.addEventListener('click', () => {
        onAuthStateChanged(auth, (user) => {
            const toast = new bootstrap.Toast(toastLiveExample);

            if (user && user.uid) {
                recommend(webtoonID, episodeID, user.uid).then(result => {
                    if (result) {
                        if(result == '1') {
                            showToast("추천 하였습니다.");
                        }
                        else {
                            showToast("추천을 해제했습니다.");
                        }
                    }
                });
                
                
            } else {
                showToast("로그인 후 다시 추천 버튼을 눌러주세요.");
            }
        });
    });
}

function showToast(message) {
    const toastBody = document.getElementById("toastBody");
    if (toastBody) {
        toastBody.textContent = message;
    }

    const liveToast = new bootstrap.Toast(document.getElementById('liveToast'));
    liveToast.show();
}

