import { getWebtoonCollectionDocData } from './search_collection/webtoonDATA_Search.js'
import { collection, getDocs } from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js'; // Firebase Firestore 모듈 가져오기

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const webtoonID = urlParams.get("name");

let episodes = [];

export async function fetchEpisodesAndAddToDropdown(webtoonID) {
    try {
        // webtoonDATA 컬렉션에서 첫 번째 문서 참조 가져오기
        const docRef = await getWebtoonCollectionDocData(webtoonID);
        
        if (docRef) {
            // docRef를 사용하여 Episode 서브컬렉션 접근
            const episodeSnapshot = await getDocs(collection(docRef, "Episode"));
            episodeSnapshot.forEach(doc => {
                const episodeID = doc.data().episodeID;
                episodes.push({ id: episodeID, number: episodeID });
            });
            // 에피소드를 숫자 기준으로 정렬
            episodes.sort((a, b) => a.number - b.number);

            // 정렬된 에피소드를 드롭다운에 추가
            episodes.forEach(episode => addDropdownOption(episode.id + "화"));
        } else {
            console.log('No episode data found for the given webtoonID.');
        }
    } catch (error) {
        console.error("Error fetching episodes:", error);
    }
}

function addDropdownOption(episodeText) {
    const dropdownButton = document.getElementById('dashboardDropdown');
    const dropdownMenu = dropdownButton.nextElementSibling;
    const newOption = document.createElement('li');
    newOption.innerHTML = `<a class="dropdown-item">${episodeText}</a>`;
    dropdownMenu.appendChild(newOption);
}

// 페이지 로드 시 함수 호출
//fetchEpisodesAndAddToDropdown(webtoonID);