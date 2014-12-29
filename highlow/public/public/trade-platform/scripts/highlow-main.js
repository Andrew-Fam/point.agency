var highlowApp = {};

$(function () {

	

	
	highlowApp.tab.init();
	highlowApp.systemMessages.init();
	highlowApp.graph.init();
	highlowApp.marketSimulator.init();
	highlowApp.oneClick.init();
	highlowApp.popup.init();
	highlowApp.instrumentPanelCollapser.init();
	highlowApp.instrumentPanelSlider.init();
	highlowApp.instrumentPanelSelector.init();
	highlowApp.betSystem.init();
	highlowApp.favourite.init();
	highlowApp.heatmap.init();
	highlowApp.tooltip.init(1000);
	highlowApp.numberOnly.init();
});
;
highlowApp.randomValue = function(from, to, decimal) {

	var factor = 1;

	if(decimal) {
		factor = decimal>0? Math.pow(10,decimal): 1;
	}

	var to = to * factor,
	from = from * factor;

	return Math.floor(Math.random() * (to-from+1)+from)/factor;
}
highlowApp.expiring = function() {
	if(window.location.href.indexOf('?expiring')>=0) {
		return true;
	} else {
		return false;
	}
}
highlowApp.isNumber = function(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

highlowApp.durationToText = function(stamp) {

	var remainingTime = stamp,
	remainingTimeText = "";

	remainingHour = (remainingTime - remainingTime%(60*60*1000)) / (60*60*1000);

	remainingMinute = ((remainingTime - remainingHour*(60*60*1000)) - (remainingTime - remainingHour*(60*60*1000))%60000) / 60000;

	remainingSecond = Math.floor((remainingTime%60000) / 1000);

	if(remainingSecond<0 & remainingMinute==0 & remainingHour == 0) {
		remainingTimeText = ' expired';
	} else if(remainingHour > 0) {
		remainingTimeText = " "+(remainingHour<10?"0"+remainingHour:remainingHour)+":"+(remainingMinute<10?"0"+remainingMinute:remainingMinute)+":"+(remainingSecond<10?"0"+remainingSecond:remainingSecond);
	} else {
		remainingTimeText = " "+(remainingMinute<10?"0"+remainingMinute:remainingMinute)+":"+(remainingSecond<10?"0"+remainingSecond:remainingSecond);
	}

	return remainingTimeText;
}

highlowApp.timeToText  = function(stamp) {
	var time = new Date(stamp);
	var hour = time.getHours(),
	minute = time.getMinutes();

	var text = "";

	text +=  hour < 10?("0"+hour):hour;


	text +=':';

	text += minute < 10? ("0"+minute):minute;

	return text;

}
;
highlowApp.betSystem = {
	bets : {},
	sellPopup: function(bet){
		$('.trading-platform-sell-popup'+'.'+bet.type).removeClass('concealed');
		$('.trading-platform-sell-popup.'+bet.type+' .trading-platform-sell-popup-instrument').html(bet.model.label);
		$('.trading-platform-sell-popup.'+bet.type+' .trading-platform-invevstment-value').html("$"+bet.amount);
		$('.trading-platform-sell-popup.'+bet.type+' .trading-platform-pay-out-value').html("$"+parseFloat(bet.amount*parseFloat($('.trading-platform-sell-popup.'+bet.	type+' .trading-platform-return-rate-value .rate').html())).toFixed(2));
	},
	createBetEntry : function (bet, point, uid, type, betObject, clickHandler) {
		var time = new Date(point.x),
		expiry = new Date(betObject.expireAt),
		strike = betObject.strike;


		var row = $('<tr data-uid="'+uid+'">'+
			'<td class="investment-select">'+
			'</td>'+
				'<td class="investment-type '+type+'">'+ //Type
				'</td>'+
				'<td class="investment-asset">'+ //Asset
				bet.model.label+
				'</td>'+
				'<td class="investment-strike highlow-'+bet.direction+'"> '+ //Strike
				strike+
				'</td>'+
				'<td class="investment-time">'+ // Bet time
				time.getHours() + ':' + (time.getMinutes()>9?time.getMinutes():("0"+time.getMinutes())) +
				'</td>'+
				'<td class="investment-expiry">'+ //Expiry
				expiry.getHours() + ':' + (expiry.getMinutes()>9?expiry.getMinutes():("0"+expiry.getMinutes())) +
				'</td>'+
				'<td class="investment-status">Opened'+ //Status
				'</td>'+
				'<td class="investment-closing-rate">-'+ // Closing rate
				'</td>'+
				'<td>'+ // Investment value
				'$'+
				'<span class="investment-value">'+$('#'+type+'-investment-value-input').val()+
				'</span>'+
				'</td>'+
				'<td class="investment-payout font-b">'+ // Payout
				'</td>'+
				'<td class="investment-sell"><button data-investment="'+$('#investment-value-input').val()+'" class="investment-sell-btn '+type+' btn font-m btn-sm-pad">SELL</button>'+
				'</td>'+
				'</tr>'
				);
		
		row.on('click',function(){
			// betObject.focus();

			// switch view to selected object

			$("[data-target=\"#"+betObject.type+"-mode\"]").click();

			// switch to right interval tab

			$("[data-target=\"#"+betObject.type+'-'+bet.model.durationId+"\"]").click();

			// highlight right instrument-panel
			$('#'+betObject.type+"-"+bet.model.durationId+" [data-uid=\""+bet.model.uid+"\"]").click();

			//slide to the right page

			var targetPage = $($('#'+betObject.type+"-"+bet.model.durationId+' .instrument-panel-active').closest('.page'));
			var targetPageIndex = targetPage.index();

			var currentPage = $('#'+betObject.type+"-"+bet.model.durationId+' .page.active');
			var currentPageIndex = currentPage.index();


			var leftSlider = $('#'+betObject.type+"-"+bet.model.durationId+' .page-slider.backward'),
			rightSlider = $('#'+betObject.type+"-"+bet.model.durationId+' .page-slider.forward');

			var turn  = Math.abs(targetPageIndex-currentPageIndex);

			var turned = 0;


			function turnPage() {
				if( targetPageIndex > currentPageIndex) {
					highlowApp.instrumentPanelSlider.nextPage(rightSlider.data('target'));
					turned++;
				}

				if ( targetPageIndex < currentPageIndex) {
					highlowApp.instrumentPanelSlider.previousPage(leftSlider.data('target'));
					turned++;					
				}

				if(turned<turn) {
					setTimeout(turnPage,highlowApp.instrumentPanelSlider.slidingTime*1.2);
				}
			}

			turnPage();
			

		});

		row.on('click','.investment-sell-btn', function(e) {
			e.preventDefault();
			highlowApp.betSystem.sellPopup(bet);
		})

		$('.trading-platform-investments-list').append(row);

		$('.trading-platform-investments').removeClass('no-data');
	},
	updateBetEntry : function (bet,model) {
		var entryId = '[data-uid="'+bet.uid+'"]',
			strike = parseFloat(bet.strike).toFixed(highlowApp.marketSimulator.rounding),
			rate = parseFloat(model.currentRate).toFixed(highlowApp.marketSimulator.rounding);


		var status,
		winning = 1,
		losing = -1,
		tie = 0;

		switch(bet.direction) {
			case 'high' : {
				if (rate > strike) {
					status = winning;
				}

				if (rate < strike) {
					status = losing;
				}

				if (rate == strike) {
					status = tie;
				}

				break;
			}

			case 'low' : {
				if (rate > strike) {
					status = losing;
				}

				if (rate < strike) {
					status = winning;
				}

				if (rate == strike) {
					status = tie;
				}
			}
		}

		if(!bet.expired) {
			if (status===winning) {
				$("tr"+entryId).removeClass().addClass('investment-winning');
				$("tr"+entryId+" .investment-payout").html('$'+Math.floor(bet.amount*bet.model.payoutRate));
			} else if (status===losing) {
				$("tr"+entryId).removeClass().addClass('investment-losing');
				$("tr"+entryId+" .investment-payout").html('$0');
			} else {
				$("tr"+entryId).removeClass().addClass('investment-tying');
				$("tr"+entryId+" .investment-payout").html('$'+bet.amount);
			}

		}else {
			$("tr"+entryId+" .investment-status").html('Closed');
			$("tr"+entryId+" .investment-closing-rate").html(bet.closingRate);
		}


	},
	confirmBet : function (bet,point,type){
		$('.trading-select-direction-'+type+'-'+bet).click();
		$('.trading-platform-invest-popup'+'.'+type).removeClass('concealed');
	},
	placeBet : function (bet,type) {

		$('.trading-platform-invest-popup').addClass('concealed');

		var betAt = new Date().getTime();

		var graph = $('#'+type+"-graph").highcharts();

		var series = graph.series[0];

		var renderer = graph.renderer;

		var bets = this.bets;

		var model = $('#'+type+'-main-view').data('instrumentModel');

		if(!bets[type]) {
			bets[type] = [];
		}

		// if(bet!="high" && bet!="low") {
		// 	highlowApp.systemMessages.displayMessage("fail","Investment error. Please select Up or Down");
		// 	return;
		// }

		var investmentValue = $('#'+type+'-investment-value-input').val();

		// if(investmentValue=="" ||investmentValue==undefined || !highlowApp.isNumber(investmentValue)) {
		// 	highlowApp.systemMessages.displayMessage("fail","Investment error. Please insert correct investment amount");
		// 	return;
		// }

		// if(investmentValue>500) {
		// 	highlowApp.systemMessages.displayMessage("warning","Investment amount is out of the allowed range");
		// 	return;
		// }


		// highlowApp.systemMessages.displayMessage("success","Success");

		var strike = parseFloat(model.currentRate).toFixed(3);

		if (type=="spread") {
			if(bet=="high") {
				strike = (parseFloat(model.currentRate)+highlowApp.marketSimulator.spread).toFixed(3);
			}
			if(bet=="low") {
				strike = (parseFloat(model.currentRate)-highlowApp.marketSimulator.spread).toFixed(3);
			}
		}

		var expireAt = model.expireAt;

		if ( type.indexOf('on-demand') >= 0 ) {
			expireAt = betAt+3*60*1000;
		}

		var point = series.points[series.points.length-1];

		var bet = {
			direction: bet,
			type: model.type,
			amount: investmentValue,
			betAt: betAt,
			strike: strike,
			expireAt: expireAt,
			point: point,
			model: model,
			focused: true,
			x : point.x,
			uid : model.uid+'-'+point.x+'-'+(series.points.length-1),
			focus: function () {
				if( model.focusedBet!=undefined) {
					model.focusedBet.focused = false;
				}
				model.focusedBet = bet;
				model.focusedBet.focused = true;
				highlowApp.marketSimulator.updateBetStatus(model);
				
			}
		}

		
		bet.focus();

		model.bets.push(bet);

		highlowApp.graph.placeBet(bet);

		this.createBetEntry(bet,point,bet.uid,model.type, bet);

		highlowApp.marketSimulator.updateBetStatus(model);

	},
	init : function() {

		var self = this;

		$('.trading-platform-main-controls-select-direction .btn').click(function(){
			$('.trading-platform-main-controls-select-direction .btn').removeClass('active').addClass('in-active');



			if($(this).hasClass('active')) {
				$(this).removeClass('active');
			} else {
				if($(this).hasClass('highlow-up')) {
					$('.trading-platform-main-controls-select-direction .btn.highlow-up').addClass('active').removeClass('in-active');
				} else {
					$('.trading-platform-main-controls-select-direction .btn.highlow-down').addClass('active').removeClass('in-active');
				}
			}
		});

		// yellow INVEST button

		$('.trading-platform-main-controls-place-bet').click(function(){
			var direction = $('input:radio[name="'+$(this).data('direction')+'"]:checked').val();
			var type = $(this).data('type');

			if(!direction || direction =="") {
				console.log('Please select high or low');
				return;
			}

			self.placeBet(direction,type);
			$('.trading-platform-invest-popup.'+type).addClass('concealed');

			$('.trading-platform-main-controls-select-direction .btn').removeClass('active').removeClass('in-active');

			$('input:radio[name="'+$(this).data('direction')+'"]:checked').prop('checked', false);

		});

		// one-touch button

		$('.one-touch-bet').click(function(){
			var direction = $(this).data('direction');
			var type =  $(this).data('type');

			self.placeBet(direction,type);
		});	

	}
}
;
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
;
highlowApp.graph = {
	graphs : {},
	onGraphUI : {},
	init : function (){

		Highcharts.setOptions({
		    plotOptions: {
		        series: {
		            animation: false
		        }
		    },
		    global : {
		    	useUTC: false
		    }
		});

		this.prepareGraph('#highlow-graph');
		this.prepareGraph('#spread-graph');
		this.prepareGraph('#on-demand-graph',2*60*1000);
		this.prepareGraph('#spread-on-demand-graph',2*60*1000);

		this.graphs['highlow'] = Highcharts.charts[$("#highlow-graph").data('highchartsChart')];
		this.graphs['spread'] = Highcharts.charts[$("#spread-graph").data('highchartsChart')];
		this.graphs['on-demand'] = Highcharts.charts[$("#on-demand-graph").data('highchartsChart')];
		this.graphs['spread-on-demand'] = Highcharts.charts[$("#spread-on-demand-graph").data('highchartsChart')];



		this.mouse = {x:0,y:0};
		var self = this;
		$(document).on('mousemove', function(e){
			self.mouse.x = e.clientX || e.pageX; 
    		self.mouse.y = e.clientY || e.pageY;
		});
	},
	isOneClick: function(model) {
		var $mainView = $("#"+model.type+"-main-view");

		return $mainView.hasClass(highlowApp.oneClick.className);
	},
	indexOfPointByXRecursive: function(points, x, lowerBoundary, upperBoundary) {

		// Fool check...

	    if (upperBoundary < lowerBoundary) {
	        return null;
	    }
	    // get mid point

	    var mid = Math.floor((lowerBoundary+upperBoundary)/2);

	    if (points[mid].x > x)
	        return this.indexOfPointByXRecursive(points, x, lowerBoundary, mid-1);
	    else if (points[mid].x < x)
	        return this.indexOfPointByXRecursive(points, x, mid+1, upperBoundary);
	    else
	        return mid;
	},
	loadInstrument: function (model) {

		var currentTime = new Date().getTime();
		var type = model.type;

		var symbols = this.onGraphUI;
		
		// remove old button added with the last data point

		if(symbols[type]) {
			if(symbols[type].highButton) {
				symbols[type].highButton.destroy();
				symbols[type].highButton = undefined;
			}
			
			if(symbols[type].lowButton) {
				symbols[type].lowButton.destroy();
				symbols[type].lowButton = undefined;
			}
		}
		

		$('#'+model.type+"-graph").highcharts().destroy();

		this.prepareGraph('#'+model.type+"-graph");

		this.graphs[model.type] = $('#'+model.type+"-graph").highcharts();



		var graph = this.graphs[model.type];

		var renderer = graph.renderer;

		// add graph closing line;

		var resize = $('#'+model.type+"-graph").closest('.trading-platform-live-graph').hasClass('pushed');

		if(resize) {
			var closingLine = renderer.path(['M', 790, 5, 'L', 790, 272])
			.attr({
				'stroke-width': 1,
				stroke: '#252323'
			}).add();
			

			// add graph bottom line;

			var bottomLine = renderer.path(['M', 49, 272, 'L', 790, 272])
			.attr({
				'stroke-width': 1,
				stroke: '#252323'
			}).add();
		} else {
			var closingLine = renderer.path(['M', 840, 5, 'L', 840, 272])
			.attr({
				'stroke-width': 1,
				stroke: '#252323'
			}).add();
			

			// add graph bottom line;

			var bottomLine = renderer.path(['M', 49, 272, 'L', 840, 272])
			.attr({
				'stroke-width': 1,
				stroke: '#252323'
			}).add();
		}

		

		var series = graph.series[0];

		// make sure the graph data and model data doesn't intertwine

		var data = JSON.parse(JSON.stringify(model.data));

		series.setData(data, true, false, false);

		var xAxis = graph.xAxis[0];




		if(model.type.indexOf("on-demand")>=0) {
			
			xAxis.setExtremes(currentTime-10*60*1000,currentTime+3*60*1000,true);

			var expiryHintLineId = model.type+"-expiry-hint-line";

			var expiryHintTextId = model.type+"-expiry-hint-text";

			xAxis.removePlotLine(expiryHintLineId);

			if(model.bets.length>0) {

				if(model.onDemandHintText!=undefined) {

					model.onDemandHintText.destroy();
					model.onDemandHintText = undefined;
				}


			} else {
				

				xAxis.addPlotLine({
					color: '#606060',
					value: currentTime+3*60*1000,
					width: 1,
					zIndex: 1000,
					id: expiryHintLineId
				});

				var textX = xAxis.toPixels(currentTime+3*60*1000)-6,
				textY = 141;

				text = renderer.text('NEXT EXPIRY IN 60 SECS',textX,textY);

				text.css({
					"font-family":"Montserrat",
					"font-size" : "10px;",
					"color" : "white"
				});

				text.attr({
					zIndex: 6,
					id: expiryHintTextId,
					transform: 'translate(0,0) rotate(270 '+textX+' '+textY+')',
					width: '177px',
					'text-anchor': 'middle'
				});

				text.add();

				model.onDemandHintText = text;
			}
			
		
		} else {
			

			var extremeMin = 10*60*1000;

			if(model.duration>15*60*1000) {
				extremeMin = 30*60*1000;
			}

			if(model.duration>60*60*1000) {
				extremeMin = 3*60*60*1000;
			}


			xAxis.setExtremes(model.openAt-extremeMin,model.expireAt,true);
			
			var plotBandId = model.type+"-plot-band";
			var startLineId = model.type+"-start-plot-line";
			var endLineId = model.type+"-end-plot-line";
			var deadZoneLineId = model.type+"-dead-zone-line";
			var deadZoneBandId = model.type+"-dead-zone-band";
			var startTextId = model.type+"-start-text";
			var deadTextId = model.type+"-dead-zone-text";


			xAxis.removePlotBand(plotBandId);

			xAxis.addPlotBand({
				color: 'rgba(20,20,20,0.3)',
				from: model.openAt, 
				to: model.expireAt,
				id: plotBandId
			});

			xAxis.removePlotLine(startLineId);

			xAxis.addPlotLine({
				color: 'rgba(255,255,255,0.7)',
				value:  model.openAt, 
				width: 1,
				zIndex: 1000,
				id: startLineId
			});

			xAxis.removePlotLine(endLineId);

			xAxis.addPlotLine({
				color: 'rgba(255,255,255,0.7)',
				value:  model.expireAt, 
				width: 1,
				zIndex: 1000,
				id: endLineId
			});


			xAxis.removePlotBand(deadZoneBandId);

			xAxis.addPlotBand({
				from: model.deadzone,
				to: model.expireAt,
				color: {
					pattern: 'public/trade-platform/images/deadzone-bg.png',
               		width: 4,
                	height: 4
				},
				id: deadZoneBandId
			});

			xAxis.removePlotLine(deadZoneLineId);

			xAxis.addPlotLine({
				color: 'rgba(255,255,255,0.4)',
				value:  model.deadzone, 
				width: 1,
				zIndex: 3,
				id: deadZoneLineId
			});

			var textY = 10,
			startTextX = xAxis.toPixels(model.openAt)-70,
			deadTextX = xAxis.toPixels(model.deadzone)-70;


			if(model.startTimeText) {
				model.startTimeText.element.remove();
			}

			if(model.deadTimeText) {
				model.deadTimeText.element.remove();
			}

			model.startTimeText = renderer.text('Start: '+highlowApp.timeToText(model.openAt),startTextX,24);
			model.deadTimeText = renderer.text('Stop: '+highlowApp.timeToText(model.deadzone),deadTextX,24);


			model.startTimeText.css({
				color: '#838383',
				zIndex: 10
			});

			model.deadTimeText.css({
				color: '#838383',
				zIndex: 11
			});

			model.startTimeText.add();
			model.deadTimeText.add();


		}

		series.points[series.points.length-1].update({
			marker : {
				enabled : true,
				symbol : "url(public/trade-platform/images/graph-marker.png)",
				zIndex : 1000
			},
			states: {
				hover: {
					enabled: false
				}
			},
			zIndex: 1000
		});

		// add trace line to newest data point

		graph.yAxis[0].addPlotLine({
			color: '#ffffff',
			width: 1,
			dashStyle: 'ShortDash',
			value: model.currentRate,
			zIndex: 4,
			id : 'current-value'
		});

		this.updateOnGraphUI(model,series.points[series.points.length-1]);

		
		// reload bet points 

		// go through all bets associated with this instrument

		for(var i=0; i< model.bets.length; i++) {



			var bet = model.bets[i];



			// reset finish text for on-demand bets

			if(model.type.indexOf('on-demand')>=0) {
				bet.finishLabel = undefined;
				bet.finishText = undefined;
			}


			// do a binary search in the series.points to find the right point.

			bet.point = series.points[this.indexOfPointByXRecursive(series.points,bet.x,0,series.points.length-1)];

			this.placeBet(bet);

			
		}


		var tickInterval = 5*60*1000;

		if(model.duration>15*60*1000) {
			tickInterval = 15*60*1000;
		}

		if(model.duration>60*60*1000) {
			tickInterval = 4*60*60*1000;
		}

		graph.xAxis[0].update({
			tickInterval : tickInterval
		});


	},
	updateOnGraphUI: function (model,point) {

		var symbols = this.onGraphUI,
		type = model.type;

		if(!symbols[type]) {
			symbols[type] = {};
		}

		// remove old button added with the last data point

		
		// if(symbols[type].highButton) {
		// 	symbols[type].highButton.destroy();
		// 	symbols[type].highButton = undefined;
		// }
		
		// if(symbols[type].lowButton) {
		// 	symbols[type].lowButton.destroy();
		// 	symbols[type].lowButton = undefined;
		// }

		if(symbols[type].lowRate) {
			symbols[type].lowRate.destroy();
			symbols[type].lowRate = undefined;
		}

		if(symbols[type].highRate) {
			symbols[type].highRate.destroy();
			symbols[type].highRate = undefined;
		}
		

		var graph = this.graphs[model.type];

		var series = graph.series[0];

		var renderer  = graph.renderer;

		
		var xAxis = graph.xAxis[0],
		yAxis = graph.yAxis[0];

		yAxis.removePlotLine('current-value');

		// add trace line to newest data point

		yAxis.addPlotLine({
			color: '#ffffff',
			width: 1,
			dashStyle: 'ShortDash',
			value: point.y,
			zIndex: 4,
			id : 'current-value'
		});



		if(type.indexOf("on-demand")>=0) {

			// set graph range

			xAxis.setExtremes(point.x-10*60*1000,point.x+3*60*1000,true);


			var expiryLineId = model.type+"-expiry-hint-line";

			xAxis.removePlotLine(expiryLineId);

			if(model.bets.length>0) {

				if(model.onDemandHintText!=undefined) {
					model.onDemandHintText.destroy();
					model.onDemandHintText = undefined;
				}

			} else {
				xAxis.addPlotLine({
					color: '#606060',
					value: point.x+3*60*1000,
					width: 1,
					zIndex: 1000,
					id: expiryLineId
				});
			}

			

		} else {

			// set graph range

			// xAxis.setExtremes(point.x-5*60*1000,point.x+15*60*1000,true);

		}

		// get the extremes of y Axis to check if the current point is going to fall off screen

		var currentYExtremes = yAxis.getExtremes();


		var bottomExtreme = currentYExtremes.min,
		topExtreme = currentYExtremes.max;

		var yMiddle = (topExtreme + bottomExtreme) / 2;

		var safeZone = 0.005;
		var interval = 0.002;
		var bufferZone = interval*1;
		var tickCount = 8;

		var newTopExtreme = topExtreme,
		newBottomExtreme = bottomExtreme;

	





		if( point.y>yMiddle) {
			// check if point is too close to top edge
			

			if(topExtreme - point.y < safeZone) {

				newTopExtreme  += safeZone - (topExtreme-point.y);
				newBottomExtreme = newTopExtreme - interval*tickCount;

				yAxis.setExtremes(newBottomExtreme,newTopExtreme,true);

			} 
		} else {
			// check if point is too close to bottom edge

			if(point.y - bottomExtreme < safeZone) {

				newBottomExtreme -= safeZone-(point.y-bottomExtreme);
				newTopExtreme = newBottomExtreme + interval*tickCount;

				yAxis.setExtremes(newBottomExtreme,newTopExtreme,true);

			}
		}


		// get position of latest point in the series (we want to position the high/low buttons relatively to the latest point)

		pointX = point.plotX,
		pointY = point.plotY;


		var	highX = pointX+76,
			highY = pointY-37,
			lowX = pointX+76,
			lowY = pointY+22;

		if(highY<5 || lowY>230) {
			highY = pointY - 7;
			highX = pointX + 68;
			lowY = pointY - 7;
			lowX = pointX + 104;

			if(type=="spread") {
				lowX = lowX + 69;
			}
		}

		var highButtonId = 'in-chart-'+type+'-high-bet',
				lowButtonId = 'in-chart-'+type+'-low-bet';


		// only render button if the instrument is not dead yet

		if(!model.dead) {

			if(!symbols[type].highButton) {
				console.log('recreate on graph buttons');
				var high = {},
				low = {};
				

				

				// now render the 2 buttons




				if(symbols.highBetButtonHover) {
					if(type.indexOf("spread")>=0) {
						high = renderer.image('public/trade-platform/images/graph-up-spread-hover.png',highX,highY, 96, 27);
					} else {
						high = renderer.image('public/trade-platform/images/graph-up-hover.png',highX,highY, 27, 27);
					}
				} else {
					if(type.indexOf("spread")>=0) {
						high = renderer.image('public/trade-platform/images/graph-up-spread.png',highX,highY, 96, 27);
					} else {
						high = renderer.image('public/trade-platform/images/graph-up.png',highX,highY, 27, 27);
					}
				}

			

				

				high.attr({
					zIndex:'10',
					id: highButtonId
				});

				high.on('click', function () {
					// if(!highlowApp.graph.isOneClick(model)) {
						highlowApp.betSystem.confirmBet('high',point,model.type);
					// } else {
					// 	highlowApp.betSystem.placeBet('high',model.type);
					// }

				});


				high.on('mouseover', function () {
					symbols.highBetButtonHover = true;
					if(type.indexOf("spread")>=0) {
						$('#'+highButtonId).attr('href','public/trade-platform/images/graph-up-spread-hover.png');
					} else {
						$('#'+highButtonId).attr('href','public/trade-platform/images/graph-up-hover.png');
					}
				});

				high.on('mouseleave', function () {
					symbols.highBetButtonHover = false;
					if(type.indexOf("spread")>=0) {
						$('#'+highButtonId).attr('href','public/trade-platform/images/graph-up-spread.png');
					} else {
						$('#'+highButtonId).attr('href','public/trade-platform/images/graph-up.png');
					}
				});

				// add click handler

				high.add();

				high.css({
					"cursor" : "pointer"
				});

				symbols[type].highButton = high;

				// 

				if(symbols.lowBetButtonHover) {
					
					if(type.indexOf("spread")>=0) {
						low = renderer.image('public/trade-platform/images/graph-down-spread-hover.png',lowX,lowY, 96, 27);
					} else {
						low = renderer.image('public/trade-platform/images/graph-down-hover.png',lowX,lowY, 27, 27);
					}
				} else {
					if(type.indexOf("spread")>=0) {
						low = renderer.image('public/trade-platform/images/graph-down-spread.png',lowX,lowY, 96, 27);
					} else {
						low = renderer.image('public/trade-platform/images/graph-down.png',lowX,lowY, 27, 27);
					}
				}



				



				low.attr({
					zIndex:'10',
					id: lowButtonId
				});

				low.on('click', function () {
					// if(!highlowApp.graph.isOneClick(model)) {
						highlowApp.betSystem.confirmBet('low',point,model.type);
					// } else {
					// 	highlowApp.betSystem.placeBet('low',model.type);
					// }
				})

				low.on('mouseover', function () {
					symbols.lowBetButtonHover = true;
					if(type.indexOf("spread")>=0) {
						$('#'+lowButtonId).attr('href','public/trade-platform/images/graph-down-spread-hover.png');
					} else {
						$('#'+lowButtonId).attr('href','public/trade-platform/images/graph-down-hover.png');
					}
				});

				low.on('mouseleave', function () {
					symbols.lowBetButtonHover = false;
					if(type.indexOf("spread")>=0) {
						$('#'+lowButtonId).attr('href','public/trade-platform/images/graph-down-spread.png');
					} else {
						$('#'+lowButtonId).attr('href','public/trade-platform/images/graph-down.png');
					}
				});

				// add click handler

				low.add();

				low.css({
					"cursor" : "pointer"
				});

				symbols[type].lowButton = low;
			} else {
				symbols[type].lowButton.attr({
					x: lowX,
					y: lowY
				});
				symbols[type].highButton.attr({
					x: highX,
					y: highY
				});
			}


			

			if(type.indexOf("spread")>=0) {
				var highRate = renderer.text('<div class="on-graph-button">'+(point.y+0.005).toFixed(3)+'</div>',highX+27,highY+19);
				highRate.on('click', function () {
					// if(!highlowApp.graph.isOneClick(model)) {
						highlowApp.betSystem.confirmBet('high',point,model.type);
					// } else {
					// 	highlowApp.betSystem.placeBet('high',model.type);
					// }
				})
				highRate.on('mouseover', function () {
					symbols.highBetButtonHover = true;
					if(type.indexOf("spread")>=0) {
						$('#'+highButtonId).attr('href','public/trade-platform/images/graph-up-spread-hover.png');
					} else {
						$('#'+highButtonId).attr('href','public/trade-platform/images/graph-up-hover.png');
					}
				});

				highRate.on('mouseleave', function () {
					symbols.highBetButtonHover = false;
					if(type.indexOf("spread")>=0) {
						$('#'+highButtonId).attr('href','public/trade-platform/images/graph-up-spread.png');
					} else {
						$('#'+highButtonId).attr('href','public/trade-platform/images/graph-up.png');
					}
				});
				highRate.attr({
					zIndex:'10',
					id:'in-chart-spread-high-bet-rate'
				});
				highRate.css({
					"cursor" : "pointer",
					"font-size" : "16px;",
					"color" : "white"
				});
				highRate.add();

				var lowRate = renderer.text('<div class="on-graph-button">'+(point.y-0.005).toFixed(3)+'</div>',lowX+27,lowY+19);
				lowRate.on('click', function () {
					// if(!highlowApp.graph.isOneClick(model)) {
						highlowApp.betSystem.confirmBet('low',point,model.type);
					// } else {
					// 	highlowApp.betSystem.placeBet('low',model.type);
					// }
				});
				lowRate.on('mouseover', function () {
					symbols.lowBetButtonHover = true;
					if(type.indexOf("spread")>=0) {
						$('#'+lowButtonId).attr('href','public/trade-platform/images/graph-down-spread-hover.png');
					} else {
						$('#'+lowButtonId).attr('href','public/trade-platform/images/graph-down-hover.png');
					}
				});

				lowRate.on('mouseleave', function () {
					symbols.lowBetButtonHover = false;
					if(type.indexOf("spread")>=0) {
						$('#'+lowButtonId).attr('href','public/trade-platform/images/graph-down-spread.png');
					} else {
						$('#'+lowButtonId).attr('href','public/trade-platform/images/graph-down.png');
					}
				});
				lowRate.css({
					"cursor" : "pointer",
					"font-size" : "16px;",
					"color" : "white"
				});
				lowRate.attr({
					zIndex:'10',
					id:'in-chart-spread-low-bet-rate'
				});

				lowRate.add();

				symbols[type].highRate = highRate;

				symbols[type].lowRate = lowRate;
			}


		} else {
			if(symbols[type].highButton) {
				symbols[type].highButton.destroy();
				symbols[type].highButton = undefined;
			}
			
			if(symbols[type].lowButton) {
				symbols[type].lowButton.destroy();
				symbols[type].lowButton = undefined;
			}
		}


	},
	placeBet : function(betObject) {

		var graph = $('#'+betObject.type+"-graph").highcharts();

		var series = graph.series[0];

		var renderer = graph.renderer;

		var xAxis = graph.xAxis[0];

		if(betObject.marker!=undefined) {
			betObject.marker.destroy();
		}

		var pointX = betObject.point.plotX,
		pointY = betObject.point.plotY;


		
		var highX = pointX+40,
		highY = pointY-24,
		lowX = highX,
		lowY = pointY+4,
		labelHighX = pointX+28,
		labelHighY = pointY-48,
		labelLowX = pointX+28,
		labelLowY = pointY+40,
		textHighX = labelHighX+21,
		textHighY = labelHighY+12,
		textLowX = labelLowX+21,
		textLowY = labelLowY+12,
		hoverDuration = 150;


		// if(betObject.type.indexOf('on-demand')<0) {
		switch(betObject.direction) {
			case 'high' : {
				var img = renderer.image('public/trade-platform/images/high-lose.png',highX,highY,21,28);

				img.css({
					'cursor' : 'pointer'
				});

				img.attr({
					zIndex : 10
				});
				img.add();


				var markerValueLabel = renderer.rect(labelHighX,labelHighY,43,16,0);

				var markerValueText = renderer.text(betObject.strike,textHighX,textHighY);
				

				
				break;
			}
			case 'low' : {
				var img = renderer.image('public/trade-platform/images/low-lose.png',lowX,lowY,21,28);

				img.css({
					'cursor' : 'pointer'
				});

				img.attr({
					zIndex : 10
				});
				img.add();

				var markerValueLabel = renderer.rect(labelLowX,labelLowY,43,16,0);

				var markerValueText = renderer.text(betObject.strike,textLowX,textLowY);

				break;
			}
			default : {
				break;
			}
		}

		markerValueLabel.attr({
			zIndex: 14
		});

		markerValueLabel.css({
			display:'none'
		})

		markerValueText.attr({
			zIndex: 14
		});

		markerValueText.css({
			display:'none'
		})

		markerValueText.attr({
			width: '42px',
			'text-anchor': 'middle'
		});

		img.on('click', function(){
			if(!betObject.expired) {
				highlowApp.betSystem.sellPopup(betObject);
			}
		});

		img.on('mouseover', function() {

			if (betObject.model.type.indexOf('on-demand')>=0 && !betObject.expired) {
				betObject.hover = true;
				betObject.model.hoveredBet = betObject;
				highlowApp.marketSimulator.updateBetStatus(betObject.model);
			} 

			if(betObject.direction == "high") {
				img.css({
					'-ms-transform-origin': "center bottom",
					'transform-origin': "center bottom",
					'-moz-transform-origin': "center bottom",
					'-webkit-transform-origin': "center bottom",
					'-ms-transform': "scale(1.1,1.1)",
					'-webkit-transform': "scale(1.1,1.1)",
					'-moz-transform': "scale(1.1,1.1)",
					'transform': "scale(1.1,1.1)",
				});
			} else {
				img.css({
					'transform-origin': "center top",
					'-moz-transform-origin': "center top",
					'-webkit-transform-origin': "center top",
					'-ms-transform': "scale(1.1,1.1)",
					'-webkit-transform': "scale(1.1,1.1)",
					'-moz-transform': "scale(1.1,1.1)",
					'transform': "scale(1.1,1.1)",
				});
			}

			

			markerValueLabel.css({display:'block'});

			markerValueText.css({display:'block'});
		});
		img.on('mouseout', function() {

			if (betObject.model.type.indexOf('on-demand')>=0) {
				betObject.hover = false;
				betObject.model.hoveredBet = undefined;
				highlowApp.marketSimulator.updateBetStatus(betObject.model);
			} 

			img.css({
				'-ms-transform': "scale(1,1)",
				'transform': "scale(1,1)",
				'-webkit-transform': "scale(1,1)",
				'-moz-transform': "scale(1,1)"
			});

			markerValueLabel.css({display:'none'});

			markerValueText.css({display:'none'});
		});

		markerValueLabel.attr({
			zIndex : 10
		});

		markerValueLabel.attr({
			fill : "#161515"
		});

		markerValueText.attr({
			zIndex : 11
		});

		markerValueLabel.add();

		markerValueText.add();

		betObject.markerValueLabel = markerValueLabel;

		betObject.markerValueText = markerValueText;

		betObject.marker = img;

		var model = betObject.model;
		
		if(model.type.indexOf("on-demand")>=0) {

			var expiryHintLineId = model.type+"-expiry-hint-line";

			var expiryHintTextId = model.type+"-expiry-hint-text";

			xAxis.removePlotLine(expiryHintLineId);

			

			if(model.onDemandHintText!=undefined) {

				model.onDemandHintText.destroy();
				model.onDemandHintText = undefined;
			}
			
		}



	},
	addPoint: function (model,point) {



		var graph = this.graphs[model.type];

		var series = graph.series[0];

		series.points[series.points.length-1].update({
			marker : {
				enabled: false
			}
		});

		series.addPoint(point,true,false,false);



		this.updateOnGraphUI(model,series.points[series.points.length-1]);
		

	},
	prepareGraph: function (id,xInterval) {
		var labelStyle = {
			fontFamily: '"Roboto","Helvetica Neue",Helvetica, Arial, sans-serif',
			fontSize: '10px',
			color: 'white'
		};

		var xTickInterval = ""+(5*60*1000);

		if(xInterval) {
			xTickInterval = ""+xInterval;
		}


		return $(id).highcharts({
			chart: {
				type: 'area',
				animation: false,
				backgroundColor : '#353535',
				marginTop: 6,
				marginLeft: 50,
				renderTo: 'container',
				style : {
					fontFamily: '"Roboto","Helvetica Neue",Helvetica, Arial, sans-serif',
					fontSize: '10px',
					color: 'white',
					overflow: 'visible',
					zIndex: '4'
				},
				startOnTick: false,
				endOnTick: false
			},credits: {
				enabled: false
			},legend: {
				enabled: false
			},plotOptions: {
				area: {
					lineColor: '#ffa200',
					lineWidth: 2,
					marker: {
		                enabled: false
		            }
				},
				series: {
					marker : {
						enabled : false,
						states : {
							hover : {
								enabled : false
							}
						},
						zIndex : 10000
					}
				}
			},series : [{
				color: {
				    linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
				    stops: [
				        [0, '#ffe048'],
				        [1, '#ffc539']
				    ]
				},
				fillOpacity: '1',
				name : '',
				type: 'area',
				data : [],
				threshold: null,
				marker : {
					enabled: false
				}
			}],yAxis: {
				labels: {
					style: labelStyle,
					format: '{value:.3f}'
				},
				gridLineWidth: 1,
				gridLineColor: '#202020',
				tickInterval : 0.002,
				tickWidth : 0,
				lineColor: '#202020',
				lineWidth: 1,
				startOnTick: false,
				endOnTick: true,
				title: {
					text : null
				}
			},xAxis: {
				labels: {
					style: labelStyle
				},
				minPadding: 0,
				gridLineWidth: 1,
				gridLineColor: '#202020',
				dateTimeLabelFormats: {
					second: '%H:%M',
					minute: '%H:%M',
					hour: '%H:%M:%S',
					day: '%H:%M',
					week: '%H:%M'
				},
				ordinal : false,
				lineColor: '#202020',
				lineWidth: 1,
				tickInterval : xTickInterval,
				tickWidth : 0,
				type: 'datetime',
				lineColor: 'transparent'
			},title: {
				text: ''
			},
			tooltip : {
				enabled: false
			},
			subtitle: {
				text: ''
			}
		});
	}
}
;
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
;
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
;
highlowApp.currentInstrument = {};

highlowApp.instrumentPanelSelector = {
	init: function() {
		var self = this;
		// handle instrument selector click

		$('.instrument-panel').click(function(e){
			var target = $(e.target);
			$(target.closest('.page-container').find('.instrument-panel-active')).removeClass('instrument-panel-active');
			$(this).addClass('instrument-panel-active');
			$('.instrument-panel-active');
			self.selectInstrument($(this));
		});

		// select default instruments when land on app

		$('.instrument-selector-widget-instruments-container .tab-view-panel.active .instrument-panel-active').each(function(){
			self.selectInstrument($(this));
		});

	},
	selectInstrument: function (e) {



		var label = e.data('instrumentLabel'),
			duration = e.data('instrumentDuration'),
			type = e.data('tradingType'),
			model = e.data('instrumentModel');

		// update active instrument here.

		if(model) {

			if (highlowApp.currentInstrument[type]!=undefined) {
				highlowApp.currentInstrument[type].active = false;
			}

			model.active = true;

			highlowApp.currentInstrument[type] = model;


			model.updateMainView();

			// change graph to display this instrument data

			highlowApp.graph.loadInstrument(model);
		}

	}
}
;
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
;
highlowApp.marketSimulator = {
	instruments : [],
	spread: 0.005,
	rounding: 3,
	minInterval: 1000,
	maxInterval: 1500,
	maxChange: 0.0008,
	modelDataName: 'instrumentModel',
	start: function() {
		var self = this;
		for (var i = 0; i < this.instruments.length; i++) {
			var instrument  = this.instruments[i];

			instrument.update();
			instrument.updateTime();
		}
	},
	simulate: function(instrument) {
		var self = this;
	
		var deviation = highlowApp.randomValue(0,self.maxChange,4);

		// if the market has been moving up, there's more chance it's gonna go down this time

		var coefficient = 0.0016;



		var splitChance = 0.5;

		if(instrument.absoluteChange>0) {
			splitChance+=0.1;
		} else if(instrument.absoluteChange<0) {
			splitChance-=0.1;
		}

		if(instrument.absoluteChange>0.002) {
			splitChance+=0.3;
		} else if(instrument.absoluteChange<0.002) {
			splitChance-=0.3;
		}


		// console.log(splitChance);

		var variation = Math.random() >= splitChance ? deviation : -deviation;





		instrument.previousRate = parseFloat(instrument.currentRate);
		instrument.currentRate = parseFloat(instrument.currentRate + variation);




		instrument.absoluteChange += parseFloat(variation);

		if (instrument.type.indexOf('spread')>=0) {
			instrument.upperRate = parseFloat(parseFloat(instrument.currentRate) + self.spread);
			instrument.lowerRate = parseFloat(parseFloat(instrument.currentRate) - self.spread);
		}



		var currentTime = new Date().getTime();


		// test if instrument has gone into deadzone or not (only applicable to none on-demand types)

		if (instrument.type.indexOf('on-demand')<0) {

			if(currentTime>=instrument.expireAt-2*60*1000) {
				instrument.dead = true;
			}

		}

		if(instrument.active) {
			// update graph
			highlowApp
			.graph
			.addPoint(
				instrument,
				{
	  				x : currentTime,
	  				y : instrument.currentRate,
	  				marker : {
	  					enabled : true,
	  					symbol : "url(public/trade-platform/images/graph-marker.png)"
	  				},
	  				states: {
	  					hover: {
	  						enabled: false
	  					}
	  				},
	  				zIndex: 10
	  			}
  			);
		} 

		instrument.data.push({
			x: currentTime,
			y: instrument.currentRate,
			marker : {
				enabled: false
			}
		});


		self.updateUI(instrument.uid,instrument);

		self.updateBetStatus(instrument);

	},
	updateBetStatus: function(model) {
		// bet markers
 
		var currentTime = new Date().getTime();

		var graph = $('#'+model.type+"-graph").highcharts();

		var series = graph.series[0];

		var xAxis = graph.xAxis[0];

		var renderer = graph.renderer;
			
		for(var i=0; i< model.bets.length; i++) {

			var bet = model.bets[i],
				marker = bet.marker,
				rate = parseFloat(model.currentRate).toFixed(this.rounding),
				point = bet.point,
				winning = false,
				tie = false,
				strike = parseFloat(bet.strike).toFixed(this.rounding),
				expired = false,
				nonActive = false;

			if(bet.expireAt!=undefined) {
				if (bet.expireAt < currentTime && !bet.expired) {
					expired = true;
					bet.expired = true;
					bet.closingRate = rate;
				}
			}

			nonActive = (expired || !bet.focused);

			if(model.active) {


				var pointX = point.plotX,
					pointY = point.plotY;

				var marker = bet.marker;


				var markerValueLabel = bet.markerValueLabel;

				var markerValueText = bet.markerValueText;

				var labelHighX = pointX+28,
				labelHighY = pointY-48,
				labelLowX = pointX+28,
				labelLowY = pointY+40,
				textHighX = labelHighX+21,
				textHighY = labelHighY+12,
				textLowX = labelLowX+21,
				textLowY = labelLowY+12;


				switch(bet.direction) {
					case 'high': {
						marker.attr({
							x : point.plotX+39,
							y : point.plotY-24
						});

						markerValueLabel.attr({
							x : labelHighX,
							y : labelHighY
						});

						markerValueText.attr({
							x : textHighX,
							y : textHighY
						});

						break;
					};
					case 'low': {
						marker.attr({
							x : point.plotX+39,
							y : point.plotY+4
						});

						markerValueLabel.attr({
							x : labelLowX,
							y : labelLowY
						});

						markerValueText.attr({
							x : textLowX,
							y : textLowY
						});


						break;
					}
				}

				



				// only update marker image if the bet is not expired yet

				if(!bet.expired) {

					switch(bet.direction) {
						case 'high' : {
							if (rate > strike) { // winning
								marker.attr({
									'href':"public/trade-platform/images/high-win.png",
									'zIndex' : 10
								});
								
								winning = true;

							} else if (rate <= strike) { // losing
								marker.attr({
									'href':"public/trade-platform/images/high-lose.png",
									'zIndex' : 11
								});
							} 
							// else { // tie
							// 	marker.attr({
							// 		'href':"public/trade-platform/images/high-level"+(nonActive?'-expired':"")+".png",
							// 		'zIndex' : 10
							// 	});

							// 	tie = true;
							// }
							break;
						}
						case 'low' : {
							if (rate >= strike) { //losing
								marker.attr({
									'href':"public/trade-platform/images/low-lose.png",
									'zIndex' : 10
								});
							} else if (rate < strike) { //winning
								marker.attr({
									'href':"public/trade-platform/images/low-win.png",
									'zIndex' : 11
								});

								
								winning = true;
							} 
							// else { // tie
							// 	marker.attr({
							// 		'href':"public/trade-platform/images/low-level"+(nonActive?'-expired':"")+".png",
							// 		'zIndex' : 10
							// 	});

							// 	tie = true;
							// }
							break;
						}
						default : break;
					}

					if(bet.focused) {
						marker.attr({
							zIndex: 14
						});

						$($(bet.markerValueLabel.element).parent()).append(bet.markerValueLabel.element);
						$($(bet.markerValueText.element).parent()).append(bet.markerValueText.element);

						$($(marker.element).parent()).append(marker.element);
					}


				}


				if(model.type.indexOf('on-demand')>=0) {
					

					var plotBandId = model.type+"-plot-band-"+model.uid+"-"+i;
					var startLineId = model.type+"-start-plot-line-"+model.uid+"-"+i;
					var endLineId = model.type+"-end-plot-line-"+model.uid+"-"+i;
					var finishTextId = model.type+"-finish-text-"+model.uid+"_"+i;
					var finishLabelId = model.type+"-finish-label-"+model.uid+"_"+i;


					bet.plotBandId = plotBandId,
					bet.startLineId = startLineId,
					bet.endLineId = endLineId,
					bet.finishTextId = finishTextId,
					bet.finishLabelId = finishLabelId;

					xAxis.removePlotBand(plotBandId);
					xAxis.removePlotLine(startLineId);
					xAxis.removePlotLine(endLineId);
				

					if((bet.focused || bet.hover) && !bet.expired) {

						var x = point.plotX, 
							labelX = Math.floor(xAxis.toPixels(bet.expireAt)-17),
							label = renderer.rect(labelX,52,17,177,0);

						var textX = labelX+12,
							textY = 141;
						
						var textAttribute = {
							id: bet.finishTextId,
							transform: 'translate(0,0) rotate(270 '+textX+' '+textY+')',
							width: '177px',
							'text-anchor': 'middle'
						};

						var labelAttribute = {
							fill: '#f8f7f5'
						};
						

						if(bet.focused && !bet.hover && model.hoveredBet) {
							
							xAxis.addPlotLine({
								color: 'rgba(255,255,255,0.34)',
								value:  bet.betAt, 
								width: 1,
								zIndex: 4,
								id: startLineId
							});

							xAxis.addPlotLine({
								color: 'rgba(255,255,255,0.34)',
								value:  bet.expireAt,
								width: 1,
								zIndex: 4,
								id: endLineId
							});

							labelAttribute.zIndex = '2';

							textAttribute.zIndex = '6';
							

						} else {
							xAxis.addPlotBand({
								color: 'rgba(20,20,20,0.3)',
								from: bet.betAt, 
								to: bet.expireAt,
								zIndex: 1,
								id: plotBandId
							});

							xAxis.addPlotLine({
								color: 'rgba(255,255,255,0.7)',
								value:  bet.betAt, 
								width: 1,
								zIndex: 1000,
								id: startLineId
							});

							xAxis.addPlotLine({
								color: 'rgba(255,255,255,0.7)',
								value:  bet.expireAt,
								width: 1,
								zIndex: 4,
								id: endLineId
							});

							if(bet.hover && !bet.focused) {
								labelAttribute.zIndex = '15';
								textAttribute.zIndex = '15';
							} else {
								labelAttribute.zIndex = '4';
								textAttribute.zIndex = '4';
							}
							

							$($(bet.markerValueLabel.element).parent()).append(bet.markerValueLabel.element);
							$($(bet.markerValueText.element).parent()).append(bet.markerValueText.element);

							$($(marker.element).parent()).append(marker.element);

							marker.attr({
								zIndex: 14
							});
						}


						// add finish line label 
				

						if(bet.finishLabel == undefined) {

							bet.finishLabelId = finishLabelId;
							
							label.attr(labelAttribute);

							label.add();

							bet.finishLabel = label ;
						} else {
							bet.finishLabel.attr({
								x : labelX
							});
						}


						if(bet.finishText==undefined) {

							bet.finishTextId = finishTextId;

							text = renderer.text('loading...',textX,textY);

							text.css({
								"font-family":"Montserrat",
								"font-size" : "10px;",
								"color" : "#4d5158"
							});


							

							text.attr(textAttribute);

							text.add();


							bet.finishText = text;

						} else {

							bet.finishText.attr({
								x: textX,
								'transform': 'translate(0,0) rotate(270 '+textX+' '+textY+')'
							});
						}

						if(bet.focused && !bet.hover && model.hoveredBet) {
							bet.finishText.attr({
								opacity: '0.7'
							});

							bet.finishLabel.attr({
								opacity: '0.34'
							});
						} else {
							bet.finishText.attr({
								opacity: '1'
							});

							bet.finishLabel.attr({
								opacity: '1'
							});
						}
						

					} else {

						if(bet.finishText!=undefined) {
							bet.finishText.destroy();
							bet.finishLabel.destroy();
							bet.finishText = undefined;
							bet.finishLabel = undefined;
						}
					}

				}
				

				
				
				
			}

			

			// update bet entry in table 

			highlowApp.betSystem.updateBetEntry(bet,model);
			

			
			
		}
	},
	updateUI: function (uid,model) {
		var view = $('[data-uid="'+uid+'"]'),
			type = model.type,
			marketSimulator = this;

		var currentTime = new Date().getTime();

		if (model.type.indexOf('spread')>=0) {

			var highDisplay = $(view.find('.instrument-panel-rate.highlow-high')),
			lowDisplay = $(view.find('.instrument-panel-rate.highlow-low'));

			highDisplay.html(" "+parseFloat(model.upperRate).toFixed(marketSimulator.rounding));

			lowDisplay.html(" "+parseFloat(model.lowerRate).toFixed(marketSimulator.rounding));

		} else {
			var rateDisplay = $(view.find('.instrument-panel-rate'));
			rateDisplay.html(" "+parseFloat(model.currentRate).toFixed(marketSimulator.rounding));
			if (model.currentRate>model.previousRate) {
				rateDisplay.removeClass('highlow-low').addClass('highlow-high');
			} else if(model.currentRate<model.previousRate) {
				rateDisplay.removeClass('highlow-high').addClass('highlow-low');
			}
		}


	},
	updateRemainingTime : function (model) {
		if(model.type.indexOf('on-demand') < 0) {
			var view = $('[data-uid="'+model.uid+'"]'),
			remainingTimeDisplay = $(view.find('.expiry-time')),
			currentTime = new Date().getTime(),
			remainingTimeText = "",
			mainViewId  = model.getMainViewId();



			remainingTime = model.expireAt - currentTime;

			// remainingHour = (remainingTime - remainingTime%(60*60*1000)) / (60*60*1000);

			// remainingMinute = ((remainingTime - remainingHour*(60*60*1000)) - (remainingTime - remainingHour*(60*60*1000))%60000) / 60000;

			// remainingSecond = Math.floor((remainingTime%60000) / 1000);

			// if(remainingSecond<0 & remainingMinute==0 & remainingHour == 0) {
			// 	remainingTimeText = ' expired';
			// 	model.expired = true;
			// } else if(remainingHour > 0) {
			// 	remainingTimeText = " "+(remainingHour<10?"0"+remainingHour:remainingHour)+":"+(remainingMinute<10?"0"+remainingMinute:remainingMinute);
			// } else {
			// 	remainingTimeText = " "+(remainingMinute<10?"0"+remainingMinute:remainingMinute)+":"+(remainingSecond<10?"0"+remainingSecond:remainingSecond);
			// }

			remainingTimeText = highlowApp.durationToText(remainingTime);

			if(remainingTime<=0) {
				model.expired = true;
			}

			if(model.active) {
				
				$('#' + mainViewId + ' .trading-platform-instrument-time-left').html(" " + remainingTimeText);

			}

			// remainingTimeDisplay.html(remainingTimeText);
		} else {


			this.updateOnDemandBet = function(bet, updateMainView) {
				var message = "EXPIRY: ",
				remainingTimeText = "";

				var currentTime = new Date().getTime();

				var timeLeft = new Date(bet.expireAt - currentTime);

				var minute = timeLeft.getMinutes(),
					second = timeLeft.getSeconds();

				if(minute>0) {
					message += minute>9?minute:("0"+minute);

					remainingTimeText += minute>9?minute:("0"+minute)+":";

					message += minute>1?" MINS ":" MIN ";
				} else {
					remainingTimeText += "0:";
				}

				if(second>0 || minute>0) {
					message += second>9?second:("0"+second);

					remainingTimeText += second>9?second:("0"+second);

					message += second>1?" SECS ":" SEC ";
				}

				if(currentTime >= bet.expireAt || (second<=0 && minute <=0)) {
					message = "EXPIRED";
					remainingTimeText = "expired";
				}

				
				if(bet.finishText!=undefined) {
					bet.finishText.attr({
						text: message
					});
				}



				if(model.active && updateMainView) {

					mainViewId  = model.getMainViewId();

					$('#' + mainViewId + ' .trading-platform-instrument-time-left').html(" " + remainingTimeText);

				}
			}

			// only update for focused bet and hovered bet
			if(model.focusedBet) {
				this.updateOnDemandBet(model.focusedBet, true);
			}

			if(model.hoveredBet) {
				this.updateOnDemandBet(model.hoveredBet);
			}
		}
	},
	init: function() {
		var marketSimulator = this;
		// iterate through every instrument panel in the UI.

		$('.js-instrument-panel-original').each(function(){
			var instrumentModel = {},
			self = $(this);

			//get seed data from html markup

			var currentTime = new Date().getTime();

			instrumentModel.label = self.data('instrumentLabel');
			instrumentModel.type = self.data('tradingType');
			instrumentModel.durationLabel = self.data('instrumentDuration');
			instrumentModel.durationId = self.data('instrumentDurationId');
			instrumentModel.duration = self.data('instrumentDurationValue');
			instrumentModel.seedRate = self.data('instrumentSeedRate');
			instrumentModel.payoutRate = self.data('instrumentPayoutRate');
			instrumentModel.currentRate = parseFloat(instrumentModel.seedRate).toFixed(marketSimulator.rounding);
			instrumentModel.previousrate = instrumentModel.currentRate;
			instrumentModel.bets = [];
			instrumentModel.uid = self.data('uid');

			// Now let's assume that the open time is 5 minutes ago (round to closest minute), or 14 minute ago when there is 'deadzone' in the url query for testing purpose
			// except for on-demand type, which doesn't have a fixed open time

			if(instrumentModel.type.indexOf('on-demand') < 0) {


				if(highlowApp.expiring()) {
					instrumentModel.openAt = currentTime - 1000*60*13;
				} else {
					instrumentModel.openAt = (Math.round(currentTime / (1000 * 60 * 5))-1) * 1000 * 60 * 5;
				}

				instrumentModel.expireAt = instrumentModel.openAt+instrumentModel.duration;

				if(instrumentModel.duration == 15*60*1000) {
					instrumentModel.deadzone = instrumentModel.expireAt - 2 * 60 * 1000;
				} else if(instrumentModel.duration == 60*60*1000) {
					instrumentModel.deadzone = instrumentModel.expireAt - 5 * 60 * 1000;
				} else if(instrumentModel.duration == 24*60*60*1000) {
					instrumentModel.deadzone = instrumentModel.expireAt - 15 * 60 * 1000;
				}

				
			}


		// Generate past data.


			var startingPointFromNow = (40*60*1000),
			minInterval = 1000,
			maxInterval = 5000;

			if(instrumentModel.duration>15*60*1000) {
				startingPointFromNow = 60*60*1000,
				minInterval = 10000,
				maxInterval = 50000;
			}

			if(instrumentModel.duration>60*60*1000) {
				startingPointFromNow = 4*60*60*1000
				minInterval = 40000,
				maxInterval = 200000;
			}

			instrumentModel.startingPoint = currentTime - startingPointFromNow;
			instrumentModel.absoluteChange = 0;
			instrumentModel.data = [];

			// seed highlow data array with a value


			instrumentModel.data.push({
				x :	instrumentModel.startingPoint,
				y : instrumentModel.seedRate
			});

			// generate mock data from starting from 20 minutes ago
			// assuming updates every 1 - 2 seconds

			for (var i = instrumentModel.startingPoint,j = 1; i < currentTime; i+=highlowApp.randomValue(minInterval, maxInterval), j++) {



				// 50% of going up or down by 0 to 0.003;

				var deviation = highlowApp.randomValue(0,marketSimulator.maxChange,4);



				// if the market has been moving up, there's more chance it's gonna go down this time

				var splitChance = 0.5;

				if(instrumentModel.absoluteChange>0) {
					splitChance+=0.1;
				} else if(instrumentModel.absoluteChange<0) {
					splitChance-=0.1;
				}

				if(instrumentModel.absoluteChange>0.002) {
					splitChance+=0.3;
				} else if(instrumentModel.absoluteChange<-0.002) {
					splitChance-=0.3;
				}

				

				var variation = Math.random() >= splitChance ? deviation : -deviation;

				instrumentModel.absoluteChange += parseFloat(variation);


				// next value calculated from variation deinfed above and previous value

				var point = { 
					x : i ,
					y : instrumentModel.data[j-1]['y'] + variation
				};

				instrumentModel.data.push(point);

				instrumentModel.previousRate = instrumentModel.currentRate;
				instrumentModel.currentRate = point.y;
			}

			if (instrumentModel.type === 'spread') {
				instrumentModel.upperRate = parseFloat(instrumentModel.currentRate + marketSimulator.spread).toFixed(marketSimulator.rounding);
				instrumentModel.lowerRate = parseFloat(instrumentModel.currentRate - marketSimulator.spread).toFixed(marketSimulator.rounding);
			}

			instrumentModel.getMainViewId = function() {
				return instrumentModel.type+"-main-view";
			}

			instrumentModel.updateMainView = function() {
				var model = instrumentModel;
				var mainViewId  = model.getMainViewId();

				$('#'+mainViewId).data(marketSimulator.modelDataName,instrumentModel);

				


				$('#'+mainViewId+" .trading-platform-instrument-duration").html(" " + model.durationLabel);



				$('#'+model.type+"-mode .trading-platform-main-controls-payout-rate").html(model.payoutRate);

				$('#'+mainViewId+" .trading-platform-instrument-title, "+
					"#"+model.type+"-mode .trading-platform-main-controls-instrument-title, "+
					'.trading-platform-invest-popup.'+model.type+' .trading-platform-main-controls-instrument-title').html(" " + model.label);


				$('#'+mainViewId+" .trading-platform-maximum-return").html("$"+parseFloat(model.payoutRate*$('#'+model.type+'-investment-value-input').val()).toFixed(2));

				if(model.active) {


					if(model.dead) {
						$('#' + model.getMainViewId()).addClass('dead');
					} else {
						$('#' + model.getMainViewId()).removeClass('dead');
					}


					var mainViewRateDisplay = $('#' + model.getMainViewId() + ' .current-rate'),
					popupRateDisplay = $('.trading-platform-invest-popup.'+model.type+' .current-rate'),
					sellPopupRateDisplay = $('.trading-platform-sell-popup.'+model.type+' .current-rate');
					
					if(model.type.indexOf('on-demand')<0) {
						$('#'+mainViewId+" .trading-platform-instrument-closing-time").html(" "+ highlowApp.timeToText(model.expireAt));
					} else {
						if(model.focusedBet) {
							$('#'+mainViewId+" .trading-platform-instrument-closing-time").html(" "+ highlowApp.timeToText(model.focusedBet.expireAt));
						}
					}

					if (model.currentRate>model.previousRate) {
						mainViewRateDisplay.removeClass('highlow-low').addClass('highlow-high');
						popupRateDisplay.removeClass('highlow-low').addClass('highlow-high');
						sellPopupRateDisplay.removeClass('highlow-low').addClass('highlow-high');
					} else if(model.currentRate<model.previousRate) {
						mainViewRateDisplay.removeClass('highlow-high').addClass('highlow-low');
						popupRateDisplay.removeClass('highlow-high').addClass('highlow-low');
						sellPopupRateDisplay.removeClass('highlow-high').addClass('highlow-low');
					}

					mainViewRateDisplay.html(" " + parseFloat(model.currentRate).toFixed(marketSimulator.rounding));
					popupRateDisplay.html(" " + parseFloat(model.currentRate).toFixed(marketSimulator.rounding));
					sellPopupRateDisplay.html(" " + parseFloat(model.currentRate).toFixed(marketSimulator.rounding));
				}
			}

			instrumentModel.update = function(){
				var self = instrumentModel;
				marketSimulator.simulate(self);
				if(self.active) {
					self.updateMainView();
				}
				if(instrumentModel.expired) {

					if(instrumentModel.type.indexOf('on-demand') < 0) {
						instrumentModel.openAt = (Math.round(currentTime / (1000 * 60 * 5))-1) * 1000 * 60 * 5;
						instrumentModel.expireAt = instrumentModel.openAt+instrumentModel.duration;
					}
				} 
				setTimeout(self.update,Math.floor(highlowApp.randomValue(marketSimulator.minInterval, marketSimulator.maxInterval)));
			}

			instrumentModel.updateTime = function() {
				var self = instrumentModel;

				marketSimulator.updateRemainingTime(self);

				if(instrumentModel.expired) {
					return;
				} 
				setTimeout(self.updateTime,1000);
			}

			//attach the model to the UI

			$('[data-uid="'+self.data('uid')+'"]').data(marketSimulator.modelDataName,instrumentModel);

			// update closing time to instrument panel

			$('[data-uid="'+self.data('uid')+'"] .closing-at').html(highlowApp.timeToText(instrumentModel.expireAt));

			marketSimulator.instruments.push(instrumentModel);
		});

		marketSimulator.start();
	}
}
;
highlowApp.numberOnly = {
    init: function() {
        $('.number-only').keydown(function (e) {
            // Allow: backspace, delete, tab, escape, enter and .
            if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
                 // Allow: Ctrl+A
                (e.keyCode == 65 && e.ctrlKey === true) || 
                 // Allow: home, end, left, right, down, up
                (e.keyCode >= 35 && e.keyCode <= 40)) {
                     // let it happen, don't do anything
                     return;
            }
            // Ensure that it is a number and stop the keypress
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        });
    }
}
;
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
;
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
;
highlowApp.systemMessages = {
	clearMessageTimeout : {},
	displayMessage: function(type,message) {



		var self = this;

		clearTimeout(self.clearMessageTimeout);

		$('.message-wrapper')
			.removeClass('display')
			.removeClass('fail')
			.removeClass('success')
			.removeClass('alert')
			.removeClass('generic')
			.removeClass('warning');
		setTimeout(function(){

			$('.message-wrapper .message').html(message);
			$('.message-wrapper').addClass(type).addClass('display');	

			self.clearMessageTimeout = setTimeout(function(){
				$('.message-wrapper').removeClass('display');
			},5000);
		},100);
	},
	init: function(){
		var systemMessages = {
			"fail" : [
			"Invalid Username or Password",
			"Investment error. Please select Up or Down",
			"Investment error. Please insert correct investment amount",
			"Sell trade action failed",
			"Add trade action failed",
			"Invalid trade action ID",
			"Trade rejected due to stale rate",
			"Sell Price is invalid"
			],

			"success" : [
			"Sell trade action completed successfully",
			"Success"
			],

			"warning" : [
			"General error occurred, please contact a system administrator",
			"Interval between trades is not enough",
			"Not Enough Money",
			"Investment amount is out of the allowed range",
			"Unable to process request, trade rate unavailable",
			"Min Margin Time to Allow Trade",
			"Exceeded the maximum loss per day allowed",
			"General server error",
			"Your account is currently inactive",
			"Please login",
			"Exceed Maximum Trade Actions",
			"Exceed Max Trade Volume",
			"Exceeded Maximum Trader Exposure"
			]
		},
		$messageTriggers = $('.message-triggers .wrapper');


		for (var type in systemMessages) {
			if (systemMessages.hasOwnProperty(type)) {
				var typeMarkup = $("<div class='message-trigger-type "+type+"'><div class='message-trigger-type-title'>"+type+"</div></div>");
				var typeGroup = systemMessages[type];
				for(var i=0; i< typeGroup.length;i++) {
					var message = typeGroup[i].length<=35?typeGroup[i]:(typeGroup[i].substr(0,34)+'&hellip;');
					typeMarkup.append($("<div class='message-trigger' data-type='"+type+"' data-message='"+typeGroup[i]+"'>"+message+"</div>"));
				}
				$messageTriggers.append(typeMarkup);
			}
		}


		$messageTriggers.on('click','.message-trigger', function(){

			var type= $(this).data('type'),
			message= $(this).data('message');


			$('.message-wrapper')
			.removeClass('display')
			.removeClass('fail')
			.removeClass('success')
			.removeClass('alert')
			.removeClass('generic')
			.removeClass('warning');
			setTimeout(function(){
				$('.demo-message .message').html(message);
				$('.demo-message').addClass(type).addClass('display');	

				setTimeout(function(){
					$('.demo-message').removeClass('display');
				},5000);

			},100);

		});

		$('.message-wrapper .close').click(function(){
			$('.message-wrapper').removeClass('display').removeClass('fail').removeClass('success').removeClass('alert').removeClass('generic').removeClass('warning');
		});

		$('.message-triggers').on('click','.toggle',function(){
			if($('.message-triggers').hasClass('tucked-away')) {
				$('.message-triggers').removeClass('tucked-away');
			} else {
				$('.message-triggers').addClass('tucked-away');
			}
		});
	}
};
;
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
;
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