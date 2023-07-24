import { DocumentReference, DocumentSnapshot, FieldValue } from "firebase-admin/firestore";
import * as functions from "firebase-functions";
import config from "./config";

export enum ChangeType {
  CREATE,
  DELETE,
  UPDATE,
}


export const getChangeType = (change: functions.Change<DocumentSnapshot>) => {
  if (!change.after.exists) {
    return ChangeType.DELETE;
  }
  if (!change.before.exists) {
    return ChangeType.CREATE;
  }
  return ChangeType.UPDATE;
};


export const success = async (ref: DocumentReference, response: Record<string, any>) => {
  return await ref.update({
    config: config,
    response:
    {
      ...{
        status: "success",
        timestamp: FieldValue.serverTimestamp(),
      },
      ...response,
    },
  });
}
