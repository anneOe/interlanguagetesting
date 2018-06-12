var Sur = Sur || {};

Sur.Clock = (function($) {

	function setDate($elem) {

		var 
			d = new Date(),
			nmonth = d.getMonth(),
			ndate = d.getDate(),
			nyear = d.getYear();
		
		if (nyear < 1000) 
			nyear += 1900;
		
		var 
			nhour = d.getHours(),
			nmin = d.getMinutes(),
			nsec = d.getSeconds();

		if (nmin <= 9) 
			nmin = "0" + nmin
		
		if (nsec <= 9) 
			nsec = "0" + nsec;

		// Add leading zeros

		nmonth = parseInt(nmonth + 1, 10);
		
		if(nmonth < 10) {
			nmonth = '0'+nmonth;
		}

		ndate = parseInt(ndate, 10);
		
		if(ndate < 10) {
			ndate = '0'+ndate;
		}

		$elem.html(nmonth+'/'+ndate+"/"+nyear + "<br>" + nhour + ":" + nmin + ":" + nsec + " ");
	}

	return {

		init: function() {

			var $elem = $('.clockbox');

			setDate($elem);

			setInterval(function() {

				setDate($elem);

			}, 1000/60);			
		}
	};
})(jQuery);