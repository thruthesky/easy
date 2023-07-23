
import * as logger from "firebase-functions/logger";

import {initializeApp} from "firebase-admin/app";
import {
  DocumentSnapshot,
  // QueryDocumentSnapshot,
  WriteResult,
  // getFirestore,
} from "firebase-admin/firestore";
import {
  // FirestoreEvent,
  onDocumentCreated,
} from "firebase-functions/v2/firestore";
import {CommandModel} from "./models/command.model";
import {FirestoreEventType} from "./defines";


initializeApp();
// const db = getFirestore();


// FirestoreEvent 는 DocumentSnapshot 과 documentId 를 가지는 타입이다. Definition 을 참고한다.
export const easyCommand = onDocumentCreated(
  "easy-commands/{documentId}",
  (event: FirestoreEventType): Promise<WriteResult | undefined> => {
    logger.info("--> onDocumentCreated(/easy-commands/{documentId})", event.data?.data());
    return CommandModel.execute(event.data as DocumentSnapshot);
  });
