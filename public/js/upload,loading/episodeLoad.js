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


// 원하는 div의 ID를 지정합니다.
const targetDivId = 'imgContainer'; 

// 문서를 읽어와서 문서 수 만큼 html ID생성과 이미지 참조
export async function episodeImgLoad() {
    getEpisodeImgDocCount(webtoonID, episodeID).then(episodeImgCountData => {
        if (episodeImgCountData) {
            const count = episodeImgCountData;

            // 원하는 div 요소
            const targetDiv = document.getElementById(targetDivId);
            
            if (!targetDiv) {
                console.error(`Target div with ID '${targetDivId}' not found.`);
                return;
            }

            // 순차적으로 이미지를 처리하기 위한 재귀 함수
            function processImage(index) {
                if (index > count) {
                    // 모든 이미지를 처리했을 때 종료
                    return;
                }

                getEpisodeImgData(webtoonID, episodeID, index).then(episodeImgData => {
                    if (episodeImgData) {
                        // 스토리지 참조 생성
                        const imageRef = ref(storage, episodeImgData.url);
                        
                        // 다운로드 URL 얻기
                        getDownloadURL(imageRef).then((url) => {
                            // 이미지를 감싸는 div 생성
                            const imageContainer = document.createElement('div');
                            imageContainer.className = 'episode-image-container';
                            imageContainer.style.textAlign = 'center';

                            // HTML 엘리먼트 생성 및 설정
                            const imgElement = document.createElement('img');
                            imgElement.id = 'episodeImage' + index;
                            imgElement.src = url;

                            // 이미지 로드 후 크기 조정
                            imgElement.onload = function () {
                                imgElement.style.width = '50%';
                                imgElement.style.height = 'auto'; // 이미지 세로 크기는 원본 비율 유지
                            };

                            // 이미지를 div에 추가
                            imageContainer.appendChild(imgElement);
                            // div를 원하는 div에 추가
                            targetDiv.appendChild(imageContainer);

                            // 다음 이미지를 처리하기 위해 재귀 호출
                            processImage(index + 1);
                        }).catch((error) => {
                            console.error("Error getting download URL: ", error);
                        });
                    } else {
                        // 다음 이미지를 처리하기 위해 재귀 호출
                        processImage(index + 1);
                    }
                }).catch((error) => {
                    // 다음 이미지를 처리하기 위해 재귀 호출
                    processImage(index + 1);
                });
            }

            // 초기 호출
            processImage(1);
        }
    });
}


episodeImgLoad()

