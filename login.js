// wait for html to finish loading
document.addEventListener('DOMContentLoaded', loginFormInitializer);

function loginFormInitializer() {
    // check if login form exists
    const loginForm = document.querySelector('#loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', submitHandler);
    }
}

// run functions to validate inputs
function submitHandler(event) {
    // wait to check inputs first
    event.preventDefault();

    // retrieve username and password
    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;

    // check if username and password have values and are valid
    let isValid = true;

    if (username === '') {
        alert('Enter your username');
        isValid = false;
    }

    if (password === '') {
        alert('Enter your password');
        isValid = false;
    }

    if (isValid) {
        authenticateUser(username, password);
    }
}

// check if inputted username and password match, 
// if they do then load main page 
function authenticateUser(username, password) {
    if (username === 'testuser' && password === 'password') {
        alert('Login Successful');
        window.location.href = 'homepage.html';
    }
}