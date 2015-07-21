(function(){

var c = new CoverPop({
    expires: 0.1,
    expiresLong:100,
    closeClassNoDefault: 'CoverPop-close',
    closeClassDefault: 'CoverPop-close-go',
    closeClassNoShow: 'CoverPop-close-no-show',
    cookieName: '_CoverPop',
    onPopUpOpen: function(){alert("open")},
    onPopUpClose: function(){alert("close")},
    forceHash: 'splash',
    delayHash: 'go',
    closeOnEscape: true,
    delay: 200,
    hideAfter: null
})
console.log(c);

c.init();

// CoverPop.start();



 })();


