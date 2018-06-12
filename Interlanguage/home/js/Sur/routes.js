jQuery(function(){  
	$ = jQuery;

	function cleanContextualStylesClassAndIds() {
		Sur.ScrollingTextController.stopAll($('.c-listing', 'item'));
		$('body').removeClass("item-info");
		$('.pg-iteminfo').hide();
	}

	Sur = Sur || {};

	Sur.router = new Navigo('');

	Sur.router
		.on({

			'index/:key': function(params) {
				console.log('ROUTE: page index year', params);
				cleanContextualStylesClassAndIds();

				//$('.panel-index .flap.right-side').hide();

				var 
					$pageCurrentlyOpen = Sur.BookFlip.getCurrentPanel(),
					$nextPanel = $('#panel-pg-2');

				Sur.nav1.apply(params.key);
				
				Sur.Screensaver.init($('#screensaver-main'));
				Sur.Screensaver.initMouseTracking();
				
				if($pageCurrentlyOpen.attr('id') !== 'panel-pg-2') {

					Sur.BookInfo.close();

					//Sur.Listing.syncPos($('#panel-pg-2'));

					Sur.BookFlip.open($pageCurrentlyOpen, $nextPanel, 'open_from_left', undefined, function() {

						$('.flap.right-side').hide(); //deprecated?

						//Sur.router.navigate(href);

						Sur.Listing.resetScroll(); //Because when the listing is initialized the parents are hidden so it cannot properly setup the "scrollAmount"

						Sur.BookFlip.hideCardRight($nextPanel);
					});				

					$('.bloc-index').show();
				
				} else {

					Sur.BookFlip.hideCardRight($nextPanel);
				}				

				//$('.c-listing').find('.item .title-ctn').ScrollingText();
				Sur.Listing.init();
			},

			'edition/:edition/:id/info': function(params) {
				console.log('ROUTE: edition info');
				cleanContextualStylesClassAndIds();
				$('body').addClass("item-info");

				params.id = parseInt(params.id, 10);

				Sur.BookInfo.open(Sur.BookFlip.getCurrentPanel(), params.id);
			},

			'edition/:edition/:id': function(params) {
				console.log('ROUTE: edition/'+params.edition+'/'+params.id);
				//console.log('params', params);

				cleanContextualStylesClassAndIds();

				//params.id = parseInt(params.id, 10);
				var bookid = parseInt(params.id, 10);

				Sur.nav1.apply();
				
				Sur.Screensaver.init($('#screensaver-main'));
				Sur.Screensaver.initMouseTracking();

				Sur.Listing.setActiveBook(bookid);

				//

				var 
					$currentPanel = Sur.BookFlip.getCurrentPanel(),
					direction = $currentPanel.data('direction');

				//console.log('  direction', direction);

				direction = direction === undefined ? 'open_from_right' : direction;

				if($currentPanel.hasClass('panel-book')) {
					console.log('  Panel book is already open');

					if(Sur.Book.isCurrent(bookid)) {
						console.log('  Is current book');

						// Show book
						Sur.Book.fill($currentPanel, bookid); // Needed to fill next/prev buttons
					
					} else {
						//console.log('  Is not current book');

						var $newPanel = Sur.Book.createPanel();
						Sur.Book.fill($newPanel, bookid);

						Sur.Book.initSwipe($newPanel.find(".bloc-item .img img"), function() {
							//todo open direction
							Sur.BookFlip.open($currentPanel, $newPanel, direction, undefined, function() {
								console.log('  remove current panel', $currentPanel);

								// Delete old panel
								$currentPanel.remove();
							});
						}, direction);
					}

				} else {
					//console.log('  Panel is not currently book, its other panel');

					var $panel = $('.panel-book').first();

					Sur.Book.fill($panel, bookid);

					Sur.BookFlip.open($currentPanel, $panel, direction);
				}


				// 

				/*
				//Sur.History.addBook(params.id);
				Sur.Book.fill(params.edition, params.id);

				var $pageCurrentlyOpen = Sur.BookFlip.getCurrentPanel();

				// Flip page

				//Sur.Listing.savePos($pageCurrentlyOpen);
				//Sur.Listing.syncPos($('.panel-index')); // So the right listing is positionned at the same place

				//$('.panel-index .flap.right-side').show();
				$('.flap.right-side').show();
				
				//console.log('pageCurrentlyOpen', $pageCurrentlyOpen);
				if($pageCurrentlyOpen.attr('id') !== 'panel-pg-3') {

					// Sur.History.reset();

					//Sur.BookFlip.open($('#panel-pg-2'), $('#panel-pg-3'), 'open_from_right');
					Sur.BookFlip.open($pageCurrentlyOpen, $('#panel-pg-3'), 'open_from_right');
				}				

				//

				var $img = $('.bloc-item .img');

				$img.waitForImages(function() {
					$img.find('.spinner').hide();
				});
				*/
	
				//

				//$('.pg-iteminfo').hide();
				Sur.BookInfo.close();
			},

			'search': function() {
				console.log('ROUTE: search');
				cleanContextualStylesClassAndIds();
				$("body").addClass("search-panel-open");
				Sur.nav1.apply();
				
				Sur.Screensaver.init($('#screensaver-main'));
				Sur.Screensaver.initMouseTracking();

				var
					$panel = $('#panel-search'), //$('.c-search'),
					$left = $panel.find('.flap.left-side'),
					//$panel = //$('.c-search-input'),
					$input = $left.find('input');

				//
				$('.flap.right-side').hide(); // use? Sur.BookFlip.hideCardRight();

				//$panel.show();
				var $pageCurrentlyOpen = Sur.BookFlip.getCurrentPanel();
				$panel.data('previous', '#'+$pageCurrentlyOpen.attr('id'));
				//console.log('  previous', '#'+$pageCurrentlyOpen.attr('id'));

				$pageCurrentlyOpen.removeClass('opened').addClass('closed');
				$panel.removeClass('closed').addClass('opened');
				
				//

				$input
					.val('')
					.focus();

				setTimeout(function() {
					window.scrollTo(0, 0);
				}, 750);				

				/*
				var $pageCurrentlyOpen = $('.c-panels.opened');
				//console.log('pageCurrentlyOpen', $pageCurrentlyOpen);
				if($pageCurrentlyOpen.attr('id') !== 'panel-search') {

					Sur.History.reset();

					Sur.BookFlip.open($pageCurrentlyOpen, $('#panel-search'), 'open_from_right');
				}
				*/	

				Sur.Listing.init();
			},

			'home': function() {
				console.log('ROUTE: home');
				cleanContextualStylesClassAndIds();

				Sur.nav1.apply();	

				Sur.Screensaver.init($('#screensaver-main'));
				Sur.Screensaver.initMouseTracking();

				Sur.PageHome.init();

				//Make sure the history is hidden and the home text is correctly positioned at the top.
				//Sur.History.reset();
				
				var $panel = Sur.BookFlip.getCurrentPanel();
				console.log('  $panel', $panel);

				if($panel.hasClass('panel-home') || $panel.hasClass('panel-index')) {

				} else {
					console.log('  Current panel is not panel-home or panel-index');

					Sur.BookFlip.open($('#panel-pg-1'), $('#panel-pg-2'), 'open_from_right', undefined, function() {
						//console.log('finish home to page 2 transition', $('#panel-pg-2 .flap.right-side'));

						setTimeout(function() { //hack
							//$('#panel-pg-2 .flap.right-side').hide();
							Sur.BookFlip.hideCardRight($('#panel-pg-2'));
							console.log('done');
						}, 100);
					});		
				}				

				Sur.PageHome.closePanel('purchase');
				Sur.PageHome.closePanel('essay');
				//$('.home-cont').show();
				$('.home-cont').css({
					display: 'block'
				});
			},

			'purchase': function() {
				console.log('ROUTE: purchase');

				Sur.Screensaver.init($('#screensaver-main'));
				Sur.Screensaver.initMouseTracking();

				$('.home-cont').hide();

				$('.pg-purchase').show();
				//$('.pg-purchase-close').show();
				//$('.bt-purchase').addClass('active');

				$('.pg-purchase').mCustomScrollbar({
					axis: 'y',
					theme: 'dark',
					scrollbarPosition: 'inside',
					autoHideScrollbar: true,
					mouseWheel: {
						enabled: true,
						preventDefault: true
					},
					setTop: 0
				});
			},

			'essay': function() {
				console.log('ROUTE: purchase');

				Sur.Screensaver.init($('#screensaver-main'));
				Sur.Screensaver.initMouseTracking();

				$('.home-cont').hide();

				$('.pg-essay').show();
				//$('.pg-purchase-close').show();
				//$('.bt-purchase').addClass('active');

				$('.pg-essay .col.left').mCustomScrollbar({
					axis: 'y',
					theme: 'dark',
					scrollbarPosition: 'inside',
					autoHideScrollbar: true,
					mouseWheel: {
						enabled: true,
						preventDefault: true
					},
					setTop: 0
				});
			},

			'': function() {
				console.log('ROUTE: splash');
				cleanContextualStylesClassAndIds();

				Sur.nav1.apply();	
				
				Sur.Screensaver.init($('#screensaver-splash'));
				Sur.Screensaver.start();
				//Sur.Screensaver.stopMouseTracking();
			}
		})
		.resolve();
});