# V - Transitioning to the Front End

<!-- TOC -->

- [1. Homework](#1-homework)
- [2. Homework Review](#2-homework-review)
  - [2.1. Environment Variables](#21-environment-variables)
  - [2.2. Transpiling to CSS](#22-transpiling-to-css)
  - [2.3. Adding a Recipe](#23-adding-a-recipe)
  - [Responsive Recipes](#responsive-recipes)
- [3. ES6 Modules](#3-es6-modules)
  - [ES6 Modules - Demo](#es6-modules---demo)
- [4. Webpack](#4-webpack)
  - [4.1. Our Script](#41-our-script)
- [5. Babel](#5-babel)
  - [5.1. ES6 Module Syntax (Demo)](#51-es6-module-syntax-demo)
- [6. Angular as a Templating Engine](#6-angular-as-a-templating-engine)
  - [6.1. Our first Component](#61-our-first-component)
  - [6.2. Routing and Multiple Components](#62-routing-and-multiple-components)
  - [6.3. $HTTP](#63-http)
  - [6.4. Filtering and Sorting](#64-filtering-and-sorting)
  - [6.5. Adding Routing to Display Individual Recipes](#65-adding-routing-to-display-individual-recipes)
  - [6.6. Adding the Detail Template](#66-adding-the-detail-template)
  - [6.7. Deleting a Recipe](#67-deleting-a-recipe)
  - [6.8. Adding a Recipe](#68-adding-a-recipe)
  - [6.9. Updating a Recipe](#69-updating-a-recipe)
  - [6.10. Test with Curl](#610-test-with-curl)
  - [6.11. Edit Recipe in the Detail Template](#611-edit-recipe-in-the-detail-template)
  - [6.12. Back button](#612-back-button)
  - [6.13. Edit Button](#613-edit-button)
- [7. Notes](#7-notes)
  - [7.1. Adding an Image](#71-adding-an-image)
  - [7.2. ng-click](#72-ng-click)

<!-- /TOC -->

<a id="markdown-1-homework" name="1-homework"></a>
## 1. Homework

Add links to the recipe titles in the (non angular) template. When the user clicks on a link they should see a recipe detail page and be able to navigate back to the main recipe listing page.

<a id="markdown-2-homework-review" name="2-homework-review"></a>
## 2. Homework Review

Clone the current session by `cd`ing to the desktop and entering:

```sh
git clone https://github.com/front-end-intermediate/session-5.git
```

`cd` into the newly cloned folder, install the npm components from last class and kick off the application:

```sh
npm i
npm start
```

Visit `localhost:3001` in the browser.

I've externalized the `scripts.js` file for `index.html` and it isn't loading. You will need to enable a static directory in  `app.js` file:

```js
app.use(express.static('app'));
```

<a id="markdown-21-environment-variables" name="21-environment-variables"></a>
### 2.1. Environment Variables

Edit the mongoUri variable in `app.js` to use your own database on mLab.

Since the data may be sensitive we will use a `.env` file.

Install [dotenv](https://www.npmjs.com/package/dotenv):

`npm i dotenv -S`

Now create a `.env` file at the root of the project with:

```sh
NODE_ENV=development
DB=recipes-daniel
DB_USER=devereld
DB_PW=dd2345
PORT=3004
```

It is common to not use `.env` files in a production environment and set the values directly on the respective host. You may want to wrap your load statement in an if-statement.

In `app.js`:

```js
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}
console.log(process.env.DB)
```

Use the DB variable:

```js
const mongoUri = `mongodb://${process.env.DB_USER}:${process.env.DB_PW}@ds157223.mlab.com:57223/${process.env.DB}`;
console.log(mongoUri)
```

Set the port in `app.js`:

```js
const PORT = process.env.PORT || 3000;

mongoose.connect(mongoUri, { useNewUrlParser: true }, () => {
  app.listen(PORT);
  console.log(`Server is listening on port ${PORT}`);
});
```

Port 3000 is the default for node applications. 

Test by going to the recipes end point [localhost:3000/api/recipes](localhost:3000/api/recipes).

Return to the home page and click on the link. Note the error in the browser's console.

Since changed ports you'll need to change the port number in `scripts.js`:

```js
fetchRecipes( 'http://localhost:3000/api/recipes', (recipes) => {
  ...
}
```

Visit the import endpoint to import recipes if needed.

Your .env file should never be pushed to version control. It should only include environment-specific values such as database passwords or API keys. Add the `.env` file to `.gitignore`.

For development purposes, I don't want to click the button everytime I need to see my content so I'll start by just calling the function at the bottom of `scripts.js`:

```js
getEm();
```

Review by adding the ingredients:

```js
${recipes.map(
    recipe => `
    <li>
    <h2>${recipe.title}</h2>
    <p>${recipe.ingredients}</p>
    </li>
    `
    ).join('')}
```

Take a look at one of the preparation steps:

```js
`
  <li>
    <h2>${recipe.title}</h2>
    <p>${recipe.ingredients}</p>
    <p>${
      recipe.preparation[0].step
    }</p>
  </li>
  `
```

Display all the preparation steps;

```js
function getEm() {

  fetchRecipes('http://localhost:3001/api/recipes', (recipes) => {
    console.log(recipes)
    const markup = `
      <ul class="recipes">
        ${recipes.map(
      recipe => `
        <li>
          <h2>${recipe.title}</h2>
          <p>${recipe.ingredients}</p>

          <h3>Preparation</h3>
          <ul class="ingredient">
          ${ recipe.preparation.map(
            (prep) => `<li>${(prep.step)}</li>`
          ).join('')
          }
          </ul>

        </li>
        `
        ).join('')}
      </ul>
    `
    elem.innerHTML = markup;
  })
}

getEm();
```

Add the ingredients, an image and description:

```js
function getEm() {

  fetchRecipes('http://localhost:3000/api/recipes', (recipes) => {
    console.log(recipes)
    const markup = `
      <ul class="recipes">
        ${recipes.map(
      recipe => `
        <li>
          <h2>${recipe.title}</h2>
          <p>${recipe.description}</p>
          <img src="img/${recipe.image}" />

          <h3>Ingredients</h3>
          <ul class="ingredient">${
            recipe.ingredients.map(
              (ingredient) => `<li>${ingredient}</li>`
            ).join('')
            }
          </ul>

          <h3>Steps</h3>
          <ul class="ingredient">
          ${ recipe.preparation.map(
            (prep) => `<li>${(prep.step)}</li>`
          ).join('')
          }
          </ul>

        </li>
        `
        ).join('')}
      </ul>
    `
    elem.innerHTML = markup;
  })
}

getEm();
```

<!-- Prevent the default click behavior:

```js
function getEm(e) {
  e.preventDefault();
```

and remove the call added earlier:

```js
// getEm();
``` -->

<a id="markdown-22-transpiling-to-css" name="22-transpiling-to-css"></a>
### 2.2. Transpiling to CSS

Add the following css to `scss/imports/_recipes.scss`:

```css
.recipes {
  margin: 0;
  padding: 0;
  list-style: none;
}

.recipes > li h2 {
  border-bottom: 4px dotted #bada55;
  color: #007eb6;
  font-family: lobster;
  font-size: 2rem;
}
```

Set up for transpiling to CSS by installing node-sass and editing package.json.

```sh
npm i node-sass -D
```

`package.json`:

```js
  "scripts": {
    "sass": "node-sass --watch scss --output app/css --source-map true",
    "nodemon": "nodemon app.js",
    "start": "npm run nodemon & npm run sass"
  },
```

Restart and add a link to `index.html`:

`<link rel="stylesheet" href="css/styles.css">`

Transpiling will occur once you make a change to the SASS. Add this to `_base.scss`:

```css
img {
  width: 100%;
}
```

<a id="markdown-23-adding-a-recipe" name="23-adding-a-recipe"></a>
### 2.3. Adding a Recipe

Here is the form we used in a previous lesson:

```html
<form action="/entries" method="POST">
  <input type="text" placeholder="Story Title" name="title">
  <input type="text" placeholder="Enter 1, 2 or 3" name="multimedia">
  <textarea type="text" placeholder="Story Abstract" name="abstract"></textarea>
  <button type="submit">Submit</button>
</form>
```

Add it to `index.html` and edit it to use the appropriate api endpoint, placeholders, and name attributes.

```html
<form action="/api/recipes" method="POST">
  <input type="text" placeholder="Recipe Title" name="title">
  <input type="text" placeholder="Image" name="image">
  <textarea type="text" placeholder="Description" name="description"></textarea>
  <button type="submit">Submit</button>
</form>
```

Add some css to `_forms.scss`.

```css
input, textarea {
  font-size: 1rem;
  display: block;
  margin: 1rem;
  width: 90%;
  padding: 0.5rem;
}
button {
  color: #fff;
  font-size: 1rem;
  padding: 0.5rem;
  margin: 0 1rem;
  background: #007eb6;
}
```

Be sure to include `app.use(bodyParser.urlencoded({ extended: true }));` in app.js.

Read up on body parser here: [https://medium.com/@adamzerner/how-bodyparser-works-247897a93b90](https://medium.com/@adamzerner/how-bodyparser-works-247897a93b90)

Small item: we'll use our link as a button that will refresh the page. Replace the link in `index.html` with:

```html
  <form action="/" method="get">
    <button>Refresh</button>
  </form>
```

You will need to make adjustments to `scripts.js`:

```js
var elem = document.querySelector('#app');
// var link = document.querySelector('a');

// link.addEventListener('click', getEm)
```

Test the form. Note that the endpoint returns json. 

Edit the controller:

`// return res.sendStatus(200);`

<a id="markdown-responsive-recipes" name="responsive-recipes"></a>
### Responsive Recipes

We need to be able to better see our recipes. Add the following to `_recipes.scss`:

```css
.recipes {
  margin: 0 1rem;
  padding: 0;
  list-style: none;
  
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto 1fr 1fr;
  grid-column-gap: 1.5rem;
  grid-row-gap: 1.5rem;

  h2 {
    color: #007eb6;
    font-family: lobster;
    font-size: 2.5rem;
    border-bottom: 3px solid #999;
    grid-column: 1 / span 2;
  }
  p {
    font-size: 1.25rem;
  }
}

```

Add minimal responsiveness.

First, make sure the html file includes the viewport meta tag:

`<meta name="viewport" content="width=device-width, initial-scale=1.0">`

Then adjust the recipes css:

```js
.recipes {
  margin: 0 1rem;
  padding: 0;
  list-style: none;
  @media (min-width: $breakSm){
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto 1fr 1fr;
    grid-column-gap: 1.5rem;
    grid-row-gap: 1.5rem;
  }
  h2 {
    color: #007eb6;
    font-family: lobster;
    font-size: 2.5rem;
    border-bottom: 3px solid #999;
    grid-column: 1 / span 2;
  }
  p {
    font-size: 1.25rem;
  }
}

```

Note the error. Create a `_variables.scss` file in `scss/imports` and link it to `styles.scss`:

```css
@import 'imports/variables';
@import 'imports/base';
@import 'imports/recipes';
@import 'imports/nav';
@import 'imports/forms';
```

Add the variable to `_variables.scss`:

```css
$breakSm: 380px;
```

<a id="markdown-3-es6-modules" name="3-es6-modules"></a>
## 3. ES6 Modules

Code fencing and organization techniques - IIFEs, function expressions.

[Modules](https://webpack.js.org/concepts/modules/) are a way of breaking up JavaScript into smaller, more focused bits of functionality that can be combined.

We have seen CommonJS Modules in Node and are using [them](https://nodejs.org/api/modules.html) in our projects. The `exports` and `require` statements working within our app are CommonJS Modules.

<!-- ES6 modules are not natively supported in the browser so we need to bundle them. Having installed Webpack for bundling we can now use [them](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import). -->

<a id="markdown-es6-modules---demo" name="es6-modules---demo"></a>
### ES6 Modules - Demo

Create folder `module` in `app` and add `index.html` at the top level

```html
<html>
  <head>
    <title>ES6 modules tryout</title>
  </head>
  <body>
    <script src="index.js" type="module"></script>
  </body>
</html>
```

Create `index.js` in the `modules` folder:

```js
function getComponent () {
  var element = document.createElement('div');
  element.innerHTML = ('string');
  return element;
}

document.body.appendChild(getComponent());
```

Test at `http://localhost:3000/module/`

Create `dep-1.js`:

```js
import dep2 from './dep-2.js';

export default function() {
  return dep2();
}
```

Create `dep-2.js`:

```js
export default function() {
  return 'Hello World, dependencies loaded!';
}
```

Edit `index.js`:

```js
import dep1 from './dep-1.js';

function getComponent () {
  var element = document.createElement('div');
  element.innerHTML = dep1();
  return element;
}

document.body.appendChild(getComponent());
```

<a id="markdown-4-webpack" name="4-webpack"></a>
## 4. Webpack

`npm i webpack webpack-cli -D`

```js
  "scripts": {
    "sass": "node-sass --watch scss --output app/css --source-map true",
    "webpack": "webpack --progress --watch",
    "nodemon": "nodemon app.js",
    "start": "npm run nodemon & npm run sass & npm run webpack"
  },
```

`webpack.config.js`:

```js
const path = require('path');

module.exports = {
  mode: 'none',
  entry: './app/module/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'app/module/')
  }
};
```

```html
  <!-- <script src="js/index.js" type="module"></script> -->
  <script src="bundle.js"></script>
```

<a id="markdown-41-our-script" name="41-our-script"></a>
### 4.1. Our Script

By default the webpack entry value is `./src/index.js`.

Move `scripts.js` into a new `src` directory at the top level and rename it to `index.js`. Move the dependencies there as well.

Add to `index.js`:

`import fetchRecipes from './fetch.js';`

Create `fetch.js` and cut and paste the following code from `index.js` into it:

```js
function fetchRecipes(url, callback) {
  fetch(url)
  .then( res => res.json() )
  .then( data => callback(data) )
  .catch( (err) => { console.error(err)})
}

export default fetchRecipes;
```

Create or edit the `webpack.config.js` file at the top level of the project:

```js
const path = require('path');

module.exports = {
  mode: 'none',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'app/js/')
  }
};
```

Edit `index.html`:

`<script src="js/bundle.js"></script>`

Cut and paste the `getEm` function into a new file `getem.js` and import it into `index.js`:

```js
import fetchRecipes from './fetch.js';
import getEm from './getEm.js';

var elem = document.querySelector('#app');

getEm(elem);
```

Require `fetch` into `getem`:

```js
import fetchRecipes from './fetch.js';

function getEm(elem) {

  fetchRecipes('http://localhost:3000/api/recipes', (recipes) => {

    const markup = `
      <ul class="recipes">
        ${recipes.map(
      recipe => `
        <li>
          <h2>${recipe.title}</h2>
          <p>${recipe.description}</p>
          <img src="img/${recipe.image}" />

          <div class="ingredients">
          <h3>Ingredients</h3>
          <ul class="ingredient">${
            recipe.ingredients.map(
              (ingredient) => `<li>${ingredient}</li>`
            ).join('')
            }
          </ul>
          </div>

          <div class="preparation">
          <h3>Steps</h3>
          <ul class="preparation">
          ${ recipe.preparation.map(
            (prep) => `<li>${(prep.step)}</li>`
          ).join('')
          }
          </ul>
          </div>

        </li>
        `
        ).join('')}
      </ul>
    `
    elem.innerHTML = markup;
  })
}

export default getEm;
```

Note: you will need to pass `elem` to `getem`:

```js
// import fetchRecipes from './fetch.js';
import getEm from './getem.js';

var elem = document.querySelector('#app');

getEm(elem);
```

Setting the mode to production in our webpack configuration will minimize the Javascript.

Adding `devtool: 'source-map',` will create a source map. Restart and review the `js` folder and note the `bundle.js.map`.

`webpack.config.js`:

```js
const path = require('path');

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'app/js/')
  }
};
```

With sourcemap enabled we will get errors with line numbers relative to our pre-bundled files.

e.g.: try temporarily commenting out this line in `fetch.js`:

`export default fetchRecipes;`

<a id="markdown-5-babel" name="5-babel"></a>
## 5. Babel

I'll be following these instructions for adding [Babel](https://webpack.js.org/loaders/babel-loader/#src/components/Sidebar/Sidebar.jsx) to Webpack.

Install babel:

`npm install -D babel-core babel-loader babel-preset-env`

Note the changes from `mode: 'production',` to `mode: 'development',`  in `webpack.config` below:

```js
const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'app/js'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      }
    ]
  }
};
```

Restart the server with and view `http://localhost:3000/`.

(One of the best resources for Webpack is the book at [survivejs](https://survivejs.com).)

<a id="markdown-51-es6-module-syntax-demo" name="51-es6-module-syntax-demo"></a>
### 5.1. ES6 Module Syntax (Demo)

Create `src/test.js`.

Exporting data - using _default_ exports:

```js
const apiKey = 'abcdef';
export default apiKey;
```

Import it into `index.js` (note: paths are not necessary for node modules):

```js
import apiKey from './test';
console.log(apiKey);
```

(Remember, `console.log(apiKey);` is now on the front end and appears in the browser's console.)

The path './test' is relative to the root established in `webpack.config.js`.

Refresh the browser. Note the new variable in the browser's console.

Because we exported it as default, we can rename on import if need be.

In `index.js`:

```js
import foo from './test';
console.log(foo);
```

ES6 Modules can only have one default export but _can_ have multiple named exports.

A _named_ export in `test.js`:

`export const apiKey = 'abcdef';`

requires an import that selects it in `index.js`:

```js
import { apiKey } from './test';
console.log(apiKey);
```

Multiple named exports encourage code encapsulation and reuse across multiple projects.

Functions can be internal to a module or exported.

`test.js`:

```js
export const apiKey = 'abcdef';
export const url = 'https://mlab.com';

export function sayHi(name) {
  console.log(`Say hello ${name}`);
}
```

```js
import { apiKey as foo, url, sayHi } from './test';
sayHi('daniel');
console.log(foo, url);
```

See [the documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export) for options including `import as`, `export as` and exporting multiple items.

<a id="markdown-6-angular-as-a-templating-engine" name="6-angular-as-a-templating-engine"></a>
## 6. Angular as a Templating Engine

Let's look at using Angular as our page templating language. Documentation for the features we will be using is located [here](https://docs.angularjs.org/guide).

Save the contents of `index.js` and `index.html` to `index-OLD.html` and `index-OLD.js`. 

Edit `index.html` page in the `app` directory:

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recipes</title>
    <link rel="stylesheet" href="css/styles.css">
    <script src="/js/bundle.js"></script>
</head>

<body>
    <p>It works</p>
</body>

</html>
```

The npm installs for Angular:

```sh
npm i -S angular@1.6.2 angular-route@1.6.2
```

In the old days you would use `<script>` tags to access libraries etc., e.g.:

`<script src="https://code.angularjs.org/1.6.2/angular.js"></script>`

Since we are bundling we use ES6 imports and our installed packages in `node_modules`.

Delete all the content in `index.js` and import angular and angular routing into `index.js`:

```js
import angular from 'angular';
import ngRoute from 'angular-route';
```

(Note that your bundle just got very large.)

<a id="markdown-61-our-first-component" name="61-our-first-component"></a>
### 6.1. Our first Component

Bootstrap the app in `index.html` and add a custom tag:

```html
<body ng-app="foodApp">
  <div>
    <recipe-list></recipe-list>
  </div>
</body>
```

Create the first component:

```js
import angular from 'angular';
import ngRoute from 'angular-route';

const app = angular.module('foodApp', ['ngRoute']);

app.component('recipeList', {
  template: `<div class="wrap"><h1>{{ name }} component</h1></div>`,
  controller: function RecipeListController($scope) {
    $scope.name = 'Recipe List'
  }
});
```

View the page in the browser.


- [MVC](https://en.wikipedia.org/wiki/Model–view–controller) - Model, View, Controller
- `{{ }}` - "moustaches" or "handlebars" in the template evaluate a value
- `$scope` - the "glue" between application controller and the view (the state)
- ng-model (and ng-repeat etc.) is an Angular [directive](https://docs.angularjs.org/api/ng/directive)
- AngularJS vs Angular
- Dependency injection for `ngRoute`:

`const app = angular.module('foodApp', ['ngRoute']);`

`ngRoute` supplants Express routes for handling front end views. Always include a single route in Express for your SPA page. Angular routes handle the view (templates) and the logic (controllers) for the views.

Add a template in a new folder: `app > templates > recipes.html`:

```html`
<div class="wrap">
<ul class="recipes">
  <li ng-repeat="recipe in recipes">
  <img ng-src="img/{{ recipe.image }}">
  <h2><a href="recipes/{{ recipe._id }}">{{ recipe.title }}</a></h2>
  <p>{{ recipe.description }}</p>
  </li>
</ul>
</div>
```

Edit the template declaration in myapp.js:

`templateUrl: '/templates/recipes.html',`

<!-- ### Formatting

```js
{
  "liveSassCompile.settings.formats": [
      {
        "savePath": "static/css/",
        "format": "expanded"
      }
    ],
    "liveSassCompile.settings.excludeList": [ 
      "**/node_modules/**",
      ".vscode/**",
      "**/other/**"
    ],
}

``` -->

<a id="markdown-62-routing-and-multiple-components" name="62-routing-and-multiple-components"></a>
### 6.2. Routing and Multiple Components

Create our first route using [Angular's ngRoute](https://docs.angularjs.org/api/ngRoute):

```js
app.config(function config($locationProvider, $routeProvider) {
  $routeProvider.when('/', {
    template: `
      <div class="wrap">
        <h1>Home</h1>
      </div>
      `
  });
  $locationProvider.html5Mode(true);
});
```

Note the `$`'s. These are [services](https://docs.angularjs.org/api/ng/service) and are made available to a function by declaring them.

Add in the head of index.html:

`<base href="/">`

Currently the component is hard coded:

```html
  <div>
    <recipe-list></recipe-list>
  </div>
```

Use the `ng-view` directive to alow it to use whatever module we pass into it:

```html
<body ng-app="foodApp">
  <div ng-view></div>
</body>
```

And add the template to our Angular route:

```js
app.config(function config($locationProvider, $routeProvider) {
  $routeProvider
    .when('/', {
      template: `
      <div class="wrap">
        <h1>Home</h1>
      </div>
      `
    })
    .when('/recipes', {
      template: '<recipe-list></recipe-list>'
    });
  $locationProvider.html5Mode(true);
});
```

Test the route. (Note the routes in Express - `app.js`.)

```js
app.get('*', function(req, res) {
  res.sendFile(__dirname + '/app/index.html');
});
```

<!-- ### The Navbar

Using: `ng-class`

Create a new controller in `index.js`:

```js
app.controller('NavController', function($scope, $location) {
  $scope.isActive = function(viewLocation) {
    var active = viewLocation === $location.path();
    return active;
  };
});
```

Create the navigation using `ng-class` and this pattern:

```html
<nav ng-controller="NavController">
  <div class="panels">
    <div class="panel panel1" ng-class="{ active: isActive('/') }">
      <a href="/">Home</a>
    </div>
    <div class="panel panel2" ng-class="{ active: isActive('/recipes') }">
      <a href="/recipes">Recipes</a>
    </div>
    <div class="panel panel3" ng-class="{ active: isActive('/reviews') }">
      <a href="/reviews">Reviews</a>
    </div>
    <div class="panel panel4" ng-class="{ active: isActive('/delivery') }">
      <a href="/delivery">Delivery</a>
    </div>
    <div class="panel panel5" ng-class="{ active: isActive('/about') }">
      <a href="/about">About</a>
    </div>
  </div>
</nav>
```

Format the navigation.

`_nav.scss`:

```css
nav {
  height: 6rem;
}

.panels {
  min-height: 100%;
  overflow: hidden;
  display: flex;
}

.panel {
  flex: 1; /* Each panel takes an equal width */
  display: flex;
  background: #000;
  color: white;
  font-size: 1rem;
  background-size: cover;
  background-position: center;
  // transition: font-size 0.7s linear, flex 0.7s linear;
  transition: font-size 0.7s cubic-bezier(0.57,-0.43, 0.75, 1.23), flex 0.7s cubic-bezier(0.61,-0.19, 0.7,-0.11);

}

.panel1 {
  background-image: url(/img/1.jpg);
}
.panel2 {
  background-image: url(/img/2.jpg);
}
.panel3 {
  background-image: url(/img/4.jpg);
}
.panel4 {
  background-image: url(/img/3.jpg);
}
.panel5 {
  background-image: url(/img/5.jpg);
}

.panel a {
  flex: 1 0 auto; 
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  width: 100%;

  color: #fff;
  text-decoration: none;
  font-family: 'Lobster', cursive;
  text-shadow: 0 0 4px rgba(0, 0, 0, 0.72), 0 0 14px rgba(0, 0, 0, 0.45);
  font-size: 1.5em;
}

.panel.active {
  flex: 2;
  font-size: 1.5em;
}
```

Optional - create a component for the navbar.

```js
app.component('navList', {
  templateUrl: '/templates/navigation.html',
  controller: function NavController($scope, $location) {
    $scope.isActive = function(viewLocation) {
      var active = viewLocation === $location.path();
      return active;
    };
  }
})
```

Remove the reference to controller in the html template:

```html
<nav>
  <div class="panels">
    <div class="panel panel1" ng-class="{ active: isActive('/') }">
      <a href="/">Home</a>
    </div>
    <div class="panel panel2" ng-class="{ active: isActive('/recipes') }">
      <a href="/recipes">Recipes</a>
    </div>
    <div class="panel panel3" ng-class="{ active: isActive('/reviews') }">
      <a href="/reviews">Reviews</a>
    </div>
    <div class="panel panel4" ng-class="{ active: isActive('/delivery') }">
      <a href="/delivery">Delivery</a>
    </div>
    <div class="panel panel5" ng-class="{ active: isActive('/about') }">
      <a href="/about">About</a>
    </div>
  </div>
</nav>
``` -->

<a id="markdown-63-http" name="63-http"></a>
### 6.3. $HTTP

Let's use our recipes api.

We fetch the dataset from our server using Angular's built-in [$http](https://docs.angularjs.org/api/ng/service/$http) service.

- a core (built into Angular) service that facilitates communication with the remote HTTP servers
- need to make it available to the recipeList component's controller via [dependency injection](https://docs.angularjs.org/guide/di)
- AngularJS predates `fetch`

Use `get` method with `$http` to fetch the json from the data folder:

```js
app.component('recipeList', {
  templateUrl: '/templates/recipes.html',
  controller: function RecipeListController($scope, $http) {
    $http.get('api/recipes').then( res => {
      $scope.recipes = res.data;
      console.log($scope.recipes);
    });
  }
});
```

In `recipes.html`. change:

```html
<li ng-repeat="recipe in $ctrl.recipes">
```

to:

```html
<li ng-repeat="recipe in recipes">
```

<a id="markdown-64-filtering-and-sorting" name="64-filtering-and-sorting"></a>
### 6.4. Filtering and Sorting

Add to the `recipes.html` template:

```html
<div class="wrap">
  <ul>
    <li>
      <p>Filter: <input ng-model="query" /> </p>
      <p>Sort by:
        <select ng-model="orderProp">
          <option value="title">Alphabetical</option>
          <option value="date">Newest</option>
        </select>
      </p>
    </li>
  </ul>
</div>
```

Edit the ng-repeat:

`<li ng-repeat="recipe in recipes | filter:query | orderBy:orderProp">`

Add a line to the controller that sets the default value of `orderProp` to `date`. If you do not set a default value here, the `orderBy` filter will remain uninitialized until the user picks an option from the drop-down menu.

`this.orderProp = 'date';`:

```js
app.component('recipeList', {
  templateUrl: '/templates/recipes.html',
  controller: function RecipeListController($scope, $http) {
    $http.get('api/recipes').then( res => {
      $scope.recipes = res.data;
      console.log($scope.recipes);
    });

    $scope.orderProp = 'date';
  }
});
```

[`orderBy`](https://docs.angularjs.org/api/ng/filter/orderBy) is a `filter` that takes an array, copies it, reorders the copy and returns it.

Data-binding via `$scope` is one of the core features in Angular. When the page loads, Angular binds the value of the input box to the data model in the controller.

The text that the user types into the input box (bound to `query`) is available as a filter input in the list repeater (`recipe in recipes | filter:query`). When changes to the data model cause the repeater's input to change, the repeater updates the DOM to reflect the current state of the model.

The [filter](https://docs.angularjs.org/api/ng/filter/filter) function uses the `$ctrl.query` value to create a new array that contains only those records that match the query.

<a id="markdown-65-adding-routing-to-display-individual-recipes" name="65-adding-routing-to-display-individual-recipes"></a>
### 6.5. Adding Routing to Display Individual Recipes

Note the `recipe.._id` expression in the anchor tag:

`<h1><a href="recipes/{{ recipe._id }}">{{ recipe.title }}</a></h1>`

Clicking on the individual recipe shows a parameter in the browser's location bar. We do not have routes set up for these yet.

A module's `.config()` method gives us access to tools for configuration.

To make the providers, services and directives defined in `ngRoute` available to our application, we added ngRoute as a dependency to our foodApp module:

```js
angular.module('foodApp', ['ngRoute']);
```

Application routes in Angular are declared via `$routeProvider`. This service makes it easy to wire together controllers, view templates, and the current URL location in the browser.

Add a route in `index.js` for the new recipe links:

```js
app.config(function config($locationProvider, $routeProvider) {
  $routeProvider
    .when('/', {
      template: '<h1>Home</h1>'
    })
    .when('/recipes', {
      template: '<recipe-list></recipe-list>'
    })
    .when('/recipes/:recipeId', {
      template: '<recipe-detail></recipe-detail>'
    });
  $locationProvider.html5Mode(true);
});
```

All variables defined with the `:` prefix are extracted into a (injectable) `$routeParams` object.

We inject the routeParams service of `ngRoute` into our controller so that we can extract the recipeId and use it in our stub.

```js
app.component('recipeDetail', {
  template: '<div class="wrap">Detail view for {{recipeId}}</div>',

  controller: function RecipeDetailController($scope, $routeParams) {
    $scope.recipeId = $routeParams.recipeId;
  }
});
```

Clicking on the recipe links in the list view should take you to our stub template.

<a id="markdown-66-adding-the-detail-template" name="66-adding-the-detail-template"></a>
### 6.6. Adding the Detail Template

Create `templates/recipe.html`:

```html
<div class="wrap">
  <ul class="recipes single">
    <li>
      <h2>{{ recipe.title }}</h2>
      <img src="img/{{recipe.image}}" />
      <p>{{ recipe.description }}</p>

      <h3>Ingredients</h3>
      <ul class="ingredients">
        <li ng-repeat="ingredient in recipe.ingredients">
          {{ ingredient }}
        </li>
      </ul>
    </li>
  </ul>
</div>
```

Edit the component to use `templateUrl`:

```js
  templateUrl: '/templates/recipe.html',
```

Add:

- `$http` to the dependency list for our controller so we can access the api,
- `$routeParams` so we can access the id in the url, and
- `$scope` so we can make the results of the api call accessible to the view

and use a function to load the data:

```js
  controller: function RecipeDetailController($http, $routeParams, $scope) {
    $http.get('api/recipes/' + $routeParams.recipeId).then(res => {
      ($scope.recipe = res.data);
      console.log($scope.recipe);
    });
  }
```

<a id="markdown-67-deleting-a-recipe" name="67-deleting-a-recipe"></a>
### 6.7. Deleting a Recipe

Wire up the `deleteRecipe` function with `ng-click`:

```html
  <ul class="recipes">
      <li ng-repeat="recipe in recipes | filter:query | orderBy:orderProp">
      <img ng-src="img/{{ recipe.image }}">
      <h2><a href="recipes/{{ recipe._id }}">{{ recipe.title }}</a></h2>
      <p>{{ recipe.description }}</p>
      <span ng-click="deleteRecipe(recipe._id)">✖︎</span>
    </li>
  </ul>
```

Add a delete function to the list controller in `index.js`:

```js
app.component('recipeList', {
  templateUrl: '/templates/recipes.html',
  
  controller: function RecipeListController($scope, $http) {
    $http.get('api/recipes').then( res => {
      $scope.recipes = res.data;
      console.log($scope.recipes);
    });
    $scope.orderProp = 'date';

    $scope.deleteRecipe = recipeid => console.log(recipeid);
  }
});
```

Use the api:

```js
    $scope.deleteRecipe = recipeid => $http.delete('/api/recipes/' + recipeid);
```

Clicking on an `✖︎` will remove a recipe but you need to refresh to see the result. It has no effect on the view ($scope).

Pass the `index` of the selected recipe to the function:

```html
<span ng-click="deleteRecipe(index, recipe._id)">✖︎</span>
```

Add a promise and use the Array method [splice](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice) on the index to update the scope.

Catch the index in the function (`(index, recipeid)`) and call `then` on it to `splice` the array in scope:

```js
$scope.deleteRecipe = (index, recipeid) =>
    $http.delete(`/api/recipes/${recipeid}`)
    .then(() => $scope.recipes.splice(index, 1));
```

Changes to the db persist and are relected in the view.

<!-- ### 1.9.3. Animation

Check the project preferences:

```js
{
  "liveSassCompile.settings.formats": [
      {
        "savePath": "static/css/",
        "format": "expanded"
      }
    ],
    "liveSassCompile.settings.excludeList": [
      "**/node_modules/**",
      ".vscode/**",
      "**/other/**"
    ],
}
```

`npm i --save angular-animate@1.6.2`

Inject `ng-animate` as a dependency in the module:

`const app = angular.module('recipeApp', ['ngAnimate']);`

Add the class `fade` to the `li`'s in the html.

Add this css to `_base.css`:

```css
ul li:nth-child(odd) {
    background: #bada55;
}

.fade.ng-enter {
    animation: 2s appear;
}
.fade.ng-leave {
    animation: 0.5s disappear;
}

@keyframes appear {
    from {
        opacity: 0;
        transform: translateX(-200px);
    }
    to {
        opacity: 1;
    }
}
@keyframes disappear {
    0% {
        opacity: 1;
    }
    50% {
        font-size: 0.75rem;
    }
    75% {
        color: green;
    }
    100% {
        opacity: 0;
        transform: translateX(-100%);
    }
}
``` -->

<a id="markdown-68-adding-a-recipe" name="68-adding-a-recipe"></a>
### 6.8. Adding a Recipe

Add a form to the recipes template:

```html
<form ng-submit="addRecipe(recipe)">
    <input type="text" ng-model="recipe.title" required placeholder="Title" />
    <textarea type="text" ng-model="recipe.description" required placeholder="Description"></textarea>
    <input type="text" ng-model="recipe.image" required placeholder="Image" />
    <button type="submit">Add Recipe</button>
</form>
```

Add to the recipeList component in `index.js`:

```js
$scope.addRecipe = function(data) {
    $http.post('/api/recipes/', data).then(() => {
        $scope.recipes.push(data);
    });
};
```

e.g.:

```js
const app = angular.module('recipeApp', ['ngAnimate']);

app.component('recipeList', {
    templateUrl: '/js/recipe-list.template.html',
    controller: function RecipeAppController($http, $scope) {
        $http.get('/api/recipes').then(res => {
            $scope.recipes = res.data;
        });

        $scope.deleteRecipe = (index, recipeid) =>
            $http.delete('/api/recipes/' + recipeid).then(() => $scope.recipes.splice(index, 1));

        $scope.addRecipe = function(data) {
            $http.post('/api/recipes/', data).then(() => {
                $scope.recipes.push(data);
            });
        };
    }
});
```

Test by adding a recipe

Edit the push to use the data returned by the response:

```js
$scope.addRecipe = function(data) {
    $http.post('/api/recipes/', data).then(res => {
        console.log(res.data);
        $scope.recipes.push(res.data);
        $scope.recipe = {};
    });
};
```

The complete component:

```js
app.component('recipeList', {
  templateUrl: '/templates/recipes.html',
  controller: function RecipeListController($scope, $http) {
    $http.get('api/recipes').then( res => {
      $scope.recipes = res.data;
    });

    $scope.orderProp = 'date';

    $scope.deleteRecipe = (index, recipeid) => {
      console.log(index, recipeid)
      $http.delete(`/api/recipes/${recipeid}`)
      .then ($scope.recipes.splice(index, 1));
    }

    $scope.addRecipe = function(data) {
      $http.post('/api/recipes/', data).then(() => {
        $scope.recipes.push(data);
      });
    };

  }
});
```

<!-- 
```js
const app = angular.module('recipeApp', ['ngAnimate']);

app.component('recipeList', {
    templateUrl: '/js/recipe-list.template.html',
    controller: function RecipeAppController($http, $scope) {
        $http.get('/api/recipes').then(res => {
            $scope.recipes = res.data;
        });

        $scope.deleteRecipe = function(index, recipeid) {
            $http.delete('/api/recipes/' + recipeid).then(() => $scope.recipes.splice(index, 1));
        };
        $scope.addRecipe = function(data) {
            $http.post('/api/recipes/', data).then(res => {
                $scope.recipes.push(res.data);
                $scope.recipe = {};
            });
        };
    }
});
``` 
-->

<a id="markdown-69-updating-a-recipe" name="69-updating-a-recipe"></a>
### 6.9. Updating a Recipe

`put` HTTP actions in a REST API correlate to an Update method.

The route for Update also uses an `:id` parameter.

In `recipe.controllers.js`:

```js
exports.update = function(req, res) {
    const id = req.params.id;
    const updates = req.body;

    Recipe.update({ _id: id }, updates, function(err) {
        if (err) return console.log(err);
        return res.sendStatus(202);
    });
};
```

Notice the updates variable storing the `req.body`. `req.body` is useful when you want to pass in larger chunks of data like a single JSON object. Here we will pass in a JSON object (following the schema) of only the model's properties you want to change.

The model's update() takes three parameters:

- JSON object of matching properties to look up the doc with to update
- JSON object of just the properties to update
- callback function that returns any errors

<a id="markdown-610-test-with-curl" name="610-test-with-curl"></a>
### 6.10. Test with Curl

We will need to construct this line using ids from the recipes listing and test it in a new Terminal tab. Edit the URL to reflect both the port and id of the target recipe:

(Check the below for proper URL - it changes depending on the port in use as well as the id.)

```sh
curl -i -X PUT -H 'Content-Type: application/json' -d '{"title": "Big Mac"}' http://localhost:3002/api/recipes/5b32895059ea391966aa3825

```

This sends a JSON Content-Type PUT request to our update endpoint. That JSON object is the request body, and the long hash at the end of the URL is the id of the recipe we want to update.

Visit the same URL from the cURL request in the browser to see the changes.

PUT actions are cumbersome to test in the browser, so we'll use Postman to run through the process of editing a recipe above.

1: Set the action to put and the url to a single entry with an id.

2: Set the body to `raw` and the `text` header to application/json

3: put `{ "title": "Toast", "image": "toast.jpg", "description": "Tasty!" }`

4: Test to see changes

<a id="markdown-611-edit-recipe-in-the-detail-template" name="611-edit-recipe-in-the-detail-template"></a>
### 6.11. Edit Recipe in the Detail Template

We will allow the user to edit a recipe in the detail view - showing and hiding the editor in the UI using Angular's [ng-show / hide](https://docs.angularjs.org/api/ng/directive/ngShow) function.

Edit `templates/recipe.html`:

```html
<div class="wrap" ng-hide="editorEnabled">
  <h1>{{ recipe.title }}</h1>
  <img ng-src="img/recipes/{{ recipe.image }}" style="width: 200px;"/>
  <p>{{ recipe.description }}</p>

  <h3>Ingredients</h3>
  <ul class="ingredients">
      <li ng-repeat="ingredient in recipe.ingredients">
          {{ ingredient }}
      </li>
  </ul>
  <button ng-click="toggleEditor(recipe)">Edit</button>
</div>

<div class="wrap" ng-show="editorEnabled">
    <form ng-submit="saveRecipe(recipe, recipe._id)" name="updateRecipe">
        <label>Title</label>
        <input ng-model="recipe.title">
        <label>Date</label>
        <input ng-model="recipe.date">
        <label>Description</label>
        <input ng-model="recipe.description">
        <label>Image</label>
        <input ng-model="recipe.image">
        <label>ID</label>
        <input ng-model="recipe._id">
        <button type="submit">Submit</button>
    </form>
    <button type="cancel" ng-click="toggleEditor()">Cancel</button>
</div>

<button type="submit" ng-click="back()">Back</button>
```

<!-- Add a link using the id `href="/recipes/{{ recipe._id }}"` to the existing `recipe-list.template`:

```html
<ul>
  <li ng-repeat="recipe in recipes" class="fade">
      <a href="/recipes/{{ recipe._id }}">{{ recipe.title }} / {{ recipe._id }}</a>
      <span ng-click="deleteRecipe($index, recipe._id)">✖︎</span>
  </li>
</ul>
```

2: Create a `recipeDetail` component in the module.

Use $http.get and $routeParams to grab the info from our api route:

```js
app.component('recipeDetail', {
    templateUrl: '/js/recipe-detail.template.html',
    controller: function RecipeDetailController($http, $routeParams) {
        $http.get('/api/recipes/' + $routeParams.recipeId).then(response => (this.recipe = response.data));
    }
});
``` -->

<!-- Test by clicking on one of the links - you should now be able to view the detail template.

Due to routes in `app.js` refreshing a detail page will not work.

We can try the following in `app.js`

```js
app.get('*', (req, res) => {
    res.sendFile(__dirname + '/static/index.html');
});
``` -->

<a id="markdown-612-back-button" name="612-back-button"></a>
### 6.12. Back button

```js
$scope.back = () => window.history.back();
```

e.g.:

```js
app.component('recipeDetail', {
  templateUrl: '/templates/recipe.html',
  
  controller: function RecipeDetailController($http, $routeParams, $scope) {
    $http.get('api/recipes/' + $routeParams.recipeId).then(res => {
      ($scope.recipe = res.data);
    });

    $scope.back = () => window.history.back();
  }
});
```

<a id="markdown-613-edit-button" name="613-edit-button"></a>
### 6.13. Edit Button

Toggling the editor interface:

```js
    $scope.editorEnabled = false;
    $scope.toggleEditor = () => ($scope.editorEnabled = !$scope.editorEnabled);
```

e.g.:

```js
app.component('recipeDetail', {
  templateUrl: '/templates/recipe.html',
  
  controller: function RecipeDetailController($http, $routeParams, $scope) {
    $http.get('api/recipes/' + $routeParams.recipeId).then(res => {
      ($scope.recipe = res.data);
    });

    $scope.back = () => window.history.back();

    $scope.editorEnabled = false;
    $scope.toggleEditor = () => ($scope.editorEnabled = !$scope.editorEnabled);
  }
});
```

<!-- Test this by changing the default value to true:

`this.editorEnabled = true;`

Add a button that only shows when the editor is on:

```html
<button type="cancel" ng-click="$ctrl.toggleEditor()">Cancel</button>
```

e.g.:

```html
<div ng-show="$ctrl.editorEnabled">
    <form ng-submit="$ctrl.saveRecipe($ctrl.recipe, $ctrl.recipe._id)" name="updateRecipe">
        <label>Title</label>
        <input ng-model="$ctrl.recipe.title">
        <label>Date</label>
        <input ng-model="$ctrl.recipe.date">
        <label>Description</label>
        <input ng-model="$ctrl.recipe.description">
        <label>Image</label>
        <input ng-model="$ctrl.recipe.image">
        <label>ID</label>
        <input ng-model="$ctrl.recipe._id">
        <input type="submit" value="Save">
    </form>
    <button type="cancel" ng-click="$ctrl.toggleEditor()">Cancel</button>
</div>
<button type="submit" ng-click="$ctrl.back()">Back</button>
``` -->

Update the recipe detail controller with a save recipe function:

```js
$scope.saveRecipe = (recipe, recipeid) => {
  $http.put('/api/recipes/' + recipeid, recipe).then(res => ($scope.editorEnabled = false));
};
```

e.g.:

```js
app.component('recipeDetail', {
  templateUrl: '/templates/recipe.html',
  
  controller: function RecipeDetailController($http, $routeParams, $scope) {
    $http.get('api/recipes/' + $routeParams.recipeId).then(res => {
      ($scope.recipe = res.data);
    });

    $scope.back = () => window.history.back();

    $scope.editorEnabled = false;
    $scope.toggleEditor = () => ($scope.editorEnabled = !$scope.editorEnabled);

    $scope.saveRecipe = (recipe, recipeid) => {
      $http.put('/api/recipes/' + recipeid, recipe).then(res => ($scope.editorEnabled = false));
    };
  }
});
```

And test.

<a id="markdown-7-notes" name="7-notes"></a>
## 7. Notes

<a id="markdown-71-adding-an-image" name="71-adding-an-image"></a>
### 7.1. Adding an Image

Implement an image switcher within our recipe details component.

Note this entry in recipe1309.json: `"mainImageUrl": "lasagna-1.png",`

Add to the template after the header:

`<img ng-src="img/home/{{ $ctrl.recipe.mainImageUrl }}" />`

We are creating an image switcher so we will create a new function in the recipe-detail component:

```js
controller: function RecipeDetailController($http, $routeParams) {
  $http.get('data/' + $routeParams.recipeId + '.json').then(response => {
    this.recipe = response.data;
  });
  this.setImage = imageUrl => (this.mainImageUrl = imageUrl);
}
```

Followed by a call to the function _in the promise function_ to initialize the first image:

```js
controller: function RecipeDetailController($http, $routeParams) {
  $http.get('data/' + $routeParams.recipeId + '.json').then(response => {
    this.recipe = response.data;
    this.setImage(this.recipe.images[3]);
  });
  this.setImage = imageUrl => (this.mainImageUrl = imageUrl);
}
```

Note: changing the index in the setImage call doesn't work yet.

And make the following change to the template, adding a class for styling and a source which uses the `mainImageUrl` variable we created in the controller:

`<img ng-src="img/home/{{$ctrl.mainImageUrl}}" class="recipe-detail-image" />`

(Note: we no longer need `"mainImageUrl": "images/home/lasagna-1.png",` in the json since we are now refering to the images array.)

<a id="markdown-72-ng-click" name="72-ng-click"></a>
### 7.2. ng-click

Add a list of images to the template that we will click on to swap out the main image.

Note the `ng-click` directive and its call to the setImage function we created earlier (this goes below the img tag):

```html
<ul class="recipe-thumbs">
    <li ng-repeat="img in $ctrl.recipe.images">
        <img ng-src="img/home/{{img}}" ng-click="$ctrl.setImage(img)" />
    </li>
</ul>
```

You should now be able to click on one of the images in the list to swap out the main image.

Final refactored component:

```js
app.component('recipeDetail', {
  templateUrl: '/includes/recipe.html',

  controller: function RecipeDetailController($http, $routeParams) {
    $http.get('data/' + $routeParams.recipeId + '.json').then(response => {
      this.recipe = response.data;
      this.setImage(this.recipe.images[3]);
    });
    this.setImage = imageUrl => (this.mainImageUrl = imageUrl);
  }
});
```

`https://www.twilio.com/blog/2017/08/working-with-environment-variables-in-node-js.html`

`https://www.npmjs.com/package/dotenv`

`https://www.contentful.com/blog/2017/04/04/es6-modules-support-lands-in-browsers-is-it-time-to-rethink-bundling/`

https://www.zeolearn.com/magazine/connecting-reactjs-frontend-with-nodejs-backend