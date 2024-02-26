// Component: LinkBrand
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
const name = 'LinkBrand';

/*---------- Template ----------*/

// Types
export type LinkBrandProps = {
	id: string;
	className?: string;
};

export default function LinkBrand(props: LinkBrandProps) {
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
