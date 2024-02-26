// Component: SectionRestrictedAccess
/*----------------------------------------------------------------------------------------------------*/

/*---------- Imports ----------*/

// Config
import { ThemeErrorRestricted } from '@/data/errors';

// Scripts (node)
// ...

// Scripts (local)
import { classNames } from '@/lib/utils';
import MessageRestricted from '../singles/Message/MessageRestricted';

// Components (node)
// ...

// Components (local)
// ...

/*---------- Static Data ----------*/

// Name
const name = 'SectionRestrictedAccess';

/*---------- Template ----------*/

// Types
export type SectionRestrictedAccessProps = {
	code?: ThemeErrorRestricted;
	className?: string;
};

// Default component
export default function SectionRestrictedAccess(
	props: SectionRestrictedAccessProps
) {
	/*----- Props -----*/

	// Get props
	const { code = 'restricted/forbidden', className } = props;

	/*----- Init -----*/

	// Return default
	return (
		<div className={classNames(`section relative`, className)} data-name={name}>
			<div className="section__bg absolute z-10 top-0 left-0 w-full h-full bg-gray-50" />
			<div className="section__container relative z-20 p-6 lg:px-8">
				<div className="section__container-inner container rounded-lg mx-auto px-6 py-8 space-y-6 shadow bg-white">
					<MessageRestricted code={code} />
				</div>
			</div>
		</div>
	);
}
