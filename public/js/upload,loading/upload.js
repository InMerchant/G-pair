import { db, storage } from '../firebase.js';
import { ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-storage.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

document.getElementById('submit-button').addEventListener('click', async function() {
    // 폼 데이터 가져오기
    const titleValue = document.getElementById('title').value;
    const authorValue = document.getElementById('author').value;
    const descriptionValue = document.getElementById('subtitle').value;
    const genreValues = Array.from(document.querySelectorAll('input[type=checkbox]:checked')).map(cb => cb.value);
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (file) {
        try {
            // 이미지 업로드 로직
            const storageReference = storageRef(storage, '너는개그만화나그려라/Episode/1화/' + file.name);
            await uploadBytes(storageReference, file);
            console.log('Uploaded a blob or file!');
            
            const imageUrl = await getDownloadURL(storageReference);

            // Firestore에 데이터 저장
            const webtoonData = {
                title: titleValue,
                author: authorValue,
                description: descriptionValue,
                genre: genreValues,
                thumbnail: imageUrl // 업로드된 이미지의 URL
            };

            const docRef = await db.collection('webtoonDATA').add(webtoonData);
            console.log('Document written with ID: ', docRef.id);

            // 성공 메시지 표시 또는 페이지 리다이렉트
            // ...

        } catch (error) {
            console.error('Error during the upload or database save', error);
        }
    } else {
        console.error('No file selected for upload');
        // 파일이 선택되지 않았을 때의 처리 로직
        // ...
    }
});