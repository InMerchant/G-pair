import { db } from '../firebase.js';
import { doc, setDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

export function commentSave(webtoonID, episodeNumber, UID, comment) {
    if (comment) {
        const commentData = { userUid: UID, comment: comment };
        console.log(commentData)
        const episodeRef = doc(db, "COMMENT", webtoonID, "Episodes", episodeNumber);

        setDoc(episodeRef, {
            Comments: [commentData] // 문서를 처음 생성할 때는 arrayUnion 대신 배열 사용
        })
        .then(() => {
            console.log("Comment added successfully");
        })
        .catch((error) => {
            console.error("Error adding comment: ", error);
        });
    }
}
