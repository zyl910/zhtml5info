﻿/*! @file zyllibjs.media.js
 * zyllibjs media library (媒体库).
 *
 * Support all browsers (支持所有浏览器).
 *
 * Dependencies (依赖):
 *
 * - zyllibjs.js
 * 
 * 
 * @author zhouyuelin
 * @version v1.0
 */


// == zyl.json: Json tools (Json相关工具) ==

/** @class
 * Media data json processor (媒体数据Json处理者).
 * @extends zyl.json.DataJsonProcessor
 */
zyl.json.MediaDataJsonProcessor = function(cfg) {
	cfg = cfg || {};
};
zyl.Common.inherit(zyl.json.MediaDataJsonProcessor, zyl.json.DataJsonProcessor);
(function(){
	var m_rules = [
		new zyl.json.DataJsonProcessorRule({atype:MediaStream, outfields:"ended,id".split(','), callback: function(context, status, cur, rule){
			var agetTracks = cur.getTracks();
			status.outobj["getTracks"] = context.m_conv(agetTracks);
		} }),
		new zyl.json.DataJsonProcessorRule({atype:MediaStreamTrack, outfields:"enabled,id,kind,label,muted,readonly,readyState,remote".split(',') })
	];
	
	/** @inheritdoc */
	zyl.json.MediaDataJsonProcessor.prototype.process = function(context, status, cur){
		var rule = zyl.json.DataJsonUtil.fillByProcessorRule(context, status, cur, m_rules);
		var rt = null!=rule;
		return rt;
	};
	
})();

// register
(function(){
	// init.
	zyl.json.DataJsonUtil.registerProcessor(new zyl.json.MediaDataJsonProcessor());
})();
