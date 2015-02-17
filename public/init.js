
function manageBot(input) {
	if (input.checked) {
		startBot(appUrls.start);
	} else {
		stopBot(appUrls.stop);
	}
}

function startBot(startUrl){
	$.ajax({
		type: "POST",
		url: startUrl,
		data: '',
		success: function( data, textStatus, jqXHR){
			console.log(data);
		}		
	});
}

function stopBot(stopUrl){
	$.ajax({
		type: "POST",
		url: stopUrl,
		data: '',
		success: function( data, textStatus, jqXHR){
			console.log(data);
		}		
	});
}