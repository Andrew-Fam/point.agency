highlowApp.oneClick = {
	className: 'one-click',
	init: function() {
		$('.trading-platform-instrument-one-click-toggler').click(function(){
			var self = $(this),
			$platform = $('.trading-platform, .trading-platform-invest-popup');


			if(self.hasClass('active')) {
				$('.trading-platform-instrument-one-click-toggler').removeClass('active');
				$platform.removeClass(highlowApp.oneClick.className);
			} else {
				$('.trading-platform-instrument-one-click-toggler').addClass('active');
				$platform.addClass(highlowApp.oneClick.className);
			}
		});
	}
}