// Component: SectionEventView
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
import FormEventView from '@/components/singles/Form/FormEventView';

/*---------- Static Data ----------*/

// Name
const name = 'SectionEventView';

/*---------- Template ----------*/

// Types
export type SectionEventViewProps = {
	id: string;
	edit?: string;
	role?: string;
	className?: string;
};

// Default component
export default function SectionEventView(props: SectionEventViewProps) {
	/*----- Props -----*/

	// Get props
	const { id, edit = 'user', role = 'user', className } = props;

	/*----- Init -----*/

	// Return default
	return (
		<div className={classNames(`section relative`, className)} data-name={name}>
			<div className="section__bg absolute z-10 top-0 left-0 w-full h-full bg-gray-50" />
			<div className="section__container relative z-20 p-6 lg:px-8">
				<div className="section__container-inner container rounded-lg mx-auto px-6 py-8 space-y-6 shadow bg-white">
					{(edit === 'admin' || edit === 'moderator') &&
					(role === 'admin' || role === 'moderator') ? (
						<FormEventView id={id} role={role} />
					) : (
						<FormEventView id={id} role="user" />
					)}
				</div>
			</div>
		</div>
	);
}
