const scrollToTopBtn = document.getElementById("scrollToTopBtn");
const scrollToBottomBtn = document.getElementById("scrollToBottomBtn");
const targetDiv = document.getElementById("imgContainer");

// 상단으로 스크롤하는 함수
function scrollToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

// 하단으로 스크롤하는 함수
function scrollToBottom() {
    window.scrollTo(0, document.body.scrollHeight);
}

// 요소의 하단이 보이는지 확인하는 함수
function isBottomVisible(element) {
    const elementRect = element.getBoundingClientRect();
    return window.innerHeight >= elementRect.bottom;
}
