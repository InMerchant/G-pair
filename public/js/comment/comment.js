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
async function displayComments(comments, webtoonID, episodeNumber, episodeID, UID) {
    const commentsDiv = document.getElementById('comments');
    commentsDiv.innerHTML = '';

    // `for...of` 루프를 사용하여 비동기 작업을 수행합니다.
    for (const comment of comments) {
        const commentElement = document.createElement('div');
        commentElement.classList.add('comment-item');

        // `getUserEmail` 함수로부터 이메일을 비동기적으로 조회합니다.
        const userEmail = await getUserEmail(comment.userUid);

        const userEmailElement = document.createElement('span');
        userEmailElement.classList.add('user-email');
        userEmailElement.textContent = obfuscateEmail(userEmail);
        commentElement.appendChild(userEmailElement);

        const commentText = document.createElement('span');
        commentText.classList.add('comment-text');
        commentText.textContent = comment.comment; // 댓글 텍스트 설정
        commentElement.appendChild(commentText);

        // 현재 사용자의 UID와 댓글 작성자의 UID가 일치하는 경우에만 삭제 버튼을 추가합니다.
        if (comment.userUid === UID) {
            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete-button');
            deleteButton.textContent = '삭제';
            deleteButton.addEventListener('click', function () {
                deleteComment(webtoonID, episodeNumber, comment, episodeID, UID);
            });

            commentElement.appendChild(deleteButton);
        }

        // 생성된 댓글 요소를 페이지에 추가합니다.
        commentsDiv.appendChild(commentElement);
    }
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

async function getUserEmail(UID) {
    const UserRef = doc(db, "USER", UID);

    try {
        const docSnap = await getDoc(UserRef);

        if (docSnap.exists()) {
            const userData = docSnap.data();
            console.log("User email is:", userData.email);
            return userData.email; // 이메일 값을 반환합니다.
        } else {
            // 문서가 존재하지 않는 경우
            console.log("No such document!");
            return null; // 또는 적절한 에러 처리를 합니다.
        }
    } catch (error) {
        console.error("Error getting document:", error);
    }
}

function obfuscateEmail(email) {
    if (!email) return '알 수 없는 사용자';
    let parts = email.split('@');
    if (parts.length !== 2) return email; // 이메일 형식이 아닐 경우, 그대로 반환

    let username = parts[0];
    let domain = parts[1];

    let obfuscatedUsername = username.substring(0, 1) + '****'; // 첫 글자만 표시하고 나머지는 가립니다.
    return obfuscatedUsername + '@' + domain;
}