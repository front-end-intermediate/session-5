var elem = document.querySelector('#app');
var link = document.querySelector('a');

link.addEventListener('click', getEm)

function fetchRecipes(url, callback) {
  fetch(url)
  .then( res => res.json() )
  .then( data => callback(data) )
  .catch( (err) => { console.error(err)})
}

function getEm(){
  fetchRecipes( 'http://localhost:3001/api/recipes', (recipes) => {
    const markup = `
      <ul>
        ${recipes.map(
          recipe => `<li>${recipe.title}</li>`
        ).join('')}
      </ul>
    `
    elem.innerHTML = markup;
  })
}