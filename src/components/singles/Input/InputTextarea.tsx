// Component: InputTextarea
/*----------------------------------------------------------------------------------------------------*/

/*---------- Imports ----------*/

// Config
import { Validation } from '@/types';

// Scripts (node)
// ...

// Scripts (local)
import { classNames } from '@/lib/utils';
import { forwardRef, useImperativeHandle, useRef } from 'react';

// Components (node)
// ...

// Components (local)
// ...

/*---------- Static Data ----------*/

// Name
const name = 'InputTextarea';

/*---------- Template ----------*/

// Types
export type InputTextareaProps = {
	label?: string;
	name?: string;
	rows?: number;
	description?: string | false;
	error?: Validation;
	id?: string;
	defaultValue?: string;
	className?: string;
	onChange?: (name: string, value: string) => void;
};

// Default component (forwards ref)
function InputTextarea(props: InputTextareaProps, ref: any) {
	/*----- Props -----*/

	// Get props
	const {
		label = '',
		name = '',
		rows = 3,
		description = false,
		error = false,
		id = '',
		defaultValue = '',
		className,
		onChange = (name: string, value: string) => {},
	} = props;

	/*----- Refs -----*/

	// Ref - inputEl
	const inputEl = useRef<HTMLTextAreaElement>(null);

	/*----- Methods -----*/

	// Function - handleInputChange
	const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		// Callback
		onChange(name, e.target.value);
	};

	// Function - set
	const set = (value?: string) => {
		// Set value
		if (inputEl.current) {
			inputEl.current.value = value || '';
		}
	};

	// Expose custom handles as a ref
	useImperativeHandle(ref, () => ({
		inputEl,
		focus: () => {
			inputEl.current?.focus();
		},
		set: (value?: string) => {
			set(value);
		},
	}));

	/*----- Init -----*/

	// Return default
	return (
		<>
			{label && label !== '' && name && name !== '' && (
				<label
					htmlFor={name}
					className="block text-sm font-medium leading-6 text-gray-900"
				>
					{label}
				</label>
			)}
			<textarea
				ref={inputEl}
				rows={rows}
				className={classNames(
					`block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 text-gray-900 placeholder:text-gray-400`,
					error
						? 'ring-red-500 focus:ring-red-600'
						: 'ring-gray-300 focus:ring-blue-600',
					className
				)}
				name={name}
				id={id}
				defaultValue={defaultValue}
				data-name={name}
				onChange={handleInputChange}
			/>
			{!error && description && description !== '' && (
				<p className="font-body text-sm leading-6 text-gray-600">
					{description}
				</p>
			)}
			{error && (
				<p className="font-body text-[10px] text-red-500">{error.message}</p>
			)}
		</>
	);
}
export default forwardRef(InputTextarea);
