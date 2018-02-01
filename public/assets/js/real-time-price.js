$(function(){
	console.log("Real-time-prices: ok!");
	setInterval(()=>{
		$.get({
			url: "https://api.coinmarketcap.com/v1/ticker/?limit=4"
		}).then(data => {
			console.log(data["0"].price_usd)
			$("#btcRate").text("Bitcoin: "+data["0"].price_usd);
			$("#ethRate").text("Ethereum: "+data["1"].price_usd);
			$("#bthRate").text("Bitcoin cash: "+data["3"].price_usd);
			
		})
	}, 60000);
	

});//$