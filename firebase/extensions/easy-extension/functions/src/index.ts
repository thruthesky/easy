/**
* Import function triggers from their respective submodules:
*
* import {onCall} from "firebase-functions/v2/https";
* import {onDocumentWritten} from "firebase-functions/v2/firestore";
*
* See a full list of supported triggers at https://firebase.google.com/docs/functions
*/

import * as logger from "firebase-functions/logger";

import { initializeApp } from "firebase-admin/app";
import {
  QueryDocumentSnapshot, WriteResult
  // , getFirestore,
} from "firebase-admin/firestore";
import {
  FirestoreEvent, onDocumentCreated
} from "firebase-functions/v2/firestore";


initializeApp();
// const db = getFirestore();



// FirestoreEvent 는 DocumentSnapshot 과 documentId 를 가지는 타입이다. Definition 을 참고한다.
export const makeUppercase = onDocumentCreated(
  "messages/{documentId}",
  (event: FirestoreEvent<QueryDocumentSnapshot | undefined, {
    documentId: string;
  }>): Promise<WriteResult> | undefined => {
    // 문서 데이터. 적절한 타이핑 필요
    const data = event.data?.data() as { original: string };
    // 문서 아이디.
    const documentId = event.params?.documentId;

    // 로그 기록
    logger.log("Uppercasing ..", documentId, data.original);


    return event.data?.ref.set({
      uppercase: data.original.toUpperCase() + " <-- up ^^;...",
    },
      { merge: true });
  });
