import { db ,storage,app} from './firebase.js';
import { getStorage, ref, getDownloadURL,listAll ,} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-storage.js";
import { collection, getDocs, doc, query, where } from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js'; 
import {orderBy, limit } from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js';
const getImageUrl = async (webtoonID) => {
    const storage = getStorage();
    const imageRef = ref(storage, `${webtoonID}/sign.png`); 
    try {
        const url = await getDownloadURL(imageRef);
        return url;
    } catch (error) {
        console.error('Error fetching image from Firebase Storage: ', error);
        return ''; 
    }
};
const fetchTopThreeWebtoons = async () => {
    try {
        const webtoonRef = collection(db, "webtoonDATA");
        const q = query(webtoonRef, limit(3));
        const querySnapshot = await getDocs(q);

        const topThreeData = [];
        querySnapshot.forEach((doc) => {
            let data = doc.data();
            data.id = doc.id;
            topThreeData.push(data);
        });
        for (let data of topThreeData) {
            data.imageUrl = await getImageUrl(data.webtoonID);
        }
        renderCards(topThreeData);
    } catch (error) {
        console.error("Error fetching top three webtoons: ", error);
    }
};
  const initialize = () => {
    fetchTopThreeWebtoons();
  };
  
  window.addEventListener('load', initialize);
const createCard = (data, rank) => {
    let rankClass = '';
    let rankText = '';
    switch(rank) {
      case 1:
        rankClass = 'first';
        rankText = '1위';
        break;
      case 2:
        rankClass = 'second';
        rankText = '2위';
        break;
      case 3:
        rankClass = 'third';
        rankText = '3위';
        break;
    }
    return `
      <div class="ranking ${rankClass}">
        <h2>${rankText}</h2>
        <img class="card-img-top" src="${data.imageUrl}" alt="${data.title}">
        <p>${data.title}</p>
        <p>${data.anthor}</p>
      </div>
    `;
  };
const renderCards = (dataList) => {
const container = document.getElementById('board');
container.innerHTML = ''; // 기존의 카드들을 초기화

dataList.forEach((data, index) => {
    container.innerHTML += createCard(data, index + 1); // 순위를 전달하여 새로운 카드를 추가
});
};  