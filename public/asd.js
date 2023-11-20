document.getElementById('runPythonButton').addEventListener('click', function() {
    fetch('/runPython')
        .then(response => response.text())
        .then(data => {
            document.getElementById('pythonResult').innerText = data;
        })
        .catch(error => {
            console.error('Error fetching Python result:', error);
        });
});
