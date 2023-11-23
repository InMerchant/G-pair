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
        return; 
    }

    try {
        const webtoonID = generateRandomString(20);
        const storagePath = `${webtoonID}/sign.png`;
        const storageReference = storageRef(storage, storagePath);
        await uploadBytes(storageReference, fileInput);
        console.log('Uploaded a blob or file!');
        const imageUrl = await getDownloadURL(storageReference);
        const webtoonData = {
            title: titleInput,
            author: authorInput,
            description: subtitleInput,
            day: dayInput.value,
            genre: Array.from(genreInputs).map(cb => cb.value),
            thumbnail: imageUrl,
            webtoonID: webtoonID
        };
        const webtoonSearch={
            제목: titleInput,
            작가: authorInput,
        }
        await addDoc(collection(db, 'webtoonDATA'), webtoonData);
        await addDoc(collection(db, 'Search'), webtoonSearch);
        window.location.href="/"

    } catch (error) {
        console.error('Error during the upload or database save', error);
    }
});