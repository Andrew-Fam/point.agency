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