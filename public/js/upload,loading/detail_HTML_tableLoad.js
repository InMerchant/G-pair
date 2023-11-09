import { db } from '../firebase.js';
import { collection, query, where, getDocs, orderBy } from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js';

//목차 테이블 로딩하는 코드
export async function loadEpisodesToTable(webtoonID) {
    try {
      const webtoonCollectionRef = collection(db, "webtoonDATA");
      const q = query(webtoonCollectionRef, where("webtoonID", "==", webtoonID));
      const querySnapshot = await getDocs(q);
  
      const tableBody = document.getElementById('datatablesSimple').querySelector('tbody');
      tableBody.innerHTML = '';
  
      for (const doc of querySnapshot.docs) {
        const episodesCollectionRef = collection(doc.ref, "Episode");
        // episodeID에 따라 정렬합니다.
        const episodesQuery = query(episodesCollectionRef, orderBy("episodeID"));
        const episodesSnapshot = await getDocs(episodesQuery);
  
        episodesSnapshot.forEach((episodeDoc) => {
          const episode = episodeDoc.data();
          const row = `
            <tr>
              <td>${episode.episodeID}화</td>
              <td>${episode.test}</td>
              <td>${episode.test}</td>
              <td>${episode.test}</td>
              <td>${episode.test}</td>
              <td>${episode.test}</td>
            </tr>
          `;
          tableBody.innerHTML += row;
        });
      }
    } catch (error) {
      console.error("Error loading episodes: ", error);
    }
}

export async function loadDataAndInitializeTable(webtoonID) {
    await loadEpisodesToTable(webtoonID);
    const datatablesSimple = document.getElementById('datatablesSimple');
    if (datatablesSimple) {
        new simpleDatatables.DataTable(datatablesSimple);
    }
}