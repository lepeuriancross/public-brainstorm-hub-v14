// Component: LinkUser
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
const name = 'LinkUser';

/*---------- Template ----------*/

// Types
export type LinkUserProps = {
	id: string;
	className?: string;
};

export default function LinkUser(props: LinkUserProps) {
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
