// Api Route: Fetch Events (by mid)
/*----------------------------------------------------------------------------------------------------*/

/*---------- Imports ----------*/

// Config
import { Event } from '@/types';
import { configAccess } from '@/data/config';
import errors from '@/data/errors';

// Scripts (node)
import { NextRequest, NextResponse } from 'next/server';
import { DecodedIdToken } from 'firebase-admin/auth';

// Scripts (local)
import { firestore, auth } from '@/firebase/lib/server';
import { filterEventFetch } from '@/firebase/lib/filters';

/*---------- Route ----------*/

// Route
export async function GET(request: NextRequest) {
	try {
		// Get searchParams
		const searchParams = request.nextUrl?.searchParams;
		if (!searchParams?.has('mid')) {
			// Return error - no mid
			return new NextResponse('Internal Server Error', {
				status: 400,
				statusText: errors['restricted/events/400'],
			});
		}
		const mid = searchParams.get('mid')?.toLowerCase();

		// If no firestore...
		if (!firestore) {
			// Return error - no firestore
			return new NextResponse(`Internal Server Error`, {
				status: 500,
				statusText: errors['restricted/firestore/500'],
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
				// Return error - no firestore
				return new NextResponse(`Internal Server Error`, {
					status: 500,
					statusText: errors['restricted/user/500'],
				});
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
			// Return error - no searchParams
			return new NextResponse('Internal Server Error', {
				status: 500,
				statusText: errors['restricted/events/403'],
			});
		}

		// Define which collection to call, based on access privilages
		const firestoreCall =
			user && isAdmin
				? firestore
						.collection('events')
						.where('access', 'in', ['guest', 'user', 'moderator', 'admin'])
						.where('mid', '==', mid)
						.get()
				: user && isModerator
				? firestore
						.collection('events')
						.where('access', 'in', ['guest', 'user', 'moderator'])
						.where('mid', '==', mid)
						.get()
				: user && isUser
				? firestore
						.collection('events')
						.where('access', 'in', ['guest', 'user'])
						.where('mid', '==', mid)
						.get()
				: firestore
						.collection('events')
						.where('access', 'in', ['guest'])
						.where('mid', '==', mid)
						.get();

		// Get events from collection (depending on access)
		const eventsResponse = await firestoreCall;
		const eventsData = eventsResponse.docs.map((doc) => doc.data() as Event);

		// Filter client data
		const clientData = eventsData.map((event) => {
			// Get client data
			const dayData = filterEventFetch(event);

			// Return client data
			return dayData.data;
		});

		// Return users
		return NextResponse.json(clientData);
	} catch (error) {
		// Return error - generic
		return new NextResponse('Internal Server Error', { status: 500 });
	}
}
