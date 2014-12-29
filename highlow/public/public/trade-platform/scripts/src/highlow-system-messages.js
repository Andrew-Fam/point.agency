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