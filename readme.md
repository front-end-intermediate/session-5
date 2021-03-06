# V - Transitioning to the Front End

<!-- TOC -->

- [1. Homework Review](#1-homework-review)
  - [1.1. Environment Variables](#11-environment-variables)
  - [1.2. Transpiling to CSS](#12-transpiling-to-css)
  - [1.3. Adding a Recipe](#13-adding-a-recipe)
  - [1.4. Responsive Recipes](#14-responsive-recipes)
- [2. ES6 Modules](#2-es6-modules)
  - [2.1. ES6 Modules - Demo](#21-es6-modules---demo)
- [3. Webpack](#3-webpack)
  - [3.1. Our Script](#31-our-script)
- [4. Babel](#4-babel)
  - [4.1. ES6 Module Syntax (Demo)](#41-es6-module-syntax-demo)
- [5. Angular as a Templating Engine](#5-angular-as-a-templating-engine)
  - [5.1. Our first Component](#51-our-first-component)
  - [5.2. Routing and Multiple Components](#52-routing-and-multiple-components)
  - [5.3. $HTTP](#53-http)
  - [5.4. Adding Routing to Display Individual Recipes](#54-adding-routing-to-display-individual-recipes)
  - [5.5. Adding the Detail Template](#55-adding-the-detail-template)
  - [5.6. Deleting a Recipe](#56-deleting-a-recipe)
  - [5.7. Adding a Recipe](#57-adding-a-recipe)
  - [5.8. Updating a Recipe](#58-updating-a-recipe)
  - [5.9. Test with Curl](#59-test-with-curl)
  - [5.10. Edit Recipe in the Detail Template](#510-edit-recipe-in-the-detail-template)
  - [5.11. Back button](#511-back-button)
  - [5.12. Edit Button](#512-edit-button)
- [6. Notes](#6-notes)
  - [6.1. Adding an Image](#61-adding-an-image)
  - [6.2. ng-click](#62-ng-click)

<!-- /TOC -->


Add links to the recipe titles in the (non angular) template. When the user clicks on a link they should see a recipe detail page. Try to add navigation to go back to the main recipe listing page.

<a id="markdown-1-homework-review" name="1-homework-review"></a>
## 1. Homework Review

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

<a id="markdown-11-environment-variables" name="11-environment-variables"></a>
### 1.1. Environment Variables

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

<a id="markdown-12-transpiling-to-css" name="12-transpiling-to-css"></a>
### 1.2. Transpiling to CSS

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

<a id="markdown-13-adding-a-recipe" name="13-adding-a-recipe"></a>
### 1.3. Adding a Recipe

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

<a id="markdown-14-responsive-recipes" name="14-responsive-recipes"></a>
### 1.4. Responsive Recipes

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

<a id="markdown-2-es6-modules" name="2-es6-modules"></a>
## 2. ES6 Modules

Code fencing and organization techniques - IIFEs, function expressions.

[Modules](https://webpack.js.org/concepts/modules/) are a way of breaking up JavaScript into smaller, more focused bits of functionality that can be combined.

We have seen CommonJS Modules in Node and are using [them](https://nodejs.org/api/modules.html) in our projects. The `exports` and `require` statements working within our app are CommonJS Modules.

<!-- ES6 modules are not natively supported in the browser so we need to bundle them. Having installed Webpack for bundling we can now use [them](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import). -->

<a id="markdown-21-es6-modules---demo" name="21-es6-modules---demo"></a>
### 2.1. ES6 Modules - Demo

Note the folder `module` in `app` and `index.html` at the top level:

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

Examine `index.js` in the `modules` folder:

```js
function getComponent () {
  var element = document.createElement('div');
  element.innerHTML = ('string');
  return element;
}

document.body.appendChild(getComponent());
```

Test at `http://localhost:3000/module/`

Examine `dep-1.js`:

```js
import dep2 from './dep-2.js';

export default function() {
  return dep2();
}
```

And `dep-2.js`:

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

<a id="markdown-3-webpack" name="3-webpack"></a>
## 3. Webpack

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

<a id="markdown-31-our-script" name="31-our-script"></a>
### 3.1. Our Script

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

<a id="markdown-4-babel" name="4-babel"></a>
## 4. Babel

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

<a id="markdown-41-es6-module-syntax-demo" name="41-es6-module-syntax-demo"></a>
### 4.1. ES6 Module Syntax (Demo)

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

<a id="markdown-5-angular-as-a-templating-engine" name="5-angular-as-a-templating-engine"></a>
## 5. Angular as a Templating Engine

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

<a id="markdown-51-our-first-component" name="51-our-first-component"></a>
### 5.1. Our first Component

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
- Dependency injection for `ngRoute`

`ngRoute` is the router for front end views. Always include a single route in Express for your SPA page. Front end routes handle the view (templates) and the logic (controllers) for the views.

Add a template in a new folder: `app > templates > recipes.html`:

```html`
<div class="wrap">
  <h2>Recipes</h2>
  <ul class="recipes">
    <li ng-repeat="recipe in recipes">
    <img ng-src="img/{{ recipe.image }}">
    <h2><a href="recipes/{{ recipe._id }}">{{ recipe.title }}</a></h2>
    <p>{{ recipe.description }}</p>
    </li>
  </ul>
  </div>
```

Edit the template declaration in myapp.js `templateUrl: '/templates/recipes.html',`:

```js
app.component('recipeList', {
  templateUrl: '/templates/recipes.html',
  controller: function RecipeListController($scope) {
    $scope.name = 'Recipe List'
  }
});
```

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

<a id="markdown-52-routing-and-multiple-components" name="52-routing-and-multiple-components"></a>
### 5.2. Routing and Multiple Components

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

And add the template to our routes:

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

<a id="markdown-53-http" name="53-http"></a>
### 5.3. $HTTP

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

Test the route. 

Note the routes in Express - `app.js`. Since they run in order we will change our front end route to a universal selector and move it so that it appears after all our api routes:

```js
app.get('/api/recipes', recipes.findAll);
app.get('/api/recipes/:id', recipes.findById);
app.post('/api/recipes', recipes.add);
app.put('/api/recipes/:id', recipes.update);
app.delete('/api/recipes/:id', recipes.delete);
app.get('/api/import', recipes.import);
app.get('/api/killall', recipes.killall);
app.post('api/upload'), recipes.upload;

app.get('*', function(req, res) {
  res.sendFile(__dirname + '/app/index.html');
});
```

<a id="markdown-54-adding-routing-to-display-individual-recipes" name="54-adding-routing-to-display-individual-recipes"></a>
### 5.4. Adding Routing to Display Individual Recipes

Note the `recipe._id` expression in the anchor tag:

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

<a id="markdown-55-adding-the-detail-template" name="55-adding-the-detail-template"></a>
### 5.5. Adding the Detail Template

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

Edit the component to use `templateUrl: '/templates/recipe.html',`:

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
      templateUrl: '/templates/recipe.html',
    });
  $locationProvider.html5Mode(true);
});
```

Add:

- `$http` to the dependency list for our controller so we can access the api,
- `$routeParams` so we can access the id in the url, and
- `$scope` so we can make the results of the api call accessible to the view

and use a function to load the data:

```js
app.component('recipeDetail', {
  template: '<div class="wrap">Detail view for {{recipeId}}</div>',

  controller: function RecipeDetailController($http, $routeParams, $scope) {
    $http.get('api/recipes/' + $routeParams.recipeId).then(res => {
      ($scope.recipe = res.data);
      console.log($scope.recipe);
    });
  }
});
```

<a id="markdown-56-deleting-a-recipe" name="56-deleting-a-recipe"></a>
### 5.6. Deleting a Recipe

Wire up the `recipes` template with `<span ng-click="deleteRecipe(recipe._id)">✖︎</span>`:

```html
<div class="wrap">
    <ul class="recipes">
        <li ng-repeat="recipe in recipes | filter:query | orderBy:orderProp">
        <img ng-src="img/{{ recipe.image }}">
        <h2><a href="recipes/{{ recipe._id }}">{{ recipe.title }}</a></h2>
        <p>{{ recipe.description }}</p>
        <span ng-click="deleteRecipe(recipe._id)">✖︎</span>
      </li>
    </ul>
</div>
```

Add a delete function to the recipe list controller in `index.js`:

```js
app.component('recipeList', {
  templateUrl: '/templates/recipes.html',
  
  controller: function RecipeListController($scope, $http) {
    $http.get('api/recipes').then( res => {
      $scope.recipes = res.data;
      console.log($scope.recipes);
    });

    $scope.deleteRecipe = recipeid => console.log(recipeid);
  }
});
```

And test.

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

<a id="markdown-57-adding-a-recipe" name="57-adding-a-recipe"></a>
### 5.7. Adding a Recipe

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

<a id="markdown-58-updating-a-recipe" name="58-updating-a-recipe"></a>
### 5.8. Updating a Recipe

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

<a id="markdown-59-test-with-curl" name="59-test-with-curl"></a>
### 5.9. Test with Curl

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

<a id="markdown-510-edit-recipe-in-the-detail-template" name="510-edit-recipe-in-the-detail-template"></a>
### 5.10. Edit Recipe in the Detail Template

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

<a id="markdown-511-back-button" name="511-back-button"></a>
### 5.11. Back button

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

<a id="markdown-512-edit-button" name="512-edit-button"></a>
### 5.12. Edit Button

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

<a id="markdown-6-notes" name="6-notes"></a>
## 6. Notes

<a id="markdown-61-adding-an-image" name="61-adding-an-image"></a>
### 6.1. Adding an Image

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

<a id="markdown-62-ng-click" name="62-ng-click"></a>
### 6.2. ng-click

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