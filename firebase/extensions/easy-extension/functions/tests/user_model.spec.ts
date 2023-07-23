
import { describe, it } from "mocha";


import { expect } from "chai";
import { createTestUser, initFirebaseAdminSDK } from "./setup";
import { UserModel } from "../src/models/user.model";

import {
  // QueryDocumentSnapshot,
  // WriteResult,
  getFirestore,
} from "firebase-admin/firestore";

import { Command } from "../src/interfaces/command.interface";
import { CommandModel } from "../src/models/command.model";



initFirebaseAdminSDK();

//
describe("User custom claims", () => {
  it("claim level test", async () => {
    const user = await createTestUser();
    await UserModel.setCustomClaims(user.uid, { level: 12 });
    const claims = await UserModel.getCustomClaims(user.uid);
    expect(claims?.level).equal(12);
  });

  it("Update claims with command", async () => {

    const user = await createTestUser();
    await UserModel.setCustomClaims(user.uid, { level: 12 });


    const db = getFirestore();

    // Create command doc
    const ref = await db.collection("easy-commands").add({
      command: 'update_custom_claims',
      options: {
        uid: user.uid,
        level: 13
      }
    } satisfies Command);

    // Get doc
    const snapshot = await ref.get();

    // Execute command
    await CommandModel.execute(snapshot);

    // Check claims
    const claims = await UserModel.getCustomClaims(user.uid);

    // Test
    expect(claims?.level).equal(13);



    // Do it again with different options
    const againRef = await db.collection("easy-commands").add({
      command: 'update_custom_claims',
      options: {
        uid: user.uid,
        level: 14,
        groupName: 'writer'
      }
    } satisfies Command);


    // Execute command
    await CommandModel.execute(await againRef.get());

    // Get doc after command execution
    const afterSnapshot = await againRef.get();
    const afterDocData = afterSnapshot.data() as Command;

    console.log(afterDocData)
    // Test
    expect(afterDocData.response?.status).equal('success');
    expect(afterDocData.response?.claims.level).equal(14);
    expect(afterDocData.response?.claims.groupName).equal('writer');

  });
});


