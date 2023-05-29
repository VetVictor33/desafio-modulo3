const movieContainer = document.querySelector('.movies');
const searchInput = document.querySelector('.input')
const prevBtn = document.querySelector('.btn-prev');
const nextBtn = document.querySelector('.btn-next');
const themeBtn = document.querySelector('.btn-theme');
const logo = document.querySelector('.header__container-logo>img')
const root = document.querySelector(':root');


let moviesData;
let highMovieData;
let highMovieVideoData;
let pageIndex = 1

function showMovies(movies) {
    const pageOne = document.createElement('div');
    pageOne.classList.add('page-one', 'movies', 'page');
    const pageTwo = document.createElement('movies');
    pageTwo.classList.add('page-two', 'movies', 'page');
    const pageThree = document.createElement('movies');
    pageThree.classList.add('page-three', 'movies', 'page');
    for (let i = 0; i < 18; i++) {
        let movie = movies[i];
        const movieDiv = document.createElement('div');
        const movieInfo = document.createElement('div');
        const movieTitle = document.createElement('span');
        const movieRating = document.createElement('span');
        const movieImg = document.createElement('img');

        movieDiv.appendChild(movieInfo);
        movieInfo.appendChild(movieTitle);
        movieInfo.appendChild(movieRating);
        movieRating.appendChild(movieImg);

        movieDiv.classList.add('movie');
        movieInfo.classList.add('movie__info');
        movieTitle.classList.add('movie__title');
        movieRating.classList.add('movie__rating');

        movieDiv.id = movie.id;
        movieDiv.style.backgroundImage = `url(${movie.poster_path})`;
        movieTitle.innerHTML = movie.title;
        movieRating.innerHTML = movie.vote_average

        if (i < 6) {
            pageOne.appendChild(movieDiv);
        } else if (i >= 6 && i < 12) {
            pageTwo.appendChild(movieDiv);
        } else if (i => 12) {
            pageThree.appendChild(movieDiv);
        }
    };
    movieContainer.appendChild(pageTwo);
    movieContainer.appendChild(pageThree);
    hidePages();
    movieContainer.appendChild(pageOne);
}

function showHighMovie() {
    const highMovieVid = document.querySelector('.highlight__video');
    const highMovieTitle = document.querySelector('.highlight__title');
    const highMovieRating = document.querySelector('.highlight__rating');
    const highMovieGenres = document.querySelector('.highlight__genres');
    const highMovieLaunch = document.querySelector('.highlight__launch');
    const highMovieDescription = document.querySelector('.highlight__description');
    const highMovieLink = document.querySelector('.highlight__video-link');


    highMovieVid.style.backgroundImage = `url(${highMovieData.backdrop_path})`;
    highMovieTitle.innerHTML = highMovieData.title;
    highMovieRating.innerHTML = highMovieData.vote_average;
    highMovieLaunch.innerHTML = new Date(highMovieData.release_date).toLocaleDateString("pt-BR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
    });;
    highMovieDescription.innerHTML = highMovieData.overview;
    highMovieLink.href = `https://www.youtube.com/watch?v=${highMovieVideoData[1].key}`;

    let movieGenres = highMovieData.genres;
    let movieGenresName = [];
    for (genre of movieGenres) {
        movieGenresName.push(genre.name)
    }
    highMovieGenres.innerHTML = movieGenresName.toString();

}

function cleanMovies() {
    const pages = document.querySelectorAll('.page');
    for (let page of pages) {
        page.remove()
    }

}

function closeModal(modal) {
    modal.classList.add('hidden')

    document.querySelector('.modal__title').innerHTML = '';
    document.querySelector('.modal__img').src = '';
    document.querySelector('.modal__description').innerHTML = '';
    document.querySelector('.modal__average').innerHTML = '';

    const genreSpan = document.querySelectorAll('.modal__genre');
    for (let genre of genreSpan) {
        genre.remove();
    }
}

function showModal() {
    const modal = document.querySelector('.modal')
    const movies = document.querySelectorAll('.movie');
    for (let movie of movies) {
        movie.addEventListener('click', (event) => {
            event.stopPropagation();
            modal.classList.remove('hidden');
            const movieId = movie.id;

            const modalTitle = document.querySelector('.modal__title');
            const modalImg = document.querySelector('.modal__img');
            const modalDescription = document.querySelector('.modal__description');
            const modalGenres = document.querySelector('.modal__genres');
            const modalAverage = document.querySelector('.modal__average');

            async function getMovieDetails() {

                const movieDetails = await api.get(`/3/movie/${movieId}?language=pt-BR`)
                const movieDetailsData = movieDetails.data;

                modalTitle.innerHTML = movieDetailsData.title;
                modalImg.src = movieDetailsData.backdrop_path;
                modalDescription.innerHTML = movieDetailsData.overview;
                modalAverage.innerHTML = movieDetailsData.vote_average;

                const genres = movieDetailsData.genres
                for (let genre of genres) {
                    const span = document.createElement('span');
                    span.classList.add('modal__genre');
                    modalGenres.appendChild(span);

                    span.innerHTML = genre.name;
                }

                const modalClose = document.querySelector('.modal__close');
                modalClose.addEventListener('click', () => {
                    closeModal(modal);
                })
                modal.addEventListener('click', () => {
                    closeModal(modal)
                })
            }

            getMovieDetails();
        })
    }
}

function changePage(change) {
    const pageOne = document.querySelector('.page-one');
    const pageTwo = document.querySelector('.page-two');
    const pageThree = document.querySelector('.page-three');

    function switchPage(next, current, direction) {
        next.style.display = 'flex';
        current.style.display = 'none'
    }
    if (change === 'next') {
        if (pageIndex === 1) {
            switchPage(pageTwo, pageOne, 'rl');
            pageIndex = 2;
        } else if (pageIndex === 2) {
            switchPage(pageThree, pageTwo, 'rl');
            pageIndex = 3;
        } else if (pageIndex === 3) {
            switchPage(pageOne, pageThree, 'rl');
            pageIndex = 1;
        }
    } else if (change === 'prev') {
        if (pageIndex === 1) {
            switchPage(pageThree, pageOne, 'lr');
            pageIndex = 3;
        } else if (pageIndex === 2) {
            switchPage(pageOne, pageTwo, 'lr');
            pageIndex = 1;
        } else if (pageIndex === 3) {
            switchPage(pageTwo, pageThree, 'lr');
            pageIndex = 2;
        }
    }
}

function hidePages() {
    const pages = document.querySelectorAll('.page')
    for (let page of pages) {
        page.style.display = 'none'
    }
}

async function loadMovies() {
    const moviesResponse = await api.get('/3/discover/movie?language=pt-BR&include_adult=false');
    moviesData = moviesResponse.data.results;
    const highMovieResponse = await api.get('/3/movie/436969?language=pt-BR');
    highMovieData = highMovieResponse.data;
    const highMovieVideoResponse = await api.get('/3/movie/436969/videos?language=pt-BR');
    highMovieVideoData = highMovieVideoResponse.data.results;
    showMovies(moviesData);
    showHighMovie();
    showModal();
}


searchInput.addEventListener('keypress', (event) => {
    if (event.key != 'Enter') {
        return
    }
    if (!event.target.value) {
        cleanMovies();
        showMovies(moviesData);
        showModal();
        return;
    }
    const movieQuery = event.target.value;
    async function getMovie() {
        const movieResponse = await api.get(`/3/search/movie?language=pt-BR&include_adult=false&query=${movieQuery}`);
        const movieResponseData = movieResponse.data.results;
        showMovies(movieResponseData);
        showModal();
    }
    cleanMovies();
    getMovie()
    event.target.value = '';
});

nextBtn.addEventListener('click', () => {
    changePage('next')
})
prevBtn.addEventListener('click', () => {
    changePage('prev')
})

function defineTheme() {
    const modalClose = document.querySelector('.modal__close');
    const theme = localStorage.getItem('theme');
    if (theme === 'light') {
        themeBtn.src = "./assets/light-mode.svg"
        prevBtn.src = "./assets/arrow-left-dark.svg";
        nextBtn.src = "./assets/arrow-right-dark.svg";
        logo.src = "./assets/logo-dark.png";
        modalClose.src = "./assets/close-dark.svg"


        root.style.setProperty("--background", "#fff");
        root.style.setProperty("--text-color", "#1b2028");
        root.style.setProperty("--input-color", "#979797");
        root.style.setProperty("--input-background-color", "");
        root.style.setProperty("--bg-secondary", "#ededed");
        root.style.setProperty("--bg-modal:", "#ededed");
    } else if (!theme || theme === 'dark') {
        themeBtn.src = "./assets/dark-mode.svg";
        prevBtn.src = "./assets/arrow-left-light.svg";
        nextBtn.src = "./assets/arrow-right-light.svg";
        logo.src = "./assets/logo.svg";
        modalClose.src = "./assets/close.svg"


        root.style.setProperty("--background", "#1B2028");
        root.style.setProperty("--text-color", "#FFFFFF");
        root.style.setProperty("--input-color", "#FFFF");
        root.style.setProperty("--input-background-color", "#3E434D");
        root.style.setProperty("--bg-secondary", "#2D3440");
        root.style.setProperty("--bg-modal:", "#2D3440");
    }
}

themeBtn.addEventListener('click', () => {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
        localStorage.setItem('theme', 'light')
    } else {
        localStorage.setItem('theme', 'dark')
    }
    defineTheme();
})

defineTheme()
loadMovies();