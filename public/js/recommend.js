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
        return "0";
    } else {
        // 추천하지 않았다면 추천 추가
        await updateDoc(episodeDocRef, {
            recommend: increment(1),
            userUIDs: arrayUnion(userUID)
        });
        return "1";
    }
}