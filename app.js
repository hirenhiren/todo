// Function to handle form submission
function submitHandler(event) {
    event.preventDefault();

    // Get user input values
    let userDate = document.getElementById('dateField').value;
    let userTime = document.getElementById('timeField').value;
    let userTask = document.getElementById('taskField').innerText.trim(); // Trim any leading or trailing whitespace
    let userTaskStatus = 'Pending';

    // Check if any of the fields are empty
    if (!userDate || !userTime || !userTask) {
        alert("Please fill in all fields.");
        return; // Exit the function if any field is empty
    }

    // Check if the selected date is in the past
    let currentDate = new Date().toISOString().split('T')[0]; // Get the current date in the format "YYYY-MM-DD"
    if (userDate < currentDate) {
        alert("Please select a date from today onwards.");
        return; // Exit the function if the selected date is in the past
    }

    // Get the current time in HH:MM format
    let currentTime = new Date().toTimeString().slice(0, 5);

    // Check if the selected time is in the past
    if (userDate === currentDate && userTime < currentTime) {
        alert("Please select a time from the current time onwards.");
        return; // Exit the function if the selected time is in the past
    }

    // Create a new row with user input values
    let newRow = createTableRow(userDate, userTime, userTask, userTaskStatus);

    // Append the new row to the table
    let providedTable = document.getElementById('tbl');
    providedTable.appendChild(newRow);

    // Save the new entry to local storage
    saveEntryToLocal(userDate, userTime, userTask, userTaskStatus);

    // Clear input fields after submission
    document.getElementById('dateField').value = '';
    document.getElementById('timeField').value = '';
    document.getElementById('taskField').innerText = ''; // Use innerText instead of innerHTML
}

// Set the minimum time for the time input field to the current time
document.getElementById('timeField').min = new Date().toTimeString().slice(0, 5);


// Function to create a new table row
function createTableRow(date, time, task, status, index) {
    let newRow = document.createElement('tr');
    newRow.dataset.taskIndex = index; // Add a data attribute to store the task index
    newRow.innerHTML = `
        <td>${date}</td>
        <td>${time}</td>
        <td>${task}</td>
        <td>${status}</td>
        <td><input type="checkbox" name="statusCheck" onchange="updateStatus(this)" class="checkbox-status" ${status === 'Completed' ? 'checked' : ''}/></td>
        <td><button class="edit-button" onclick="editEntry(this)">Edit</button></td>
        <td><button class="delete-button" onclick="deleteEntry(this)">Delete</button></td>`;
    return newRow;
}

// Function to delete entry
function deleteEntry(button) {
    let row = button.parentNode.parentNode;
    let taskIndex = row.dataset.taskIndex;

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.splice(taskIndex, 1); // Remove the task at the specified index
    localStorage.setItem('tasks', JSON.stringify(tasks)); // Update tasks in local storage

    // Remove the corresponding row from the table
    let table = document.getElementById('tbl');
    table.deleteRow(row.rowIndex);
}

// Function to save entry to local storage
function saveEntryToLocal(date, time, task, status) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let newTask = { date, time, task, status };
    tasks.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to load entries from local storage
function getEntriesFromLocal() {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach((work, index) => {
        // Create a new row for each task
        let newRow = createTableRow(work.date, work.time, work.task, work.status);
        let selectTable = document.getElementById('tbl');
        selectTable.appendChild(newRow);
    });
}

// Function to update task status
function updateStatus(checkbox) {
    const statusCell = checkbox.parentNode.previousElementSibling; // Get status cell
    statusCell.textContent = checkbox.checked ? 'Completed' : 'Pending'; // Update status text

    updateStatusInLocalStorage(checkbox); // Call function to update status in localStorage
}

// Function to update status in local storage
function updateStatusInLocalStorage(checkbox) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let taskIndex = Array.from(checkbox.parentNode.parentNode.parentNode.children).indexOf(checkbox.parentNode.parentNode) - 1; // Find index of task row
    tasks[taskIndex].status = checkbox.checked ? 'Completed' : 'Pending'; // Update status in tasks array
    localStorage.setItem('tasks', JSON.stringify(tasks)); // Save updated tasks array to localStorage
}

// Function to handle editing of task
function editEntry(button) {
    let row = button.parentNode.parentNode;
    let rowIndex = row.rowIndex - 1; // Adjust for header row
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let taskToEdit = tasks[rowIndex];

    // Populate the form fields with task details for editing
    document.getElementById('dateField').value = taskToEdit.date;
    document.getElementById('timeField').value = taskToEdit.time;
    let taskField = document.getElementById('taskField');
    taskField.innerHTML = taskToEdit.task;

    // Show the update button and hide the submit button
    document.getElementById('submitBtn').style.display = 'none';
    document.getElementById('updateBtn').style.display = 'inline-block';
    document.getElementById('submitBtn').disabled = true; // Disable the submit button
    document.getElementById('updateBtn').disabled = false; // Ensure the update button is enabled
    document.getElementById('updateBtn').dataset.index = rowIndex; // Store the index of the task being edited

    // Show the highlight button
    document.getElementById('highlightBtn').style.display = 'inline-block';
}

// Function to handle highlighting of task text
function highlightText() {
    // Get the taskField element
    let taskField = document.getElementById('taskField');

    // Check if there is a selection
    let selection = window.getSelection();
    if (selection.toString() !== '') {
        // Apply bold formatting to the selected text
        document.execCommand('bold', false, null);
    }
}

function highlightText() {
    // Get the taskField element
    let taskField = document.getElementById('taskField');

    // Check if there is a selection
    let selection = window.getSelection();
    if (selection.toString() !== '') {
        // Wrap the selected text in <b> tags
        let newText = taskField.innerHTML.replace(selection.toString(), `<b>${selection.toString()}</b>`);
        taskField.innerHTML = newText;
    }
}



// Function to update edited entry
function updateEntry() {
    // Prevent form submission
    event.preventDefault();

    // Get the index of the task being edited
    let index = document.getElementById('updateBtn').dataset.index;

    // Update the task details in localStorage at the specified index
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks[index].date = document.getElementById('dateField').value;
    tasks[index].time = document.getElementById('timeField').value;
    tasks[index].task = document.getElementById('taskField').innerHTML; // Use innerHTML to preserve HTML formatting
    localStorage.setItem('tasks', JSON.stringify(tasks));

    // Clear input fields after updating
    document.getElementById('dateField').value = '';
    document.getElementById('timeField').value = '';
    document.getElementById('taskField').innerText = ''; // Use innerText to clear the taskField

    // Change update button to submit button
    document.getElementById('submitBtn').style.display = 'inline-block';
    document.getElementById('updateBtn').style.display = 'none';

    // Update the table row in the DOM
    let rowToUpdate = document.getElementById('tbl').rows[parseInt(index) + 1]; // Add 1 to account for header row
    rowToUpdate.cells[0].textContent = tasks[index].date;
    rowToUpdate.cells[1].textContent = tasks[index].time;
    rowToUpdate.cells[2].innerHTML = tasks[index].task; // Use innerHTML to render HTML content
}


// Load entries from local storage on page load
getEntriesFromLocal();
