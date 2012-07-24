##nor.js

支持以传统方式导入js（用script标签）。

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
    
###用命令行build：

norjs filename [options]

    >node ./bin/norjs ./test/test.js
    >build success to "build/test.js"

options如下：

    -b 或 --build-path    编译后存放的路径，默认为build
    -p 或 --package-file  模块描述文件，默认为package.js
    --version-postfix     是否携带版本信息，默认为false
    --build-postfix       是否携带build器的信息，默认为false
