// Search.js

// Algolia 클라이언트 설정
const client = algoliasearch('TOBZK90LFP', '7e6fca838d4c8a9dc0bee205f5a7a380');
const index = client.initIndex('webtoonDATASEARCH');

// 검색 버튼과 입력 필드를 가져옵니다.
const searchButton = document.querySelector('.btn-primary');
const searchInput = document.getElementById('email'); // 검색 입력란 ID 확인 필요
const resultsContainer = document.querySelector('.card-body');

// 검색 버튼에 이벤트 리스너를 추가합니다.
searchButton.addEventListener('click', () => {
    const query = searchInput.value;

    index.search(query).then(({ hits }) => {
        if (hits.length === 0) {
            // 검색 결과가 없을 경우
            resultsContainer.innerHTML = '<div>검색 결과가 없습니다.</div>';
        } else {
            // 검색 결과 처리
            resultsContainer.innerHTML = hits.map(hit => {
                let matchedContent = '';

                // 각 화별로 검색 쿼리가 포함된 대사와 상황만 찾기
                for (let key in hit) {
                    if (key.includes('대사') || key.includes('상황')) {
                        const episodeNumber = key.split('화')[0];
                        const relevantLines = hit[key].filter(line => line.includes(query));

                        if (relevantLines.length > 0) {
                            matchedContent += `<div><strong>${hit.title}</strong> - ${episodeNumber}화 ${key.includes('대사') ? '대사' : '상황'}: ${relevantLines.join(', ')}</div>`;
                        }
                    }
                }

                return matchedContent;
            }).join('');

            if (!resultsContainer.innerHTML) {
                // 검색어가 포함된 대사나 상황이 없는 경우
                resultsContainer.innerHTML = '<div>검색 결과가 없습니다.</div>';
            }
        }
    }).catch(err => {
        console.error(err);
        resultsContainer.innerHTML = '<div>검색 중 오류가 발생했습니다.</div>';
    });
});
