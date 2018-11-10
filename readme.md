# V - Front End Frameworks

Install the npm components from last class and kick off the application:

```sh
$npm i
$npm start
```

Visit `localhost:3001` in the browser.

## Homework Review

Edit the mongoUri variable in `app.js` to use your own database on mLab. 

```js
const mongoUri = 'mongodb://<db-username>:<db-userpassword>@ds157223.mlab.com:57223/recipes-daniel';
```

Test by going to the recipes end point [localhost:3001/api/recipes](localhost:3001/api/recipes).

Return to the home page and click on the link. Note the error in the browser's console.

`scripts.js` file for `index.html` you will need to add this to the `app.js` file:

`app.use(express.static('app'));`

For development purposes, I don't want to click the button everytime I need to see my content so I'll start by just calling the function at the bottom of `scripts.js`:

```js
getEm();
```

Start by adding the ingredients:

```js
<li>
  <h2>${recipe.title}</h2>
  <p>${recipe.ingredients}</p>
</li>
```

Take a look at one of the preparation steps:

```js
recipe => `
  <li>
    <h2>${recipe.title}</h2>
    <p>${recipe.ingredients}</p>
    <p>${
      recipe.preparation[0].step
    }</p>
  </li>
  `
```

Display the preparation steps;

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

Add the ingredients and description:

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

Prevent the default click behavior:

```js
function getEm(e) {
  e.preventDefault();
```

and remove the call added earlier:

```js
// getEm();
```

Add images to the final script:


```js
function getEm(e) {
  e.preventDefault();
  fetchRecipes('http://localhost:3001/api/recipes', (recipes) => {
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
```

Add a touch of css

```css
ul.recipes {
  margin: 0;
  padding: 0;
  list-style: none;
}

ul.recipes > li h2 {
  border-top: 3px solid #999;
}

img {
  width: 100%;
}
```

Be sure to include `app.use(bodyParser.urlencoded({ extended: true }));` in app.js. Read up on it here: https://medium.com/@adamzerner/how-bodyparser-works-247897a93b90











## Webpack and Angular Components

## Webpack and Babel

Note the dependencies.

```js
  "dependencies": {
    "angular": "^1.6.2",
    "angular-route": "^1.6.2",
    "body-parser": "^1.18.3",
    "express": "^4.16.3",
    "mongoose": "^5.1.6"
  },
  "devDependencies": {
    "babel-core": "^6.26.3",
    "babel-loader": "^7.1.4",
    "babel-preset-env": "^1.7.0",
    "concurrently": "^3.6.0",
    "webpack": "^4.12.0",
    "webpack-cli": "^3.0.8"
  }
```

We'll be using [Babel](https://babeljs.io) with [Webpack](https://webpack.js.org) using the basic concepts presented [here](https://webpack.js.org/concepts/).

Create `webpack.config.js`:

```js
const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'static/js'),
    filename: 'bundle.js'
  }
};
```

In `src/index.js`

```js
const getMessage = () => 'Hello World';
document.getElementById('output').innerHTML = getMessage();
```

Note Webpack in our scripts:

```js
  "scripts": {
    "start": "nodemon app.js",
    "build": "webpack --progress --watch",
    "boom!": "concurrently \"npm run start\" \"npm run build\" "
  },
```

Note the settings in `app.js`.

`npm run boom!`

Review `index.html`, `bundle.js` and note the `bundle.js.map`.

I'll be following these instructions for adding [Babel](https://webpack.js.org/loaders/babel-loader/#src/components/Sidebar/Sidebar.jsx) to Webpack.

Note the change from `mode: 'production',` to `mode: 'development',` below:

```js
const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'static/js'),
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

Restart the server with `boom!` and view `http://localhost:3001/`.

One of the best resources for Webpack is the book at [survivejs](https://survivejs.com).

## ES6 Modules

[Modules](https://webpack.js.org/concepts/modules/) are a way of breaking up JavaScript into smaller, more focused bits of functionality that can be combined.

We have seen CommonJS Modules in Node and are already using [them](https://nodejs.org/api/modules.html) in our projects. The `exports` and `require` statements working within our app are CommonJS Modules.

ES6 modules are not natively supported in the browser so we need to bundle them. Having installed Webpack for bundling we can now use [them](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import).

### ES6 Module Syntax

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

(The path './test' is relative to the root established in `webpack.config.js`.)

Refresh the browser. Note the new variable in the browser's console.

Because we exported it as default we can rename on import if need be.

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

Functions can be internal to a module or exported:

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

Review [the documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export) on MDN for options including `import as`, `export as` and exporting multiples.

## Angular as a Templating Engine

Let's look at using an older - but still common and actively maintained - version of Angular as our page templating language. Documentation for the features we will be using is located [here](https://docs.angularjs.org/guide).

Delete the contents of `index.js` and edit `index.html` page in public:

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

Note the npm installs for Angular:

```js
  "dependencies": {
    "angular": "^1.6.2",
    "angular-route": "^1.6.2",
    "body-parser": "^1.18.3",
    "express": "^4.16.3",
    "mongoose": "^5.1.6"
  },
```

Back in the 'old' days you would use `<script>` tags to access libraries etc., e.g.:

`<script src="https://code.angularjs.org/1.6.2/angular.js"></script>`

Since we are bundling we use ES6 imports and our installed packages in `node_modules`.

Import angular and angular routing into `index.js`:

```js
import angular from 'angular';
import ngRoute from 'angular-route';
```

(Note that your bundle just got very large.)

### Important AngularJS Concepts

[Wikipedia](https://en.wikipedia.org/wiki/AngularJS) article on Angular.

```html
<body>
  <div class="site-wrap" ng-app="myApp" >
    <div ng-controller="myCtrl">
      Name: <input ng-model="name">
      <p>{{ name }}</p>
    </div>
  </div>
</body>
```

`index.js`:

```js
import angular from 'angular';
import ngRoute from 'angular-route';

const app = angular.module('foodApp', ['ngRoute']);

app.controller('myCtrl', $scope => ($scope.name = 'John Doe'));
```

* [MVC](https://en.wikipedia.org/wiki/Model–view–controller) - Model, View, Controller
* `{{ }}` - "moustaches" or "handlebars" the evaluate to a value
* `$scope` - the "glue" between application controller and the view
* ng-model (ng-repeat etc.) is an Angular [directive](https://docs.angularjs.org/api/ng/directive)
* AngularJS vs Angular
* Dependency injection:

```js
const app = angular.module('foodApp', ['ngRoute']);
```

(`ngRoute` supplants Express routes for handling front end views. Always include a single route in Express for your SPA page, here `index.html`. Angular routes handle the view (templates) and the logic (controllers) for the views.)

Bootstrap the app in `index.html` for our new Recipes app:

```html
<body ng-app="foodApp">

</body>
```

Create the first component:

```js
app.component('recipeList', {
  template: `<div class="wrap"><h1>{{ name }} component</h1></div>`,
  controller: function RecipeListController($scope) {
    $scope.name = 'Recipe List'
  }
});
```

Display the component in the view:

```html
<body ng-app="foodApp">
  <div>
    <recipe-list></recipe-list>
  </div>
</body>
```

Demo - sample second component:

```js
app.component('dogFood', {
  template: `<div class="wrap"><h1> {{ name }} component</h1></div>`,
  controller: function RecipeListController($scope) {
    $scope.name = 'Dog Food'
  }
});
```

Add a template and data to the controller:

```js
app.component('recipeList', {
  template: `
  <div class="wrap">
    <ul>
      <li ng-repeat="recipe in $ctrl.recipes">
        <img ng-src="img/recipes/{{ recipe.image }}">
        <div>
          <h1><a href="recipes/{{ recipe._id }}">{{ recipe.title }}</a></h1>
          <p>{{ recipe.description }}</p>
        </div>
      </li>
    </ul>
  </div>
  `,

  controller: function RecipeListController() {
    this.recipes = [
      {
        name: 'recipe1309',
        title: 'Lasagna',
        date: '2013-09-01',
        description:
          'Lasagna noodles piled high and layered full of three kinds of cheese to go along with the perfect blend of meaty and zesty, tomato pasta sauce all loaded with herbs.',
        image: 'lasagna.png'
      },
      {
        name: 'recipe1404',
        title: 'Pho-Chicken Noodle Soup',
        date: '2014-04-15',
        description:
          'Pho (pronounced “fuh”) is the most popular food in Vietnam, often eaten for breakfast, lunch and dinner. It is made from a special broth that simmers for several hours infused with exotic spices and served over rice noodles with fresh herbs.',
        image: 'pho.png'
      },
      {
        name: 'recipe1210',
        title: 'Guacamole',
        date: '2012-10-01',
        description:
          'Guacamole is definitely a staple of Mexican cuisine. Even though Guacamole is pretty simple, it can be tough to get the perfect flavor – with this authentic Mexican guacamole recipe, though, you will be an expert in no time.',
        image: 'guacamole.png'
      },
      {
        name: 'recipe1810',
        title: 'Hamburger',
        date: '2012-10-20',
        description:
          'A Hamburger (or often called as burger) is a type of food in the form of a rounded bread sliced in half and its Center is filled with patty which is usually taken from the meat, then the vegetables be lettuce, tomatoes and onions.',
        image: 'hamburger.png'
      }
    ];
  }
});
```

Move the template html into a separate file in a new folder: `static > templates > recipes.html`

Edit the template declaration in myapp.js:

`templateUrl: '/templates/recipes.html',`

### Formatting

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

In `styles.scss`:

```css
@import 'imports/recipes';
```

In `_recipes.scss`:

```css
@import url('https://fonts.googleapis.com/css?family=Lobster');
.wrap {
  background: #eee;
  max-width: 940px;
  margin: 0 1rem;
  ul {
    list-style: none;
    padding: 0;
  }
  li {
    display: flex;
    padding: 1rem;
    img {
      width: 30%;
      height: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      margin-right: 1rem;
      background: #fff;
    }
    h1 {
      font-family: lobster;
      a {
        color: #666;
        text-decoration: none;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}

```

### Routing and Multiple Components

Create our first route using [Angular's ngRoute](https://docs.angularjs.org/api/ngRoute):

```js
app.config(function config($locationProvider, $routeProvider) {
  $routeProvider.when('/', {
    template: '<p>recipe-list</p>'
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
<div ng-view></div>
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

### The Navbar

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
```

### $HTTP

Let's use the api instead of keeping the data model in the controller.

We fetch the dataset from our server using Angular's built-in [$http](https://docs.angularjs.org/api/ng/service/$http) service.

* a core (built into Angular) service that facilitates communication with the remote HTTP servers
* need to make it available to the recipeList component's controller via [dependency injection](https://docs.angularjs.org/guide/di)
* AngularJS predates `fetch`

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

### Filtering and Sorting

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

## Adding Routing to Display Individual Recipes

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

### Adding the Detail Template

Create `templates/recipe.html`:

```html
<div class="wrap">

    <h1>{{ recipe.title }}</h1>

    <p>{{ recipe.description }}</p>

    <h3>Ingredients</h3>
    <ul class="ingredients">
        <li ng-repeat="ingredient in recipe.ingredients">
            {{ ingredient }}
        </li>
    </ul>

</div>
```

Edit the component to use `templateUrl`:

```js
  templateUrl: '/templates/recipe.html',
```

Add:

* `$http` to the dependency list for our controller so we can access the api, 
* `$routeParams` so we can access the id in the url, and
* `$scope` so we can make the results of the api call accessible to the view

and use a function to load the data:

```js
  controller: function RecipeDetailController($http, $routeParams, $scope) {
    $http.get('api/recipes/' + $routeParams.recipeId).then(res => {
      ($scope.recipe = res.data);
      console.log($scope.recipe);
    });
  }
```

### Deleting a Recipe

Wire up the `deleteRecipe` function with `ng-click`:

```html
<ul>
  <li ng-repeat="recipe in recipes | filter:query | orderBy:orderProp">
    <img ng-src="img/recipes/{{ recipe.image }}">
    <div>
      <h1><a href="recipes/{{ recipe._id }}">{{ recipe.title }}</a></h1>
      <p>{{ recipe.description }}</p>
    </div>
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

### Animation

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
```

## Adding a Recipe

1: Add a form to the recipes template:

```html
<form ng-submit="addRecipe(recipe)">
    <input type="text" ng-model="recipe.name" required placeholder="Name" />
    <input type="text" ng-model="recipe.title" required placeholder="Title" />
    <input type="text" ng-model="recipe.date" required placeholder="Date" />
    <textarea type="text" ng-model="recipe.description" required placeholder="Description"></textarea>
    <input type="text" ng-model="recipe.image" required placeholder="Image" />
    <button type="submit">Add Recipe</button>
</form>
```

2: Add to `index.js`:

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

3: Test by adding a recipe

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

<!-- ```js
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
``` -->

### Update a Recipe

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

* JSON object of matching properties to look up the doc with to update
* JSON object of just the properties to update
* callback function that returns any errors

### Test with Curl

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

### Edit Recipe Detail Template

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

#### Back button

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

#### Edit Button

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

## Notes

## Adding an Image

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

### ng-click

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