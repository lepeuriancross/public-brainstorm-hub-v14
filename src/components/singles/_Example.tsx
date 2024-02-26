// Component: Example
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
const name = 'Example';

/*---------- Template ----------*/

// Types
export type ExampleProps = {
	className?: string;
};

export default function Example(props: ExampleProps) {
	/*----- Props -----*/

	// Get props
	const { className } = props;

	/*----- Init -----*/

	// Return default
	return (
		<div className={classNames(`example`, className)} data-name={name}>
			[{name}]
		</div>
	);
}
