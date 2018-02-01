$(function() {
	
	//var socket = io();

	var timer = new Timer();
	console.log("Purchase modul: ok!");

	$("#paymentBtn").on("click", (event) => {
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
