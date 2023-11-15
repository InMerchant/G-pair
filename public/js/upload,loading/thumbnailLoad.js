import { storage } from '../firebase.js';
import { getStorage, ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-storage.js";
import { getWebtoonCollectionData } from "../search_collection/webtoonDATA_Search.js"

//웹툰 표지 불러오는 함수
export function loadSignImages(webtoonID) {
  // Firestore에서 웹툰 데이터를 가져옴
  getWebtoonCollectionData(webtoonID).then(docData => {
    if(docData && docData.thumbnail) {
      // 이미지 컨테이너를 찾음
      const imageContainer = document.querySelector('.col-lg-3 img.img-fluid');
      if (!imageContainer) return; // 요소가 존재하는지 확인

      // 이미지 소스를 thumbnail URL로 설정
      imageContainer.src = docData.thumbnail;
    }
  }).catch((error) => {
    console.error("Error getting document:", error);
  });
}