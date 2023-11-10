// Firebase 앱, Firestore 서비스, Authentication 서비스를 가져오는 과정입니다.
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, collection } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

// Firebase 설정
const firebaseConfig = {
  // ... 여기에 firebase 설정을 추가 ...
};

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);

// Firestore 인스턴스 가져오기
const db = getFirestore(app);

// Authentication 인스턴스 가져오기
const auth = getAuth(app);

// Authentication 상태 변경 감지
onAuthStateChanged(auth, user => {
  if (user) {
    // User is signed in, so you can get the UID
    const userUid = user.uid;

    // 'USER' 컬렉션 내의 해당 사용자 문서 참조 가져오기
    const userDocRef = doc(db, 'USER', userUid);

    // Search history 컬렉션 참조 가져오기
    const getSearchHistory = async () => {
      try {
        // 사용자 문서 가져오기
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          // Search history 컬렉션 참조 가져오기
          const searchHistoryCollectionRef = collection(userDocRef, 'Search history');
          
          // 이제 searchHistoryCollectionRef를 사용하여 데이터를 조회하거나 조작할 수 있습니다.
          // 예를 들어, 컬렉션의 모든 문서를 가져오거나 새 항목을 추가하는 등의 작업을 할 수 있습니다.
        } else {
          console.log('해당 UID를 가진 사용자 문서가 없습니다.');
        }
      } catch (error) {
        console.error('문서를 가져오는 중 에러 발생:', error);
      }
    };

    // 함수 실행
    getSearchHistory();
  } else {
    // No user is signed in.
    console.log('사용자가 로그인하지 않았습니다.');
  }
});
