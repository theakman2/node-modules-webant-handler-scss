var path = require("path");

var sass = require("node-sass");

function Handler(settings) {
	var self = this;
	
	this.extensions = [".scss"];
	this.requireTypes = ["comment","function"];
	this.requireAliases = {
		'@@css/addStylesheet':path.resolve(__dirname,"data/addStylesheet.js")
	};
	
	this.go = function(data,update,done) {
		var opts = {
			data:data.content,
			includePaths:[path.dirname(data.filePath)],
			success:function(css) {
				if (data.requireType === "comment") {
					update({
						type:"internalCss",
						content:css
					},done);	
				} else {
					update({
						type:"internalJs",
						content:'require("@@css/addStylesheet")('+self.makeString(css.replace(/\s+/g," ").trim())+');'
					},done);
				}
			},
			error:function(err) {
				done(err);
				return;
			}
		};
		
		if (self.settings && self.settings.compress) {
			opts.outputStyle = "compressed";
		}
		
		sass.render(opts);
	};
};

module.exports = Handler;