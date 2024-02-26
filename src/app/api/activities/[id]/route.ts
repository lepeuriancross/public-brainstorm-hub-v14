// Api Route: Submit Event (by id)
/*----------------------------------------------------------------------------------------------------*/

/*---------- Imports ----------*/

// Config
import { configAccess } from '@/data/config';
import { Activity } from '@/types';
import errors from '@/data/errors';

// Scripts (node)
import { NextRequest, NextResponse } from 'next/server';
import { DecodedIdToken } from 'firebase-admin/auth';

// Scripts (local)
import { firestore, auth } from '@/firebase/lib/server';
import { filterActivityFetch } from '@/firebase/lib/filters';

/*---------- Route ----------*/

// Route
export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		// If no firestore ...
		if (!firestore) {
			// Return error - no firestore
			return new NextResponse('Internal Server Error : no firestore', {
				status: 500,
			});
		}

		// Get authToken
		const authToken =
			request.headers.get('authorization')?.split('Bearer ')[1] || null;

		// Get user token
		let user: DecodedIdToken | null = null;
		if (auth && authToken)
			try {
				user = await auth.verifyIdToken(authToken);
			} catch (error) {
				if (process.env.NODE_ENV === 'development') {
					console.error(error);
				}
			}

		// Get user access privilages
		const isUser =
			user?.role === 'user' ||
			user?.role === 'moderator' ||
			user?.role === 'admin';

		// If not user...
		if (configAccess.required && !isUser) {
			// Return error - you do not have permission
			return new NextResponse(
				'Internal Server Error : you do not have permission',
				{
					status: 403,
					statusText: errors['restricted/activities/403'],
				}
			);
		}

		// Define which collection to call, based on access privilages
		const firestoreCall = await firestore
			.collection('activities')
			.where('id', '==', params.id)
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
		// Return error - generic
		return new NextResponse('Internal Server Error', { status: 500 });
	}
}
