const assert = require("assert");
const {
  db,
  a,
  b,
  c,
  createChatRoom,
  createOpenGroupChat,
  invite,
  block,
} = require("./setup");

// load firebase-functions-test SDK
const firebase = require("@firebase/testing");

describe("Blocked users", () => {
  it("Block B - failure", async () => {
    // PREPARE
    const roomRef = await createOpenGroupChat(a);

    // Master A inviting B
    await invite(a, b, roomRef.id);

    // B blocks A -> Failure
    await firebase.assertFails(block(b, a, roomRef.id));
  });
  it("Block C -> success -> Even if the user C is not in the room, master can block. Don't care since it's not a security problem.", async () => {
    // PREPARE
    const roomRef = await createOpenGroupChat(a);
    // Master A, Invite B,
    await invite(a, b, roomRef.id);
    // A blocks C --> Failure. C is not in room.
    await firebase.assertSucceeds(block(a, c, roomRef.id));
  });
  it("A invite B and set him as a moderator. And moderator can block master? yes. Don't care as long as it's not a security problem. Mater can unblock himself.", async () => {
    // PREPARE
    // Master A, Invite B,
    // A blocks B --> success
  });

  //   it("Master A unblocks D - failure - D is not in room", async () => {});
  //   it("B unblocks C - failure - C is not a master or moderator", async () => {});
  //   it("Master A unblocks B - success", async () => {});
});
