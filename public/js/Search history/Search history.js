// Firebase Firestore 및 Auth 라이브러리를 로드합니다.
import { db } from '../firebase.js'; // 경로는 실제 설정에 맞게 조정해야 합니다.
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";

const searchButton = document.querySelector('.btn-primary');
const searchInput = document.getElementById('searchQuery');

const auth = getAuth();
const user = auth.currentUser;

searchButton.addEventListener('click', async () => {
    const searchTerm = searchInput.value.trim();
    if (searchTerm && user) {
        // Firestore의 'USER' 컬렉션 내 현재 사용자의 문서 참조
        const userDocRef = doc(db, "USER", user.uid);
        try {
            // Firestore에 검색 기록 저장
            await addDoc(collection(userDocRef, "searchHistory"), {
                query: searchTerm,
                timestamp: serverTimestamp()
            });
            console.log("검색 기록 저장됨:", searchTerm);
        } catch (e) {
            console.error("검색 기록 저장 실패:", e);
        }
    }
});
