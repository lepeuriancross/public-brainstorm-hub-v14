// Component: InputCheckbox
/*----------------------------------------------------------------------------------------------------*/

'use select';

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

// ...

/*---------- Template ----------*/

// Types
export type InputCheckboxProps = {
	name: string;
	error?: Validation;
	className?: string;
	onChange?: (name: string, value: boolean) => void;
};

// Default component (forwards ref)
function InputCheckbox(props: InputCheckboxProps, ref: any) {
	/*----- Props -----*/

	// Get props
	const {
		name,
		error,
		className,
		onChange = (name: string, value: boolean) => {},
	} = props;

	/*----- Refs -----*/

	// Ref - inputEl
	const inputEl = useRef<HTMLInputElement>(null);

	/*----- Store -----*/

	// State - value
	const [value, setValue] = useState<boolean | undefined>(undefined);

	/*----- Methods -----*/

	// Callback - handleInputChange
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		// Set value
		setValue(e.target.checked);

		// Callback
		onChange(name, e.target.checked);
	};

	// Function - set
	const set = (value?: boolean) => {
		// Set value
		setValue(value ?? false);
	};

	// Effect - useImperativeHandle
	useImperativeHandle(ref, () => ({
		inputEl,
		value,
		focus: () => {
			inputEl.current?.focus();
		},
		set(value: boolean) {
			set(value);
		},
	}));

	/*----- Render -----*/

	// Render
	return (
		<input
			ref={inputEl}
			className={classNames(
				`h-4 w-4 rounded border-gray-300`,
				error
					? 'ring-red-500 focus:ring-red-600'
					: 'ring-gray-300 focus:ring-blue-600',
				className
			)}
			name={name}
			type="checkbox"
			checked={value}
			data-name={'InputCheckbox'}
			onChange={handleInputChange}
		/>
	);
}
export default forwardRef(InputCheckbox);
