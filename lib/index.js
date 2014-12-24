var fs = require("fs");
var path = require("path");

var jsEscape = require("js-string-escape");
var sass = require("node-sass");

function ScssHandler() {
	this.settings = {};
}

ScssHandler.prototype = {
	extensions:".scss",
	handle:function(filePath,done){
		var _this = this;
		fs.readFile(filePath,function(e,c){
			if (e) {
				done(e);
				return;
			}
			var opts = {
				data:c.toString(),
				includePaths:[path.dirname(filePath)],
				success:function(css) {
					done(null,'module.exports = "' + jsEscape(css) + '";');
				},
				error:function(err) {
					done(err);
					return;
				}
			};
			
			if (_this.settings.compress) {
				opts.outputStyle = "compressed";
			}
			
			sass.render(opts);
		});
	}
};

module.exports = ScssHandler;