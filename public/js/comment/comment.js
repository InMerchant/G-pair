import { db } from '../firebase.js';
import { getEpisodeDocData, getEpisodeData } from "../search_collection/episodeSearch.js"
import { doc, arrayUnion,getDoc,updateDoc,increment,setDoc } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

export function commentSave(webtoonID, episodeNumber, UID, comment,episodeID) {
    if (comment) {
        const commentData = { userUid: UID, comment: comment };
        console.log(commentData);
        const episodeRef = doc(db, "COMMENT", webtoonID, "Episodes", episodeNumber);

        setDoc(episodeRef, {
            Comments: arrayUnion(commentData)
        }, { merge: true })
        commnetCount(webtoonID,episodeID)
        .then(() => {
            console.log("Comment added successfully");
            commentLoad(webtoonID, episodeNumber);
        })
        .catch((error) => {
            console.error("Error adding comment: ", error);
        });
    }
}

export async function commentLoad(webtoonID,episodeNumber){
    const episodeRef = doc(db, "COMMENT", webtoonID, "Episodes", episodeNumber);
    getDoc(episodeRef)
    .then((docSnap) => {
        if (docSnap.exists()) {
            displayComments(docSnap.data().Comments);
        }
    })
    .catch((error) => {
        console.error("Error fetching comments: ", error);
    });
}

function displayComments(comments) {
    const commentsDiv = document.getElementById('comments');
    commentsDiv.innerHTML = ''; // 기존 댓글을 지우고 새로 시작합니다.

    comments.forEach(comment => {
      const p = document.createElement('p');
      p.textContent = comment.comment; // 예시: comment 객체의 'comment' 속성 사용
      commentsDiv.appendChild(p);
    });
}

async function commnetCount(webtoonID,episodeID){
    const episodeDocRef = await getEpisodeDocData(webtoonID, episodeID);

    const episodeDoc = await getDoc(episodeDocRef);
    if (!episodeDoc.exists()) {
        console.log("Document does not exist!");
        return "0"
    }
    try {
        await updateDoc(episodeDocRef, {
            comment: increment(1) // 댓글 수를 1만큼 증가
        });
        console.log("Comment count updated successfully");
    } catch (error) {
        console.error("Error updating comment count: ", error);
    }
}