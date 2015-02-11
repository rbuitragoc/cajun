function startBot(){
	$.ajax({
		type: "POST",
		//url: 'https://salty-inlet-8617.herokuapp.com',
		url: 'http://localhost:3000/start',
		data: '',
		success: function( data, textStatus, jqXHR){
			console.log(data);
		}		
	});
}

function stopBot(){
	$.ajax({
		type: "POST",
		//url: 'https://salty-inlet-8617.herokuapp.com/logout',
		url: 'http://localhost:3000/stop',
		data: '',
		success: function( data, textStatus, jqXHR){
			console.log(data);
		}		
	});
}