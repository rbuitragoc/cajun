function wasMentioned(handle, message) {
	return (message.indexOf(handle) != -1 && (message.indexOf(handle) == 0 || message.indexOf('@' + handle) == 0))
}
			
module.exports = wasMentioned