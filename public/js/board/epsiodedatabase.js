import { db } from '../firebase.js';
import { collection, getDocs, query, where,doc,setDoc} from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js';

export async function updateOrCreateEpisode(webtoonID, episodeData, episodeNumber,filesData) {
  try {
    const webtoonCollectionRef = collection(db, "webtoonDATA");
    const q = query(webtoonCollectionRef, where("webtoonID", "==", webtoonID));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const webtoonDocRef = querySnapshot.docs[0].ref;
      const episodeDocRef = doc(collection(webtoonDocRef, "Episode"), episodeNumber);
      await setDoc(episodeDocRef, episodeData,);
      filesData.forEach(async (fileData, index) => {
        const imageDocRef = doc(collection(episodeDocRef, "Image"), `image${index + 1}`);
        await setDoc(imageDocRef, {
          url: fileData.url,   // 파일 URL
          imgID: index + 1     // 정수 ID로 사용 (1부터 시작)
        });
      });
    } else {
      console.log('No webtoon document matching the webtoonID.');
    }
  } catch (error) {
    console.error("Error with Episode collection in Firestore: ", error);
  }
}
