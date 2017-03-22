import { PvevAngularPage } from './app.po';

describe('pvev-angular App', () => {
  let page: PvevAngularPage;

  beforeEach(() => {
    page = new PvevAngularPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
