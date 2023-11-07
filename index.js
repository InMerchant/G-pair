const express = require('express');
const app = express();
const port = 3000;

// 'public' 폴더를 정적 파일로 서빙하는 데 사용
app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
