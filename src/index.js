import { DATA } from './js/data';
import { WordCard } from './js/WordCard';
import { CategoryCard } from './js/CategoryCard';
import { CardList } from './js/CardList';
import { Router } from './js/Router';
import { Game } from './js/Game';

const HAMBURGER = document.querySelector('.hamburger');
const NAVIGATION = document.querySelector('.header__navigation');
const SWITCHER = document.querySelector('.switcher');
const CONTAINER = document.querySelector('.container');
const STATES = ['train', 'play'];
let currentState = 0;
let gameStarted = false;
const CARD_LIST = new CardList(STATES, currentState);
const GAME = new Game();

/* generate content function */

function generatePlayField() {
  const playField = document.createElement('div');
  playField.classList.add('play-field', STATES[currentState]);
  playField.innerHTML = '<div class="play-field__buttons"><button id="start-game" class="button button_start" type="button">Start game</button></div><div class="count-field"></div>';
  return playField;
}

function generateHomeContent() {
  CARD_LIST.clean();
  DATA.categories.forEach((category) => {
    const card = new CategoryCard(category.id, category.name, category.urlToImg);
    CARD_LIST.addItem(card.generateCard());
  });
  CARD_LIST.initState();

  return CARD_LIST.container;
}

function generateCategoryContent(id) {
  CARD_LIST.clean();
  DATA.words.filter((word) => word.categoryID === id).forEach((word, i) => {
    const card = new WordCard(i, word.word, word.translation, word.urlToImg, word.urlToAudio);
    CARD_LIST.addItem(card.generateCard());
  });
  CARD_LIST.initState();

  return CARD_LIST.container;
}

const ROUTES = [
  {
    path: '/',
    render() {
      return [generateHomeContent()];
    },
  },
  {
    path: '/category/1',
    render() {
      return [generatePlayField(), generateCategoryContent(1)];
    },
  },
  {
    path: '/category/2',
    render() {
      return [generatePlayField(), generateCategoryContent(2)];
    },
  },
  {
    path: '/category/3',
    render() {
      return [generatePlayField(), generateCategoryContent(3)];
    },
  },
  {
    path: '/category/4',
    render() {
      return [generatePlayField(), generateCategoryContent(4)];
    },
  },
  {
    path: '/category/5',
    render() {
      return [generatePlayField(), generateCategoryContent(5)];
    },
  },
  {
    path: '/category/6',
    render() {
      return [generatePlayField(), generateCategoryContent(6)];
    },
  },
  {
    path: '/category/7',
    render() {
      return [generatePlayField(), generateCategoryContent(7)];
    },
  },
  {
    path: '/category/8',
    render() {
      return [generatePlayField(), generateCategoryContent(8)];
    },
  },
];
const router = new Router(ROUTES, CONTAINER);

/* navigation functions */

function switchNavLink(clickedLink) {
  NAVIGATION.querySelectorAll('.navigation__link').forEach((link) => {
    link.classList.remove('active');
  });
  clickedLink.classList.add('active');
}

function definedLink() {
  let res = null;
  NAVIGATION.querySelectorAll('.navigation__link').forEach((link) => {
    // eslint-disable-next-line no-restricted-globals
    if (link.querySelector('a').getAttribute('href') === (location.hash || '#')) {
      res = link;
    }
  });
  return res;
}

/* state functions */

function turnButton() {
  const button = document.getElementById('start-game');
  if (gameStarted) {
    button.innerHTML = '<img class="icon" src="./assets/img/icons/repeat.svg">';
    button.classList.add('repeate');
  } else {
    button.innerHTML = 'Start game';
    button.classList.remove('repeate');
  }
}

function switchState(n) {
  NAVIGATION.classList.remove(`${STATES[currentState]}`);
  if (document.querySelector('.play-field')) {
    document.querySelector('.play-field').classList.remove(STATES[currentState]);
  }
  CARD_LIST.switchState(1);
  currentState = (currentState + n) % STATES.length;
  if (document.querySelector('.play-field')) {
    document.querySelector('.play-field').classList.add(STATES[currentState]);
  }
  NAVIGATION.classList.add(`${STATES[currentState]}`);
  if (STATES[currentState] === 'train' && gameStarted) {
    gameStarted = !gameStarted;
    turnButton();
    document.querySelector('.count-field').innerHTML = '';
    CARD_LIST.container.querySelectorAll('.card').forEach((card) => {
      card.classList.remove('blocked');
    });
  }
}

/* cards functions */

function flipCard(card) {
  card.classList.add('flip');
}

function removeFlip(card) {
  card.addEventListener('mouseleave', (event) => {
    if (event.target.closest('.card')) {
      event.target.classList.remove('flip');
    }
  });
}

function cardHandler(target) {
  const card = target.closest('.card_word');
  if (card) {
    if (STATES[currentState] === 'train') {
      if (target.classList.contains('icon-rotate')) {
        flipCard(card);
        removeFlip(card);
      } else {
        const audio = card.querySelector('audio');
        audio.play();
      }
    } else if (gameStarted) {
      if (!card.classList.contains('blocked')) {
        const gameFinished = GAME.catchAnswer(card.getAttribute('id'));
        if (gameFinished) {
          gameStarted = !gameStarted;
          turnButton();
          switchState(1);
          document.getElementById('switcher').checked = true;
        }
      }
    }
  }
}

// event listeners

document.addEventListener(('click'), (event) => {
  if (!event.target.classList.contains('header__navigation') && !event.target.closest('.hamburger')) {
    NAVIGATION.classList.remove('active');
    HAMBURGER.classList.remove('active');
  }
});

HAMBURGER.addEventListener('click', () => {
  HAMBURGER.classList.toggle('active');
  NAVIGATION.classList.toggle('active');
});

CONTAINER.addEventListener('click', (event) => {
  if (event.target.closest('.card')) {
    cardHandler(event.target);
  }
  if (event.target.closest('.button_start')) {
    if (gameStarted) {
      GAME.startRound();
    } else {
      turnButton();
      gameStarted = !gameStarted;
      turnButton();
      GAME.startGame(document.querySelector('.count-field'), CARD_LIST.container);
    }
  }
});

SWITCHER.addEventListener('click', (event) => {
  if (event.target.classList.contains('switcher__checkbox')) {
    switchState(1);
  }
});

NAVIGATION.addEventListener('click', (event) => {
  if (event.target.closest('.navigation__link')) {
    NAVIGATION.classList.remove('active');
    HAMBURGER.classList.remove('active');
  }
});

window.addEventListener('hashchange', () => {
  router.hashChanged();
  switchNavLink(definedLink());
});

window.addEventListener('DOMContentLoaded', () => {
  router.hashChanged();
  switchNavLink(definedLink());
});
