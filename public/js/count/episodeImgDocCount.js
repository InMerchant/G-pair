import { db } from '../firebase.js';
import { collection, getDocs, query, where } from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js';

// 특정 웹툰 ID와 에피소드 ID에 해당하는 문서 개수를 읽는 코드
export async function getEpisodeImgDocCount(webtoonID, episodeID) {
    try {
    // 'webtoonDATA' 컬렉션에 대한 참조
    const webtoonCollectionRef = collection(db, "webtoonDATA");

    // 'webtoonID' 필드가 특정 webtoonID 값을 가진 문서를 찾는 쿼리
    const webtoonQuery = query(webtoonCollectionRef, where("webtoonID", "==", webtoonID));

    // 쿼리 실행
    const webtoonQuerySnapshot = await getDocs(webtoonQuery);

    // 문서가 존재하는 경우
    if (!webtoonQuerySnapshot.empty) {
        // 해당 문서의 'Episode' 서브컬렉션에 대한 참조를 가져옴
        const webtoonDocRef = webtoonQuerySnapshot.docs[0].ref;
        const episodeCollectionRef = collection(webtoonDocRef, "Episode");

        // 'episodeID' 필드가 특정 episodeID 값을 가진 문서를 찾는 쿼리
        const episodeQuery = query(episodeCollectionRef, where("episodeID", "==", episodeID));

        // 쿼리 실행
        const episodeQuerySnapshot = await getDocs(episodeQuery);

        // 에피소드 문서가 존재하는 경우
        if (!episodeQuerySnapshot.empty) {
            //해당 문서의 'Image' 서브컬렉션에 대한 참조를 가져옴
            const episodeDocRef = episodeQuerySnapshot.docs[0].ref;
            const epiImgCollectionRef = collection(episodeDocRef, "Image");
            
            // 쿼리 실행
            const epiImgQuerySnapshop = await getDocs(epiImgCollectionRef);

            // 에피소드 이미지 문서가 존재하는 경우
            if (!epiImgQuerySnapshop.empty) {
                // 문서 수 데이터 반환
                const episodeImgCountData = epiImgQuerySnapshop.docs.length
                return episodeImgCountData;
            } else {
                console.log('No episodeImage matching');
                return null;
            }
        } else {
            console.log(`No episode matching episodeID ${episodeID}`);
            return null;
        }
    } else {
        console.log(`No document matching webtoonID ${webtoonID}`);
        return null;
    }
    } catch (error) {
        console.error("Error fetching episode data: ", error);
        return null;
    }
}