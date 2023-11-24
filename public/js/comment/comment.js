import { db } from '../firebase.js';
import { getEpisodeDocData, getEpisodeData } from "../search_collection/episodeSearch.js"
import { doc, arrayUnion,getDoc,updateDoc,increment,setDoc,arrayRemove } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";
//저장 함수
export function commentSave(webtoonID, episodeNumber, UID, comment,episodeID) {
    if (comment) {
        const commentData = { userUid: UID, comment: comment };
        console.log(commentData);
        const episodeRef = doc(db, "COMMENT", webtoonID, "Episodes", episodeNumber);

        setDoc(episodeRef, {
            Comments: arrayUnion(commentData)
        }, { merge: true })
        commentCount(webtoonID,episodeID)
        .then(() => {
            console.log("Comment added successfully");
            commentLoad(webtoonID, episodeNumber,episodeID,UID);
        })
        .catch((error) => {
            console.error("Error adding comment: ", error);
        });
    }
}
//로드 함수
export async function commentLoad(webtoonID,episodeNumber,episodeID,UID){
    const episodeRef = doc(db, "COMMENT", webtoonID, "Episodes", episodeNumber);
    getDoc(episodeRef)
    .then((docSnap) => {
        if (docSnap.exists()) {
            displayComments(docSnap.data().Comments,webtoonID,episodeNumber,episodeID,UID);
        }
    })
    .catch((error) => {
        console.error("Error fetching comments: ", error);
    });
}
//댓글 출력
function displayComments(comments, webtoonID, episodeNumber,episodeID,UID) {
    const commentsDiv = document.getElementById('comments');
    commentsDiv.innerHTML = ''; // 기존 댓글을 지우고 새로 시작합니다.

    comments.forEach((comment) => {
        // 댓글을 담을 요소 생성
        const commentElement = document.createElement('div');
        commentElement.classList.add('comment-item');
        const commentText = document.createElement('span');
        commentText.classList.add('comment-text');
        commentText.textContent = comment.comment;
        commentElement.appendChild(commentText);

        // 삭제 버튼을 담을 요소 생성
        if (comment.userUid === UID) {
            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete-button');
            deleteButton.textContent = '삭제';
            deleteButton.addEventListener('click', function () {
                console.log("Deleting comment:", comment);
                deleteComment(webtoonID, episodeNumber, comment, episodeID,UID);
            });

            commentElement.appendChild(deleteButton);
        }

        // 댓글 요소를 댓글 목록에 추가
        commentsDiv.appendChild(commentElement);
    });
}

//카운트
async function commentCount(webtoonID,episodeID){
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

async function deleteComment(webtoonID, episodeNumber, commentToDelete,episodeID,UID) {
    const episodeRef = doc(db, "COMMENT", webtoonID, "Episodes", episodeNumber);
    const episodeDocRef = await getEpisodeDocData(webtoonID, episodeID);
    try {
        await updateDoc(episodeRef, {
            Comments: arrayRemove(commentToDelete)
        });
        await updateDoc(episodeDocRef, {
            comment: increment(-1)
        });

        commentLoad(webtoonID, episodeNumber,episodeID,UID); // 댓글 목록 새로고침
    } catch (error) {
        console.error("Error deleting comment: ", error);
    }
}