/* eslint-disable no-param-reassign */
/* eslint-disable no-undef */
const searchForm = document.querySelector('#search-form');
const movie = document.querySelector('#movies');
const baseUrl = 'https://image.tmdb.org/t/p';
const fileSize = '/w400';
const noPosterPath = '../images/no_poster.jpg';
const apiKey = 'ee4599f287ed4985125bc1242ba4c4fc';

const getJson = (value) => {
  if (value.status !== 200) {
    return Promise.reject(new Error(value.status));
  }
  return value.json();
};

const showFullInfo = (event) => {
  const imgPoster = event.path[0];
  const movieId = imgPoster.dataset.id;
  // TODO: change let for const, delete if else
  let url = '';
  if (imgPoster.dataset.type === 'movie') {
    url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US`;
  } else if (imgPoster.dataset.type === 'tv') {
    url = `https://api.themoviedb.org/3/tv/${movieId}?api_key=${apiKey}&language=en-US`;
  } else {
    movie.innerHTML = `<h2 class="col-12 text-center text-danger">!!!!Not Wait${err}</h2>`;
  }

  fetch(url)
    .then(getJson)
    .then((output) => {
      const homePage = output.homepage ? `<p class="text-center"> <a href="${output.homepage}" target="_blank">Home page</a> </p>` : '';
      const imdbPage = output.imdb_id ? `<p class="text-center"> <a href="https://imdb.com/title/${output.imdb_id}" target="_blank"> Page in IMDB.com </a> </p>` : '';
      const filePath = output.poster_path;
      const posterPath = filePath ? `${baseUrl}${fileSize}${filePath}` : noPosterPath;
      const genres = output.genres.map(genre => ` ${genre.name}`);
      movie.innerHTML = `
        <h4 class="col-12 text-center">${output.title || output.name}</h4>
          <div class="col-4">
            <img src="${posterPath}" alt="${output.title || output.name}">
            ${homePage}
            ${imdbPage}
          </div>
          <div class="col-8">
            <p> Rating: ${output.vote_average}</p>
            <p> Status: ${output.status}</p>
            <p> Premiera: ${output.first_air_date || output.release_date}</p>
            ${(output.last_episode_to_air) ? `<p>${output.number_of_seasons} seasons, total series ${output.number_of_episodes}</p>` : ''}
            
            <p> ${`${output.tagline || ''}`}</p>
            <p> ${output.overview}</p>
            <p> Gengres : ${genres}</p>
          </div>
      `;
    })
    .catch((err) => {
      movie.innerHTML = `<h2 class="col-12 text-center text-danger">Ups ....${err}</h2>`;
    });
};

const addEventMedia = () => {
  const media = movie.querySelectorAll('img[data-id]');
  [...media].map((elem) => {
    elem.style.cursor = 'pointer';
    elem.addEventListener('click', showFullInfo);
    return elem;
  });
};

const urlTrends = `https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}`;

document.addEventListener('DOMContentLoaded', () => {
  fetch(urlTrends)
    .then(getJson)
    .then((output) => {
      const inner = output.results.reduce((acc, item) => {
        const yearItem = item.first_air_date || item.release_date;
        const nameItem = item.name || item.title;
        const mediaType = item.title ? 'movie' : 'tv';
        const filePath = item.poster_path;
        const dataInfo = `data-id="${item.id}" data-type="${mediaType}"`;
        const posterPath = filePath ? `${baseUrl}${fileSize}${filePath}` : noPosterPath;
        return `${acc}<div class="col-6 col-md-6 col-xl-3 item"> <img src="${posterPath}" class="poster" alt="${nameItem}" ${dataInfo}> <h5>${nameItem}</h5> (${yearItem})</div>`;
      }, '<h2 class="col-12 text-center">Popular for the week</h2>');

      movie.innerHTML = inner;
      addEventMedia();
    })
    .catch((err) => {
      movie.innerHTML = `<h2 class="col-12 text-center text-danger">Ups ....${err}</h2>`;
    });
});

const apiSearch = (event) => {
  event.preventDefault();
  const searchText = document.querySelector('.form-control').value;
  if (searchText.trim().length === 0) {
    movie.innerHTML = '<h2 class="col-12 text-center text-warning">Enter a query to search for a movie</h2>';
    return;
  }
  const url = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&language=en-US&query=---${searchText}`;

  movie.innerHTML = '<div class="spinner"></div>';

  fetch(url)
    .then(getJson)
    .then((output) => {
      const inner = output.results.reduce((acc, item) => {
        const yearItem = item.first_air_date || item.release_date;
        const nameItem = item.name || item.title;
        const filePath = item.poster_path;
        const dataInfo = item.media_type !== 'person' ? `data-id="${item.id}" data-type="${item.media_type}"` : '';
        const posterPath = filePath ? `${baseUrl}${fileSize}${filePath}` : noPosterPath;
        return `${acc}<div class="col-6 col-md-6 col-xl-3 item"> <img src="${posterPath}" class="poster" alt="${nameItem}" ${dataInfo}> <h5>${nameItem}</h5> (${yearItem})</div>`;
      }, '');

      movie.innerHTML = inner || '<h2 class="col-12 text-center text-info">No matches were found for your request</h2>';
      addEventMedia();
    })
    .catch((err) => {
      movie.innerHTML = `<h2 class="col-12 text-center text-danger">Ups ....${err}</h2>`;
    });
};

searchForm.addEventListener('submit', apiSearch);
