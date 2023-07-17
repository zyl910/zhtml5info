
/** @enum {Number}
 * 导出类型. 枚举类.
 */
var ExportFormat = {
	FORMAT_JSON: 0,
	FORMAT_TAB: 1,
	FORMAT_MARKDOWN: 2
};


const clipboardObj = navigator.clipboard;
var m_exportFormat = ExportFormat.FORMAT_TAB;

/** Load config
 */
function loadConfig() {
	try {
		m_exportFormat = parseInt(document.getElementById('cboExportFormat').value) || ExportFormat.FORMAT_JSON;
	} catch(ex) {
		console.log("Run loadConfig fail!", ex);
	}
}

/** Clear source textbox.
 */
function clearSource() {
	const txtS = document.getElementById('txtS');
	txtS.value = "";
}

/** Clipboard - Copy destination textbox.
 */
function clipboardCopyDestination() {
	const txtD = document.getElementById('txtD');
	// copy.
	if (!clipboardObj) {
		txtS.select();
		document.execCommand('copy');
		// do.
		if (!!callback) callback();
	} else {
		var text = txtD.value;
		clipboardObj.writeText(text).then(function(res){
		  console.log(res);
		}, function(ex){
		  console.log("Call writeText fail!", ex);
		});
	}
}

/** Clipboard - Paste and run.
 *
 * @param {Function}	callback	On check callback. Prototype: `function()` .
 */
function pasteAndRun(callback) {
	const txtS = document.getElementById('txtS');
	//const txtD = document.getElementById('txtD');
	// paste.
	if (!clipboardObj) {
		txtS.value = "";
		txtS.select();
		document.execCommand('paste');
		// do.
		if (!!callback) callback();
	} else {
		clipboardObj.readText().then(function(text){
		  //console.log(text);
		  txtS.value = text;
			// do.
			if (!!callback) callback();
		}, function(ex){
		  console.log("Call readText fail!", ex);
		});
	}
}


/** Benchmark - Parse.
 *
 * @param {String[]}	lines	Source lines.
 * @return {BenchmarkData}	Return benchmark data.
 */
function benchmarkParse(lines) {
	return {test:"TEST!"};
}

/** Benchmark - Group.
 *
 * @param {BenchmarkData}	benchmarkData	The benchmark data.
 * @return {BenchmarkGroupData}	Return benchmark group data.
 */
function benchmarkGroup(benchmarkData) {
	return benchmarkData;
}

/** Benchmark - Fromat group.
 *
 * @param {BenchmarkGroupData}	benchmarkGroupData	The benchmark group data.
 * @param {Number}	exportFormat	The exportFormat. e.g. ExportFormat.FORMAT_TAB.
 * @return {String}	Return destination string.
 */
function benchmarkGroupFromat(benchmarkGroupData, exportFormat) {
	var rt = JSON.stringify(benchmarkGroupData);
	return rt;
}


function doGroupPaste() {
	pasteAndRun(doGroup);
}

/** do Group.
 */
function doGroup() {
	const txtS = document.getElementById('txtS');
	const txtD = document.getElementById('txtD');
	var i;
	try {
		loadConfig();
		// do.
		var lines = txtS.value.split("\n");
		//var lines2 = doGroup_Core(lines);
		//var dst = lines2.join("\n");
		var dst = doGroup_Core(lines);
		txtD.value = dst;
	} catch(ex) {
		console.log("Run AddParameter fail!", ex);
		txtD.value = ex;
	}
}

/** Do Group - Core.
 *
 * @param {String[]}	lines	Source lines.
 * @return {String}	Return destination string.
 */
function doGroup_Core(lines) {
	var benchmarkData = benchmarkParse(lines);
	var benchmarkGroupData = benchmarkGroup(benchmarkData);
	var rt = benchmarkGroupFromat(benchmarkGroupData, m_exportFormat);
	return rt;
}

/** 初始化. */
function init() {
	// compatibility.
	if (!window.URL) {
		window.URL = window.webkitURL || window.mozURL || window.msURL;
	}
}
init();
