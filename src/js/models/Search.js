import axios from "axios";

export default class Search {
  constructor(query) {
    this.query = query;
  }

  async getResults() {
    const key = "a2adcbea45ed4306be20c118dd20873d";
    try {
      const res = await axios(
        `https://api.spoonacular.com/recipes/search?apiKey=${key}&query=${this.query}&number=30`
      );
      this.result = res.data.results;
      console.log(this.result);
    } catch (error) {
      alert(error);
    }
  }
}
