var Sur = Sur || {};

Sur.Tooltip = (function() {

	var 
		currentMousePos = false,
		$tooltip = false,
        timeout_toolip,
        to=false;

	function create($item) {
        clearTimeout(timeout_toolip);
        $tooltip = $('<div class="c-tooltip2 normal-shadow"><div class="tag">'+$item.data('tooltip-tag')+'</div><img src="'+$item.data('tooltip-img')+'" /></div>').hide();
        position($tooltip, $item);
        timeout_toolip = setTimeout(function() { 
            if($tooltip) {
                $('body').append($tooltip);
                $tooltip.fadeIn("fast");    
            }
        }, 100);
    }

    // params
    //      tooltip
    //      reference: item rolling hover
    function position($tooltip, $reference) {
   	
        var refTop = $reference.offset().top,
            refLeft = $reference.offset().left,
            padding = 5,
            thumbHeight = 240;

        //console.log('refTop: ', refTop, ' refLeft:', refLeft);

        /*
        if((refLeft + $tooltip.outerWidth() + padding) > $(window).width()) {

            // Open on the left of the item

            $tooltip.css({
                top: refTop + padding,
                left: refLeft - $tooltip.outerWidth() - padding
            });

        } else {

            // Open on the right of the item

            $tooltip.css({
                top: refTop + padding,
                left: refLeft + $reference.width() + padding
            });
        } 
        */

        //console.log('  position y', currentMousePos.y + padding);
        //console.log('  position x', currentMousePos.x + padding);

        if(currentMousePos.y + padding + thumbHeight > $(window).height()) {

            var top = currentMousePos.y - padding - thumbHeight;

        } else {

            var top = currentMousePos.y + padding;
        }        

        $tooltip.css({
            top: top, // refTop,
            left: currentMousePos.x + padding //refLeft + $reference.width() + 30
        });       
    }

    function clear() {
        var $doc = $(document);
        clearTimeout(to);

        $('.c-tooltip2').remove();

        $doc.unbind('mousemove');

        $tooltip = false;
    }

	return {
		init: function($items) {
			//console.log('Tooltip.init()');

			var 
                delay = 0,
                $doc = $(document);
            
            $items.hover(function() {
                //console.log('in');

                var $item = $(this);

                $doc.mousemove(function(e){
					//console.log(e.pageX + ' ' + e.pageY);
					
                    currentMousePos = {
						x: e.pageX,
						y: e.pageY
					};

					if($tooltip) {

						position($tooltip, $item);
					}
				});

                clearTimeout(to);

                to = setTimeout(function() {
                    
					create($item);

                }, delay);
                
            }, function() {
                //console.log('out');
                clear();                
            });
		},
        clear: clear
	};
})(jQuery);