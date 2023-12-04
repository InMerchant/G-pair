// record.js

import { db } from '../firebase.js'; 
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, serverTimestamp, orderBy } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js"; // orderBy 추가


const auth = getAuth();
onAuthStateChanged(auth, user => {
    if (user) {
        loadSearchHistory(user.uid);
    } else {
        // 사용자가 로그인하지 않았을 때의 처리
        console.log("사용자가 로그인하지 않았습니다.");
    }
});

async function deleteSearchHistoryItem(historyId, userId) {
    try {
        await deleteDoc(doc(db, "USER", userId, "searchHistory", historyId));
        console.log("검색 기록 삭제됨:", historyId);
        loadSearchHistory(userId); // 목록 새로고침
    } catch (e) {
        console.error("검색 기록 삭제 실패:", e);
    }
}

// 검색 기록 불러오기 함수 (수정됨)
async function loadSearchHistory(userId) {
    const searchHistoryRef = collection(db, "USER", userId, "searchHistory");
    const q = query(searchHistoryRef, orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);
    const historyList = document.getElementById("searchHistoryList");
    historyList.innerHTML = ''; // 목록 초기화

    if (querySnapshot.empty) {
        // 검색 기록이 없는 경우
        const noHistoryItem = document.createElement("li");
        noHistoryItem.textContent = "검색 기록이 없습니다.";
        historyList.appendChild(noHistoryItem);
    } else {
        // 검색 기록이 있는 경우
        querySnapshot.forEach((doc) => {
            const historyItem = document.createElement("li");
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "삭제";
            deleteButton.classList.add("btn", "btn-danger", "btn-sm");
            deleteButton.onclick = () => deleteSearchHistoryItem(doc.id, userId);

            historyItem.textContent = doc.data().query + " ";
            historyItem.appendChild(deleteButton);
            historyList.appendChild(historyItem);
        });
    }
}

async function clearSearchHistory() {
    const user = auth.currentUser;
    if (user) {
        const searchHistoryRef = collection(db, "USER", user.uid, "searchHistory");
        const querySnapshot = await getDocs(searchHistoryRef);
        querySnapshot.forEach(async (doc) => {
            await deleteDoc(doc.ref);
        });
        console.log("검색 기록 전체 삭제됨");
        window.location.href = '/record';

    }
}

// 검색 기록 전체 삭제 버튼에 이벤트 리스너 추가
document.getElementById("clearSearchHistoryButton").addEventListener("click", clearSearchHistory);