// Component: FieldsetBrands
/*----------------------------------------------------------------------------------------------------*/

'use client';

/*---------- Imports ----------*/

// Config
// ...

// Scripts (node)
import {
	useRef,
	useState,
	useImperativeHandle,
	forwardRef,
	useEffect,
} from 'react';

// Scripts (local)
import { classNames } from '@/lib/utils';

// Components (node)
import { CheckIcon } from '@heroicons/react/20/solid';

// Components (local)
import BadgeBrand from '../Badge/BadgeBrand';

/*---------- Static Data ----------*/

// Name
// ...

/*---------- Template ----------*/

// Types
export type FieldsetBrandsProps = {
	legend?: string;
	name?: string;
	id?: string;
	values?: {
		value: string;
		label: string;
		imageUrl?: string;
	}[];
	defaultValue?: string[];
	description?: string | false;
	error?: Validation;
	className?: string;
	onChange?: (name: string, values: string[]) => void;
};

// Default component (forwards ref)
function FieldsetBrands(props: FieldsetBrandsProps, ref: any) {
	/*----- Props -----*/

	// Get props
	const {
		legend = '',
		name = '',
		id = '',
		values = [],
		defaultValue = [],
		description = false,
		error = false,
		className,
		onChange = (name: string, values: string[]) => {},
	} = props;

	/*----- Refs -----*/

	// Ref - inputEl
	const inputEl = useRef<HTMLFieldSetElement>(null);

	/*----- Store -----*/

	// State - value
	const [value, setValue] = useState<string[]>(defaultValue);

	/*----- Methods -----*/

	// Function - handleClick
	function handleClick(optionValue: string) {
		// Check if value is in array
		if (value.includes(optionValue)) {
			// Remove value from array
			setValue(value.filter((v) => v !== optionValue));

			// Callback
			onChange(
				name,
				value.filter((v) => v !== optionValue)
			);
		} else {
			// Add value to array
			setValue([...value, optionValue]);

			// Callback
			onChange(name, [...value, optionValue]);
		}
	}

	// Function - set
	const set = (newValue?: string[]) => {
		// Set value
		setValue(newValue ?? []);

		// Callback
		onChange(name, newValue ?? []);
	};

	// Expose custom handles as a ref
	useImperativeHandle(ref, () => ({
		inputEl,
		focus: () => {
			inputEl.current?.focus();
		},
		set: (value?: string[]) => {
			set(value);
		},
	}));

	/*----- Lifecycle -----*/

	// Watch - value
	// useEffect(() => {
	// 	// Callback
	// 	onChange(name, value);
	// }, [name, value, onChange]);

	/*----- Init -----*/

	// Return default
	return (
		<fieldset
			ref={inputEl}
			className={classNames(`fieldset space-y-3`, className)}
			data-name={'FieldsetBrands'}
		>
			<legend className="fieldset__legend text-sm font-medium leading-6 text-gray-900">
				{legend}
			</legend>
			<div className="fieldset__container space-y-2">
				<div className="fieldset__options flex gap-x-2 gap-y-4 flex-wrap">
					{values.map((option, v) => (
						<div
							className="fieldset__option inline-block"
							key={`fieldset-brands-value-${option.value}`}
						>
							<input
								className="fieldset__input"
								type="hidden"
								value={value.includes(option.value) ? '1' : '0'}
							/>
							<button
								className="fieldset__button relative"
								type="button"
								onClick={() => handleClick(option.value)}
							>
								<BadgeBrand
									className={classNames(
										`relative z-10`,
										value.includes(option.value)
											? 'border-blue-600 border-[2px] text-white'
											: error
											? 'border-red-500 border-[2px] text-red-500'
											: 'border-gray-300'
									)}
									id={option.value}
								/>
								{value.includes(option.value) && (
									<span className="fieldset__button-tick absolute z-20 bottom-1 right-0 w-5 h-5 rounded-full bg-blue-600 text-white">
										<CheckIcon className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4" />
									</span>
								)}
							</button>
						</div>
					))}
				</div>
				{!error && description && description !== '' && (
					<p className="font-body text-sm leading-6 text-gray-600">
						{description}
					</p>
				)}
				{error && (
					<p className="font-body text-[10px] text-red-500">{error.message}</p>
				)}
			</div>
		</fieldset>
	);
}
export default forwardRef(FieldsetBrands);
