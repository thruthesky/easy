import * as admin from "firebase-admin";
import { UpdateCustomClaimsOptions } from "../interfaces/command.interface";

/**
 * UserModel
 *
 * Manage user data
 */
export class UserModel {
  /**
       *
       * @param {*} uid
       * @param {*} claims
       * @returns
       */
  static async setCustomClaims(uid: string, claims: Record<string, any>) {
    await admin.auth().setCustomUserClaims(uid, claims);
    return uid;
  }

  /**
       *
       * @param {*} uid
       * @returns
       */
  static async getCustomClaims(uid: string): Promise<Record<string, any> | undefined> {
    const user = await admin.auth().getUser(uid);
    return user.customClaims;
  }


  /**
       *
       * @param uid user uid
       * @param claims claims to update
       * @returns Promise<void>
       */
  static async updateCustomClaims(uid: string, claims: UpdateCustomClaimsOptions): Promise<void> {
    return await admin.auth().setCustomUserClaims(uid, {
      ...((await this.getCustomClaims(uid)) || {}),
      ...claims,
    });
  }

  /**
   * Disable a user
   */
  static async disable(uid: string): Promise<void> {
    await admin.auth().updateUser(uid, { disabled: true });
  }

  /**
   * Set disable field on user document user the input collection.
   */
  static async setDisabledField(uid: string, collectionName: string): Promise<void> {
    await admin.firestore().collection(collectionName).doc(uid).set({ disabled: true }, { merge: true });
  }
}
