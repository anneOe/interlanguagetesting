var Sur = Sur || {};

Sur.Screensaver = (function($) {
	
	var 
		_durationBeforeSlide = 0, //3000,
		_durationBeforeActivateSS = 0, //60000,
		_durationFade = 1000,
		_timeoutSlide = false,
		_timeoutTracking = false,
		_player,
		$el;
	
	function start() {
		console.log('Screensaver.start()');

		$('body').addClass('overflow');

		//var $cont = $('#c-screensaver');
		$cont = $el;
		
		//$cont.addClass('active');
		$cont
			.addClass('starting')
			.fadeIn(_durationFade);

		if(isItAVideo()) {

			if($cont.find('.videojs-background-wrap').length <= 0) {
				
				_player = videojs($cont.find('video').first().attr('id'), {
					loadingSpinner: false
				});

				_player.Background({
					container: $cont.find('.video').first().attr('id'),
					volume: 0 //1
				});
			}			

			_player.ready(function() {
				console.log('  video ready');

				$cont.addClass('is-ready');

				_player.play();
			});

			_player.on('ended', function() {
				//_player.currentTime(0);
				_player.play();
			});

			setTimeout(function() {

				$cont
					.find('.item')
					.first()
					//.css('opacity', 1)
					.addClass('active');	

				$cont.find('.items').show();

			}, 2000);

		} else {

			$cont
				.find('.item')
				.first()
				//.css('opacity', 1)
				.addClass('active');	
		}

		//setTimeout(function() {

			$cont
				.addClass('active')
				.removeClass('starting');
		//}, 1000);

		stopMouseTracking();

		// Slide timer

		clearTimeout(_timeoutSlide);
		_timeoutSlide = setTimeout(gotoNext, _durationBeforeSlide);
	}

	function stop() {
		console.log('Screensaver.stop()');

		$('body').removeClass('overflow');
	
		//var $ss = $('#c-screensaver');
		var $ss = $el;

		if($ss.closest('.c-panels').length > 0) {

			Sur.router.navigate('/home');

		} else {

			$ss.fadeOut(_durationFade, function() {

				$ss
					.removeClass('active')
					.find('.item.active')
					.removeClass('active');

				if(isItAVideo()) {
					_player.currentTime(0);
					_player.pause();
				}

				$('body').removeClass('overflow');
			});		
		}		

		clearTimeout(_timeoutSlide);

		setTimeout(function() {
			initMouseTracking();
		}, 1000);		
	}

	function mouseMoving() {
		//console.log('  mouseMoving()');

		clearTimeout(_timeoutTracking);
		
		_timeoutTracking = setTimeout(function() {

			start();

		}, _durationBeforeActivateSS);
	}

	function initMouseTracking() {
		console.log('  initMouseTracking()');

		//var $cont = $('#c-screensaver');
		var $cont = $el;

		if($cont.length > 0) {

			stopMouseTracking();

			$('body').mousemove(function() {

				mouseMoving();
				
			}.throttle(500));

			$(window).scroll(function() {
				//console.log('  scroll');

				mouseMoving();

			}.throttle(600));

			mouseMoving();
		}		
	}

	function stopMouseTracking() {
		//console.log('  stopMouseTracking()');

		$('body').unbind('mousemove');
		clearTimeout(_timeoutTracking);
	}

	function gotoNext() {
		//console.log('  gotoNext()');

		var 
			//$cont = $('#c-screensaver'),
			$cont = $el,
			$active = $cont.find('.item.active'),
			$next = $active.next();

		$active.removeClass('active');

		if($next.length > 0) {

			$next.addClass('active');

		} else {
			
			$cont.find('.item').first().addClass('active');
		}

		_timeoutSlide = setTimeout(gotoNext, _durationBeforeSlide);
	}

	function isItAVideo() {
		//return $('#c-screensaver').find('.video').length > 0;
		return $el.find('.video').length > 0;
	}

	function onResize() {
		console.log('  resize');

		//var $ss = $('#c-screensaver');
		$ss = $el;

		$ss
			.removeClass('is-video')
			.removeClass('is-video-fallback');
		
		if(isItAVideo()) {
			$ss.addClass('is-video');

			if(Sur.Utils.isMobile()) {
				
				$ss
					.removeClass('is-video')
					.addClass('is-video-fallback');
			}
		}
	}

	return {
		init: function($elem) {
			console.log('Screensaver.init()');

			//var $ss = $('#c-screensaver');
			$el = $elem;
			var $ss = $el;

			//

			_durationBeforeSlide = $ss.data('duration-scroll');
			_durationBeforeActivateSS = $ss.data('duration-start');

			// Click close the screensaver

			$ss.click(function() {

				stop();
			});

			// Escape close the screensaver

			$(document).keydown(function(e) {

				var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
				//console.log(key);

				if(key === 27) { //esc
					stop();
				}
			});

			$(window).resize(function() {

				onResize();

			}.throttle(300));
			onResize();
		},
		initMouseTracking: initMouseTracking,
		stopMouseTracking: stopMouseTracking,
		start: start
	};
})(jQuery);