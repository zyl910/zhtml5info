/*! @file zyllibjs.js
 * zyl910's JavaScript library (zyl910的JavaScript库).
 *
 * Support all browsers (支持所有浏览器).
 *
 * Dependencies (依赖):
 *
 * - (none) (不依赖其他JavaScript库)
 * 
 * 
 * @author zhouyuelin
 * @version v1.0
 */


/** @class
 * [namespace] zyl's library (zyl的库).
 * @abstract
 */
zyl = window.zyl || {};

/** @class
 * [namespace] Json related tools (Json相关工具).
 * @abstract
 */
zyl.json = window.zyl.json || {};


// == zyl: zyl's library (zyl的库) ==

/** @class zyl.Common
 * Common utils (公共工具).
 *
 * @static
 */
zyl.Common = function () {

	/** Merge the contents of two or more objects together into the first object.(把两个或者更多的对象合并到第一个当中). Same jQuery.extend .
	 * 
	 *  @param	{Object}	target	An object that will receive the new properties if additional objects are passed in.
	 *  @param	{Object[]}	srclist An object containing additional properties to merge in.
	 *  @param	{Boolean}	deep	If true, the merge becomes recursive (aka. deep copy). Passing false for this argument is not supported. (尚未实现)
	 *	@static @private
	 */
	var m_extend = function(target, srclist, deep) {
		if (null==target) return;
		if (null==srclist) return;
		if (srclist.length<=0) return;
		for (var i = 0; i < srclist.length; ++i) {
			var p = srclist[i];
			if (null==p) continue;
			if (typeof p !== "object") continue;
			// append.
			for (var key in p) {
				var v = p[key];
				target[key] = v;
			}
		}
	};
	
	return {
		
		/** Output log (输出日志).
		 * 
		 *  @param	{*}	msg Log message(日志消息).
		 *	@static
		 */
		log: function(msg) {
		    if (window["console"]) {
		        console.log(msg);
		    }
		},
		
		/** Class inherit (类继承). 即设置好 Child 的原型为 Parent的原型实例，并设置 uber 属性.
		 * 
		 *  @param	{Function}	Child	Subclass (子类).
		 *  @param	{Function}	Parent	Parent class (父类).
		 *	@static
		 */
		inherit: function(Child, Parent) {
			var F = function(){};
			F.prototype = Parent.prototype;
			Child.prototype = new F();
			Child.prototype.constructor = Child;
			Child.uber = Parent.prototype;
		},
		
		/** Merge the contents of two or more objects together into the first object.(把两个或者更多的对象合并到第一个当中). Same jQuery.extend .
		 * 
		 *  @param	{Object}	target	An object that will receive the new properties if additional objects are passed in.
		 *  @param	{Object}	object1 An object containing additional properties to merge in.
		 *	@static
		 */
		extend: function(target, object1) {
			var deep = false;
			var srclist = [];
			var targetflag = false;
			var atarget = null;
			for (var i = 0; i < arguments.length; i++) {
				var p = arguments[i];
				if (0==i && (typeof p == "boolean")) {
					deep = p;
					continue;
				}
				if (!targetflag) {
					targetflag = true;
					atarget = p;
					continue;
				}
				// push.
				srclist.push(p);
			}
			if (!atarget) {
				return;
			}
			m_extend(atarget, srclist, deep);
		},
		
		/** Check is Array (判断是不是数组).
		 * 
		 *  @param	{Object}	obj	A object (一个对象).
		 *  @return	{Boolean}	It is Array (是不是数组).
		 *	@static
		 */
		isArray: function(obj) {
			var rt = false;
			if (null==obj) return rt;
			if (typeof(obj) != "object") return rt;
			if (typeof Array.isArray === "function") {
				rt = Array.isArray(obj);
			} else {
				rt = Object.prototype.toString.call(obj) === '[object Array]';
			}
			return rt;
		},
		
		/** Array indexOf (数组查找).
		 * 
		 *  @param	{Array}	arr Array(数组).
		 *  @param	{*}	searchElement Element to locate in the array (欲搜索的元素).
		 *  @param	{Number}	[fromIndex=0] The index to start the search at (搜索起始位置).
		 *	@static
		 */
		arrayIndexOf: function(arr, searchElement, fromIndex) {
			var rt = -1;
			if (null==arr) return rt;
			if (typeof Array.prototype.indexOf === "function") {
				rt = arr.indexOf(searchElement, fromIndex);
			} else {
				for(var i=(fromIndex||0); i<arr.length; ++i) {
					var p = arr[i];
					if (p===searchElement) {
						rt = i;
						break;
					}
				}
			}
			return rt;
		},
		
		/** Array push array (在数组的末尾追加数组).
		 * 
		 *  @param	{Array}	arr Destination array(目标数组).
		 *  @param	{Array}	src Source array (源数组).
		 *  @return {Array} Return arr.
		 *	@static
		 */
		arrayPushArray: function(arr, src) {
			var rt = arr;
			if (null==arr) return rt;
			if (null==src) return rt;
			for(var i=0; i<src.length; ++i) {
				var p = src[i];
				arr.push(p);
			}
			return rt;
		},
		
		/** Get class name string (取得类名字符串).
		 * 
		 *  @param	{Object}	obj	A object (一个对象).
		 *  @return	{String}	Class name string (类名字符串). 若不是对象则返回 `undefined` .
		 *	@static
		 */
		getClassName: function(obj) {
			if (obj) {
				/*
				* for browsers which have name property in the constructor
				* of the object,such as chrome 
				*/
				if(obj.constructor.name && "Error"!=obj.constructor.name) {
					return obj.constructor.name;
				}
				var str = Object.prototype.toString.call(obj);
				/*
				* executed if the return is "[object objectClass]"
				*/
				var arr = null;
				if(str.charAt(0) == '[')
				{
					arr = str.match(/\[\w+\s*(\w+)\]/);
				} else {
					/*
					* executed if the return of object.constructor.toString() is 
					* "function objectClass () {}"
					* for IE Firefox
					*/
					arr = str.match(/function\s*(\w+)/);
				}
				if (arr && arr.length == 2) {
					return arr[1];
				}
			}
			return undefined; 
		},
		
		/** Get exception string (取得异常字符串). 即取得 `ClassType(name, code/number): message/description` 格式的字符串.
		 * 
		 *  @param	{Error}	e	Error object (错误对象).
		 *  @return	{String}	Exception string (异常字符串). 若不是对象则返回 `undefined` .
		 *	@static
		 */
		exstr: function(e) {
			var rt = undefined;
			if (typeof(e) != "object") return rt;
			if (null==e) return rt;
			var sclass = zyl.Common.getClassName(e);
			var sname = e["name"];
			var ncode = e["code"] || e["number"];
			var smessage = e["message"] || e["description"];
			if (!!sname) {
				if (sname==sclass) sname='';
			}
			if (!smessage) {
				smessage = e.toString();
				if (!!smessage) {
					if (0==smessage.indexOf("[object")) {
						smessage = "";
					} else {
						if (0==smessage.indexOf(sname)) {
							smessage = smessage.substr(sname.length + 1 + 1);
						}
					}
				}
			}
			if (!smessage) {
				smessage = "Unknown";
			}
			// make.
			rt = sclass;
			if (!sname) {
				if (!ncode) {
				} else {
					rt += "(" + ncode + ")";
				}
			} else {
				if (!ncode) {
					rt += "(" + sname + ")";
				} else {
					rt += "(" + sname + ", " + ncode + ")";
				}
			}
			rt += ": " + smessage;
			return rt;
		},
		
		/** Version (版本号). @static @readonly */
		version: 0x100
	};
}();


// == zyl.json: Json tools (Json相关工具) ==

/** @class
 * Data json option (数据Json选项).
 *
 */
zyl.json.DataJsonOption = function(cfg) {
	cfg = cfg || {};
	/** @property {Number} maxdeep	Max deep(最大深度). 0 is default. */
    this.maxdeep = cfg["maxdeep"] || 0;
	/** @property {Boolean} forcecopy	Force copy(强行复制). 即不判断是不是数据Json, 而总是强行复制. */
    this.forcecopy = cfg["forcecopy"] || false;
};

/** @class
 * Data json process status (数据Json处理状态).
 *
 */
zyl.json.DataJsonStatus = function(cfg) {
	cfg = cfg || {};
	/** @property {Object} origin Origin object (起源对象). */
    this.origin = cfg["origin"] || null;
	/** @property {Object[]} stack Deep stack (深度栈). 用于判断深度. */
    this.deepstack = cfg["deepstack"] || [];
	/** @property {Number} countNondata Nondata count (非数据对象的数量). */
    this.countNondata = cfg["countNondata"] || 0;
	/** @property {zyl.json.DataJsonProcessor} processorCaught Caught processor (被捕获处理者). */
    this.processorCaught = cfg["processorCaught"] || null;
	/** @property {Boolean} isstop Is stop (是否中断). */
    this.isstop = cfg["isstop"] || false;
    // -- out --
	/** @property {Boolean} outisdata [out] Is date json (是不是数据Json). */
    this.outisdata = cfg["outisdata"] || false;
	/** @property {Object} outobj [out] Result object (返回对象). */
    this.outobj = cfg["outobj"] || null;
	/** @property {String[]} outfields [out] Field list (字段列表). */
    this.outfields = cfg["outfields"] || [];
	/** @property {Boolean} outenumfield [out] Need enum field (是否需要枚举字段). */
    this.outenumfield = cfg["outenumfield"] || false;
};

/** @class
 * Data json processor rule (数据Json处理者规则).
 *
 * {@link zyl.json.DataJsonUtil#fillByProcessorRule}
 */
zyl.json.DataJsonProcessorRule = function(cfg) {
	cfg = cfg || {};
	/** @property {Function} atype	Type' constructed function(类型的构造函数). */
    this.atype = cfg["atype"] || null;
	/** @property {Boolean} isstop Is stop (是否中断). */
    this.isstop = cfg["isstop"] || true;
	/** @property {Boolean} outisdata [out] Is date json (是不是数据Json). */
    this.outisdata = cfg["outisdata"] || false;
	/** @property {String[]} outfields [out] Field list (字段列表). */
    this.outfields = cfg["outfields"] || [];
	/** @property {Boolean} outenumfield [out] Need enum field (是否需要枚举字段). */
    this.outenumfield = cfg["outenumfield"] || undefined;
	/** @property {Function} callback
	 * Callback. 原型为 function(context, status, cur, rule) .
	 * @return {Function} Callback.
	 * @return {zyl.json.DataJsonContext} return.context Context.
	 * @return {zyl.json.DataJsonStatus} return.status Data json process status (数据Json处理状态).
	 * @return {Object} return.cur Current object (当前对象).
	 * @return {zyl.json.DataJsonProcessorRule} return.rule Rule.
	 */
    this.callback = cfg["callback"] || null;
};

/** @class
 * Data json processor (数据Json处理者).
 * @abstract
 */
zyl.json.DataJsonProcessor = function(cfg) {
	cfg = cfg || {};
};
(function(){
	
	/** Process (处理).
	 *
	 * 判断一下自己是否能处理 cur, 若能则填写 status里的out开头的属性, 并返回true. 若发现它是自己能转换的对象（非Json数据），一般有这几种处理策略:
	 *
	 * - 仅将 outisdata 设为 false 便返回. 因为 outenumfield 还是默认值true, 于是框架会自动枚举字段并填写 outobj.
	 * - 将 outisdata 设为 false, 然后填好 outfields. 随后框架会根据 outfields的字段名来填写 outobj, 再自动枚举字段并填写 outobj.
	 * - 将 outisdata 设为 false, 然后填好 outobj, 并将 outenumfield设为false. 随后框架会直接使用 outobj.
	 * - 将 outisdata 设为 false, 然后填好 outobj, 并将 outenumfield设为false, 还填好 outfields. 随后框架会根据 outfields的字段名来填写 outobj.
	 *
	 * @param	{zyl.json.DataJsonStatus}	status	Data json process status (数据Json处理状态).
	 * @param	{Object}	cur	Current object (当前对象).
	 * @return	{Boolean}	Is caught (是否捕获).
	 * @abstract
	 */
	zyl.json.DataJsonProcessor.prototype.process = function(status, cur){
		zyl.Common.log("zyl.json.DataJsonProcessor.process: " + cur);
		return false;
	};
	
})();

/** @class
 * Normal data json processor (普通数据Json处理者).
 * @extends zyl.json.DataJsonProcessor
 */
zyl.json.NormalDataJsonProcessor = function(cfg) {
	cfg = cfg || {};
};
zyl.Common.inherit(zyl.json.NormalDataJsonProcessor, zyl.json.DataJsonProcessor);
(function(){
	var m_rules = [
		new zyl.json.DataJsonProcessorRule({atype:Error, outfields:"name,code,number,message,description".split(',') })
	];
	
	/** @inheritdoc */
	zyl.json.NormalDataJsonProcessor.prototype.process = function(status, cur){
		//zyl.Common.log("zyl.json.NormalDataJsonProcessor.process: " + cur);
		//var atype = Error;
		//if (cur instanceof atype) {
		//	status.outisdata = false;
		//	zyl.Common.arrayPushArray(status.outfields, "name,code,number,message,description".split(','));
		//	return true;
		//}
		//return false;
		var rule = zyl.json.DataJsonUtil.fillByProcessorRule(null, status, cur, m_rules);
		var rt = null!=rule;
		return rt;
	};
	
})();

/** @class
 * Data json process context (数据Json处理环境).
 *
 * Check Data json (数据Json的判断条件):
 *
 * - 非object（包括Function） 与 null, 会被当做 数据Json.
 * - 当超过最大深度(maxdeep)时, 会被当做 数据Json.
 *
 */
zyl.json.DataJsonContext = function(cfg) {
	cfg = cfg || {};
	/** @property {zyl.json.DataJsonProcessor[]} processors DataJsonProcessor list (数据Json处理者列表). */
    this.processors = cfg["processors"] || [];
	/** @property {zyl.json.DataJsonOption} option Data json option (数据Json选项). */
    this.option = cfg["option"] || null;
	// private.
	/** @property {zyl.json.DataJsonStatus} m_status Data json process status (数据Json处理状态). @private */
	this.m_status = null;
	/** @property {zyl.json.DataJsonOption} m_option Data json option cache (缓存的数据Json选项). @private */
    this.m_option = null;
};
(function(){
	/** @property {zyl.json.DataJsonOption} m_defaultDataJsonOption Default DataJsonOption (默认数据Json选项). @private @static */
	var m_defaultDataJsonOption = new zyl.json.DataJsonOption({
		maxdeep: 20,
		forcecopy: false
	});
	
	/** Init status (初始化状态).
	 * 
	 *  @param	{*}	src	Source (源对象).
	 * @private
	 */
	zyl.json.DataJsonContext.prototype.m_initStatus = function(src){
		this.m_status = new zyl.json.DataJsonStatus({
			origin: src
		});
		this.m_option = new zyl.json.DataJsonOption();
		zyl.Common.extend(this.m_option, m_defaultDataJsonOption, this.option);
	};
	
	/** Check current object is data json object (判断是不是数据Json对象).
	 *
	 * @param	{*}	cur	Current object (当前对象).
	 * @private
	 */
	zyl.json.DataJsonContext.prototype.m_check = function(cur){
		var rt = true;
		if (typeof(src) != "object") return rt;
		if (null==src) return rt;
		if (zyl.Common.isArray(src)) {
			//TODO: check array.
			// array done.
			return rt;
		}
		//TODO: check object.
		return rt;
	};
	
	/** Convert current object to data json object (将当前对象转为数据Json对象).
	 * 
	 * @param	{*}	cur	Current object (当前对象).
	 * @return	{Object}	Return data json object (数据Json对象).
	 * @private
	 */
	zyl.json.DataJsonContext.prototype.m_conv = function(cur){
		var rt = cur;
		if (typeof(cur) != "object") return rt;
		if (null==cur) return rt;
		// deep.
		var maxdeep = this.m_option.maxdeep || m_defaultDataJsonOption.maxdeep;
		if (this.m_status.deepstack.length > maxdeep) {
			return rt;
		}
		var ishad = zyl.Common.arrayIndexOf(this.m_status.deepstack, cur)>=0;	// 检查递归调用.
		if (ishad) {
			return rt;
		}
		this.m_status.deepstack.push(cur);
		try {
			// array.
			if (zyl.Common.isArray(cur)) {
				//var isdataj = true;
				//// check array.
				//if (this.m_option.forcecopy) {
				//	isdataj = false;
				//} else {
				//	isdataj = this.m_check(cur);
				//}
				//// make.
				//if (isdataj) {
				//	rt = cur
				//} else {
				//}
				var countNondataOld = this.m_status.countNondata;
				var lst = [];
				for(var i=0; i<cur.length; ++i) {
					var p = cur[i];
					var q = this.m_conv(p);
					lst.push(q);
				}
				var countNondataDiff = this.m_status.countNondata-countNondataOld;
				if (countNondataDiff>0 || this.m_option.forcecopy) {
					rt = lst;
				}
				// array done.
				return rt;
			}
			// object
			this.m_status.processorCaught = null;
			this.m_status.outisdata = true;
			this.m_status.outobj = {};
			this.m_status.outfields = [];
			this.m_status.outenumfield = true;
			if (null!=this.processors) {
				for(var i=0; i<this.processors.length; ++i) {
					var processor = this.processors[i];
					if (!processor) continue;
					if (typeof(cur) != "object") return rt;
					// process.
					var isCaught = processor.process(this.m_status, cur);
					if (isCaught) {
						if (!this.m_status.processorCaught) {
							this.m_status.processorCaught = processor;
						}
					}
					if (this.m_status.isstop) {
						break;
					}
				}
			}
			// make.
			if (!this.m_status.outisdata) {
				++this.m_status.countNondata;
			}
			var countNondataOld = this.m_status.countNondata;
			var dst = this.m_status.outobj;
			var iskeep = false;	// 可保持原对象.
			if (this.m_status.outenumfield && this.m_status.outfields.length<=0) {
				iskeep = null==this.m_status.processorCaught;
				for (var key in cur) {
					var v = cur[key];
					var v2 = this.m_conv(v);
					dst[key] = v2;
				}
			} else if (this.m_status.outenumfield || this.m_status.outfields.length>0) {
				var fields = {};
				if (this.m_status.outenumfield) {
					for (var key in cur) {
						fields[key] = (fields[key]||0) + 1;
					}
				}
				for(var i=0; i<this.m_status.outfields.length; ++i) {
					var key = this.m_status.outfields[i];
					fields[key] = (fields[key]||0) + 1;
				}
				//for (var key in fields) {
				//	var v = cur[key];
				//	if (typeof(v) == "undefined") continue;
				//	var v2 = this.m_conv(v);
				//	dst[key] = v2;
				//}
				// sort.
				var fieldarr = [];
				for (var key in fields) {
					fieldarr.push(key);
				}
				fieldarr.sort();
				// put.
				for(var i=0; i<fieldarr.length; ++i) {
					var key = fieldarr[i];
					var v = cur[key];
					if (typeof(v) == "undefined") continue;
					var v2 = this.m_conv(v);
					dst[key] = v2;
				}
				if (null!=dst) {
				}
			}
			//done.
			var countNondataDiff = this.m_status.countNondata-countNondataOld;
			var usedst = countNondataDiff>0 || this.m_option.forcecopy ||!iskeep;
			if (usedst) {
				rt = dst;
			} else {
				rt = cur;
			}
		} finally {
			this.m_status.deepstack.pop();
		}
		return rt;
	};

	// == public ==

	/** Check any is data json object (判断是不是数据Json对象).
	 * 
	 *  @param	{*}	src	Source (源对象).
	 *  @return	{Boolean}	Return true/false.
	 */
	zyl.json.DataJsonContext.prototype.isDataJson = function(src){
		var rt = false;
		return rt;
	};

	/** Convert any to data json object (将任意数据转为数据Json对象).
	 * 
	 *  @param	{*}	src	Source (源对象).
	 *  @return	{Object}	Return data json object (数据Json对象).
	 */
	zyl.json.DataJsonContext.prototype.toDataJson = function(src){
		var rt = src;
		if (typeof(src) != "object") {
			//rt = src;
		} else if (null==src) {
			//rt = src;
		} else {
			this.m_initStatus(src);
			rt = this.m_conv(src);
		}
		return rt;
	};

})();

/** @class zyl.json.DataJsonUtil
 * Data json utils (数据Json工具).
 *
 * @static
 */
zyl.json.DataJsonUtil = function () {
	/** @property {zyl.json.DataJsonProcessor[]} m_processors DataJsonProcessor list (数据Json处理者列表). @private @static */
	var m_processors = [];
	
	return {
		
		/** Register data json processor (注册数据Json处理者).
		 * 
		 *  @param	{zyl.json.DataJsonProcessor}	processor	Data json processor (数据Json处理者).
		 *	@static
		 */
		registerProcessor: function(processor) {
			if (null==processor) return;
			if (typeof(processor) != "object") return;
			m_processors.push(processor);
		},
		
		/** Create DataJsonContext (创建DataJsonContext).
		 * 
		 *  @param	{zyl.json.DataJsonOption}	[option=null]	Data json option (数据Json选项).
		 *  @return	{zyl.json.DataJsonContext}	Return DataJsonContext.
		 *	@static
		 */
		createDataJsonContext: function(option) {
			var ctx = new zyl.json.DataJsonContext({
				processors: m_processors,
				option: option
			});
			return ctx;
		},
		
		/** Fill state by processorRule (根据处理者规则填写状态).
		 * 
		 *  @param {zyl.json.DataJsonContext} context Data json context (数据Json环境).
		 *  @param {zyl.json.DataJsonStatus} status Data json process status (数据Json处理状态).
		 *  @param {Object} cur Current object (当前对象).
		 *  @param {zyl.json.DataJsonProcessorRule[]} rules Rule list (规则列表).
		 *  @return	{zyl.json.DataJsonProcessorRule} Rule (生效的规则).
		 *	@static
		 */
		fillByProcessorRule: function(context, status, cur, rules) {
			var rt = null;
			if (null==status) return rt;
			if (status.isstop) return rt;
			if (null==cur) return rt;
			if (null==rules) return rt;
			for(var i=0; i<rules.length; ++i) {
				var rule = rules[i];
				if (null==rule) continue;
				if (typeof rule.atype !== "function") continue;
				if (cur instanceof rule.atype) {
					if (typeof rule.isstop === "boolean") status.isstop=rule.isstop;
					if (typeof rule.outisdata === "boolean") status.outisdata=rule.outisdata;
					if (typeof rule.outenumfield === "boolean") status.outenumfield=rule.outenumfield;
					if (rule.outfields) zyl.Common.arrayPushArray(status.outfields, rule.outfields);
					if (typeof rule.callback === "function") {
						rule.callback(context, status, cur, rule);
					}
					// done.
					rt = rule;
					if (status.isstop) {
						break;
					}
				}
			}
			return rt;
		},
		
		/** Check any is data json object (判断是不是数据Json对象).
		 * 
		 *  @param	{*}	src	Source (源对象).
		 *  @param	{zyl.json.DataJsonOption}	[option=null]	Data json option (数据Json选项).
		 *  @return	{Boolean}	Return true/false.
		 *	@static
		 */
		isDataJson: function(src, option) {
			var rt = false;
			if (typeof(src) != "object") {
				//rt = false;
			} else if (null==src) {
				//rt = false;
			} else {
				var ctx = zyl.json.DataJsonUtil.createDataJsonContext(option);
				rt = ctx.isDataJson(src);
			}
			return rt;
		},
		
		/** Convert any to data json object (将任意数据转为数据Json对象).
		 * 
		 *  @param	{*}	src	Source (源对象).
		 *  @param	{zyl.json.DataJsonOption}	[option=null]	Data json option (数据Json选项).
		 *  @return	{Object}	Return data json object (数据Json对象).
		 *	@static
		 */
		toDataJson: function(src, option) {
			var rt = src;
			if (typeof(src) != "object") {
				//rt = src;
			} else if (null==src) {
				//rt = src;
			} else {
				var ctx = zyl.json.DataJsonUtil.createDataJsonContext(option);
				rt = ctx.toDataJson(src);
			}
			return rt;
		},
		
		/** Convert any to data json string (将任意数据转为数据Json字符串).
		 * 
		 *  @param	{*}	src	Source (源对象).
		 *  @param	{zyl.json.DataJsonOption}	[option=null]	Data json option (数据Json选项).
		 *  @return	{String}	Return string (返回字符串).
		 *	@static
		 */
		strDataJson: function(src, option) {
			var rt = "";
			if (typeof(src) != "object") {
				rt = "" + src;
			} else if (null==src) {
				rt = "" + src;
			} else {
				var json = zyl.json.DataJsonUtil.toDataJson(src, option);
				rt = JSON.stringify(json);
			}
			return rt;
		},
		
		/** Convert any to string (将任意数据转为字符串).
		 * 
		 *  @param	{*}	src	Source (源对象).
		 *  @return	{String}	Return string (返回字符串).
		 *	@static
		 */
		str: function(src) {
			var rt = "";
			if (typeof src == "object") {
				if (null==src) {
					rt = "" + src;
				} else if (src instanceof Error) {
					rt = zyl.Common.exstr(src);
				} else {
					rt = zyl.json.DataJsonUtil.strDataJson(src);
				}
			} else {
				rt = "" + src;
			}
			return rt;
		},
		
		/** Version (版本号). @static @readonly */
		version: 0x100
	};
}();
(function(){
	// init.
	zyl.json.DataJsonUtil.registerProcessor(new zyl.json.NormalDataJsonProcessor());
})();
