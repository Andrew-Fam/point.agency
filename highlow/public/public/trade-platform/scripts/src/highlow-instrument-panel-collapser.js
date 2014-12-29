highlowApp.instrumentPanelCollapser = {
	init: function() {
		var duration = 0;
		//collapser

		$('.instrument-selector-widget').on('click','.instrument-selector-widget-collapse-toggle',function(event){
			var self = $(this),
			$parent = $($(event.target).closest('.instrument-selector-widget')),
			$instrumentPanelsWrapper = $parent.find('.page-container'),
			$instrumentSliders = $parent.find('.instrument-selector-widget-instruments-slider');
			$instrumentPanels = $parent.find('.instrument-panel');

			if(self.hasClass('on')) {
				self.removeClass('on');
				// $instrumentPanels.removeClass('collapsed');
				
				$instrumentPanelsWrapper.animate({
					height: '137px',
					top: '0px'
				},duration,function(){
					$instrumentPanels.removeClass('collapsed');
				});
				$instrumentSliders.animate({
					'line-height' : '190px'
				},duration);
			} else {
				self.addClass('on');
				// $instrumentPanels.addClass('collapsed');
				$instrumentPanelsWrapper.animate({
					height: '36px',
					top: '4px'
				},duration,function(){
					$instrumentPanels.addClass('collapsed');
				});

				$instrumentSliders.animate({
					'line-height' : '108px'
				},duration);
			}
		});
	}
}