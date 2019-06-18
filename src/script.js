/* eslint-disable no-undef */
const searchForm = document.querySelector('#search-form');
const movie = document.querySelector('#movies');

const requestApi = (method, url) => {
  const request = new XMLHttpRequest();

  request.open(method, url);
  request.send();
  request.addEventListener('readystatechange', () => {
    if (request.readyState !== 4) return;
    if (request.status !== 200) return;

    const output = JSON.parse(request.responseText);

    const inner = output.results.reduce((acc, item) => {
      const yearItem = item.first_air_date || item.release_date;
      const nameItem = item.name || item.title;
      return `${acc}<div class="col-5"> ${nameItem} (${yearItem})</div>`;
    }, '');

    movie.innerHTML = inner;
  });
};

const apiSearch = (event) => {
  event.preventDefault();
  const searchText = document.querySelector('.form-control').value;
  const server = `https://api.themoviedb.org/3/search/multi?api_key=ee4599f287ed4985125bc1242ba4c4fc&language=en-US&query=---${searchText}`;
  requestApi('GET', server);
};

searchForm.addEventListener('submit', apiSearch);
