/*!
 * CoverPop 2.5.0
 * http://coverpopjs.com
 *
 * Copyright (c) 2014 Tyler Pearson
 * Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 */

 (function () {
    'use strict';
    /**
    * Helper methods
    */

    var util =  {
        hasClass: function(el, name) {
            return new RegExp('(\\s|^)' + name + '(\\s|$)').test(el.className);
        },

        addClass: function(el, name) {
            if (!this.hasClass(el, name)) {
                el.className += (el.className ? ' ' : '') + name;
            }
        },

        removeClass: function(el, name) {
            if (this.hasClass(el, name)) {
                el.className = el.className.replace(new RegExp('(\\s|^)' + name + '(\\s|$)'), ' ').replace(/^\s+|\s+$/g, '');
            }
        },

        isFunction: function(functionToCheck) {
            var getType = {};
            return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
        },

        setCookie: function(name, days) {
            var date = new Date();
            date.setTime(+ date + (days * 86400000));
            document.cookie = name + '=true; expires=' + date.toGMTString() + '; path=/';                
        },

        hasCookie: function(name) {
            if (document.cookie.indexOf(name) !== -1) {
                return true;
            }
            return false;
        },

    // check if there is a hash in the url
    hashExists: function(hash) {
        if (window.location.hash.indexOf(hash) !== -1) {
            return true;
        }
        return false;
    },
    preventDefault: function(event) {
        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    },

    mergeObj: function(obj1, obj2) {
        for (var key in obj2) {
            if( obj2.hasOwnProperty( key ) ) {
                obj1[key] = obj2[key];
            }
        }
        return obj1;
    }
};

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
        }

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
        }

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

    //Public methods 

    var open = function(){
        var i, len;
        //if has delay hash, then set cookies to 1 day
        if(util.hashExists(self.options.delayHash)){
            util.setCookie(self.options.cookieName, 1);
            return;
        }
        //open popup
        util.addClass(document.body, 'CoverPop-open');

        //bind closing event 
        if(closeClassDefaultEls.length > 0){
            for(i = 0, len = closeClassDefaultEls.length; i <len; i ++ ){
                closeClassDefaultEls[i].addEventListener('click', function(e){
                    if(e.target === this){
                        console.log("default");
                        close();
                        util.setCookie(self.options.cookieName, self.options.expiresLong);
                    }
                })
            }

        }

        if(closeClassNoDefaultEls.length > 0){
            for(i = 0, len = closeClassNoDefaultEls.length; i <len; i ++ ){
                closeClassNoDefaultEls[i].addEventListener('click', function(e){
                    if(e.target === this){
                        util.preventDefault(e);
                        close();
                        util.setCookie(self.options.cookieName, self.options.expires);
                    }
                })
            }
        }

        if(closeClassNoShowEls.length > 0){
            for(i = 0, len = closeClassNoShowEls.length; i <len; i ++ ){
                closeClassNoShowEls[i].addEventListener('click', function(e){
                    if(e.target === this){
                        util.preventDefault(e);
                        close();
                        util.setCookie(self.options.cookieName, self.options.expiresLong);
                    }
                });
            }
        }

        document.addEventListener("keyup", onDocup, false);
        openCallback();

    }


    var close = function(){
        util.removeClass(document.body, "CoverPop-open");
        document.removeEventListener('keyup', onDocup);
        closeCallback();
    }

    self.init = function(){
        if(navigator.cookieEnabled){

            if(!util.hasCookie(self.options.cookieName) || util.hashExists(self.options.forceHash)){
                if(self.options.delay == 0){

                    open();
                }else {
                    setTimeout(open(), self.options.delay);
                }
                if (self.options.hideAfter){
                    setTimeout(close(), self.options.hideAfter + self.options.delay);
                }
            }

        }
    }
    return self;
}

window.coverPop = coverPop;

})();


