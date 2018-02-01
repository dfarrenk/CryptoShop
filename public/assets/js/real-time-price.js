$(function(){
	console.log("Real-time-prices: ok!");
	setInterval(()=>{
		$.get({
			url: "https://api.coinmarketcap.com/v1/ticker/?limit=4"
		}).then(data => {
			console.log(data["0"].price_usd)
			$("#btcRate").html(data["0"].price_usd);
			$("#ethRate").html(data["1"].price_usd);
			$("#bthRate").html(data["3"].price_usd);
			
		})
	}, 60000);
	

});//$