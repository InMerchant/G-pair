import { getEpisodeDocData, getEpisodeData } from "./search_collection/episodeSearch.js"
import { getDoc, updateDoc, increment, arrayUnion, arrayRemove } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

export async function recommend(webtoonID, episodeID, userUID) {
    const episodeDocRef = await getEpisodeDocData(webtoonID, episodeID);

    const episodeDoc = await getDoc(episodeDocRef);
    if (!episodeDoc.exists()) {
        console.log("Document does not exist!");
        return "0";
    }

    const data = episodeDoc.data();

    // 사용자가 이미 추천을 했는지 확인
    if (data.userUIDs && data.userUIDs.includes(userUID)) {
        // 이미 추천한 경우, 추천 취소
        await updateDoc(episodeDocRef, {
            recommend: increment(-1),
            userUIDs: arrayRemove(userUID)
        });
        // 추천 수 업데이트 후, 웹 페이지의 추천 수를 업데이트
        updateRecommendCountOnWebPage(episodeDocRef);

        return "0";
    } else {
        // 추천하지 않았다면 추천 추가
        await updateDoc(episodeDocRef, {
            recommend: increment(1),
            userUIDs: arrayUnion(userUID)
        });
        // 추천 수 업데이트 후, 웹 페이지의 추천 수를 업데이트
        updateRecommendCountOnWebPage(episodeDocRef);

        return "1";
    }
}

async function updateRecommendCountOnWebPage(episodeDocRef) {
    const updatedDoc = await getDoc(episodeDocRef);
    if (updatedDoc.exists()) {
        const updatedData = updatedDoc.data();
        const recommendCount = updatedData.recommend || 0;
        document.getElementById("recommendCount").textContent = recommendCount;
    }
}
