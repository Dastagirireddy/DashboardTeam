exports.calcDays = function(daycount){

	var oneday = 1000 * 60 * 60 * 24;
	var daysago = Date.now() - daycount * oneday;
	return daysago;
};
