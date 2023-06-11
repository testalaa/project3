class Movie {
    constructor(id, title = "", year = "", genre = "", duration = "", director = "", votes = "") {
        this.id = id;
        this.title = title;
        this.year = year;
        this.genre = genre;
        this.director = director;
    }
}

Movie.prototype.print =  function () {
    console.log(`
***
  Movie id: ${this.id}
  Movie title: ${this.title}
  Movie year: ${this.year}
  Movie genre: ${this.genre}
  Movie director: ${this.director}
***`);
}

export default Movie;
