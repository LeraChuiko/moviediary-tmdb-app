let deferTimeout = null;
const token =
    'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiMTkzNDg1Yjg4Zjk4NGNjM2ZkMWJkN2M2YzZkNmYzYiIsIm5iZiI6MTc4NDcwODMxNC40ODYsInN1YiI6IjZhNjA3Y2RhMmE0NTA0ZWVhN2EzZjc0MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.C7-hZsT69R8u5CXFk19RswrT0ut2FHFRlbFmMKQuS4w';

class PopularFilms {
    constructor() {
        this.$el = document.querySelector('#popular-films');
    }

    /* Append a movie class to the search result list in an open modal */
    appendMovie(movie) {
        const el = movie.render();
        this.$el.querySelector('[data-output]').appendChild(el);
    }
}

class SearchModal {
    constructor() {
        this.$el = document.querySelector('#search-modal');
    }

    close() {
        this.$el.classList.add('hidden');
        this.clear();
    }

    open() {
        this.$el.classList.remove('hidden');
    }

    /* Append a movie class to the search result list in an open modal */
    appendMovie(movie) {
        const el = movie.render();
        this.$el.querySelector('[data-output]').appendChild(el);
    }

    clear() {
        this.$el.querySelector('[data-output]').innerHTML = '';
    }
}

class Movie {
    constructor(result) {
        this.result = result;
        this.$el = document.querySelector('#movie-tmpl');
    }

    /* Renders the HTML for a movie and returns a DomElement with the rendered content */
    render() {
        const temp = document.createElement('div');
        temp.innerHTML = this.$el.innerHTML
            .replace('<% title %>', this.result.name ? this.result.name : this.result.title)
            .replace('<% imageUrl %>', 'https://image.tmdb.org/t/p/w440_and_h660_face' + this.result.poster_path)
            .replace('<% rating %>', this.rating)
            .replace('<% releaseDate %>', this.year);

        return temp.firstChild.nextSibling;
    }

    get year() {
        const release = new Date(this.result.release_date ? this.result.release_date : this.result.first_air_date);
        return release.getFullYear();
    }

    get rating() {
        return Math.round(this.result.vote_average * 100) / 100;
    }
}

function defer(callback, seconds) {
    if (typeof deferTimeout === 'number') {
        clearTimeout(deferTimeout);
    }

    deferTimeout = setTimeout(() => {
        callback();
        deferTimeout = null;
    }, seconds);
}

async function search(query) {
    const params = new URLSearchParams({
        query: query,
        include_adult: true,
        page: 1,
        language: 'en-US',
    }).toString();

    const response = await fetch(`https://api.themoviedb.org/3/search/multi?${params}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return (await response.json()).results;
}

async function fetchPopularFilms() {
    const response = await fetch(`https://api.themoviedb.org/3/discover/movie`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const r = (await response.json()).results;

    r.forEach((result) => list.appendMovie(new Movie(result)));
}

/* ------------------------- Main loop ------------------------- */
const modal = new SearchModal();
const list = new PopularFilms();

document.querySelector('#close-search-modal').addEventListener('click', (e) => {
    e.preventDefault();
    modal.close();
});

document.querySelector('#search-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = document.querySelector('#search-form input').value;
    if (!query.trim()) {
        return;
    }
    defer(async function () {
        const results = await search(query);
        if (!results.length) {
            modal.close();
            return;
        }

        modal.open();

        results.forEach((result) => modal.appendMovie(new Movie(result)));
    }, 500);
});

fetchPopularFilms();
