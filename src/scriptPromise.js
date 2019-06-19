/* eslint-disable no-undef */
const searchForm = document.querySelector('#search-form');
const movie = document.querySelector('#movies');

const requestApi = (method, url) => new Promise((resolve, reject) => {
  const request = new XMLHttpRequest();

  request.open(method, url);

  request.addEventListener('load', () => {
    if (request.status !== 200) {
      reject(new Error({ status: request.status }));
    }
    resolve(request.response);
  });

  request.addEventListener('error', () => {
    reject(new Error({ status: request.status }));
  });
  request.send();
});

const apiSearch = (event) => {
  event.preventDefault();
  const searchText = document.querySelector('.form-control').value;
  const server = `https://api.themoviedb.org/3/search/multi?api_key=ee4599f287ed4985125bc1242ba4c4fc&language=en-US&query=---${searchText}`;

  movie.innerHTML = 'Loading';

  requestApi('GET', server)
    .then((result) => {
      const output = JSON.parse(result);
      const inner = output.results.reduce((acc, item) => {
        const yearItem = item.first_air_date || item.release_date;
        const nameItem = item.name || item.title;
        return `${acc}<div class="col-5"> ${nameItem} (${yearItem})</div>`;
      }, '');

      movie.innerHTML = inner;
    })
    .catch((err) => {
      movie.innerHTML = `Ups ....${err}`;
    });
};

searchForm.addEventListener('submit', apiSearch);
