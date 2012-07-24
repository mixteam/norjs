nor.js
======

支持以传统方式导入js（用script标签）。封装方式如下：
>(function(require, exports, module) {
>
>	//TODO code
>
>}).apply(
>window,
>norjs(//use norjs(string id, Array.<string> dependencies)
>'id',
>[dependencies]
>)
>)