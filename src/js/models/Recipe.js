import axios from "axios";

export default class Recipe {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() {
    const key = "a2adcbea45ed4306be20c118dd20873d";
    try {
      const res = await axios(
        `https://api.spoonacular.com/recipes/${this.id}/information?apiKey=${key}&includeNutrition=false`
      );
      this.title = res.data.title;
      this.author = res.data.sourceName;
      this.img = res.data.image;
      this.url = res.data.sourceUrl;
      this.ingredients = res.data.extendedIngredients;
      this.cookingMinutes = res.data.cookingMinutes;
      this.servings = res.data.servings;
      console.log(res);
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  }

  updateServings(type) {
    //servings
    const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

    //ingredients
    this.ingredients.forEach(el => {
      el.measures.metric.amount *= (newServings / this.servings);

    });

    this.servings = newServings;
  }
}
