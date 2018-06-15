var Sur = Sur || {};

Sur.Search = (function() {

	// Minimum number of characters before applying search
	var 
		CHARS_MIN = 1,
		options;

	function clear($listing) {

		$listing.html('');
	}

	//

	function btSearch_onClick() {
		console.log('Search.button.click()');

		// Save previous panel

		$('.c-bookflip .c-panels.before-search').removeClass('before-search');
		var $panel = Sur.BookFlip.getCurrentPanel();
		
		if($panel.length > 0) { //no necessary
			$panel.addClass('before-search');
			$panel.data('href', window.location.pathname);
		}

		//

		$("body").addClass("search-panel-open"); //todo should be in router

		//Sur.History.reset();

		Sur.router.navigate('/search');

		//deprecated?
		//$('.bloc-item .bt-back a').attr('url', 'history.back();');

		//$('.c-search.mobile').hide();
		options.onOpen();
	}

	function btClose_onClick() {

		var $panel = $('#panel-search')

		console.log('Search.close.click()');
		//$elem.removeClass('open');
		//$('.c-search-input').hide();

		$("body").removeClass("search-panel-open");

		//$('.c-bookflip').show();
		$panel.removeClass('opened').addClass('closed');
		//$($panel.data('previous')).removeClass('closed').addClass('opened');
		$('#panel-pg-2').removeClass('closed').addClass('opened');

		//Close nav if open
		if(Sur.Utils.isMobile()) {
			$('.c-header').removeClass('open');
			$('.c-header .index').removeClass('open');
			$('.c-nav').removeClass('open');
			$('.c-search.mobile').hide();
		}

		// Go back to previous panel

		var $previous = $('.c-bookflip .c-panels.before-search');

		if($previous.length > 0) {

			Sur.router.navigate($previous.data('href'));

		} else {
			Sur.router.navigate('/home');
		}		
	}

	return {
		init: function(opts) {
			//console.log('search.init()');

			options = $.extend({}, {
				onOpen: $.noop
			}, opts);

			var 
				$panel = $('#panel-search'), //$('.c-search'),
				$left = $panel.find('.flap.left-side'),
				//$panel = //$('.c-search-input'),
				$input = $left.find('input'),
				resetTimeout = null;
				//$input = $panel.find('input');

			$('.c-search .bt.search').click(btSearch_onClick);
			$panel.find('.bt.close').click(btClose_onClick);

			// Search autocomplete

			$input.data('oldval', $input.val());

			$input.bind('change click keyup input', function(e) {

				var 
					val = $input.val(),
					$listing = $panel.find('.c-listing .items');

				Sur.Tooltip.clear();
				if(val.length === 0) {

					clear($listing);

				} else {

					if(val !== $input.data('oldval') && val.length >= CHARS_MIN) {
						//console.log('searching for', val);

						var books = Sur.Api.search(val);

						clear($listing);

						$.each(books, function(idx, book) {

							var spread_url = '';
							if(book.images['book-spread']) {
								spread_url = Sur.config.img_host+book.images['book-spread'].small.url
							}

							/*
							$('<div class="item">'+
									'<a href="'+Sur.Book.url(book)+'" class="c-tooltip" data-tooltip-img="'+spread_url+'" data-tooltip-tag="'+book.book_tag+'" data-book-id="'+book.book_id+'">'+
										'<div class="title-ctn">'+
											'<div>'+book.title_en+'</div>'+
										'</div>'+
										'<div class="paging">'+book.book_tag+'</div>'+
									'</a>'+
								'</div>').appendTo($listing);
							*/
							var tpl = $('#listing-item').html();
							
							Mustache.parse(tpl);
							
							$(Mustache.render(tpl, {
								url: Sur.Book.url(book),
								img: spread_url,
								bookTag: book.book_tag,
								bookId: book.book_id,
								title: book.title_en
							})).appendTo($listing);
						});

						// $('<div class="item back-to-top">'+
						// 	'<a href="#">'+
						// 		'<div class="title-ctn" title="">'+
						// 			'<div>Back to top</div>'+
						// 		'</div>'+
						// 	'</a>'+
						// '</div>').appendTo($listing);

						Sur.Tooltip.init($('.c-search-input .c-tooltip'));

						//

						$input.data('oldval', val);

						clearTimeout(resetTimeout);
						resetTimeout = setTimeout(function() {
							Sur.Listing.resetScroll();	
						}, 200);
						
					}					
				}				
			});
		}
	};
}(jQuery));