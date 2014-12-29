highlowApp.instrumentPanelSlider = {
	slidingTime: 500,
	init: function() {
		//slider 
		var self = this;
		$('.page-container').each(function(){
			var $currentPage = $($(this).find('.page.active'));

			$currentPage.next('.page').addClass('next');
			$currentPage.prev('.page').addClass('prev');

		});

		$('.page-slider.forward').click(function(){
			if(!highlowApp.instrumentPanelSlider.Sliding) {
				self.nextPage($(this).data('target'));
			}
		});

		$('.page-slider.backward').click(function(){
			if(!highlowApp.instrumentPanelSlider.Sliding) {
				self.previousPage($(this).data('target'));
			}
		});
	},
	nextPage : function(target) {
		var $target = $(target),
		$currentPage = $($target.find('.page.active')),
		$fade = $($target.find('.slider-fade-left, .slider-fade-right'));


		

		if($currentPage.next('.page').length>0) {

			highlowApp.instrumentPanelSlider.Sliding = true;

			$fade.addClass('in');

			$currentPage.next('.page').animate({
				"left" : 0 
			},{
				duration: highlowApp.instrumentPanelSlider.slidingTime,
				complete: function () {
					$(this).addClass('active').removeClass('next');
					$(this).next('.page').addClass('next');
				}
			});
			$currentPage.animate({
				"left" : "-100%"
			},{
				duration: highlowApp.instrumentPanelSlider.slidingTime,
				complete: function() {
					$(this).removeClass('active').addClass('prev');
					$(this).prev('.page').removeClass('prev');
					$fade.removeClass('in');
					highlowApp.instrumentPanelSlider.Sliding = false;
				}
			});
		}
	},
	previousPage: function(target) {
		var $target = $(target),
		$currentPage = $($target.find('.page.active')),
		$fade = $($target.find('.slider-fade-left, .slider-fade-right'));

		

		if($currentPage.prev('.page').length>0) {


			highlowApp.instrumentPanelSlider.Sliding = true;

			$fade.addClass('in');

			$currentPage.prev('.page').animate({
				"left" : 0 
			},{
				duration: highlowApp.instrumentPanelSlider.slidingTime,
				complete: function () {
					$(this).addClass('active').removeClass('prev');
					$(this).prev('.page').addClass('prev');
				}
			});
			$currentPage.animate({
				"left" : "100%"
			},{
				duration: highlowApp.instrumentPanelSlider.slidingTime,
				complete: function() {
					$(this).removeClass('active').addClass('next');
					$(this).next('.page').removeClass('next');
					$fade.removeClass('in');
					highlowApp.instrumentPanelSlider.Sliding = false;
				}
			});
		}
	}
}