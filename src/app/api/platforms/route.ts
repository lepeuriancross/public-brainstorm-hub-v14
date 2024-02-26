// Api Route: Platforms
/*----------------------------------------------------------------------------------------------------*/

/*---------- Imports ----------*/

// Config
import { configAccess } from '@/data/config';
import { staticPlatforms } from '@/data/content';
import { Platform } from '@/types';

// Scripts (node)
import { NextRequest, NextResponse } from 'next/server';
import { DecodedIdToken } from 'firebase-admin/auth';

// Scripts (local)
import { firestore, auth } from '@/firebase/lib/server';

/*---------- Route ----------*/

// Route
export async function GET(request: NextRequest) {
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
			// Return error - no searchParams
			return new NextResponse('Internal Server Error : restricted access', {
				status: 500,
			});
		}

		// Get platforms from collection
		const response = await firestore.collection('platforms').get();
		const platforms = response.docs.map((doc) => doc.data() as Platform);

		// If no platforms are stored...
		if (platforms.length === 0) {
			// Commit staticPlatforms
			const batch = firestore.batch();
			staticPlatforms.forEach((platform) => {
				const platformRef = firestore?.collection('platforms').doc();
				if (platformRef) {
					batch.set(platformRef, platform);
				}
			});
			await batch.commit();
		}

		// Return platforms
		return NextResponse.json(platforms);
	} catch (error) {
		// Return error - generic
		return new NextResponse('Internal Server Error', { status: 500 });
	}
}
