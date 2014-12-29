highlowApp.popup = {
	init : function() {
		console.log('popup init');
		$('.trading-platform-popup-wrapper').on('click','.close', function(event) {
			$(event.target).closest('.trading-platform-popup-wrapper').addClass('concealed');
		});
		
		$('.trading-platform-popup-wrapper').on('click',function(event) {
			if (!$(event.target).closest('.trading-platform-popup-content-inner-wrap').length) {
				$(this).addClass('concealed');
			}
		});

		$('.trading-platform-sell-popup-sell').on('click', function(){
			$('.trading-platform-sell-popup').addClass('concealed');

		});

		$('.popup-link').click(function(){
			window.open($(this).attr('href'), "_blank", "scrollbars=yes, resizable=yes, top="+(($(window).height()-540)/2)+", left="+(($(window).width()-966)/2)+" width=966, height=540");
		});

		$('.trading-activity-popup-root').on('click','.investment-sell-btn', function() {
			$('.trading-platform-sell-popup').removeClass('concealed');
		});
	}
}