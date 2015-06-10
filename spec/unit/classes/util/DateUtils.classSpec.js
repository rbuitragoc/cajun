var DateValidator = require('./../../../../classes/util/DateUtils.class.js');


describe("Date extra features", function() {
	describe("sue hasPassedTimestamp method for date comparison", function() {
		it("returns true when date param 1 has passed", function() {
			var beforeDate = Date.now() - 20;
			expect(true).toEqual(DateValidator.hasPassedTimestamp(beforeDate));
		});

		it("returns false when date param 1 has not been passed", function() {
			var afterDate = Date.now() + 20;
			expect(false).toEqual(DateValidator.hasPassedTimestamp(afterDate));
		});

		it("validate parameter given", function() {
			expect(function(){
				DateValidator.hasPassedTimestamp()
			}).toThrowError("missing param");
		});

		it("validate parameter is not a string", function() {
			var stringDate = "1433874217";
			expect(function(){
				DateValidator.hasPassedTimestamp(stringDate)
			}).toThrowError("Date must be an number");
		});
		
		it("validate parameter is not an object", function() {
			var objDate = {date : "1433874217"};
			expect(function(){
				DateValidator.hasPassedTimestamp(objDate)
			}).toThrowError("Date must be an number");
		});
	});
});