function translate(labels){
    const translations={
        'ABUSE': '욕설',
        'CENSURE': '비난',
        'VIOLENCE': '폭력',
        'SEXUAL': '선정',
        'CRIME': '범죄',
        'DISCRIMINATION': '차별',
        'HATE': '혐오',
    }
    return labels.map(label => translations[label] || label);
}
function translate2(labels){
    const translations={
        'teens':'10대',
        'twenties':'20대',
        'thirties':'30대',
        'forties':'40대',
        'others':'그 외'
    }
    return labels.map(label => translations[label] || label);
}

var charts = {};

export function lineChart(situationLineData, elementId) {
    // 해당 elementId에 대한 이전 차트가 있다면 파괴
    if (charts[elementId]) {
        charts[elementId].destroy();
    }

    var ctx = document.getElementById(elementId).getContext('2d');
    
    var labels = Object.keys(situationLineData['ABUSE']).map((_, index) => `${index + 1}화 `);

    var maxDataValue = 10; //데이터의 최대값
    var datasets = Object.keys(situationLineData).map((label, index) => {
        var colors = [
            'rgba(255, 99, 132, 0.7)',
            'rgba(100, 100, 100, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(153, 102, 255, 0.7)',
            'rgba(255, 159, 64, 0.7)',
            'rgba(199, 199, 199, 0.7)'
        ];

        //데이터를 백분율로 변환
        var percentageData = situationLineData[label].map(value => (value / maxDataValue) * 100);
        return {
            label: translate([label])[0],
            backgroundColor: colors[index],
            borderColor: colors[index % colors.length],
            data: percentageData,
            fill: false,
            lineTension: 0.4
        };
    });

    charts[elementId] = new Chart(ctx, {
        type: 'line',
        data: { labels, datasets },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    min: 0, // y축 최소값을 0%로 설정
                    max: 100, // y축 최대값을 항상 100%로 설정
                    ticks: {
                        stepSize: 10, // y축 눈금 간격을 10%로 설정
                        callback: function(value) {
                            return value + '%'; // y축 값에 % 추가
                        }
                    }
                }
            }
        }
    });
}


export function drawChart(data, elementId) {
    // 해당 elementId에 대한 이전 차트가 있다면 파괴
    if (charts[elementId]) {
        charts[elementId].destroy();
    }

    var ctx = document.getElementById(elementId).getContext('2d');
    charts[elementId] = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: translate(Object.keys(data)),
            datasets: [{
                data: Object.values(data),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(100, 100, 100, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                    'rgba(255, 159, 64, 0.7)',
                    'rgba(199, 199, 199, 0.7)',
                    'rgba(210, 180, 140, 0.5)'
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
    // 해당 elementId에 대한 이전 차트가 있다면 파괴
    if (charts[elementId]) {
        charts[elementId].destroy();
    }

    var ctx = document.getElementById(elementId).getContext('2d');

    // 데이터의 총합 계산
    var total = Object.values(data).reduce((sum, value) => sum + value, 0);
    // 데이터를 백분율로 변환
    var percentageData = Object.values(data).map(value => (value / total) * 100);

    charts[elementId] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: translate2(Object.keys(data)),
            datasets: [{
                label: "나이 통계",
                data: percentageData,
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
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    min: 0, // y축 최소값을 0%로 설정
                    max: 100, // y축 최대값을 항상 100%로 설정
                    ticks: {
                        stepSize: 10, // y축 눈금 간격을 10%로 설정
                        callback: function(value) {
                            return value + '%'; // y축 값에 % 추가
                        }
                    }
                }
            }
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


  