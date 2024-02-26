// Component: SectionEventView
/*----------------------------------------------------------------------------------------------------*/

/*---------- Imports ----------*/

// Config
import { Role } from '@/types';

// Scripts (node)
// ...

// Scripts (local)
import { classNames } from '@/lib/utils';
import FormEventEdit from '@/components/singles/Form/FormEventEdit';

// Components (node)
// ...

// Components (local)
// ...

/*---------- Static Data ----------*/

// Name
const name = 'SectionEventView';

/*---------- Template ----------*/

// Types
export type SectionEventViewProps = {
	id: string;
	edit?: string;
	role?: Role;
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
						<FormEventEdit id={id} role={role} />
					) : (
						<FormEventEdit id={id} role="user" />
					)}
				</div>
			</div>
		</div>
	);
}
