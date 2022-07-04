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
    menuVerifcationTestSinglePage('/careers');
    menuVerifcationTestSinglePage('/contact');
    menuVerifcationTestSinglePage('/news');

    function menuVerifcationTestSinglePage(suffix){
      browser
        var menuItemsWithLinks = ["WORK", "ABOUT", "CAREERS", "CONTACT", "NEWS"] //all menu items except LOCATIONS, since LOCATIONS is a submenu and the rest are links
        var designory = browser.page.designoryPages();

        designory.navigate('https://www.designory.com' + suffix)
          //Using xpath navigation, I could check to verify the menuItems are actually part of the menu, but based on my current understanding of xpath, I can only verify for a known element structure. There may be a more generic way but at current I do not know. For the time being I will stay with the visibility check method, as the logic still holds. If the element is not visible before clicking the menu button and then visible after clicking the button, then the element is part of the menu

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
          designory.verify.visible('@menuButton') //uncertain why, but above code block breaks everything below unless I lead the next statement with "designory". Perhaps something about the switch to xpath and then back to css removes designory from scope?
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
        designory.verify.visible('@cookieMessage')
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
  it('locationVerificationTest', function(browser) {
    locationVerificationTestWithArgs('Chicago', 'CHI', '+1 312 729 4500', "http://maps.google.com/?q=%20225%20N%20Michigan%20Ave,%20Suite%202100%20Chicago,%20IL%2060601")

      //doing this as a function for future-proofing. We can run it on other locations easier this way
    function locationVerificationTestWithArgs(city, h1Value, phoneNumber, mapUrl){
      browser
        var designory = browser.page.designoryPages();
        designory.navigate('https://www.designory.com/locations/' + city.toLowerCase())
        
        //verify the a element with text "Chicago" and href /locations.chicago is visible
        .useXpath() // text selectors are Xpath
        browser.verify.visible("//a[text()='" + city + "']") 
        browser.expect.element("//a[text()='" + city + "']").to.have.attribute('href').which.contains(city.toLowerCase())
        
        //verify that element is part of the footer. Note: this looks for a very specific known element structure. Maybe there is a way to make it more generic
        browser.verify.elementPresent("//a[text()='" + city + "']//parent::h3/parent::div/parent::div/parent::div/parent::div/parent::div/parent::footer")
        browser.useCss()

        //vefify it is in the footer via xpath navigation

        .verify.textEquals('h1', h1Value)

        //phone element is above the Area of Interest form picker, which is the only form-picker on the page
        const phoneElement = locateWith(By.tagName('P')).above(By.className('form-picker'))
        browser.verify.textEquals(phoneElement, "Phone: " + phoneNumber)

        //h2 font size
        .verify.cssProperty('h2', "font-size", "40px") //gets 16px. This is not a static value so it will change based on window size and the like

        //map url
        .useXpath() //test is xpath
        browser.expect.element("//a[contains(@class, 'location')]").to.have.attribute('href').which.equals("http://maps.google.com/?q=%20225%20N%20Michigan%20Ave,%20Suite%202100%20Chicago,%20IL%2060601") //returns correct but not percent encoded
        browser.useCss();
      }
  });

  after(browser => browser.end());
});