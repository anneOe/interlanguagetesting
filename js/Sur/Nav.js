var Sur = Sur || {};

Sur.Nav = function($elem, callbackOnOpen, callbackOnClose) {
	console.log('Nav init');

	var positionate = function() {

		if(!Sur.Utils.isMobile()) {
			
			if($(window).width() < 1053) {
				$('.c-header').addClass('resize');
			} else {
				$('.c-header').removeClass('resize');
			}
		}
	};

	var 
		$nav = $elem,
		timeout = false,
		$header = $('.c-header');
		$headerIndex = $header.find('.index');

	$headerIndex.add($nav).hover(function() {
		console.log('hover');

		if(timeout) {
			clearTimeout(timeout);
		}

		if(!Sur.Utils.isMobile()) {
			$headerIndex.addClass('open');
			$nav.addClass('open');
		}		

	}, function() {
		//console.log('out');

		// timeout = setTimeout(function() {

		if(!Sur.Utils.isMobile()) {
			$headerIndex.removeClass('open');
			$nav.removeClass('open');
		}

		// }, 1000);
	});

	//

	$headerIndex.find('.lbl').click(function(e) {

		if(Sur.Utils.isMobile()) {

			e.preventDefault();

			if(Sur.PageHome.isPanelOpen('purchase') || Sur.PageHome.isPanelOpen('essay')) {
				
				Sur.router.navigate('/home');
				
			} else {

				toggle();
			}

			return false;
		}
	});

	//

	// $('.c-header .index .lbl').click(function(e) {
	// 	e.preventDefault();

	// 	//$headerIndex.toggleClass('open');
	// 	//$nav.toggleClass('open');

	// 	toggle();

	// 	return false;
	// });

	$(window).resize(function() {
		positionate();
	}).resize();

	/*
	$nav.find('.index .lbl a').click(function(e) {
		e.preventDefault();
		//$nav.toggleClass('open');
		toggle();
		return false;
	});

	$nav.on('click', '.index .title a', function(e) {
		e.preventDefault();
		//$nav.toggleClass('open');
		toggle();
		return false;
	});

	$nav.hover(function() {
		
		if(timeout) {
			clearTimeout(timeout);
		}

	}, function() {

		if(!Sur.Utils.isMobile()) {

			timeout = setTimeout(function() {
				$nav.removeClass('open');
			}, 1000);
		}		
	});	

	$nav.find("ul li a").hover(function() {
		$(".c-nav").find("ul li a[data-key='" + $(this).data("key") + "']").addClass("hovered");
	}, function() {
		$(".c-nav").find("ul li a[data-key='" + $(this).data("key") + "']").removeClass("hovered");
	});	
	*/

	// Set current item selected
	this.apply = function(key) {
		console.log('Nav.apply()', key);

		if(key !== undefined) {

			var $a = $elem.find('ul li a[data-key="'+key+'"]').first();

			// Hide item

			$a.addClass('selected');
			$a.closest('li').hide();			

			$('.c-header .index').addClass('applied');

			// Apply label

			$('.c-header .index .current').html($a.html());

			//

			$('.c-header .index .lbl').removeClass('active');

			/*
			var 
				$title = $elem.find('.title'),
				$a = $elem.find('ul li a[data-key="'+key+'"]').first();

			//$elem.addClass('applied');

			$a.addClass('selected');

			// Hide item
			$a.closest('li').hide();

			$title.html('');
			$a
				.clone()
				.appendTo($title);

			// Show
			$elem.find('.by').show();
			$title.css('display', 'table-cell');

			$elem.find('.index .lbl a.active').removeClass('active');
			*/
		
		} else {

			//$elem.removeClass('applied');
		}
	};

	// Return current item selected
	this.getActiveKey = function() {

		var $item = $elem.find('ul li a.selected');

		if($item.length > 0) {
			return $item.data('key');
		}
		return false;
	};

	// Return the items in order and if one is selected it will be first
	this.getItemsOrder = function() {
		console.log('Nav.getItemsOrder()');

		var items = [];

		var activeKey = this.getActiveKey();
		//console.log('  activeKey', activeKey);

		if(activeKey) {
			items.push(activeKey);
		}

		$.each($elem.find('ul li a'), function(idx, li) {

			var key = $(li).data('key');

			if($.inArray(key, items) < 0) {
				items.push(key);
			}			
		});
		//console.log('  items', items);

		return items;
	};

	var toggle = function() {
		console.log("click nav");

		$header.toggleClass('open');
		$headerIndex.toggleClass('open');

		if($nav.hasClass('open')) {
			$nav.removeClass('open');
			callbackOnClose();
		} else {
			$nav.addClass('open');
			callbackOnOpen();
		}
	};
};
