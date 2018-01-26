$(function(){
	console.log("Purchase modul: ok!");
	$("#paymentBtn").on("click", (event)=>{
		$.get({
			url: "/getAddress"
		}).catch(function(err, res) {
			if (err) throw err;
		}).then(addressBTC =>{
			$(event.currentTarget)
			.parent()
			.find("#paymentInfo")
			.html(`
				<p>Please, send exactly X-bitcoin to following address: <span>`+addressBTC+`</span> and click "Make purchase"</p>
				`);
		});
	})
	$("#placeOrderBtn").on("click", ()=>{
		$.post({
			url:"/buyItem/",
			data:{
				"ebayId": "5a52f4115afaaa0834292420",
				"btcAddress": "13WJ6nxHKtJWTA5A9GWNmhi6d1FyPidZDK",
				"mailAddress": "\"wallace road"
			}, 
			header:{
				user:"test"
			}
		}).catch(function(err, res) {
			if (err) throw err;
		}).then(answer =>{
			alert(answer);
		});

	})
});