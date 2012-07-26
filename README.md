##nor.js(v0.2)

支持以传统方式导入js（用script标签）。

###changelog

* v0.2 
 * 兼容CMD
 * 改善性能

* v0.1 创建项目

###封装方式如下：

    (function(require, exports, module) {
  
      //TODO code
  
    }).apply(
      window, 
      norjs(//use norjs(string id, Array.<string> dependencies) 
        'id', 
        [dependencies]
      )
    );

###使用如下：

最先引入normal.js，之后依次根据依赖关系引入需要的库和入口js。

    <!DOCTYPE html>
    <html>
    <head>
        <script src="../build/normal-v0.5.js"></script>
	    <script src="./debug/build/debug.js"></script>
	    <script src="./helloworld/build/helloworld.js"></script>
    </head>
    <body>	
	    <script src="./build/test.js"></script>
    </body>
    </html>
    
###用命令行build：

norjs filename [options]

    >node ./bin/norjs ./test/test.js
    >build success to "build/test.js"

options如下：

    -b 或 --build-path    编译后存放的路径，默认为build
    -p 或 --package-file  模块描述文件，默认为package.js
    --version-postfix     是否携带版本信息，默认为false
    --build-postfix       是否携带build器的信息，默认为false
