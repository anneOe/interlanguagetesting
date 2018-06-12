var Sur = Sur || {};

Sur.ScrollingTextController = (function() {

	return {
		stopAll: function(callback) {
			console.log('ScrollingTextController.stopAll()');

			//todo refactoring to not be coupled to the listing and be more generic

			var $listings = $('.c-listing');
			$listings.find('.item').each(function() {
				$(this).find(".title-ctn").stop();
				// stop($(this).find(".title-ctn"), $(this).find(".title-ctn div"), 0);
				$(this).find(".title-ctn").unbind( "hover" );
				$(this).find(".title-ctn").removeClass("truncated");
			}, function() {
				if(callback) {
					callback();
				}	
			});
		}
	};
})(jQuery);


$.fn.ScrollingText = function() {

	function calculateWidth($title) {
		//console.log('ScrollingText.calculateWidth()');

		var 
			$clonedTitle = $title.clone(),
			$clonedTitleWrapper = $clonedTitle.find('div');

		$clonedTitle.css({
			//display: 'inline', 
			//width: 'auto',
			//'white-space': 'nowrap'
			//visibility: 'hidden'
		});

		$clonedTitleWrapper.css({
			'white-space': 'nowrap',
			display: 'inline'
		});

		// Clear dummy container
		$('#c-listing .items').html('');

		$clonedTitle.appendTo('#c-listing .items');

		//

		var realWidth = parseInt($clonedTitleWrapper.width(), 10);

		$title.data('width', realWidth);

		//console.log('width:', $title.width());
		//console.log('real width', realWidth);

		// Add truncated class
		if(realWidth > $title.width()) {
			$title.addClass('truncated');
			//console.log('is truncated');
		} else {
			//console.log('not truncated');
		}
	}

	// The speed of the animations needs to be dependent of the size of the string
	function calculateDuration(distance) {
		//console.log('calculateDuration', distance / 300 * 3000);
		return distance / 300 * 1125;
	}

	return this.each(function() {
		console.log('ScrollingText.init()');

		var 
			$title = $(this),
			$titleWrapper = $title.find('div'),
			viewportWidth = $title.width(),
			startTimeout = null;

		//console.log('title width', $title.width(), $title.innerWidth());
		stop();
		$title.unbind( "hover" );
		$title.removeClass("truncated");
		calculateWidth($title);

		//

		//todo refactoring Put functions outside loop

		function start() {
			//console.log('ScrollingText start()');

			if($title.hasClass('truncated')) {

				// Scroll

				var distance = $title.data('width');
				//console.log('distance', distance);

				$titleWrapper.animate({
					'margin-left': 0 - distance
				}, calculateDuration(distance), 'linear', function() {

					// Reset position to start

					setTimeout(function() {

						$titleWrapper
							.css('margin-left', viewportWidth + 20)
							.animate({
								'margin-left': 0
							}, 3500);

					}, 1000);							
				});
			}

		}

		function stop() {
			// Stop scrolling
			$titleWrapper.stop();
			$titleWrapper.css({
				'margin-left': 0
			});
		}

		$title.hover(function() {
			//console.log('ScrollingText hover()');
			startTimeout = setTimeout(function() {
				start();
			}, 200);
		}, function() {
			//console.log('ScrollingText out()');
			if(startTimeout) {
				clearTimeout(startTimeout);
			}
			stop();			
		});
		$title.click(function() {
			stop();	
		});

	});
}