const assert = require("assert");
const { db, a, b, tempChatRoomData } = require("./setup");

// load firebase-functions-test SDK
const firebase = require("@firebase/testing");

describe("Join test", () => {
  // it("Join the room with open: false -> error test", async () => {
  //   // Create a chat room by a.
  //   // The chat rooom is closed by default.
  //   const ref = await firebase.assertSucceeds(
  //     db(a)
  //       .collection("easychat")
  //       .add(tempChatRoomData({ master: a.uid, users: [a.uid, b.uid] }))
  //   );
  // });
  // it("Join the room with open: true -> success test", async () => {
  //   // Create a chat room by a.
  //   // The chat rooom is closed by default.
  //   const ref = await firebase.assertSucceeds(
  //     db(a)
  //       .collection("easychat")
  //       .add(tempChatRoomData({ master: a.uid, open: true }))
  //   );
  //   // Join the room as b.
  //   await firebase.assertSucceeds(
  //     db(b)
  //       .collection("easychat")
  //       .doc(ref.id)
  //       .collection("users")
  //       .doc(b.uid)
  //       .set({ uid: b.uid, createdAt: new Date() })
  //   );
  // });
});
