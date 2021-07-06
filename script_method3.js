var enterButton = document.getElementById("enter");
var clearButton = document.getElementById("clear");
var input = document.getElementById("userInput");
var ul = document.querySelector("ul");
var item = document.getElementsByTagName("li");
var db = window.localStorage;

function getListFromStorage() {
	var list = db.getItem('tasks');
	if (list.length > 0) {
	    return JSON.parse(list);
	} else {
		return []
	}
    
}

function saveState() {
	var tasks = [];
	var items = ul.getElementsByTagName("li");
    for (var i = 0; i < items.length; ++i) {
    	var task = items[i].childNodes[0].nodeValue
    	console.log(task)
        tasks.push({task: task, state: items[i].classList.value})
    }
    db.setItem('tasks', JSON.stringify(tasks))
    console.log("TASKS SAVED")
    console.log(tasks)
}

function restoreState() {
	var tasks = getListFromStorage();
	if (tasks.length > 0) {
		for (task of tasks) {
		    createListElement(task.task, task.state)
	    }
	}
	
}

function inputLength(){
	return input.value.length;
} 

function listLength(){
	return item.length;
}

function createListElement(taskName, taskState) {
	var li = document.createElement("li"); // creates an element "li"
	li.appendChild(document.createTextNode(taskName)); //makes text from input field the li text
	ul.appendChild(li); //adds li to ul
	input.value = ""; //Reset text input field

	// Restore state
	if (taskState === "done") {
		crossOut();
	}


	//START STRIKETHROUGH
	// because it's in the function, it only adds it for new items
	function crossOut() {
		li.classList.toggle("done");
	}

	li.addEventListener("click",crossOut);
	//END STRIKETHROUGH


	// START ADD DELETE BUTTON
	var dBtn = document.createElement("button");
	dBtn.appendChild(document.createTextNode("X"));
	li.appendChild(dBtn);
	dBtn.addEventListener("click", deleteListItem);
	// END ADD DELETE BUTTON


	//ADD CLASS DELETE (DISPLAY: NONE)
	function deleteListItem(){
		li.remove();
	}
	//END ADD CLASS DELETE
}


function addListAfterClick(){
	if (inputLength() > 0) { //makes sure that an empty input field doesn't create a li
		createListElement(input.value);
	}
}

function addListAfterKeypress(event) {
	if (inputLength() > 0 && event.which ===13) { //this now looks to see if you hit "enter"/"return"
		//the 13 is the enter key's keycode, this could also be display by event.keyCode === 13
		createListElement(input.value);
	} 
}

function clearTasks() {
	var items = ul.getElementsByTagName("li");
	var len = items.length
    // for (var i = 0; i < len; ++i) {
    // 	ul.removeChild(ul.firstChild);
    // }
    ul.innerHTML = ''; // works but does not remove event handlers which may cause a memory leak
    tasks=[];
	db.setItem('tasks', tasks);
	db.clear();
}


enterButton.addEventListener("click",addListAfterClick);

clearButton.addEventListener("click",clearTasks);

input.addEventListener("keypress", addListAfterKeypress);

window.addEventListener("beforeunload", saveState);

window.addEventListener("load", restoreState);

if ("serviceWorker" in navigator) {
	// register service worker
	navigator.serviceWorker.register("sw.js");
  }
