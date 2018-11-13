const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const recipeModels = require('./api/recipe.model');
const recipes = require('./api/recipe.controllers');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

const app = express();
const mongoUri = 'mongodb://devereld:dd2345@ds157223.mlab.com:57223/recipes-daniel';
// const mongoUri = `mongodb://${process.env.DB_USER}:${process.env.DB_PW}@ds157223.mlab.com:57223/${process.env.DB}`;
// console.log(mongoUri)

// this line always appears before any routes
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('app'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/app/index.html');
});

app.get('/api/recipes', recipes.findAll);
app.get('/api/recipes/:id', recipes.findById);
app.post('/api/recipes', recipes.add);
app.put('/api/recipes/:id', recipes.update);
app.delete('/api/recipes/:id', recipes.delete);
app.get('/api/import', recipes.import);
app.get('/api/killall', recipes.killall);

const PORT = process.env.PORT || 3000;

mongoose.connect(mongoUri, { useNewUrlParser: true }, () => {
  app.listen(PORT);
  console.log(`Server running at http://localhost:${PORT}/`);
});