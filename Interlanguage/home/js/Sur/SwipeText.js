
$.fn.SwipeText = function() {

	return this.each(function() {
		console.log('SwipeText.init()');

		var $item = $(this);

		$item.swipe({				
			swipeStatus: function(event, phase, direction, distance, duration, fingerCount, fingerData, currentDirection) {
				//console.log(event.type);
				switch(event.type) {
					case 'mousedown':
						// Save original value
						console.log('  margin-left', $item.css('margin-left'));

						$item.data('x', parseInt($item.css('margin-left'), 10));
						//$item.data('x', parseInt($('.bloc-item .img img').css('margin-left'), 10));

					break;
					case 'mousemove':
						console.log('mousemove1', fingerData);

						fingerData = fingerData[0];

						if(currentDirection === 'left' || currentDirection === 'right') {
							$item.css({
								marginLeft: $item.data('x') - (fingerData.start.x - fingerData.end.x)
							});
						}

					break;		

					case 'touchmove':
						console.log('TOUCHE MOVE');
					break;
				}
			},
			threshold: 0,
			preventDefaultEvents: false
		});
	});
}