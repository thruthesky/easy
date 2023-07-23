# Easy Extension

## Overview

- When a document is created under the `easy_commands` collection,
  - The firebase background function will execute the comamnd specified in `{ command: ... }`.

- The `easy_commands` collection should be protected by security rules for the adming-create-only permission.


## Command list


### Updating auth custom claims

- Required properties
  - `{ command: 'update_custom_claims' }` - the command.
  - `{ options: { uid: 'xxx' } }` - the user's uid that the claims will be applied to.
  - `{ options: { key: value, xxx: xxx, ... } }` - other keys and values for the claims.


- Response
  - `{ response: { status: 'success' } }` - success respones
  - `{ response: { timestamp: xxxx } }` - the time that the executino had finished.
  - `{ response: { claims: { ..., ... } } }` - the claims that the user has.


- Example


- Create a document under `/easy_commands` collection with the following properties
  - `uid` - `[string]`. The user uid to apply the claims.
  - `admin` - `[boolean]`. Set true if the user is admin. (optional).
  - `block` - `[boolean]`. Set true if the user is blocked. (optional).
  - `{ [key: string]: any }`. You can add any string/value for the claims.


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




