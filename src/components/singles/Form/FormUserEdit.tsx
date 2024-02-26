// Component: FormUserEdit
/*----------------------------------------------------------------------------------------------------*/

'use client';

/*---------- Imports ----------*/

// Config
import { Role, Validation } from '@/types';
import names from '@/data/names';

// Scripts (node)
import { useEffect, useRef, useState } from 'react';

// Scripts (local)
import { classNames, strCapitalize } from '@/lib/utils';
import { useAuth } from '@/components/base/TheProviderAuth';
import {
	validateFirstName,
	validateLastName,
	validateEmail,
} from '@/firebase/lib/validation';

// Components (node)
// ...

// Components (local)
import MessageRestricted from '@/components/singles/Message/MessageRestricted';
import ButtonUid from '@/components/singles/Button/ButtonUid';
import FieldsetCheckboxes from '@/components/singles/Input/FieldsetCheckboxes';
import InputText from '@/components/singles/Input/InputText';
import InputSelect from '@/components/singles/Input/InputSelect';
import InputTextarea from '@/components/singles/Input/InputTextarea';
import FormNotice from './_partials/FormNotice';

/*---------- Static Data ----------*/

// Name
const name = 'FormUserEdit';

/*---------- Template ----------*/

// Types
export type FormUserEditProps = {
	uid: string;
	role?: Role;
	className?: string;
};

// Default component
export default function FormUserEdit(props: FormUserEditProps) {
	/*----- Props -----*/

	// Get props
	const { uid, role, className } = props;

	/*----- Refs -----*/

	// Input Refs
	const inputFirstNameEl = useRef<any>(null);
	const inputLastNameEl = useRef<any>(null);
	const inputEmailEl = useRef<any>(null);
	const inputTeamEl = useRef<any>(null);
	const inputRegionEl = useRef<any>(null);
	const inputAboutEl = useRef<any>(null);
	const inputOptinCommentsEl = useRef<any>(null);

	/*----- Store -----*/

	// Input options
	const [inputOptionsTeam, setInputOptionsTeam] = useState<
		{
			value: string;
			label: string;
		}[]
	>([
		{
			value: 'capital',
			label: 'Team Capital',
		},
		{
			value: 'heart',
			label: 'Team Heart',
		},
		{
			value: 'combined',
			label: 'Team Combined',
		},
	]);
	const [inputOptionsRegion, setInputOptionsRegion] = useState<
		{
			value: string;
			label: string;
		}[]
	>([
		{
			value: 'leicester-square',
			label: 'Leicester Square',
		},
		{
			value: 'regional',
			label: 'Regional',
		},
	]);

	// Input values
	const [inputFirstName, setInputFirstName] = useState<string>('');
	const [inputLastName, setInputLastName] = useState<string>('');
	const [inputEmail, setInputEmail] = useState<string>('');
	const [inputTeam, setInputTeam] = useState<string | undefined>(
		inputOptionsTeam[0]?.value ?? 'default'
	);
	const [inputRegion, setInputRegion] = useState<string | undefined>(undefined);
	const [inputAbout, setInputAbout] = useState<string>('');
	const [inputOptinComments, setInputOptinComments] = useState<boolean>(false);
	const inputSetters = {
		'first-name': setInputFirstName,
		'last-name': setInputLastName,
		email: setInputEmail,
		team: setInputTeam,
		region: setInputRegion,
		about: setInputAbout,
	};

	// Input errors
	const [error, setError] = useState<Validation>(false);
	const [errors, setErrors] = useState<{
		'first-name': Validation;
		'last-name': Validation;
		email: Validation;
		team: Validation;
		region: Validation;
		about: Validation;
	}>({
		'first-name': false,
		'last-name': false,
		email: false,
		team: false,
		region: false,
		about: false,
	});

	// Form states
	const [isFetching, setIsFetching] = useState<boolean>(false);
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

	// Context - auth
	const auth = useAuth();
	const { token } = auth;

	/*----- Methods -----*/

	// Function - validateInput
	const validateInput = (name: string, value: any): Validation => {
		// Define error
		let error = false as Validation;

		// Switch - name
		switch (name) {
			case 'first-name':
				error = validateFirstName(value);
				setErrors((prevState) => ({
					...prevState,
					'first-name': error,
				}));
				return error;

			case 'last-name':
				error = validateLastName(value);
				setErrors((prevState) => ({
					...prevState,
					'last-name': error,
				}));
				return error;

			case 'email':
				error = validateEmail(value);
				setErrors((prevState) => ({
					...prevState,
					email: error,
				}));
				return error;

			case 'team':

			case 'region':

			case 'about':

			default:
				return false;
		}
	};

	// Function - validateAll
	const validateAll = () => {
		// Define errors
		const returnValue = {
			'first-name': validateInput('first-name', inputFirstName),
			'last-name': validateInput('last-name', inputLastName),
			email: validateInput('email', inputEmail),
			team: validateInput('team', inputTeam),
			region: validateInput('region', inputRegion),
			about: validateInput('about', inputAbout),
		};

		// Set errors
		setErrors({
			...errors,
			...returnValue,
		});

		// If any value in returnValue is not false...
		if (Object.values(returnValue).some((v) => v !== false)) {
			// Return returnValue
			return {
				error: 'input/general/form/invalid-input',
				message: 'Please check the form for errors',
			};
		}

		// Return
		return false;
	};

	// Function - handleInputChange
	const handleInputChange = (name: string, value: any) => {
		// Set state
		inputSetters[name as keyof typeof inputSetters](value);
	};

	// Function - handleSubmit
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		// Prevent default
		e.preventDefault();

		// Validate all
		const error = validateAll();

		// If error...
		if (error) {
			// Set error
			setError(error);

			// Return
			return;
		}

		// Set error
		setError(false);

		// Get values
		const values = {
			firstName: inputFirstName,
			lastName: inputLastName,
			email: inputEmail,
			team: inputTeam,
			region: inputRegion,
			about: inputAbout,
			optinComments: inputOptinComments,
		};

		// Is submitting
		setIsSubmitting(true);

		// Submit values
		const response = await fetch(`/api/users/${uid}/submit`, {
			method: 'POST',
			body: JSON.stringify(values),
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		});

		// Stop submitting
		setIsSubmitting(false);

		// If success...
		if (response.ok) {
			// Get responseJson
			const responseJson = await response.json();
			const { firstName, lastName, email, team, region, about, optinComments } =
				responseJson;

			// Set first name
			if (inputFirstNameEl.current) {
				inputFirstNameEl.current.set(firstName ?? '');
			}

			// Set last name
			if (inputLastNameEl.current) {
				inputLastNameEl.current.set(lastName ?? '');
			}

			// Set email
			if (inputEmailEl.current) {
				inputEmailEl.current.set(email ?? '');
			}

			// Set team
			if (inputTeamEl.current) {
				inputTeamEl.current.set(team ?? inputTeam);
			}

			// Set region
			if (inputRegionEl.current) {
				inputRegionEl.current.set(
					region ?? inputOptionsRegion[0].value ?? 'default'
				);
			}

			// Set about
			if (inputAboutEl.current) {
				inputAboutEl.current.set(about ?? '');
			}

			// Set optinComments
			if (inputOptinCommentsEl.current) {
				inputAboutEl.current.set(inputOptinComments ?? false);
			}
		} else {
			// Set error
			setError({
				error: `error/api-${response.status}`,
				message: `Error submitting user (${response.statusText})`,
			});
		}
	};

	/*----- Lifecycle -----*/

	// Watch - auth, uid, inputTeam, inputOptionsRegion, inputOptinComments
	useEffect(() => {
		// Function - fetchUsers
		const fetchUsers = async () => {
			// Is fetching
			setIsFetching(true);

			// Fetch user data (passing authToken)
			const response = await fetch(`/api/users/${uid}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			// Stop fetching
			setIsFetching(false);

			// If success...
			if (response.ok) {
				// Get responseJson
				const responseJson = await response.json();
				const {
					firstName,
					lastName,
					email,
					team,
					region,
					about,
					optinComments,
				} = responseJson;

				// Set first name
				if (inputFirstNameEl.current) {
					inputFirstNameEl.current.set(firstName ?? '');
				}

				// Set last name
				if (inputLastNameEl.current) {
					inputLastNameEl.current.set(lastName ?? '');
				}

				// Set email
				if (inputEmailEl.current) {
					inputEmailEl.current.set(email ?? '');
				}

				// Set team
				if (inputTeamEl.current) {
					inputTeamEl.current.set(team ?? inputTeam);
				}

				// Set region
				if (inputRegionEl.current) {
					inputRegionEl.current.set(
						region ?? inputOptionsRegion[0].value ?? 'default'
					);
				}

				// Set about
				if (inputAboutEl.current) {
					inputAboutEl.current.set(about ?? '');
				}

				// Set optinComments
				if (inputOptinCommentsEl.current) {
					inputAboutEl.current.set(inputOptinComments ?? false);
				}
			}
		};

		// Fetch users
		if (auth.currentUser && auth.token) {
			fetchUsers();
		}
	}, [auth, uid, inputTeam, inputOptionsRegion, inputOptinComments, token]);

	/*----- Init -----*/

	// If no auth...
	if (!auth.token || !auth.currentUser) {
		// Return restricted access
		return (
			<MessageRestricted className="grow" code={'restricted/auth/token'} />
		);
	}

	// Return default
	return (
		<form
			className={classNames(`form text-left`, className)}
			data-name={name}
			onSubmit={handleSubmit}
		>
			<div className="form__container space-y-12">
				{isFetching || isSubmitting ? (
					<MessageRestricted className="grow" code={'restricted/timeout'} />
				) : (
					<>
						{/* Heading */}
						<div className="form__row flex flex-col justify-between border-b pb-6 space-y-8 sm:flex-row sm:space-y-0 sm:space-x-6 sm:text-left">
							<div className="form__col space-y-6">
								<h2 className="form__title text-4xl font-bold tracking-tight">
									Edit {strCapitalize(names.user)}
								</h2>

								{uid && (
									<ButtonUid uid={uid} className="inline-flex items-center" />
								)}
							</div>
							<div className="form__col flex flex-col justify-between items-start space-y-4 sm:items-end sm:text-right">
								{role === 'moderator' && (
									<span className="inline-flex justify-center items-center rounded-full px-6 text-sm tracking-normal bg-moderator text-white">
										Moderator
									</span>
								)}
								{role === 'admin' && (
									<span className="inline-flex justify-center items-center rounded-full px-6 py-2 text-sm tracking-normal bg-admin text-white">
										Admin
									</span>
								)}
							</div>
						</div>

						{/* Errors */}
						{error && <FormNotice error={error} />}

						{/* Inputs */}
						<div className="form__row border-b border-gray-900/10 pb-12">
							<h3 className="form__subtitle text-base font-semibold leading-7 text-gray-900">
								Personal Information
							</h3>

							<p className="form__body mt-1 text-sm leading-6 text-gray-600">
								All information is secure and only available to Global
								employees.
							</p>

							<div className="form__input-wrapper mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
								{/* First Name */}
								<div className="form__input space-y-2 sm:col-span-3">
									<InputText
										ref={inputFirstNameEl}
										type="text"
										label="First name"
										name="first-name"
										id="first-name"
										defaultValue={inputFirstName}
										autoComplete="given-name"
										error={errors['first-name']}
										onChange={handleInputChange}
									/>
								</div>

								{/* Last Name */}
								<div className="form__input space-y-2 sm:col-span-3">
									<InputText
										ref={inputLastNameEl}
										type="text"
										label="Last name"
										name="last-name"
										id="last-name"
										defaultValue={inputLastName}
										autoComplete="family-name"
										error={errors['last-name']}
										onChange={handleInputChange}
									/>
								</div>

								{/* Email */}
								<div className="form__input space-y-2 sm:col-span-6">
									<InputText
										ref={inputEmailEl}
										type="email"
										label="Email address"
										name="email"
										id="email"
										defaultValue={inputEmail}
										autoComplete="email"
										error={errors['email']}
										onChange={handleInputChange}
									/>
								</div>

								{/* Team */}
								<div className="form__input space-y-2 sm:col-span-3">
									<InputSelect
										ref={inputTeamEl}
										label="Team"
										name="team"
										id="team"
										defaultValue={inputTeam}
										values={inputOptionsTeam}
										error={errors['team']}
										onChange={handleInputChange}
									/>
								</div>

								{/* Region */}
								<div className="form__input space-y-2 sm:col-span-3">
									<InputSelect
										ref={inputRegionEl}
										label="Region"
										name="region"
										id="region"
										defaultValue={inputRegion}
										values={inputOptionsRegion}
										error={errors['region']}
										onChange={handleInputChange}
									/>
								</div>

								{/* About */}
								<div className="form__input space-y-2 col-span-full">
									<InputTextarea
										ref={inputAboutEl}
										label="About"
										name="about"
										id="about"
										defaultValue={inputAbout}
										description="Write a few sentences about yourself."
										error={errors['about']}
										onChange={handleInputChange}
									/>
								</div>
							</div>
						</div>

						{/* Optins */}
						<div className="form__row border-b border-gray-900/10 pb-12">
							<h3 className="form__subtitle text-base font-semibold leading-7 text-gray-900">
								Notifications
							</h3>

							<p className="form__body mt-1 text-sm leading-6 text-gray-600">
								We&apos;ll always let you know about important changes, but you
								can pick what else you want to hear about.
							</p>

							<div className="form__input-wrapper pt-8 space-y-10">
								<FieldsetCheckboxes
									legend="By Email"
									values={[
										{
											label: 'Comments',
											name: 'comments',
											description:
												'Get notified when someones posts a comment on a session.',
										},
									]}
								/>
							</div>
						</div>

						{/* Buttons */}
						<div className="form__row flex items-center justify-end gap-x-6">
							<button
								className="form__button rounded-md px-3 py-2 font-semibold text-sm shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 bg-blue-600 text-white lg:hover:bg-blue-500 focus-visible:outline-blue-600"
								type="submit"
							>
								Save {names.user}
							</button>
						</div>
					</>
				)}
			</div>
		</form>
	);
}
