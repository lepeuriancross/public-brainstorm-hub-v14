// Component: UserArchive
/*----------------------------------------------------------------------------------------------------*/

/*---------- Imports ----------*/

// Config
import { configAccess } from '@/data/config';

// Scripts (node)
import { cookies } from 'next/headers';

// Scripts (local)
import { auth } from '@/firebase/lib/server';

// Components (node)
import { DecodedIdToken } from 'firebase-admin/auth';

// Components (local)
import SectionAuth from '@/components/section/SectionAuth';
import SectionRestrictedAccess from '@/components/section/SectionRestrictedAccess';
import SectionUsers from '@/components/section/SectionUsers';

/*---------- Static Data ----------*/

// Name
const name = 'UserArchive';

/*---------- Template ----------*/

// Types
export type UserArchiveProps = {
	// ...
};

// Force dynamic
export const dynamic = 'force-dynamic';

// Default component
export default async function UserArchive() {
	/*----- Props -----*/

	// Get props
	// ...

	// Get authToken
	const cookieStore = cookies();
	const authToken = cookieStore.get('firebaseIdToken')?.value;

	/*----- Init -----*/

	// If no auth / authToken...
	if (!auth || !authToken) {
		// Return SectionAuth
		return (
			<>
				<SectionAuth className="grow" />
			</>
		);
	}

	// Get user token
	let user: DecodedIdToken | null = null;
	try {
		user = await auth.verifyIdToken(authToken);
	} catch (error) {
		if (process.env.NODE_ENV === 'development') {
			console.error(error);
		}
	}

	// If no user token...
	if (!user) {
		// Return SectionAuth
		return (
			<>
				<SectionAuth className="grow" />
			</>
		);
	}

	// Get currentUserData
	let currentUserData = null;
	const currentUserDataResponse = await fetch(
		`${process.env.API_URL}/api/users/${user.uid}`,
		{
			headers: {
				Authorization: `Bearer ${authToken}`,
			},
		}
	);
	if (currentUserDataResponse.ok) {
		currentUserData = await currentUserDataResponse.json();
	}

	// If no role...
	const role = currentUserData?.role;
	if (configAccess.required && (!role || role === 'guest')) {
		// Return SectionRestrictedAccess
		<SectionRestrictedAccess className="grow" code={'restricted/forbidden'} />;
	}

	// Return default
	return (
		<>
			<SectionUsers className="grow" />
		</>
	);
}
