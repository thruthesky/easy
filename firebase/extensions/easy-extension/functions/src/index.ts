/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

import {initializeApp} from "firebase-admin/app";
import {
  QueryDocumentSnapshot, WriteResult, getFirestore,
} from "firebase-admin/firestore";
import {
  FirestoreEvent, onDocumentCreated,
} from "firebase-functions/v2/firestore";


initializeApp();
const db = getFirestore();

export const addMessage = onRequest(async (req, res) => {
  // text 파라메타 가져오기.
  const original = req.query.text;

  // 문서 추가
  const writeResult = await db.collection("messages").add({original: original});
  // JSON 으로 응답.
  res.json({
    result: `Message with ID: ${writeResult.id} added for upper casing.`,
  });
});

// FirestoreEvent 는 DocumentSnapshot 과 documentId 를 가지는 타입이다. Definition 을 참고한다.
export const makeUppercase = onDocumentCreated(
  "temp-messages/{documentId}",
  (event: FirestoreEvent<QueryDocumentSnapshot | undefined, {
        documentId: string;
    }>): Promise<WriteResult> | undefined => {
    // 문서 데이터. 적절한 타이핑 필요
    const data = event.data?.data() as { original: string };
    // 문서 아이디.
    const documentId = event.params?.documentId;

    // 로그 기록
    logger.log("Uppercasing", documentId, data.original);


    return event.data?.ref.set({
      uppercase: data.original.toUpperCase() + " <-- up ^^;",
    },
    {merge: true});
  });
