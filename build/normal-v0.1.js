var norjs;
(function(){function f(a,b,d){"string"==typeof b&&(b=b.split(h));b.forEach(function(e){if(!a[e]&&!1===d)throw Error(b.join("/")+" has not defined");a=a[e]||(a[e]={})});return a}var h=/[/@]/,g={};norjs=function(a,b){var d,e={};b&&b.length&&b.forEach(function(c){if(c=f(g,c,!1))e[c.id]=c.exports});d=f(g,a);if(d.exports)throw Error(a+" has already defined");d.id=a;return[function(c){var a;0>c.indexOf("@")&&(c+="@");for(var b in e)if(0<=b.lastIndexOf(c)){a=e[b];break}if(a)return a;throw Error("no dependence for "+c);
},d.exports={},d]}})(window);
