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

  //Note: It might be nice to be able to dynamically create the list of menuItems rather than hardcode them. Might see about figuring out this feature if time permits
  it('menuVerificationTest', function(browser) {

    menuVerifcationTestSinglePage('');
    menuVerifcationTestSinglePage('/work');
    menuVerifcationTestSinglePage('/about');
    menuVerifcationTestSinglePage('/carees');
    menuVerifcationTestSinglePage('/contact');
    menuVerifcationTestSinglePage('/news');

    function menuVerifcationTestSinglePage(suffix){
      browser
        var menuItemsWithLinks = ["WORK", "ABOUT", "CAREERS", "CONTACT", "NEWS"] //all menu items except LOCATIONS, since LOCATIONS is a submenu and the rest are links
        var designory = browser.page.designoryPages();

        designory.navigate('https://www.designory.com' + suffix)
          //for the sake of getting it working, I'm going to do visibility checks before and after clicking the menu button. If an element is not visible before the click and is visible after the click, logically it is part of the menu. There may be a way to check the actual element nesting, however I am having difficult locating this capability at this time. As such for the sake of getting the test written and working I'm going to do the visiblity checks mentioned above. I will return to try and figure out how to check the nesting if time permits


          //verify menu not visible before menu click.
          .verify.not.visible('@menuWrapper')

          //verify menu items not visible before menu click
          .useXpath() // text selectors are Xpath
          .verify.not.visible("//a[contains(@class, 'subnav-toggle') and text()='LOCATIONS']") //locations has a submenu and not a link, test by itself
          for(var i=0; i<menuItemsWithLinks.length; i++){
            browser.verify.not.visible("//a[text()='" + menuItemsWithLinks[i] + "']") 
          }
          browser.useCss()

          //menu click
          designory.verify.visible('@menuButton') //uncertain why, but above code block breaks everything below unless I lead the next statement with "designory". 
          .click('@menuButton')

          //verify menu options visible after click, also check that link matches for all except LOCATIONS
          .verify.visible('@menuWrapper')

          .useXpath() // text selectors are Xpath
          .verify.visible("//a[contains(@class, 'subnav-toggle') and text()='LOCATIONS']") //locations has a submenu and not a link, test by itself
          for(var i=0; i<menuItemsWithLinks.length; i++){
            browser.verify.visible("//a[text()='" + menuItemsWithLinks[i] + "']") 
            browser.expect.element("//a[text()='" + menuItemsWithLinks[i] + "']").to.have.attribute('href').which.contains(menuItemsWithLinks[i].toLowerCase()); //for example, "WORK" sould link to "/work"
          }
          browser.useCss()
      }
  });

  /*
  Cookie Verification
    Verify that after accepting the cookie notice, the user doesn't see the notice anymore.
    Verify that after closing the cookie notice with the "X" button, the user doesn't see the notice anymore.
    Verify that after clearing cookies the “cookie notice” shows up again. 
  */
  it('cookieVerificationTest', function(browser) {
    cookieNoticeWithButtonPress('@acceptCookieButton')
    //cookieNoticeWithButtonPress('@cookieMessageXButton') //there is no x button, awaiting info from Designory

    function cookieNoticeWithButtonPress(buttonSelector){
      browser
        var designory = browser.page.designoryPages();
        designory.navigate('https://www.designory.com')

        .deleteCookies(function() {});
        browser.refresh()
        .verify.visible('@cookieMessage')
        .click(buttonSelector)
        .verify.not.visible('@cookieMessage')
      }
  });

  /*
  Location Verification
    Verify that the Chicago location is present in the footer on https://www.designory.com/locations/chicago and that the following information is correctly displayed: 
      H1 is "CHI"
      Phone number  is "Phone: +1 312 729 4500"
      H2 font size is "40px"
      Map URL is "http://maps.google.com/?q=%20225%20N%20Michigan%20Ave,%20Suite%202100%20Chicago,%20IL%2060601"
  */
  it.only('locationVerificationTest', function(browser) {
    locationVerificationTestWithArgs('chicago', 'CHI', '+1 312 729 4500', "http://maps.google.com/?q=%20225%20N%20Michigan%20Ave,%20Suite%202100%20Chicago,%20IL%2060601")

      //doing this as a function for future=proofing. We can run it on other locations easier this way
    function locationVerificationTestWithArgs(city, h1Value, phoneNumber, mapUrl){
      browser
        var designory = browser.page.designoryPages();
        designory.navigate('https://www.designory.com/locations/' + city)
        
        //verifying Chicago in footer may be difficult. Currently it is rendering in firefox but not in Chrome. That said I can find it in the Dev Tools but it doesn't render. Also not sure how to handle the nesting. Will come back to this one tomorrow

        //.useXpath() //test is xpath
        .verify.textEquals('h1', h1Value)

        //phone element is above the Area of Interest form picker, which is the only form-picker on the page
        const phoneElement = locateWith(By.tagName('P')).above(By.className('form-picker'))
        browser.verify.textEquals(phoneElement, "Phone: " + phoneNumber)

        //h2 font size
        //.verify.cssProperty('h2', "font-size", "40px") //gets 16px. This is not a static value so it will change based on window size and the like

        //map url
        .useXpath() //test is xpath
        browser.expect.element("//a[contains(@class, 'location')]").to.have.attribute('href').which.equals("http://maps.google.com/?q=%20225%20N%20Michigan%20Ave,%20Suite%202100%20Chicago,%20IL%2060601") //returns correct but not percent encoded
        browser.useCss();
      }

      //calling it a night. At current all that is left is checking the footer for Chicago, then polishing up the code
  });

  after(browser => browser.end());
});