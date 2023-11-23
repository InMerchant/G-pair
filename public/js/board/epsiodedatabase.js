import { db } from '../firebase.js';
import { collection, getDocs, query, where,doc,setDoc,updateDoc,arrayUnion,addDoc} from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js';

export async function updateOrCreateEpisode(webtoonID, episodeData, episodeNumber,filesData,response) {
  try {
    const webtoonCollectionRef = collection(db, "webtoonDATA");
    const q = query(webtoonCollectionRef, where("webtoonID", "==", webtoonID));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const webtoonDocRef = querySnapshot.docs[0].ref;
      const episodeDocRef = doc(collection(webtoonDocRef, "Episode"), episodeNumber);
      await setDoc(episodeDocRef, episodeData,);
      filesData.forEach(async (fileData, index) => {
        const jsonData = response.find(item => item['파일 이름'] === fileData.name);
        console.log(jsonData);
        const imageDocRef = doc(collection(episodeDocRef, "Image"), `image${index + 1}`);
        await setDoc(imageDocRef, {
          url: fileData.url, 
          imgID: index + 1,  
          상황: jsonData['문장1'], // JSON 파일에서 상황 가져오기
          문장: jsonData['문장2'], // JSON 파일에서 문장 가져오기
          상황라벨링: jsonData['문장1의 분류 라벨링'], // JSON 파일에서 상황 라벨링 가져오기
          문장라벨링: jsonData['문장2의 분류 라벨링'] // JSON 파일에서 문장 라벨링 가져오기 
        });
      });
    } else {
      console.log('No webtoon document matching the webtoonID.');
    }
  } catch (error) {
    console.error("Error with Episode collection in Firestore: ", error);
  }
}

export async function updateSearch(webtoonID,episodeNumber,filesData,response,webtoonTitle,webtoonAuthor){
  try {
    const searchCollectionRef = collection(db, "Search");
    let situations = [];
    let sentences = [];
    let imageURLs = [];

    filesData.forEach((fileData) => {
      const jsonData = response.find(item => item['파일 이름'] === fileData.name);
      situations.push(jsonData['문장1']); // 상황
      sentences.push(jsonData['문장2']); // 문장
      imageURLs.push(fileData.url); // 이미지 URL
    });
    const episodeField = `${episodeNumber}화 URL`;
    const situationsField = `${episodeNumber}화 상황`;
    const sentencesField = `${episodeNumber}화 문장`;
    await addDoc(searchCollectionRef, {
      [situationsField]: arrayUnion(...situations),
      [sentencesField]: arrayUnion(...sentences),
      [episodeField]: arrayUnion(...imageURLs),
      webtoonID:webtoonID,
      title:webtoonTitle,
      episodeNumber:episodeNumber,
      author:webtoonAuthor
    });

  } catch (error) {
    console.error("Error with Episode collection in Firestore: ", error);
  }
}
