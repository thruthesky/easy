# Easy Extension

## Overview

- When a document is created under the `easy-commands` collection,
  - The firebase background function will execute the comamnd specified in `{ command: ... }`.

- The `easy-commands` collection should be protected by security rules for the adming-create-only permission.


## How to set claims


- Create a document under `/easy-commands` collection with the following properties
  - `uid` - `[string]`. The user uid to apply the claims.
  - `admin` - `[boolean]`. Set true if the user is admin. (optional).
  - `block` - `[boolean]`. Set true if the user is blocked. (optional).
  - `{ [key: string]: any }`. You can add any string/value for the claims.


## Deploy


- To deploy to functions, run the command below.
  - `npm run deploy`


## Unit Testing

- To run the sample test,
  - `npm run test:index`


- To run a test by specifying a test script,
  - `npm run mocha -- tests/user_model.spec.ts`


