// Api Route: User
/*----------------------------------------------------------------------------------------------------*/

/*---------- Imports ----------*/

// Config
// ...

// Scripts (node)
import { NextRequest, NextResponse } from 'next/server';
import { DecodedIdToken } from 'firebase-admin/auth';

// Scripts (local)
import { firestore, auth } from '@/firebase/lib/server';
import { filterUserSubmit, filterUserFetch } from '@/firebase/lib/filters';

/*---------- Route ----------*/

export async function POST(
	request: NextRequest,
	{ params }: { params: { uid: string } }
) {
	try {
		// If no firestore...
		if (!firestore) {
			// Return error - no firestore
			return new NextResponse('Internal Server Error', {
				status: 500,
				statusText: `Internal Server Error : no firestore`,
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
					statusText: `Internal Server Error : problem fetching user with token`,
				});
			}

		// Get user access privilages
		// const isUser =
		// 	user?.role === 'user' ||
		// 	user?.role === 'moderator' ||
		// 	user?.role === 'admin';
		// const isModerator = user?.role === 'moderator' || user?.role === 'admin';
		const isAdmin = user?.role === 'admin';

		// Get user from collection
		let userDocument = await firestore
			.collection('users')
			.doc(params.uid)
			.get();

		// If no user...
		if (!userDocument.exists) {
			// Return error - no user
			return new NextResponse(`Not Found`, {
				status: 404,
				statusText: `Not Found : no user exists with uid ${params.uid}`,
			});
		}

		// Get userData
		let userData = userDocument.data();

		// Get body
		const body = await request.json();

		// If user is not admin / If user is not the same as the user being updated...
		if (!isAdmin && user?.uid !== params.uid) {
			// Return error - forbidden
			return new NextResponse(`Forbidden`, {
				status: 403,
				statusText: `Forbidden : you do not have permission to edit user with uid ${params.uid}`,
			});
		}

		// Filter client data
		const clientData = filterUserSubmit(body);

		// If error...
		if (clientData.error) {
			// Return error - forbidden
			return new NextResponse(`Forbidden`, {
				status: 403,
				statusText: `Forbidden : ${clientData.error.message}`,
			});
		}

		// Update user
		await firestore
			.collection('users')
			.doc(params.uid)
			.update({
				...clientData.data,
			});

		// Get updated user from collection
		userDocument = await firestore.collection('users').doc(params.uid).get();

		// If no user...
		if (!userDocument.exists) {
			// Return error - no user
			return new NextResponse('Internal Server Error', {
				status: 500,
				statusText: `Internal Server Error : could not fetch submitted user with uid ${params.uid}`,
			});
		}

		// Get userData
		userData = userDocument.data();

		// Filter server data
		const serverData = filterUserFetch(userData);

		// Return user
		return NextResponse.json(serverData.data);
	} catch (error) {
		// Return error - generic
		return new NextResponse('Internal Server Error', {
			status: 500,
			statusText: `Internal Server Error : an unknown error occured`,
		});
	}
}
