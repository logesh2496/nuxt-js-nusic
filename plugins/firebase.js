import firebase from "firebase";

var firebaseConfig = {
    apiKey: "AIzaSyB1UuyDuWMEqFNVVH5Wl3CLAhv5MvHv3B4",
    authDomain: "nusic-mini.firebaseapp.com",
    projectId: "nusic-mini",
    storageBucket: "nusic-mini.appspot.com",
    messagingSenderId: "642701431967",
    appId: "1:642701431967:web:bc6264b415869e74f9beaa"
};

let app = null;

if (!firebase.apps.length) {
    app = firebase.initializeApp(firebaseConfig);
}

export default app;