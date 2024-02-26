// Firebase: Client
/*----------------------------------------------------------------------------------------------------*/

'use client';

/*---------- Imports ----------*/

// Config
// ...

// Scripts (node)
import { Auth, connectAuthEmulator, getAuth } from 'firebase/auth';
import { getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

/*---------- Config ----------*/

// Firebase config
const firebaseConfig = {
	apiKey: 'AIzaSyDt4vi4E5WS_OMibzV0hsR6imqELEgBLng',
	authDomain: 'global-hub-v14.firebaseapp.com',
	projectId: 'global-hub-v14',
	storageBucket: 'global-hub-v14.appspot.com',
	messagingSenderId: '1081071231898',
	appId: '1:1081071231898:web:7363888b87a253f45bd023',
};

/*---------- Init ----------*/

// Get currently initialized apps
const currentApps = getApps();

// Declare auth
let auth: Auth;

// Declare client
let client:
	| {
			app: ReturnType<typeof initializeApp>;
			auth: Auth;
			db: ReturnType<typeof getFirestore>;
	  }
	| undefined = undefined;

// Declare db
let db: ReturnType<typeof getFirestore>;

// If there's no initialized app, initialize one
if (!currentApps.length) {
	// Initialize app
	const app = initializeApp(firebaseConfig);

	// Get an auth instance
	auth = getAuth(app);

	// Get a db instance
	db = getFirestore(app);

	// Set client
	client = {
		app,
		auth,
		db,
	};
} else {
	// Get an auth instance
	auth = getAuth(currentApps[0]);

	// Get a db instance
	db = getFirestore(currentApps[0]);

	// Set client
	client = {
		app: currentApps[0],
		auth,
		db,
	};
}

// If using emulator, set environment variables
if (
	process.env.NEXT_PUBLIC_APP_ENV === 'emulator' &&
	process.env.NEXT_PUBLIC_EMULATOR_AUTH_PATH
) {
	connectAuthEmulator(
		auth,
		`http://${process.env.NEXT_PUBLIC_EMULATOR_AUTH_PATH}`
	);
}

/*---------- Exports ----------*/

export { auth, client };
