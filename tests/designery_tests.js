describe('Designory Tests', function() {

  before(browser => browser.navigateTo('https://www.designory.com/'));

  /*
  Menu Verification
    On https://www.designory.com, verify that the menu contains six options:
      Work
      About
      Careers
      Locations
      Contact
      News
    Verify that all six options take the user to relevant pages.
    Verify that on those relevant pages menu options are the same.
  */
  it.only('menuVerificationTest', function(browser) {
    browser
      var designory = browser.page.designoryPages();

      designory.navigate()
        //verify menu options not visible before menu click.
        //.verify.not.visible('a[href*="/work"]')
        
        .verify.visible('@menuButton')
        .click('@menuButton')


        //verify menu options visible after click

        .useXpath() // text selectors are Xpath
        .verify.visible("//a[text()='WORK']") 
        browser.getAttribute("//a[text()='WORK']", 'href', function(result1) {
          console.log('result1', result1);
        })
        .useCss()

        .verify.visible('a[href*="/work"]')
        browser.getText('a[href*="/work"]', function(result2) {
          console.log('result2', result2);
        })

        /*
        calling it a night here, checking in for backup and posterity

        maybe we can create an array of menu items to loop through
          instead of visibility check, verify menu contains each element, maybe using expects? research further tomorrow
          use getAttribute to make sure each menuitem points to "/" + menuitem.toLower()
            Note: Location doesn't go to a link but instead has a submenu

        //maybe we can break this whole series of checks out into a function, repeat it for designory.com and designory.com/menuitems
        */
  });

  /*
  Cookie Verification
    Verify that after accepting the cookie notice, the user doesn't see the notice anymore.
    Verify that after closing the cookie notice with the "X" button, the user doesn't see the notice anymore.
    Verify that after clearing cookies the “cookie notice” shows up again. 
  */
  it('cookieVerificationTest', function(browser) {
    browser
      .waitForElementVisible('body')
      .assert.titleContains('NotThereData')
  });

  /*
  Location Verification
    Verify that the Chicago location is present in the footer on https://www.designory.com/locations/chicago and that the following information is correctly displayed: 
      H1 is "CHI"
      Phone number  is "Phone: +1 312 729 4500"
      H2 font size is "40px"
      Map URL is "http://maps.google.com/?q=%20225%20N%20Michigan%20Ave,%20Suite%202100%20Chicago,%20IL%2060601"
  */
  it('locationVerificationTest', function(browser) {
    browser
      .waitForElementVisible('body')
      .assert.titleContains('NotThereData')
  });

  after(browser => browser.end());
});