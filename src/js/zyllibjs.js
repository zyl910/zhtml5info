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
		
		/** Version (版本号). @static @readonly */
		version: 0x100
	};
}();
