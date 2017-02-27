var main = angular.module("main", ["todoListModule", "contextualLayerModule", "LocalStorageModule", "ngRoute", "ngAnimate"])
	.config(["$routeProvider", "$locationProvider", routeProviderConfig]);

function routeProviderConfig($routeProvider, $locationProvider){
	$routeProvider
		.when("/", {
			templateUrl: "pages/todoList.html"
		})

		.when("/addTodo", {
			templateUrl: "pages/addTodo.html"
		})

		.when("/editTodo/:title", {
			templateUrl: "pages/editTodo.html"
		})

		.when("/details/:title", {
			templateUrl: "pages/todoView.html"
		})

		.otherwise({
			redirectTo: "/"
		});

	$locationProvider.hashPrefix('');
};

function arrayObjectIndexOf(array, property, value){
	for(var i = 0; i < array.length; i++){
		if(array[i][property] === value) return i;
	}
	return -1;
};

function message(cssClass, text){
	var msgList = document.getElementById("msgList"), extraStuff = false;

	if(msgList == null){
		extraStuff = true;
		var body = document.getElementsByTagName("body")[0];
		msgList = document.createElement("div");
		msgList.id = "msgList";
	}

	var msg = document.createElement("div");
	msg.classList.add("msg", cssClass);
	msg.innerText = text;

	if(extraStuff){
		body.append(msgList);
	}

	msgList.append(msg);

	setTimeout(function(){
		msg.classList.add("show");
	}, 0);

	setTimeout(function(){
		msg.classList.remove("show");
		setTimeout(function(){
			msg.remove();
		}, 300)
	}, 2000)
};
