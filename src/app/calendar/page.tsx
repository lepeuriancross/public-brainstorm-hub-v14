// Component: CalendarMonth
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
import TheProviderCalendar from '@/components/base/TheProviderCalendar';
import SectionAuth from '@/components/section/SectionAuth';
import SectionRestrictedAccess from '@/components/section/SectionRestrictedAccess';
import SectionCalendar from '@/components/section/SectionCalendar';

/*---------- Static Data ----------*/

// Name
const name = 'CalendarMonth';

/*---------- Template ----------*/

// Types
export type CalendarMonthProps = {
	searchParams: {
		date: string;
	};
};

// Force dynamic
export const dynamic = 'force-dynamic';

// Default component
export default async function CalendarMonth(props: CalendarMonthProps) {
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
		return (
			<SectionRestrictedAccess className="grow" code={'restricted/forbidden'} />
		);
	}

	// Get static regions, brands, teams
	const regionsResponse = await fetch(`${process.env.API_URL}/api/regions`, {
		headers: {
			Authorization: `Bearer ${authToken}`,
		},
	});
	const brandsResponse = await fetch(`${process.env.API_URL}/api/brands`, {
		headers: {
			Authorization: `Bearer ${authToken}`,
		},
	});
	const teamsResponse = await fetch(`${process.env.API_URL}/api/teams`, {
		headers: {
			Authorization: `Bearer ${authToken}`,
		},
	});
	const platformsResponse = await fetch(
		`${process.env.API_URL}/api/platforms`,
		{
			headers: {
				Authorization: `Bearer ${authToken}`,
			},
		}
	);

	// If regionsResponse, brandsResponse, teamsResponse, platformsResponse not ok (or have no length)...
	if (
		!regionsResponse.ok ||
		!brandsResponse.ok ||
		!teamsResponse.ok ||
		!platformsResponse.ok
	) {
		// Return SectionRestrictedAccess
		return <div>Please refresh the app to populate data</div>;
	}

	// Get json
	const regionsJson = await regionsResponse.json();
	const brandsJson = await brandsResponse.json();
	const teamsJson = await teamsResponse.json();
	const platformsJson = await platformsResponse.json();

	// Return default
	return (
		<>
			<TheProviderCalendar
				regionsJson={regionsJson}
				brandsJson={brandsJson}
				teamsJson={teamsJson}
				platformsJson={platformsJson}
			>
				<SectionCalendar />
			</TheProviderCalendar>
		</>
	);
}
