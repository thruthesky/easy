import { DocumentSnapshot, WriteResult } from "firebase-admin/firestore";
import { Command, UpdateCustomClaimsOptions } from "../interfaces/command.interface";
import { UserModel } from "./user.model";

export class CommandModel {
    static async execute(snapshot: DocumentSnapshot): Promise<WriteResult | undefined> {


        const command: Command = snapshot.data() as Command;
        // const ref = snapshot.ref;
        // const uid = ref.id;




        if (command.command === "update_custom_claims") {
            return await UserModel.updateCustomClaims(command.options as UpdateCustomClaimsOptions) as undefined;
        } else if (command.command === "user_exists") {
            throw new Error("user_exists is not supported");
        }


        throw new Error("Command not found");
    }
}
