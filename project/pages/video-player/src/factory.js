const [rootPath] = window.location.href.split("/pages/");
const factory = {
  async initalize() {
    // return CardsController.initialize({
    //   worker: cardListWorker,
    //   view: new CardsView(),
    //   service: new CardsService({
    //     dbUrl: `${rootPath}/assets/database.json`,
    //     cardListWorker,
    //   }),
    // });
  },
};

export default factory;
