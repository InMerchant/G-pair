import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";
import { getEpisodeDocData, getEpisodeData } from "../search_collection/episodeSearch.js"

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const episodeStr = urlParams.get("id");
const webtoonID = urlParams.get("webtoonID");

function extractNumberFromString(str) {
    const matches = str.match(/\d+/); // 숫자가 하나 이상 연속되는 부분을 찾기
    return matches ? parseInt(matches[0], 10) : null; // 찾은 숫자를 정수로 변환
}
const episodeID = extractNumberFromString(episodeStr); // 정수로 변환된 값 저장

//추천수 출력 함수
export async function updateRecommendCount(webtoonID, episodeID) {
    const episodeDocRef = await getEpisodeDocData(webtoonID, episodeID);
    const episodeDoc = await getDoc(episodeDocRef);

    if (episodeDoc.exists()) {
        const data = episodeDoc.data();
        const recommendCount = data.recommend || 0; // recommend 필드가 없는 경우를 대비하여 기본값 0 설정
        document.getElementById("recommendCount").textContent = recommendCount;
    } else {
        console.log("Document does not exist!");
    }
}

// 원하는 웹툰 ID와 에피소드 ID로 이 함수를 호출
updateRecommendCount(webtoonID, episodeID);