// Component: SectionUserView
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
const name = 'SectionUserView';

/*---------- Template ----------*/

// Types
export type SectionUserViewProps = {
	uid: string;
	className?: string;
};

// Default component
export default function SectionUserView(props: SectionUserViewProps) {
	/*----- Props -----*/

	// Get props
	const { uid, className } = props;

	/*----- Init -----*/

	// Return default
	return (
		<div className={classNames(`section relative`, className)} data-name={name}>
			<div className="section__bg absolute z-10 top-0 left-0 w-full h-full bg-gray-50" />
			<div className="section__container relative z-20 p-6 lg:px-8">
				<div className="section__container-inner container rounded-lg mx-auto px-6 py-8 space-y-6 shadow bg-white">
					View User {uid}
				</div>
			</div>
		</div>
	);
}
