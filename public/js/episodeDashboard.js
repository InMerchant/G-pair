import { db } from './firebase.js';
import { collection, getDocs, query, where, getDoc, doc } from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js';
import { getEpisodeImgDocCount } from './count/episodeImgDocCount.js';
import { barChart, drawChart,updateIconHeight } from './chart/drawChart.js';
import { getEpisodeDocData, getEpisodeData } from './search_collection/episodeSearch.js'
import { fetchEpisodesAndAddToDropdown } from './dashboard_addDropdown.js'

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const webtoonID = urlParams.get('name'); // URL에서 'webtoonID' 값을 가져옵니다.
let episodeID //드롭아웃에서 선택한 에피소드 위치
let docCount //드롭아웃에서 선택한 에피소드에 이미지 수

//에피소드 집계데이터 넣는 곳
let individualEpisodeData = {}; 

//전체 에피소드 집계데이터 넣는 곳
let allEpisodesData = {
    situationLabelingCount: Array(8).fill(0),
    sentenceLabelingCount: Array(8).fill(0),
    ageGroups: {
        teens: 0,
        twenties: 0,
        thirties: 0,
        forties: 0,
        others: 0
    },
    genderCount: {
        male: 0,
        female: 0
    }
};

fetchEpisodesAndAddToDropdown(webtoonID);

//드롭아웃 이벤트 추가 코드
const dropdownMenu = document.querySelector('.dropdown-menu');
dropdownMenu.addEventListener('click', function(event) {
    const item = event.target.closest('.dropdown-item');
    if (item) {
        // 선택된 항목의 텍스트를 가져옵니다.
        const selectedText = item.textContent;

        // 드롭다운 버튼의 텍스트를 선택한 항목의 텍스트로 변경합니다.
        document.querySelector('#dashboardDropdown').textContent = selectedText;

        // "전체 통계"가 선택된 경우 특정 동작을 수행
        if (selectedText === "전체 통계") {
            // "전체 통계"에 대한 처리를 여기에 추가합니다.
            console.log("전체 통계가 선택되었습니다.");
        } else {
            // 다른 항목이 선택된 경우 숫자를 추출합니다.
            const episodeNumber = selectedText.match(/\d+/) ? selectedText.match(/\d+/)[0] : null;

            // 추출된 숫자를 episodeID 변수에 저장합니다.
            if (episodeNumber) {
                episodeID = parseInt(episodeNumber, 10);
                console.log("선택된 에피소드 ID:", episodeID);
            }
        }
    }
});

//문서 속 데이터 카운팅 함수
async function aggregateLabelingData(webtoonID, episodeID) {
    const documentRef = await getEpisodeDocData(webtoonID, episodeID);
    docCount = await getEpisodeImgDocCount(webtoonID, episodeID);
    let situationLabelingCount = Array(8).fill(0);
    let sentenceLabelingCount = Array(8).fill(0);
    let ageGroups = {
        teens: 0,
        twenties: 0,
        thirties: 0,
        forties: 0,
        others: 0
    };
    let genderCount = {
        male: 0,
        female: 0
    };

    if (documentRef) {
        // 'Image' 하위 컬렉션에 접근
        const imageCollectionRef = collection(documentRef, 'Image');
        const imageDocsSnapshot = await getDocs(imageCollectionRef);

        // 각 이미지 문서에 대해 루프
        imageDocsSnapshot.forEach((doc) => {
            const data = doc.data();
            const situationLabeling = data['상황라벨링'];
            const sentenceLabeling = data['문장라벨링'];

            situationLabelingCount[situationLabeling]++;
            sentenceLabelingCount[sentenceLabeling]++;
        });
    } else {
        console.error('Document reference not found');
    }
    // 읽은 유저 정보가 위치한 데이터베이스 정보 불러오기
    const episodeData = await getEpisodeData(webtoonID, episodeID);

    // 에피소드를 읽은 유저 UID 읽어오기
    // 'readUser' 필드의 존재 여부와 배열 여부를 확인
    if (episodeData.readUser && Array.isArray(episodeData.readUser)) {
        const readUsers = episodeData.readUser;

        // 읽은 유저들에 대한 나이, 성별 데이터 집계
        for (const docId of readUsers) {
            const docRef = doc(db, 'USER', docId);
            try {
                const docSnapshot = await getDoc(docRef);
                if (docSnapshot.exists()) {
                    const data = docSnapshot.data();
                    // 나이 그룹과 성별에 따라 데이터를 집계합니다.
                    const { ageGroup, gender } = data;
                    if (ageGroups.hasOwnProperty(ageGroup)) {
                        ageGroups[ageGroup]++;
                    }
                    if (gender === 'male') {
                        genderCount.male++;
                    } else if (gender === 'female') {
                        genderCount.female++;
                    }
                } else {
                    console.log(`No document found with ID: ${docId}`);
                }
            } catch (error) {
                console.error("Error fetching document:", error);
            }
        }
    } else {
        console.log('No readUser data available for this episode.');
    }

    return {
        situationLabelingCount,
        sentenceLabelingCount,
        ageGroups,
        genderCount
    };
}

//드롭아웃 개수 세기
function updateDropdownItemCount() {
    const dropdownItems = document.querySelectorAll('.dropdown-menu .dropdown-item');
    const itemCount = dropdownItems.length;
    return itemCount
}

//드롭다운을 얻기위한 작업
let temp = await aggregateLabelingData(webtoonID, 1);

// 드롭다운 항목 개수를 기반으로 반복문 실행
for (let episode = 1; episode <= updateDropdownItemCount() - 1; episode++) {
    let episodeData = await aggregateLabelingData(webtoonID, episode);
    console.log(episode)
    // 각 에피소드별 데이터 저장
    individualEpisodeData[episode] = episodeData;

    // 모든 에피소드 데이터에 추가
    for (let i = 0; i < 8; i++) {
        allEpisodesData.situationLabelingCount[i] += episodeData.situationLabelingCount[i];
        allEpisodesData.sentenceLabelingCount[i] += episodeData.sentenceLabelingCount[i];
    }

    // ageGroups와 genderCount를 루프를 통해 누적
    for (const ageGroup in episodeData.ageGroups) {
        if (episodeData.ageGroups.hasOwnProperty(ageGroup)) {
            allEpisodesData.ageGroups[ageGroup] += episodeData.ageGroups[ageGroup];
        }
    }

    for (const gender in episodeData.genderCount) {
        if (episodeData.genderCount.hasOwnProperty(gender)) {
            allEpisodesData.genderCount[gender] += episodeData.genderCount[gender];
        }
    }
}



// 각 에피소드별 데이터와 모든 에피소드 데이터의 사용 예
console.log("에피소드별 데이터:", individualEpisodeData);
//console.log("에피소드별 데이터:", individualEpisodeData[2]);
console.log("모든 에피소드 데이터 합계:", allEpisodesData);