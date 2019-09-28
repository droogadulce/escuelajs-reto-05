const $app = document.getElementById('app');
const $observe = document.getElementById('observe');
const API = 'https://us-central1-escuelajs-api.cloudfunctions.net/characters';
//const API = 'https://rickandmortyapi.com/api/character/';

window.onload = function() {
  localStorage.removeItem('next_fetch');
  localStorage.clear();
};

const getData = api => {
  return fetch(api).then(response => response.json());
};

const renderData = response => {
  let nextURL = response.info.next;
  localStorage.setItem('next_fetch', nextURL);
  if (localStorage.getItem('next_fetch')) {
    console.log(localStorage.getItem('next_fetch'));
    const characters = response.results;
    let output = characters
      .map(character => {
        return `
      <article class="Card">
        <img src="${character.image}" />
        <h2>${character.name}<span>${character.species}</span></h2>
      </article>
    `;
      })
      .join('');
    let newItem = document.createElement('section');
    newItem.classList.add('Items');
    newItem.innerHTML = output;
    $app.appendChild(newItem);
  } else {
    intersectionObserver.unobserve($observe);
    let lastItem = document.createElement('section');
    let output = '<p>Ya no hay personajes...</p>';
    lastItem.innerHTML = output;
    $app.appendChild(lastItem);
  }
};

const loadData = async () => {
  if (localStorage.getItem('next_fetch') === null) {
    localStorage.setItem('next_fetch', API);
  }
  const data = await getData(localStorage.getItem('next_fetch'));
  renderData(data);
};

const intersectionObserver = new IntersectionObserver(
  entries => {
    if (entries[0].isIntersecting) {
      loadData();
    }
  },
  {
    rootMargin: '0px 0px 100% 0px'
  }
);

intersectionObserver.observe($observe);
