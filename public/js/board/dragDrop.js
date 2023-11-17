(function () {
    var fileInput = document.getElementById("file");
    var dropZone = document.querySelector(".drop-zone");
    var uploadedFiles = [];

    var updateFileList = function () {
        dropZone.innerHTML = "";
        uploadedFiles.forEach((file, index) => {
            var fileElement = document.createElement("p");
            fileElement.textContent = file.name;

            var cancelButton = document.createElement("span");
            cancelButton.textContent = "취소";
            cancelButton.classList.add("cancel-button");
            cancelButton.onclick = function () {
                removeFile(index);
            };

            fileElement.appendChild(cancelButton);
            dropZone.appendChild(fileElement);
        });
    };

    fileInput.addEventListener("change", function (e) {
        if (e.target.files.length > 0) {
            // 새로운 파일이 추가된 경우
            Array.from(e.target.files).forEach(file => {
                uploadedFiles.push(file);
            });
        }
        updateFileList();
    });

    dropZone.addEventListener("dragover", function (e) {
        e.preventDefault();
    });

    dropZone.addEventListener("drop", function (e) {
        e.preventDefault();
        var files = e.dataTransfer.files;
        uploadedFiles = Array.from(files);
        fileInput.files = files;
        updateFileList();
    });

    var removeFile = function (index) {
        uploadedFiles.splice(index, 1);
        var dataTransfer = new DataTransfer();
        uploadedFiles.forEach((file) => dataTransfer.items.add(file));
        fileInput.files = dataTransfer.files;
        updateFileList();
    };
})();