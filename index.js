import prompt from 'prompt-sync';
import fs from 'fs';
import fetch from "node-fetch";
import Movie from './Movie.js';

const input = prompt();
let apiUrl = 'http://www.omdbapi.com/?i=tt3896198&apikey=f84b6ef6';
let movies = [];

const readAMovies = () => {
    fs.readFile("./movies.json", "utf-8", (err, data) => {
        if (err) {
            console.log("Something went wrong while reading the file!");
            console.log(err.message);
        } else {
            const readMovies = JSON.parse(data);
            readMovies.map((m) => {
                const newMovie = new Movie(m.id, m.title, m.year, m.genre, m.director);
                movies.push(newMovie);

            });
            showActions();
        }
    });
}

const getMoviesFromAPI = () => {
    fetch(apiUrl, { method: 'GET' })
        .then(async res => {
            const APIData = await res.json();
            appendDataToFile(APIData);
        })
        .catch(err => {
            console.log("Failed to get the data!");
            console.log(err);
        });
};

const appendDataToFile = (element ) => {

    // newData.map((m) => {
    //     const newMovie = new Movie(m.Id, m.Title, m.Year, m.Genre, m.Director);
    //     movies.push(newMovie);
    // })
    // newData.forEach(element => {
    //     console.log("element",element)
    //     const newMovie = new Movie(element.Id, element.Title, element.Year, element.Genre, element.Director);
    //     movies.push(newMovie);
    // });

    const newMovie = new Movie(element.Id, element.Title, element.Year, element.Genre, element.Director);
        movies.push(newMovie);
    fs.writeFile("./movies.json", JSON.stringify(movies), 'utf-8', (err) => {
        if (err) {
            console.log('Something went wrong while writing to the file!');
            console.log(err.message);
        } else {
            console.log('Data has been appended to the file.');

            showActions();
        }
    });
};

const addMovie = () => {
    const title = input("Please enter title: ");
    const year = input("Please enter year: ");
    const genre = input("Please enter genre: ");
    const director = input("Please enter director: ");
    const newMovie = new Movie(Math.round(Math.random() * 10000), title, year, genre, director);
    movies.push(newMovie);
    appendDataToFile();
};

const printMovies = (printMovies = movies) => {
    if (printMovies.length === 0) {
        console.log('Movies List is empty.');
    }
    printMovies.forEach(m => {
        m.print();
    });
    showActions();
};

const updateMovie = () => {
    const id = input('Enter movie id you need update it: ');
    console.log(id)
    const index = movies.findIndex((m) => m.id == id);
    if (index === -1) {
        console.log('movie id not found!');
    } else {
        ['title', 'year', 'genre','director'].forEach(attribute => {
            const shouldChange = input(`${attribute} now ${movies[index][attribute]}, do you want to change it (yes/no)? `).toLowerCase() === 'yes';
            if (shouldChange) {
                movies[index][attribute] = input(`Enter new ${attribute}: `);
            }
        });
    }
    appendDataToFile();
};

const deleteMovie = () => {
    const id = input('Enter movie id you need delete it: ');
    const index = movies.findIndex((m) => m.id == id);
    if (index === -1) {
        console.log('movie id not found!');
    } else {
        movies.splice(index, 1);
        console.log('Movie Deleted Successfully');
    }
    appendDataToFile();
}

const searchMovie = () => {
    const searchBy = input('Enter search movie by (title, year, genre, director): ');
    if (['title', 'year', 'genre',  'director'].findIndex((e) => e == searchBy.toLowerCase()) != -1) {
        const value = input(`Enter search movie by ${searchBy}: `);
        const index = movies.findIndex((m) => m[searchBy].toString().toLowerCase() == value.toLowerCase());
        if (index === -1) {
            console.log('movie not found!');
        } else {
            movies[index].print();
        }
    } else {
        console.log('Invalid entry');
    }
    showActions();
}

const filterMovies = () => {
    const filterBy = input('Enter filter movie by (title, year, genre,  director): ');
    if (['title', 'year', 'genre', 'director'].findIndex((e) => e == filterBy.toLowerCase()) != -1) {
        const value = input(`Enter search movie by ${filterBy}: `);
        const filteredMovies = movies.filter((m) => m[filterBy].toString().toLowerCase() == value.toLowerCase());
        printMovies(filteredMovies);
    } else {
        console.log('Invalid entry');
        showActions();
    }
}

const clearAllMovies = () => {
    if (movies.length === 0) {
        console.log('Movies List already is empty');
    } else {
        movies = [];
        console.log('Clear All Movies Successfully ');
    }
    appendDataToFile();
}

const showActions = () => {
    console.log(`
    
**************************************
** Welcome to Movie-Catalog-CLI-App **
**************************************
***** Select an action:          *****
*****   1) Add a movie           *****
*****   2) List movies           *****
*****   3) Update movie details  *****
*****   4) Delete movie          *****
*****   5) Search movie          *****
*****   6) Filter movies         *****
*****   7) Fetch movies from API *****
*****   8) Clear all movies      *****
*****   9) Exit                  *****
**************************************
`   );

    const choice = input('What\'s your choice? ');
    console.log('Your choice is: ' + choice + '\n');
    switch (choice) {
        case '1':
            addMovie();
            break;
        case '2':
            printMovies();
            break;
        case '3':
            updateMovie();
            break;
        case '4':
            deleteMovie();
            break;
        case '5':
            searchMovie();
            break;
        case '6':
            filterMovies();
            break;
        case '7':
            getMoviesFromAPI();
            break;
        case '8':
            clearAllMovies();
            break;
        case '9':
            console.log('Good Bye :)');
            break;
        default:
            console.log('Invalid choice');
            return showActions();
    }
}

readAMovies();
