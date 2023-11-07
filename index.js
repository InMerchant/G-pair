const express = require('express');
const multer = require('multer');
const app = express();
const port = 3000;
const upload = multer({ dest: 'uploads/' });


// 'public' 폴더를 정적 파일로 서빙하는 데 사용
app.use(express.static('public'));
app.post('/upload', upload.single('file'), function (req, res) {
  // 파일 처리 로직
  console.log(req.file); // 업로드된 파일 정보
  // ... Firebase에 파일 업로드 로직을 추가
  res.send('File uploaded successfully.');
});
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
