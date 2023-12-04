import { db } from '../../js/firebase.js';

// 가장 최근에 추가된 데이터 확인
// 컬렉션의 모든 문서를 가져온 다음 Auto-ID 값을 기준으로 정렬하여 최신 데이터를 확인합니다.
const query = db.collection("Search").orderBy(firebase.firestore.FieldPath.documentId(), "desc").limit(1);

query.get().then((querySnapshot) => {
  querySnapshot.forEach((doc) => {
    // 가장 최근에 추가된 데이터 출력
    console.log("가장 최근에 추가된 데이터:", doc.data());
  });
});
