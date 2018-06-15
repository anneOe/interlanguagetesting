jQuery(function(){  
	$ = jQuery;

	$('body').fadeIn();
		
	Sur.nav1 = new Sur.Nav($('.c-nav'), function() {

		if(Sur.Utils.isMobile()) {
			$('.c-search.mobile').show();

			$('#panel-search .c-listing').show();
		}
	}, function() {
		if(Sur.Utils.isMobile()) {
			$('.c-search.mobile').hide();

			$('#panel-search .c-listing').hide();
		}
	});

	Sur.Search.init({
		onOpen: function() {
			//console.log('  Search.onOpen.callback()');
			//Sur.nav1.close();
		}
	});

	Sur.Book.init();
	Sur.BookInfo.init(Sur.nav1);
	
	// Page: Landing

	/*
	$('#panel-pg-1 .flap .flap-inner').click(function() {

		Sur.router.navigate('/home');
	});
	*/

	//

	//Sur.History.init();

	Sur.Tooltip.init($('.c-tooltip'));
	Sur.Clock.init();

	//Sur.Listing.init();

	Sur.BookFlip.init({
		allowMouseWheel: false
	});
	
	//Sur.Screensaver.init();
	//Sur.Screensaver.initMouseTracking();
});