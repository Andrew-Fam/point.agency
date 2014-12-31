point.uploadMock = {};

point.uploadMock.init = function () {
	$('.file-uploader.demo').hide();

	var defaultView = $('.file-uploader.default');
	var uploadingView = $('.file-uploader#uploading');
	var progressBar = $('.file-uploader#uploading .progress-bar');
	var successView = $('.file-uploader#success');
	var failedView = $('.file-uploader#failed');
	var tryAgainWithFiles = $('.file-uploader#try-again-with-files');
	var hoverWithFile = $('#hover-with-file');
	var succeeded = false;


	var switchViewTo = function(view) {
		$('.file-uploader.demo').hide();
		view.show();
	}

	var uploading = function (callback) {
		progressBar.css({
			width : '0%'
		});
		progressBar.animate({
			width : '40%'
		},1500,function () {
			setTimeout(function(){
				progressBar.animate({
					width: '70%'
				}, 700, function () {
					setTimeout(function(){
						progressBar.animate({
							width: '100%'
						},500,function(){
							callback();
						});
					},500);
				});
			},700);
		});
	}

	var tryAgain = function () {
		if(succeeded) {
			switchViewTo(tryAgainWithFiles);
		} else {
			switchViewTo(defaultView);
		}
	}

	var upload = function (){

		switchViewTo(uploadingView);

		uploading(function(){
			if(Math.random()<0.49) {
				// failed
				switchViewTo(failedView);
			} else {
				//success
				succeeded = true;
				switchViewTo(successView);
			}
		});
	};


	function handleFileSelect(evt) {

		console.log("DROP!");
		evt.stopPropagation();
		evt.preventDefault();


	    var files = evt.originalEvent.dataTransfer.files; // FileList object.

	    // files is a FileList of File objects. List some properties.
	    var output = [];
	    for (var i = 0, f; f = files[i]; i++) {
	    	output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
	    		f.size, ' bytes, last modified: ',
	    		f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
	    		'</li>');
	    }
	    upload();
	}

	function handleDragOver(evt) {
		evt.stopPropagation();
		evt.preventDefault();
	    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
	    console.log("DRAG!");
	    switchViewTo(hoverWithFile);
	}

	function handleDragLeave(evt) {
		evt.stopPropagation();
		evt.preventDefault();
		console.log("DRAG LEAVE!");
		switchViewTo(defaultView);
	}

	

	defaultView.show();


	

  	// Quick test (trigger by simply clicking the drop area)



	// defaultView.on('click','.upload-link',upload);

	// tryAgainWithFiles.on('click','.upload-link',upload);

	// successView.on('click','.upload-link',upload);

	// failedView.click(tryAgain);

	// Proper test (trigger by drag and drop gesture handling)


	function dropzoneAddedFile(file) {
		console.log(file);
		var preview = $(file.previewElement);
		var target = preview.closest('.dropzone');
		var filename = $(preview.find('.dz-filename span'));
		var progress = $(preview.find('.dz-progress'));
		var progressBar = $(progress.find('.dz-upload'));

		if(file.name.length > 21) {
			filename.html(file.name.substring(0, 10)+"&hellip;"+file.name.substring(file.name.length-11,file.name.length));
		}

		progress.addClass('active progress');
		progressBar.addClass('progress-bar');
		progress.parent().prepend(progress);

		target.removeClass('dragenter').removeClass('success');
		target.addClass('addedfile');
		console.log('Added file to dropzone');
	}

	function dropzoneDragenter(event) {
		var target = $(event.target);
		
		target.addClass('dragenter')
		console.log('Drag enter dropzone');
	}

	function dropzoneDragleave(event) {
		var target = $(event.target);

		target.removeClass('dragenter');
		console.log('Drag leave dropzone');
	}

	function dropzoneSuccess(file) {
		var target = $(file.previewElement).closest('.dropzone');




		target.removeClass('addedfile');
		target.addClass('success');


		var text = $(target.find('.upload-instruction'));

		setTimeout(function(){
			text.html('Uploaded file(s):');
		},1500);


		console.log("Success");
	}

	function dropzoneFailed(file) {
		var target = $(file.previewElement).closest('.dropzone');
		target.removeClass('addedfile').removeClass('default');
		target.addClass('failed');
		console.log("Some files had failed");
	}

	Dropzone.options.photoIdDropzone = {
		init: function() {

			var failed = false;

			this.on("addedfile", function(file) {
					if (this.getUploadingFiles().length > 1 || this.getQueuedFiles().length >= 1 ) {
						$('.addedfile-view .upload-instruction').html("Uploading your files");
					} else {
						$('.addedfile-view .upload-instruction').html("Uploading your file");
					}
					dropzoneAddedFile(file);
				}
			);

			this.on("dragenter", dropzoneDragenter);
			this.on("dragleave", dropzoneDragleave);
			this.on("error", function() {
				failed = true;
			})

			this.on("complete", function (file) {
		      if (this.getUploadingFiles().length === 0 && this.getQueuedFiles().length === 0) {
		       	if(failed) {
		       		dropzoneFailed(file);
		       	} else {
		       		dropzoneSuccess(file);
		       	}
		      }
		    });

			//this.on("sending", dropzoneSending);
		},
		previewsContainer: '#photo-id-dropzone .preview-wrapper',
		clickable: '#photo-id-dropzone .upload-link',
		addRemoveLinks: true,
		dictRemoveFile: '(delete)',
		dictCancelUpload: '(cancel)',
		dictCancelUploadConfirmation: 'Are you sure you want to cancel this file?',
		fallback : function () {
			$('#photo-id-dropzone').addClass('not-supported');
		}
	};

	Dropzone.options.secondIdDropzone = {
		init: function() {

			var failed = false;

			this.on("addedfile", function(file) {
					if (this.getUploadingFiles().length > 1 || this.getQueuedFiles().length >= 1 ) {
						$('.addedfile-view .upload-instruction').html("Uploading your files");
					} else {
						$('.addedfile-view .upload-instruction').html("Uploading your file");
					}
					dropzoneAddedFile(file);
				}
			);

			this.on("dragenter", dropzoneDragenter);
			this.on("dragleave", dropzoneDragleave);
			this.on("error", function() {
				failed = true;
			})

			this.on("complete", function (file) {
		      if (this.getUploadingFiles().length === 0 && this.getQueuedFiles().length === 0) {
		       	if(failed) {
		       		dropzoneFailed(file);
		       	} else {
		       		dropzoneSuccess(file);
		       	}
		      }
		    });

			//this.on("sending", dropzoneSending);
		},
		previewsContainer: '#second-id-dropzone .preview-wrapper',
		clickable: '#second-id-dropzone .upload-link',
		addRemoveLinks: true,
		dictRemoveFile: '(delete)',
		dictCancelUpload: '(cancel)',
		dictCancelUploadConfirmation: 'Are you sure you want to cancel this file?',
		fallback : function () {
			$('#second-id-dropzone').addClass('not-supported');
		}
	};

}