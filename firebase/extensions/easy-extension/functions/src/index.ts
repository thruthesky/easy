
import * as logger from "firebase-functions/logger";

import { initializeApp } from "firebase-admin/app";
import {
  DocumentSnapshot,
  // DocumentSnapshot,
  // QueryDocumentSnapshot,
  WriteResult,
  // getFirestore,
} from "firebase-admin/firestore";
// import {
//   // FirestoreEvent,
//   onDocumentCreated,
// } from "firebase-functions/v2/firestore";

import * as functions from "firebase-functions";
import { CommandModel } from "./models/command.model";
import { ChangeType, getChangeType } from "./utils";
// import { FirestoreEventType } from "./defines";


initializeApp();
// const db = getFirestore();


// FirestoreEvent 는 DocumentSnapshot 과 documentId 를 가지는 타입이다. Definition 을 참고한다.

export const easyCommand = functions.firestore.document("easy-commands/{documentId}")
  .onWrite(async (change: functions.Change<DocumentSnapshot>): Promise<WriteResult | undefined | null> => {
    const changeType = getChangeType(change);

    logger.info('--> onDocumentCreated(easy-commands/{documentId}) onWrite() start with changeType;', changeType);

    switch (changeType) {
      case ChangeType.CREATE: {
        logger.info("--> onDocumentCreated(easy-commands/{documentId}) onWrite() create -> change.after.id;", change.after.id, change.after.data());
        return CommandModel.execute(change.after);
      }
      case ChangeType.DELETE:
        break;
      case ChangeType.UPDATE:
        break;
      default: {
        throw new Error(`Invalid change type: ${changeType}`);
      }
    }

    return null;
  });
