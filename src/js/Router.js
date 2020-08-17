export class Router {
  constructor(routes, rootElement) {
    this.routes = routes;
    this.rootElement = rootElement;
  }

  // eslint-disable-next-line class-methods-use-this
  getPath() {
    // eslint-disable-next-line no-restricted-globals
    return location.hash.slice(1) || '/';
  }

  getRoute(path) {
    return this.routes.find((route) => route.path === path);
  }

  changeContent(route) {
    this.rootElement.innerHTML = '';
    this.rootElement.append(...route.render());
  }

  hashChanged() {
    const path = this.getPath();
    const route = this.getRoute(path);
    this.changeContent(route);
  }
}
