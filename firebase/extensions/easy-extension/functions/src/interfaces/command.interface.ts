export interface Command {
    // command list
    command: 'update_custom_claims' | 'user_exists';

    // command Options
    options: UpdateCustomClaimsOptions | UserExistsOptions;
}

export interface UpdateCustomClaimsOptions {
    // To whom this command is applied
    uid: string;
    // Custom claims to update
    admin?: boolean;
    block?: boolean;
    [key: string]: any;
}

export interface UserExistsOptions {
    by: 'uid' | 'email' | 'phoneNumber';
    value: string;
}


