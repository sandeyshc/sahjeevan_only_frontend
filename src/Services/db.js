// import React from 'react';
import firebase from 'firebase';

  var firebaseConfig = {
    // apiKey: "AIzaSyBIT55x_JsDc8GYYSJPhFqqHPNAuFwXVQI",
    // authDomain: "chat-app-freelancer.firebaseapp.com",
    // projectId: "chat-app-freelancer",
    // storageBucket: "chat-app-freelancer.appspot.com",
    // messagingSenderId: "276121844152",
    // appId: "1:276121844152:web:774d89d2505667f090b74d"
    apiKey: "AIzaSyCpRSiz7YiDvrwIde9xur1ZI0lpFGtZXHg",
    authDomain: "test-app-48429.firebaseapp.com",
    databaseURL: "https://test-app-48429-default-rtdb.firebaseio.com",
    projectId: "test-app-48429",
    storageBucket: "test-app-48429.appspot.com",
    messagingSenderId: "297955208252",
    appId: "1:297955208252:web:daa478effe942929f1a739"
  };
  // Initialize Firebase
  const f = firebase;
  const firebaseApp=firebase.initializeApp(firebaseConfig);
  const db = firebaseApp.firestore();
  const realtime=firebaseApp.database();

  export { db,f,realtime };

export default firebase;