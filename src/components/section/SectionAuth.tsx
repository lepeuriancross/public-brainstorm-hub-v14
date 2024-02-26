// Component: SectionAuth
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
import FormAuth from '@/components/singles/Form/FormAuth';

/*---------- Static Data ----------*/

// Name
const name = 'SectionAuth';

/*---------- Template ----------*/

// Types
export type SectionAuthProps = {
	className?: string;
};

export default function SectionAuth(props: SectionAuthProps) {
	/*----- Props -----*/

	// Get props
	const { className } = props;

	/*----- Init -----*/

	// Return default
	return (
		<div
			className={classNames(
				`section relative flex flex-col justify-center items-center`,
				className
			)}
			data-name={name}
		>
			<div className="section__bg absolute z-10 top-0 left-0 w-full h-full bg-gray-50" />
			<div className="section__container relative z-20 p-6 lg:px-8">
				<div className="section__container-inner max-w-sm rounded-lg mx-auto p-6 space-y-6 shadow bg-white">
					<FormAuth />
				</div>
			</div>
		</div>
	);
}
