// Firebase: Server Functions
/*----------------------------------------------------------------------------------------------------
* Import function triggers from their respective submodules:
* import {onCall} from "firebase-functions/v2/https";
* import {onDocumentWritten} from "firebase-functions/v2/firestore";
* See a full list of supported triggers at https://firebase.google.com/docs/functions
----------------------------------------------------------------------------------------------------*/

/*---------- Imports ----------*/

// Scripts (node)
import { firestore } from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { auth, config } from 'firebase-functions';

initializeApp(config().firebase);

/*---------- Static data ----------*/

// Admin email addresses
const adminEmails = ['richard.cross@global.com', 'lepeuriancross@gmail.com'];

// Moderator email addresses
const moderatorEmails = ['hannah.davies@global.com'];

/*---------- Methods ----------*/

// Function - onUserCreate
export const onUserCreate = auth.user().onCreate(async (user) => {
	// Get defaultValues
	const defaultValues = {
		uid: user.uid,
		name: user.displayName ?? 'Unknown',
		nameToLowerCase: (user.displayName ?? 'Unknown').toLowerCase(),
		email: user.email,
		imageUrl: user.photoURL ?? false,
		access: 'user',
	};

	// If user email...
	if (user.email) {
		// Get userEmail
		const userEmail = user.email.toLowerCase();

		// Loop adminEmails
		for (let e = 0; e < adminEmails.length; e++) {
			const adminEmail = adminEmails[e].toLowerCase();

			// If email matches
			if (userEmail === adminEmail) {
				// Store admin user
				await firestore()
					.doc(`users/${user.uid}`)
					.create({
						role: 'admin',
						...defaultValues,
					});

				// Store custom claims
				const customClaims = {
					role: 'admin',
				};

				try {
					await getAuth().setCustomUserClaims(user.uid, customClaims);
				} catch (error) {
					if (process.env.NODE_ENV === 'development') {
						console.error(error);
					}
				}

				// Return
				return;
			}
		}

		// Loop moderatorEmails
		for (let e = 0; e < moderatorEmails.length; e++) {
			const moderatorEmail = moderatorEmails[e].toLowerCase();

			// If email matches
			if (userEmail === moderatorEmail) {
				// Store admin user
				await firestore()
					.doc(`users/${user.uid}`)
					.create({
						role: 'moderator',
						...defaultValues,
					});

				// Store custom claims
				const customClaims = {
					role: 'moderator',
				};

				try {
					await getAuth().setCustomUserClaims(user.uid, customClaims);
				} catch (error) {
					if (process.env.NODE_ENV === 'development') {
						console.error(error);
					}
				}

				// Return
				return;
			}
		}

		// Get email domain
		const domain = userEmail.split('@').pop();

		// If global domain...
		if (domain === 'global.com') {
			// Store standard user
			await firestore()
				.doc(`users/${user.uid}`)
				.create({
					role: 'user',
					...defaultValues,
				});

			// Store custom claims
			const customClaims = {
				role: 'user',
			};

			try {
				await getAuth().setCustomUserClaims(user.uid, customClaims);
			} catch (error) {
				if (process.env.NODE_ENV === 'development') {
					console.error(error);
				}
			}

			// Return
			return;
		}
	}

	// Store guest user without access privilages
	await firestore()
		.doc(`users/${user.uid}`)
		.create({
			role: 'guest',
			...defaultValues,
		});

	// Store custom claims
	const customClaims = {
		role: 'guest',
	};

	try {
		await getAuth().setCustomUserClaims(user.uid, customClaims);
	} catch (error) {
		if (process.env.NODE_ENV === 'development') {
			console.error(error);
		}
	}

	// Return
	return;
});
