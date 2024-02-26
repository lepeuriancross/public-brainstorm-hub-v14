// Component: InputText
/*----------------------------------------------------------------------------------------------------*/

/*---------- Imports ----------*/

// Config
// ...

// Scripts (node)
import { forwardRef, useImperativeHandle, useRef } from 'react';

// Scripts (local)
import { classNames } from '@/lib/utils';

// Components (node)
// ...

// Components (local)
// ...

/*---------- Static Data ----------*/

// Name
const name = 'InputText';

/*---------- Template ----------*/

// Types
export type InputTextProps = {
	type?: 'text' | 'email' | 'password';
	label?: string;
	placeholder?: string;
	name?: string;
	id?: string;
	defaultValue?: string;
	autoComplete?: string;
	description?: string | false;
	error?: Validation;
	className?: string;
	onChange?: (name: string, value: string) => void;
};

// Default component (forwards ref)
function InputText(props: InputTextProps, ref: any) {
	/*----- Props -----*/

	// Get props
	const {
		type = 'text',
		label = '',
		name = '',
		placeholder = '',
		id = '',
		defaultValue = '',
		autoComplete = '',
		description = false,
		error = false,
		className,
		onChange = (name: string, value: string) => {},
	} = props;

	/*----- Refs -----*/

	// Ref - inputEl
	const inputEl = useRef<HTMLInputElement>(null);

	/*----- Methods -----*/

	// Function - handleInputChange
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		// Callback
		onChange(name, e.target.value);
	};

	// Function - set
	const set = (value?: string) => {
		// Set value
		if (inputEl.current) {
			inputEl.current.value = value || '';
		}

		// Callback
		onChange(name, value || '');
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
					className="block text-sm font-medium leading-6 text-gray-900"
					htmlFor={name}
				>
					{label}
				</label>
			)}
			<input
				ref={inputEl}
				id={id}
				className={classNames(
					`block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 text-gray-900 placeholder:text-gray-400`,
					error
						? 'ring-red-500 focus:ring-red-600'
						: 'ring-gray-300 focus:ring-blue-600',
					className
				)}
				type={type}
				name={name}
				placeholder={placeholder}
				defaultValue={defaultValue}
				autoComplete={autoComplete}
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
export default forwardRef(InputText);
