// Component: SectionUserEdit
/*----------------------------------------------------------------------------------------------------*/

/*---------- Imports ----------*/

// Config
// ...

// Scripts (node)
// ...

// Scripts (local)
import { classNames } from '@/lib/utils';
import FormUserEdit from '../singles/Form/FormUserEdit';

// Components (node)
// ...

// Components (local)
// ...

/*---------- Static Data ----------*/

// Name
const name = 'SectionUserEdit';

/*---------- Template ----------*/

// Types
export type SectionUserEditProps = {
	uid: string;
	edit?: string;
	role?: Role;
	className?: string;
};

// Default component
export default function SectionUserEdit(props: SectionUserEditProps) {
	/*----- Props -----*/

	// Get props
	const { uid, edit = 'user', role = 'user', className } = props;

	/*----- Init -----*/

	// Return default
	return (
		<div className={classNames(`section relative`, className)} data-name={name}>
			<div className="section__bg absolute z-10 top-0 left-0 w-full h-full bg-gray-50" />
			<div className="section__container relative z-20 p-6 lg:px-8">
				<div className="section__container-inner container rounded-lg mx-auto px-6 py-8 space-y-6 shadow bg-white">
					{(edit === 'admin' || edit === 'moderator') &&
					(role === 'admin' || role === 'moderator') ? (
						<FormUserEdit uid={uid} role={role} />
					) : (
						<FormUserEdit uid={uid} role="user" />
					)}
				</div>
			</div>
		</div>
	);
}
