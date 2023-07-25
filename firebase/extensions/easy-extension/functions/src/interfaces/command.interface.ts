import { Config } from "../config";

export interface Command {
    // command list
    command: "update_custom_claims" | "user_exists" | "disable_user";
    uid: string;

    // command Options
    claims?: UpdateCustomClaimsOptions;
    userExists?: UserExistsOptions;

    // result of the command execution.
    response?: {
        status: "success" | "error";
        config: Config;
        claims?: Record<string, any>;
        code?: string;
        message?: string;
        timestamp: FirebaseFirestore.FieldValue;
    };
}

export interface UpdateCustomClaimsOptions {
    // Custom claims to update
    admin?: boolean;
    disabled?: boolean;
    [key: string]: any;
}



export interface UserExistsOptions {
    by: "uid" | "email" | "phoneNumber";
    value: string;
}


