import { getEpisodeImgData } from '../search_collection/episodeImgSearch.js';
import { getStorage, ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-storage.js";
import { getEpisodeImgDocCount } from '../count/episodeImgDocCount.js';

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const episodeStr = urlParams.get("id");
const webtoonID = urlParams.get("webtoonID");

function extractNumberFromString(str) {
    const matches = str.match(/\d+/); // 숫자가 하나 이상 연속되는 부분을 찾기
    return matches ? parseInt(matches[0], 10) : null; // 찾은 숫자를 정수로 변환
}
const episodeID = extractNumberFromString(episodeStr); // 정수로 변환된 값 저장

// Firebase 스토리지 초기화
const storage = getStorage();

export async function episodeImgLoad() {
    getEpisodeImgDocCount(webtoonID, episodeID).then(episodeImgCountData => {
        if (episodeImgCountData) {
            const count = episodeImgCountData
            for (let i = 1; i < count + 1; i++) {
                getEpisodeImgData(webtoonID, episodeID, i).then(episodeImgData => {
                    if (episodeImgData) {
                        // 스토리지 참조 생성
                        const imageRef = ref(storage, episodeImgData.url);
                
                        // 다운로드 URL 얻기
                        getDownloadURL(imageRef).then((url) => {
                            document.getElementById('episodeImage').src = url;
                
                        }).catch((error) => {
                            console.error("Error getting download URL: ", error);
                        });
                    } else {
                        console.log("Image data or URL is missing");
                    }
                }).catch((error) => {
                    console.error("Error loading episode image data: ", error);
                });
            }
        }
    });
}

episodeImgLoad()

