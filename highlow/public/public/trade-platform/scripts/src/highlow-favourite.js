highlowApp.favourite = {
	favourite: {},
	itemPerPage: 5,
	init: function() {
		var duration = 0;
		var module = this;
		//collapser

		$('.instrument-panel').on('click','.instrument-panel-favourite',function(event){
			var self = $(this);

			var $parent = $(self.closest('.instrument-panel'));

			var model = $parent.data(highlowApp.marketSimulator.modelDataName);


			event.stopPropagation();

			if(self.hasClass('faved')) {

				module.unFavorItem(self, model);
			
			} else {
				module.favorItem(self, model);
			}

		});
	},
	unFavorItem: function(el,model) { 
		el.removeClass('faved');
		el.attr('title','Add to Favourites');

		var self = this;


		if(!self.favourite[model.type]) {
			return;
		}

		if(!self.favourite[model.type].map[model.uid]) {
			return;
		} 


		model.favourite = false;
		
		self.favourite[model.type].array.splice(self.favourite[model.type].array.indexOf(model),1);

		self.removeFromFavouriteTab(model);

		delete self.favourite[model.type].map[model.uid];

		self.rerender(model);

	},
	favorItem: function(el,model) {
		el.addClass('faved');
		el.attr('title','Remove from Favourites');
		var self = this;

		if(!self.favourite[model.type]) {
			self.favourite[model.type] = {
				map: {},
				array: []
			};
		}
		model.favourite = true;
		self.favourite[model.type].map[model.uid] = model;
		self.favourite[model.type].array.push(model);

		self.addToFavouriteTab(model);
	},
	addToFavouriteTab: function(model) {

		var $container = $('#'+model.type+'-favourite-pages .pages-wrapper');

		var $originalView = $('#'+model.type+"-"+model.durationId+"-pages [data-uid='"+model.uid+"']");



		var $view = $originalView.clone(true,true);

		$view.data(highlowApp.marketSimulator.modelDataName, $originalView.data(highlowApp.marketSimulator.modelDataName));


		$view.removeClass('instrument-panel-active');

		var $activePage = $('#'+model.type+'-favourite-pages .page.active');

		var activePageIndex = $activePage.index();

		var $pages = $('#'+model.type+'-favourite-pages .pages-wrapper .page');

		var $panel;

		if ($pages.length>0) {
			$panels = $($($pages[$pages.length-1]).find('.instrument-panel'));
		}

		var $page;

		//if favourite is empty

		if($pages.length<=0 || $panels.length>=5) {

			$page = $('<div class="page"></div>');

			if($pages.length<=0) {
				$page.addClass('active');
			} else {

			}
			
		} else {

			$page = $($pages[$pages.length-1]);
		}

		$page.append($view);

		$container.append($page);

		$activePage = $('#'+model.type+'-favourite-pages .page.active');
				
		$activePage.next().addClass('next');

		$activePage.prev().addClass('prev');


		$('#'+model.type+'-favourite-pages .no-data').addClass('hidden');
		$('.instrument-panel[data-uid="'+model.uid+'"] .instrument-panel-favourite').addClass('faved');

	},
	removeFromFavouriteTab: function(model) {

		var self = this;

		var $view = $('#'+model.type+"-favourite-pages [data-uid='"+model.uid+"']");

		// toggle original instrument panel

		$('#'+model.type+"-"+model.durationId+"-pages [data-uid='"+model.uid+"'] .instrument-panel-favourite").removeClass("faved");

		$('#'+model.type+"-all-pages [data-uid='"+model.uid+"'] .instrument-panel-favourite").removeClass("faved");


		// remove the copied instrument panel from favourite tab

		$view.remove();

		//this.rerender(model);

	},
	rerender: function(model) {

		var self = this;
		
		var $views = $('#'+model.type+'-favourite-pages .pages-wrapper .instrument-panel');

		var $container = $('#'+model.type+'-favourite-pages .pages-wrapper');

		$views.detach();


		var activePageIndex = $('#'+model.type+'-favourite-pages .page.active').index();

		if(!activePageIndex) {
			activePageIndex = 0;
		}

		var $pages = $('#'+model.type+'-favourite-pages .page');

		var $page;


		for(var i=0; i< $views.length; i++) {

			if(i%self.itemPerPage==0) {

				if(i/self.itemPerPage>=$pages.length-1) {

					$page = $('<div class="page"></div>');
				} else {
					$page = $($pages[i/self.itemPerPage]);
				}

				if(i/self.itemPerPage==activePageIndex) {
					$page.addClass('active');
				}

			

			}


			var $view = $($views[i]);

			$page.append($view);


			if(i/self.itemPerPage>=$pages.length-1) {
				$container.append($page);
			}


		}





		var numberOfPages = $views.length/self.itemPerPage;

		//remove empty page

		if(numberOfPages<$pages.length) {
			for (var i = $pages.length; i > numberOfPages; i--) {
				$($pages[i-1]).remove();
			}
		}

		//set active Page

		$pages = $('#'+model.type+'-favourite-pages .page');

		if(activePageIndex<$pages.length) {

			$($pages[activePageIndex]).addClass('active').removeClass('prev').removeClass('next').css({left: '0px'});

		} else {

			$($pages[activePageIndex-1]).addClass('active').removeClass('prev').removeClass('next').css({left: '0px'});
		}

		




		var $activePage = $('#'+model.type+'-favourite-pages .page.active');

		$activePage.next().addClass('next');
		$activePage.prev().addClass('prev');

		if($views.length == 0) {
			$('#'+model.type+'-favourite-pages .no-data').removeClass('hidden');
		}
	}
}