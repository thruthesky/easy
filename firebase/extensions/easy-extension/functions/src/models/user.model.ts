import * as admin from "firebase-admin";
import { UpdateCustomClaimsOptions } from "../interfaces/command.interface";
import { Config } from "../config";
import { DocumentReference, WriteResult } from "firebase-admin/firestore";
import { UserRecord } from "firebase-admin/auth";

/**
 * UserModel
 *
 * Manage user data
 */
export class UserModel {


  /**
   * 
   * @param uid user uid
   * @returns DocumentReference
   */
  static ref(uid: string): DocumentReference {
    return admin.firestore().collection(Config.userCollectionName).doc(uid);
  }


  /**
   * 
   * @param uid uid
   * @returns Promise<{ ... }>
   */
  static async getDocument(uid: string): Promise<Record<string, any> | undefined> {
    const user = await admin.firestore().collection(Config.userCollectionName).doc(uid).get();
    return user.data();
  }

  /**
   * Get a user information by the field with value.
   */
  static async getBy(field: 'uid' | 'email' | 'phoneNumber', value: string): Promise<UserRecord> {
    if (field === 'uid') {
      return await admin.auth().getUser(value);
    } else if (field == 'email') {
      return await admin.auth().getUserByEmail(value);
    } else if (field == 'phoneNumber') {
      return await admin.auth().getUserByPhoneNumber(value);
    } else {
      throw new Error("get_user/invalid-field");
    }
  }

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
   * Enable a user from Firebase Auth
   */
  static async enable(uid: string): Promise<void> {
    await admin.auth().updateUser(uid, { disabled: false });
  }

  /**
   * Update user document with data.
   */
  static async update(uid: string, data: Record<string, any>): Promise<void> {
    await admin.firestore().collection(Config.userCollectionName).doc(uid).set(data, { merge: true });
  }


  /**
   * Delete a user account from Firebase Auth
   */
  static async delete(uid: string): Promise<void> {
    await admin.auth().deleteUser(uid);
  }

  /**
   * Popuplates possible user fields from user record.
   * 
   * @param user user record
   * @returns map of user fields
   */
  static popuplateUserFields(user: UserRecord) {
    const doc: any = {};

    for (const field of ['uid', 'email', 'emailVerified', 'phoneNumber', 'displayName', 'photoURL', 'disabled', 'creationTime']) {
      const fieldValue = user[field as keyof UserRecord];
      if (fieldValue) {
        doc[field] = fieldValue;
      }
    }

    return doc;
  };

  /**
   * Create a user document.
   * 
   */
  static async createDocument(uid: string, data: Record<string, any>): Promise<WriteResult> {
    const ref = UserModel.ref(uid);
    return await ref.set(data);
  }

  static async deleteDocument(uid: string): Promise<WriteResult> {
    const ref = UserModel.ref(uid);
    return await ref.delete();
  }
}
