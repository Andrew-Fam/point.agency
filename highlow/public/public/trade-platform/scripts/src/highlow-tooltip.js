highlowApp.tooltip = {
	init: function(delay) {
		$('.tooltip-container').each(function(){
			var $e = $(this);
			var $tooltip = $($e.children('.tooltip'));

			$tooltip.css({
				display: 'none',
				opacity: 0
			});
			var timeout;

			$e.on('mouseover',function(){
				timeout = setTimeout(function(){
					$tooltip.css({
						display: 'block'
					});


					$tooltip.animate({
						opacity: 1
					},250);

				},delay);
			}).on('mouseout',function(){
				
				clearTimeout(timeout);

				$tooltip.animate({
					opacity: 0
				},250,function(){
					$tooltip.css({
						display: 'none'
					});
				});
			});
		});
	}
}