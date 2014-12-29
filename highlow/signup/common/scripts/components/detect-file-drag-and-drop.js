point.fileDragAndDropIsSupported = function () {
	if (!!window.FileReader && Modernizr.draganddrop) {
	  return true;
	} else {
	  return false;
	}
}