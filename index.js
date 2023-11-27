const express = require('express');
const path = require('path');
const { spawn } = require('child_process');
const app = express();
const port = 3000;


app.use(express.static(path.join(__dirname, 'public')));

// 각 페이지 라우트 설정
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('/record', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'record.html'));
});
app.get('/detail', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'detail.html'));
});
app.get('/dashboarddetail', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'detail.html'));
});
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});
app.get('/membership', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'membership.html'));
});
app.get('/setting', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'setting.html'));
});
app.get('/search', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'search.html'));
});
app.get('/tables', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tables.html'));
});
app.get('/upload', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'upload.html'));
});
app.get('/episode', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'episode.html'));
});
app.get('/episodedashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'episodeDashboard.html'));
});
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});
app.get('/detailDashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'detailDashboard.html'));
});
app.get('/board', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'board.html'));
});
app.get('/Withdrawal', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Withdrawal.html'));
});
app.get('/episodeUpload', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'episodeUpload.html'));
});
app.get('/episode', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'episode.html'));
});
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

app.get('/runPython', (req, res) => {
  const { webtoonID, episodeNumber } = req.query;
  const pythonProcess = spawn('python', ['./ai/img run.py', webtoonID, episodeNumber]);

  const responseData = []; // 데이터를 저장할 배열

  pythonProcess.stdout.on('data', (data) => {
    responseData.push(data.toString()); // 데이터를 배열에 추가
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`Python Error: ${data}`);
    responseData.push(`Python Error: ${data}`); // 오류도 배열에 추가
  });

  pythonProcess.on('close', () => {
    // Python 스크립트 실행이 완료된 후 데이터를 클라이언트에게 한 번에 응답
    res.send(responseData.join('\n')); // 배열을 문자열로 변환하여 응답
  });
});
