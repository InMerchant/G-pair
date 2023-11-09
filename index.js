const express = require('express');
const path = require('path');
const app = express();
const port = 3000;


app.use(express.static(path.join(__dirname, 'public')));

// 각 페이지 라우트 설정
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
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

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
