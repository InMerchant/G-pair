// Search.js

// Algolia 클라이언트 설정
const client = algoliasearch('TOBZK90LFP', '7e6fca838d4c8a9dc0bee205f5a7a380');
const index = client.initIndex('webtoonDATASEARCH');

// 검색 버튼과 입력 필드를 가져옵니다.
const searchButton = document.querySelector('.btn-primary');
const searchInput = document.getElementById('email'); // 이메일 입력란을 검색 입력란으로 사용
const resultsContainer = document.querySelector('.card-body');

// 검색 버튼에 이벤트 리스너를 추가합니다.
searchButton.addEventListener('click', () => {
    const query = searchInput.value;
    index.search(query).then(({ hits }) => {
        // 검색 결과 처리
        resultsContainer.innerHTML = hits.map(hit => 
            `<div><strong>${hit.title}</strong>
                <p>Author: ${hit.anthor}</p>
        </div>`// Algolia 인덱스의 필드에 따라 변경
        ).join('');
    }).catch(err => {
        console.error(err);
        resultsContainer.innerHTML = '<div>검색 중 오류가 발생했습니다.</div>';
    });
});
