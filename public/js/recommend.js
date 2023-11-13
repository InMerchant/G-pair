import { getEpisodeDocData, getEpisodeData } from "./search_collection/episodeSearch.js"
import { updateDoc, increment } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

export async function recommend(webtoonID, episodeID, userUID) {
    const episodeDocRef = await getEpisodeDocData(webtoonID, episodeID);
    await updateDoc(episodeDocRef, {
        recommend: increment(1)
    });
}