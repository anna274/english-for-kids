export class CardList {
  constructor(states, currentState) {
    this.container = this.generateContainer();
    this.states = states;
    this.currentState = currentState;
  }

  // eslint-disable-next-line class-methods-use-this
  generateContainer() {
    const container = document.createElement('div');
    container.classList.add('card__list');
    return container;
  }

  clean() {
    this.container.innerHTML = '';
  }

  addItem(card) {
    this.container.append(card);
  }

  initState() {
    this.container.querySelectorAll('.card').forEach((card) => {
      card.classList.add(this.states[this.currentState]);
    });
  }

  switchState(n) {
    this.container.querySelectorAll('.card').forEach((card) => {
      card.classList.remove(this.states[this.currentState]);
    });
    this.currentState = (this.currentState + n) % this.states.length;
    this.initState();
  }
}
