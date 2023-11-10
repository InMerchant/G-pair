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
            const formattedUploadDate = formatDate(episode.uploadDate);
            const row = `
                <tr>
                <td>${episode.episodeID}화</td>
                <td>${episode.subTitle}</td>
                <td>${episode.test}</td>
                <td>${episode.imgSearchCount}</td>
                <td>${episode.recommend}</td>
                <td>${formattedUploadDate}</td>
                </tr>
            `;
            tableBody.innerHTML += row;
            });        
        }
    } catch (error) {
      console.error("Error loading episodes: ", error);
    }
}

// Timestamp 객체에서 yy-mm-dd 형식의 날짜 문자열을 생성하는 함수
function formatDate(timestamp) {
    const date = new Date(timestamp.seconds * 1000); // Firestore의 Timestamp에서 JavaScript의 Date 객체 생성
    const year = date.getFullYear().toString().substr(-2); // 연도의 뒤 두 자리
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 월 (getMonth()는 0부터 시작하므로 1을 더합니다)
    const day = date.getDate().toString().padStart(2, '0'); // 일

    return `${year}-${month}-${day}`; // 포맷에 맞게 반환
}

export async function loadDataAndInitializeTable(webtoonID) {
    await loadEpisodesToTable(webtoonID);

    const datatablesSimple = document.getElementById('datatablesSimple');
    if (datatablesSimple) {
        // DataTable을 초기화합니다.
        const dataTable = new simpleDatatables.DataTable(datatablesSimple);
        
        // 'dataTable.init' 이벤트가 발생하면 실행되는 콜백 함수 내부에서 'dataTable' 변수를 사용합니다.
        dataTable.on('datatable.init', () => {
            addRowClickEvent(webtoonID);
        });
    }
}

// 이 함수는 각 테이블 행에 클릭 이벤트 리스너를 추가합니다.
function addRowClickEvent(webtoonID) {
    const rows = document.querySelectorAll('#datatablesSimple tbody tr');
    rows.forEach((row) => {
        row.addEventListener('click', function() {
            const episodeId = this.cells[0].textContent;

            //각 에피소드로 이동하는 기능
            window.location.href = `episode.html?webtoonID=${webtoonID}&id=${episodeId}`;
        });
    });
}