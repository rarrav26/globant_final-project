var testingData = true; //for testing porpouses only

angular.module("todoListModule", ["LocalStorageModule", "ngRoute", "getTimeModule"])
	.service('todoListService', ['localStorageService', 'getTimeService', todoListService])

	.controller('todoListController', ['$scope', '$filter', 'todoListService', 'getTimeService', todoListController])

	.controller('todoViewController', ['$scope', 'todoListService', 'getTimeService', '$routeParams', todoViewController])

	.controller('addTodoController', ['$scope', 'todoListService', addTodoController])

	.controller('editTodoController', ['$scope', 'todoListService', '$routeParams', editTodoController])

	.component("todoList", {
		templateUrl: "./js/modules/todoList/todoList.html",
		controller: "todoListController",
		bindings: {
			search: "@"
		}
	})

	.component("todoView", {
		templateUrl: "./js/modules/todoList/todoView.html",
		controller: "todoViewController"
	})

	.component("addTodo", {
		templateUrl: "./js/modules/todoList/addTodo.html",
		controller: "addTodoController"
	})

	.component("editTodo", {
		templateUrl: "./js/modules/todoList/editTodo.html",
		controller: "editTodoController"
	});

function todoListService(localStorageService, getTimeService){
	this.getImportance = function(){
		return [
			{
				value: 1,
				name: "Low"
			},
			{
				value: 2,
				name: "Medium"
			},
			{
				value: 3,
				name: "High"
			}
		];
	};

	this.getStatus = function(){
		return [
			{
				value: 1,
				name: "Todo"
			},
			{
				value: 2,
				name: "Doing"
			},
			{
				value: 3,
				name: "Done"
			}
		];
	};

	this.get = function(key){
		var todoList = localStorageService.get(key);

		if(todoList == null || todoList.length <= 0){
			//Testing stuff
			if(testingData === true){
				//Datos de testeo para evitar cargar una y otra vez
				var curDate = new Date();
				var Importance = this.getImportance();
				var Status = this.getStatus();
				var defaultTodoList = [
					{
						title: "Go to the movies",
						description: "Premiere of Assassin's Creed",
						importance: Importance[2],
						due_date: new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate(), 20),
						status: Status[1]
					},
					{
						title: "Lucas' birthday",
						description: "Lucas turns 25",
						importance: Importance[2],
						due_date: new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate() + 3, 21),
						status: Status[1]
					},
					{
						title: "Meeting friends",
						description: "",
						importance: Importance[2],
						due_date: new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate() + 7, 22),
						status: Status[0]
					},
					{
						title: "Go to grandma's house",
						description: "Grandma invited me to have lunch",
						importance: Importance[1],
						due_date: new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate() + 1, 15),
						status: Status[0]
					},
					{
						title: "Wash the car",
						description: "The car is muddy",
						importance: Importance[1],
						due_date: new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate() + 3, 14),
						status: Status[0]
					},
					{
						title: "Take the dog for a walk",
						description: "Go to the park",
						importance: Importance[1],
						due_date: new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate() + 5, 16),
						status: Status[0]
					},
					{
						title: "Wash the dishes",
						description: "",
						importance: Importance[0],
						due_date: new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate(), 18),
						status: Status[1]
					},
					{
						title: "Cook dinner",
						description: "Remember it's my turn to cook dinner!!",
						importance: Importance[0],
						due_date: new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate() + 3, 20),
						status: Status[0]
					}
				];
				todoList = defaultTodoList;
			} else {
				todoList = [];
			}
			//Testing stuff - End
			//todoList = [];
			localStorageService.set(key, todoList);
		}

		return todoList;
	}

	this.set = function(key, val){
		return localStorageService.set(key, val);
	}

	this.remove = function(key){
		return localStorageService.remove(key);
	}

	this.getColorClass = function(obj){
		var imp = obj.importance.name.toLowerCase();
		var due_priority = getDueDaysPriority(obj.due_date);

		if (due_priority === -1 || obj.status.value === 3) return 'grey';

		return imp + '-' + due_priority;
	};

	this.getTitleClass = function(obj){
		var classes = "", space = false;

		if (obj.status.value === 2 || obj.status.value === 3){
			classes += "italic";
			space = true;
		}

		if (obj.status.value === 3 || getTimeService.getTimeDifference(obj.due_date).expired){
			if (space) classes += " ";
			classes += "line-through";
		}

		return classes;
	};

	function getDueDaysPriority(date){
		var priority;

		var due_time = getTimeService.getTimeDifference(date);

		if (due_time.expired) {
			priority = -1;
		} else if (due_time.days <= 1) {
			priority = 4;
		} else if (due_time.days <= 3) {
			priority = 3;
		} else if (due_time.days <= 5) {
			priority = 2;
		} else if (due_time.days <= 10) {
			priority = 1;
		} else {
			priority = 0;
		}

		return priority;
	}
}

function todoListController($scope, $filter, todoListService, getTimeService){
	//OrderBy
	$scope.defaultPropertyName = ['+importance.value', '-due_date', '+status.value'];
	$scope.propertyName = $scope.defaultPropertyName;
	$scope.reverse = true;

	$scope.sortBy = function(propertyName){
		var defaultReverse = (propertyName === 'importance.value' || propertyName === $scope.defaultPropertyName) ? true : false;

		$scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : defaultReverse;

		$scope.propertyName = propertyName;
	}

	//Creating first option with empty value (ng-options shows value=? if an option *created in html* has empty value)
	$scope.Importance = [{ value: "", name: "All" }];
	Array.prototype.push.apply($scope.Importance, todoListService.getImportance());

	//Setting first option as selected in Importance select
	$scope.selectedImportance = $scope.Importance[0].value;

	//Creating first option with empty value (ng-options shows value=? if an option *created in html* has empty value)
	$scope.Status = [{ value: "", name: "All" }];
	Array.prototype.push.apply($scope.Status, todoListService.getStatus());

	//Setting first option as selected in Status select
	$scope.selectedStatus = $scope.Status[0].value;

	$scope.todoList = todoListService.get("todo-list");

	$scope.getColorClass = todoListService.getColorClass;

	$scope.getTitleClass = todoListService.getTitleClass;

	$scope.deleteTodo = function(obj){
		var index = $scope.todoList.indexOf(obj);
		var result = confirm("Do you want to delete the task: \"" + obj.title + "\"?");

		if(result === true){
			$scope.todoList.splice(index, 1);

			if(todoListService.set("todo-list", $scope.todoList)){
				message("success", "Successfully deleted!");
			} else {
				message("error", "An error ocurred!");
			}
		}
	};

	$scope.clearTodoList = function(condition = 'all'){
		var length = $scope.todoList.length;

		if(length > 0){
			var msg = "Are you sure you want to delete ";

			if(condition === 'all'){
				msg += "the entire list?";
			} else if(condition === 'done'){
				msg += "completed tasks?";
			}

			var result = confirm(msg);

			if(result === true){
				if(condition === 'all'){
					$scope.todoList = [];
				} else {
					for(var i = 0; i < length; i++){
						if($scope.todoList[i].status.value === 3){
							$scope.todoList.splice(i--, 1);
							length--; //Reduce the length beacuse of the splice (it removes an element so the new array's length is length-1)
						}
					}
				}

				if(todoListService.set("todo-list", $scope.todoList)){
					message("success", "Successfully deleted!");
				} else {
					message("error", "An error ocurred!");
				}
			}
		} else {
			message("error", "The list is empty!");
		}
	}

	/*
	//$watchCollection: se ejecuta cada vez que el arreglo (primer parámetro) es modificado y ejecuta el callback (segundo parámetro)
	$scope.$watchCollection('todoList', function(newVal, oldVal){
		todoListService.set("todo-list", $scope.todoList);
	});
	*/
}

function todoViewController($scope, todoListService, getTimeService, $routeParams){
	var todoList = todoListService.get("todo-list");
	var title = $routeParams.title;
	var index = arrayObjectIndexOf(todoList, "title", title);

	if(index == -1) window.location = "#/";

	$scope.todo = todoList[index];

	$scope.getColorClass = todoListService.getColorClass;

	$scope.getTitleClass = todoListService.getTitleClass;
}

function addTodoController($scope, todoListService){
	$scope.newTodo = {};

	$scope.Importance = [];
	Array.prototype.push.apply($scope.Importance, todoListService.getImportance());

	$scope.Status = [];
	Array.prototype.push.apply($scope.Status, todoListService.getStatus());

	var todoList = todoListService.get("todo-list");

	$scope.addTodo = function(){
		todoList.push($scope.newTodo);

		if(todoListService.set("todo-list", todoList)){
			message("success", "Successfully added!");
			window.location = "#/";
		} else {
			message("error", "An error ocurred!");
		}
	};
}

function editTodoController($scope, todoListService, $routeParams){
	var todoList = todoListService.get("todo-list");
	var title = $routeParams.title;
	var index = arrayObjectIndexOf(todoList, "title", title);

	if(index == -1) window.location = "#/";

	$scope.todo = todoList[index];

	$scope.Importance = [];
	Array.prototype.push.apply($scope.Importance, todoListService.getImportance());

	$scope.todo.due_date = new Date(todoList[index].due_date);

	$scope.Status = [];
	Array.prototype.push.apply($scope.Status, todoListService.getStatus());

	$scope.editTodo = function(){
		todoList[index] = $scope.todo;

		if(todoListService.set("todo-list", todoList)){
			message("success", "Successfully edited!");
			$scope.editTodo.$setPristine;
			window.location = "#/";
		} else {
			message("error", "An error ocurred!");
		}
	};
}
