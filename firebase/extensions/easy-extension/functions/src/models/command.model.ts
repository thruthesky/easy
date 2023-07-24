import { DocumentSnapshot, FieldValue, WriteResult } from "firebase-admin/firestore";
import { Command, UpdateCustomClaimsOptions } from "../interfaces/command.interface";
import { UserModel } from "./user.model";
import * as functions from "firebase-functions";
import config from "../config";
import { success } from "../utils";

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

    console.log('---> input command; ', command);

    try {
      if (command.command === "update_custom_claims") {

        const claims = command.claims as UpdateCustomClaimsOptions;
        console.log('---> claims;', claims);
        await UserModel.updateCustomClaims(command.uid, claims);
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
        if (config.setDisabledUserField) {
          await UserModel.setDisabledField(command.uid, config.userCollectionName);
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
