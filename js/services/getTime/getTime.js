angular.module("getTimeModule", [])
	.service('getTimeService', function(){
		this.getTimeDifference = function(date){
			date = new Date(date);
			var now = new Date();

			var ms = date.getTime() - now.getTime();
			var seconds = Math.floor(Math.abs(ms / 1000));
			var minutes = Math.floor(Math.abs(seconds / 60));
			var hours = Math.floor(Math.abs(minutes / 60));
			var days = Math.floor(Math.abs(hours / 24));
			var expired = false;
			hours %= 24;
			minutes %= 60;
			seconds %= 60;

			if (ms < 0) expired = true;

			return {
				days: days,
				hours: hours,
				minutes: minutes,
				seconds: seconds,
				expired: expired
			};
		}

		this.getTimeDifferenceString = function(date){
			var due_time = this.getTimeDifference(date);
			var text = "";
			var space = false;

			if(due_time.expired){
				text += "Expired ";
			}

			if(due_time.days < 1){
				if(due_time.hours > 0){
					text += due_time.hours + " hour";
					if(due_time.hours > 1) text += "s";
					space = true;
				}

				if(due_time.minutes > 0){
					if(space) text += " ";
					text += due_time.minutes + " minute";
					if(due_time.minutes > 1) text += "s";
				}

				if(due_time.hours === 0 && due_time.minutes === 0){
					text += due_time.seconds + " second";
					if(due_time.seconds > 1) text += "s";
				}
			} else {
				text += due_time.days + " day";
				if(due_time.days > 1) text += "s";
			}

			if(due_time.expired){
				text += " ago";
			} else {
				text += " left";
			}

			return text;
		}
	});
