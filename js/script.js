// scripts

// log to console
console.log("Calculator can calculate...");

// store buttons in dom
var buttons = document.querySelectorAll(".button");

// store screen in dom
var screen = document.getElementById("screen");

// store save buttons in dom
var saveButtons = document.querySelectorAll(".save");

// for of loop to add event listener to each button
for (var button of buttons) {

    // add a click event to each button to run the buttonPress function
    button.addEventListener("click", buttonPress);

}

// function to run when button pressed
function buttonPress(e) {

    // get button type dataset value
    var targetType = e.currentTarget.dataset.type;

    // if target is option button (save/cancel)
    if (targetType === "option") {

        console.log(targetType);

        // get the target action type dataset
        var targetAction = e.currentTarget.dataset.actiontype;

        // if target is save
        if (targetAction === "save") {

            // log the target action
            console.log(targetAction);

            // empty variable to use outside scope
            var savedCalc

            // function to add saved items to local storage
            function addToDatabase() {

                // get the date
                var date = new Date();

                // get the date, month, year, hour and minute
                var theDate = date.getDate(),
                    theMonth = date.getMonth(),
                    theYear = date.getFullYear(),
                    theHour = date.getHours(),
                    theMinute = ('0' + date.getMinutes()).slice(-2);

                // variable to create a string for the date/time
                var time = theDate + "/" + theMonth + "/" + theYear + " | " + theHour + ":" + theMinute;

                // get the array in localstorage
                var calcs = get_calcs();

                if (screen.textContent.length >= 1) {

                    // prompt to ask user to specify a name

                    // run the function
                    userPrompt();

                    // function to ask the user to enter a name and check the length of input
                    function userPrompt() {
                        // prompt to ask user to specify a name
                        var savedCalc = prompt("To save this calculation, enter a name.");

                        // if user input was cancel (null)
                        if (savedCalc === null) {

                        	alert("The calculation has not been saved.")

                        	// if promot answer was more 5 or more characters
                        } else if (savedCalc.length >= 5) {

                            // create a new object for each calculation
                            var savedCalcObj = new Object;

                            // add the name of saved calculation to the object
                            savedCalcObj.name = savedCalc;

                            // add the actual calculation to the object 
                            savedCalcObj.calculation = screen.dataset.calculation;

                            // add the time to the object
                            savedCalcObj.time = time;

                            // push the object in to the calcs array 
                            calcs.push(savedCalcObj);

                            // add to storage
                            localStorage.setItem('calc', JSON.stringify(calcs));

                            // run show function to update list
                            displayEntries();

                            alert("The calculation has been saved.")

                            // if less than 5 characters
                        } else if(savedCalc.length < 5) {
                            // alert to inform user
                            alert("Sorry, not enough characters. Please try again.");

                            // re run the function to ask user to input a name
                            userPrompt();
                        }
                    }

                } else {

                    // alert to inform user they cant save nothing
                    alert("You can't save nothing!");

                }

                return false;

            }

            // run add function
            addToDatabase();

            // if target action is cancel
        } else if (targetAction === "cancel") {

            // log action to console
            console.log(targetAction);

            for (var saveButton of saveButtons) {
                saveButton.classList.add("stop-save");
            }

            // clear the data-calculation attribute
            screen.setAttribute("data-calculation", "");

            // clear the screen
            screen.textContent = "";

        }

        // if targettype is a number button
    } else if (targetType === "number") {

        for (var saveButton of saveButtons) {
            saveButton.classList.add("stop-save");
        }

        // log target type
        console.log(targetType);

        // get the target number
        var targetNumber = e.currentTarget.dataset.number;

        // log the target number to console
        console.log(targetNumber);

        // add the target number to the screen div
        screen.textContent += targetNumber;

        // if target type is an operator
    } else if (targetType === "operator") {

        // log target type to console
        console.log(targetType);

        // loop to add class to save buttons
        for (var i = 0; i < saveButtons.length; i++) {

        	// add class to save buttons to prevent saving nothing
            saveButtons[i].classList.add("stop-save")

        }

        // get the operator
        var targetOperator = e.currentTarget.dataset.operator;

        // log the target operator to console
        console.log(targetOperator);

        // if targetOperator is not equal
        if (targetOperator !== "=") {

            // add to calculator screen
            screen.textContent += targetOperator;

            // if target operator is equal
        } else if (targetOperator === "=") {

            // for of loop to add class top savebuttons
            for (var i = 0; i < saveButtons.length; i++) {
                saveButtons[i].classList.remove("stop-save");
            }

            // get the text content of calculator screen
            var theCalc = screen.textContent;

            // set the data-calculation of screen attribute to be the calculation
            screen.setAttribute("data-calculation", theCalc);

            // try/catch/finally used to inform user of calculation errors
            try {

                // performs the maths
                var result = eval(screen.textContent);

                // if there are any errors
            } catch (err) {

                // if error is a SyntaxError
                if (err instanceof SyntaxError) {

                    // inform user as an alert
                    alert("Error, please try again.");

                }

                // if no errors, display the result
            } finally {

            	// insert the results
                screen.textContent = result;

            }
        }
    }
}

// function to get the array
function get_calcs() {

    // create new array
    var calcs = new Array;

    // retrieve the calc item in local storage
    var calcs_str = localStorage.getItem('calc');

    // if not null
    if (calcs_str !== null) {

        // parse the string
        calcs = JSON.parse(calcs_str);

    }

    // return the array
    return calcs;
}


// to remove item from the database
function removeFromDatabase() {

	var confirmDelete = confirm("Are you sure you want to delete the calculation?");

	if(confirmDelete) {

    // retrieve the id from the attribute
    var id = this.getAttribute('id');

    // get the array
    var calcs = get_calcs();

    // remove specific object from local storage
    calcs.splice(id, 1);

    // update the local storage
    localStorage.setItem('calc', JSON.stringify(calcs));

    // run the show function
    displayEntries();

    return false;

    alert("This calculation has been deleted")

	} else if (!confirmDelete) {
		alert("This calculation has not been deleted.");
	}
}

// update the list/display new saved calculations
function displayEntries() {

    // get the calcs array
    var calcs = get_calcs();

    // opening tag
    var template = "<div class='saved-calcs-wrapper'>"

    // loop to add the relevant data
    for (var i = 0; i < calcs.length; i++) {

        // add code after the opening tag
        template += '<div class="saved-maths" id="saved-calc"><div class="name-date"><span class="maths-name" data-saved="' + calcs[i].calculation + '">' + calcs[i].name + " (" + calcs[i].time + ')</span></div><span class="delete-button" id="' + i + '">Delete</span></div>'

    };

    // add this at the end 
    template += "</div>";

    // store element in dom
    var savedWrapper = document.getElementById('saved-calcs-wrapper');

    // insert full template in to the savedWrapper element
    savedWrapper.innerHTML = template;

    // store buttons in dom
    var savedCalcButtons = document.querySelectorAll(".maths-name");

    // for of loop to add event listener
    for (savedCalcButton of savedCalcButtons) {


        // event listener to run addToScree function on click
        savedCalcButton.addEventListener("click", addToScreen);

    }

    // store buttons in dom
    var deleteButtons = document.querySelectorAll('.delete-button');

    // for of loop to add event listener
    for (var deleteButton of deleteButtons) {

        // add event listener to run removeFromDatabase function on click
        deleteButton.addEventListener('click', removeFromDatabase);

    };
}

// run the function
displayEntries();

// add to screen function to display calculation on screen
function addToScreen(e) {

    // retrieve the saved dataset from the clicked element
    var targetCalc = e.currentTarget.dataset.saved;

    // log to console
    console.log(targetCalc)

    // clear the screen
    screen.textContent = "";

    // add the calculation to the screen
    screen.textContent = targetCalc;

}