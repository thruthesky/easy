const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");

import { onDocumentCreated } from "firebase-functions/v2/firestore";

admin.initializeApp();

// FirestoreEvent 는 DocumentSnapshot 과 documentId 를 가지는 타입이다. Definition 을 참고한다.
export const makeUppercase = onDocumentCreated(
  "messages/{documentId}",
  (event) => {
    // 문서 데이터. 적절한 타이핑 필요
    const data = event.data.data();
    // 문서 아이디.
    const documentId = event.params.documentId;

    // 로그 기록
    logger.log("Uppercasing ..", documentId, data.original);

    return event.data.ref.set(
      {
        uppercase: data.original.toUpperCase() + " <-- up ^^;...",
      },
      { merge: true }
    );
  }
);
