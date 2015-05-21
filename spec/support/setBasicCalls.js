var path = require('path'),
	fs = require('fs');

function setBasicCalls(route, name) {
	var file, mocks
	file = path.join(__dirname, '..', '..', route, name)
	if (fs.existsSync(file + '.js')) {
		global[name] = require(file + '.js');
	} else if (fs.existsSync(file + '.class.js')) {
		global[name] = require(file + '.class.js')
	}

	mocks = path.join(__dirname, '..', 'mocks', route, name)

	if (fs.existsSync(mocks + '.js')) {
		global[name + 'Mocks'] = require(mocks + '.js')
	}

}

module.exports = setBasicCalls;