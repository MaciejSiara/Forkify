import { elements, elementStrings } from "./base";

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
  elements.searchInput.value = "";
};

export const clearResults = () => {
  elements.searchResList.innerHTML = "";
  elements.searchResPages.innerHTML = "";
};

export const renderResults = (recipes, page = 2, resPerPage = 10) => {
  //render results of current page
  const start = (page - 1) * resPerPage;
  const end = page * resPerPage;

  recipes.slice(start, end).forEach(renderRecipe);

  // render page buttons
  renderButtons(page, recipes.length, resPerPage);
};

// type: prev or next STRINGS
const createPageButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${
  type === "prev" ? page - 1 : page + 1
}>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${
              type === "prev" ? "left" : "right"
            }"></use>
        </svg>
        <span>Page ${type === "prev" ? page - 1 : page + 1}</span>
    </button>`;

const renderButtons = (page, numResults, resPerPage) => {
  const pages = Math.ceil(numResults / resPerPage);
  let button;
  if (page === 1 && pages > 1) {
    // only button to go to next page
    button = createPageButton(page, "next");
  } else if (page < pages) {
    // both buttons
    button = `${createPageButton(page, "next")}
              ${createPageButton(page, "prev")}`;
  } else if (page === pages && pages > 1) {
    // only button to go to prev page
    button = createPageButton(page, "prev");
  }

  elements.searchResPages.insertAdjacentHTML("afterbegin", button);
};

const limitRecipeTitle = (title, limit = 17) => {
  const newTitle = [];
  if (title.length > limit) {
    title.split(" ").reduce((acc, cur) => {
      if (acc + cur.length <= limit) {
        newTitle.push(cur);
      }
      return acc + cur.length;
    }, 0);
    return `${newTitle.join(" ")}...`;
  }
  return title;
};

const renderRecipe = (recipe) => {
  let imageURL = "https://via.placeholder.com/150";
  if (recipe.image) {
    let imageType;
    recipe.image.substr(recipe.image.length - 3) === "jpg"
      ? (imageType = "jpg")
      : (imageType = "jpeg");
    imageURL = `https://spoonacular.com/recipeImages/${recipe.id}-240x150.${imageType}`;
  }

  const markup = `<li>
                    <a class="results__link" href="#${recipe.id}">
                        <figure class="results__fig">
                            <img src="${imageURL}" alt="${recipe.title}">
                        </figure>
                        <div class="results__data">
                            <h4 class="results__name">
                            ${limitRecipeTitle(recipe.title)}</h4>
                        </div>
                    </a>
                </li>`;
  elements.searchResList.insertAdjacentHTML("beforeend", markup);
};
