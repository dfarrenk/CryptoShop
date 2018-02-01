$(function() {
	
	
	var timer = new Timer();
	console.log("Purchase modul: ok!");

	$("#paymentBtn").on("click", (event) => {
		var socket = io('https://localhost:3000', {secure: true});
		
		socket.on("news", (message)=>{
			console.log("From server: ");
			console.log(message);
		})
		socket.on("connect", ()=>{
			socket.on(socket.id, (message)=>{
				console.log("To "+ socket.id);
				if(message=="completed!"){
					timer.stop();
					$("#countdownExample").html("Item purchased!");
				}
			});
		})
		
		timer.start({ countdown: true, startValues: { minutes: 15 } });
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
						<p>Please, send exactly X-bitcoin to following address: <span id="btcAddress">` + addressBTC + `</span> and click "Make purchase"</p>
						`);

				})
				.catch(console.log.bind(console));
			})

	$("#placeOrderBtn").on("click", (event) => {
		$.post({
			url: "/buyItem",
			data: {
				"ebayId": $(event.currentTarget).attr("data-id"),
				"btcAddress": /*$("#btcAddress").text()*/"13WJ6nxHKtJWTA5A9GWNmhi6d1FyPidZDK",
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
