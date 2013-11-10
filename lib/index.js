var fs = require("fs");
var path = require("path");
var url = require("url");

var jsStringEscape = require("js-string-escape");
var sass = require("node-sass");

function Handler(settings) {
	
	this.willHandle = function(filePath) {
		if (url.parse(filePath,false,true).host) {
			return false;
		}
		if (filePath === "@@css/addStylesheet") {
			return true;
		}
		if (filePath.indexOf("@@") === 0) {
			return false;
		}
		if (path.extname(filePath) === ".scss") {
			return true;
		}
		return false;
	};
	
	this.handle = function(filePath,done) {
		if (filePath === "@@css/addStylesheet") {
			fs.readFile(__dirname+"/data/addStylesheet.js",function(e,c){
				if (e) {
					done(e);
					return;
				}
				done(null,c.toString());
			});
		} else {
			fs.readFile(filePath,function(e,c){
				if (e) {
					done(e);
					return;
				}
				var opts = {
					data:c.toString(),
					includePaths:[path.dirname(filePath)],
					success:function(css) {
						done(null,'require("!@@css/addStylesheet")("'+jsStringEscape(css)+'");');
					},
					error:function(err) {
						done(err);
						return;
					}
				};
				
				if (settings && settings.compress) {
					opts.outputStyle = "compressed";
				}
				
				sass.render(opts);
			});
		}
	};
};

module.exports = Handler;