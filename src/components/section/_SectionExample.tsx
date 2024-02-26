// Component: SectionExample
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
const name = 'SectionExample';

/*---------- Template ----------*/

// Types
export type SectionExampleProps = {
	className?: string;
};

// Default component
export default function SectionExample(props: SectionExampleProps) {
	/*----- Props -----*/

	// Get props
	const { className } = props;

	/*----- Init -----*/

	// Return default
	return (
		<div className={classNames(`section `, className)} data-name={name}>
			<div className="section__container"></div>
		</div>
	);
}
