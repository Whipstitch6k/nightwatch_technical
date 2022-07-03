module.exports = {
  elements:{
    menuButton:{
      selector: 'div[id=nav-toggle]' //alternatively, maybe there is a way to click the upper-right-most button? But this one works for now
    },
    menuWrapper:{
      selector: '#body > div.nav-wrapper.scroll'
    },
    cookieMessage:{
      selector: 'div[id=CybotCookiebotDialogBody]'
    },
    acceptCookieButton:{
      selector: 'a[id=CybotCookiebotDialogBodyButtonAccept]'
    }
  }
};