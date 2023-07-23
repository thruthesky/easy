# Easy Extension


## How to set claims


- Create a document under `/easy-commands` collection with the following properties
  - `uid` - `[string]`. The user uid to apply the claims.
  - `admin` - `[boolean]`. Set true if the user is admin. (optional).
  - `block` - `[boolean]`. Set true if the user is blocked. (optional).
  - `{ [key: string]: any }`. You can add any string/value for the claims.


