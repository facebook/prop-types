# prop-types

Runtime type checking for React props and similar objects.

## Installation

```
npm install --save prop-types
```

## Importing

```js
import PropTypes from 'prop-types'; // ES6
var PropTypes = require('prop-types'); // ES5 with npm
```

If you prefer a `<script>` tag, you can get it from `window.PropTypes` global:

```html
<!-- development version -->
<script src="https://unpkg.com/prop-types/prop-types.js"></script>
 
<!-- production version -->
<script src="https://unpkg.com/prop-types/prop-types.min.js"></script>
```

## Difference from `React.PropTypes`: Development and Production Versions

In production, **all validator functions are replaced with empty functions that throw an error**. This is done to optimize the bundle size. This is new behavior, and you will only encounter it when you migrate from `React.PropTypes` to the `prop-types` package. For the vast majority of components, this doesn’t matter, and if you didn’t see [this warning](https://facebook.github.io/react/warnings/dont-call-proptypes.html) in your components, your code is safe to migrate. This is not a breaking change in React because you are only opting into this change for a component by explicitly changing your imports to use `prop-types`.

Don’t call the validator functions manually in your code. React automatically calls `PropTypes` validators declared on your components in development version, and it won’t call them in production. **If you absolutely need to trigger the validation manually**, call `PropTypes.checkPropTypes(propTypes, props, location, componentName)`. Unlike the validators themselves, this function is safe to call in production, as it will be replaced by an empty function.

If you use a bundler like Browserify or Webpack, don’t forget to [follow these instructions](https://facebook.github.io/react/docs/installation.html#development-and-production-versions) to correctly bundle your application in development or production mode. Otherwise you’ll ship unnecessary code to your users.

## Usage

Refer to the [React documentation](https://facebook.github.io/react/docs/typechecking-with-proptypes.html) for more information.

## Migrating from React.PropTypes

Check out [Migrating from React.PropTypes](https://facebook.github.io/react/blog/2017/04/07/react-v15.5.0.html#migrating-from-react.proptypes) for details on how to migrate to `prop-types` from `React.PropTypes`.
