/* eslint-disable no-undef */
const searchForm = document.querySelector('#search-form');
const movie = document.querySelector('#movies');

const apiSearch = (event) => {
  event.preventDefault();
  const searchText = document.querySelector('.form-control').value;
  const url = `https://api.themoviedb.org/3/search/multi?api_key=ee4599f287ed4985125bc1242ba4c4fc&language=en-US&query=---${searchText}`;
  movie.innerHTML = 'Loading';

  fetch(url)
    .then((value) => {
      if (value.status !== 200) {
        return Promise.reject(value);
      }
      return value.json();
    })
    .then((output) => {
      const inner = output.results.reduce((acc, item) => {
        const yearItem = item.first_air_date || item.release_date;
        const nameItem = item.name || item.title;
        const pathImg = item.poster_path;
        const urlPoster = `https://image.tmdb.org/t/p/w500${pathImg}`;
        return `${acc}<div class="col-5"> <img src="${urlPoster}" alt="${nameItem}"> <h5>${nameItem}</h5> (${yearItem})</div>`;
      }, '');

      movie.innerHTML = inner || 'No matches were found for your request';
    })
    .catch((err) => {
      movie.innerHTML = `Ups ....${err}`;
    });
};

searchForm.addEventListener('submit', apiSearch);
