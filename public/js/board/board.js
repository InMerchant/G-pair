import { db, storage } from '../firebase.js';
import { ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-storage.js";
import { doc, setDoc, addDoc, collection } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

function generateRandomString(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

document.getElementById('submitbutton').addEventListener('click', async function() {
    const titleInput = document.getElementById('title').value.trim();
    const authorInput = document.getElementById('author').value.trim();
    const subtitleInput = document.getElementById('subtitle').value.trim();
    const dayInput = document.querySelector('input[name="day"]:checked');
    const genreInputs = document.querySelectorAll('input[type=checkbox]:checked');
    const fileInput = document.getElementById('formFile').files[0];

    // 입력 필드가 비어 있는지 확인
    if (!titleInput || !authorInput || !subtitleInput || !dayInput || genreInputs.length === 0 || !fileInput) {
        alert('빈 공간이 있습니다!');
        return; // 빈 필드가 있으면 함수 종료
    }

    try {
        // 무작위 ID를 먼저 생성합니다.
        const webtoonID = generateRandomString(20);

        // 스토리지 경로를 webtoonID로 설정합니다.
        const storagePath = `${webtoonID}/sign.png`;
        const storageReference = storageRef(storage, storagePath);

        // 파일 업로드 처리...
        await uploadBytes(storageReference, fileInput);
        console.log('Uploaded a blob or file!');
        const imageUrl = await getDownloadURL(storageReference);

        // Firestore에 데이터 저장
        const webtoonData = {
            title: titleInput,
            author: authorInput,
            description: subtitleInput,
            day: dayInput.value,
            genre: Array.from(genreInputs).map(cb => cb.value),
            thumbnail: imageUrl,
            webtoonID: webtoonID // 생성된 무작위 ID 사용
        };

        // Firestore 문서 추가
        await addDoc(collection(db, 'webtoonDATA'), webtoonData);
        await addDoc(collection(db, 'Search'), webtoonData);

    } catch (error) {
        console.error('Error during the upload or database save', error);
    }
});