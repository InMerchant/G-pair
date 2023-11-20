import { db, storage } from '../firebase.js';
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-storage.js";
import { collection, getDocs, doc, query, where,setDoc} from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js';
import {getCurrentTimestamp} from './time.js'
import {updateOrCreateEpisode} from './epsiodedatabase.js'

const fetchDataFromAllCollections = async () => {
    try {
        const firstCollectionRef = collection(db, "webtoonDATA");
        const firstQuerySnapshot = await getDocs(firstCollectionRef);

        const titlesAndIds = [];
        for (const doc of firstQuerySnapshot.docs) {
            const data = doc.data();
            if (data.title) { // 'title' 필드가 있는 경우에만 추가
                titlesAndIds.push({
                    title: data.title,
                    id: data.webtoonID
                });
            }
        }
        updateSelectOptions(titlesAndIds);
    } catch (error) {
        console.error("Error fetching data from Firestore: ", error);
    }
};

const updateSelectOptions = (titlesAndIds) => {
    const select = document.getElementById('webtoonSelect');
    select.innerHTML = ''; // 이전에 추가된 옵션들을 초기화합니다.

    titlesAndIds.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = item.title;
        select.appendChild(option); 
    });
};

document.addEventListener('DOMContentLoaded', () => {
    fetchDataFromAllCollections();
});

async function uploadFiles(files, webtoonID,episodeNumber,subTitle) {
    const filesArray = Array.from(files);
    const uploadPromises = filesArray.map(file => {
        const storageRef = ref(storage, `${webtoonID}/${episodeNumber}/${file.name}`);
        return uploadBytes(storageRef, file).then(snapshot => {
          return getDownloadURL(snapshot.ref).then(downloadURL => {
            return { name: file.name, url: downloadURL }; // 파일 이름과 URL을 객체로 반환
          });
        });
    });

    try {
        const filesData = await Promise.all(uploadPromises);
        const timestamp = getCurrentTimestamp();
        const epsiodeData={
            subTitle:subTitle,
            uploadDate:timestamp,
            episodeID:parseInt(episodeNumber,10)
        }
        await updateOrCreateEpisode(webtoonID, epsiodeData, episodeNumber,filesData);
        console.log('All image documents created in the Image collection.');

    } catch (error) {
        console.error("Error uploading files:", error);
    }
}

// 드래그 앤 드랍 이벤트 리스너
var dropZone = document.querySelector(".drop-zone");
dropZone.addEventListener("drop", function(e) {
    e.preventDefault();
    var files = e.dataTransfer.files;
    var webtoonID = document.getElementById('webtoonSelect').value;
    var episodeNumber = document.getElementById('episodeNumber').value;
    var episodeSubtitle = document.getElementById('subTitle').value;
    if (files.length > 0 && webtoonID&&episodeNumber&&episodeSubtitle) {
        uploadFiles(files, webtoonID,episodeNumber,episodeSubtitle);
    } else {
        console.log('No files dropped or no webtoon selected.');
    }
});
  