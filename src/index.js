const $app = document.getElementById('app');
const $observe = document.getElementById('observe');
const API = 'https://us-central1-escuelajs-api.cloudfunctions.net/characters';
//const API = 'https://rickandmortyapi.com/api/character/';

window.onload = () => {
  localStorage.clear();
};

const getData = api => {
  fetch(api)
    .then(response => response.json())
    .then(response => {
      //debugger;
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
        loadData(API);
      }
    })
    .catch(error => console.log(error));
};

const loadData = async () => {
  if (localStorage.getItem('next_fetch')) {
    await getData(localStorage.getItem('next_fetch'));
  } else {
    await getData(API);
  }
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
