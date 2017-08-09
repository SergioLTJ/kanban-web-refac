import { KanbanWebRefacPage } from './app.po';

describe('kanban-web-refac App', () => {
  let page: KanbanWebRefacPage;

  beforeEach(() => {
    page = new KanbanWebRefacPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
