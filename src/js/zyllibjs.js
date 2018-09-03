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


/** @class zyl.Common
 * Common utils (公共工具).
 *
 * @static
 */
zyl.Common = function () {
	
	return {
		
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
		
		/** Get class name string (取得类名字符串).
		 * 
		 *  @param	{Object}	A object (一个对象).
		 *  @return	{String}	Class name string (类名字符串). 若不是对象则返回 `undefined` .
		 *	@static
		 */
		getClassName: function(obj) {
			if (obj && obj.constructor && obj.constructor.toString()) {
				/*
				* for browsers which have name property in the constructor
				* of the object,such as chrome 
				*/
				if(obj.constructor.name) {
					return obj.constructor.name;
				}
				var str = obj.constructor.toString();
				/*
				* executed if the return of object.constructor.toString() is 
				* "[object objectClass]"
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
