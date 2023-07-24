import {DocumentSnapshot} from "firebase-admin/firestore";
import * as functions from "firebase-functions";

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
