import { getEpisodeDocData, getEpisodeData } from "./search_collection/episodeSearch.js"
import { getDoc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

export async function randomMakeUserUID(webtoonID, episodeID, userUID) {
    console.log(userUID);
    try {
        const episodeDocRef = await getEpisodeDocData(webtoonID, episodeID);
        const episodeDoc = await getDoc(episodeDocRef);

        if (episodeDoc.exists()) {
            const data = episodeDoc.data();
            let readUsers = data.readUser || []; // 기존 readUser 배열 가져오기 또는 새 배열 생성

            readUsers.push(userUID); // 중복된 값을 포함하여 userUID 추가

            await updateDoc(episodeDocRef, {
                readUser: readUsers // 업데이트된 배열로 문서 업데이트
            });
        }
    } catch (error) {
        console.error("Error updating document: ", error);
    }
}