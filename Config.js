import firebase from 'firebase';
require('@firebase/firestore')
var firebaseConfig = {
    apiKey: "AIzaSyBcweRJYklIm8oohpPDzHNHSNsk1PmYZ1A",
    authDomain: "barter-system-d8b08.firebaseapp.com",
    projectId: "barter-system-d8b08",
    storageBucket: "barter-system-d8b08.appspot.com",
    messagingSenderId: "606457965907",
    appId: "1:606457965907:web:94d8455dc57fa653bf45a6"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  export default firebase.firestore();