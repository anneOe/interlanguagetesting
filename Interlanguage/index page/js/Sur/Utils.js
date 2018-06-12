var Sur = Sur || {};

Sur.Utils = (function($) {
	"use strict";
	return {
		
		isMobile: function() {
			return $(window).width() < 768;	
		},

		isTouch: function() {

			return 'ontouchstart' in window  || navigator.maxTouchPoints;
		},

		isset: function(v) {

			return typeof v !== undefined && v;
		},

		isSafari: function() {
			var is_chrome = navigator.userAgent.indexOf('Chrome') > -1;
		    var is_safari = navigator.userAgent.indexOf("Safari") > -1;
		    if ((is_chrome)&&(is_safari)) {is_safari=false;}
		    return is_safari;
		}
	};	
})(jQuery);