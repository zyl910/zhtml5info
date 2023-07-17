
/** @enum {Number}
 * 导出类型. 枚举类.
 */
var ExportFormat = {
	FORMAT_JSON: 0,
	FORMAT_TAB: 1,
	FORMAT_COMMA: 2,
	FORMAT_MARKDOWN: 3
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

/** @class BenchmarkDataRow
 * Benchmark data - Row (基准测试信息-行).
 */
function BenchmarkDataRow(config) {
	config = config || {};
	/** @property {String} 标题. */
	this.title = config.title || "";
	/** @property {String[]} 字段值列表. */
	this.fields = config.fields || [];
}

/** @class BenchmarkGroupDataClass
 * Benchmark group data - Class (基准测试分组信息-类).
 */
function BenchmarkGroupDataClass(config) {
	config = config || {};
	/** @property {String} 标题. */
	this.title = config.title || "";
	/** @property {BenchmarkDataRow[]} 行列表. */
	this.list = config.list || [];
}

/** @class BenchmarkGroupDataPlatform
 * Benchmark group data - Platform (基准测试分组信息-平台).
 */
function BenchmarkGroupDataPlatform(config) {
	config = config || {};
	/** @property {String} 标题. */
	this.title = config.title || "";
	/** @property {BenchmarkDataPlatform} 原始数据. */
	this.raw = config.raw || null;
	/** @property {String[]} 字段名列表. */
	this.fieldNames = config.fieldNames || [];
	/** @property {BenchmarkGroupDataClass[]} 类列表. */
	this.list = config.list || [];
}

/** @class BenchmarkGroupData
 * Benchmark group data (基准测试分组信息).
 */
function BenchmarkGroupData(config) {
	config = config || {};
	/** @property {String} 标题. */
	this.title = config.title || "";
	/** @property {BenchmarkGroupDataPlatform[]} 平台列表. */
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

/** Find by title.
 *
 * @param {Object[]}	arr	Source array.
 * @param {String[]}	title	The title.
 * @param {Object}	def Default value.
 * @return {Object}	Return found object, else is def.
 */
function findByTitle(arr, title, def) {
	var i;
	var p;
	for(i=0; i<arr.length; ++i) {
		p = arr[i];
		if (!p) continue;
		if (title == p.title) {
			return p;
		}
	}
	return def;
}

/** Make repeat string.
 *
 * @param {String}	src	Source string.
 * @param {Object}	count The count.
 * @return {String}	 returns a new string which contains the specified number of copies of the string.
 */
function repeatString(src, count) {
	if (count<=0) return "";
	return src.repeat(count);
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
		CLASS: 4
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
	var n, newLevel, lineLen;
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
			var ch = line.charAt(0);
			if (ParseStatus.CODE_BEGIN > parseStatus) {
				if (ch == POUND_SIGN) {
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
			} else {
				var isClass = false;
				lineLen = line.length;
				if ('[' == ch) {
					if (']' == line.charAt(lineLen-1)) {
						isClass = true;
					}
				}
				if (isClass) {
					if (parseStatus != ParseStatus.CLASS) {
						//
					}
					parseStatus = ParseStatus.CLASS;
					src = line.substring(1, lineLen-1).trim();
					dataClass = new BenchmarkDataClass();
					dataClass.titleFull = src;
					n = src.indexOf('(');
					if (n>0) {
						src = src.substring(0, n).trim();
					}
					dataClass.title = src;
					dataDotNet.list.push(dataClass);
				} else if (ParseStatus.CLASS == parseStatus) {
					var isRecord = false;
					if (line.length>0) {
						isRecord = true;
						if (isRecord && '#'==ch) isRecord=false;
						if (isRecord && '-'==ch) isRecord=false;
						if (isRecord && 0==line.indexOf("NAME")) isRecord=false;
						if (isRecord && 0==line.indexOf("Check-")) isRecord=false;
					}
					if (isRecord) {
						var parts = line.split("\t");
						if (null!=parts && parts.length>=2) {
							while(parts.length<4) {
								parts.push("");
							}
							dataRecord = new BenchmarkDataRecord();
							dataRecord.name = parts[0];
							dataRecord.us = parts[1];
							dataRecord.mops = parts[2];
							dataRecord.scale = parts[3];
							dataClass.list.push(dataRecord);
						}
					} // isRecord.
				} // isClass
			} // ParseStatus.CODE_BEGIN > parseStatus
		} // 0==n
	} // for(i=0; i<lines.length; ++i)
	return benchmarkData;
}

/** Benchmark - Group - Platform.
 *
 * @param {BenchmarkDataPlatform}	benchmarkDataPlatform	The BenchmarkDataPlatform data.
 * @param {Boolean}	fillRaw	Is fill `raw` field.
 * @return {BenchmarkGroupDataPlatform}	Return benchmark group data.
 */
function benchmarkGroup_Platform(benchmarkDataPlatform, fillRaw) {
	if (null==benchmarkDataPlatform) throw new Error("The benchmarkDataPlatform is null!");
	var i, j, k;
	var dataDotNet;
	var dataClass;
	var dataGroupClass;
	var dataRecord = null;
	var dataRow = null;
	var dataPlatform = new BenchmarkGroupDataPlatform();
	dataPlatform.title = benchmarkDataPlatform.title;
	if (fillRaw) {
		dataPlatform.raw = benchmarkDataPlatform;
	}
	// Make fieldNames.
	var dataDotNetLast = null;
	dataPlatform.fieldNames = [];
	for(i=0; i<benchmarkDataPlatform.list.length; ++i) {
		dataDotNet = benchmarkDataPlatform.list[i];
		if (null==dataDotNet) throw new Error("Dotnet[" + i + "] is null!");
		dataDotNetLast = dataDotNet;
		dataPlatform.fieldNames.push(dataDotNet.title);
	}
	// Make class list.
	if (null==dataDotNetLast) return dataPlatform;
	var fieldNamesCount = dataPlatform.fieldNames.length;
	for(i=0; i<dataDotNetLast.list.length; ++i) {
		dataClass = dataDotNetLast.list[i];
		if (null==dataClass) throw new Error("Class[" + i + "] of last Dotnet is null!");
		dataGroupClass = new BenchmarkGroupDataClass();
		dataGroupClass.title = dataClass.title;
		for(j=0; j<dataClass.list.length; ++j) {
			dataRecord = dataClass.list[j];
			if (null==dataClass) throw new Error("`Class[" + i + "].list[" + j + "]` is null!");
			dataRow = new BenchmarkDataRow();
			dataRow.title = dataRecord.name;
			while(dataRow.fields.length<fieldNamesCount) {
				dataRow.fields.push("");
			}
			dataGroupClass.list.push(dataRow);
		}
		dataPlatform.list.push(dataGroupClass);
	}
	// Fill data.
	for(i=0; i<benchmarkDataPlatform.list.length; ++i) {
		dataDotNet = benchmarkDataPlatform.list[i];
		for(j=0; j<dataDotNet.list.length; ++j) {
			dataClass = dataDotNet.list[j];
			dataGroupClass = findByTitle(dataPlatform.list, dataClass.title, null);
			if (null!=dataGroupClass) {
				for(k=0; k<dataClass.list.length; ++k) {
					dataRecord = dataClass.list[k];
					dataRow = findByTitle(dataGroupClass.list, dataRecord.name, null);
					if (null!=dataRow) {
						var v = dataRecord.mops;
						dataRow.fields[i] = v;
					}
				} // for(k=0; k<dataClass.list.length; ++k)
			}
		} // for(j=0; j<dataDotNet.list.length; ++j)
	} // for(i=0; i<benchmarkDataPlatform.list.length; ++i)
	return dataPlatform;
}

/** Benchmark - Group.
 *
 * @param {BenchmarkData}	benchmarkData	The benchmark data.
 * @return {BenchmarkGroupData}	Return benchmark group data.
 */
function benchmarkGroup(benchmarkData) {
	if (null==benchmarkData) throw new Error("The benchmarkData is null!");
	var fillRaw = false;
	var i;
	var benchmarkGroupData = new BenchmarkGroupData();
	benchmarkGroupData.title = benchmarkData.title;
	for(i=0; i<benchmarkData.list.length; ++i) {
		var benchmarkDataPlatform = benchmarkData.list[i];
		if (null==benchmarkDataPlatform) continue;
		var dataPlatform = benchmarkGroup_Platform(benchmarkDataPlatform, fillRaw);
		if (null==dataPlatform) continue;
		benchmarkGroupData.list.push(dataPlatform);
	}
	return benchmarkGroupData;
}

/** Benchmark - Format group - Separated.
 *
 * @param {BenchmarkGroupData}	benchmarkGroupData	The benchmark group data.
 * @param {Number}	exportFormat	The exportFormat. e.g. ExportFormat.FORMAT_TAB.
 * @return {String}	Return destination string.
 */
function benchmarkGroupFormat_Separated(benchmarkGroupData, exportFormat) {
	var rt;
	var rtList = [];
	var separatedChar = "\t";
	if (ExportFormat.FORMAT_COMMA == exportFormat) separatedChar = ",";
	var dataPlatform;
	var dataClass;
	var dataRow;
	var fieldNames;
	var line;
	var i, j, k, m;
	for(i=0; i<benchmarkGroupData.list.length; ++i) {
		dataPlatform = benchmarkGroupData.list[i];
		fieldNames = dataPlatform.fieldNames;
		rtList.push("# " + dataPlatform.title);
		// Header.
		line = "Class" + separatedChar + "Name";
		for(j=0; j<fieldNames.length; ++j) {
			var fieldName = fieldNames[j];
			line += separatedChar + fieldName;
		}
		rtList.push(line);
		// Row.
		for(j=0; j<dataPlatform.list.length; ++j) {
			dataClass = dataPlatform.list[j];
			for(k=0; k<dataClass.list.length; ++k) {
				dataRow = dataClass.list[k];
				line = dataClass.title + separatedChar + dataRow.title;
				for(m=0; m<fieldNames.length; ++m) {
					var v = dataRow.fields[m];
					line += separatedChar + v;
				}
				rtList.push(line);
			}
		} // for(j=0; j<dataPlatform.list.length; ++j)
		rtList.push("");
	} // for(i=0; i<benchmarkGroupData.list.length; ++i)
	rt = rtList.join("\n");
	return rt;
}

/** Benchmark - Format group - Markdown.
 *
 * @param {BenchmarkGroupData}	benchmarkGroupData	The benchmark group data.
 * @param {Number}	exportFormat	The exportFormat. e.g. ExportFormat.FORMAT_TAB.
 * @return {String}	Return destination string.
 */
function benchmarkGroupFormat_Markdown(benchmarkGroupData, exportFormat) {
	var rt;
	var rtList = [];
	var itemCommons = ["Class", "Name"];
	var itemCountCommons = itemCommons.length;
	var itemRow = new Array(itemCountCommons);
	var dataPlatform;
	var dataClass;
	var dataRow;
	var fieldNames;
	var fieldName;
	var itemCount; // Class, Name, fieldNames[0]...
	var itemWidths;
	var itemWidth;
	var line, line2;
	var i, j, k, m;
	var n;
	var v;
	for(i=0; i<benchmarkGroupData.list.length; ++i) {
		dataPlatform = benchmarkGroupData.list[i];
		fieldNames = dataPlatform.fieldNames;
		rtList.push("### " + dataPlatform.title);
		// Fill itemWidths.
		itemCount = itemCountCommons + fieldNames.length;
		itemWidths = new Array(itemCount);
		for(j=0; j<itemCommons.length; ++j) {
			fieldName = itemCommons[j];
			itemWidths[j] = fieldName.length;
		}
		for(j=0; j<fieldNames.length; ++j) {
			fieldName = fieldNames[j];
			itemWidths[itemCountCommons + j] = fieldName.length;
		}
		for(j=0; j<dataPlatform.list.length; ++j) {
			dataClass = dataPlatform.list[j];
			n = dataClass.title.length;
			if (itemWidths[0]<n) itemWidths[0]=n;
			for(k=0; k<dataClass.list.length; ++k) {
				dataRow = dataClass.list[k];
				n = dataRow.title.length;
				if (itemWidths[1]<n) itemWidths[1]=n;
				for(m=0; m<fieldNames.length; ++m) {
					v = dataRow.fields[m];
					n = v.length;
					if (itemWidths[itemCountCommons+m]<n) itemWidths[itemCountCommons+m]=n;
				}
			}
		} // for(j=0; j<dataPlatform.list.length; ++j)
		// Header.
		line = "|";
		line2 = "|";
		for(j=0; j<itemCommons.length; ++j) {
			fieldName = itemCommons[j];
			itemWidth = itemWidths[j];
			line += " " + fieldName + repeatString(" ", itemWidth-fieldName.length) + " |";
			line2 += " :" + repeatString("-", itemWidth-1) + " |";
		}
		for(j=0; j<fieldNames.length; ++j) {
			fieldName = fieldNames[j];
			itemWidth = itemWidths[itemCountCommons+j];
			line += " " + repeatString(" ", itemWidth-fieldName.length) + fieldName + " |";
			line2 += " " + repeatString("-", itemWidth-1) + ": |";
		}
		rtList.push(line);
		rtList.push(line2);
		// Row.
		for(j=0; j<dataPlatform.list.length; ++j) {
			dataClass = dataPlatform.list[j];
			itemRow[0] = dataClass.title;
			for(k=0; k<dataClass.list.length; ++k) {
				dataRow = dataClass.list[k];
				itemRow[1] = dataRow.title;
				line = "|";
				for(m=0; m<itemRow.length; ++m) {
					v = itemRow[m];
					itemWidth = itemWidths[m];
					line += " " + v + repeatString(" ", itemWidth-v.length) + " |";
				}
				for(m=0; m<fieldNames.length; ++m) {
					v = dataRow.fields[m];
					itemWidth = itemWidths[itemCountCommons+m];
					line += " " + repeatString(" ", itemWidth-v.length) + v + " |";
				}
				rtList.push(line);
			}
		} // for(j=0; j<dataPlatform.list.length; ++j)
		rtList.push("");
	} // for(i=0; i<benchmarkGroupData.list.length; ++i)
	rt = rtList.join("\n");
	return rt;
}

/** Benchmark - Format group.
 *
 * @param {BenchmarkGroupData}	benchmarkGroupData	The benchmark group data.
 * @param {Number}	exportFormat	The exportFormat. e.g. ExportFormat.FORMAT_TAB.
 * @return {String}	Return destination string.
 */
function benchmarkGroupFormat(benchmarkGroupData, exportFormat) {
	var rt;
	switch(exportFormat) {
		case ExportFormat.FORMAT_TAB:
		case ExportFormat.FORMAT_COMMA:
			rt = benchmarkGroupFormat_Separated(benchmarkGroupData, exportFormat);
			break;
		case ExportFormat.FORMAT_MARKDOWN:
			rt = benchmarkGroupFormat_Markdown(benchmarkGroupData, exportFormat);
			break;
		default:
			rt = JSON.stringify(benchmarkGroupData);
	}
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
	var rt = benchmarkGroupFormat(benchmarkGroupData, m_exportFormat);
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
