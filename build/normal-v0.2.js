var norjs;
(function(g,h){var d={};norjs=function(b,a,c){var e,f={};a&&a.length&&a.forEach(function(a){var b=d[a];if(b)f[b.id]=b.exports;else throw Error(a+"has not defined");});e=function(a){var b;0>a.indexOf("@")&&(a+="@");for(var c in f)if(0<=c.lastIndexOf(a)){b=f[c];break}if(b)return b;throw Error("no declared dependence for "+a);};a=d[b]||(d[b]={});if(a.exports)throw Error(b+" has already defined");a.id=b;b=a.exports={};if(c)c=c(e,b,a),c!=h&&(a.exports=c);else return[e,b,a]};g.define==h&&(g.define=norjs)})(window);
