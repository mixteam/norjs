var Debug = require('debug'),
    debug = new Debug(),
    HelloWorld = require('helloworld')
    hw = new HelloWorld();

 debug.log(hw.say());