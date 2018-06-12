var Sur = Sur || {};

Sur.PageHome = (function($) {

	function closePanel(key) {

		$('.bt-'+key).removeClass('active');

		$('.pg-'+key).hide();
		$('.pg-'+key+'-close').hide();
	}

	function openPanel(key) {

		$('.bt-'+key).addClass('active');

		$('.pg-'+key).show();
		$('.pg-'+key+'-close').show();
	}

	return {
		init: function() {
			console.log('PageHome.init()');

			var $home = $('.home-cont');
			// var homeScrollAmount = 59;

			$home.mCustomScrollbar({
				axis: 'y',
				theme: 'dark',
				scrollbarPosition: 'inside',
				autoHideScrollbar: true,
				mouseWheel: {
					enabled: true,
					preventDefault: true
				},
				callbacks: {
					onScrollStart: function() {
						//Remove opened tooltips
						Sur.Tooltip.clear();
					}
				}
			});

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

			// Reset position
			$('.home-cont').find('.mCSB_container').css('top', 0);
			$('.pg-essay').find('.mCSB_container').css('top', 0);

			// Panel: Purchase

			$home.find('.bt-purchase').click(function(e) {
				e.preventDefault();
				
				//closePanel('essay');
				//openPanel('purchase');

				Sur.router.navigate('/purchase');

				return false;
			});

			/*
			$('.pg-purchase-close').click(function(e) {
				e.preventDefault();

				closePanel('purchase');

				return false;
			});
			*/

			// Panel: Essay

			$home.find('.bt-essay').click(function(e) {
				e.preventDefault();

				//closePanel('purchase');
				//openPanel('essay');
				Sur.router.navigate('/essay');
				
				return false;
			});

			/*
			$('.pg-essay-close').click(function(e) {
				e.preventDefault();

				closePanel('essay');

				return false;
			});
			*/
		},
		isPanelOpen: function(key) {

			return $('.pg-'+key).is(':visible');
		},
		closePanel: closePanel
	};
})(jQuery);