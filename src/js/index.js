import "../style/style.scss";
import Search from "./models/Search";
import Recipe from "./models/Recipe";
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader, clearLoader } from "./views/base";

/////////////////////////////
// Global state of the app
//  - Search object
//  - Current recipe object
//  - Shopping list object
//  - liked recipes
/////////////////////////////


const state = {};
window.state = state;

const controlSearch = async () => {
  // Get query from the view
  const query = searchView.getInput(); // LATER

  if (query) {
    // new search object and add it to state
    state.search = new Search(query);

    // prepare UI for results
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes);

    // search for recipes
    await state.search.getResults();

    // render results on UI
    clearLoader();
    state.search.result.length > 0
      ? searchView.renderResults(state.search.result)
      : console.log("nic nie ma tutaj");
  }
};

elements.searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  controlSearch();
});

elements.searchResPages.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-inline");
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);
  }
});

// RECIPE

const controlRecipe = async () => {
  // get id form url
  const id = window.location.hash.replace("#", "");

  if (id) {
    //prepare ui for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe);

    //hightlight selected search item
    if (state.search) searchView.highlightSelected(id);

    //create new recipe object
    state.recipe = new Recipe(id);

    try {
      //get recipe data
      await state.recipe.getRecipe();

      // render recipe
      clearLoader();
      recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
    } catch (error) {
      console.log(error)
      alert("Error procesing recipe");
    }
  }
};

["hashchange", "load"].forEach((event) =>
  window.addEventListener(event, controlRecipe)
);


//LIST
const controlList = () => {
  //create list if there is not any
  if (!state.list) state.list = new List();

  // add ingredients to list
  state.recipe.ingredients.forEach(el => {
    const item = state.list.addItem(el.measures.metric.amount, el.measures.metric.unitLong, el.name);
    listView.renderItem(item);
  })
}

elements.shopping.addEventListener('click', e => {
  const id = e.target.closest('.shopping__item').dataset.itemid;
  if (e.target.matches(`.shopping__delete, .shopping__delete *`)) {
    // delete state
    state.list.deleteItem(id);

    // delete from UI
    listView.deleteItem(id);

    // handle count update
  } else if (e.target.matches(`.shopping__count--value`)) {
    const val = parseFloat(e.target.value, 10);
    state.list.updateCount(id, val);
  }
})


// LIKEs
const controlLike = () => {
  if (!state.likes) state.likes = new Likes();
  const currentID = state.recipe.id;

  // user has not yet liked cur recipe
  if (!state.likes.isLiked(currentID)) {
    //add like to the state
    const newLike = state.likes.addLike(
      currentID,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    )
    //toggle like button
    likesView.toggleLikeBtn(true);

    // add like to UI
    likesView.renderLike(newLike)
    console.log(state.likes)

    //user has liked cur recipe
  } else {

    //persist like to the state
    state.likes.deleteLike(currentID);

    //toggle like button
    likesView.toggleLikeBtn(false);

    // remove like to UI
    likesView.deleteLike(currentID);
  }
  likesView.toggleLikeMenu(state.likes.getNumLikes());
};

//restore liked recipes on page load
window.addEventListener('load', () => {
  state.likes = new Likes();

  //read storage
  state.likes.readStorage();

  //toggle like menu button
  likesView.toggleLikeMenu(state.likes.getNumLikes());

  //render the existing likes
  state.likes.likes.forEach(like => likesView.renderLike(like));
})

console.log(true && false)

// handling recipe button clicks
elements.recipe.addEventListener('click', e => {
  if (e.target.matches('.btn-increase, .btn-increase *')) {
    // decrerase is clicked
    if (state.recipe.servings > 1) {
      state.recipe.updateServings('dec');
      recipeView.updateServingsIngredients(state.recipe);
    };
  } else if (e.target.matches('.btn-decrease, .btn-decrease *')) {
    // increase is clicked
    state.recipe.updateServings('inc');
    recipeView.updateServingsIngredients(state.recipe);

    // add to shop list
  } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
    // add to shopping list
    controlList();
  } else if (e.target.matches(`.recipe__love, .recipe__love *`)) {
    // like controller
    controlLike();
  }
});

