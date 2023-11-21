document.getElementById("submitEpisode").addEventListener("click",function(){
    var webtoonID = document.getElementById('webtoonSelect').value;
    var episodeNumber = document.getElementById('episodeNumber').value;
    
    fetch(`/runPython?webtoonID=${webtoonID}&episodeNumber=${episodeNumber}`)
    .then(response => response.text())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
});
