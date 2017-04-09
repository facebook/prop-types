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

## Development and Production Versions

In production, all validator functions are replaced with empty functions that throw an error. This is done to optimize the bundle size.

Don’t call the validator functions manually in your code. React automatically calls `PropTypes` validators declared on your components in development version, and it won’t call them in production.

If you use a bundler like Browserify or Webpack, don’t forget to [follow these instructions](https://facebook.github.io/react/docs/installation.html#development-and-production-versions) to correctly bundle your application in development or production mode. Otherwise you’ll ship unnecessary code to your users.

## Usage

Refer to the [React documentation](https://facebook.github.io/react/docs/typechecking-with-proptypes.html) for more information.
