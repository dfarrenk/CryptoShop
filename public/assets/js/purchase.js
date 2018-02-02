$(function() {
	
	
	var timer = new Timer();
	console.log("Purchase modul: ok!");

	$("#paymentBtn").on("click", (event) => {
		var socket = io('https://localhost:3000', {secure: true});
		
		socket.on("news", (message)=>{
			console.log("From server: ");
			console.log(message);
		});
		socket.on("connect", ()=>{
			socket.on(socket.id, (message)=>{
				console.log("To "+ socket.id);
				if(message=="completed!"){
					timer.stop();
					$("#countdownExample").html("Item purchased!");
				}
			});
		});
		
		timer.start({ countdown: true, startValues: { minutes: 25 } });
		$('#countdownExample .values').html(timer.getTimeValues().toString());
		timer.addEventListener('secondsUpdated', function(e) {
			$('#countdownExample .values').html(timer.getTimeValues().toString());
		});
		timer.addEventListener('targetAchieved', function(e) {
			$('#countdownExample .values').html('Timer Expiered');
		});
		$.get({
			url: "/getAddress"
				/*}).catch(function(err, res) {
					if (err) throw err;*/
				}).then(addressBTC => {
					$(event.currentTarget)
					.parent()
					.find("#paymentInfo")
					.html(`
						<p>Please, send no less than <span id="btcPrice"></span> to following address: <span id="btcAddress">` + addressBTC + `</span> and click "Make purchase". Please, allow up to 24 hours for BTC-blockchain in order to get 6 confirmation. You will receive e-mail letter, and will able to see your purchese on <a href="https://thecryptoshop.herokuapp.com/profile">profile-page.</a></p>
						`);
					var price= +$("#modalPrice").text().substr(1);
					var rate = $("#btcRate").text();
					console.log(price);
					console.log(rate);
					$("#btcPrice").text(
						price/rate
						);
				})
				.catch(console.log.bind(console));
			})

	$("#placeOrderBtn").on("click", (event) => {
		$.post({
			url: "/buyItem",
			data: {
				"ebayId": $(event.currentTarget).attr("data-id"),
				"btcAddress": $("#btcAddress").text(),
				"mailAddress": "\"wallace road"
			},
			header: {
				user: "test"
			}
				/*}).catch(function(err, res) {
					if (err) throw err;*/
				}).then(answer => {
					console.log(answer);
				})
				.catch(console.log.bind(console));
			});
});
