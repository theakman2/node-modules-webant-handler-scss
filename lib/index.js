var fs = require("fs");
var path = require("path");

var jsEscape = require("js-string-escape");
var sass = require("node-sass");

module.exports = {
	aliases:require("webant-handler-css").aliases,
	extensions:".scss",
	handle:function(filePath,done){
		fs.readFile(filePath,function(e,c){
			if (e) {
				done(e);
				return;
			}
			var opts = {
				data:c.toString(),
				includePaths:[path.dirname(filePath)],
				success:function(css) {
					done(null,'require("{css/addStylesheet}|sameAsChunk={entry}")("'+jsEscape(css)+'");');
				},
				error:function(err) {
					done(err);
					return;
				}
			};
			
			if (module.exports.settings && module.exports.settings.compress) {
				opts.outputStyle = "compressed";
			}
			
			sass.render(opts);
		});
	}
};