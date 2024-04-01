/**
 *
 * (c) Copyright VNexsus 2024
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
(function(window, undefined) {

	var baseurl = document.location.pathname.substring(0, document.location.pathname.lastIndexOf("/")).substring(1) + '/';
	var initialWidth, initialHeight;
	var maximized = false;

	var pdfDoc = null,
		pageNum = 1,
		pageCount = 0,
		pageStart = 1,
		pageRendering = false,
		pageNumPending = null,
		scale = 2,
		canvas = null,
		ctx = null;
	
	var arrImages = [];	
	var arrParsedData = [];
	var htmlPreview = [];
	var nStartFilesCount = 0;
	var mode = null;
	var source = null;
	var cropper = null;
	
	window.Asc.plugin.init = function(text) {
		$(document.body).addClass(window.Asc.plugin.getEditorTheme());
		// get canvas and context to draw iamges
		canvas = document.getElementById('pdf-preview');
		ctx = canvas.getContext('2d');
		// set buttons actions
		document.getElementById('prev').addEventListener('click', onPrevPage);
		document.getElementById('next').addEventListener('click', onNextPage);
		document.getElementById('crop').addEventListener('click', onPageCrop);
		document.getElementById('recognize').addEventListener('click', onRecognize);
		document.getElementById('recognizeall').addEventListener('click', onRecognizeAll);
		document.getElementById('addtext').addEventListener('click', onAddText);
		document.getElementById('selectfile').addEventListener('click', window.selectFile);
		document.getElementById('upload-container').addEventListener('click', window.selectFile);
		document.getElementById('uploadfile').addEventListener('change', window.fileSelected);
		document.addEventListener('selectionchange', wordOptions);
		// set pdf.js worker path
		pdfjsLib.GlobalWorkerOptions.workerSrc = 'vendor/pdf.js/pdf.worker.min.mjs';
		// enable window resizing
		window.Asc.plugin.resizeWindow(900, 675, 800, 600, 1200, 1000);
		$(window.parent.document).find(".asc-window.modal").find(".header").on('dblclick', window.toggleSize);
		// create observer for recognized text changes
		var observer = new MutationObserver(function(e) {
			e.forEach(function(el){
				$(el.target.parentNode).removeClass(function(i,c){return (c.match (/wc-\d+/g) || []).join(' ')});
				$(el.target.parentNode).attr('data-confidence', 100);
				$('span.options').remove();
			});
		});
		observer.observe(document.querySelector('#text-preview'), { characterData: true, attributes: false, childList: false, subtree: true });
	};

	function onPageCrop() {
		if(cropper){
			cropper.destroy();
			cropper=null;
			$('#recognize span').text('Распознать лист');
			$('#crop').removeClass('active'), updatePageControls();
		}
		else {
			// set up cropper
			cropper = new Cropper(document.getElementById('pdf-preview'), {
				autoCrop: false,
				modal: false,
				viewMode: 1,
				zoomOnWheel: false,
				ready() {
					this.cropper.crop();
				},
			});
			$('#crop').addClass('active');
			$('#recognize span').text('Распознать выделение');
			$('#recognizeall').prop('disabled', true);
		}
	}

	function renderPage(num) {
		pageRendering = true;
		if(cropper)
			//cropper.destroy(), cropper=null, $('#crop').removeClass('active');
			onPageCrop()
		if(source == 'pdf'){
			pageNum = num
			updatePageControls();
			// Using promise to fetch the page
			pdfDoc.getPage(num).then(function(page) {
				var viewport = page.getViewport({ scale: scale, });
				// Support HiDPI-screens.
				var outputScale = window.devicePixelRatio || 1;

				canvas.width = Math.floor(viewport.width * outputScale);
				canvas.height = Math.floor(viewport.height * outputScale);
				canvas.style.width = Math.floor(viewport.width) + "px";
				canvas.style.height =  Math.floor(viewport.height) + "px";

				var transform = outputScale !== 1
					? [outputScale, 0, 0, outputScale, 0, 0]
					: null;

				// Render PDF page into canvas context
				var renderContext = {
					canvasContext: ctx,
					transform: transform,
					viewport: viewport,
				};
				var renderTask = page.render(renderContext);

				// Wait for rendering to finish
				renderTask.promise.then(function () {
					pageRendering = false;
					if(mode == 'full')
						Recognize();
					if (pageNumPending !== null) {
						// New page rendering is pending
						renderPage(pageNumPending);
						pageNumPending = null;
					}
					if(cropper)
						cropper.reset();
				});
			});

		}
		else {
			pageNum = num;
			updatePageControls();
			var image = new Image();
			var url = URL.createObjectURL(new Blob([arrImages[num-1].buffer], { type: 'image/'+ source }));
			image.src = url;
			image.onload = function(){
				pageRendering = false;
				ctx.clearRect(0, 0, canvas.width, canvas.height)
				canvas.width = image.width;
				canvas.height = image.height;
				ctx.drawImage(image, 0, 0);
				URL.revokeObjectURL(url);
				if(mode == 'full')
					Recognize();
			}
		}
	}

	function queueRenderPage(num) {
		if (pageRendering) {
			pageNumPending = num;
		} else {
			renderPage(num);
		}
	}

	function onPrevPage() {
		if (pageNum <= 1) {
			return;
		}
		hideHighlighter();
		removeSelection();
		queueRenderPage(pageNum-1);
	}

	function onNextPage() {
		if (pageNum >= pageCount) {
			return;
		}
		hideHighlighter();
		removeSelection();
		queueRenderPage(pageNum+1);
	}
  
	function onRecognize() {
		if(htmlPreview.length > 0){
			parent.Common.UI.confirm({
				title: "Предупреждение о несохраненных данных",
				msg: "Данные предыдущего распознавания не сохранены.\n Вы действительно хотите продолжить?",
				buttons: [
					{ caption: "Да", value: "yes" },
					{ caption: "Нет", value: "no", primary: true }
				],
				callback: function(value){
					if(value == 'yes') {
						htmlPreview = [];
						onRecognize();
					}
				}
			});
			return;
		}
		mode = 'single';
		pageStart = pageNum;
		arrParsedData.length = 0;
		htmlPreview = [];
		hideHighlighter();
		removeSelection();
		insertStub(true);
		$("#selectfile").prop('disabled', true);
		$("#prev").prop('disabled', true);
		$("#next").prop('disabled', true);
		$("#addtext").prop('disabled', true);
		$('#ocr-tools').css('display', 'none');
		$('#ocr-status').css('display', 'block');
		$('#ocr_num').text(1);
		$('#ocr_count').text(1);
		setProgress(0);
		if(cropper)
			cropper.crop();
		Recognize();
	}

	function onRecognizeAll() {
		if(htmlPreview.length > 0){
			parent.Common.UI.confirm({
				title: "Предупреждение о несохраненных данных",
				msg: "Данные предыдущего распознавания не сохранены.\n Вы действительно хотите продолжить?",
				buttons: [
					{ caption: "Да", value: "yes" },
					{ caption: "Нет", value: "no", primary: true }
				],
				callback: function(value){
					if(value == 'yes') {
						htmlPreview = [];
						onRecognizeAll();
					}
				}
			});
			return;
		}
		mode = 'full';
		pageStart = pageNum;
		arrParsedData.length = 0;
		htmlPreview = [];
		hideHighlighter();
		removeSelection();
		if(pageNum != 1) {
			renderPage(1);
		}
		else
			Recognize();
		insertStub(true);
		$("#selectfile").prop('disabled', true);
		$("#prev").prop('disabled', true);
		$("#next").prop('disabled', true);
		$("#addtext").prop('disabled', true);
		$('#ocr-tools').css('display', 'none');
		$('#ocr-status').css('display', 'block');
		setProgress(0);
	}

	
	function Recognize() {
		var image;
		image = canvas.toDataURL('image/png');
		
		if(mode == 'full') {
			$('#ocr_num').text(pageNum);
			$('#ocr_count').text(pageCount);
		}
		
		var _recognize = function(){
			let sLang = 'rus+eng';
			let worker = null;
			let result = null;
			
			Tesseract.createWorker({
				corePath: './vendor/tesseract/',
				workerPath: './vendor/tesseract/worker.min.js',
				langPath: './vendor/tesseract/4.0.0',
				logger: (progress) => {   
					if(progress && progress.status === "recognizing text"){
						var progress = ((progress.progress + (mode=='full'?(pageNum-1):0))/(mode=='full'?pageCount:1)*100)>>0;
						setProgress(progress);
					}
				}
			}).then((oWorker) => {
				worker = oWorker;
			}).then(() => {
				return worker.loadLanguage(sLang);
			}).then(() => {
				return worker.initialize(sLang);
			}).then(() => {
				return worker.setParameters({
					tessedit_pageseg_mode: Tesseract.PSM.AUTO,
				});
				// cropper.getData([rounded - true|false])
			}).then(() => {
				let options = {};
				if(cropper){
					let rect = cropper.getData(true);
					options.rectangle = {
						left: rect.x,
						top: rect.y,
						width: rect.width,
						height: rect.height
					};
				}
				return worker.recognize(image, options);
			}).then((oResult) => {
				result = oResult;
				htmlPreview.push(generateHTML(result.data));
				// add page break
				if(mode == 'full' && pageNum < pageCount)
					htmlPreview.push($('<div class="page-break" contenteditable="false"></div>'));
				arrParsedData.push(result);
				if(mode == 'full' && source == 'pdf' && pageNum < pageCount){
					renderPage(pageNum+1);
				}
				else if(mode == 'full' && 'png,jpg,jpeg,gif,image'.indexOf(source) != -1 && pageNum < pageCount) {
					renderPage(pageNum+1);
				}
				else{
					mode = 'done';
					removeStub();
					$('#text-preview').append($('<div contenteditable="true"/>').append(htmlPreview));
					if(pageNum != pageStart)
						renderPage(pageStart);
					else
						updatePageControls();
					$("#selectfile").prop('disabled', false);
					$("#addtext").prop('disabled', false);
					$('#ocr-tools').css('display', 'flex');
					$('#ocr-status').css('display', 'none');
				}
			}).then((oResult) => {
				worker.terminate();
			});

		};
		_recognize();
	}


	function generateHTML(data) {
		let result = $('<div spellcheck="false"/>');
		let blocks = data.blocks;
		for(let n = 0; n < blocks.length; n++) {
			let block = blocks[n]; 
			let paragraphs = block.paragraphs;
			for(let p = 0; p < paragraphs.length; p++) {
				let para = paragraphs[p];
				let lines = para.lines;
				let nPixIndent = 0;
				let paragraph = $('<p/>');
				
				let oFirstLine, oFirstWord;
				oFirstLine = lines[0];
				if(oFirstLine) {
					oFirstWord = oFirstLine.words[0];
					if(oFirstWord) {
						nPixIndent = oFirstWord.bbox.x0 - block.bbox.x0;
						if(Math.abs(nPixIndent) > 5) {
							let nIndent = (nPixIndent / 72) * 12.9 + 0.5 >> 0;
							paragraph.css('text-indent', nIndent + 'mm');
						}
					}
				}
				
				let oLastWord = null;
				let sLastSpanText = "";
				for(let l = 0; l < lines.length; l++) {
					let line = lines[l];
					let words = line.words;
					for(let w = 0; w < words.length; w++) {
						let word = words[w];
						
						let wordspan = $('<span/>');
						wordspan.addClass('word');
						if(word.confidence <= 60)
							wordspan.addClass('wc-'+ (word.confidence/10>>0)*10);
						wordspan.attr('data-confidence', Math.round(word.confidence,2));
						wordspan.css('direction', word.direction == 'LEFT_TO_RIGHT' ? 'ltr' : 'rtl');
						// TODO: process font size recongized
						wordspan.css('font-size', '11pt');
						// TODO: process fonts recognized
						//if(word.font_name.length > 0)
						//	wordspan.css('font-family', word.font_name);
						wordspan.css('font-weight', word.is_bold ? 'bold' : 'normal');
						wordspan.css('font-style', word.is_italic ? 'italic' : 'normal');
						wordspan.css('font-variant', word.is_smallcaps ? 'small-caps' : 'normal');
						wordspan.css('text-decoration', word.is_underlined ? 'underline' : 'none');
						wordspan.prop('lang', word.language.substring(0,2));
						wordspan.attr('data-box', JSON.stringify(word.bbox));
						wordspan.attr('data-page', pageNum);
						wordspan.text(word.text);
						wordspan.on('click', showHighlighter);
						
						paragraph.append(wordspan);
						paragraph.append($('<span> </span>'));
					}
					paragraph.append($('<br/>'));
				}
				result.append(paragraph)
			}
		}
		
		return result;
	}
	
	function showHighlighter(e){
		hideHighlighter();
		if(e.target && $(e.target) && $(e.target).attr('data-box')) {
			var c = JSON.parse($(e.target).attr('data-box'));
			var p = parseInt($(e.target).attr('data-page'));
			if(c && p && p == pageNum){
				var ratio = $('#pdf-preview').width() / $('#pdf-preview').attr('width');
				var highlighter = $('<div class="highlighter"/>');
				highlighter.css('left', c.x0 * ratio + 5);
				highlighter.css('top', c.y0 * ratio + 5);
				highlighter.css('width', (c.x1 - c.x0) * ratio);
				highlighter.css('height', (c.y1 - c.y0) * ratio);
				highlighter.css('display', 'block');
				$('.preview-wrapper').append(highlighter);
				highlighter[0].scrollIntoView({behavior: 'smooth', block: 'nearest'});
			}
			else if (c && p && p !=pageNum)
				renderPage(p)
		}
	}
	
	function hideHighlighter() {
		$('#preview-container').find('.highlighter').remove();
	}
	
	function removeSelection() {
		$('span.word').removeClass('active');
		$('span.options').remove();
	}

	function wordOptions(e) {
		let grab = document.getSelection();
		let node = null;
		if(grab.baseNode){
			node = grab.baseNode.parentNode;
		}
		else if(grab.anchorNode)
			node = grab.anchorNode.parentElement
		else
			return;
			
		if(node.nodeName == 'SPAN' && node.className.indexOf('word') != -1) {
			if(!$(node).hasClass('active')){
				hideHighlighter();
				$('span.word').removeClass('active');
				$('span.options').remove();
				$(node).addClass('active');
				showHighlighter({target: node});
				if($(node).attr('data-confidence') != '' && parseInt($(node).attr('data-confidence')) < 60) {
					let options = $('<span class="options" title="Принять без изменений (достоверность - '+ parseFloat($(node).attr('data-confidence')) +'%)"/>');
					options.css('top', node.offsetTop > 23 ? node.offsetTop - 23 : node.offsetTop + $(node).height() + 3);
					options.css('left', node.offsetLeft + ($(node).width()-20)/2);
					options.on('click',function(e){ 
						$(node).removeClass(function(i,c){return (c.match (/wc-\d+/g) || []).join(' ')});
						$(node).attr('data-confidence', 100);
						$(this).remove(); 
					});
					$('#text-preview').append(options);
				}
			}
		}
		else {
			hideHighlighter();
			$('span.word').removeClass('active');
			$('span.options').remove();
		}
		
	}

	function onAddText() {
		window.Asc.plugin.executeMethod("PasteHtml", [$('#text-preview').html()]);
		window.Asc.plugin.button();
	}
 
	function setProgress(progress) {
		$('.progressvalue').text(progress +'%');
		$('.progressbar').css('width', progress + '%');
	}

	window.selectFile = function() {
		if(window["AscDesktopEditor"])
			window["AscDesktopEditor"]["OpenFilenameDialog"]("Документ PDF или изображения (*.pdf *.png *.gif *.jpg *.jpeg)", true, function(_file){
				if (Array.isArray(_file)){
					if(_file.length != 0){
						source = _file[0].substring(_file[0].lastIndexOf(".")+1).toLowerCase()
						arrImages = [];
						$('#pdf-preview').css('display','none');
						insertStub();
						if(source == 'pdf')
							// only first file is selected
							window.AscDesktopEditor.loadLocalFile(_file[0], window.fileSelected);
						else{
							// ALL files are selected
							var count = 0;
							for(var i = 0; i < _file.length; i++)
								if('png,gif,jpg,jpeg'.indexOf(_file[i].substring(_file[i].lastIndexOf(".")+1).toLowerCase()) != -1) {
									window.AscDesktopEditor.loadLocalFile(_file[i], window.fileSelected);
									count++;
								}
							pageNum = null;
							pageCount = count;
						}
					}
				}
			});		
		else
			document.getElementById("uploadfile").click();
	}
	
	window.fileSelected = function(data) {
		if(data instanceof Event) {
			var arrFiles = data.target.files;
			$('#pdf-preview').css('display','none');
			insertStub();
			if(arrFiles.length && arrFiles.length > 0) {
				if(arrFiles[0].type && arrFiles[0].type.indexOf('image')!=-1) {
					// handle image
					source = 'image';
					arrImages = [];
					for(var i = 0 ; i < arrFiles.length; i++) {
						var oFileReader = new FileReader();
						oFileReader.onloadend = function(e) {
							arrImages.push(new Uint8Array(e.target.result));
							pageCount = arrImages.length;
							renderPage(1);
							if(cropper)
								onPageCrop();
							$('#upload-container').css('display','none');
							$('#pdf-preview').css('display','block');
							htmlPreview = [];
						}
						oFileReader.readAsArrayBuffer(arrFiles[i]);
					}
				}
				else if(arrFiles[0].type && arrFiles[0].type == 'application/pdf'){
					// handle pdf
					source = 'pdf';
					var oFileReader = new FileReader();
					oFileReader.onloadend = function(e) {
						var loadingTask = pdfjsLib.getDocument(e.target.result);
						loadingTask.promise.then(function(doc){
							pdfDoc = doc;
							pageNum = 1;
							pageCount = pdfDoc.numPages;
							updatePageControls();
							// Initial/first page rendering
							renderPage(pageNum);
							if(cropper)
								onPageCrop();
							$('#upload-container').css('display','none');
							$('#pdf-preview').css('display','block');
							htmlPreview = [];
						});
					}
					oFileReader.readAsArrayBuffer(arrFiles[0]);
				}
			}
		}
		else if(data && data.length > 0){
			if(source == 'pdf') {
				// handle pdf
				var loadingTask = pdfjsLib.getDocument(data);
				loadingTask.promise.then(function(doc){
					pdfDoc = doc;
					pageNum = 1;
					pageCount = pdfDoc.numPages;
					updatePageControls();
					// Initial/first page rendering
					renderPage(pageNum);
					if(cropper)
						onPageCrop();
					$('#upload-container').css('display','none');
					$('#pdf-preview').css('display','block');
					htmlPreview = [];
				});
			}
			else {
				// handle image
				arrImages.push(data);
				renderPage(1);
				if(cropper)
					onPageCrop();
				$('#upload-container').css('display','none');
				$('#pdf-preview').css('display','block');
				htmlPreview = [];
			}
		}
	}
	
	function updatePageControls() {
		hideHighlighter();
		if($('.word.active').length > 0)
			$('.word.active').click();
		$('#page_num').text(pageNum);
		$('#page_count').text(pageCount);
		if(pageCount >= 1){
			$("#crop").prop('disabled', false);
			$("#recognize").prop('disabled', false);
		}
		else {
			$("#crop").prop('disabled', false);
			$("#recognize").prop('disabled', false);
		}
		if(pageCount >= 2)
			$("#recognizeall").prop('disabled', false);
		else
			$("#recognizeall").prop('disabled', true);
		if(mode != 'full' & mode != 'single'){
			$("#prev").prop('disabled', pageNum == 1 ? true : false);
			$("#next").prop('disabled', pageNum == pageCount ? true : false);
		}
		if(cropper)
			$('#recognizeall').prop('disabled', true);
	}
	
	function insertStub(ocr) {
		if(!ocr)
			$('#text-preview').html(`<div class="text-stub"><div>Здесь появится текст после распознавания</div></div>`);
		else
			$('#text-preview').html(`<div class="text-stub"><div>
			<div>
				<svg id="processing" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
					<ellipse rx="59.219694" ry="58.522991" transform="matrix(1.488521 0 0 1.488524 150.088597 145.27299)" fill="none" stroke-width="8"></ellipse>
					<g transform="matrix(1.305514 0 0 1.170899-13.059057 1.223754)" paint-order="fill markers stroke">
						<line x1="-25.429633" y1="-25.081282" x2="25.429633" y2="25.081282" transform="translate(203.994426 198.560149)" fill="none" stroke-width="15" stroke-linecap="round" stroke-miterlimit="6"></line>
					</g>
					<g id="process-indicator" transform="translate(150.088601,145.272991)">
						<path d="M133.27915,89.17794c25.01057,0,45.28565,20.27505,45.28565,45.2856s-20.27507,45.2856-45.28565,45.2856-45.28565-20.27505-45.28565-45.2856" transform="scale(1.488521,1.488524) translate(-133.27915,-134.46354)" fill="none" stroke-width="5"></path>
					</g>
				</svg>
			</div>
			<div>Подождите, производится распознавание</div></div></div>`);
	}

	function removeStub() {
		$('#text-preview').empty();
	}
 
	// service functions
	
 	window.Asc.plugin.button = function(id) {
		this.executeCommand("close", "");
	};

	window.Asc.plugin.onThemeChanged = function(theme){
		window.Asc.plugin.onThemeChangedBase(theme);
		$(document.body).removeClass("theme-dark theme-light").addClass(window.Asc.plugin.getEditorTheme());
	}

	window.Asc.plugin.getEditorTheme = function(){
		if(window.localStorage.getItem("ui-theme-id")){
			var match = window.localStorage.getItem("ui-theme-id").match(/\S+\-(\S+)/);
			if(match.length==2)
				return "theme-" + match[1];
		}
		return "theme-light";
	}
	
	window.toggleSize = function (){
		if(!maximized){
			initialWidth = window.innerWidth;
			initialHeight = window.innerHeight;
			window.Asc.plugin.resizeWindow(parent.window.innerWidth, parent.window.innerHeight, 800, 600, 0, 0);
		}
		else{
			window.Asc.plugin.resizeWindow(initialWidth, initialHeight, 800, 600, 0, 0);
		}
		maximized=!maximized;
	}

	window.onresize = function() {
		$('.cropper-container').width($('#pdf-preview').width()+'px');
		$('.cropper-container').height($('#pdf-preview').height()+'px');
		if($('.word.active').length > 0)
			$('.word.active')[0].click();
	}


})(window, undefined);
