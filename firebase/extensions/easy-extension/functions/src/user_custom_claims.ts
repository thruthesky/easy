import * as admin from "firebase-admin";

/**
 *
 * @param {*} uid
 * @param {*} claims
 * @returns
 */
export async function setCustomClaims(uid: string, claims: Record<string, any>) {
  await admin.auth().setCustomUserClaims(uid, claims);
  return uid;
}

/**
 *
 * @param {*} uid
 * @returns
 */
export async function getCustomClaims(uid: string): Promise<Record<string, any> | undefined> {
  const user = await admin.auth().getUser(uid);
  // console.log(user);
  return user.customClaims;
}


