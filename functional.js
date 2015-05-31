var coverPop = function(options){
    var self = {},
    defaults = {

            // set default cover id
            coverId: 'CoverPop-cover',

            // duration (in days) before it pops up again
            expires: 30,

            expiresLong:       100,

            // close if someone clicks an element with this class and prevent default action
            closeClassNoDefault: 'CoverPop-close',

            // close if someone clicks an element with this class and continue default action
            closeClassDefault: 'CoverPop-close-go',

            //button stops popup from showing again for as long as expireNoShow
            closeClassNoShow: 'CoverPop-close-no-show',

            // change the cookie name
            cookieName: '_CoverPop',

            // on popup open function callback
            onPopUpOpen: null,

            // on popup close function callback
            onPopUpClose: null,

            // hash to append to url to force display of popup
            forceHash: 'splash',

            // hash to append to url to delay popup for 1 day
            delayHash: 'go',

            // close if the user clicks escape
            closeOnEscape: true,

            // set an optional delay (in milliseconds) before showing the popup
            delay: 0,

            // automatically close the popup after a set amount of time (in milliseconds)
            hideAfter: null
        };
        self.options = util.mergeObj(defaults, options);
        //close button that continues default behaviour(e.g, submit, link)
        var closeClassDefaultEls = document.querySelectorAll('.' + self.options.closeClassDefault);
        //close button prevents default bahaviour
        var closeClassNoDefaultEls = document.querySelectorAll('.'+self.options.closeClassNoDefault);
        //close button supress popup from showing again and no default behaviour 
        var closeClassNoShowEls = document.querySelectorAll('.'+self.options.closeClassNoShow);

        var onDocup = function(e){
            if(self.options.closeOnEscape){
                if(e.keyCode === 27){
                    self.close();
                }
            }
        };

        var openCallback = function(){
            if(self.options.onPopUpOpen !== null){
                if (util.isFunction(self.options.onPopUpOpen)){
                    self.options.onPopUpOpen.call();
                } else {
                    throw new TypeError("Call back function must be a function");
                }
            } else {
                console.log("open without callback");
            }
        };

        var closeCallback = function(){
            if(self.options.onPopUpClose !== null){
                if (util.isFunction(self.options.onPopUpClose)){
                    self.options.onPopUpClose.call();
                } else {
                    throw new TypeError("Call back function must be a function");
                }
            }
            else{
                console.log("close without callback");
            }

        };

    var open = function(){
        var i, len;
        //if has delay hash, then set cookies to 1 day
        if(util.hashExists(self.options.delayHash)){
            util.setCookie(self.options.cookieName, 1);
            return;
        }
        //open popup
        util.addClass(document.body, 'CoverPop-open');

        function Default(e){
            if(e.target === this){
                console.log("default");
                        // close();

                        //util.setCookie(self.options.cookieName, self.options.expiresLong);
                    }
        }

        function noDefault(e){
            if(e.target === this){
                        util.preventDefault(e);
                        close();
                        util.setCookie(self.options.cookieName, self.options.expires);
                    }
        }

        function noDefaultNoShow(e){
            if(e.target === this){
                        util.preventDefault(e);
                        close();
                        util.setCookie(self.options.cookieName, self.options.expiresLong);
                    }
        }

        //bind closing event 
        if(closeClassDefaultEls.length > 0){
            len = closeClassDefaultEls.length;
            for(i = 0; i <len; i +=1 ){
                closeClassDefaultEls[i].addEventListener('click', Default);
            }

        }

        if(closeClassNoDefaultEls.length > 0){
            len = closeClassNoDefaultEls.length;
            for(i = 0; i <len; i +=1 ){
                closeClassNoDefaultEls[i].addEventListener('click', noDefault);
            }
        }

        if(closeClassNoShowEls.length > 0){
            len = closeClassNoShowEls.length;
            for(i = 0; i <len; i +=1 ){
                closeClassNoShowEls[i].addEventListener('click', noDefaultNoShow);
            }
        }

        document.addEventListener("keyup", onDocup, false);
        openCallback();
    };

    var close = function(){
        util.removeClass(document.body, "CoverPop-open");
        document.removeEventListener('keyup', onDocup);
        closeCallback();
    };

    self.init = function(){
        if(navigator.cookieEnabled){

            if(!util.hasCookie(self.options.cookieName) || util.hashExists(self.options.forceHash)){
                if(self.options.delay === 0){

                    open();
                }else {
                    setTimeout(open(), self.options.delay);
                }
                if (self.options.hideAfter){
                    setTimeout(close(), self.options.hideAfter + self.options.delay);
                }
            }

        }
    };

    return self;
};