var point = {};


$(function () {
	if(point.fileDragAndDropIsSupported) {
		$('.file-uploader').removeClass('no-drag-n-drop');
	} else {
		$('.file-uploader').addClass('no-drag-n-drop');
	}

	point.uploadMock.init();
});