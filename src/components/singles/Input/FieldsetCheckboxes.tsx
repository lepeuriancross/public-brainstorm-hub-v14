// Component: FieldsetCheckboxes
/*----------------------------------------------------------------------------------------------------*/

'use client';

/*---------- Imports ----------*/

// Config
// ...

// Scripts (node)
import { useRef, forwardRef } from 'react';

// Scripts (local)
import { classNames } from '@/lib/utils';

// Components (node)
// ...

// Components (local)
import InputCheckbox from './InputCheckbox';

/*---------- Static Data ----------*/

// Name
const name = 'FieldsetCheckboxes';

/*---------- Template ----------*/

// Types
export type FieldsetCheckboxesProps = {
	legend?: string;
	name?: string;
	id?: string;
	values?: {
		label?: string;
		name: string;
		description?: string;
		error?: Validation;
	}[];
	description?: string | false;
	error?: Validation;
	className?: string;
	onChange?: (name: string, value: boolean) => void;
};

// Default component (forwards ref)
function FieldsetCheckboxes(props: FieldsetCheckboxesProps, ref: any) {
	/*----- Props -----*/

	// Get props
	const {
		legend = '',
		name = '',
		id = '',
		values = [],
		onChange = (name: string, value: boolean) => {},
	} = props;

	/*----- Refs -----*/

	// Ref - inputEl
	const inputEl = useRef<HTMLFieldSetElement>(null);

	// Ref - checkboxEls
	const checkboxEls = useRef<any[]>([]);

	/*----- Methods -----*/

	// Function - handleInputChange
	const handleInputChange = (name: string, value: boolean) => {
		// Callback
		onChange(name, value);
	};

	/*----- Template -----*/

	return (
		<fieldset ref={inputEl} id={id} className="space-y-6">
			{legend && legend !== '' && (
				<legend className="text-sm font-medium leading-6 text-gray-900">
					{legend}
				</legend>
			)}
			<div className="space-y-6">
				{values.map((option) => (
					<div
						key={`input-select-${name}-${option.label}`}
						className="relative flex gap-x-3"
					>
						<div className="flex h-6 items-center">
							<InputCheckbox
								ref={(ref) => {
									checkboxEls.current.push(ref);
								}}
								name={name}
								error={option.error}
								onChange={handleInputChange}
							/>
						</div>
						<div className="text-sm leading-6">
							{option.label &&
								option.label !== '' &&
								option.name &&
								option.name !== '' && (
									<label
										htmlFor={option.name}
										className="block font-medium text-gray-900"
									>
										{option.label}
									</label>
								)}
							{!option.error &&
								option.description &&
								option.description !== '' && (
									<label
										htmlFor={name}
										className="block font-body text-sm leading-6 text-gray-600"
									>
										{option.description}
									</label>
								)}
							{option.error && (
								<p className="block font-body text-[10px] text-red-500">
									{option.error.message}
								</p>
							)}
						</div>
					</div>
				))}
			</div>
		</fieldset>
	);
}
export default forwardRef(FieldsetCheckboxes);
