const express = require('express');
const app = express();
const port = 3000;

// 'public' 폴더를 정적 파일로 서빙하는 데 사용
app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from './firebase.js'; // 이전에 설정한 Firebase 앱 인스턴스를 가져옵니다.

// Firestore 인스턴스를 초기화합니다.
const db = getFirestore(app);

async function getAllComments() {
  // COMMENT 컬렉션에 대한 참조를 가져옵니다.
  const commentsCollectionRef = collection(db, "COMMENT");
  // 해당 컬렉션의 모든 문서를 가져옵니다.
  const querySnapshot = await getDocs(commentsCollectionRef);

  // 각 문서의 데이터를 콘솔에 출력합니다.
  querySnapshot.forEach((doc) => {
    console.log(`${doc.id} =>`, doc.data());
  });
}

// 함수를 호출하여 모든 댓글을 가져옵니다.
getAllComments().catch(console.error);
