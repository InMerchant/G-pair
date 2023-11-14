import { getEpisodeDocData, getEpisodeData } from "./search_collection/episodeSearch.js"
import { getDoc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

export async function updateUserUID(webtoonID, episodeID, userUID) {
    try {
        const episodeDocRef = await getEpisodeDocData(webtoonID, episodeID);
        const episodeDoc = await getDoc(episodeDocRef);

        if (episodeDoc.exists()) {
            const data = episodeDoc.data();

            // 사용자가 이미 만화를 읽었는지 확인
            if (!(data.readkUser && data.readUser.includes(userUID))) {
                // 사용자 UID가 존재하지 않는 경우에만 추가
                await updateDoc(episodeDocRef, {
                    readUser: arrayUnion(userUID)
                });
            }
        }
    } catch (error) {
        console.error("Error updating document: ", error);
    }
}