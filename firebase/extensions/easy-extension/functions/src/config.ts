
export interface Config {
    userCollectionName: string;
    setDisabledUserField: boolean;
}

const config: Config = {
    userCollectionName:
        process.env.USER_COLLECTION_NAME || 'users',
    setDisabledUserField: process.env.SET_DISABLED_USER_FIELD === 'yes',
};

export default config;