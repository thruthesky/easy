import {DocumentSnapshot, FieldValue, WriteResult} from "firebase-admin/firestore";
import {Command, UpdateCustomClaimsOptions} from "../interfaces/command.interface";
import {UserModel} from "./user.model";

/**
 * CommandModel
 *
 * Execute a command from easy-commands collection.
 */
export class CommandModel {
  /**
         * Execute a command from easy-commands collection.
         *
         * @param snapshot DocumentStanpshot that contains a command
         * @returns Promise
         */
  static async execute(snapshot: DocumentSnapshot): Promise<WriteResult | undefined> {
    const command: Command = snapshot.data() as Command;
    const ref = snapshot.ref;
    // const uid = ref.id;


    if (command.command === "update_custom_claims") {
      const options = command.options as UpdateCustomClaimsOptions;
      await UserModel.updateCustomClaims(options);

      return await ref.update({
        response:
                {
                  status: "success",
                  claims: await UserModel.getCustomClaims(options.uid),
                  timestamp: FieldValue.serverTimestamp(),
                },
      });
    } else if (command.command === "user_exists") {
      throw new Error("user_exists is not supported");
    }


    throw new Error("Command not found");
  }
}
