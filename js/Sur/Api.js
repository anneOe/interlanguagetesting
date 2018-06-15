var Sur = Sur || {};

Sur.Api = (function($) {

	return {

		getBook: function(id) {
			//console.log('Api.getBook()', id);

			var 
				book = false,
				id = parseInt(id, 10);

			$.each(Sur.data.books, function(idx, b) {

				if(b.book_id == id) {

					book = b;
					return false;
				}
			});

			return book;
		},

		search: function(word) {

			word = word.toLowerCase();

			var 
				books = [],
				indexKeys = ['title_en', 'isbn', 'format_en', 'description_en', 'year'],
				// indexKeys = ['title_en', 'isbn'],
				orderByKey = ['title_en'];

			$.each(Sur.data.books, function(idx, b) {

				var findYeah = false;

				// Search on all fields
				$.each(indexKeys, function(idx3, idxKey) {
					//console.log('  idxKey', idxKey);

					if(Sur.Utils.isset(b[idxKey]) && b[idxKey].toLowerCase().indexOf(word) > -1) {

						books.push(b);
						findYeah = true;
						//console.log('SEARCH: it is a '+idxKey);
						return false;
					}
				});

				if(!findYeah) {

					// Search by photographers
					$.each(b.photographers, function(idx2, photographer) {
						var pname=(photographer.firstname) ? photographer.firstname : '';
						pname=(photographer.lastname) ? pname+ ' ' + photographer.lastname : '';
						if((Sur.Utils.isset(pname) && pname.toLowerCase().indexOf(word) > -1)) {
							books.push(b);
							//console.log('SEARCH: it is a PHOTOGRAPHER!!');
							return false;
						}
					});
				}
			});

			sortedBooks = books.sort(function(a, b){
				if(a.title_en < b.title_en) return -1;
			    if(a.title_en > b.title_en) return 1;
			    return 0;
			});

			return sortedBooks;
		}
	};

})(jQuery);