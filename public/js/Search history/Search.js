// Algolia 클라이언트 설정
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
    // hit[key]가 배열인지 확인하고, 배열이 아닌 경우 빈 배열로 처리
    const lines = Array.isArray(hit[key]) ? hit[key] : [];
    const filteredLines = lines.filter(line => line.includes(query));
    const content = filteredLines.map(line => `<div>${line}</div>`).join('');

    // 제목과 작가 모두 표시
    return `<div class="search-result-item" data-webtoon-id="${hit.webtoonID}" data-episode-number="${episodeNumber}" data-search-type="${type}">
        <strong>${hit.title}</strong> - 작가: ${hit.author} - ${episodeNumber ? episodeNumber + '화 ' : ''}${type}: ${content}
    </div>`;
}



// 검색 결과 항목에 클릭 이벤트 추가 함수
function addClickEventToSearchResults() {
    document.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', function() {
            const webtoonID = this.dataset.webtoonId;
            const episodeNumber = this.dataset.episodeNumber;
            const searchType = this.dataset.searchType;

            if (searchType === 'title' || searchType === 'author') {
                window.location.href = `/detail?name=${webtoonID}`;
            } else {
                window.location.href = `/episode.html?webtoonID=${webtoonID}&id=${episodeNumber}`;
            }
        });
    });
}
