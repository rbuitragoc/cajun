var DateValidator = require('./../../../../classes/util/DateUtils.class.js');


describe("Date extra features", function() {
	describe("for date comparison", function() {
		it("returns true when date param 1 has passed", function() {
			var beforeDate = Date.now() - 1;
			expect(true).toEqual(DateValidator.hasPassedTimestamp(beforeDate));
		});
		it("returns false when date param 1 has not been passed", function() {
			var afterDate = Date.now() + 20;
			expect(false).toEqual(DateValidator.hasPassedTimestamp(afterDate));
		});
		it("validate parameter as number", function() {
			expect(function(){
				DateValidator.hasPassedTimestamp("none")
			}).toThrowError("Date must be an number");
		});
	});
});