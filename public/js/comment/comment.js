import { db } from '../firebase.js';
import { doc, setDoc, arrayUnion,getDoc } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

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

export async function commentLoad(webtoonID,episodeNumber){
    const docRef=doc(db,"COMMENT",webtoonID,"Episodes",episodeNumber);
    try {
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data().Comments);
            displayComments(docSnap.data().Comments);
        } else {
            console.log("No such document!");
        }
    } catch (error) {
        console.error("Error getting document:", error);
    }
}

function displayComments(comments) {
    const commentsDiv = document.getElementById('comments');
    commentsDiv.innerHTML = ''; // 기존 댓글을 지우고 새로 시작합니다.

    // 각 댓글을 순회하며 웹 페이지에 추가합니다.
    comments.forEach(comment => {
        const p = document.createElement('p');
        p.textContent = comment.comment; // 'text' 속성을 사용하여 실제 댓글 텍스트를 표시
        commentsDiv.appendChild(p);
    });
      
}