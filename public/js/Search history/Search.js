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
