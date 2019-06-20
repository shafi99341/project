const key = "f4e8296ff2e6de71f3ffb559c148b6d9";
let query;
const image_baseurl = "https://image.tmdb.org/t/p/w185";
const image_baseurlw1280 = "https://image.tmdb.org/t/p/w1280";
let searchButton = document.getElementById('search-btn');
let searchBar = document.getElementById('search-bar');
let listSection = document.querySelector('.lists');
let movieSection = document.querySelector('.movie');
let genres = document.querySelector('.genres');

const clearResults = (DOMelement) => {
    DOMelement.innerHTML = "";
};

const parseRuntime = (num) => {
    num = num / 60;
    var newNum = num.toFixed(2);
    var newString = newNum.split(".");
    var hours = newString[0];
    var minutes = Math.round(newString[1]);
    var finalStr = `${hours} hours ${minutes} minutes`;
    return finalStr;
};

const displayList = (element, index) => {
    //Our list logic
    let summary = element.overview.slice(0, 100);
    let markup = `<div class="list">
                    <img src=${image_baseurl + element.poster_path} class="list__image">
                    <div class="list__content">
                    <div class="list__heading">
                    <h2>${element.title}</h2>
                    </div>
                    <div class="list__overview">
                    ${summary+"..."}
                    </div>
                    <button class="list__button" id = ${index}>View More <i class="fas fa-arrow-right"></i></button>
                    </div>
                    </div>`;

    listSection.insertAdjacentHTML("beforeend", markup);
};

const displayRuntime = (result) => {
    let markup = `<p class = "runtime_heading">Run-time : ${parseRuntime(result.runtime)}`;
    document.querySelector('.runtime').insertAdjacentHTML('beforeend', markup);
};

const displayMovie = (movieObject) => {
    let markup = `
                <img src= ${image_baseurlw1280 + movieObject.backdrop_path} class="movie__image">
                <div class="movie__title">
                        ${movieObject.title}
                </div>
                <div class="line-2">
                    <div class="tagline">
                    "${movieObject.tagline}"
                    </div>
                    <div class="rating">
                        ${movieObject.vote_average}/10
                    </div>
                </div>
                <div class="line-3">
                    <div class="budget">
                        Budget : $${movieObject.budget}.00
                    </div>
                    <div class="revenue">
                        Revenue : $${movieObject.revenue}.00
                    </div>
                </div>
                <div class="line-4">
                    <div class="language">
                            Language : ${movieObject.spoken_languages[0].name}
                    </div>
                    <div class="release-date">
                            Release Date : ${movieObject.release_date}
                    </div>
                </div>
                <div class="movie__overview">
                        ${movieObject.overview}
                </div>
                `;

    movieSection.insertAdjacentHTML("beforeend", markup);
};

const displayGenre = (res) => {
    genres.innerHTML = "";
    res.genres.forEach(el => {
        let markup = `<button class="genre_btn ${el.name}">${el.name}</button>`;
        genres.insertAdjacentHTML('beforeend', markup);
    });
};

const getMovie = (id) => {
    fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${key}&language=en-US`)
        .then(res => {
            return res.json();
        })
        .then(result => {
            displayMovie(result);
            displayGenre(result);
            displayRuntime(result);
        });
};

const main = () => {
    clearResults(listSection);
    const query = searchBar.value;

    fetch(`https://api.themoviedb.org/3/search/movie?api_key=${key}&language=en-US&query=${query}&page=1&include_adult=true`)
        .then(res => {
            return res.json();
        }).then(result => {
            let resultArray = result.results;
            resultArray.forEach((element, index) => {
                displayList(element, index);

                //View more
                let viewMoreBtn = document.getElementById(index);
                viewMoreBtn.addEventListener('click', () => {
                    movieSection.innerHTML = "";
                    getMovie(element.id);
                });
            });
        })
        .catch(err => {
            movieSection.innerHTML = err;
        });

    searchBar.value = "";
};

const populateList = () => {
    const query = searchBar.value;
    console.log(query);
    if (query === '') {
        clearResults(listSection);
        return;
    }

    fetch(`https://api.themoviedb.org/3/search/movie?api_key=${key}&language=en-US&query=${query}`)
        .then(res => {
            return res.json();
        }).then(result => {
            let resultArray = result.results;
            resultArray.forEach((element, index) => {
                displayList(element, index);

                //View more
                let viewMoreBtn = document.getElementById(index);
                viewMoreBtn.addEventListener('click', () => {
                    movieSection.innerHTML = "";
                    getMovie(element.id);
                });
            });
        })
        .catch(err => {
            movieSection.innerHTML = err;
        });
};

document.addEventListener('keydown', (event) => {
    if (event.keyCode === 13) {
        clearResults(listSection);
        main();
    } else {
        clearResults(listSection);
        setTimeout(() => {
            populateList();
        }, 100);
    }
});

searchButton.addEventListener('click', () => {
    main();
});