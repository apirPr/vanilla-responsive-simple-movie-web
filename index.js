const APIKEY = 'c33ca14e';
const APIURL = 'https://www.omdbapi.com/';

const moviesContainer = document.querySelector('.movies-container');
const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById('search-input');

function createMovieCard(movie) {
  const div = document.createElement('div');
  const title = document.createElement('h2');
  const year = document.createElement('p');
  const type = document.createElement('p');
  const poster = document.createElement('img');
  const detailContainer = document.createElement('div');
  const link = document.createElement('a');

  detailContainer.className = 'movie-detail';
  div.className = 'movie-card';
  title.className = 'movie-title';
  year.className = 'movie-year';
  type.className = 'movie-type';

  title.textContent = movie.Title;
  year.textContent = movie.Year;
  type.textContent = movie.Type;
  poster.src =
    movie.Poster !== 'N/A'
      ? movie.Poster
      : 'https://via.placeholder.com/200x300';
  poster.loading = 'lazy';
  poster.alt = movie.Title;
  poster.width = 200;

  detailContainer.appendChild(year);
  detailContainer.appendChild(type);

  div.appendChild(poster);
  div.appendChild(title);
  div.appendChild(detailContainer);
  link.appendChild(div);
  link.href = `https://www.imdb.com/title/${movie.imdbID}/`;
  link.target = '_blank';

  return link;
}

async function getMovies() {
  const response = await fetch(
    `${APIURL}?apikey=${APIKEY}&s=${searchInput.value}`
  );
  const data = await response.json();
  console.log(data);
  return data;
}

async function renderMovies() {
  moviesContainer.innerHTML = 'loading...';
  const movies = await getMovies();
  if (movies.Error) {
    moviesContainer.innerHTML = movies.Error;
  } else {
    moviesContainer.innerHTML = '';
    const useFilter = document.getElementById('use-filter').checked;
    const sortBy = document.getElementById('sort-by').value;
    const filterByType = document.getElementById('type').value;
    const filterByYear = document.getElementById('year').value;

    if (useFilter) {
      if (filterByYear) {
        movies.Search = movies.Search.filter(
          (movie) => movie.Year.split('-')[0] === filterByYear
        );
      }

      if (filterByType !== 'all') {
        movies.Search = movies.Search.filter(
          (movie) => movie.Type === filterByType
        );
      }

      if (sortBy === 'year-ascending') {
        movies.Search.sort((a, b) => {
          a.Year =
            typeof a.Year === "number"
              ? a.Year
              : (a.Year.includes('-')
              ? parseInt(a.Year.split('-')[0], 10)
              : parseInt(a.Year, 10))
          b.Year =
            typeof b.Year === "number"
              ? b.Year
              : (b.Year.includes('-')
              ? parseInt(b.Year.split('-')[0], 10)
              : parseInt(b.Year, 10))
          return a.Year - b.Year;
        });
      } else if (sortBy === 'year-descending') {
        movies.Search.sort((a, b) => {
          if (typeof a.Year === 'string') {
            a.Year =
              typeof a.Year === "number"
                ? a.Year
                : (a.Year.includes('-')
                ? parseInt(a.Year.split('-')[0], 10)
                : parseInt(a.Year, 10))
            b.Year =
              typeof b.Year === "number"
                ? b.Year
                : (b.Year.includes('-')
                ? parseInt(b.Year.split('-')[0], 10)
                : parseInt(b.Year, 10))
          } else {
            return b.Year - a.Year;
          }
        });
      } else if (sortBy === 'title-ascending') {
        movies.Search.sort((a, b) => a.Title.localeCompare(b.Title));
      } else if (sortBy === 'title-descending') {
        movies.Search.sort((a, b) => b.Title.localeCompare(a.Title));
      }

      movies.Search.forEach((movie) => {
        movie.Year = String(movie.Year);
      });
      movies.Search.forEach((movie) => {
        moviesContainer.appendChild(createMovieCard(movie));
      });
    } else {
      movies.Search.forEach((movie) => {
        moviesContainer.appendChild(createMovieCard(movie));
      });
    }
  }
}

searchBtn.addEventListener('click', renderMovies);
searchInput.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    renderMovies();
  }
});
