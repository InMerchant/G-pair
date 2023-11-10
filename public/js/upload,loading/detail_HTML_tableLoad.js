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
        // DataTable을 초기화합니다.
        const dataTable = new simpleDatatables.DataTable(datatablesSimple);
        
        // 'dataTable.init' 이벤트가 발생하면 실행되는 콜백 함수 내부에서 'dataTable' 변수를 사용합니다.
        dataTable.on('datatable.init', () => {
            addRowClickEvent();
        });
    }
}

// 이 함수는 각 테이블 행에 클릭 이벤트 리스너를 추가합니다.
function addRowClickEvent() {
    const rows = document.querySelectorAll('#datatablesSimple tbody tr');
    rows.forEach((row) => {
        row.addEventListener('click', function() {
            const rowIndex = this.dataset.index; // 'data-index' 값을 가져옵니다.
            console.log(`Row with data-index ${rowIndex} clicked`);
            const episodeId = this.cells[0].textContent;
            console.log(`Clicked row episodeID: ${episodeId}`);
            // 여기에서 rowIndex를 기반으로 필요한 기능을 구현합니다.
        });
    });
}