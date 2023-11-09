import { updateWebtoonTitle, updateWebtoonDescription, updateWebtoonAuthor, updateWebtoonTag } from './js/upload,loading/updateWebtoonInfo.js';
import { loadSignImages } from './js/upload,loading/imageLoad.js';
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import { app } from "./js/firebase.js";

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const webtoonID = urlParams.get("name");
const auth = getAuth(app);

window.onload = function() {
    updateWebtoonTitle(webtoonID);
    updateWebtoonDescription(webtoonID);
    updateWebtoonAuthor(webtoonID);
    loadSignImages(webtoonID);
    updateWebtoonTag(webtoonID);
    onAuthStateChanged(auth, (user) => {
        if (user) {
          console.log(`Current user ID is ${user.uid}`);
          // user.uid를 사용하여 무언가를 할 수 있습니다.
        } else {
          console.log("No user is currently logged in.");
          // 로그인 페이지로 리다이렉션할 수 있습니다.
        }
      });
};