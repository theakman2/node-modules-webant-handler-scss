var fs = require("fs");
var path = require("path");

var handler = require("../lib/index.js");

var tests = {
	"test filetypes":function(assert) {
		var data = [
		            "https://mysite.co.uk/bla.js",
		            "//cdn.google.com/path/to/assets.css",
		            "path/to/assets.scss",
		            "/abs/path/to/assets.scss",
		            "@@hbs/runtime",
		            "@@css/addStylesheet"
		            ];
		assert.deepEqual(
			data.map(function(fp){ return handler.willHandle(fp);}),
			[false,false,true,true,false,true],
			"Should handle the correct files."
		);
	},
	"test content 1":function(assert,done) {
		handler.handle(__dirname+"/styles.scss",{},function(err,content){
			assert.ok(!err,"There should be no errors handling this filetype.");
			assert.equal(
				content,
				'require("!@@css/addStylesheet")(".foo .bar {\\n  color: #eeccdd; }\\n");',
				"Handler should return the right content."
			);
			done();
		});
	},
	"test content 2":function(assert,done) {
		handler.handle(__dirname+"/styles.scss",{compress:true},function(err,content){
			assert.ok(!err,"There should be no errors handling this filetype.");
			assert.equal(
				content,
				'require("!@@css/addStylesheet")(".foo .bar {color:#eeccdd;}");',
				"Handler should return the right content."
			);
			done();
		});
	},
	"test content 3":function(assert,done) {
		handler.handle("@@css/addStylesheet",{compress:true},function(err,content){
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