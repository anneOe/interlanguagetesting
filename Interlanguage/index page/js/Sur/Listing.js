var Sur = Sur || {};

Sur.Listing = (function() {

	var scrollPosHistory = 0;
	var 
		thumbSizeTarget_mobile = 145, //320,
		thumbSizeTarget_desktop = 360,
		thumbSizeTarget;

	//

	function item_onClick(e) {
		console.log('Listing.item.click()');

		e.preventDefault();

		var $link = $(this);
			//bookid = $link.data('book-id'),
			//$panel = Sur.BookFlip.getCurrentPanel();
		//console.log('  bookid', bookid);
		
		Sur.Tooltip.clear();

		$('.c-panels.last-opened').removeClass('last-opened');

		var $panel = Sur.BookFlip.getCurrentPanel();
		$panel.addClass('last-opened');

		console.log("********** logging href", window.location.pathname);
		$panel.data('href', window.location.pathname);

		var $listing = $link.closest('.c-listing');			
		savePos($listing);
		syncPos($listing.closest('.c-panels'));

		//setActiveBook(bookid);

		//

		setTimeout(function() {
			Sur.router.navigate($link.attr('href'));
		}, 1);

		return false;
	}

	//

	function savePos($listing) {
		console.log('Listing.savePos()');

		//var $pageCurrentlyOpen = $('.c-panels.opened');

		//var $listing = $panel.find('.flap.left-side .c-listing');
		//console.log(' pos top', $listing.get(0));

		console.log('  pos top', $listing.find('.mCSB_container').css('top'));

		$listing.data('top', parseInt($listing.find('.mCSB_container').css('top'), 10));
	}

	function syncPos($panel) {
		console.log('Listing.syncPos()', $panel);

		// Apply position to the two listings (left and right)
		var 
			$listing = $panel.find('.flap .c-listing'),
			top = $listing.first().data('top');

		//console.log('  top', top);

		if(top !== undefined) {

			console.log('  listing scroll to pos', top);

			$listing.mCustomScrollbar('scrollTo', top, {
				scrollInertia: 0  //duration
			});

			// We did it manually because strangely mCustomScrollbar wasnt changing. Pretty sure it is because it is not visible.
			$('.flap.right-side .c-listing .mCSB_container').css('top', top);
		}		

		$('.flap.right-side').show(); // Just to be sure!
	}

	function resizeItems() {
		console.log("**** resize items");

		thumbSizeTarget = Sur.Utils.isMobile() ? thumbSizeTarget_mobile : thumbSizeTarget_desktop;

		var $listings = $('.c-listing');
		var nbitems = Math.floor($(window).width()/thumbSizeTarget);
		var nitems_remain = Math.floor(($(window).width() % thumbSizeTarget) / nbitems);
		//console.log("******", nbitems, nitems_remain);
		var width = thumbSizeTarget + nitems_remain
		$listings.find('.item img').width(width);

		return {
		    nb_per_row:  nbitems,
		    width: thumbSizeTarget + nitems_remain,
		    height: Math.ceil(400 * width / 600)
		}
	}

	function updateScroll() {
		console.log("***** updateScroll");
		$('.c-listing').mCustomScrollbar("update");
		initScroll();
	}

	function resetScroll() {
		console.log("***** resetScroll");
		$('.c-listing').mCustomScrollbar("destroy");
		initScroll();
	}

	function initScroll() {
		console.log("**** init scroll");
		var items_info = resizeItems(); //? items_info is never used!
		var $listings = $('.c-listing');
		var sa = Math.abs($listings.find('.item').first().outerHeight());
		if(Sur.Utils.isSafari()) {
			sa = sa + 0.005;
		}
		//console.log("  scrollAmount", sa);
		if($listings.hasClass("idxkey-images")) {
			//Hack: Remove/add some pixels for the images index
			if(Sur.Utils.isMobile()) {
				sa = items_info.height + 10;
			}else {
				sa = items_info.height + 24;	
			}
			
		}
		// if($listings.closest(".c-search-input").length) {
		// 	//Hack: For search listing
		// 	console.log("*** IN SEARCH");
		// 	sa = sa + 16;
		// }

		var normalizeDelta = (!(Sur.Utils.isMobile() && $listings.hasClass("idxkey-images")) || !Sur.Utils.isMobile());
		//console.log('  normalizeDelta', normalizeDelta);

		$listings.mCustomScrollbar({
			axis: 'y',
			theme: 'dark',
			scrollbarPosition: 'outside',
			autoHideScrollbar: true,
			snapAmount: sa,
			mouseWheel: {
				enabled: true,
				deltaFactor: 1,
				normalizeDelta: normalizeDelta,
				preventDefault: true,
				axis: "y",
				scrollAmount: sa
			},
			contentTouchScroll: 5,
			mouseWheelPixels: sa,
			scrollInertia:15,
			scrollButtons: {
				sa: sa,
				scrollType: "pixels"
			},
			callbacks: {
				onScrollStart: function() {
					//console.log('onScrollStart()');
					//if(Sur.History.initCompleted) {

						//***** HIDE HEADE (Not necessary anymore)
						// $('.c-header').addClass('closed');
						// $(this).addClass('expanded');
						//*****

						//Remove opened tooltips
						Sur.Tooltip.clear();	
						$("html, body").scrollTop(0);
					//}
				},
				whileScrolling: function() {
					//console.log("whilescrolling", this.mcs.top, Sur.History.initCompleted);
					Sur.Tooltip.clear();
					// if(Sur.History.initCompleted) {

					// 	if(scrollPosHistory < this.mcs.top) {
					// 		//Scrolling down
					// 		if(Math.abs(this.mcs.top) <= 50) {
					// 			$('.c-header').removeClass('closed');
					// 			$(this).removeClass('expanded');
					// 		}
					// 	}	
					// 	scrollPosHistory = this.mcs.top;		
					// }	
				}
			}
		});
	}

	function getActiveBook() {
		//console.log('Listing.getActiveBook()');

		var $last = $('.c-panels.last-opened');

		if($last.length > 0) {
			return $('.c-panels.last-opened .c-listing .item a.active').closest('.item');
		} else {
			return $('.panel-index .c-listing .item a.active').closest('.item');
		}		
	}

	function init() {
		console.log('Listing.init()');

		//thumbSizeTarget = Sur.Utils.isMobile() ? thumbSizeTarget_mobile : thumbSizeTarget_desktop;
		//console.log('  thumbSizeTarget', thumbSizeTarget);
		
		var $listings = $('.c-listing');

		$listings.on("click", ".back-to-top", function(e) {
			e.preventDefault();
	        $listings.mCustomScrollbar("scrollTo", 0);
	        return false;
		});

		initScroll();
		$(window).off("resize");
		$(window).resize(function() {
			console.log('Listing.resize()');
			
			if($listings.hasClass("idxkey-images")) {
				resetScroll();
			}	

			//

			Sur.ScrollingTextController.stopAll();

			//if(Sur.Utils.isTouch()) {
			if(Sur.Utils.isMobile()) {
				console.log('is mobile');

				$listings.find('.item a').click(function(e) {
					//e.preventDefault();

					//return false;
				});
				$listings.find('.item .title-ctn div').SwipeText();
								
			} else {
				
				$listings.find('.item .title-ctn').ScrollingText();
			}			

		}.throttle(300)).resize();

		$listings.hover(function(){
			$(document).data({"keyboard-input":"enabled"});
			$(this).addClass("keyboard-input");
		},function(){
			$(document).data({"keyboard-input":"disabled"});
			$(this).removeClass("keyboard-input");
		});
		$(document).keydown(function(e){
			if($(this).data("keyboard-input")==="enabled"){
				var sa = $listings.find('.item').first().outerHeight();
				var activeElem=$(".keyboard-input"),
					activeElemPos=Math.abs($(".keyboard-input .mCSB_container").position().top),
					pixelsToScroll=sa;
				switch(e.which) {
					case 38: { //Arrow up
						e.preventDefault();
						Sur.Tooltip.clear();
						if(pixelsToScroll>activeElemPos){
							activeElem.mCustomScrollbar("scrollTo","top");
						}else{
							activeElem.mCustomScrollbar("scrollTo",(activeElemPos-pixelsToScroll),{scrollInertia:0});
						}
						break;
					}
					case 40: { //Arrow down
						e.preventDefault();
						Sur.Tooltip.clear();
						activeElem.mCustomScrollbar("scrollTo",(activeElemPos+pixelsToScroll),{scrollInertia:0});
						break;
					}
					case 33: { //Page up
						pixelsToScroll = $(window).height() - $(".c-header").height();
						if(pixelsToScroll>activeElemPos){
							activeElem.mCustomScrollbar("scrollTo","top");
						}else{
							activeElem.mCustomScrollbar("scrollTo",(activeElemPos-pixelsToScroll),{scrollInertia:0});
						}
						break;
					}
					case 34: { //Page down
						pixelsToScroll = $(window).height() - $(".c-header").height();
						activeElem.mCustomScrollbar("scrollTo",(activeElemPos+pixelsToScroll),{scrollInertia:0});
						break;
					}

				}
			}
		});

		//

		//$listings.find('.item a').click(function(e) {
		$(document).on('click', '.c-listing .item a', null, item_onClick);
	}

	return {

		init: init,
		savePos: savePos,
		resetScroll: resetScroll,
		// 
		// Need to call savePos before.
		syncPos: syncPos,

		setActiveBook: function(bookid) {
			
			$('.c-listing .item a.active').removeClass('active');
			$('.c-listing .item a[data-book-id="'+bookid+'"]').addClass('active');
		},

		// Return the book id of the next item besides the active one
		getActiveBookNext: function() {
			
			var $next = getActiveBook().next().find('a');

			return $next.length > 0 ? $next.data('book-id') : 0;			
		},

		getActiveBookPrev: function() {

			var $next = getActiveBook().prev().find('a');

			return $next.length > 0 ? $next.data('book-id') : 0;			
		}

		/*
		getActiveBook: function() {

			

			var 
				$link = $('.c-listing .item a.active'),
				$next = $link.closest('.item').next().find('a'),
				bookid = 0;

			bookid = $next.length > 0 ? $next.data('book-id') : 0;
			Sur.Book.setNext(bookid);

			$next = $link.closest('.item').prev().find('a');
			bookid = $next.length > 0 ? $next.data('book-id') : 0;
			Sur.Book.setPrev(bookid);
		}*/
	}
}(jQuery));