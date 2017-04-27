## 15.5.4
* Fix UMD Build. [See this commit](https://github.com/reactjs/prop-types/commit/31e9344ca3233159928da66295da17dad82db1a8).
* Remove dependencies on React in `package.json`. [See this commit](https://github.com/reactjs/prop-types/commit/158198fd6c468a3f6f742e0e355e622b3914048a).

## 15.5.3
* Inlined 'React.isValidElement' to eliminate dependency on React. [See #9371](https://github.com/facebook/react/issues/9371#issuecomment-292685424)
  and [this commit](https://github.com/reactjs/prop-types/commit/df318bba8a89bc5aadbb0292822cf4ed71d27ace).

## 15.5.2
* Fix bug where `prop-types` module was built with const instead of var `lib/ReactPropTypesSecret.js`. [See             #9370](https://github.com/facebook/react/issues/9370) and [this commit](https://github.com/facebook/react/commit/e1919638b39dd65eedd250a8bb649773ca61b6f1).

## Before 15.5.2

PropTypes was previously included in React, but is now a separate package. For earlier history of PropTypes [see the React change log.](https://github.com/facebook/react/blob/master/CHANGELOG.md)
