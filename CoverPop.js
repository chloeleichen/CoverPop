/*!
 * CoverPop 2.5.0
 * http://coverpopjs.com
 *
 * Copyright (c) 2014 Tyler Pearson
 * Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 */

(function () {
    'use strict';
   function CoverPop(options){
   this.options = this.util.mergeObj(this.defaults, options);
   this.closeClassDefaultEls = document.querySelectorAll('.'+this.options.closeClassDefault);
   this.closeClassNoDefaultEls = document.querySelectorAll('.'+this.options.closeClassNoDefault);

}

CoverPop.prototype ={
         /**
         * Helper methods
         */
         defaults : {

            // set default cover id
            coverId: 'CoverPop-cover',

            // duration (in days) before it pops up again
            expires: 30,

            expiresNoShow:       100,

            // close if someone clicks an element with this class and prevent default action
            closeClassNoDefault: 'CoverPop-close',

            // close if someone clicks an element with this class and continue default action
            closeClassDefault: 'CoverPop-close-go',

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
        },

         /**
         * Helper methods
         */

         util : {


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
        },

        /**
         * Private Methods
         */

        _openCallback: function(){
            var self = this;
            if(self.options.onPopUpOpen !== null){
                if (self.util.isFunction(self.options.onPopUpOpen)){
                    self.options.onPopUpOpen.call();
                } else {
                    throw new TypeError("Call back function must be a function");
                }
            }
        },

        _closeCallback: function(){
            var self = this;
            if(self.options.onPopUpClose !== null){
                if (self.util.isFunction(self.options.onPopUpClose)){
                    self.options.onPopUpClose.call();
                } else {
                    throw new TypeError("Call back function must be a function");
                }
            }
        },
    /**
     * Public methods
     */

    open: function(){

        var self = this;
        var i, len;

        if(self.util.hashExists(self.options.delayHash)){
            self.util.setCookie(self.options.cookieName, 1);
            return;
        }

        self.util.addClass(document.body, 'CoverPop-open');

        if (self.closeClassNoDefaultEls.length > 0){
            for (i = 0, len = self.closeClassNoDefaultEls.length; i < len; i ++){
                self.closeClassNoDefaultEls[i].addEventListener("click", function(e){
                    if (e.target === this){
                        self.util.preventDefault(e);
                        self.close(self.options.expires);
                    }
                });
            }
        }

        if (self.closeClassDefaultEls.length > 0){
            for (i = 0, len = self.closeClassDefaultEls.length; i < len; i ++){
                self.closeClassDefaultEls[i].addEventListener('click', function(e){
                    if(e.target == this){
                        self.close(self.options.expiresNoShow);
                    }
                });
            }
        }

        self._openCallback();
    },

    close: function(duration){
        var self = this;

        self.util.removeClass(document.body, 'CoverPop-open');
        self.util.setCookie(self.options.cookieName, duration);
        self._closeCallback();
    },

    init : function(){
        var self = this;
        console.log(document.cookie);
        var onDocup = function(e){
            if(self.options.closeOnEscape){
                if (e.keyCode === 27){
                    self.close();
                }
            }
        }

        if(navigator.cookieEnabled){
            if(!self.util.hasCookie(self.options.cookieName) || self.util.hashExists(self.options.forceHash)){
                console.log("no cookies");
                document.addEventListener('keyup', onDocup, false);
                if((self.options.delay) === 0){
                    self.open();
                }else{
                    setTimeout(self.open(), self.options.delay);
                }

                if (self.options.hideAfter){
                    setTimeout(self.close(), self.options.hideAfter + self.options.delay);
                    document.removeEventListener('keyup', onDocup, false);
                }
            }
        } else {
            alert("Cookie not enabled");
        }
    }

}

window.CoverPop = CoverPop;
})();


