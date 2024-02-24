// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: 'mern-estate-415209.firebaseapp.com',
	projectId: 'mern-estate-415209',
	storageBucket: 'mern-estate-415209.appspot.com',
	messagingSenderId: '631023141338',
	appId: '1:631023141338:web:9c49937b2e7f31ab43c0e3',
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
