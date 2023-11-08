import { storage } from '../firebase.js';
import { getStorage, ref, getDownloadURL,listAll } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-storage.js";

//웹툰 이미지 불러오는 js

//웹툰 표지 불러오는 함수
export function loadSignImages(webtoonID) {
  // storageRef now points to the folder named after the webtoonID
  const storageRef = ref(storage, `${webtoonID}/`);

  listAll(storageRef).then((result) => {
    let signImageFound = false;

    result.items.forEach((imageRef) => {
      // Check if the file is 'sign.png'
      if (imageRef.name === "sign.png") {
        signImageFound = true;

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
    });

    if (!signImageFound) {
      console.error("sign.png not found in the specified folder.");
    }
  }).catch((error) => {
    console.error("Error listing documents:", error);
  });
}