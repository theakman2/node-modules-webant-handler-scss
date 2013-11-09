var fs = require("fs");
var path = require("path");

var Handler = require("../lib/index.js");

var tests = {
	"test filetypes":function(assert) {
		var handler = new Handler();
		var data = [
		            "https://mysite.co.uk/bla.js",
		            "//cdn.google.com/path/to/assets.css",
		            "path/to/assets.scss",
		            "/abs/path/to/assets.scss",
		            "@@hbs/runtime",
		            "@@css/addStylesheet"
		            ];
		assert.deepEqual(
			data.map(handler.willHandle),
			[false,false,true,true,false,true],
			"Should handle the correct files."
		);
	},
	"test content 1":function(assert,done) {		
		var handler = new Handler();
		handler.handle(__dirname+"/styles.scss",function(err,content){
			assert.ok(!err,"There should be no errors handling this filetype.");
			assert.equal(
				content,
				'require("@@css/addStylesheet",function(add){ add(".foo .bar {\\n  color: #eeccdd; }\\n"); });',
				"Handler should return the right content."
			);
			done();
		});
	},
	"test content 2":function(assert,done) {
		var handler = new Handler({compress:true});
		handler.handle(__dirname+"/styles.scss",function(err,content){
			assert.ok(!err,"There should be no errors handling this filetype.");
			assert.equal(
				content,
				'require("@@css/addStylesheet",function(add){ add(".foo .bar {color:#eeccdd;}"); });',
				"Handler should return the right content."
			);
			done();
		});
	},
	"test content 3":function(assert,done) {		
		var handler = new Handler({compress:true});
		handler.handle("@@css/addStylesheet",function(err,content){
			assert.ok(!err,"There should be no errors handling this filetype.");
			assert.equal(
				content,
				fs.readFileSync(path.join(__dirname,"..","lib","data","addStylesheet.js")).toString(),
				"Handler should update with correct content."
			);
			done();
		});
	}
};

require("test").run(tests);