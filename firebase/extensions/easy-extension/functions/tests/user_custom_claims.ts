
import {describe, it} from "mocha";


import {expect} from "chai";
import {createTestUser, initFirebaseAdminSDK} from "./setup";
import {getCustomClaims, setCustomClaims} from "../src/user_custom_claims";

initFirebaseAdminSDK();

//
describe("User custom claims", () => {
  describe("Set properties", () => {
    it("1 equals 1 !!", async () => {
      const user = await createTestUser();
      await setCustomClaims(user.uid, {level: 12});
      const claims = await getCustomClaims(user.uid);
      expect(claims?.level).equal(12);
    });
  });
});


