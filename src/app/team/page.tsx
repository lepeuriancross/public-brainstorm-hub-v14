// Component: TeamArchive
/*----------------------------------------------------------------------------------------------------*/

/*---------- Imports ----------*/

// Config
// ...

// Scripts (node)
import { cookies } from 'next/headers';

// Scripts (local)
// ...

// Components (node)
// ...

// Components (local)
import SectionAuth from '@/components/section/SectionAuth';
import SectionTeams from '@/components/section/SectionTeams';

/*---------- Static Data ----------*/

// Name
const name = 'TeamArchive';

/*---------- Template ----------*/

// Types
export type TeamArchiveProps = {
	// ...
};

// Force dynamic
export const dynamic = 'force-dynamic';

// Default component
export default function Home() {
	/*----- Props -----*/

	// Get props
	// ...

	// Get authToken
	const cookieStore = cookies();
	const authToken = cookieStore.get('firebaseIdToken')?.value;

	/*----- Init -----*/

	// If no auth...
	if (!authToken) {
		// Return SectionAuth
		return (
			<>
				<SectionAuth className="grow" />
			</>
		);
	}

	// Return default
	return (
		<>
			<SectionTeams />
		</>
	);
}
