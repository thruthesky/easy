import { DocumentSnapshot, WriteResult } from "firebase-admin/firestore";
import { Command, UpdateCustomClaimsOptions } from "../interfaces/command.interface";
import { UserModel } from "./user.model";
import * as functions from "firebase-functions";
import { Config } from "../config";
import { failure, success } from "../utils";

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

    // functions.logger.info('---> input command; ', command);

    try {
      if (command.command === void 0) {
        throw new Error("execution/command-is-undefined");
      }
      else if (command.command === "update_custom_claims") {

        const claims = command.claims as UpdateCustomClaimsOptions;
        // functions.logger.info('---> claims;', claims);
        await UserModel.updateCustomClaims(command.uid, claims);
        if (Config.syncCustomClaimsToUserDocument) {
          // functions.logger.info('---> syncCustomClaimsToUserDocument;', Config.syncCustomClaimsToUserDocument);
          // functions.logger.info('---> setCustomClaims;', claims);
          // functions.logger.info('---> user collection', Config.userCollectionName);
          await UserModel.update(command.uid, { claims });
        }
        return await success(ref, { claims: await UserModel.getCustomClaims(command.uid) });

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
      else if (command.command === "disable_user") {
        await UserModel.disable(command.uid);
        if (Config.setDisabledUserField) {
          await UserModel.update(command.uid, { disabled: true });
        }
        return await success(ref, {});
      }

      throw new Error("execution/command-not-found");

    } catch (error: any) {
      // get error
      let code = "execution/error";
      let message = "command execution error.";
      if (error?.errorInfo) {
        code = error.errorInfo.code;
        message = error.errorInfo.message;
      } else {
        code = error.message;
      }
      // log error
      functions.logger.error(
        code,
        message,
        command
      );
      // report
      return await failure(ref, code, message);
    }
  }
}
