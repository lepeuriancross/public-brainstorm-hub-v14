// Api Route: Fetch Event (by id)
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

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
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
				statusText: errors['restricted/event/403'],
			});
		}

		// Get event from collection
		const eventResponse = await firestore
			.collection('events')
			.doc(params.id)
			.get();

		// If no event...
		if (!eventResponse.exists) {
			// Return error - no event
			return new NextResponse(`Internal Server Error`, {
				status: 500,
				statusText: `Not Found : no event exists with id ${params.id}`,
			});
		}

		// Get eventData
		const eventData = eventResponse.data();

		// If user does not have permission to view event...
		const access = eventData?.access ?? 'user';
		if (
			(isModerator && access === 'admin') ||
			(isUser && (access === 'admin' || access === 'moderator')) ||
			(!isUser &&
				(access === 'admin' || access === 'moderator' || access === 'user'))
		) {
			// Return error - you do not have permission
			return new NextResponse(`Internal Server Error`, {
				status: 403,
				statusText: errors['restricted/user/403'],
			});
		}

		// Filter client data
		const clientData = filterEventFetch(eventData as Event);

		// Return user
		return NextResponse.json(clientData.data);
	} catch (error) {
		// Return error - generic
		return new NextResponse('Internal Server Error', { status: 500 });
	}
}
