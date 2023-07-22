// const chai = require("chai");
// const {
//   setCustomClaims,
//   getCustomClaims,
// } = require("../lib/user_custom_claims");
// const { createTestUser, initFirebaseAdminSDK } = require("./setup");
// const { describe, it } = require("mocha");
// const expect = chai.expect;

import { describe, it } from "mocha";
import { createTestUser, initFirebaseAdminSDK } from "./setup";
import { getCustomClaims, setCustomClaims } from "../lib/user_custom_claims";
import { expect } from "chai";

initFirebaseAdminSDK();

//
describe("User custom claims", () => {
  describe("Set properties", async () => {
    it("1 equals 1 !!", async () => {
      const user = await createTestUser();
      await setCustomClaims(user.uid, { level: 12 });
      const claims = await getCustomClaims(user.uid);
      expect(claims.level).equal(12);
    });
  });
});
