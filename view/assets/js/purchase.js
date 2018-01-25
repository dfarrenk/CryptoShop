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
				<p>Please, send exactly  to following address: <span>`+addressBTC+`</span></p>
				`);
		});
	})
	$("#placeOrderBtn").on("click", ()=>{
		alert("nice!");

	})
});