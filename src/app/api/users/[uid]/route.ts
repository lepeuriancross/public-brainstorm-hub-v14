// Api Route: User
/*----------------------------------------------------------------------------------------------------*/

/*---------- Imports ----------*/

// Config
import { configAccess } from '@/data/config';
import { User } from '@/types';

// Scripts (node)
import { NextRequest, NextResponse } from 'next/server';
import { DecodedIdToken } from 'firebase-admin/auth';

// Scripts (local)
import { firestore, auth } from '@/firebase/lib/server';
import { filterUserFetch } from '@/firebase/lib/filters';

/*---------- Route ----------*/

export async function GET(
	request: NextRequest,
	{ params }: { params: { uid: string } }
) {
	try {
		// If no firestore...
		if (!firestore) {
			// Return error - no firestore
			return new NextResponse(`Internal Server Error`, {
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
				return new NextResponse('Internal Server Error', {
					status: 500,
					statusText: `Internal Server Error : problem fetching user with token`,
				});
			}

		// Get user access privilages
		const isUser =
			user?.role === 'user' ||
			user?.role === 'moderator' ||
			user?.role === 'admin';
		const isModerator = user?.role === 'moderator' || user?.role === 'admin';
		const isAdmin = user?.role === 'admin';

		// Get user from collection
		const userDocument = await firestore
			.collection('users')
			.doc(params.uid)
			.get();

		// If no user...
		if (!userDocument.exists) {
			// Return error - no user
			return new NextResponse(`Internal Server Error`, {
				status: 500,
				statusText: `Not Found : no user exists with uid ${params.uid}`,
			});
		}

		// Get userData
		const userData = userDocument.data();

		// Filter server data
		const serverData = filterUserFetch(userData as User);

		// Return user
		return NextResponse.json(serverData.data);
	} catch (error) {
		// Return error - generic
		return new NextResponse('Internal Server Error', { status: 500 });
	}
}
