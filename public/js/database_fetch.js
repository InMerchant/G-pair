import { db } from './firebase.js';
import { collection, getDocs, doc, query, where } from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js'; // Firebase Firestore 모듈 가져오기

///webtoonDATA/webtoonDATA/Episode/Episode임시데이터/Tags/episodeID/BAD tags/BAD tags
///webtoonDATA/webtoonDATA/Episode/Episode임시데이  터/Tags/episodeID/GOOD Tags/GOOD Tags

// Firebase Firestore 데이터 가져오기(Bad tag --version)
const fetchDataFromFirestoreGGG = async () => {
    try {
      // 첫 번째 컬렉션에 대한 참조
      const firstCollectionName = "webtoonDATA";
      const firstCollectionRef = collection(db, firstCollectionName);
      const firstQuerySnapshot = await getDocs(firstCollectionRef);
  
      firstQuerySnapshot.forEach(async (firstDoc) => {
        const firstData = firstDoc.data();
        console.log("Data from Firestore (First Collection):", firstData);
  
        // 두 번째 컬렉션에 대한 참조 (첫 번째 컬렉션 참조를 사용)
        const secondCollectionName = "Episode";
        const secondCollectionRef = collection(firstDoc.ref, secondCollectionName);
        const secondQuerySnapshot = await getDocs(secondCollectionRef);
  
        secondQuerySnapshot.forEach(async (secondDoc) => {
          const secondData = secondDoc.data();
          console.log("Data from Firestore (Second Collection):", secondData);
  
          // 세 번째 컬렉션에 대한 참조 (두 번째 컬렉션 참조를 사용)
          const thirdCollectionName = "Tags";
          const thirdCollectionRef = collection(secondDoc.ref, thirdCollectionName);
          const thirdQuerySnapshot = await getDocs(thirdCollectionRef);
  
          thirdQuerySnapshot.forEach(async (thirdDoc) => {
            const thirdData = thirdDoc.data();
            console.log("Data from Firestore (Third Collection(BAD tags)):", thirdData);
  
            // 네 번째 컬렉션에 대한 참조 (세 번째 컬렉션 참조를 사용)
            const fourthCollectionName = "BAD tags";
            const fourthCollectionRef = collection(thirdDoc.ref, fourthCollectionName);
            const fourthQuerySnapshot = await getDocs(fourthCollectionRef);
  
            fourthQuerySnapshot.forEach((fourthDoc) => {
              const fourthData = fourthDoc.data();
              console.log("Data from Firestore (Fourth Collection):", fourthData);
            });
          });
        });
      });
    } catch (error) {
      console.error("Error fetching data from Firestore: ", error);
    }
  };
  
  fetchDataFromFirestoreGGG();

  // Firebase Firestore 데이터 가져오기(Bad tag --version)
const fetchDataFromFirestoreBBB = async () => {
    try {
      // 첫 번째 컬렉션에 대한 참조
      const firstCollectionName = "webtoonDATA";
      const firstCollectionRef = collection(db, firstCollectionName);
      const firstQuerySnapshot = await getDocs(firstCollectionRef);
  
      firstQuerySnapshot.forEach(async (firstDoc) => {
        const firstData = firstDoc.data();
        console.log("Data from Firestore (First Collection):", firstData);
  
        // 두 번째 컬렉션에 대한 참조 (첫 번째 컬렉션 참조를 사용)
        const secondCollectionName = "Episode";
        const secondCollectionRef = collection(firstDoc.ref, secondCollectionName);
        const secondQuerySnapshot = await getDocs(secondCollectionRef);
  
        secondQuerySnapshot.forEach(async (secondDoc) => {
          const secondData = secondDoc.data();
          console.log("Data from Firestore (Second Collection):", secondData);
  
          // 세 번째 컬렉션에 대한 참조 (두 번째 컬렉션 참조를 사용)
          const thirdCollectionName = "Tags";
          const thirdCollectionRef = collection(secondDoc.ref, thirdCollectionName);
          const thirdQuerySnapshot = await getDocs(thirdCollectionRef);
  
          thirdQuerySnapshot.forEach(async (thirdDoc) => {
            const thirdData = thirdDoc.data();
            console.log("Data from Firestore (Third Collection(GOOD Tags)):", thirdData);
  
            // 네 번째 컬렉션에 대한 참조 (세 번째 컬렉션 참조를 사용)
            const fourthCollectionName = "GOOD Tags";
            const fourthCollectionRef = collection(thirdDoc.ref, fourthCollectionName);
            const fourthQuerySnapshot = await getDocs(fourthCollectionRef);
  
            fourthQuerySnapshot.forEach((fourthDoc) => {
              const fourthData = fourthDoc.data();
              console.log("Data from Firestore (Fourth Collection):", fourthData);
            });
          });
        });
      });
    } catch (error) {
      console.error("Error fetching data from Firestore: ", error);
    }
  };
  
  fetchDataFromFirestoreBBB();