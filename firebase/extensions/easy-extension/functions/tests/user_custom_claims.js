var chai = require("chai");
const setCustomClaims = require("../lib/user_custom_claims");
const { createTestUser } = require("./setup");
var expect = chai.expect;

describe("User custom claims", () => {
  describe("Set properties", async () => {
    it("1 equals 1 !!", async () => {
      const user = await createTestUser();
      await setCustomClaims(user.uid, { level: 1 });
      const claims = await getCustomClaims(user.uid);

      console.log(claims);
    });
  });
});
