function translate(labels){
    const translations={
        'ABUSE': '욕설',
        'CENSURE': '비난',
        'VIOLENCE': '폭력',
        'SEXUAL': '선정',
        'CRIME': '범죄',
        'DISCRIMINATION': '차별',
        'HATE': '혐오',
        'teens':'십대',
        'undefined':'비공개',
        'male':'남성',
        'female':'여성',

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