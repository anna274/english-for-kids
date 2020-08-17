export class CategoryCard {
  constructor(id, name = '', urlToImg = null) {
    this.id = id;
    this.name = name;
    this.urlToImg = urlToImg;
  }

  generateCard() {
    const link = document.createElement('a');
    link.setAttribute('href', `#/category/${this.id}`);
    const card = document.createElement('div');
    card.classList.add('card', 'card_category');
    let content = '<div class="card__inner">';
    content += '<div class="card__img-container">';
    content += `<img class="card__img" src="${this.urlToImg}">`;
    content += '</div>';
    content += `<div class="card__capture">${this.name}</div>`;
    content += '</div>';
    card.innerHTML = content;
    link.append(card);
    return link;
  }
}
