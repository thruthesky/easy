
// export interface Config {
//     userCollectionName: string;
//     setDisabledUserField: boolean;
//     syncCustomClaimsToUserDocument: boolean;
// }


export class Config {
    static userCollectionName: string =
        process.env.USER_COLLECTION_NAME || 'users';
    static setDisabledUserField: boolean = process.env.SET_DISABLED_USER_FIELD === 'yes';
    static syncCustomClaimsToUserDocument: boolean = process.env.SYNC_CUSTOM_CLAIMS_TO_USER_DOCUMENT === 'yes';

    static json(): Record<string, any> {
        return {
            userCollectionName: this.userCollectionName,
            setDisabledUserField: this.setDisabledUserField,
            syncCustomClaimsToUserDocument: this.syncCustomClaimsToUserDocument,
        };
    }
};
