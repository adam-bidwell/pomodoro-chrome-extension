var status_timer = null;

$(document).ready(function () {
	pomodoro_client.start();

	$("#startButton").click(function() {
		chrome.runtime.sendMessage({action: "start"}, function(response) {
			// response.started will indicate whether that began or not
		});
	});
});

var pomodoro_client = {

	STATUS_CHECK_INTERVAL: 1000,

	status_timer: null,

	start: function () {
		this.tick();
		this.status_timer = setInterval(function () {
			pomodoro_client.tick();
		}, this.STATUS_CHECK_INTERVAL);
	},
	
	tick: function ()
	{
		chrome.runtime.sendMessage({action: "status"}, function(response) {
			// response.status will show the current countdown
			pomodoro_client.show(response.countdown);
		});
	},
	
	show: function (countdown)
	{
		// hours = parseInt(countdown / 3600) % 24;
		minutes = parseInt(countdown / 60) % 60;
		seconds = countdown % 60;

		// (hours < 10 ? "0" + hours : hours) + ":" + 
		time = (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds);

		$("#timer").html(time);
	}

};