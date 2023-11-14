import { db } from '../firebase.js'; // 경로는 실제 설정에 맞게 조정해야 합니다.
import { collection, addDoc, serverTimestamp, doc } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";

// ... 나머지 코드는 동일합니다 ...
const searchButton = document.querySelector('.btn-primary');
const searchInput = document.getElementById('searchQuery');
const auth = getAuth();

// 현재 로그인 상태 확인
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("현재 로그인한 사용자:", user.uid);

        // 검색 버튼 이벤트 리스너
        searchButton.addEventListener('click', async () => {
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                try {
                    // Firestore의 'USER' 컬렉션 내 현재 사용자의 문서 참조
                    const userDocRef = doc(db, "USER", user.uid);
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
    } else {
        console.log("사용자가 로그인하지 않았습니다.");
    }
});
