function translate(labels){
    const translations={
        'ABUSE': '욕설',
        'CENSURE': '비난',
        'VIOLENCE': '폭력',
        'SEXUAL': '선정',
        'CRIME': '범죄',
        'DISCRIMINATION': '차별',
        'HATE': '혐오',
        'teens':'10대',
        'undefined':'비공개',
        'male':'남성',
        'female':'여성',
        'twenties':'20대',
        'thirties':'30대',
        'forties':'40대',
        'others':'그 외'

    }
    return labels.map(label => translations[label] || label);
}

export function drawChart(data, elementId) {
    var ctx = document.getElementById(elementId).getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: translate(Object.keys(data)),
            datasets: [{
                data: Object.values(data),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)',
                    'rgba(255, 159, 64, 0.5)',
                    'rgba(199, 199, 199, 0.5)',
                    'rgba(100, 100, 100, 0.5)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(199, 199, 199, 1)',
                    'rgba(100, 100, 100, 0.5)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

export function barChart(data, elementId) {
    var ctx = document.getElementById(elementId).getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: translate(Object.keys(data)),
            datasets: [{
                label:'검색 비율',
                data: Object.values(data),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)',
                    'rgba(255, 159, 64, 0.5)',
                    'rgba(199, 199, 199, 0.5)',
                    'rgba(100, 100, 100, 0.5)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(199, 199, 199, 1)',
                    'rgba(100, 100, 100, 0.5)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

export function updateIconHeight(malePercentage, femalePercentage) {
    var maleFilledIcon = document.getElementById('maleFilledIcon'); // 남성 채워진 아이콘 선택
    var femaleFilledIcon = document.getElementById('femaleFilledIcon'); // 여성 채워진 아이콘 선택
    var malePercentageText = document.getElementById('malePercentageText'); // 남성 퍼센테이지 텍스트 선택
    var femalePercentageText = document.getElementById('femalePercentageText'); // 여성 퍼센테이지 텍스트 선택

    // 남성 아이콘의 채워진 높이 계산
    var maleIconHeight = malePercentage + '%'; // 남성 아이콘 채워진 높이
    maleFilledIcon.style.height = maleIconHeight; // 남성 채워진 아이콘 높이 설정
    malePercentageText.innerText = `남성: ${malePercentage.toFixed(1)}%`;
    // 여성 아이콘의 채워진 높이 계산
    var femaleIconHeight = femalePercentage + '%'; // 여성 아이콘 채워진 높이
    femaleFilledIcon.style.height = femaleIconHeight; // 여성 채워진 아이콘 높이 설정
    femalePercentageText.innerText = `여성: ${femalePercentage.toFixed(1)}%`;
}


  