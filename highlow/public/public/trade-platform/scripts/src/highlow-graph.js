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
					pattern: 'common/images/deadzone-bg.png',
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
				symbol : "url(common/images/graph-marker.png)",
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
						high = renderer.image('common/images/graph-up-spread-hover.png',highX,highY, 96, 27);
					} else {
						high = renderer.image('common/images/graph-up-hover.png',highX,highY, 27, 27);
					}
				} else {
					if(type.indexOf("spread")>=0) {
						high = renderer.image('common/images/graph-up-spread.png',highX,highY, 96, 27);
					} else {
						high = renderer.image('common/images/graph-up.png',highX,highY, 27, 27);
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
						$('#'+highButtonId).attr('href','common/images/graph-up-spread-hover.png');
					} else {
						$('#'+highButtonId).attr('href','common/images/graph-up-hover.png');
					}
				});

				high.on('mouseleave', function () {
					symbols.highBetButtonHover = false;
					if(type.indexOf("spread")>=0) {
						$('#'+highButtonId).attr('href','common/images/graph-up-spread.png');
					} else {
						$('#'+highButtonId).attr('href','common/images/graph-up.png');
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
						low = renderer.image('common/images/graph-down-spread-hover.png',lowX,lowY, 96, 27);
					} else {
						low = renderer.image('common/images/graph-down-hover.png',lowX,lowY, 27, 27);
					}
				} else {
					if(type.indexOf("spread")>=0) {
						low = renderer.image('common/images/graph-down-spread.png',lowX,lowY, 96, 27);
					} else {
						low = renderer.image('common/images/graph-down.png',lowX,lowY, 27, 27);
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
						$('#'+lowButtonId).attr('href','common/images/graph-down-spread-hover.png');
					} else {
						$('#'+lowButtonId).attr('href','common/images/graph-down-hover.png');
					}
				});

				low.on('mouseleave', function () {
					symbols.lowBetButtonHover = false;
					if(type.indexOf("spread")>=0) {
						$('#'+lowButtonId).attr('href','common/images/graph-down-spread.png');
					} else {
						$('#'+lowButtonId).attr('href','common/images/graph-down.png');
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
						$('#'+highButtonId).attr('href','common/images/graph-up-spread-hover.png');
					} else {
						$('#'+highButtonId).attr('href','common/images/graph-up-hover.png');
					}
				});

				highRate.on('mouseleave', function () {
					symbols.highBetButtonHover = false;
					if(type.indexOf("spread")>=0) {
						$('#'+highButtonId).attr('href','common/images/graph-up-spread.png');
					} else {
						$('#'+highButtonId).attr('href','common/images/graph-up.png');
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
						$('#'+lowButtonId).attr('href','common/images/graph-down-spread-hover.png');
					} else {
						$('#'+lowButtonId).attr('href','common/images/graph-down-hover.png');
					}
				});

				lowRate.on('mouseleave', function () {
					symbols.lowBetButtonHover = false;
					if(type.indexOf("spread")>=0) {
						$('#'+lowButtonId).attr('href','common/images/graph-down-spread.png');
					} else {
						$('#'+lowButtonId).attr('href','common/images/graph-down.png');
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
				var img = renderer.image('common/images/high-lose.png',highX,highY,21,28);

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
				var img = renderer.image('common/images/low-lose.png',lowX,lowY,21,28);

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