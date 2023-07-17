
/** @enum {Number}
 * 导出类型. 枚举类.
 */
var ExportFormat = {
	FORMAT_JSON: 0,
	FORMAT_TAB: 1,
	FORMAT_MARKDOWN: 2
};


/** @class BenchmarkDataRecord
 * Benchmark data - Record (基准测试信息-记录).
 */
function BenchmarkDataRecord(config) {
	config = config || {};
	/** @property {String} 名称. */
	this.name = config.name || "";
	/** @property {String} 微秒us. */
	this.us = config.us || "";
	/** @property {String} 兆每秒 (Mega/second). */
	this.mops = config.mops || "";
	/** @property {String} 倍数. */
	this.scale = config.scale || "";
}

/** @class BenchmarkDataClass
 * Benchmark data - Class (基准测试信息-类).
 */
function BenchmarkDataClass(config) {
	config = config || {};
	/** @property {String} 标题. */
	this.title = config.title || "";
	/** @property {String} 完整标题. */
	this.titleFull = config.titleFull || "";
	/** @property {BenchmarkDataRecord[]} 记录列表. */
	this.list = config.list || [];
}

/** @class BenchmarkDataDotNet
 * Benchmark data - DOTNET Version (基准测试信息-DOTNET 版本).
 */
function BenchmarkDataDotNet(config) {
	config = config || {};
	/** @property {String} 标题. */
	this.title = config.title || "";
	/** @property {BenchmarkDataClass[]} 类列表. */
	this.list = config.list || [];
}

/** @class BenchmarkDataPlatform
 * Benchmark data - Platform (基准测试信息-平台).
 */
function BenchmarkDataPlatform(config) {
	config = config || {};
	/** @property {String} 标题. */
	this.title = config.title || "";
	/** @property {String} 2级标题. */
	this.titleLv2 = config.titleLv2 || "";
	/** @property {String} 3级标题. */
	this.titleLv3 = config.titleLv3 || "";
	/** @property {String} 4级标题. */
	this.titleLv4 = config.titleLv4 || "";
	/** @property {BenchmarkDataDotNet[]} DOTNET 版本列表. */
	this.list = config.list || [];
}

/** @class BenchmarkData
 * Benchmark data (基准测试信息).
 */
function BenchmarkData(config) {
	config = config || {};
	/** @property {String} 标题. */
	this.title = config.title || "";
	/** @property {BenchmarkDataPlatform[]} 平台列表. */
	this.list = config.list || [];
}

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

/** Make title..
 *
 * @param {String[]}	titleArray	Title array.
 * @param {Number}	levelBegin	Level begin.
 * @param {Number}	levelEnd	Level end.
 * @return {String}	Return title.
 */
function makeTitle(titleArray, levelBegin, levelEnd) {
	var title = "";
	var i;
	var src;
	if (levelBegin<1) levelBegin=1;
	if (levelEnd>titleArray.length) levelEnd=titleArray.length;
	for(i=levelBegin; i<=levelEnd; ++i) {
		src = titleArray[i-1];
		if (!title) {
			title = src;
		} else {
			title += " - " + src;
		}
	}
	return title;
}

/** Benchmark - Parse.
 *
 * @param {String[]}	lines	Source lines.
 * @return {BenchmarkData}	Return benchmark data.
 */
function benchmarkParse(lines) {
	var SYMBOL_CODE_AREA = "```";
	var POUND_SIGN = '#';
	var ParseStatus = {
		INIT: 0,
		TITLE: 1,
		CODE_END: 2,
		CODE_BEGIN: 3,
		CLASS: 4,
		RECORD: 5
	};
	var parseStatus = ParseStatus.INIT;
	var titleArray = []; // Item `x` is title `x+1`.
	var titleLevel = 0;
	var benchmarkData = new BenchmarkData();
	var dataPlatform = null;
	var dataDotNet = null;
	var dataClass = null;
	var dataRecord = null;
	var line, src;
	var n, newLevel;
	var i, j;
	for(i=0; i<lines.length; ++i) {
		line = lines[i];
		if (""==line || line.length<=0) continue;
		line = line.trim();
		if (""==line || line.length<=0) continue;
		n = line.indexOf(SYMBOL_CODE_AREA);
		if (0==n) {
			if (ParseStatus.CODE_BEGIN > parseStatus) {
				parseStatus = ParseStatus.CODE_BEGIN;
				dataClass = null;
				if (null==dataPlatform) {
					dataPlatform = new BenchmarkDataPlatform();
					if (titleLevel>=2) {
						dataPlatform.title = makeTitle(titleArray, 2, titleLevel-1);
						dataPlatform.titleLv2 = titleArray[2-1];
					}
					if (titleLevel>=3) {
						dataPlatform.titleLv3 = titleArray[3-1];
					}
					if (titleLevel>=4) {
						dataPlatform.titleLv4 = titleArray[4-1];
					}
					benchmarkData.list.push(dataPlatform);
				}
				if (null==dataDotNet) {
					dataDotNet = new BenchmarkDataDotNet();
					if (titleLevel>0) {
						dataDotNet.title = titleArray[titleLevel-1];
					}
					dataPlatform.list.push(dataDotNet);
				}
			} else {
				parseStatus = ParseStatus.CODE_END;
			}
		} else {
			if (ParseStatus.CODE_BEGIN > parseStatus) {
				if (line.charAt(0) == POUND_SIGN) {
					parseStatus = ParseStatus.TITLE;
					newLevel = 0;
					for(j=0; j<line.length; ++j) {
						if (line.charAt(j) == POUND_SIGN) {
							++newLevel;
							if (titleArray.length<newLevel) {
								titleArray.push("");
							}
						}
					}
					src = line.substring(newLevel).trim();
					titleLevel = newLevel;
					titleArray[titleLevel-1] = src;
					if (1==titleLevel && src.length>0) {
						if (!benchmarkData.title) {
							benchmarkData.title = src;
						}
					}
					if (null!=dataDotNet) {
						dataDotNet = null;
					}
					if (null!=dataPlatform && titleLevel<=3) {
						dataPlatform = null;
					}
				}
			} else if (ParseStatus.CODE_BEGIN == parseStatus) {
			} else if (ParseStatus.CLASS == parseStatus) {
			} else if (ParseStatus.RECORD == parseStatus) {
			}
		}
	}
	return benchmarkData;
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
