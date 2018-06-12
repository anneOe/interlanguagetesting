var Sur = Sur || {};

Sur.BookInfo = (function($) {

	var nav = false;
	
	function reorder($panel) {
		console.log('  BookInfo.reorder()');

		setScroll($panel);

		var 
			itemsOrder = nav.getItemsOrder(),
			$bookInfo = $panel.find('.c-book'),
			$cont = $bookInfo.find('.mCSB_container');

		//console.log('  $bookInfo', $bookInfo);			
		//console.log('  $cont', $cont);
		//console.log('itemsOrder', itemsOrder);
		
		$.each(itemsOrder, function(idx, key) {
			//console.log('  key', key);
			if (!$bookInfo.find('.r.'+key).is(':empty')){
				$bookInfo.find('.r.'+key).detach().first().appendTo($cont);
			}else{
				$bookInfo.find('.r.'+key).hide();
			}
		});
		$bookInfo.find('.r.publishers').detach().first().appendTo($cont);
		$bookInfo.find('.r.cover').detach().first().appendTo($cont);
		$bookInfo.find('.projects').detach().first().appendTo($cont);

		// Scroll top
		$cont.css('top', 0);
	}

	function setScroll($panel) {
		
		var $bookInfo = $panel.find('.c-book');
		var height = $(window).height() - (parseInt($('body').css('padding-top'), 10) * 2) - parseInt($bookInfo.css('margin-top'), 10);

		$bookInfo.mCustomScrollbar({
			axis: 'y',
			theme: 'dark',
			scrollbarPosition: 'outside',
			scrollInertia: 0,
			autoHideScrollbar: true,
			mouseWheel: {
				enabled: true,
				preventDefault: true
			},
			setHeight: height
		});
	}

	return {

		init: function(currentNav) {
			console.log("Sur.BookInfo: init");
			nav = currentNav;

			///$('.bloc-item .bt-info a').click(function(e) {
			$(document).on('click', '.bloc-item .bt-info a', null, function(e) {
				console.log('click');
				e.preventDefault();

				Sur.router.navigate($(this).attr('href'));

				return false;
			});

			///$('.pg-iteminfo-close').click(function() {
			$(document).on('click', '.pg-iteminfo-close', null, function(e) {

				var $blocItem = $('.bloc-item');

				//$('.pg-iteminfo').hide();		
				Sur.router.navigate('/edition/'+$blocItem.data('edition')+'/'+$blocItem.data('bookid'));
			});

			//

			var $panel = Sur.BookFlip.getCurrentPanel();

			//setScroll();
			$(window).resize(function() {
				var $bookInfo = $('.c-book');
				$bookInfo.mCustomScrollbar("destroy");
				setScroll($panel);
			}).resize();
		},

		url: function(book) {
			return '/edition/'+Sur.data.edition.id+'/'+book.book_id+'/info';
		},

		open: function($panel, bookid) {
			console.log('BookInfo.open()');

			var $bloc = $panel.find('.pg-iteminfo .c-book');

			//console.log('  current book html', parseInt($bloc.data('id'), 10));

			if(parseInt($bloc.data('id'), 10) !== bookid) {

				var book = Sur.Api.getBook(bookid, 10);
				//console.log('book', book);

				$bloc.data('id', bookid);

				if(book.photographers.length > 0) {
					// Photographers

					var 
						$photographers = $bloc.find('.photographers'),
						i = 0,
						str = '';

					$photographers.html('<div></div>');

					$.each(book.photographers, function(idx, photographer) {

						// str += ' ';

						var asterix = '';

						if(i === 0 && book.photographers.length > 1) {
							asterix = '*';
						}

						var 
							//str = '';
							haveFirstname = false;

						//str += '<span class="name">';
						if(i > 0 ) {
							str += ', '
						}
						
						//console.log('  photographer url', photographer.website_url_en);
						//photographer.website_url_en = 'http://www.google.com';

						if(photographer.website_url_en !== undefined && photographer.website_url_en) {
							str += "<a target='_blank' href='"+photographer.website_url_en+"'>";
						}

						console.log('  firstname', photographer.firstname);
						if(photographer.firstname !== undefined && photographer.firstname) {
							str += photographer.firstname;
							haveFirstname = true;							
						}

						if(photographer.lastname !== undefined && photographer.lastname) {

							if(haveFirstname) {
								str += ' ';
							}

							str += photographer.lastname;
						}

						if(photographer.website_url_en !== undefined && photographer.website_url_en) {
							str += "</a>";
						}

						str += asterix;
						//str += '</span>';

						//$(str).appendTo($photographers.find('div'));
						
						//$('<div class="name">'+photographer.firstname+' '+photographer.lastname+asterix+'</div>').appendTo($photographers);
						i++;
					});

					$photographers.find('div').html(str);

					//console.log('photographhers', $photographers.html());

					$bloc.find('.photographers').show();
				}else{
					$bloc.find('.photographers').hide();
				}

				if(book.publishers.length > 0) {
					// Publishers

					var 
						$publishers = $bloc.find('.publishers'),
						i = 0,
						str = '';

					$publishers.html('<div></div>');

					$.each(book.publishers, function(idx, publisher) {

						// str += ' ';

						//str += '<span class="name">';
						if(i > 0 ) {
							str += ', '
						}

						if(publisher.website_url_en !== undefined && publisher.website_url_en) {
							str += "<a target='_blank' href='"+publisher.website_url_en+"'>";
						}

						if(publisher.name_en !== undefined && publisher.name_en) {
							str += publisher.name_en;
						}

						if(publisher.website_url_en !== undefined && publisher.website_url_en) {
							str += "</a>";
						}

						//str += '</span>';

						//$(str).appendTo($publishers);

						//$('<div class="name">'+publisher.firstname+' '+publisher.lastname+asterix+'</div>').appendTo($publishers);
						i++;
					});

					$publishers.find('div').html(str);

					$bloc.find('.publishers').show();
				}else{
					$bloc.find('.publishers').hide();
				}

				//
				if(book.year) {
					$bloc.find('.year').show().html(book.year);	
				}else{
					$bloc.find('.year').hide();
				}

				if(book.title_en) {
					$bloc.find('.title').show().html('<div>'+book.title_en+'</div>');	
				}else{
					$bloc.find('.title').hide();
				}

				if(book.description_html_en) {
					$bloc.find('.description').show().html(book.description_html_en);	
				}else{
					$bloc.find('.description').hide();
				}

				if(book.format_en) {
					$bloc.find('.size').show().html('<div>'+book.format_en+'</div>');	
				}else{
					$bloc.find('.size').hide();
				}

				if(book.isbn) {
					$bloc.find('.code').show().html('<div>'+book.isbn+'</div>');	
				}else{
					$bloc.find('.code').hide();
				}

				setTimeout(function() {
					//console.log('  cover', $bloc.find('.cover'));
					$bloc.find('.cover').html('<img src="'+Sur.config.img_host+book.images['book-cover'].small.url+'" />');
				}, 500);
			}

			reorder($panel);

			$panel.find('.pg-iteminfo').show();

			$panel.find('.c-book .r.scrolling').ScrollingText(); // Need to be visible
		},

		close: function() {

			$('body').removeClass('item-info');
			$('.pg-iteminfo').hide();	
		}
	};
})(jQuery);