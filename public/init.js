function startBot(){
	$.ajax({
		type: "POST",
		url: 'https://salty-inlet-8617.herokuapp.com',
		data: '',
		success: function( data, textStatus, jqXHR){
			console.log(data);
		}		
	});
}