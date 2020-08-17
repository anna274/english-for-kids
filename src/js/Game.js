const CORRECT_SOUND = new Audio('./assets/audio/correct.mp3');
const INCORRECT_SOUND = new Audio('./assets/audio/incorrect.mp3');
const WIN_SOUND = new Audio('./assets/audio/win.mp3');
const FAILURE_SOUND = new Audio('./assets/audio/failure.mp3');
const STAR_URL = './assets/img/icons/star.svg';
const STAR_FAILURE_URL = './assets/img/icons/star-failure.svg';

function generateStar(isCorrect) {
  const star = document.createElement('img');
  star.classList.add('icon');
  if (isCorrect) {
    star.setAttribute('src', STAR_URL);
  } else {
    star.setAttribute('src', STAR_FAILURE_URL);
  }
  return star;
}

function shuffle(array) {
  const sortedArray = [...array];
  for (let i = sortedArray.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [sortedArray[i], sortedArray[j]] = [sortedArray[j], sortedArray[i]];
  }
  return sortedArray;
}

export class Game {
  constructor() {
    this.countField = null;
    this.errors = 0;
    this.cardList = null;
    this.cardsId = [];
    this.index = 0;
    this.result = {
      urlToImg: null,
      text: '',
      audio: null,
    };
  }

  startGame(countField, cardList) {
    this.countField = countField;
    this.cardList = cardList;
    this.cardsId = [];
    this.index = 0;
    this.errors = 0;

    this.cardList.querySelectorAll('.card').forEach((card) => {
      this.cardsId.push(card.getAttribute('id'));
    });
    this.cardsId = shuffle(this.cardsId);
    setTimeout(this.startRound.bind(this), 1000);
  }

  startRound() {
    const currentAudio = document.getElementById(this.cardsId[this.index]).querySelector('audio');
    currentAudio.play();
  }

  catchAnswer(answerId) {
    if (answerId === this.cardsId[this.index]) {
      return this.finishRound();
    }

    INCORRECT_SOUND.play();
    this.countField.prepend(generateStar(false));
    this.errors += 1;
    setTimeout(this.startRound.bind(this), INCORRECT_SOUND.duration * 1000 + 1000);
    return false;
  }

  finishRound() {
    CORRECT_SOUND.play();
    document.getElementById(this.cardsId[this.index]).classList.add('blocked');
    this.countField.prepend(generateStar(true));
    this.index += 1;
    if (this.index < this.cardsId.length) {
      setTimeout(this.startRound.bind(this), 1000);
      return false;
    }

    this.finishGame();
    setTimeout(this.showResalt.bind(this), 300);
    return true;
  }

  finishGame() {
    this.countField.innerHTML = '';
    this.cardList.querySelectorAll('.card').forEach((card) => {
      card.classList.remove('blocked');
    });

    if (this.errors === 0) {
      this.result.text = `Waaay, ${this.errors} errors! Good job!`;
      this.result.urlToImg = './assets/img/game-results/good.svg';
      this.result.audio = WIN_SOUND;
    } else {
      this.result.audio = FAILURE_SOUND;
      if (this.errors < 3) {
        this.result.text = `${this.errors} errors. Well done, but need more practice.`;
        this.result.urlToImg = './assets/img/game-results/not-bad.svg';
      } else {
        this.result.text = `${this.errors} errors. Hm, not really good results.`;
        this.result.urlToImg = './assets/img/game-results/sad.svg';
      }
    }
  }

  showResalt() {
    const overlay = document.createElement('div');
    const modal = document.createElement('div');
    overlay.classList.add('overlay');
    modal.classList.add('modal');
    modal.innerHTML = `<span class="close modal__close">&times;</span><img class="modal__img" src="${this.result.urlToImg}"><div class="modal__text">${this.result.text}</div>`;
    overlay.append(modal);
    document.querySelector('body').append(overlay);
    overlay.classList.add('active');
    this.result.audio.play();
    document.querySelector('.modal__close').addEventListener('click', () => {
      overlay.classList.remove('active');
      overlay.addEventListener('transitionend', () => {
        overlay.remove();
      });
      // eslint-disable-next-line no-restricted-globals
      location.hash = '';
    });
  }
}
