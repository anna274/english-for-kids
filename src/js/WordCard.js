function genetareCapture(capture) {
  return `<h2 class="card__capture">${capture}</h2>`;
}

function genetareImgContainer(urlToImg) {
  return `<div class="card__img-container"> <img class="card__img" src="${urlToImg}"> </div>`;
}

export class WordCard {
  constructor(id, word = null, translation = null, urlToImg = null, urlToAudio = null) {
    this.id = id;
    this.word = word;
    this.translation = translation;
    this.urlToImg = urlToImg;
    this.urlToAudio = urlToAudio;
  }

  generateCard() {
    const card = document.createElement('div');
    card.classList.add('card', 'card_word');
    card.setAttribute('id', this.id);

    let content = '';

    // generate front side
    content += '<div class="card__front">';
    content += '<div class="card__inner">';
    content += genetareImgContainer(this.urlToImg);
    content += genetareCapture(this.word);
    content += '<div class="card__rotate-item"> <span class="icon icon-rotate"></span></div>';
    content += '</div>';
    content += '</div>';

    // generate back side
    content += '<div class="card__back">';
    content += '<div class="card__inner">';
    content += genetareImgContainer(this.urlToImg);
    content += genetareCapture(this.translation);
    content += '</div>';
    content += '</div>';

    content += `<audio src="${this.urlToAudio}"></audio>`;

    card.innerHTML = content;

    return card;
  }
}
