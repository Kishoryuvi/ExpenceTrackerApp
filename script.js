let isEditing = false;
let editdescription = '';
function saveToLocalStorage(event) {
    event.preventDefault();
    const expenseamount = event.target.amount.value;
    const description = event.target.description.value;
    const category = event.target.category.value;
    const userDetails = {
        expenseamount: expenseamount,
        description: description,
        category: category,
    };
    if (isEditing) {
        updateUserData(description, userDetails);
        isEditing = false;
        editdescription = '';
    } else {
        addUserData(userDetails);
    }
    event.target.reset();
}


function addUserData(userDetails) {
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    storedUsers.push(userDetails);
    localStorage.setItem('users', JSON.stringify(storedUsers));
    localStorage.setItem(userDetails.email, JSON.stringify(userDetails));
    showUserOnScreen(userDetails);
}


function updateUserData(description, userDetails) {
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    const updatedUsers = storedUsers.map(user => {
        if (user.description === description) {
            return userDetails;
        }
        return user;
    });
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    localStorage.setItem(userDetails.description, JSON.stringify(userDetails));
    updateUserOnUI(description, userDetails);
}


function showUserOnScreen(user) {
    const parentElement = document.getElementById('listofitems');
    const listItem = document.createElement('li');
    listItem.setAttribute('data-description', user.description);
    listItem.textContent = user.expenseamount + ' - ' + user.description + ' - ' + user.category;
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', function() {
        deleteUser(user.description);
    });
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', function() {
        editUser(user.description);
    });
    listItem.appendChild(deleteButton);
    listItem.appendChild(editButton);
    parentElement.appendChild(listItem);
}


function deleteUser(description) {
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    const updatedUsers = storedUsers.filter(user => user.description !== description);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    localStorage.removeItem(description);
    removeUserFromUI(description);
}


function removeUserFromUI(description) {
    const listItem = document.querySelector(`li[data-description="${description}"]`);
    listItem.remove();
}


function editUser(description) {
    isEditing = true;
    editdescription = description;
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    const storedUser = storedUsers.find(user => user.description === description);
  if (storedUser) {
        const form = document.querySelector('form');
        form.amount.value = storedUser.expenseamount;
        form.description.value = storedUser.description;
        form.category.value = storedUser.category;
    }
}


function updateUserOnUI(description, userDetails) {
    const listItem = document.querySelector(`li[data-description="${description}"]`);
    listItem.textContent = userDetails.expenseamount + ' - ' + userDetails.description + ' - ' + userDetails.category;
}


// Load existing users from local storage and display them on the UI
window.addEventListener('DOMContentLoaded', function() {
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    storedUsers.forEach(function(user) {
        showUserOnScreen(user);
    });
});
