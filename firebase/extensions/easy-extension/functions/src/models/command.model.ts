import { DocumentSnapshot, FieldValue, WriteResult } from "firebase-admin/firestore";
import { Command, UpdateCustomClaimsOptions } from "../interfaces/command.interface";
import { UserModel } from "./user.model";

/**
 * CommandModel
 *
 * Execute a command from easy-commands collection.
 * 
 * TODO : More error tests like options validation, etc.
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


        try {
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
                //   const uid = command.options.uid;
                //   const exists = await UserModel.exists(uid);

                //   return await ref.update({
                //     response:
                //             {
                //               status: "success",
                //               exists,
                //               timestamp: FieldValue.serverTimestamp(),
                //             },
                //   });
            }

            throw new Error("execution/command-not-found");
        } catch (error: any) {
            let code = "execution/error";
            let message = "command execution error";
            if (error?.errorInfo) {
                code = error.errorInfo.code;
                message = error.errorInfo.message;
            } else {
                code = error.message;
            }
            return await ref.update({
                response:
                {
                    status: "error",
                    code,
                    message,
                    timestamp: FieldValue.serverTimestamp(),
                },
            });
        }
    }
}
