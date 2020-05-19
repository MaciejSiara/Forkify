import "../style/style.scss";
import Search from "./models/Search";
import Recipe from "./models/Recipe";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import { elements, renderLoader, clearLoader } from "./views/base";

/////////////////////////////
// Global state of the app
//  - Search object
//  - Current recipe object
//  - Shopping list object
//  - liked recipes
/////////////////////////////
const state = {};

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
    //create new recipe object
    state.recipe = new Recipe(id);

    try {
      //get recipe data
      await state.recipe.getRecipe();
      // render recipe
      clearLoader();
      recipeView.renderRecipe(state.recipe);
    } catch (error) {
      alert("Error procesing recipe");
    }
  }
};

["hashchange", "load"].forEach((event) =>
  window.addEventListener(event, controlRecipe)
);
