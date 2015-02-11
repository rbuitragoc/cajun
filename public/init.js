function startBot(){
	$.ajax({
		type: "POST",
		url: 'http://salty-inlet-8617.herokuapp.com:3000',
		data: '',
		success: function( data, textStatus, jqXHR){
			console.log(data);
		}		
	});
}