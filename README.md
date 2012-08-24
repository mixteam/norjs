##nor.js

支持以传统方式导入js（用script标签）

###更新历史

####0.2

* 增加对CMD封装的支持

####0.1

* 立项

###支持的普通的封装方式：

    (function(require, exports, module) {
  
      //TODO code
  
    }).apply(
      window, 
      norjs(//use norjs(string id, Array.<string> dependencies) 
        'id', 
        [dependencies]
      )
    );

###同样可以兼容CMD的封装（v0.2）
    define(
    'id', 
    [dependencies], 
    function(require, exports, module){

        //TODO code

    });


###使用方法：

最先引入normal.js，之后依次根据依赖关系引入需要的库和入口js。

    <!DOCTYPE html>
    <html>
    <head>
        <script src="../build/normal-v0.2.js"></script>
	    <script src="./debug/build/debug.js"></script>
	    <script src="./helloworld/build/helloworld.js"></script>
    </head>
    <body>	
	    <script src="./build/test.js"></script>
    </body>
    </html>
    
##build：

对符合CommonJS规范的JS文件进行封装

###更新历史

#### v0.3.1

* 支持package.json里有多个描述块

#### v0.3

* 改进性能

#### v0.2

* 支持CMD的封装（使用--cmd-mode开关）

#### v0.1

* 立项

###使用方法：

norjs module_dir [options]

    >node ./bin/build ./test
    >21:57:02 - [build] success to "test\build\test.js"

options如下：

    -b 或 --build-path    编译后存放的路径，默认为build
    -p 或 --package-file  模块描述文件，默认为package.json
    --version-postfix     是否携带版本信息，默认为false
    --build-postfix       是否携带build器的信息，默认为false
    --cmd-mode            使用CMD封装，默认为false
    -v 或 --version       显示版本

##monitor：

实时监控JS文件，一旦修改就对其进行封装

###更新历史

#### v0.3.1

* 支持监听package.json的修改

#### v0.2

* 支持package.json里有多个描述块

#### v0.1

* 立项

###使用方法：

norjs-monitor [options]

    >node ./bin/norjs-monitor
    >./test --cmd-mode
    >21:57:01 - [monitor] success to "test\debug"
    >21:57:01 - [monitor] success to "test\helloworld"
    >21:57:01 - [monitor] success to "./test"
    >21:57:02 - [build] success to "test\debug\build\debug.js"
    >21:57:02 - [build] success to "test\helloworld\build\helloworld.js"
    >21:57:02 - [build] success to "test\build\test.js"

    

options如下：

    -r 或 --recursion    对当前目录进行遍历监控
    -v 或 --version      显示版本