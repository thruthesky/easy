var chai = require("chai");
const {
  setCustomClaims,
  getCustomClaims,
} = require("../lib/user_custom_claims");
const { createTestUser, initFirebaseAdminSDK } = require("./setup");
var expect = chai.expect;

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
