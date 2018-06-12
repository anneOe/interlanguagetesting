var Sur = Sur || {};

Sur.BookFlip = (function() {

  //1500
  var 
    default_anim_timing = 660,
    default_anim_timing_mobile = 330,
    $el = false;

  function flip(e, $flap, context) {
    console.log('BookFlip.flip()');

    e.preventDefault();
    if(canFlip($flap)) {
      // if(context == "mobile") {
      //   open_mobile($($flap.data("from-panel")), $($flap.data("to-panel")), getMode($flap));
      // }else {
      clear_tease();
      open($($flap.data("from-panel")), $($flap.data("to-panel")), getMode($flap));
      // }
    }
  }

  function clear_tease() {
    reset($(".hover-shadow-trans").stop());
  }

  function tease(e, $flap, context, anim_speed) {
    e.preventDefault();
    if(canFlip($flap)) {
      var mode = getMode($flap);
      var trans_dir = "right";
      if(mode == "open_from_left") {
        trans_dir = "left";
      }
      var params = {};
      if(context == "unfold") {
        params[trans_dir] = "0%";
        params["opacity"] = "1";
      }else {
        params[trans_dir] = "0";
        params["opacity"] = "0";
      }
      $(".hover-shadow-trans."+trans_dir).stop()
        .animate(params, { 
          duration: anim_speed
        });
    }
  }

  function canFlip($flap) {
    if($flap.hasClass("left-side")) {
      return $flap.data("to-panel") && $flap.data("from-panel");
    }
    if($flap.hasClass("right-side")) {
      return $flap.data("to-panel") && $flap.data("from-panel");
    }
    return false;
  }

  function getMode($flap) {
    if($flap.hasClass("left-side")) {
      return "open_from_left";
    }
    return "open_from_right";
  }

  function open($panel, $target_panel, mode, anim_timing, callback) {
    console.log('BookFlip.open()', $panel, $target_panel, mode, anim_timing);

    if(Sur.Utils.isMobile()) {

      if(mode === 'open_from_right') {
        openCardRight($panel, $target_panel, callback);
      } else {
        openCardLeft($panel, $target_panel, callback);
      }

      return false;
    }

    if(!$panel.hasClass("opened") || $("body").hasClass("in-transition")) {
      return false;
    }
    if(!anim_timing) {
      anim_timing = default_anim_timing;
    }

    //

    var originIsFull = $panel.hasClass("full");
    var destinationIsFull = $target_panel.hasClass("full");

    if(mode == "open_from_right" && $panel.hasClass("opened")) {

      var alt_flap_vars = {};
      var alt_flap_opp_vars = {};

      if(destinationIsFull) {
        alt_flap_vars.orig = "0";
        alt_flap_vars.dest = "50%";
        alt_flap_vars.inner_orig = "100%";
        alt_flap_vars.inner_dest = "50%";
        alt_flap_opp_vars.orig = "100%";
        alt_flap_opp_vars.dest = "50%";
        alt_flap_opp_vars.inner_orig = "-100%";
        alt_flap_opp_vars.inner_dest = "0";
      }else{
        alt_flap_vars.orig = "0";
        alt_flap_vars.dest = "50%";
        alt_flap_vars.inner_orig = "100%";
        alt_flap_vars.inner_dest = "0";
        alt_flap_opp_vars.orig = "100%";
        alt_flap_opp_vars.dest = "50%";
        alt_flap_opp_vars.inner_orig = "-100%";
        alt_flap_opp_vars.inner_dest = "0";
      }

      open_from_right($panel, $target_panel, alt_flap_vars, alt_flap_opp_vars, anim_timing, callback);    
    }
    if(mode == "open_from_left" && $target_panel.hasClass("closed")) {

      var alt_flap_vars = {};
      var alt_flap_opp_vars = {};

      if(destinationIsFull) {
        alt_flap_vars.orig = "0%";
        alt_flap_vars.dest = "50%";

        alt_flap_vars.inner_orig = "100%";
        alt_flap_vars.inner_dest = "0%";

        alt_flap_opp_vars.orig = "100%";
        alt_flap_opp_vars.dest = "50%";

        alt_flap_opp_vars.inner_orig = "100%";
        alt_flap_opp_vars.inner_dest = "50%";
      }else{
        alt_flap_vars.orig = "0%";
        alt_flap_vars.dest = "50%";

        alt_flap_vars.inner_orig = "100%";
        alt_flap_vars.inner_dest = "0%";

        alt_flap_opp_vars.orig = "100%";
        alt_flap_opp_vars.dest = "50%";

        alt_flap_opp_vars.inner_orig = "100%";
        alt_flap_opp_vars.inner_dest = "0%";
      }
      open_from_left($panel, $target_panel, alt_flap_vars, alt_flap_opp_vars, anim_timing, callback);    
    }
  }
  
  function open_from_right($panel, $target_panel, alt_flap_vars, alt_flap_opp_vars, anim_timing, callback) {
    console.log('open_from_right()');
    //GOING FROM RIGHT TO LEFT

    var $flap = $panel.find(".flap.right-side");
    var $alt_flap = $target_panel.find(".flap.left-side");
    var $alt_flap_opp = $target_panel.find(".flap.right-side");

    $panel.addClass("in-transition");
    $target_panel.addClass("target");
    $alt_flap_opp.addClass("underfold");

    //PUT TARGET PANEL ON TOP OF CURRENT PANEL
    $panel.css({
      "z-index": "900"
    });
    $target_panel.show().css({
      "z-index": "1000"
    });   

    //MAIN FLAP OF TARGET
    $alt_flap.css({
      "left": "auto",
      "right": alt_flap_vars.orig,
      "z-index": "10"
    });

    $alt_flap.animate({
      "right" : alt_flap_vars.dest
    }, {
      duration: anim_timing,
      complete: function() {
        reset($(this));
        reset($target_panel);
        reset($panel);
        $("body").removeClass("in-transition");
        $panel.removeClass("in-transition");
        $target_panel.removeClass("target");
        $alt_flap_opp.removeClass("underfold");
        $(".c-panels").removeClass("opened").addClass("closed");
        $target_panel.removeClass("closed").addClass("opened");
        //$(".panel-click-zone.right").trigger('mouseenter');
        if(callback) {
          callback();
        }
      },
      start: function() {
        $("body").addClass("in-transition");
      },
      fail: function() {
        $("body").removeClass("in-transition");
      },
      stop: function() {
        $("body").removeClass("in-transition");
      }
    });

    $alt_flap.find(".flap-inner").css({
      "right": "auto",
      "left": alt_flap_vars.inner_orig
    });
    $alt_flap.find(".flap-inner").animate({
      "left" : alt_flap_vars.inner_dest
    }, {
      duration: anim_timing,
      complete: function() {
        reset($(this));
      }
    });

    //OPPOSITE FLAP OF TARGET
    $alt_flap_opp.css({
      "z-index": "1", 
      "left": alt_flap_opp_vars.orig,
      "right" : "auto"
    });
    $alt_flap_opp.animate({
      "left" : alt_flap_opp_vars.dest
    }, {
      duration: anim_timing,
      complete: function() {
        reset($(this));
      }
    });
    
    $alt_flap_opp.find(".flap-inner").css({
      "left": alt_flap_opp_vars.inner_orig,
      "right" : "auto"
    });
    $alt_flap_opp.find(".flap-inner").animate({
      "left" : alt_flap_opp_vars.inner_dest
    }, {
      duration: anim_timing,
      complete: function() {
        reset($(this));
      }
    });

    //SHADOW
    $alt_flap.closest(".c-panels").find(".shadow-trans.right, .shadow-trans.left").css({
      "opacity": "0"
    });

    $alt_flap.closest(".c-panels").find(".shadow-ambiant.right").css({
      "opacity": "1",
      "right": "0%",
      "width": "5%"
    });
    $alt_flap.closest(".c-panels").find(".shadow-ambiant.right")
      .animate({
        "right" : "50%",
        "width" : "4%"
      }, { 
        duration: anim_timing,
        complete: function() {
          $alt_flap.closest(".c-panels").find(".shadow-trans.left").css({
              "opacity": "1"
            });
          reset($(this));
        }, 
        queue: false 
      });

    //   //SHADOW
      $alt_flap.closest(".c-panels").find(".shadow-trail.right").css({
        "opacity": "1",
        "right": "0"
      });
      $alt_flap.closest(".c-panels").find(".shadow-trail.right")
        .animate({
          "right" : "46%",
          "width": "4%",
          // "opacity": "0.2"
        }, { 
          duration: anim_timing,
          complete: function() {
            $alt_flap.closest(".c-panels").find(".shadow-trans.right").css({
              "opacity": "1"
            });
            reset($(this));
          }, 
          queue: false 
        })
          
  }

  function open_from_left($panel, $target_panel, alt_flap_vars, alt_flap_opp_vars, anim_timing, callback) {
    console.log('open_from_left()');
    //GOING FROM RIGHT TO LEFT

    var $flap = $panel.find(".flap.left-side");
    var $alt_flap = $target_panel.find(".flap.right-side");
    var $alt_flap_opp = $target_panel.find(".flap.left-side");

    $panel.addClass("in-transition");
    $target_panel.addClass("target");
    $alt_flap_opp.addClass("underfold");

    //PUT TARGET PANEL ON TOP OF CURRENT PANEL
    $panel.css({
      "z-index": "900"
    });
    $target_panel.show().css({
      "z-index": "1000"
    });   

    //MAIN FLAP OF TARGET
    $alt_flap.css({
      "right": "auto",
      "left": alt_flap_vars.orig,
      "z-index": "10",
      display: 'block' //fhoule
    });

    $alt_flap.animate({
      "left" : alt_flap_vars.dest
    }, {
      duration: anim_timing,
      complete: function() {
        reset($(this));
        reset($target_panel);
        reset($panel);
        $("body").removeClass("in-transition");
        $panel.removeClass("in-transition");
        $target_panel.removeClass("target");
        $alt_flap_opp.removeClass("underfold");
        $(".c-panels").removeClass("opened").addClass("closed");
        $target_panel.removeClass("closed").addClass("opened");
        //$(".panel-click-zone.left").trigger('mouseenter');
        if(callback) {
          callback();
        }
      },
      start: function() {
        $("body").addClass("in-transition");
      },
      fail: function() {
        $("body").removeClass("in-transition");
      },
      stop: function() {
        $("body").removeClass("in-transition");
      }
    });

    $alt_flap.find(".flap-inner").css({
      "left": "auto",
      "right": alt_flap_vars.inner_orig
    });
    $alt_flap.find(".flap-inner").animate({
      "right" : alt_flap_vars.inner_dest
    }, {
      duration: anim_timing,
      complete: function() {
        reset($(this));
      }
    });

    //OPPOSITE FLAP OF TARGET
    $alt_flap_opp.css({
      "z-index": "1", 
      "right": alt_flap_opp_vars.orig,
      "left" : "auto"
    });
    $alt_flap_opp.animate({
      "right" : alt_flap_opp_vars.dest
    }, {
      duration: anim_timing,
      complete: function() {
        reset($(this));
      }
    });
    
    $alt_flap_opp.find(".flap-inner").css({
      "left": alt_flap_opp_vars.inner_orig,
      "right" : "auto"
    });
    $alt_flap_opp.find(".flap-inner").animate({
      "left" : alt_flap_opp_vars.inner_dest
    }, {
      duration: anim_timing,
      complete: function() {
        reset($(this));
      }
    });

    //SHADOW
    $alt_flap.closest(".c-panels").find(".shadow-trans.left, .shadow-trans.right").css({
      "opacity": "0"
    });

    $alt_flap.closest(".c-panels").find(".shadow-ambiant.left").css({
      "opacity": "1",
      "left": "0%",
      "width": "5%"
    });
    $alt_flap.closest(".c-panels").find(".shadow-ambiant.left")
      .animate({
        "left" : "50%",
        "width" : "4%"
      }, { 
        duration: anim_timing,
        complete: function() {
          $alt_flap.closest(".c-panels").find(".shadow-trans.right").css({
              "opacity": "1"
            });
          reset($(this));
        }, 
        queue: false 
      });

    //   //SHADOW
      $alt_flap.closest(".c-panels").find(".shadow-trail.left").css({
        "opacity": "1",
        "left": "0"
      });
      $alt_flap.closest(".c-panels").find(".shadow-trail.left")
        .animate({
          "left" : "46%",
          "width": "4%",
          // "opacity": "0.2"
        }, { 
          duration: anim_timing,
          complete: function() {
            $alt_flap.closest(".c-panels").find(".shadow-trans.left").css({
              "opacity": "1"
            });
            reset($(this));
          }, 
          queue: false 
        })        
  }

  /*
  function open_mobile($panel, $target_panel, mode, anim_timing) {
    if(!$panel.hasClass("opened") || $("body").hasClass("in-transition")) {
      return false;
    }
    if(!anim_timing) {
      anim_timing = default_anim_timing;
    }

    var originIsFull = $panel.hasClass("full");
    var destinationIsFull = $target_panel.hasClass("full"); 

    if(mode == "open_from_right" && $panel.hasClass("opened")) {
      $panel.css({
        "z-index": "900"
      });
      $target_panel.show().css({
        "z-index": "1000"
      }); 

      var $flap = $panel.find(".flap.right-side");
      var $flap_opp = $panel.find(".flap.left-side");
      var $alt_flap = $target_panel.find(".flap.left-side");
      var $alt_flap_opp = $target_panel.find(".flap.right-side");

      $alt_flap_opp.hide();
      $alt_flap.css({
        "left": "100%"
      }); 
      $alt_flap.animate({
        "left" : "0"
      }, {
        duration: anim_timing,
        complete: function() {
          reset($(this));
          reset($target_panel);
          reset($panel);
          $alt_flap_opp.show();
          $("body").removeClass("in-transition");
          $panel.removeClass("in-transition");
          $(".c-panels").removeClass("opened").addClass("closed");
          $target_panel.removeClass("closed").addClass("opened");
        },
        start: function() {
          $("body").addClass("in-transition");
        },
        fail: function() {
          $("body").removeClass("in-transition");
        },
        stop: function() {
          $("body").removeClass("in-transition");
        }
      });
    }
    if(mode == "open_from_left" && $target_panel.hasClass("closed")) {

      $panel.css({
        "z-index": "1000"
      });
      $target_panel.show().css({
        "z-index": "900"
      }); 

      var $flap = $panel.find(".flap.left-side");
      var $flap_opp = $panel.find(".flap.right-side");
      var $alt_flap = $target_panel.find(".flap.right-side");
      var $alt_flap_opp = $target_panel.find(".flap.left-side");

      $flap_opp.hide();
      $flap.css({
        "left": "0"
      }); 
      $flap.animate({
        "left" : "100%"
      }, {
        duration: anim_timing,
        complete: function() {
          reset($(this));
          reset($target_panel);
          reset($panel);
          $flap_opp.show();
          $("body").removeClass("in-transition");
          $panel.removeClass("in-transition");
          $(".c-panels").removeClass("opened").addClass("closed");
          $target_panel.removeClass("closed").addClass("opened");
        },
        start: function() {
          $("body").addClass("in-transition");
        },
        fail: function() {
          $("body").removeClass("in-transition");
        },
        stop: function() {
          $("body").removeClass("in-transition");
        }
      });
      
    }
  }
  */

  function resetAll() {
    $(".c-panels").each(function(){
      var $panel = $(this);
      var $flaps = $panel.find(".flap");
      reset($panel);
      reset($flaps);
      reset($panel.find(".shadow-trans"));
      reset($(".hover-shadow-trans"));

    });
  }

  function reset($elem){
    $elem.attr('style','');
  }

  function init(options) {
    console.log("SVL.Panels: init()", options);

    options = jQuery.extend({}, {
      //allowMouseWheel: true
    }, options);

    $el = $('.c-bookflip');

    /*
    //

    $(".panel-click-zone").click(function(e) {
      console.log('click');

      if($(this).hasClass("right")) {
        flip(e, $(".c-panels.opened .flap.right-side"));
      }else{
        flip(e, $(".c-panels.opened .flap.left-side"));
      }
    });

    //

    $(".panel-click-zone").hover(function(e){
      if(!$("body").hasClass("in-transition")) {
        if($(this).hasClass("right")) {
          tease(e, $(".c-panels.opened .flap.right-side"), "unfold", default_anim_timing/2);
        }else{
          tease(e, $(".c-panels.opened .flap.left-side"), "unfold", default_anim_timing/2);
        }
      }
    }, function(e){
      if($(this).hasClass("right")) {
        tease(e, $(".c-panels.opened .flap.right-side"), "fold", default_anim_timing/2);
      }else{
        tease(e, $(".c-panels.opened .flap.left-side"), "fold", default_anim_timing/2);
      }
    });
    */

    //

    /*
    $(".c-panels .flap .tooltip-link").click(function(e) {
      e.stopPropagation();
    });
    */

    /*
    $(".c-panels").not(".mobile").find(".flap").click(function(e) {
      flip(e, $(this));     
    });
    */

    $(".c-panels.mobile .flap").click(function(e) {
      flip(e, $(this), "mobile");     
    });

    // **************
    // MOBILE RESTART, COMMENTING UNTIL RESPONSIVE IS READY.
    // var pw = $(window).width();

    // $(window).resize(function(){
    //   var ww = $(window).width();
    //   if(ww > pw && ww > 767 && pw <= 767) {
    //     //going to desktop
    //     resetAll();
    //     $(".c-panels").not(".mobile").removeClass("opened").addClass("closed");
    //     $(".c-panels").not(".mobile").first().removeClass("closed").addClass("opened");
    //   }
    //   if(ww < pw && ww < 768 && pw >= 768) {
    //     //going to mobile
    //     resetAll();
    //     $(".c-panels.mobile").removeClass("opened").addClass("closed");
    //     $(".c-panels.mobile").first().removeClass("closed").addClass("opened");
    //   }
    //   pw = $(window).width();
    // });

    /*
    // Flip on scroll
    //note Throttle is not needed

    if(options.allowMouseWheel) {

      $el.mousewheel(function(event) {
        //console.log(event.deltaX, event.deltaY, event.deltaFactor);

        if(event.deltaY > 0) { // Scrolling up

          $('.c-panels.opened .flap.left-side').trigger('click');

        } else { // Scrolling down

          $('.c-panels.opened .flap.right-side').trigger('click');
        }
      });
    }
    */





    /*
    // Swipes

    $el.swipe({
      
      swipeRight: function() {
        console.log('swipe right');

        if(Sur.Utils.isMobile()) {

          var 
            $panOpen = getCurrentPanel(),
            $panNext = getPreviousPanel();

          if($panNext) {

            openCardLeft($panOpen, $panNext);
          }        
        }        
      },
      swipeLeft: function() {
        console.log('swipe left');

        if(Sur.Utils.isMobile()) {

          var 
            $panOpen = getCurrentPanel(),
            $panNext = getNextPanel();
            //$el.find('.c-panels.opened');//,
            //$panNext = $panOpen.next();
          //console.log('  panOpen', $panOpen);
          //console.log('  panNext', $panNext);

          if($panNext) {

            openCardRight($panOpen, $panNext);
          }
        }
      }
    });
    */
  }

  function openCardRight($panelFrom, $panelTo, callback) {

    var
      $panOpen = $panelFrom,
      $panNext = $panelTo;

    // Init

    $panOpen.css({
      'z-index': 1
    });
    $panNext
      .css({
        left: '100%',
        'z-index': 2
      })
      .removeClass('closed');

    //

    $panNext.animate({
      'left': 0
    }, default_anim_timing_mobile, function() {

      // Reset values

      $panOpen
        .css({
          'z-index': 0
        })
        .addClass('closed')
        .removeClass('opened');

      $panNext.css({
        'z-index': 1
      }).addClass('opened');

      if(callback) {
        callback();
      }
    });
  }

  function openCardLeft($panelFrom, $panelTo, callback) {

    var 
      $panOpen = $panelFrom,
      $panNext = $panelTo;

    $panOpen.css({
      'z-index': 2
    });
    $panNext
      .css({
        'z-index': 1
      })
      .removeClass('closed')
      .addClass('opened');

    $panOpen.animate({
      left: '100%'
    }, default_anim_timing_mobile, function() {

      $panOpen
        .removeClass('opened')
        .addClass('closed');

      $panNext.css({
        'z-index': 0
      });

      if(callback) {
        callback();
      }
    });
  }

  function getCurrentPanel() {
    console.log('BookFlip.getCurrentPanel()', $('.c-bookflip .c-panels.opened'));
    //return $el.find('.c-panels.opened');
    return $('.c-bookflip .c-panels.opened');
  }

  function getNextPanel() {
    
    var $current = getCurrentPanel();

    var $next = $($current.find('.flap.right-side').data('to-panel'));

    return $next.length > 0 ? $next : false;
  }

  function getPreviousPanel() {

    var $current = getCurrentPanel();

    var $next = $($current.find('.flap.left-side').data('to-panel'));

    return $next.length > 0 ? $next : false;
  }
  
  // Public

  return {
    init: init,
    open: open,
    getCurrentPanel: getCurrentPanel,
    //openCardRight: openCardRight,
    //openCardLeft: openCardLeft
    hideCardRight: function($panel) {
      $panel.find('.flap.right-side').hide();
    }
  };
})(jQuery);
