
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const episodeStr = urlParams.get("id");
const webtoonID = urlParams.get("webtoonID");

function extractNumberFromString(str) {
    const matches = str.match(/\d+/); // 숫자가 하나 이상 연속되는 부분을 찾기
    return matches ? parseInt(matches[0], 10) : null; // 찾은 숫자를 정수로 변환
}
const episodeID = extractNumberFromString(episodeStr); // 정수로 변환된 값 저장

console.log(episodeID);
console.log(webtoonID)


