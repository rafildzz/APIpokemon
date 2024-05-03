/********************************************************************************************
 * Objetivo: Consumir API com personagens 
 * Data: 28/04/2024
 * Autores: Rafael Reis e Matheus Oliveira
 * Versão: 1.5.4.24
 * 
 ******************************************************************************************/



async function fetchPokemonData(name) {
  try {
      const response = await fetch(`https://api.pokemontcg.io/v1/cards?name=${name}`);
      const data = await response.json();
      return data.cards;
  } catch (error) {
      console.error('Error:', error);
      return null;
  }
}

window.addEventListener('load', async () => {
  const allPokemonData = await fetchPokemonData(''); // Busca todos os personagens da API
  if (allPokemonData) {
    displayCards(allPokemonData); // Exibe todos os personagens na tela
  } else {
    const errorMessage = document.createElement('p');
    errorMessage.textContent = 'Failed to load Pokémon data.';
    const charactersContainer = document.getElementById('characters-container');
    charactersContainer.innerHTML = '';
    charactersContainer.appendChild(errorMessage);
  }
});

function createCard(pokemon) {
  const card = document.createElement('div');
  card.classList.add('card');

  const image = new Image();
  image.src = pokemon.imageUrl;
  image.alt = pokemon.name;

  const name = document.createElement('h2');
  name.textContent = pokemon.name;

  card.appendChild(image);
  card.appendChild(name);

  return card;
}

async function search() {
  const searchInput = document.getElementById('searchInput').value.trim().toLowerCase();
  if (searchInput === '') return;

  const charactersContainer = document.getElementById('characters-container');
  const cachedData = search.cache && search.cache[searchInput];

  if (cachedData) {
      displayCards(cachedData);
      scrollToPokemon(searchInput);
  } else {
      const pokemonData = await fetchPokemonData(searchInput);
      if (pokemonData) {
          if (!search.cache) search.cache = {};
          search.cache[searchInput] = pokemonData;
          displayCards(pokemonData);
          scrollToPokemon(searchInput);
      } else {
          const errorMessage = document.createElement('p');
          errorMessage.textContent = 'Não existe Pokémon com esse nome';
          charactersContainer.innerHTML = '';
          charactersContainer.appendChild(errorMessage);
      }
  }
}

function displayCards(data) {
  const charactersContainer = document.getElementById('characters-container');
  charactersContainer.innerHTML = '';

  data.forEach(pokemon => {
      const card = createCard(pokemon);
      charactersContainer.appendChild(card);
  });
}

function scrollToPokemon(pokemonName) {
  const pokemonCards = document.querySelectorAll('.card');
  let found = false;
  pokemonCards.forEach(card => {
      if (!found && card.textContent.toLowerCase().includes(pokemonName)) {
          card.scrollIntoView({ behavior: 'smooth', block: 'start' });
          found = true;
      }
  });
}

window.addEventListener('load', () => {
  displayCards([]);
});