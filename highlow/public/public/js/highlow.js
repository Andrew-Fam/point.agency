/* tCycle Modified */

(function($) {
	"use strict";
	$.fn.tcycle = function(command) {


		function cycle(skipPrepend) {

			var i = 0,
				c = $(this),
				s = c.children(),
				o = $.extend({
					speed: 500,
					timeout: 4000
				}, c.data()),
				f = o.fx != 'scroll',
				l = s.length,
				w = c.width(),
				z = o.speed,
				t = o.timeout,
				css = {
					overflow: 'hidden'
				},
				p = 'position',
				a = 'absolute',
				tfn = function() {
					c.data('recursiveTimeout', setTimeout(tx, t));
				},
				scss = $.extend({
					position: a,
					top: 0
				}, f ? {
					left: 0
				} : {
					left: w
				}, o.scss);
			if (c.css(p) == 'static')
				css[p] = 'relative';


			s.css(scss);
			if (f)
				s.hide().eq(0).show();
			else
				s.eq(0).css('left', 0);
			c.data('initTimeout', setTimeout(tx, t));

			function tx() {
				var n = i == (l - 1) ? 0 : (i + 1),
					w = c.width(),
					a = $(s[i]),
					b = $(s[n]);
				if (f) {
					a.fadeOut(z);
					b.fadeIn(z, tfn);
				} else {
					a.animate({
						left: -w
					}, {
						duration: z,
						easing: "easeInOutBack",
						complete: function() {
							a.hide();
							a.addClass('out');
						}
					});
					b.css({
						'left': w,
						display: 'block'
					}).animate({
						left: 0
					}, z, tfn);
					b.removeClass('out');
				}
				i = i == (l - 1) ? 0 : (i + 1);
			}
		}

		if (command == "reset") {
			this.each(function() {
				window.clearTimeout($(this).data('initTimeout'));
				window.clearTimeout($(this).data('recursiveTimout'));
				$(this).tcycle(true);
			});

			return;
		}

		return this.each(cycle);

	};
	$(function() {
		$('.tcycle').tcycle();
	});
})(jQuery)

/* END tCycle Modified */


/* rotating strip on top of footer */

window.rotatingStripInit = function() {
	$('.kapitall-strip').each(function() {
		var self = $(this);
		var stripWidth = 0,
			$strip = $(self.find('.rotating-strip ul')),
			$testi = $(self.find('.testi')),
			$stripRoot = $(self.find('.rotating-strip')),
			pixelPerSecond = 90;
		$(self.find('.rotating-strip ul > li')).each(function() {
			stripWidth += $(this).outerWidth();
		});
		$strip.css('width', stripWidth);

		function toggleTesti() {

			if ($testi.hasClass('faded')) {
				$testi.removeClass('faded');
				$stripRoot.addClass('faded');
				setTimeout(function() {
					toggleTesti();
				}, 14000);
			} else {
				$strip.css('margin-left', 0);
				rotateInterval = setInterval(rotateStrip, 1000 / pixelPerSecond);
				$testi.addClass('faded');
				$stripRoot.removeClass('faded');
			}

		};
		var rotating = true;

		function rotateStrip() {
			if (rotating) {
				$strip.css('margin-left', parseInt($strip.css('margin-left')) - 1);

				if (parseInt($strip.css('margin-left')) <= $($strip.parent()).width() - $strip.outerWidth() && $strip.css('margin-left') != '0px') {
					clearInterval(rotateInterval);
					toggleTesti();
				}
			}
		}


		var rotateInterval = setInterval(rotateStrip, 1000 / pixelPerSecond);
	});

	window.resizeHandler.addHandler(function() {
		$('.tcycle .out').css('left', -$('.tcycle').width());
	});
	// $strip.animate({
	// 	"margin-left": -stripWidth
	// },{easing: "linear",duration:stripWidth/pixelPerSecond*1000}, function(){
	// 	alert('pull testi in now');
	// // });

	// window.scrollHandler.addHandler(function (){
	// 	if($window.scrollTop() > $stripRoot.offset().top - $window.height() && $window.scrollTop() < $stripRoot.offset().top + $stripRoot.outerHeight() + $window.height() ) {
	// 		rotating = true;
	// 	} else {
	// 		rotating = false;
	// 	}
	// });
}

/* end rotating strip */

/* full-height hero */

window.fullHeightHeroInit = function() {
	if ($hero.length > 0) {
		window.resizeHandler.addHandler(function() {
			var aspectRatio = $window.width() / $window.height();

			$('.hero-content').each(function() {
				var $header = $('header'),
					$strip = $('.kapitall-strip'),
					$landingHeadline = $($(this).find('.headline')),
					$cta = $($(this).find('.cta')),
					$bg = $('.hero .bg'),
					$realContentBlock = $($(this).find('.headline-content-inner-wrap')),
					contentH = 0,
					heroH = 0;
				if ($(this).data('disableFullHeight')) {
					contentH = $realContentBlock.outerHeight() * 1.6;
					heroH = $realContentBlock.outerHeight() * 1.6;
				} else {
					if ($window.height() >= 680) {
						heroH = $window.height() - $header.outerHeight() - $strip.outerHeight();
					} else {
						heroH = $window.height() - $header.outerHeight();
					}
					if (aspectRatio < 4 / 3) {
						if ($bg.outerHeight() - $header.outerHeight() < heroH - $cta.outerHeight() && $bg.outerHeight() != 0) {
							heroH = $bg.outerHeight() - $header.outerHeight();
						}
					}

					/* if the calculated hero height is less than the real height of the content + 1/10th of the windo's width 
						(the amount of padding we want for the real content to be had) + the yellow cta height, set it to that exact height (the real height of the content + 1/10th of the windo's width 
						(the amount of padding we want for the real content to be had) + the yellow cta height).
						*/

					if ((heroH <= $realContentBlock.outerHeight() + $window.width() * 0.2 + $cta.outerHeight() && $window.width() < 768) || (heroH <= $realContentBlock.outerHeight() && $window.width() >= 768)) {
						heroH = $realContentBlock.outerHeight() + $window.width() * 0.2 + $cta.outerHeight();

					}

					contentH = heroH - $cta.outerHeight();
				}


				$(this).css('min-height', heroH);
				$landingHeadline.css('height', contentH);


			});

		});
	}
}

/* end full-height hero */


/* landing navigation */

window.goToDemo = function() {
	var easing = "easeInOutExpo";
	$('.hero-content.landing').removeClass('active');
	$('.hero-content.demo').addClass('active');
	var $landingHeadline = $('.headline.landing'),
		$cta = $('.landing .cta'),
		$demoHeadline = $('.headline.demo'),
		$demoCta = $('.demo .cta'),
		$demoBlock = $('#demo-block');

	$landingHeadline.animate({
		"margin-top": -$landingHeadline.outerHeight(),
		"opacity": 0
	}, {
		duration: 500,
		easing: easing
	});

	$cta.animate({
		"margin-bottom": -$cta.outerHeight(),
		"opacity": 0
	}, {
		duration: 500,
		easing: easing

	});

	$demoHeadline.animate({
		"margin-top": 0,
		"opacity": 1
	}, {
		duration: 500,
		easing: easing
	});

	$demoCta.animate({
		"margin-left": 0,
		"opacity": 1
	}, {
		duration: 500,
		easing: easing
	});

	$demoBlock.animate({
		"margin-left": 0,
		"opacity": 1
	}, {
		duration: 1000,
		easing: easing
	});


	$('html, body').animate({
		scrollTop: 0
	}, {
		duration: 250
	});
}

window.returnToMainPage = function(duration) {
	var easing = "easeInOutExpo";

	$('.hero-content.landing').addClass('active');
	$('.hero-content.demo').removeClass('active');
	var $landingHeadline = $('.headline.landing'),
		$cta = $('.landing .cta'),
		$demoHeadline = $('.headline.demo'),
		$demoCta = $('.demo .cta'),
		$demoBlock = $('#demo-block');

	$landingHeadline.animate({
		"margin-top": 0,
		"opacity": 1
	}, {
		duration: duration,
		easing: easing
	});

	$cta.animate({
		"margin-bottom": 0,
		"opacity": 1
	}, {
		duration: duration,
		easing: easing,
		complete: function() {

		}
	});
	$demoCta.animate({
		"margin-left": -$demoCta.outerWidth(),
		"opacity": 0
	}, {
		duration: duration,
		easing: easing
	});
	$demoBlock.animate({
		"margin-left": -$demoBlock.outerWidth(),
		"opacity": 0
	}, {
		duration: duration,
		easing: easing
	});
	$demoHeadline.animate({
		"margin-top": -$demoHeadline.outerWidth(),
		"opacity": 0
	}, {
		duration: duration,
		easing: easing
	});

	$('html, body').animate({
		scrollTop: 0
	}, {
		duration: 250
	});
}

window.landingNavigationInit = function() {

	returnToMainPage(0);

	$('#return-to-main-page').click(function() {
		returnToMainPage(600);
	});

	$('#im-new').click(function() {
		goToDemo();
	});

}

/* end splash navigation */

/* sticky-strip */

window.stickyStripInit = function() {
	window.stickyStrips = $('.sticky-strip');
	if (window.stickyStrips.length > 0) {
		window.scrollHandler.addHandler(function() {
			var activeStickyStrips = $('.sticky-strip .content.sticky');

			var totalActiveStripsHeight = 0;

			activeStickyStrips.each(function() {
				totalActiveStripsHeight += $(this).outerHeight();
			});

			window.stickyStrips.each(function() {
				var self = $(this);
				content = $(self.find('.content'));
				self.css('min-height', content.outerHeight());
				if ($window.scrollTop() + totalActiveStripsHeight > self.offset().top && $window.outerWidth() > 767) {
					content.addClass('sticky');
				} else {
					content.removeClass('sticky');
				}
			});

			activeStickyStrips = $('.sticky-strip .content.sticky');

			var offset = 0;

			for (var i = 0; i < activeStickyStrips.length; i++) {
				var activeStrip = $(activeStickyStrips[i]);
				activeStrip.css('top', offset);
				offset += activeStrip.outerHeight();
			}
		});
	}
}

/* end sticky-strip */

/* expandable */

window.expandableInit = function() {
	$('.expandable').each(function() {
		var self = $(this);
		$(self.find('.expandable-header')).click(function() {
			if (self.hasClass('expanded')) {
				self.removeClass('expanded');
				$(self.find('.expandable-content-wrapper')).collapse('hide');
			} else {
				self.addClass('expanded');
				$(self.find('.expandable-content-wrapper')).collapse('show');
			}
		});
	});
}

/* end expandable */

/* blog list cards layout */

window.blogListInit = function() {
	if ($('.blog-list').length > 0) {
		$('.blog-list').isotope({
			masonry: {
				columnWidth: '.blog-item-wrapper'
			},
			itemSelector: '.blog-item-wrapper'
		});
	}

	// window.resizeHandler.addHandler(function(){

	// });
}

/* end blog list cards layout */


/* tab (both side bar and full-width tabs) responsive */

window.tabViewInit = function() {

	var breakpoint = 768;
	$('.tab-side-bar').each(function() {
		var self = $(this);
		$(this).on('click', '.nav.nav-tabs li', function() {
			if (self.hasClass('selecting')) {
				// if($window.outerWidth() < breakpoint){
				// 	$('html, body').animate({
				// 		scrollTop: self.offset().top
				// 	},{duration: 250, ease: "easeInOutQuad"});
				// }
				self.removeClass('selecting');
			} else {
				if ($window.outerWidth() < breakpoint) {
					$('html, body').animate({
						scrollTop: self.offset().top
					}, {
						duration: 250,
						ease: "easeInOutQuad"
					});
				}
				if ($window.outerWidth() < breakpoint) {
					self.addClass('selecting');
				}
			}
		});
	});

	$('.tab-full-width').each(function() {
		var self = $(this);


		/* click handler (for when tab view collapse) */

		$(this).on('click', '> .tab-selector-wrap .nav.nav-tabs li', function() {
			if (self.hasClass('selecting')) {
				// if($window.outerWidth() < breakpoint){
				// 	$('html, body').animate({
				// 		scrollTop: self.offset().top
				// 	},{duration: 250, ease: "easeInOutQuad"});
				// }
				self.removeClass('selecting');
			} else {
				if ($window.outerWidth() < breakpoint) {
					$('html, body').animate({
						scrollTop: self.offset().top
					}, {
						duration: 250,
						ease: "easeInOutQuad"
					});
				}
				if ($window.outerWidth() < breakpoint) {
					self.addClass('selecting');
				}
			}
		});


		/* normalize tab width */

		var tabs = $($(this).find('> .tab-selector-wrap .nav.nav-tabs li'));

		tabs.css('width', (100 / tabs.length) + "%");

	});


	window.resizeHandler.addHandler(function() {
		if (breakpoint <= $window.width()) {
			$('.selecting').removeClass('selecting');
		}
	});

}

/* end tab-side-bar responsive */

/* app download mobile handler */

window.appDownloadInit = function() {
	var $appDownloadSection = $('.app-download');
	$('.download-panel').each(function() {
		var self = $(this);
		self.on('click', '.download-panel-header', function() {
			if ($window.width() < 768) {
				if (self.hasClass('open')) {
					self.removeClass('open');

					$('html, body').animate({
						scrollTop: $appDownloadSection.offset().top
					}, {
						duration: 250,
						easing: 'easeInOutQuad'
					});

				} else {
					$('.download-panel.open').removeClass('open');
					self.addClass('open');

					$('html, body').animate({
						scrollTop: self.offset().top
					}, {
						duration: 250,
						easing: 'easeInOutQuad'
					});
				}
			}
		});
	});
}

/* demo block mock */

window.demoBlockInit = function() {
	$('#demo-block .step').click(function() {
		$('#demo-block .step').removeClass('in');
		$($(this).data('next')).addClass('in');
		if ($(this).data('focus')) {
			$('.hero-content.demo .overlay').addClass('in');
		} else {
			$('.hero-content.demo .overlay').removeClass('in');
		}
	});
}

/* end demo block mock */

window.UIinit = function() {
	rotatingStripInit();


	$(':first-child').addClass('first-child');
	$(':last-child').addClass('last-child');
	$('tr:nth-child(odd)').addClass('odd');
	$('tr:nth-child(even)').addClass('even');


	/* wrap select box with wrapper */
	$('select').wrap('<div class="select-wrap"></div>');


	landingNavigationInit();
	expandableInit();
	fullHeightHeroInit();
	stickyStripInit();
	blogListInit();
	demoBlockInit();
	tabViewInit();
	appDownloadInit();
	smoothSroll();
}


window.resizeHandler = {
	handlers: [],
	addHandler: function(handler) {
		this.handlers.push(handler);
	},
	removeHandler: function(handler) {
		this.handlers.splice(this.handlers.indexOf(handler));
	},
	execute: function() {
		var self = window.resizeHandler;
		for (var i = 0; i < self.handlers.length; i++) {
			self.handlers[i]();
		}
	},
	init: function() {
		var self = this;
		$window.unbind('resize', self.execute);
		self.execute();
		$window.bind('resize', self.execute);
	}
}

window.scrollHandler = {
	handlers: [],
	addHandler: function(handler) {
		this.handlers.push(handler);
	},
	removeHandler: function(handler) {
		this.handlers.splice(this.handlers.indexOf(handler));
	},
	execute: function() {
		var self = window.scrollHandler;
		for (var i = 0; i < self.handlers.length; i++) {
			self.handlers[i]();
		}
	},
	init: function() {
		var self = this;
		$window.unbind('scroll', self.execute);
		self.execute();
		$window.bind('scroll', self.execute);
	}
}

window.mockLoginInit = function() {

	if ($.cookie('logged-in')) {
		$('body').addClass('logged-in');
		$('#user-bar, #common-nav').removeClass('sticky-strip');
	} else {
		$('body').removeClass('logged-in');
	}

	$('#login-trigger-button').click(function() {
		$.cookie('logged-in', 'true');
		location.href = './trade-platform.html';
	});

	$('#logout-trigger-button').click(function() {
		$.removeCookie('logged-in');
		location.href = './highlow.html';
	});


}


window.getTotalActiveStickyStripsHeight = function() {
	var activeStickyStrips = $('.sticky-strip .content.sticky');

	var totalActiveStripsHeight = 0;

	activeStickyStrips.each(function() {
		totalActiveStripsHeight += $(this).outerHeight();
	});
	return totalActiveStripsHeight
}

window.smoothSroll = function() {

	$('a.smooth-scroll[href*=#]:not([href=#])').click(function() {

		if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
			var target = $(this.hash);
			target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
			if (target.length) {
				$('html,body').animate({
					scrollTop: target.offset().top - getTotalActiveStickyStripsHeight() - 36
				}, 300);
				return false;
			}
		}
	});

}

$(document).ready(function() {
	$window = $(window);
	$hero = $('.hero');
	if (navigator.userAgent.indexOf('Mac OS X') != -1) {
		$("body").addClass("mac");
	} else {
		$("body").addClass("pc");
	}
	$('#tour-down').click(function() {
		var totalStickyHeight = 0;
		$('.sticky').each(function() {
			totalStickyHeight += $(this).outerHeight();
		});
		$('html,body').animate({
			scrollTop: $('#explanation').offset().top - totalStickyHeight
		}, {
			duration: 500,
			easing: 'easeInOutExpo'
		});
	});


	mockLoginInit();
	UIinit();
	resizeHandler.init();
	scrollHandler.init();

	setTimeout(function() {
		$window.resize();
	}, 100);

});