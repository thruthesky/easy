const assert = require("assert");
const { db, a, b, c, tempChatRoomData, createChatRoom, block } = require("./setup");

// load firebase-functions-test SDK
const firebase = require("@firebase/testing");

describe("Message read test", () => {
    it("Read a message by NOT a chat room user - failure ", async () => {
        const roomRef = await createChatRoom(a, { master: a.uid, users: [a.uid, b.uid] });

        await firebase.assertFails(
            db(c)
                .collection("easychat")
                .doc(roomRef.id)
                .collection("messages")
                .get()
        );
    });

    it("Read mesage by user in the chat room - success ", async () => {
        const roomRef = await createChatRoom(a, { master: a.uid, users: [a.uid, b.uid] });

        await firebase.assertSucceeds(
            db(a)
                .collection("easychat")
                .doc(roomRef.id)
                .collection("messages")
                .get()
        );
        await firebase.assertSucceeds(
            db(b)
                .collection("easychat")
                .doc(roomRef.id)
                .collection("messages")
                .get()
        );
    });

    it("Read Group chat if the user is blocked - failure", async () => {

        // user A created a Room
        const roomRef = await createChatRoom(a, { master: a.uid, users: [a.uid], open: false, group: true });

        // user A invited user B
        await invite(a, b, roomRef.id);

        // user A blocked B
        await block(a, b, roomRef.id);

        // user B should not see the messages

        await firebase.assertFails(
            db(b)
                .collection("easychat")
                .doc(roomRef.id)
                .collection("messages")
                .get()
        );
    });

});

