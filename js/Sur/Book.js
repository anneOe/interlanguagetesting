var Sur = Sur || {};

Sur.Book = (function($) {

	var swipeOffset = 10,
	default_anim_timing_mobile = 330
	latest_opening_direction = "open_from_right", 
	is_loading_img = false;

	function previousBook_onClick(e) {
		console.log('Book.previousBook_onClick()');
		e.preventDefault();

		var $this = $(this);

		if($this.closest('.previous').hasClass('disabled')) {
			return false;
		}

		Sur.BookFlip.getCurrentPanel().data('direction', 'open_from_left');

		var book = Sur.Api.getBook($(this).data('book-id'));
		//console.log(book);

		Sur.router.navigate(Sur.Book.url(book));
		
		//Sur.BookFlip.open($currentPanel, $newPanel, 'open_from_left');

		return false;
	}

	function nextBook_onClick(e) {
		e.preventDefault();

		var $this = $(this);

		if($this.closest('.next').hasClass('disabled')) {
			return false;
		}

		Sur.BookFlip.getCurrentPanel().data('direction', 'open_from_right');

		var book = Sur.Api.getBook($(this).data('book-id'));
		//console.log(book);

		Sur.router.navigate(Sur.Book.url(book));

		return false;
	}

	function back_onClick(e) {
		console.log('book.back.click()');
		
		var 
			//$prevPage = $($(this).data('previous')),
			$prevPage = $('.c-panels.last-opened'),
			href = $prevPage.data('href');
			//href = $(this).attr('href');

		//console.log('  $prevPage', $prevPage);
		//console.log('  href', href);

		//Sur.Listing.syncPos($prevPage);

		if($prevPage.length > 0) {

			e.preventDefault();

			// Sur.History.reset();

			Sur.Listing.syncPos($prevPage);

			//$('.flap.right-side').show();

			var $currentPanel = Sur.BookFlip.getCurrentPanel();

			Sur.BookFlip.open($currentPanel, $prevPage, 'open_from_left', undefined, function() {

				//$('.flap.right-side').hide();

				//Sur.Listing.resetScroll(); //Because when the listing is initialized the parents are hidden so it cannot properly setup the "scrollAmount"

				Sur.router.navigate(href);
			});

			return false;

		} else {
			//alert('no prev');

			//Sur.router.navigate(href);
			//window.location = href;

			//nothing we le the browser refresh the page
		}

		//return false;
	}

	//
	function cleanSwipe($imgsrc) {
		var $imgvp = $imgsrc.closest(".img-viewport");
		var $mp = $imgvp.find(".mobile-paging");
		$imgsrc.removeAttr('style');
		$imgvp.removeAttr('style');
		$mp.removeAttr('style');
		$imgsrc.swipe("destroy");
	}
	function initSwipe($imgsrc, callback, origin_direction) {
		console.log('initSwipe()', $imgsrc);

		origin_direction = (origin_direction) ? origin_direction : latest_opening_direction;
		latest_opening_direction = origin_direction;

		if(!is_loading_img) {
			var $imgvp = $imgsrc.closest(".img-viewport");
			var $mp = $imgvp.find(".mobile-paging");

			
			console.log("******", origin_direction);
			
			cleanSwipe($imgsrc);
			$imgsrc.css({
				"margin-top": ($(window).height()/2) - ($imgsrc.height()/2) - swipeOffset
			});

			if(Sur.Utils.isMobile()) {
				//Enable swipe on mobile
				var vw = $(window).width(),
					vh = $(window).height(),
					orientation = null;

				if(vw <= vh) {
					$imgsrc.css({
						"max-height": "80vh", 
						"width": "auto"
					});
					orientation = "v";
				}

				if($imgsrc.width() / 2 > vw) {
					$imgsrc.css({
						"height": "auto", 
						"max-width": "200%"
					});
					orientation = "h";
				}

				var dst = $(window).width() - ($imgsrc.width()/2) - swipeOffset;
				$imgsrc.css({
					"margin-top": ($(window).height()/2) - ($imgsrc.height()/2) - swipeOffset,
					"margin-left": dst
				});

				var leftOffset = null;
				if(origin_direction == 'open_from_left') {
					$imgsrc.addClass("right");
					leftOffset = 0 - (($(window).width() - $imgsrc.width()/2) + $imgsrc.width()/2);
					$imgvp.css({
						"left": leftOffset
					});
				}else{
					$imgsrc.addClass("left");
					leftOffset = 0;
					$imgvp.css({
						"left": leftOffset
					});
				}

				if($mp.length) {
					$mp.css({
						"left": $mp.position().left + $(window).width() - $mp.width() - swipeOffset - 2,
						"top": $(window).height() - $mp.height() - (swipeOffset * 3),
						"opacity": "1"
					});	
				}
				
				$imgsrc.swipe({
					swipeLeft: function(event, direction, distance, duration, fingerCount, fingerData) {
						console.log('Swiping left');

						if($imgsrc.hasClass('right')) {
							//nextBook_onClick();
							$imgsrc.closest('.bloc-item').first().find('.others .next a').trigger('click');
						} else {
							
							$imgsrc
								.removeClass('left')
								.addClass('right');

							latest_opening_direction = 'open_from_left';

							var leftOffset = 0 - (($(window).width() - $imgsrc.width()/2) + $imgsrc.width()/2);
							if($(window).width() <= ($imgsrc.width()/2)) {
								leftOffset = 0 - ($imgsrc.width()/2 + swipeOffset);
							}

							$imgvp.animate({
								left: leftOffset
							}, { 
						        duration: default_anim_timing_mobile,
						        queue: false,
						        easing: "swing"
						      });
						}					
					},
					swipeRight: function(event, direction, distance, duration, fingerCount, fingerData) {
						console.log('Swiping right');

						if($imgsrc.hasClass('left')) {
							//previousBook_onClick();
							$imgsrc.closest('.bloc-item').first().find('.others .previous a').trigger('click');
						} else {
							// var distance = $(window).width() - ($imgsrc.width()/2) - swipeOffset;
							var leftOffset=0;

							$imgsrc
								.removeClass('right')
								.addClass('left');

							latest_opening_direction = 'open_from_right';

							$imgvp.animate({
								left: leftOffset
							}, { 
						        duration: default_anim_timing_mobile,
						        complete: function() {
						            // reset($(this));
						        }, 
						        queue: false,
						        easing: "swing"
						      });
						}					
					},
	        		threshold:(screen.availWidth) / 60
				});

			}

		}
		
		if(callback) {
			callback();	
		}		
	}

	function reset($elem){
	    $elem.attr('style','');
	}

	function url(book) {
		//console.log('  url book', book);
		return '/edition/'+Sur.data.edition.id+'/'+book.book_id;
	}

	// Generic code allowing to set the previous or next button.
	function setNextPrev($nav, bookid) {

		if(bookid === 0) {
			
			$nav.addClass('disabled');

			return false;
		}

		var	book = Sur.Api.getBook(bookid);
		
		if(book) {
			
			$nav.removeClass('disabled');
			
			$nav.find('a')
				.data('book-id', bookid)
				.attr('href', url(book));
		}	
	}

	function isCurrent(bookid) {

		return $('.bloc-item').data('bookid') === bookid;
	}

	return {
		init: function() {
			console.log('Book.init()');

			$(document).on('click', '.bloc-item .others .previous a', null, previousBook_onClick);
			$(document).on('click', '.bloc-item .others .next a', null, nextBook_onClick);
			$(document).on('click', '.bloc-item .bt-back a', null, back_onClick);
						
			//
			//initSwipe($('.bloc-item .img img'));
			$(window).resize(function() {
				initSwipe($('.bloc-item .img img'));
			}).resize();
		}, 

		/*
		// Fill panel with book data
		fill: function(editionid, bookid) {

			var $bloc = $('.bloc-item');

			if($bloc.data('bookid') !== bookid) {

				var book = Sur.Api.getBook(parseInt(bookid, 10));
				//console.log('book', book);

				var $img = $('.bloc-item .img');

				$img.find('.spinner').show();

				$img.html('<div class="spinner"></div><img src="'+Sur.config.img_host+book.images['book-spread'].large.url+'" />');
				//console.log('book tag', book.book_tag);
				$('.bloc-item .paging').html(book.book_tag);

				$img.waitForImages(function() {
					$img.find('.spinner').hide();
					initSwipe($img.find("img"));
				});

				//console.log('bookid', book.book_id);
				$bloc.data('bookid', book.book_id);
			}

			// Set panel info url
			$('.bloc-item .bt-info a').attr('href', '/edition/'+editionid+'/'+bookid+'/info');

			//
			
			$('#pg-index .bloc-item').show();
		},*/

		// Fill panel with book data
		fill: function($panel, bookid) {
			console.log('Book.fill()');

			if(!isCurrent(bookid)) {

				//var book = Sur.Api.getBook($(this).data('book-id'));
				var book = Sur.Api.getBook(bookid);
				//console.log('  book id', $(this).data('book-id'));
				//console.log('  book', book);

				// Book

				var tpl = $('#tpl-book').html();
				Mustache.parse(tpl);

				var $book = $(Mustache.render(tpl, {
					editionId: Sur.data.edition.id,
					bookId: book.book_id,
					img: Sur.Utils.isset(book.images) ? '<img src="'+Sur.config.img_host+book.images['book-spread'].large.url+'" />' : '',
					bookTag: book.book_tag,
					previousBookUrl: '#',
					nextBookUrl: '#',
					urlBookInfo: Sur.BookInfo.url(book)
				}));

				// Book info

				var tpl = $('#tpl-bookinfo').html();
				Mustache.parse(tpl);

				var $bookinfo = $(Mustache.render(tpl, {}));			

				//

				$panel.find('.flap-content-inner').html('').append($book).append($bookinfo);
				//$panel.find('.flap-content-inner').append($bookinfo);				
			}

			// Set prev/next books

			bookid = Sur.Listing.getActiveBookNext();
			Sur.Book.setNext(bookid);

			bookid = Sur.Listing.getActiveBookPrev();
			Sur.Book.setPrev(bookid);

			//

			$panel.find('.bloc-item').show();

			//

			var $img = $panel.find('.bloc-item .img');

			cleanSwipe($img.find("img"));
			is_loading_img = true;
			$img.css("opacity", "0");
			$img.waitForImages(function() {
				$img.css("opacity", "1");
				is_loading_img = false;
				$img.find('.spinner').hide();
				initSwipe($img.find("img"));
			});
		},

		// Return current book URL
		url: url,		

		isCurrent: isCurrent,

		createPanel: function() {
			console.log('Book.createPanel()');

			var tpl = $('#tpl-panel').html();
			Mustache.parse(tpl);

			var $currentPanel = Sur.BookFlip.getCurrentPanel();

			var $newPanel = $(Mustache.render(tpl, {
				content: '' //$book.prop('outerHTML')
			}));

			$currentPanel.after($newPanel);

			return $newPanel;
		},

		// Set next book
		setNext: function(bookid) {
			console.log('Book.setNext()', bookid);

			setNextPrev($('.bloc-item .others .next'), bookid);		
		},

		// Set previous book
		setPrev: function(bookid) {
			console.log('Book.setPrev()', bookid);

			setNextPrev($('.bloc-item .others .previous'), bookid);		
		}, 
		initSwipe: initSwipe,
		cleanSwipe: cleanSwipe
	}
})(jQuery);