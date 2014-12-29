highlowApp.tab = {
	init: function() {
		$('.tab-view').on('click','.tab-view-tab-selector', function(event){

			$($(event.target).closest('.tab-view').find('> .tab-view-body-wrapper > .tab-view-body > .tab-view-panel')).removeClass('active');
			$($(event.target).closest('.tab-view-tab-selectors').find('.tab-view-tab-selector')).removeClass('active');
			
			$($(this).data('target')).addClass('active');
			$(this).addClass('active');
		});


		$('.tab-view.instrument-selector-widget').on('click','.tab-view-tab-selector', function(e) {
			highlowApp.instrumentPanelSelector.selectInstrument($($(this).data('target')+' .instrument-panel-active'));
		})
	}
}