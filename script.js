(function(){

// 	var c = new CoverPop({
//     coverId:             'CoverPop-cover',       // set default cover id
//     expires:             0,						// duration (in days) before it pops up again
//     expiresNoShow:       100,                     // duration if users choose not to show again
//     closeClassNoDefault: 'CoverPop-close',       // close if someone clicks an element with this class and prevent default action
//     closeClassDefault:   'CoverPop-close-go',    // close if someone clicks an element with this class and continue default action
//     cookieName:          '_CoverPop',            // to change the plugin cookie name
//     onPopUpOpen:         function() {},          // on popup open callback function
//     onPopUpClose:        function() {},          // on popup close callback function
//     forceHash:           'splash',               // hash to append to url to force display of popup (e.g. http://yourdomain.com/#splash)
//     delayHash:           'go',                   // hash to append to url to delay popup for 1 day (e.g. http://yourdomain.com/#go)
//     closeOnEscape:       true,                    // close if the user clicks escape
//     delay:               0,                     // set an optional delay (in milliseconds) before showing the popup
//     hideAfter:           null                    // set an optional time (in milliseconds) to autohide
// 	});

// c.init();

// console.log(c);

var c = coverPop()
console.log(c);

c.init();

// CoverPop.start();


	
 })();


