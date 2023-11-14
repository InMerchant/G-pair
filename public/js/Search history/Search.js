// Algolia 클라이언트 설정
import { updateDoc, doc, increment } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";


const client = algoliasearch('TOBZK90LFP', '7e6fca838d4c8a9dc0bee205f5a7a380');
const index = client.initIndex('webtoonDATASEARCH');

// 검색 버튼과 입력 필드를 가져옵니다.
const searchButton = document.querySelector('.btn-primary');
const searchInput = document.getElementById('searchQuery');
const searchTypeSelect = document.getElementById('searchType');
const resultsContainer = document.querySelector('.card-body');
// 검색 버튼에 이벤트 리스너를 추가합니다.
searchButton.addEventListener('click', () => {
    const query = searchInput.value;
    const searchType = searchTypeSelect.value;

    index.search(query).then(({ hits }) => {
        let searchResults = '';

        hits.forEach(hit => {
            for (let key in hit) {
                if (searchType === 'dialogue' && key.includes('대사') && hit[key].some(line => line.includes(query))) {
                    const episodeNumber = key.split('화')[0];
                    searchResults += createSearchResultItem(hit, episodeNumber, key, '대사', query);
                } else if (searchType === 'situation' && key.includes('상황') && hit[key].some(line => line.includes(query))) {
                    const episodeNumber = key.split('화')[0];
                    searchResults += createSearchResultItem(hit, episodeNumber, key, '상황', query);
                } else if (searchType === 'title' && key === 'title' && hit[key].includes(query)) {
                    searchResults += createSearchResultItem(hit, null, key, 'title', query);
                } else if (searchType === 'author' && key === 'author' && hit[key].includes(query)) {
                    searchResults += createSearchResultItem(hit, null, key, 'author', query);
                }
            }
        });

        resultsContainer.innerHTML = searchResults || '<div>검색 결과가 없습니다.</div>';
        addClickEventToSearchResults();
    }).catch(err => {
        console.error(err);
        resultsContainer.innerHTML = '<div>검색 중 오류가 발생했습니다.</div>';
    });
});

// 검색 결과 항목 생성 함수
function createSearchResultItem(hit, episodeNumber, key, type, query) {
    const lines = Array.isArray(hit[key]) ? hit[key] : [];
    const filteredLines = lines.filter(line => line.includes(query));
    const content = filteredLines.map(line => `<div>${line}</div>`).join('');

    // 이미지 URL 구성
    const imageUrl = `https://firebasestorage.googleapis.com/v0/b/look-b1624.appspot.com/o/${encodeURIComponent(hit.webtoonID)}%2Fsign.png?alt=media`;

    return `
    <div class="card search-result-item mb-3" data-webtoon-id="${hit.webtoonID}" data-episode-number="${episodeNumber}" data-search-type="${type}">
        <img src="${imageUrl}" class="card-img-top" alt="${hit.title}" style="height: 200px; object-fit: contain; width: 100%;">
        <div class="card-body">
            <h5 class="card-title">${hit.title}</h5>
            <p class="card-text">작가: ${hit.author}</p>
            <p class="card-text">${episodeNumber ? episodeNumber + '화 ' : ''}${type}: ${content}</p>
        </div>
    </div>`;
}



async function updateSearchCount(webtoonID, episodeNumber) {
    // 'webtoonDATA' 컬렉션에서 'webtoonID' 필드가 일치하는 문서 찾기
    const webtoonRef = collection(db, "webtoonDATA");
    const q = query(webtoonRef, where("webtoonID", "==", webtoonID));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        // 첫 번째 일치하는 문서의 문서 ID를 사용
        const docId = querySnapshot.docs[0].id;

        // 해당 문서의 'Episode' 서브 컬렉션 내의 에피소드 문서 참조
        const episodeDocRef = doc(db, "webtoonDATA", docId, "Episode", episodeNumber + "화");

        try {
            // 해당 에피소드 문서의 'imgSearchCount' 필드 업데이트
            await updateDoc(episodeDocRef, {
                imgSearchCount: increment(1)
            });
            console.log("검색 횟수 업데이트 성공");
        } catch (error) {
            console.error("검색 횟수 업데이트 실패", error);
        }
    } else {
        console.log("일치하는 문서 없음");
    }
}


// 검색 결과 항목에 클릭 이벤트 추가 함수
function addClickEventToSearchResults() {
    document.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', async function() { // async 함수로 변경
            const webtoonID = this.dataset.webtoonId;
            const episodeNumber = this.dataset.episodeNumber;
            const searchType = this.dataset.searchType;

            if (searchType === 'dialogue' || searchType === 'situation') {
                // 업데이트가 완료될 때까지 기다림
                await updateSearchCount(webtoonID, episodeNumber);
            }

            // 페이지 이동
            if (searchType === 'title' || searchType === 'author') {
                window.location.href = `/detail?name=${webtoonID}`;
            } else {
                window.location.href = `/episode.html?webtoonID=${webtoonID}&id=${episodeNumber}`;
            }
        });
    });
}
