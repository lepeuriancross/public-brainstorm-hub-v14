// Api Route: Submit Event (by id)
/*----------------------------------------------------------------------------------------------------*/

/*---------- Imports ----------*/

// Config
import errors from '@/data/errors';

// Scripts (node)
import { NextRequest, NextResponse } from 'next/server';
import { DecodedIdToken } from 'firebase-admin/auth';

// Scripts (local)
import { firestore, auth } from '@/firebase/lib/server';
import { filterEventSubmit } from '@/firebase/lib/filters';

/*---------- Route ----------*/

export async function POST(
	request: NextRequest,
	{
		params,
	}: {
		params: {
			id: string;
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
				statusText: errors['restricted/event-submit/400'],
			});
		}

		// If no firestore...
		if (!firestore) {
			// Return error - no firestore
			return new NextResponse('Internal Server Error : no firestore', {
				status: 500,
				statusText: errors['restricted/event-submit/500'],
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
						statusText: errors['restricted/event-submit/500'],
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
		if (!isUser) {
			// Return error - you do not have permission
			return new NextResponse(
				'Internal Server Error : you do not have permission',
				{
					status: 403,
					statusText: errors['restricted/event-submit/403'],
				}
			);
		}

		// Get event from collection
		let eventDocument = await firestore
			.collection('events')
			.doc(params.id)
			.get();

		// If event...
		let clientData;
		if (eventDocument.exists) {
			// Get eventData
			let eventData = eventDocument.data();

			// If user is not admin or moderator / If user is not the same as the creator of the event being updated...
			if (!isAdmin && !isModerator && user?.uid !== eventData?.uid) {
				// Return error - you do not have permission
				return new NextResponse(
					'Internal Server Error : you do not have permission',
					{
						status: 403,
						statusText: errors['restricted/event-submit/403'],
					}
				);
			}

			// Filter client data
			clientData = filterEventSubmit({
				...body,
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
				.collection('events')
				.doc(params.id)
				.update({
					...clientData.data,
				});
		} else {
			// Filter client data
			clientData = filterEventSubmit({
				...body,
				uid: user?.uid,
				...(user?.uid ? { creator: user?.name } : {}),
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
				.collection('events')
				.doc(params.id)
				.set(
					{
						...clientData.data,
					},
					{ merge: true }
				);
		}

		// Return event
		return NextResponse.json(
			{
				message: 'Event updated successfully',
				href: `/calendar/${clientData.data?.id ?? params.id}`,
			},
			{
				status: 200,
			}
		);
	} catch (error) {
		// Return error - generic
		return new NextResponse('Internal Server Error', {
			status: 500,
		});
	}
}
