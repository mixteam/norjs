(function(require, exports, module) {
    
var Debug = require('debug'),
    debug = new Debug(),
    HelloWorld = require('helloworld')
    hw = new HelloWorld();

    debug.log(hw.say());

}).apply(window,
norjs(
'mix/norjs/test/test@0.5',
['mix/norjs/test/debug@0.5', 'mix/norjs/test/helloworld@0.5']
));