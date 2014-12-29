highlowApp.heatmap = {
	init: function() {
		
		$('.heatmap').on('click','.expander',function(){
			var $e  = $($(this).closest('.heatmap'));
			var $target = $('#'+$e.data('target'));
			if($e.hasClass('collapsed')) {
				$e.removeClass('collapsed');
				$target.animate({
					left: '50px'
				},150);

				$('.trading-platform-live-graph').addClass('pushed');

				var model = $($e.closest('.main-view')).data(highlowApp.marketSimulator.modelDataName);

				highlowApp.graph.loadInstrument(model);
				
			}
		});

		$('.heatmap').on('click','.toggle',function(){
			var $e  = $($(this).closest('.heatmap'));
			var $target = $('#'+$e.data('target'));
			if(!$e.hasClass('collapsed')) {
				$e.addClass('collapsed');

				$target.animate({
					left: '0px'
				},150);

				$('.trading-platform-live-graph').removeClass('pushed');

				var model = $($e.closest('.main-view')).data(highlowApp.marketSimulator.modelDataName);

				highlowApp.graph.loadInstrument(model);
			}
		});
	}
}