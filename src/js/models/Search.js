import axios from "axios";

export default class Search {
  constructor(query) {
    this.query = query;
  }

  async getResults() {
    const key = "1b47d6ca8c7449a189771b2e969d381d";
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
