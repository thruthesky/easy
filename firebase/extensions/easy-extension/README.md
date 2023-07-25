# Easy Extension

## Overview

- When a document is created under the `easy-commands` collection,
  - The firebase background function will execute the comamnd specified in `{ command: ... }`.

- The `easy-commands` collection should be protected by security rules for the adming-create-only permission.


## Command list


### Updating auth custom claims

- Required properties
  - `{ command: 'update_custom_claims' }` - the command.
  - `{ uid: 'xxx' }` - the user's uid that the claims will be applied to.
  - `{ claims: { key: value, xxx: xxx, ... } }` - other keys and values for the claims.

- example of document creation for update_custom claims


![Image Link](https://github.com/thruthesky/easy/blob/main/firebase/extensions/easy-extension/docs/command-update_custom_claims_input.jpg?raw=true "This is image title")


- Response
  - `{ config: ... }` - the configuration of the extension
  - `{ response: { status: 'success' } }` - success respones
  - `{ response: { timestamp: xxxx } }` - the time that the executino had finished.
  - `{ response: { claims: { ..., ... } } }` - the claims that the user currently has. Not the claims that were requested for updating.


![Image Link](https://github.com/thruthesky/easy/blob/main/firebase/extensions/easy-extension/docs/command-update_custom_claims_output.jpg?raw=true "This is image title")




### Disable user

- Disabling a user means that they can't sign in anymore, nor refresh their ID token. In practice this means that within an hour of disabling the user they can no longer have a request.auth.uid in your security rules.
  - If you wish to block the user immediately, I recommend to run another command. Running `update_custom_claims` comand with `{ disabled: true }` and you can add it on security rules.
  - Additionally, you can enable `set enable field on user document` to yes. This will add `disabled` field on user documents and you can search(list) users who are disabled.

## Error handling

- When there is an error, the `status` will be `error` and `errorInfo` has Firebase error information like below.

```ts
{
  options: { uid: '.... wrong uid ....', level: 13 },
  command: 'update_custom_claims',
  response: {
    code: 'auth/user-not-found',
    message: 'There is no user record corresponding to the provided identifier.',
    status: 'error',
    timestamp: Timestamp { _seconds: 1690096498, _nanoseconds: 507000000 }
  }
}
```

- For wrong command, error like below will happen

```ts
{
  command: 'wrong-command',
  response: {
    code: 'execution/command-not-found',
    message: 'command execution error',
    status: 'error',
    timestamp: Timestamp { _seconds: 1690097695, _nanoseconds: 194000000 }
  }
}
```



## Deploy


- To deploy to functions, run the command below.
  - `npm run deploy`


## Unit Testing

- To run the sample test,
  - `npm run test:index`


- To run all the tests
  - `npm run test`


- To run a test by specifying a test script,
  - `npm run mocha -- tests/**/*.ts`
  - `npm run mocha -- tests/update_custom_claims/get_set.spec.ts`
  - `npm run mocha -- tests/update_custom_claims/update.spec.ts`




## Security rules

- The `/easy-commands` collection should be protected by the admin users.
- See the [sample security rules](https://github.com/thruthesky/easy/blob/main/firebase/extensions/easy-extension/firestore.rules) that you may copy and use for the seurity rules of easy-extension
