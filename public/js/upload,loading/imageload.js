// 이미 `firebase.js`에서 `db`와 `storage`를 import 했습니다.
import { storage } from '../firebase.js';
import { getStorage, ref, getDownloadURL,listAll } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-storage.js";
export function loadImages() {
    const storageRef = ref(storage, 'webtoonDATA1/');
  
    listAll(storageRef).then((result) => {
      result.items.forEach((imageRef) => {
        // Get the download URL
        getDownloadURL(imageRef).then((url) => {
          const imageList = document.getElementById('imageList');
          if (!imageList) return; // Ensure the element exists
  
          // If the image has already been loaded, skip it
          if (imageList.querySelector(`img[src="${url}"]`)) return;
  
          // Create a new image element
          const img = document.createElement('img');
          img.src = url;
          img.width = 100;  // Set image size as required
          img.height = 100;
  
          // Append the new image to the image list
          imageList.appendChild(img);
        }).catch((error) => {
          console.error("Error getting document:", error);
        });
      });
    }).catch((error) => {
      console.error("Error listing documents:", error);
    });
  }

// Assuming you have a button with id 'loadImagesButton' to trigger image loading
document.getElementById('loadImagesButton').addEventListener('click', loadImages);