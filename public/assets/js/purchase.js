$(function(){
	
	console.log("Purchase modul: ok!");
	$("#paymentBtn").on("click", (event)=>{
		$.get({
			url: "/getAddress"
		/*}).catch(function(err, res) {
			if (err) throw err;*/
		}).then(addressBTC =>{
			$(event.currentTarget)
			.parent()
			.find("#paymentInfo")
			.html(`
				<p>Please, send exactly X-bitcoin to following address: <span id="btcAddress">`+addressBTC+`</span> and click "Make purchase"</p>
				`);
		})
		.catch(console.log.bind(console));
	})
	
	$("#placeOrderBtn").on("click", (event)=>{
		$.post({
			url:"/buyItem",
			data:{
				"ebayId": $(event.currentTarget).attr("data-id"),
				"btcAddress": $("#btcAddress").text(),
				"mailAddress": "\"wallace road"
			}, 
			header:{
				user:"test"
			}
		/*}).catch(function(err, res) {
			if (err) throw err;*/
		}).then(answer =>{
			console.log(answer);
		})
		.catch(console.log.bind(console));
	});
});