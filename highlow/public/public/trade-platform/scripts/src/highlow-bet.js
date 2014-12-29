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