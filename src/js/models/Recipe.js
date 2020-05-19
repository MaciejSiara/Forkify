import axios from "axios";

export default class Recipe {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() {
    const key = "1b47d6ca8c7449a189771b2e969d381d";
    try {
      const res = await axios(
        `https://api.spoonacular.com/recipes/${this.id}/ingredientWidget.json?apiKey=${key}`
      );
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  }
}
