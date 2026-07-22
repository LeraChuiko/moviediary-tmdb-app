const API_URL = "https://api.themoviedb.org/3/movie/popular";
const API_KEY = "3b7b9ad7ce39b703954fc5825edd755a";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/";
const POSTER_SIZE = "w500";
const FAVORITES_KEY = "favorite_movies";
async function fetchPopularMovies() {
  try {
    const response = await fetch(`${API_URL}?api_key=${API_KEY}`);
    const data = await response.json();

    //filmsRendern(data.results[0]);

    data.results.forEach((movie) => {
      filmsRendern(movie);
    });
  } catch (e) {
    console.error(e);
  }
}
fetchPopularMovies();

//-----  Karten im #movies-grid rendern -----//

function filmsRendern(movie) {
  const fullPosterUrl = `${IMAGE_BASE_URL}${POSTER_SIZE}${movie.poster_path}`;
  const filmsContainer = document.querySelector("#movies-grid");

  //---Main div---//
  const filmKart = document.createElement("div");
  filmKart.className =
    "group relative bg-zinc-900 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 flex flex-col justify-between";

  //---img---//
  const img = document.createElement("img");
  img.src = fullPosterUrl;
  img.alt = movie.title;

  //---div info---//
  const infoDiv = document.createElement("div");
  infoDiv.className = "p-4 flex flex-col gap-2";

  //---Film title---//
  const title = document.createElement("h3");
  title.textContent = movie.title;
  title.className = "text-lg font-semibold text-white";

  //---★★★★★---//
  const rating = document.createElement("span");
  rating.textContent = `★ ${movie.vote_average.toFixed(1)}`;
  rating.className = "text-yellow-400 font-medium";

  //---year---//
  const year = document.createElement("span");
  year.textContent = movie.release_date.split("-")[0];
  year.className = "text-zinc-400 text-sm";

  //---yaear+rating---//
  const metaDiv = document.createElement("div");
  metaDiv.className = "flex items-center justify-between";
  metaDiv.append(rating, year);

  //-----was the film added to Favorites?-----//
  const savedFavorites = getFavorites();
  const isSaved = savedFavorites.some((fav) => fav.id === movie.id);

  //---♡ button + attribut---//
  const favorBtn = document.createElement("button");

  favorBtn.textContent = isSaved ? "♥" : "♡";

  favorBtn.className =
    "absolute top-3 right-3 text-2xl text-white/70 hover:text-red-500 hover:scale-125 transition-all duration-200 bg-black/40 backdrop-blur-md rounded-full w-9 h-9 flex items-center justify-center pb-0.5";
  favorBtn.setAttribute("data-movie-id", movie.id); //set unique id for every favorBtn

  // --- add AddListener to ♡ ---
  favorBtn.addEventListener("click", (e) => {
    if (favorBtn.textContent === "♡") {
      favorBtn.textContent = "♥";
      console.log("movie-id:", movie.id);
      addToFavorites(movie);
    } else {
      favorBtn.textContent = "♡";
      console.log("movie-id:", movie.id);
      removeFromFavorites(movie);
    }
  });

  //Sammle alle Karten im Hauptbehälter filmsContainer
  infoDiv.append(title, metaDiv);
  filmKart.append(img, favorBtn, infoDiv);
  filmsContainer.appendChild(filmKart);
}

//-----LocalStorage functions-----//

// get an array of saved movies
function getFavorites() {
  const data = localStorage.getItem(FAVORITES_KEY);
  return data ? JSON.parse(data) : [];
}

// add film-object
function addToFavorites(movie) {
  const favorites = getFavorites();
  const exists = favorites.some((fav) => fav.id === movie.id);

  if (!exists) {
    favorites.push(movie);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    console.log(`film "${movie.title}" with ID ${movie.id} was added into localStorage!`);
  }
}

// remove film-object with filter by ID
function removeFromFavorites(movie) {
  let favorites = getFavorites();
  favorites = favorites.filter((fav) => fav.id !== movie.id);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  console.log(`film "${movie.title}" with ID ${movie.id} was removed from localStorage!`);
}
