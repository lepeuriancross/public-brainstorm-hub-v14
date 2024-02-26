// Api Route: Fetch Regions
/*----------------------------------------------------------------------------------------------------*/

/*---------- Imports ----------*/

// Config
import { configAccess } from '@/data/config';
import { staticRegions } from '@/data/content';
import { RegionClient } from '@/types';

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

		// Get regions from collection
		const response = await firestore.collection('regions').get();
		const regions = response.docs.map((doc) => doc.data() as RegionClient);

		// If no regions are stored...
		if (regions.length === 0) {
			// Commit staticRegions
			const batch = firestore.batch();
			staticRegions.forEach((region) => {
				const regionRef = firestore?.collection('regions').doc();
				if (regionRef) {
					batch.set(regionRef, region);
				}
			});
			await batch.commit();
		}

		// Return regions
		return NextResponse.json(regions);
	} catch (error) {
		// Return error - generic
		return new NextResponse('Internal Server Error', { status: 500 });
	}
}
