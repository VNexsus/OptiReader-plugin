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
		scale = 1.75,
		canvas = null,
		ctx = null;
	
	var arrImages = [];	
	var arrParsedData = [];
	var nStartFilesCount = 0;
	var mode = null;
	var source = null;
	
	window.Asc.plugin.init = function(text) {
		$(document.body).addClass(window.Asc.plugin.getEditorTheme());
		// get canvas and context to draw iamges
		canvas = document.getElementById('pdf-preview');
		ctx = canvas.getContext('2d');
		// set buttons actions
		document.getElementById('prev').addEventListener('click', onPrevPage);
		document.getElementById('next').addEventListener('click', onNextPage);
		document.getElementById('recognize').addEventListener('click', onRecognize);
		document.getElementById('recognizeall').addEventListener('click', onRecognizeAll);
		document.getElementById('addtext').addEventListener('click', onAddText);
		document.getElementById('selectfile').addEventListener('click', window.selectFile);
		document.getElementById('upload-container').addEventListener('click', window.selectFile);
		document.getElementById('uploadfile').addEventListener('change', window.fileSelected);
		
		// set pdf.js worker path
		pdfjsLib.GlobalWorkerOptions.workerSrc = './vendor/pdf.js/pdf.worker.mjs';
		// enable window resizing
		window.Asc.plugin.resizeWindow(900, 675, 800, 600, 1200, 1000);
		$(window.parent.document).find(".asc-window.modal").find(".header").on('dblclick', window.toggleSize);
	};

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


	function renderPage(num) {
		pageRendering = true;
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
		queueRenderPage(pageNum-1);
	}

	function onNextPage() {
		if (pageNum >= pageCount) {
			return;
		}
		queueRenderPage(pageNum+1);
	}
  
	function onRecognize() {
		mode = 'single';
		pageStart = pageNum;
		arrParsedData.length = 0;
		insertStub();
		$("#selectfile").prop('disabled', true);
		$("#prev").prop('disabled', true);
		$("#next").prop('disabled', true);
		$("#addtext").prop('disabled', true);
		$('#ocr-tools').css('display', 'none');
		$('#ocr-status').css('display', 'block');
		$('#ocr_num').text(1);
		$('#ocr_count').text(1);
		setProgress(0);
		Recognize();
	}

	function onRecognizeAll() {
		mode = 'full';
		pageStart = pageNum;
		arrParsedData.length = 0;
		if(pageNum != 1) {
			renderPage(1);
		}
		else
			Recognize();
		insertStub();
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
			}).then(() => {
				return worker.recognize(image);
			}).then((oResult) => {
				result = oResult;
				removeStub();
				$('#text-preview').append($(generateHTMLByData(result.data))[0]);
				// add page break
				if(mode == 'full' && pageNum < pageCount)
					$('#text-preview').append($('<div class="page-break"></div>'));
				arrParsedData.push(result);
				if(mode == 'full' && source == 'pdf' && pageNum < pageCount){
					renderPage(pageNum+1);
				}
				else if(mode == 'full' && 'png,jpg,jpeg,gif,image'.indexOf(source) != -1 && pageNum < pageCount) {
					renderPage(pageNum+1);
				}
				else{
					mode = 'done';
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

	function generateHTMLByData(oData) {
		let sResult = "<div>";
		function commitSpan(sLastSpanText, oLastWord) {
			if(sLastSpanText.length > 0 && oLastWord) {
				let sStyle = "";
				if(oLastWord.font_name && oLastWord.font_name.length > 0) {
					sStyle += ("font-family:" + oLastWord.font_name + ";");
				}
				//if(oLastWord.font_size) {
				//}
				
				sStyle += ("font-size:" + 11 + "pt;");
				if(oLastWord.is_bold) {
					sStyle += ("font-weight:bold;");
				}
				if(oLastWord.is_italic) {
					sStyle += ("font-style:italic;");
				}
				if(oLastWord.is_smallcaps) {
					sStyle += ("font-variant:small-caps;");
				}
				if(oLastWord.is_underlined) {
					sStyle += ("text-decoration:underline;");
				}
				sResult += "<span lang=\"" + oLastWord.language +"\" style=\"" + sStyle + "\">" + sLastSpanText + "</span>";
			}
		}
		
		let aBlocks = oData.blocks;
		for(let nBlock = 0; nBlock < aBlocks.length; ++nBlock) {
			let oBlock = aBlocks[nBlock]; 
			let aDataPar = oBlock.paragraphs;
			for(let nPar = 0; nPar < aDataPar.length; ++nPar) {
				let oDataPar = aDataPar[nPar];
				let aLines = oDataPar.lines;
				let nPixIndent = 0;
				
				let oFirstLine, oFirstWord;
				oFirstLine = aLines[0];
				if(oFirstLine) {
					oFirstWord = oFirstLine.words[0];
					if(oFirstWord) {
						nPixIndent = oFirstWord.bbox.x0 - oBlock.bbox.x0;
					}
				}
				if(Math.abs(nPixIndent) > 5) {
					let nIndent = (nPixIndent / 72) * 25.4 + 0.5 >> 0;
					sResult += "<p style=\"text-indent:" + nIndent + "mm;\">";
				}
				else {
					sResult += "<p>";
				}
				
				let oLastWord = null;
				let sLastSpanText = "";
				for(let nLine = 0; nLine < aLines.length; ++nLine) {
					let oLine = aLines[nLine];
					let aWords = oLine.words;
					for(let nWrd = 0; nWrd < aWords.length; ++nWrd) {
						let oWord = aWords[nWrd];
						if(!oLastWord || 
							oWord.font_name !== oLastWord.font_name ||
							//Math.abs(oWord.font_size - oLastWord.font_size) > 4 ||
							oWord.is_bold !== oLastWord.is_bold ||
							oWord.is_italic !== oLastWord.is_italic ||
							oWord.is_smallcaps !== oLastWord.is_smallcaps ||
							oWord.is_underlined !== oLastWord.is_underlined ||
							oWord.language !== oLastWord.language) {
							commitSpan(sLastSpanText + " ", oLastWord);
							sLastSpanText = "";
						}
						if(sLastSpanText.length > 0) {
							sLastSpanText += " ";
						}
						if(nLine > 0 && nWrd === 0) {
							//sLastSpanText += "<br/>";
						}
						sLastSpanText += oWord.text;
						oLastWord = oWord;
					}
				}
				
				commitSpan(sLastSpanText, oLastWord);
				sResult += "</p>";
			}
		}
		sResult += "</div>";
		return sResult;
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
							$('#upload-container').css('display','none');
							$('#pdf-preview').css('display','inline-block');
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
							$('#upload-container').css('display','none');
							$('#pdf-preview').css('display','inline-block');
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
					$('#upload-container').css('display','none');
					$('#pdf-preview').css('display','inline-block');
				});
			}
			else {
				// handle image
				arrImages.push(data);
				renderPage(1);
				$('#upload-container').css('display','none');
				$('#pdf-preview').css('display','inline-block');
			}
		}
	}
	
	function updatePageControls() {
		$('#page_num').text(pageNum);
		$('#page_count').text(pageCount);
		if(pageCount >= 1)
			$("#recognize").prop('disabled', false);
		else
			$("#recognize").prop('disabled', false);
		if(pageCount >= 2)
			$("#recognizeall").prop('disabled', false);
		else
			$("#recognizeall").prop('disabled', true);
		if(mode != 'full' & mode != 'single'){
			$("#prev").prop('disabled', pageNum == 1 ? true : false);
			$("#next").prop('disabled', pageNum == pageCount ? true : false);
		}
	}
	
	function insertStub() {
		$('#text-preview').html('<div class="text-stub"><div>Здесь появится текст после распознавания</div></div>');
	}

	function removeStub() {
		$('#text-preview .text-stub').remove();
	}
 
 
})(window, undefined);
