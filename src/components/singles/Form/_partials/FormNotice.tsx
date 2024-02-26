// Component: FormNotice
/*----------------------------------------------------------------------------------------------------*/

/*---------- Imports ----------*/

// Config
// ...

// Scripts (node)
// ...

// Scripts (local)
import { classNames } from '@/lib/utils';

// Components (node)
import { BellIcon } from '@heroicons/react/24/solid';

// Components (local)
// ...

/*---------- Static Data ----------*/

// Name
const name = 'FormNotice';

/*---------- Template ----------*/

// Types
export type FormNoticeProps = {
	error?: Validation;
	warning?: string | false;
	className?: string;
};

export default function FormNotice(props: FormNoticeProps) {
	/*----- Props -----*/

	// Get props
	const { error, warning, className } = props;

	/*----- Init -----*/

	// If no error or warning, return null
	if (!props.error && !props.warning) return null;

	// Return default
	return (
		<div
			className={classNames(
				`form__row flex flex-col justify-between space-y-8 sm:flex-row sm:space-y-0 sm:space-x-6 sm:text-left`,
				className
			)}
			data-name={name}
		>
			<div className="form__col w-full">
				{error ? (
					<div className="form__warning flex flex-col justify-center items-center min-h-[48px] mt-1 rounded text-sm leading-6 overflow-hidden lg:flex-row lg:justify-start bg-error text-white">
						<span className="relative w-full h-full min-h-[48px] lg:w-[48px]">
							<span className="sr-only">Error!</span>
							<BellIcon className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 inline-block w-5 h-auto" />
						</span>
						<span className="flex justify-center items-center w-full min-h-[48px] p-2] grow text-center lg:pr-[48px bg-error-dark">
							{error.message}
						</span>
					</div>
				) : warning ? (
					<div className="form__warning flex flex-col justify-center items-center min-h-[48px] mt-1 rounded text-sm leading-6 overflow-hidden lg:flex-row lg:justify-start bg-warning text-white">
						<span className="relative w-full h-full min-h-[48px] lg:w-[48px]">
							<span className="sr-only">Warning!</span>
							<BellIcon className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 inline-block w-5 h-auto" />
						</span>
						<span className="flex justify-center items-center w-full min-h-[48px] p-3 grow text-center lg:pr-[48px bg-warning-dark">
							{warning}
						</span>
					</div>
				) : null}
			</div>
		</div>
	);
}
