import { db, storage } from '../firebase.js';
import { ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-storage.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

document.getElementById('fileInput').addEventListener('change', async function(e) {
    const file = e.target.files[0];
    const storageReference = storageRef(storage, '너는개그만화나그려라/Episode/1화/' + file.name);
    
    try {
        await uploadBytes(storageReference, file);
        console.log('Uploaded a blob or file!');
        
        const url = await getDownloadURL(storageReference);
        document.getElementById('uploadedImage').src = url;
        console.log('File available at', url);

        // Firestore에 'webtoonDATA/webtoonDATA/episode/1화' 경로에 데이터 저장
        // 도큐먼트 ID를 파일 이름으로 사용
        const docRef = doc(db, 'webtoonDATA/webtoonDATA/Episode/1화/이미지', file.name);
        await setDoc(docRef, { imageUrl: url });
        console.log('Image URL saved in Firestore at webtoonDATA/webtoonDATA/episode/1화');
        
    } catch (error) {
        console.error('Error during the upload or database save', error);
    }
});