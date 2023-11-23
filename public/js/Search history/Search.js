// Algolia 클라이언트 설정
import { collection, query, where, getDocs, updateDoc, doc, increment } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";
import { db } from '../firebase.js'; 


const client = algoliasearch('TOBZK90LFP', '7e6fca838d4c8a9dc0bee205f5a7a380');
const index = client.initIndex('webtoonDATASEARCH');

const searchButton = document.querySelector('.btn-primary');
const searchInput = document.getElementById('searchQuery');
const searchTypeSelect = document.getElementById('searchType');
const webtoonNameSelect = document.getElementById('WebtoonID'); // 웹툰 이름 선택 필드
const resultsContainer = document.querySelector('.card-body');

// 검색 버튼에 이벤트 리스너를 추가합니다.
searchButton.addEventListener('click', () => {
    const query = searchInput.value;
    const searchType = searchTypeSelect.value;
    const selectedWebtoon = webtoonNameSelect.value;

    index.search(query).then(({ hits }) => {
        let searchResults = '';

        hits.forEach(hit => {
            if (selectedWebtoon !== 'all' && hit.title !== selectedWebtoon) {
                return;
            }

            for (let key in hit) {
                if (searchType === 'dialogue' && key.includes('문장')) {
                    const episodeNumber = key.split('화')[0];
                    searchResults += createSearchResultItem(hit, episodeNumber, query);
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

function createSearchResultItem(hit, episodeNumber, query) {
    const dialogueKey = episodeNumber + '화 문장';
    const dialogueLines = hit[dialogueKey];
    const episodeImageUrls = hit[episodeNumber + '화 URL'] || [];

    const filteredContent = dialogueLines
        .map((line, index) => ({
            line: line,
            imageUrl: episodeImageUrls[index] || ''
        }))
        .filter(item => item.line.includes(query));

    let contentHtml = '';

    if (filteredContent.length > 0) {
        contentHtml = filteredContent.map((item) => {
            return `
                <div class="search-result-content">
                    ${item.imageUrl ? `<img src="${item.imageUrl}" class="search-result-image" alt="Episode Image">` : ''}
                
                    <div>${item.line}</div>
                </div>`;
        }).join('');
    }

    return `
     <div class="card search-result-item mb-3" data-webtoon-id="${hit.webtoonID}" data-episode-number="${episodeNumber}">
            <div class="card-body">
                  <h5 class="card-title">${hit.title}</h5>
                  <p class="card-text">작가: ${hit.author}</p>
                    ${contentHtml}
                </div>
</div>`;
}



async function updateSearchCount(webtoonID, episodeNumber) {
    try {
        // 'webtoonDATA' 컬렉션에서 'webtoonID' 필드가 일치하는 문서 찾기
        console.log(episodeNumber)
        console.log(webtoonID)

        const webtoonRef = collection(db, "webtoonDATA");
        const q = query(webtoonRef, where("webtoonID", "==", webtoonID));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            // 첫 번째 일치하는 문서의 문서 ID를 사용
            const docId = querySnapshot.docs[0].id;
            // 해당 문서의 'Episode' 서브 컬렉션 내의 에피소드 문서 참조
            const episodeDocRef = doc(db, "webtoonDATA", docId, "Episode", episodeNumber + "화");

            // 해당 에피소드 문서의 'imgSearchCount' 필드 업데이트
            await updateDoc(episodeDocRef, {
                imgSearchCount: increment(1)
            });
            console.log("검색 횟수 업데이트 성공");
            return true; // 업데이트 성공
        } else {
            console.log("일치하는 문서 없음");
            return false; // 일치하는 문서 없음
        }
    } catch (error) {
        console.error("검색 횟수 업데이트 실패", error);
        return false; // 업데이트 실패
    }
}

// 검색 결과 항목에 클릭 이벤트 추가 함수
function addClickEventToSearchResults() {
    document.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', async function() { // async 함수로 변경

            const webtoonID = this.dataset.webtoonId;
            const episodeNumber = this.dataset.episodeNumber;
            const searchType = this.dataset.searchType;

                await updateSearchCount(webtoonID, episodeNumber);
            

            // 페이지 이동
            if (searchType === 'title' || searchType === 'author') {
                window.location.href = `/detail?name=${webtoonID}`;
            } else {
                window.location.href = `/episode.html?webtoonID=${webtoonID}&id=${episodeNumber}`;
            }
        });
    });
}


// Firestore에서 Search 컬렉션의 데이터를 읽어와 드롭다운 초기화
async function initializeWebtoonDropdown() {
    const searchRef = collection(db, "Search"); // 'Search' 컬렉션 참조
    const querySnapshot = await getDocs(searchRef); // 데이터 읽기
    const webtoonDropdown = document.getElementById('WebtoonID'); // 드롭다운 선택

    // Firestore에서 읽어온 문서의 title 필드를 바탕으로 드롭다운 옵션 생성
    querySnapshot.forEach((doc) => {
        const webtoonTitle = doc.data().title; // title 필드
        const option = document.createElement('option');
        option.value = webtoonTitle;
        option.textContent = webtoonTitle;
        webtoonDropdown.appendChild(option); // 드롭다운에 옵션 추가
    });
}

// 페이지 로드 시 드롭다운 초기화 실행
document.addEventListener('DOMContentLoaded', initializeWebtoonDropdown);
