var pomodoro = {

	WORK_DURATION: 25 * 60,	// time before notifications, in seconds
	TICK_FREQUENCY: 1000,	// gap between ticks, in milliseconds
	
	WAITING: 0,
	RUNNING: 1,
	STOPPED: 2,

	timer: null,
	
	countdown: 0,
	
	state: 0, 
		
	show: function () {
		var notification = window.webkitNotifications.createNotification(
			'assets/pomodoro-128.png',
			'Stop!',
			'Your Pomodoro time is up. Deal with any interruptions that you\'ve been deferring, then start another timer' 
		);
		notification.show();
	},
	
	getTime: function () {
		if (this.getState() == this.WAITING) {
			return this.WORK_DURATION;
		} else {
			return this.countdown;
		}
	},
	
	getState: function () {
		return this.state;
	},
	
	tick: function () {
		if (pomodoro.countdown > 0) {
			pomodoro.countdown --;
		}

		if (pomodoro.countdown == 0 && pomodoro.timer != null) {
			pomodoro.stop();
			// Test for notification support.
			if (window.webkitNotifications) {
				pomodoro.show();
			}
		}
	},

	start: function () {
		// stop the timer if it's already running, or we'll start doing everything double-time
		if (this.timer != null) {
			clearInterval(this.timer);
			this.timer = null;
		}

		this.countdown = this.WORK_DURATION;
		this.state = this.RUNNING;
		this.timer = setInterval(this.tick, this.TICK_FREQUENCY);
	},

	stop: function () {
		clearInterval(this.timer);
		this.state = this.STOPPED;
		this.timer = null;
	}

};

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
    	switch (request.action) {
    		case "start":
    			pomodoro.start();
    			break;
    		case "stop":
    			pomodoro.stop();
    			break;
    		case "status":
    		default:
    			break;
    	}

		sendResponse({
			outcome: true,
			countdown: pomodoro.getTime(),
			state: pomodoro.getState()
		});
    }
);