
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
    const ref = db.collection("easy-commands").doc();

    await ref.set({
      command: 'update_custom_claims',
      options: {
        uid: user.uid,
        level: 13
      }
    } satisfies Command);

    const snapshot = await ref.get();

    await CommandModel.execute(snapshot);


    const claims = await UserModel.getCustomClaims(user.uid);

    console.log(claims)
    expect(claims?.level).equal(13);


  });
});


