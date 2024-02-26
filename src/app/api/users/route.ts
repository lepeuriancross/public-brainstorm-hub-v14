// Api Route: Users
/*----------------------------------------------------------------------------------------------------*/

/*---------- Imports ----------*/

// Config
import { configAccess } from '@/data/config';
import errors from '@/data/errors';
import { User } from '@/types';

// Scripts (node)
import { NextRequest, NextResponse } from 'next/server';
import { DecodedIdToken } from 'firebase-admin/auth';

// Scripts (local)
import { firestore, auth } from '@/firebase/lib/server';

/*---------- Route ----------*/

// Route
export async function GET(request: NextRequest) {
	try {
		// Get searchParams
		const searchParams = request.nextUrl?.searchParams;
		if (!searchParams?.has('search')) {
			// Return error - no searchParams
			return new NextResponse('Internal Server Error', {
				status: 400,
				statusText: errors['restricted/users/400'],
			});
		}
		const search = searchParams.get('search')?.toLowerCase();

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
						.collection('users')
						.where('access', 'in', ['guest', 'user', 'moderator', 'admin'])
						.where('nameToLowerCase', '>=', search)
						.where('nameToLowerCase', '<=', search + '~')
						.get()
				: user && isModerator
				? firestore
						.collection('users')
						.where('access', 'in', ['guest', 'user', 'moderator'])
						.where('nameToLowerCase', '>=', search)
						.where('nameToLowerCase', '<=', search + '~')
						.get()
				: user && isUser
				? firestore
						.collection('users')
						.where('access', 'in', ['guest', 'user'])
						.where('nameToLowerCase', '>=', search)
						.where('nameToLowerCase', '<=', search + '~')
						.get()
				: firestore
						.collection('users')
						.where('access', 'in', ['guest'])
						.where('nameToLowerCase', '>=', search)
						.where('nameToLowerCase', '<=', search + '~')
						.get();

		// Get users from collection (depending on access)
		const response = await firestoreCall;
		const users = response.docs.map((doc) => doc.data() as User);

		// Return users
		return NextResponse.json(users);
	} catch (error) {
		// Return error - generic
		return new NextResponse('Internal Server Error', { status: 500 });
	}
}
