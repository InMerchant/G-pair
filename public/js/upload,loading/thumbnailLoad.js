import { storage } from '../firebase.js';
import { getStorage, ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-storage.js";
import { getWebtoonCollectionData } from "../search_collection/webtoonDATA_Search.js"

//웹툰 이미지 불러오는 js

//웹툰 표지 불러오는 함수
export function loadSignImages(webtoonID) {
  //이미지 url이 위치한 스토리지 불러오기
  getWebtoonCollectionData(webtoonID).then(docData => {
    if(docData) {
      const imageRef = ref(storage, docData.thumbnail);

      //다운로드 URL 얻기
      getDownloadURL(imageRef).then((url) => {
        // Get the image container
        const imageContainer = document.querySelector('.col-lg-3 img.img-fluid');
        if (!imageContainer) return; // Ensure the element exists

        // Set the image source to the URL
        imageContainer.src = url;

      }).catch((error) => {
        console.error("Error getting document:", error);
      });
    }
  })
}