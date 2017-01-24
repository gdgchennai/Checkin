import { FirebaseKeys } from '../Config';
import * as Firebase from "firebase";

var config = {
    apiKey: FirebaseKeys.FIREBASE_API_KEY,
    authDomain: FirebaseKeys.AUTH_DOMAIN,
    databaseURL: FirebaseKeys.DATABASE_URL,
    storageBucket: FirebaseKeys.STORAGE_BUCKET,
    messagingSenderId: FirebaseKeys.MESSAGING_SENDER_ID
};

Firebase.initializeApp(config);

export default Firebase;