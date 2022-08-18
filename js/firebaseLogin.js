import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js';
import {
	getAuth,
	signInWithEmailAndPassword
} from 'https://www.gstatic.com/firebasejs/9.8.1/firebase-auth.js';

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


export function signIn() {
    let inputs = getInputs();
	if (validationLogin()) {
		signInWithEmailAndPassword(auth, inputs.loginEmail, inputs.loginPassword)
			.then((userCredential) => {
				// Signed in
				const user = userCredential.user;
				console.log("Signed in!");

                window.open("/views/index.html", "_self")
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
			});
	} else {
		alert('Make sure you are entering the right email & password!');
		//turn into html
	}
}

function getInputs() {
	let loginEmail = document.getElementById('email').value,
		loginPassword = document.getElementById('password').value;
	return { loginEmail, loginPassword };
}

function validationLogin() {
	let inputs = getInputs();

	return !(inputs.loginEmail == '' || inputs.loginPassword == '');
}
