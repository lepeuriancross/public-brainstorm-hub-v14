// Firebase: Server
/*----------------------------------------------------------------------------------------------------*/

/*---------- Imports ----------*/

// Config
import serviceAccount from '@/firebase/serviceAccountKey.json';

// Scripts (node)
import { credential } from 'firebase-admin';
import { ServiceAccount, getApps, initializeApp } from 'firebase-admin/app';
import { Auth, getAuth } from 'firebase-admin/auth';
import { Firestore, getFirestore } from 'firebase-admin/firestore';

/*---------- Init ----------*/

// Get currently initialized apps
const currentApps = getApps();

// Declare firestore
let firestore: Firestore | undefined = undefined;
let auth: Auth | undefined = undefined;

// If there's no initialized app, initialize one
if (!currentApps.length) {
	// If using emulator, set environment variables
	if (process.env.NEXT_PUBLIC_APP_ENV === 'emulator') {
		process.env['FIRESTORE_EMULATOR_HOST'] =
			process.env.NEXT_PUBLIC_EMULATOR_FIRESTORE_PATH;
		process.env['FIREBASE_AUTH_EMULATOR_HOST'] =
			process.env.NEXT_PUBLIC_EMULATOR_AUTH_PATH;
	}

	// Initialize app
	const app = initializeApp({
		credential: credential.cert(serviceAccount as ServiceAccount), // eslint-disable-line no-use-before-define
	});

	// Get a Firestore instance
	firestore = getFirestore(app);
	auth = getAuth(app);
} else {
	// Get a Firestore instance
	firestore = getFirestore(currentApps[0]);
	auth = getAuth(currentApps[0]);
}

/*---------- Exports ----------*/

export { firestore, auth };
