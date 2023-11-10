import { db } from './firebase.js'; // Firestore 인스턴스를 가져옵니다.
import { collection, getDocs, query, where } from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js';
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const webtoonID = urlParams.get('webtoonID'); // URL에서 'webtoonID' 값을 가져옵니다.
const episodeID= urlParams.get('name'); // URL에서 'name' 값을 가져옵니다.
const episodeNumber = parseInt(episodeID, 10);

const UserGender=async()=>{
    const userCollectionRef=collection(db,'USER');
    const userSanp=await getDocs(userCollectionRef);
    const data = userSanp.docs.map(doc => ({
        gender: doc.data().gender,
        age: doc.data().ageGroup
    }));
      
    return data;
}
const userData=await UserGender();