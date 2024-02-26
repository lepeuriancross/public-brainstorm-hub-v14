// Api Route: Submit Event (by id)
/*----------------------------------------------------------------------------------------------------*/

/*---------- Imports ----------*/

// Config
import { Activity } from '@/types';
import { configAccess } from '@/data/config';
import errors from '@/data/errors';

// Scripts (node)
import { NextRequest, NextResponse } from 'next/server';
import { DecodedIdToken } from 'firebase-admin/auth';

// Scripts (local)
import { firestore, auth } from '@/firebase/lib/server';
import {
	filterActivitySubmit,
	filterActivityFetch,
} from '@/firebase/lib/filters';

/*---------- Route ----------*/

export async function POST(
	request: NextRequest,
	{
		params,
	}: {
		params: {
			aid: string;
		};
	}
) {
	try {
		// Get body
		const body = await request.json();

		// If no body...
		if (!body) {
			// Return error - no body
			return new NextResponse(`Internal Server Error : no body`, {
				status: 400,
				statusText: errors['restricted/activity-submit/400'],
			});
		}

		// If no firestore...
		if (!firestore) {
			// Return error - no firestore
			return new NextResponse('Internal Server Error : no firestore', {
				status: 500,
				statusText: errors['restricted/activity-submit/500'],
			});
		}

		// Get authToken
		const authToken =
			request.headers.get('authorization')?.split('Bearer ')[1] || null;

		// Get user token
		let user: DecodedIdToken | null = null;
		if (auth && authToken)
			try {
				// Get user
				user = await auth.verifyIdToken(authToken);
			} catch (error) {
				// Return error - problem fetching user
				return new NextResponse(
					'Internal Server Error : problem fetching user',
					{
						status: 500,
						statusText: errors['restricted/activity-submit/500'],
					}
				);
			}

		// Get user access privilages
		const isUser =
			user?.role === 'user' ||
			user?.role === 'moderator' ||
			user?.role === 'admin';
		const isModerator = user?.role === 'moderator' || user?.role === 'admin';
		const isAdmin = user?.role === 'admin';

		// If not user...
		if (configAccess.required && !isUser) {
			// Return error - you do not have permission
			return new NextResponse(
				'Internal Server Error : you do not have permission',
				{
					status: 403,
					statusText: errors['restricted/activity-submit/403'],
				}
			);
		}

		// Get activity from collection
		let activityDocument = await firestore
			.collection('activities')
			.doc(params.aid)
			.get();

		// If activity...
		if (activityDocument.exists) {
			// Get activityData
			let activityData = activityDocument.data();

			// If user is not admin or moderator / If user is not the same as the creator of the event being updated...
			if (!isAdmin && !isModerator && user?.uid !== activityData?.uid) {
				// Return error - you do not have permission
				return new NextResponse(
					'Internal Server Error : you do not have permission',
					{
						status: 403,
						statusText: errors['restricted/activity-submit/403'],
					}
				);
			}

			// Filter client data
			const clientData = filterActivitySubmit({
				...body,
				datetimeEdited: new Date().toISOString(),
				...(user?.name ? { editor: user.name } : {}),
			});

			// If error...
			if (clientData.error) {
				// Return error
				return new NextResponse(`Forbidden : ${clientData.error.message}`, {
					status: 403,
					statusText: `Forbidden : ${clientData.error.message}`,
				});
			}

			// Update event
			await firestore
				.collection('activities')
				.doc(params.aid)
				.set(
					{
						...clientData.data,
					},
					{ merge: true }
				);
		} else {
			// Filter client data
			const clientData = filterActivitySubmit({
				...body,
				uid: user?.uid,
				datetime: new Date().toISOString(),
				...(user?.name ? { creator: user.name } : {}),
			});

			// If error...
			if (clientData.error) {
				// Return error
				return new NextResponse(`Forbidden : ${clientData.error.message}`, {
					status: 403,
					statusText: `Forbidden : ${clientData.error.message}`,
				});
			}

			// Create event
			await firestore
				.collection('activities')
				.doc(params.aid)
				.set(
					{
						...clientData.data,
					},
					{ merge: true }
				);
		}

		// Define which collection to call, based on access privilages
		const firestoreCall = await firestore
			.collection('activities')
			.where('id', '==', body.id ?? '??')
			.get();

		// Get events from collection (depending on access)
		const activitiesResponse = await firestoreCall;
		const activitiesData = activitiesResponse.docs.map(
			(doc) => doc.data() as Activity
		);

		// Filter client data
		const clientData = activitiesData.map((activity) => {
			// Get client data
			const dayData = filterActivityFetch(activity);

			// Return client data
			return dayData.data;
		});

		// Return event
		return NextResponse.json(clientData);
	} catch (error) {
		console.log('error', error);
		// Return error - generic
		return new NextResponse('Internal Server Error', {
			status: 500,
		});
	}
}
