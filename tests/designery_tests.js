describe('Designory Tests', function() {

  before(browser => browser.navigateTo('https://www.designory.com/'));

  it('Designery tests', function(browser) {
    browser
      .waitForElementVisible('body')
      .assert.titleContains('Designory')
  });

  after(browser => browser.end());
});