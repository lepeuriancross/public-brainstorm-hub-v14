// Component: LinkTeam
/*----------------------------------------------------------------------------------------------------*/

/*---------- Imports ----------*/

// Config
// ...

// Scripts (node)
// ...

// Scripts (local)
import { classNames } from '@/lib/utils';

// Components (node)
// ...

// Components (local)
// ...

/*---------- Static Data ----------*/

// Name
const name = 'LinkTeam';

/*---------- Template ----------*/

// Types
export type LinkTeamProps = {
	id: string;
	className?: string;
};

export default function LinkTeam(props: LinkTeamProps) {
	/*----- Props -----*/

	// Get props
	const { id, className } = props;

	/*----- Init -----*/

	// Return default
	return (
		<span className={classNames(`link`, className)} data-name={name}>
			{id}
		</span>
	);
}
