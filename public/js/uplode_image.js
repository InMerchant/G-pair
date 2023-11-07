import { storage } from './firebase.js';
import { ref, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-storage.js';

// Firebase Storage에서 이미지 다운로드 및 URL 가져오기
const getImageDownloadURL = async () => {
    try {
      const imageRef = ref(storage, '/webtoonDATA/ASD/test_image1.png');
      const url = await getDownloadURL(imageRef);
      console.log("Image Download URL from Firebase Storage:", url);
    } catch (error) {
      console.error("Error getting download URL from Firebase Storage: ", error);
    }
};

getImageDownloadURL();