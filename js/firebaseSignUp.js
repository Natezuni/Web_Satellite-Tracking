import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js';
import {
	getAuth, createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.8.1/firebase-auth.js';

const firebaseConfig = {
	apiKey: 'AIzaSyB7v8cxTdsNcMEdi_zp3Z5sL0H96ixCGIU',
	authDomain: 'nasasatellitetracker.firebaseapp.com',
	projectId: 'nasasatellitetracker',
	storageBucket: 'nasasatellitetracker.appspot.com',
	messagingSenderId: '897077974522',
	appId: '1:897077974522:web:52d5c7fc68ab79c3b24043',
	measurementId: 'G-JX51ZZ2HX8'
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export function signUp() {
	let inputs = getInputs();
	if (validationSignUp()) {
		createUserWithEmailAndPassword(auth, inputs.email, inputs.password)
			.then((userCredential) => {
				// Signed in
				const user = userCredential.user;
				// ...
				alert("User has been created!")
				console.log('Created');
				window.open("/views/")
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				// ..
				console.log(errorCode + errorMessage);
			});
	} else {
		//InnerHTML repsonse...
		alert('Make sure your password and password confirm match, also make sure your password has 6+ characters');
	}
}



function getInputs() {
	let email = document.getElementById('email').value,
		password = document.getElementById('password').value,
		confirmPassword = document.getElementById('confirmPassword').value;
	return { email, password, confirmPassword };
}



function validationSignUp() {
	let inputs = getInputs();

	if (inputs.email == '' || inputs.password == '' || inputs.confirmPassword == '') {
		return false;
	} else if (inputs.password.length < 6) {
		return false;
	} else if (inputs.password != inputs.confirmPassword) {
		return false;
	} else {
		return true;
	}
}

//works the way it is, needs to work with user input.
