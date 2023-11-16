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
    const fileInput = document.getElementById('formFile');
    const file = fileInput.files[0];

    if (file) {
        try {
            // 무작위 ID를 먼저 생성합니다.
            const webtoonID = generateRandomString(20);

            // 스토리지 경로를 webtoonID로 설정합니다.
            const storagePath = `${webtoonID}/sign.png`;
            const storageReference = storageRef(storage, storagePath);

            // 파일 업로드 처리...
            await uploadBytes(storageReference, file);
            console.log('Uploaded a blob or file!');
            const imageUrl = await getDownloadURL(storageReference);

            // Firestore에 데이터 저장
            const webtoonData = {
                title: document.getElementById('title').value,
                author: document.getElementById('author').value,
                description: document.getElementById('subtitle').value,
                day: document.querySelector('input[name="day"]:checked').value,
                genre: Array.from(document.querySelectorAll('input[type=checkbox]:checked')).map(cb => cb.value),
                thumbnail: imageUrl,
                webtoonID: webtoonID // 생성된 무작위 ID 사용
            };

            // Firestore 문서 추가
            await addDoc(collection(db, 'webtoonDATA'), webtoonData);
            await addDoc(collection(db, 'Search'), webtoonData);

        } catch (error) {
            console.error('Error during the upload or database save', error);
        }
    } else {
        console.error('No file selected for upload');
    }
});