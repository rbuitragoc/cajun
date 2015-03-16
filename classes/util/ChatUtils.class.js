function wasMentioned(handle, message) {
	var caseInsensitiveHandle = handle.toLowerCase()
	var caseInsensitiveMessage = message.toLowerCase()
	return (caseInsensitiveMessage.indexOf(caseInsensitiveHandle) != -1 && (caseInsensitiveMessage.indexOf(caseInsensitiveHandle) == 0 || caseInsensitiveMessage.indexOf('@' + caseInsensitiveHandle) == 0))
}
			
module.exports = wasMentioned