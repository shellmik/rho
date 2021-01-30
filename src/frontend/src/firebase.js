import firebase from 'firebase/app'
import 'firebase/database';
import 'firebase/auth'

// Get a Firestore instance
firebase.initializeApp({
  apiKey: "AIzaSyDmFAe3xvLEpJIb6oeBMBaP9vL9v_ce0dU",
  authDomain: "cityhack21-6404b.firebaseapp.com",
  databaseURL: "https://cityhack21-6404b-default-rtdb.firebaseio.com",
  projectId: "cityhack21-6404b",
  storageBucket: "cityhack21-6404b.appspot.com",
  messagingSenderId: "59151853397",
  appId: "1:59151853397:web:114a412b55102a146c71dc",
  measurementId: "G-RLLP663YT3"
});

export const db = firebase.database()
export const auth = firebase.auth()

export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      unsubscribe()
      resolve(user)
    }, reject)
  })
}

export const emailAuthProvider = firebase.auth.EmailAuthProvider
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider()
googleAuthProvider.setCustomParameters({ prompt: 'select_account' })

export const signInWithGoogle = () => auth.signInWithPopup(googleAuthProvider)

// Export types that exists in Firestore
// This is not always necessary, but it's used in other examples
// const { Timestamp, GeoPoint } = firebase.firestore
// export { Timestamp, GeoPoint }

// if using Firebase JS SDK < 5.8.0
// db.settings({ timestampsInSnapshots: true })
