/**
 * @Author : sqs3ng
 * @Timestamp : 2016-10-22
 */
var d1 = require("deviceone");
var app = d1.sm("do_App");

app.on("loaded", function () {
	app.openPage("source://view/index.ui");
});
