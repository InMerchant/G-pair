import { db } from './firebase.js';
import { collection, getDocs, doc, query, where } from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js'; // Firebase Firestore 모듈 가져오기

const fetchDataFromFirstCollection = async () => {
    try {
        const firstCollectionRef = collection(db, "webtoonDATA");
        const firstQuerySnapshot = await getDocs(firstCollectionRef);

        const allData = [];
        firstQuerySnapshot.forEach((doc) => {
            const data = doc.data();
            data.id = doc.id; // 문서 ID를 데이터 객체에 추가
            allData.push(data);
        });

        // 카드를 웹 페이지에 렌더링
        renderCards(allData);

    } catch (error) {
        console.error("Error fetching data from Firestore: ", error);
    }
};

// 각 데이터 항목에 대해 카드 HTML 구조를 생성하는 함수
const createCard = (data) => {
    return `
        <div class="col mb-5">
            <div class="card h-100">
                <!-- Product image-->
                <img class="card-img-top" src="${data.imageUrl}" alt="...">
                <!-- Product details-->
                <div class="card-body p-4">
                    <div class="text-center">
                        <!-- Product name-->
                        <h5 class="fw-bolder">${data.title}</h5>
                        <!-- Product subtitle-->
                        ${data.anthor}
                    </div>
                </div>
                <!-- Product actions-->
                <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                    <div class="text-center">
                        <a class="btn btn-outline-dark mt-auto" href="/detail?name=${data.webtoonID}">접속</a>
                    </div>
                </div>
            </div>
        </div>
    `;
};

// 카드를 웹 페이지의 DOM에 렌더링하는 함수
const renderCards = (dataList) => {
    const container = document.getElementById('cardsContainer');
    container.innerHTML = ''; // 기존의 카드들을 초기화
    dataList.forEach(data => {
        container.innerHTML += createCard(data); // 새로운 카드를 추가
    });
};

window.onload = fetchDataFromFirstCollection;