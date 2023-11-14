import { db } from './firebase.js'; // Firestore 인스턴스를 가져옵니다.
import { collection, getDocs, query, where } from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js';
import { getEpisodeImgData } from './search_collection/episodeImgSearch.js';
import { getEpisodeImgDocCount } from './count/episodeImgDocCount.js';
import {barChart, drawChart,updateIconHeight} from './chart/drawChart.js';

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const webtoonID = urlParams.get('webtoonID'); // URL에서 'webtoonID' 값을 가져옵니다.
const episodeID = urlParams.get('name'); // URL에서 'name' 값을 가져옵니다.
const episodeNumber = parseInt(episodeID, 10);

function updateCounts(상황Count, 대사Count, episodeImgData) {
    // 상황 카운트 업데이트
    const 상황Values = Object.entries(episodeImgData)
        .filter(([key, value]) => key.startsWith("상황") && typeof value === 'boolean');
    상황Values.forEach(([key, value]) => {
        if (value) {
            const 상황Type = key.split(' ')[1].replace(/[()]/g, '');
            if (상황Count.hasOwnProperty(상황Type)) {
                상황Count[상황Type]++;
            }
        }
        else{
            상황Count['비난X']++;
        }
    });

    // 대사 카운트 업데이트
    const 대사Values = Object.entries(episodeImgData)
        .filter(([key, value]) => key.startsWith("대사") && typeof value === 'boolean');
    대사Values.forEach(([key, value]) => {
        if (value) {
            const 대사Type = key.split(' ')[1].replace(/[()]/g, '');
            if (대사Count.hasOwnProperty(대사Type)) {
                대사Count[대사Type]++;
            }
        }
        else{
            대사Count['비난X']++;
        }
    });
}

getEpisodeImgDocCount(webtoonID, episodeNumber).then(episodeImgCountData => {
    if (episodeImgCountData) {
        let 상황Count = {
            'ABUSE': 0,
            'CENSURE': 0,
            'VIOLENCE': 0,
            'SEXUAL': 0,
            'CRIME': 0,
            'DISCRIMINATION': 0,
            'HATE': 0,
            '비난X':0
        };
        let 대사Count = {
            'ABUSE': 0,
            'CENSURE': 0,
            'VIOLENCE': 0,
            'SEXUAL': 0,
            'CRIME': 0,
            'DISCRIMINATION': 0,
            'HATE': 0,
            '비난X':0
        };
        // 프로미스 배열을 생성합니다.
        let promises = [];
        for (let i = 1; i <= episodeImgCountData; i++) {
            promises.push(getEpisodeImgData(webtoonID, episodeNumber, i));
        }

        // 모든 프로미스가 완료되면, 차트를 그립니다.
        Promise.all(promises).then(results => {
            results.forEach(episodeImgData => {
                if (episodeImgData) {
                    updateCounts(상황Count, 대사Count, episodeImgData);
                }
            });

            // 모든 비동기 작업이 완료된 후에 차트를 그립니다.
            drawChart(대사Count, 'dialogueChart');
            drawChart(상황Count, 'situationChart');
        }).catch(error => {
            console.error("Error in data fetching: ", error);
        });
    }
}).catch(error => {
    console.error("Error in getting document count: ", error);
});

async function UserGender() {
    const userCollectionRef = collection(db, 'USER');
    const userSnap = await getDocs(userCollectionRef);

    // 나이와 성별에 대한 초기 집계 객체를 생성합니다.
    const ageGroups = {
        teens:0,
        twenties:0,
        thirties:0,
        forties:0,
        others:0
    };
    const genderCount = {
        male: 0,
        female: 0
    };

    // 각 문서에 대해 나이 그룹과 성별을 집계합니다.
    userSnap.docs.forEach(doc => {
        const ageGroup = doc.data().ageGroup;
        const gender = doc.data().gender;

        // 나이 그룹에 대한 카운트
        if (ageGroups[ageGroup]&&ageGroup) {
            ageGroups[ageGroup]++;
        } else if(ageGroup){
            ageGroups[ageGroup] = 1;
        }

        // 성별에 대한 카운트
        if (gender === 'male') {
            genderCount.male++;
        } else if (gender === 'female') {
            genderCount.female++;
        }
    });
    var totalGenderCount = genderCount.male + genderCount.female;
    var malePercentage = (genderCount.male / totalGenderCount) * 100;
    var femalePercentage = (genderCount.female / totalGenderCount) * 100
    updateIconHeight(malePercentage, femalePercentage);
    barChart(ageGroups,'ageChart')
}


// 사용자 데이터를 가져오는 부분
UserGender().then(userData => {
    console.log(userData);
    // 사용자 데이터를 이용한 추가 로직이 필요하다면 여기에 작성
}).catch(error => {
    console.error("Error in getting user data: ", error);
});
