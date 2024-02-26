// Component: InputSelect
/*----------------------------------------------------------------------------------------------------*/

/*---------- Imports ----------*/

// Config
// ...

// Scripts (node)
import { useRef, useState, forwardRef, useImperativeHandle } from 'react';

// Scripts (local)
import { classNames } from '@/lib/utils';

// Components (node)
// ...

// Components (local)
// ...

/*---------- Static Data ----------*/

// Name
const name = 'InputSelect';

/*---------- Template ----------*/

// Types
export type InputSelectProps = {
	label?: string;
	name?: string;
	id?: string;
	defaultValue?: string | number;
	values?: {
		value: string | number;
		label: string;
	}[];
	description?: string | false;
	error?: Validation;
	className?: string;
	onChange?: (name: string, value: string) => void;
};

// Default component (forwards ref)
function InputSelect(props: InputSelectProps, ref: any) {
	/*----- Props -----*/

	// Get props
	const {
		label = '',
		name = '',
		id = '',
		defaultValue,
		values = [
			{
				value: undefined,
				label: '---',
			},
		],
		description = false,
		error = false,
		className,
		onChange = (name: string, value: string) => {},
	} = props;

	/*----- Refs -----*/

	// Ref - inputEl
	const inputEl = useRef<HTMLSelectElement>(null);

	/*----- Store -----*/

	// State - value
	const [value, setValue] = useState<string | undefined>(defaultValue);

	/*----- Methods -----*/

	// Function - handleInputChange
	const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		// Set value
		setValue(e.target.value);

		// Callback
		onChange(name, e.target.value);
	};

	// Function - set
	const set = (value?: string) => {
		// Loop values
		for (const option of values) {
			// If value matches...
			if (value && option.value === value) {
				// Set value
				setValue(value);

				// Callback
				onChange(name, value);
				return;
			}
		}
		// Set first value
		setValue(values[0].value);

		// Callback
		onChange(name, values[0].value ?? 'default');
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
			<select
				ref={inputEl}
				id={id}
				className={classNames(
					`block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 text-gray-900 ring-gray-300 focus:ring-blue-600`,
					error
						? 'ring-red-500 focus:ring-red-600'
						: 'ring-gray-300 focus:ring-blue-600',
					className
				)}
				name={name}
				onChange={handleInputChange}
			>
				{values.map((option) => (
					<option
						key={`input-select-${name}-${option.value}`}
						value={option.value}
						selected={option.value === value}
					>
						{option.label}
					</option>
				))}
			</select>
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
export default forwardRef(InputSelect);
