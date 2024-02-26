// Component: FormEventEdit
/*----------------------------------------------------------------------------------------------------*/

'use client';

/*---------- Imports ----------*/

// Config
import {
	Duration,
	TeamClient,
	EventClient,
	PlatformClient,
	Role,
	Validation,
} from '@/types';
import names from '@/data/names';
import warnings from '@/data/warnings';
import { staticEventOnboarding } from '@/data/content';

// Scripts (node)
import { useRef, useState, useEffect } from 'react';
import dayjs from 'dayjs';

// Scripts (local)
import { classNames, strRemoveDuplicates, strCapitalize } from '@/lib/utils';
import { useAuth } from '@/components/base/TheProviderAuth';
import { useCalendar } from '@/components/base/TheProviderCalendar';
import {
	validateEventId,
	validateEventName,
	validateEventBrands,
	validateEventTeam,
	validateEventRegion,
	validateEventDatetime,
	validateEventDuration,
} from '@/firebase/lib/validation';

// Components (node)
import {
	CalendarIcon,
	ClockIcon,
	MapPinIcon,
	UserIcon,
	UserGroupIcon,
	GlobeEuropeAfricaIcon,
	Bars3BottomLeftIcon,
	ListBulletIcon,
} from '@heroicons/react/24/solid';

// Components (local)
import MessageRestricted from '@/components/singles/Message/MessageRestricted';
import BadgeBrand from '@/components/singles/Badge/BadgeBrand';
import BadgeTeam from '@/components/singles/Badge/BadgeTeam';
import BadgePlatform from '@/components/singles/Badge/BadgePlatform';
import FieldsetBrands from '@/components/singles/Input/FieldsetBrands';
import InputText from '@/components/singles/Input/InputText';
import InputSelect from '@/components/singles/Input/InputSelect';
import InputTextarea from '@/components/singles/Input/InputTextarea';
import InputDatetime from '@/components/singles/Input/InputDatetime';
import InputNumber from '@/components/singles/Input/InputNumber';
import InputDatetimeSlot from '@/components/singles/Input/InputDatetimeSlot';
import ButtonId from '@/components/singles/Button/ButtonId';
import EmblaCarousel from '@/components/utility/Carousel/EmblaCarousel';
import FormNotice from './_partials/FormNotice';
import CardEvent from '../Card/CardEvent';

/*---------- Static Data ----------*/

// Name
const name = 'FormEventEdit';

// Options
export const inputOptionsResponseTime = [
	{
		value: 'default',
		label: 'Less than 24 hours',
	},
	{
		value: '24h-1w',
		label: '24 hours - 1 week',
	},
	{
		value: '1w-2w',
		label: '1 - 2 weeks',
	},
	{
		value: '2w+',
		label: 'More than 2 weeks',
	},
];
export const inputValueDefaultDuration = 20;

/*---------- Template ----------*/

// Types
export type FormEventEditProps = {
	id: string;
	generalType?: 'static' | 'snapshot';
	role?: Role;
	imageUrl?: string;
	className?: string;
};
export type FormEventEditPresenterProps = {
	uid: string;
	id: string;
	generalType?: 'static' | 'snapshot';
	name?: string;
	inputOptionsBrand?: {
		value: string;
		label: string;
		image?: string;
	}[];
	inputOptionsTeam?: {
		value: string;
		label: string;
	}[];
	inputOptionsRegion?: {
		value: string;
		label: string;
	}[];
	inputOptionsPlatform?: {
		value: string;
		label: string;
	}[];
	authToken?: string;
	event?: EventClient;
	role?: Role;
	className?: string;
	onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
};

// Default component
export default function FormEventEdit(props: FormEventEditProps) {
	/*----- Props -----*/

	// Get props
	const { id, role, className } = props;

	/*----- Store -----*/

	// Input options
	const [inputOptionsBrand, setInputOptionsBrand] = useState<
		{
			value: string;
			label: string;
		}[]
	>([]);
	const [inputOptionsTeam, setInputOptionsTeam] = useState<
		{
			value: string;
			label: string;
		}[]
	>([]);
	const [inputOptionsRegion, setInputOptionsRegion] = useState<
		{
			value: string;
			label: string;
		}[]
	>([]);
	const [inputOptionsPlatform, setInputOptionsPlatform] = useState<
		{
			value: string;
			label: string;
		}[]
	>([]);

	// Context - auth
	const auth = useAuth();
	const { currentUser } = auth;

	// Context - useCalendar
	const calendar = useCalendar();
	const { generalType, brands, teams, regions, platforms, event, getEvent } =
		calendar;

	/*----- Lifecycle -----*/

	// Watch - brands
	useEffect(() => {
		// Declare options
		let options = [] as {
			value: string;
			label: string;
		}[];

		// If brands...
		if (brands) {
			// Map brands
			options = brands.map((brand) => ({
				value: brand.id,
				label: brand.name,
				imageUrl: brand.imageUrl ?? undefined,
			}));
		}

		// Set options
		setInputOptionsBrand(options);
	}, [brands]);

	// Watch - teams
	useEffect(() => {
		// Declare options
		let options = [] as {
			value: string;
			label: string;
		}[];

		// If teams...
		if (teams) {
			// Map teams
			options = teams.map((team) => ({
				value: team.id,
				label: team.name,
			}));
		}

		// Set options
		setInputOptionsTeam(options);
	}, [teams]);

	// Watch - regions
	useEffect(() => {
		// Declare options
		let options = [] as {
			value: string;
			label: string;
		}[];

		// If regions...
		if (regions) {
			// Map regions
			options = regions.map((region) => ({
				value: region.id,
				label: region.name,
			}));
		}

		// Set options
		setInputOptionsRegion(options);
	}, [regions]);

	// Watch - platforms
	useEffect(() => {
		// Declare options
		let options = [] as {
			value: string;
			label: string;
		}[];

		// If platforms...
		if (platforms) {
			// Map platforms
			options = platforms.map((platform) => ({
				value: platform.id,
				label: platform.name,
			}));
		}

		// Set options
		setInputOptionsPlatform(options);
	}, [platforms]);

	// Watch - id, getEvent
	useEffect(() => {
		// If no id, getEvent...
		if (!id || !getEvent) {
			// Return
			return;
		}

		// Get event
		getEvent(id);
	}, [id, getEvent]);

	/*----- Init -----*/

	// If no auth...
	if (!auth.token || !auth.currentUser) {
		// Return restricted access
		return (
			<MessageRestricted className="grow" code={'restricted/auth/token'} />
		);
	}

	// Get uid
	const uid = auth.currentUser.uid;

	// If no auth, brands, teams or regions...
	if (
		inputOptionsBrand.length <= 0 ||
		inputOptionsTeam?.length <= 0 ||
		inputOptionsRegion?.length <= 0
	) {
		// Return
		return <MessageRestricted className="grow" code={'restricted/timeout'} />;
	}

	// Presenter props
	const presenterProps = {
		uid,
		id,
		generalType,
		inputOptionsBrand,
		inputOptionsTeam,
		inputOptionsRegion,
		inputOptionsPlatform,
		authToken: auth.token,
		event,
		role: props.role,
		className,
	} as FormEventEditPresenterProps;

	// Switch - role
	switch (role) {
		case 'admin':
		case 'moderator':
			return <FormEventEditModerator {...presenterProps} />;

		default:
			if (event) {
				return <FormEventEditExisting {...presenterProps} />;
			} else {
				return <FormEventEditNew {...presenterProps} />;
			}
	}
}

// FormEventEditNew component
export function FormEventEditNew(props: FormEventEditPresenterProps) {
	/*----- Props -----*/

	// Get props
	const {
		uid,
		id,
		generalType,
		inputOptionsBrand,
		inputOptionsRegion,
		authToken,
		event,
		role,
		className,
	} = props;

	/*----- Refs -----*/

	// Page Refs
	const pageEls = useRef<any[]>([]);

	// Input Refs
	const inputCarouselEl = useRef<any>(null);
	const inputResponseTimeEl = useRef<any>(null);
	const inputNameEl = useRef<any>(null);
	const inputBrandsEl = useRef<any>(null);
	const inputTeamEl = useRef<any>(null);
	const inputRegionEl = useRef<any>(null);
	const inputPlatformEl = useRef<any>(null);
	const inputAboutEl = useRef<any>(null);
	const inputDurationEl = useRef<any>(null);

	/*----- Store -----*/

	// Input Options
	const [inputOptionsTeam, setInputOptionsTeam] = useState<
		{
			value: string;
			label: string;
			imageUrl?: string;
		}[]
	>([]);
	const [inputOptionsPlatform, setInputOptionsPlatform] = useState<
		{
			value: string;
			label: string;
		}[]
	>([]);
	const [inputOptionsDuration, setInputOptionsDuration] = useState<Duration[]>(
		[]
	);

	// Input values
	const [inputValueId, setInputValueId] = useState<string>(id);
	const [inputValueResponseTime, setInputValueResponseTime] =
		useState<string>('default');
	const [inputValueName, setInputValueName] = useState<string>('');
	const [inputValueBrands, setInputValueBrands] = useState<string[]>([]);
	const [inputValueTeam, setInputValueTeam] = useState<string>(
		inputOptionsTeam ? inputOptionsTeam[0]?.value : 'default'
	);
	const [inputValueRegion, setInputValueRegion] = useState<string>(
		inputOptionsRegion ? inputOptionsRegion[0]?.value : 'default'
	);
	const [inputValuePlatform, setInputValuePlatform] = useState<string>(
		inputOptionsPlatform ? inputOptionsPlatform[0]?.value : 'default'
	);
	const [inputValueDuration, setInputValueDuration] = useState<number>(
		inputValueDefaultDuration
	);
	const [inputValueAbout, setInputValueAbout] = useState<string>('');
	const [inputValueDatetime, setInputValueDatetime] = useState<string>(
		dayjs().format('YYYY-MM-DDTHH:mm')
	);
	const inputSetters = {
		id: setInputValueId,
		'response-time': setInputValueResponseTime,
		name: setInputValueName,
		brands: setInputValueBrands,
		team: setInputValueTeam,
		region: setInputValueRegion,
		platform: setInputValuePlatform,
		duration: setInputValueDuration,
		about: setInputValueAbout,
		datetime: setInputValueDatetime,
	};

	// Input errors
	const [error, setError] = useState<Validation>(false);
	const [errors, setErrors] = useState<{
		id: Validation;
		'response-time': Validation;
		name: Validation;
		host: Validation;
		location: Validation;
		brands: Validation;
		team: Validation;
		region: Validation;
		platform: Validation;
		about: Validation;
		datetime: Validation;
		duration: Validation;
	}>({
		id: false,
		'response-time': false,
		name: false,
		host: false,
		location: false,
		brands: false,
		team: false,
		region: false,
		platform: false,
		about: false,
		datetime: false,
		duration: false,
	});

	// Warning
	const [warning, setWarning] = useState<string | false>(false);

	// Form states
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [pageCurrent, setPageCurrent] = useState<number>(0);

	// Context - useCalendar
	const calendar = useCalendar();
	const { teams, regions, platforms } = calendar;

	/*----- Methods -----*/

	// Function - handleClickPrev
	const handleClickPrev = () => {
		// If pageCurrent > 0...
		if (pageCurrent > 0) {
			// Set pageCurrent
			setPageCurrent((prevState) => prevState - 1);
		}
	};

	// Function - handleClickNext
	const handleClickNext = () => {
		// If pageCurrent < staticEventOnboarding length...
		if (pageCurrent < staticEventOnboarding.length - 1) {
			// Set pageCurrent
			setPageCurrent((prevState) => prevState + 1);
		}
	};

	// Function - handleInputChange
	const handleInputChange = (name: string, value: any) => {
		// Set state
		inputSetters[name as keyof typeof inputSetters](value);
	};

	// Function - handleClickTimeslot
	const handleClickTimeslot = (datetime: string) => {
		// Set inputValueDatetime
		setInputValueDatetime(datetime);

		// Next page
		handleClickNext();
	};

	// Function - validateInput
	const validateInput = (name: string, value: any): Validation => {
		// Define error
		let error = false as Validation;

		// Switch - name
		switch (name) {
			case 'id':
				error = validateEventId(value);
				setErrors((prevState) => ({
					...prevState,
					id: error,
				}));
				return error;

			case 'name':
				error = validateEventName(value);
				setErrors((prevState) => ({
					...prevState,
					name: error,
				}));
				return error;

			case 'brands':
				error = validateEventBrands(value);
				setErrors((prevState) => ({
					...prevState,
					brands: error,
				}));
				return error;

			case 'team':
				error = validateEventTeam(value);
				setErrors((prevState) => ({
					...prevState,
					team: error,
				}));
				return error;

			case 'region':
				error = validateEventRegion(value);
				setErrors((prevState) => ({
					...prevState,
					region: error,
				}));
				return error;

			case 'datetime':
				error = validateEventDatetime(value);
				setErrors((prevState) => ({
					...prevState,
					datetime: error,
				}));
				return error;

			case 'duration':
				error = validateEventDuration(value);
				setErrors((prevState) => ({
					...prevState,
					duration: error,
				}));
				return error;

			default:
				break;
		}

		// Return
		return error;
	};

	// Function - validateAll
	const validateAll = () => {
		// Define errors
		const returnValue = {
			name: validateInput('name', inputValueName),
			brands: validateInput('brands', inputValueBrands),
			team: validateInput('team', inputValueTeam),
			region: validateInput('region', inputValueRegion),
			datetime: validateInput('datetime', inputValueDatetime),
			duration: validateInput('duration', inputValueDuration),
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

	// Function - handleSubmit
	const handleSubmit = async () => {
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
			uid,
			id: inputValueId,
			name: inputValueName,
			brands: inputValueBrands,
			team: inputValueTeam,
			region: inputValueRegion,
			platform: inputValuePlatform,
			about: inputValueAbout,
			datetime: inputValueDatetime,
			duration: inputValueDuration,
		};

		// Is submitting
		setIsSubmitting(true);

		// Submit values
		const response = await fetch(`/api/event/${id}/submit`, {
			method: 'POST',
			body: JSON.stringify(values),
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${authToken}`,
			},
		});

		// If success...
		if (response.ok) {
			// Get responseJson
			const responseJson = await response.json();

			// Go to responseJson.href
			window.location.href = responseJson.href;

			return;
		} else {
			// Set error
			setError({
				error: `error/api-${response.status}`,
				message: `Error submitting event (${response.statusText})`,
			});

			// Stop submitting
			setIsSubmitting(false);
		}
	};

	/*----- Lifecycle -----*/

	// Watch - pageCurrent
	useEffect(() => {
		// Scroll to page
		inputCarouselEl.current?.scrollTo(pageCurrent);
	}, [pageCurrent, inputCarouselEl.current?.scrollTo]);

	// Watch - inputOptionsDuration
	useEffect(() => {
		// If inputOptionsDuration...
		if (inputOptionsDuration.length > 0) {
			// Set inputValueDuration
			setInputValueDuration(inputOptionsDuration[0].value);
		}
	}, [inputOptionsDuration]);

	// Watch - inputValueBrands
	useEffect(() => {
		// Declare teamIds, teamOptions
		let teamIds = [] as string[];
		let teamOptions = [] as {
			value: string;
			label: string;
		}[];

		// Loop inputValueBrands
		inputValueBrands.forEach((inputValueBrand) => {
			// Loop inputOptionsTeam
			teams?.forEach((team) => {
				// If team.brands array contains string inputValueBrand...
				if (team.brands?.includes(inputValueBrand)) {
					// Add team.id to teamIds
					teamIds.push(team.id);
				}
			});
		});

		// Remove duplicates
		teamIds = strRemoveDuplicates(teamIds);

		// If multiple teamIds...
		if (teamIds.length > 1) {
			// If default team...
			const defaultTeam = teams?.filter(
				(team: TeamClient) => team.id === 'default'
			);
			if (defaultTeam) {
				// Set teamOptions
				teamOptions = [
					{
						value: defaultTeam[0].id,
						label: defaultTeam[0].name,
					},
				];
				// Set inputValueTeam
				setInputValueTeam(defaultTeam[0].id);
			} else {
				// Set teamOptions
				teamOptions =
					teams
						?.filter((team: TeamClient) => teamIds.includes(team.id))
						.map((team: TeamClient) => ({
							value: team.id,
							label: team.name,
						})) ?? [];
				// Set inputValueTeam
				setInputValueTeam(teamOptions[0].value);
			}
		} else {
			// Set teamOptions
			teamOptions =
				teams
					?.filter((team: TeamClient) => team.id === teamIds[0])
					.map((team: TeamClient) => ({
						value: team.id,
						label: team.name,
					})) ?? [];
			// Set inputValueTeam
			setInputValueTeam(teamOptions[0]?.value ?? 'default');
		}

		// Set inputOptionsTeam
		setInputOptionsTeam(teamOptions);
	}, [inputValueBrands, teams]);

	// Watch - inputValueTeam
	useEffect(() => {
		// If team with id inputValueTeam...
		const team = teams?.filter(
			(team) => team.id === inputValueTeam
		)?.[0] as TeamClient;
		if (team) {
			// If duration...
			if (team.duration && team.duration.length > 1) {
				// Set inputOptionsDuration
				setInputOptionsDuration(team.duration);
				// Set inputValueDuration
				setInputValueDuration(team.duration[0].value);
			} else if (team.duration && team.duration.length > 0) {
				// Set inputOptionsDuration
				setInputOptionsDuration([team.duration[0]]);
				// Set inputValueDuration
				setInputValueDuration(team.duration[0].value);
			} else {
				// Set inputOptionsDuration
				setInputOptionsDuration([]);
				// Set inputValueDuration
				setInputValueDuration(inputValueDefaultDuration);
			}
		}
	}, [inputValueTeam, teams]);

	// Watch - inputValueTeam, inputValueRegion
	useEffect(() => {
		// If team with id inputValueTeam and region with id inputValueRegion...
		const team = teams?.filter(
			(team) => team.id === inputValueTeam
		)?.[0] as TeamClient;
		const region = regions?.filter(
			(region) => region.id === inputValueRegion
		)?.[0];
		if (team && region) {
			// Declare platformOptions
			let platformOptions =
				platforms?.map((platform) => ({
					value: platform.id,
					label: platform.name,
				})) ?? [];

			// Filter by team
			platformOptions = platformOptions.filter(
				(platform) =>
					team.platforms?.includes(platform.value) &&
					region.platforms?.includes(platform.value)
			);

			// If platformOptions...
			if (platformOptions && platformOptions.length > 1) {
				// Set inputOptionsPlatform
				setInputOptionsPlatform(platformOptions);
				// Set inputValuePlatform
				setInputValuePlatform(platformOptions[0].value);
			} else if (platformOptions && platformOptions.length > 0) {
				// Set inputOptionsPlatform
				setInputOptionsPlatform([platformOptions[0]]);
				// Set inputValuePlatform
				setInputValuePlatform(platformOptions[0].value);
			} else {
				// Set inputOptionsPlatform
				setInputOptionsPlatform([]);
				// Set inputValuePlatform
				setInputValuePlatform('default');
			}
		}
	}, [inputValueTeam, inputValueRegion, teams, regions, platforms]);

	/*----- Init -----*/

	// Return default
	return (
		<form
			className={classNames(`form text-left`, className)}
			data-name={`${name}New`}
			onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
				e.preventDefault();
			}}
		>
			<div className="form__container space-y-12">
				{/* Heading */}
				<div className="form__row flex flex-col justify-between border-b pb-6 space-y-8 sm:flex-row sm:space-y-0 sm:space-x-6 sm:text-left">
					<div className="form__col space-y-6">
						<h2 className="form__title text-4xl font-bold tracking-tight">
							{staticEventOnboarding.map((page, p) => (
								<>{pageCurrent === p && page.title}</>
							))}
						</h2>
					</div>
					<div className="form__col flex flex-col justify-between items-start space-y-4 sm:items-end sm:text-right">
						<ButtonId id={id} className="inline-flex items-center" />
					</div>
				</div>

				{/* Errors */}
				{(error || warning) && <FormNotice error={error} warning={warning} />}

				{/* Inputs (Event Onboarding) */}
				<div className="form__inputs-wrapper relative w-full overflow-hidden">
					<EmblaCarousel
						className="max-w-full"
						ref={inputCarouselEl}
						options={{
							watchDrag: false, // <-- Disable swiping
							dragFree: false, // <-- Slide 'snaps' to nearest slide
						}}
					>
						{staticEventOnboarding.map((page, p) => (
							<div
								className={classNames(
									`form__inputs-page--${page.id} max-w-full relative space-y-6 transition-opacity duration-300 ease-out`
								)}
								ref={(el) => {
									pageEls.current[p] = el;
								}}
								key={`form-event-edit-page-${page.id}`}
							>
								{/* Intro */}
								{page.id === 'intro' && (
									<>
										{page.body && (
											<div
												className="form__inputs-page-body space-y-5"
												dangerouslySetInnerHTML={{ __html: page.body }}
											/>
										)}
									</>
								)}

								{/* Response Time */}
								{page.id === 'response-time' && (
									<>
										{page.body && (
											<div
												className="form__inputs-page-body space-y-5"
												dangerouslySetInnerHTML={{ __html: page.body }}
											/>
										)}
										<div className="form__input space-y-2">
											<InputSelect
												ref={inputResponseTimeEl}
												// label="Response Time"
												name="response-time"
												id="response-time"
												defaultValue={inputValueResponseTime}
												values={inputOptionsResponseTime}
												error={errors['response-time']}
												onChange={handleInputChange}
											/>
										</div>
									</>
								)}

								{/* Name */}
								{page.id === 'name' && (
									<>
										{page.body && inputValueResponseTime !== 'default' && (
											<div
												className="form__inputs-page-body space-y-5"
												dangerouslySetInnerHTML={{ __html: page.body }}
											/>
										)}
										{page.bodySalesforce &&
											inputValueResponseTime === 'default' && (
												<div
													className="form__inputs-page-body space-y-5"
													dangerouslySetInnerHTML={{
														__html: page.bodySalesforce,
													}}
												/>
											)}
										{inputValueResponseTime !== 'default' && (
											<div className="form__input space-y-2">
												<InputText
													ref={inputNameEl}
													type="text"
													// label={`${strCapitalize(names.event)} Name`}
													name="name"
													id="name"
													defaultValue={inputValueName}
													error={errors['name']}
													onChange={handleInputChange}
												/>
											</div>
										)}
									</>
								)}

								{/* Brands */}
								{page.id === 'brands' && (
									<>
										{page.body && (
											<div
												className="form__inputs-page-body space-y-5"
												dangerouslySetInnerHTML={{ __html: page.body }}
											/>
										)}
										<div className="form__input space-y-2">
											<FieldsetBrands
												ref={inputBrandsEl}
												// label="Brands"
												name="brands"
												id="brands"
												defaultValue={inputValueBrands}
												values={inputOptionsBrand}
												error={errors['brands']}
												onChange={handleInputChange}
											/>
										</div>
									</>
								)}

								{/* Region */}
								{page.id === 'region' && (
									<>
										{inputOptionsTeam.length > 1 ? (
											<>
												{page.body && (
													<div
														className="form__inputs-page-body space-y-5"
														dangerouslySetInnerHTML={{ __html: page.body }}
													/>
												)}
												<div className="form__input space-y-2">
													<InputSelect
														ref={inputTeamEl}
														label="Team"
														name="team"
														id="team"
														defaultValue={inputValueTeam}
														values={inputOptionsTeam}
														error={errors['team']}
														onChange={handleInputChange}
													/>
												</div>
											</>
										) : inputOptionsTeam.length === 1 ? (
											<div className="form__inputs-page-body space-y-5">
												That puts you in{' '}
												<b>
													<BadgeTeam id={inputValueTeam} />
												</b>
												.
											</div>
										) : (
											<>
												{page.bodyBadCombo && (
													<div
														className="form__inputs-page-body space-y-5"
														dangerouslySetInnerHTML={{
															__html: page.bodyBadCombo,
														}}
													/>
												)}
											</>
										)}

										<div className="form__input space-y-2">
											<InputSelect
												ref={inputRegionEl}
												// label="Region"
												name="region"
												id="region"
												// defaultValue={inputValueRegion}
												values={inputOptionsRegion}
												error={errors['region']}
												onChange={handleInputChange}
											/>
										</div>
									</>
								)}

								{/* Duration */}
								{page.id === 'duration' && (
									<>
										{inputOptionsDuration.length > 1 ? (
											<>
												{page.body && (
													<div
														className="form__inputs-page-body space-y-5"
														dangerouslySetInnerHTML={{ __html: page.body }}
													/>
												)}
												<div className="form__input space-y-2">
													<InputSelect
														ref={inputDurationEl}
														// label="Duration"
														name="duration"
														id="duration"
														defaultValue={inputValueDuration}
														values={inputOptionsDuration}
														error={errors['duration']}
														onChange={handleInputChange}
													/>
												</div>
											</>
										) : (
											<div className="form__inputs-page-body space-y-5">
												<p>
													The standard {names.duration} for{' '}
													<BadgeTeam id={inputValueTeam} /> is{' '}
													{inputValueDuration} minutes.
												</p>
											</div>
										)}
									</>
								)}

								{/* Platform */}
								{page.id === 'platform' && (
									<>
										{inputOptionsPlatform.length > 1 ? (
											<>
												{page.body && (
													<div
														className="form__inputs-page-body space-y-5"
														dangerouslySetInnerHTML={{ __html: page.body }}
													/>
												)}
												<div className="form__input space-y-2">
													<InputSelect
														ref={inputPlatformEl}
														// label="Platform"
														name="platform"
														id="platform"
														defaultValue={inputValuePlatform}
														values={inputOptionsPlatform}
														error={errors['platform']}
														onChange={handleInputChange}
													/>
												</div>
											</>
										) : inputOptionsPlatform.length === 1 ? (
											<div className="form__inputs-page-body space-y-5">
												That puts you in{' '}
												<b>
													<BadgePlatform id={inputValuePlatform} />
												</b>
												.
											</div>
										) : (
											<>
												{page.bodyBadCombo && (
													<div
														className="form__inputs-page-body space-y-5"
														dangerouslySetInnerHTML={{
															__html: page.bodyBadCombo,
														}}
													/>
												)}
											</>
										)}
									</>
								)}

								{/* About */}
								{page.id === 'about' && (
									<>
										{page.body && (
											<div
												className="form__inputs-page-body space-y-5"
												dangerouslySetInnerHTML={{ __html: page.body }}
											/>
										)}
										<div className="form__input space-y-2">
											<InputTextarea
												ref={inputAboutEl}
												// label="About"
												name="about"
												id="about"
												defaultValue={inputValueAbout}
												error={errors['about']}
												onChange={handleInputChange}
											/>
										</div>
									</>
								)}

								{/* Datetime */}
								{page.id === 'datetime' && (
									<>
										{page.body && (
											<div
												className="form__inputs-page-body space-y-5"
												dangerouslySetInnerHTML={{ __html: page.body }}
											/>
										)}
										<div className="form__input space-y-2">
											{pageCurrent >= p && (
												<InputDatetimeSlot
													// label="Datetime"
													name="datetime"
													id="datetime"
													inputValueTeam={inputValueTeam}
													inputValueRegion={inputValueRegion}
													inputValueDuration={inputValueDuration}
													error={errors['datetime']}
													onChange={handleClickTimeslot}
												/>
											)}
										</div>
									</>
								)}

								{/* Submit */}
								{page.id === 'submit' && (
									<>
										{isSubmitting ? (
											<MessageRestricted code={'restricted/timeout'} />
										) : (
											<>
												{page.body && (
													<div
														className="form__inputs-page-body space-y-5"
														dangerouslySetInnerHTML={{ __html: page.body }}
													/>
												)}
												<CardEvent
													className="max-w-full"
													event={{
														name: inputValueName,
														brands: inputValueBrands,
														team: inputValueTeam,
														region: inputValueRegion,
														platform: inputValuePlatform,
														about: inputValueAbout,
														date: dayjs(inputValueDatetime).format(
															'YYYY-MM-DD'
														),
														time: dayjs(inputValueDatetime).format('HH:mm'),
														duration: inputValueDuration,
													}}
												/>
											</>
										)}
									</>
								)}
							</div>
						))}
					</EmblaCarousel>
				</div>

				{/* Buttons */}
				<div className="form__row flex items-center justify-end pt-8 gap-x-4">
					{/* Previous */}
					{(staticEventOnboarding[pageCurrent].id === 'response-time' ||
						staticEventOnboarding[pageCurrent].id === 'name' ||
						staticEventOnboarding[pageCurrent].id === 'brands' ||
						staticEventOnboarding[pageCurrent].id === 'region' ||
						staticEventOnboarding[pageCurrent].id === 'platform' ||
						staticEventOnboarding[pageCurrent].id === 'duration' ||
						staticEventOnboarding[pageCurrent].id === 'about' ||
						staticEventOnboarding[pageCurrent].id === 'datetime' ||
						staticEventOnboarding[pageCurrent].id === 'submit') && (
						<button
							className="form__button rounded-md px-3 py-2 font-semibold text-sm shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 bg-blue-600 text-white lg:hover:bg-blue-500 focus-visible:outline-blue-600"
							type="button"
							onClick={handleClickPrev}
						>
							{staticEventOnboarding[pageCurrent].prev}
						</button>
					)}

					{/* Next */}
					{(staticEventOnboarding[pageCurrent].id === 'intro' ||
						staticEventOnboarding[pageCurrent].id === 'response-time' ||
						(staticEventOnboarding[pageCurrent].id === 'name' &&
							inputValueResponseTime !== 'default') ||
						staticEventOnboarding[pageCurrent].id === 'brands' ||
						staticEventOnboarding[pageCurrent].id === 'region' ||
						staticEventOnboarding[pageCurrent].id === 'platform' ||
						staticEventOnboarding[pageCurrent].id === 'duration' ||
						staticEventOnboarding[pageCurrent].id === 'about') && (
						<button
							className={classNames(
								`form__button rounded-md px-3 py-2 font-semibold text-sm shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 bg-blue-600 text-white lg:hover:bg-blue-500 focus-visible:outline-blue-600`,
								((staticEventOnboarding[pageCurrent].id === 'name' &&
									inputValueName == '') ||
									(staticEventOnboarding[pageCurrent].id === 'brands' &&
										(inputValueBrands.length === 0 ||
											inputOptionsTeam.length < 1))) &&
									'opacity-50 pointer-events-none'
							)}
							type="button"
							onClick={handleClickNext}
						>
							{staticEventOnboarding[pageCurrent].next}
						</button>
					)}

					{/* Submit */}
					{staticEventOnboarding[pageCurrent].id === 'submit' && (
						<button
							className="form__button rounded-md px-3 py-2 font-semibold text-sm shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 bg-blue-600 text-white lg:hover:bg-blue-500 focus-visible:outline-blue-600"
							type="submit"
							onClick={handleSubmit}
						>
							{staticEventOnboarding[pageCurrent].submit}
						</button>
					)}
				</div>
			</div>
		</form>
	);
}

// FormEventEditExisting component
export function FormEventEditExisting(props: FormEventEditPresenterProps) {
	/*----- Props -----*/

	// Get props
	const {
		id,
		generalType,
		inputOptionsBrand,
		inputOptionsTeam,
		inputOptionsRegion,
		authToken,
		event,
		role,
		className,
	} = props;

	/*----- Refs -----*/

	// Input Refs
	const inputNameEl = useRef<any>(null);
	const inputAboutEl = useRef<any>(null);

	/*----- Store -----*/

	// Input values
	const [inputValueName, setInputValueName] = useState<string>('');
	const [inputValueAbout, setInputValueAbout] = useState<string>('');
	const inputSetters = {
		name: setInputValueName,
		about: setInputValueAbout,
	};

	// Input errors
	const [error, setError] = useState<Validation>(false);
	const [errors, setErrors] = useState<{
		name: Validation;
		about: Validation;
	}>({
		name: false,
		about: false,
	});

	// Warning
	const [warning, setWarning] = useState<string | false>(false);

	// Form states
	const [isFetching, setIsFetching] = useState<boolean>(false);
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

	/*----- Methods -----*/

	// Function - validateInput
	const validateInput = (name: string, value: any): Validation => {
		// Define error
		let error = false as Validation;

		// Switch - name
		switch (name) {
			case 'name':
				error = validateEventName(value);
				setErrors((prevState) => ({
					...prevState,
					name: error,
				}));
				return error;

			default:
				break;
		}

		// Return
		return error;
	};

	// Function - validateAll
	const validateAll = () => {
		// Define errors
		const returnValue = {
			name: validateInput('name', inputValueName),
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
			id,
			name: inputValueName,
			about: inputValueAbout,
		};

		// Is submitting
		setIsSubmitting(true);

		// Submit values
		const response = await fetch(`/api/event/${id}/submit`, {
			method: 'POST',
			body: JSON.stringify(values),
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${authToken}`,
			},
		});

		// If success...
		if (response.ok) {
			// Get responseJson
			const responseJson = await response.json();

			// Go to responseJson.href
			window.location.href = responseJson.href;

			return;
		} else {
			// Set error
			setError({
				error: `error/api-${response.status}`,
				message: `Error submitting event (${response.statusText})`,
			});

			// Stop submitting
			setIsSubmitting(false);
		}
	};

	/*----- Lifecycle -----*/

	// Watch - generalType
	useEffect(() => {
		// If 'static'...
		if (generalType === 'static') {
			// Set warning
			setWarning(warnings['warning/snapshot/500']);
		} else {
			// Set warning
			setWarning(false);
		}
	}, [generalType]);

	// Watch - event
	useEffect(() => {
		// If no event...
		if (!event) {
			// Return
			return;
		}

		// If name...
		if (event.name) {
			// Set name
			inputNameEl.current?.set(event.name);
		}

		// If about...
		if (event.about) {
			// Set about
			inputAboutEl.current?.set(event.about);
		}
	}, [inputOptionsRegion, inputOptionsTeam, event]);

	/*----- Init -----*/

	// If no event...
	if (!event) {
		// Return
		return <MessageRestricted code={'restricted/event/404'} />;
	}

	// Return default
	return (
		<form
			className={classNames(`form text-left`, className)}
			data-name={`${name}Existing`}
			onSubmit={handleSubmit}
		>
			<div className="form__container space-y-12">
				{isFetching || isSubmitting ? (
					<MessageRestricted code={'restricted/timeout'} />
				) : (
					<>
						{/* Heading */}
						<div className="form__row flex flex-col justify-between border-b pb-6 space-y-8 sm:flex-row sm:space-y-0 sm:space-x-6 sm:text-left">
							<div className="form__col space-y-6">
								<h2 className="form__title text-4xl font-bold tracking-tight">
									Edit {strCapitalize(names.event)}
								</h2>
								{event?.id && (
									<ButtonId
										id={event.id}
										className="inline-flex items-center"
									/>
								)}
								<div className="form__datetime flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:space-x-6">
									<div className="form__datetime-date flex justify-center items-center space-x-4 font-semibold sm:justify-start text-gray-900">
										<span className="form__datetime-date-icon">
											<h3 className="form__datetime-date-label sr-only">
												Date
											</h3>
											<CalendarIcon className="w-5 h-5 text-gray-400" />
										</span>
										<span className="form__datetime-date-text">
											{strCapitalize(event.date ?? 'TBC')}
										</span>
									</div>
									<div className="form__datetime-time flex justify-center items-center space-x-4 font-semibold sm:justify-start text-gray-900">
										<span className="form__datetime-time-icon">
											<h3 className="form__datetime-time-label sr-only">
												Time
											</h3>
											<ClockIcon className="w-5 h-5 text-gray-400" />
										</span>
										<span className="form__datetime-time-text">
											{strCapitalize(event.time ?? 'TBC')}
											{event.timeend && (
												<>
													<span className="text-gray-400 px-2">-</span>
													{event.timeend}
												</>
											)}
										</span>
									</div>
								</div>
							</div>
							<div className="form__col flex flex-col justify-between items-start space-y-4 sm:items-end sm:text-right">
								{event.brands && (
									<div className="form__brands-container flex flex-wrap justify-center items-center gap-2 sm:justify-end md:gap-0 md:-space-x-6">
										{event.brands.map((brand) => (
											<BadgeBrand
												key={`form-event-view-brand-${brand}`}
												id={brand}
											/>
										))}
									</div>
								)}
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
						{(error || warning) && (
							<FormNotice error={error} warning={warning} />
						)}

						{/* Inputs */}
						<div className="form__row border-b border-gray-900/10 pb-12">
							<h3 className="form__subtitle text-base font-semibold leading-7 text-gray-900">
								General Information
							</h3>

							<p className="form__body mt-1 text-sm leading-6 text-gray-600">
								Tell us about your event.
							</p>

							<div className="form__input-wrapper mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
								{/* Name */}
								<div className="form__input space-y-2 sm:col-span-6">
									<InputText
										ref={inputNameEl}
										type="text"
										label={`${strCapitalize(names.event)} Name`}
										name="name"
										id="name"
										defaultValue={inputValueName}
										error={errors['name']}
										onChange={handleInputChange}
									/>
								</div>

								{/* About */}
								<div className="form__input space-y-2 col-span-full">
									<InputTextarea
										ref={inputAboutEl}
										label="About"
										name="about"
										id="email"
										defaultValue={inputValueAbout}
										description={`Write a few sentences about the ${names.event}.`}
										error={errors['about']}
										onChange={handleInputChange}
									/>
								</div>
							</div>
						</div>

						{/* Buttons */}
						<div className="form__row flex items-center justify-end gap-x-4">
							<button
								className="form__button rounded-md px-3 py-2 font-semibold text-sm shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 bg-blue-600 text-white lg:hover:bg-blue-500 focus-visible:outline-blue-600"
								type="submit"
							>
								Save changes
							</button>
						</div>
					</>
				)}
			</div>
		</form>
	);
}

// FormEventEditModerator component
export function FormEventEditModerator(props: FormEventEditPresenterProps) {
	/*----- Props -----*/

	// Get props
	const {
		uid,
		id,
		generalType,
		inputOptionsBrand,
		inputOptionsTeam,
		inputOptionsRegion,
		inputOptionsPlatform,
		authToken,
		event,
		role,
		className,
	} = props;

	/*----- Refs -----*/

	// Input Refs
	const inputNameEl = useRef<any>(null);
	const inputHostEl = useRef<any>(null);
	const inputLocationEl = useRef<any>(null);
	const inputBrandsEl = useRef<any>(null);
	const inputTeamEl = useRef<any>(null);
	const inputRegionEl = useRef<any>(null);
	const inputPlatformEl = useRef<any>(null);
	const inputAboutEl = useRef<any>(null);
	const inputDatetimeEl = useRef<any>(null);
	const inputDurationEl = useRef<any>(null);

	/*----- Store -----*/

	// Input values
	const [inputValueUid, setInputValueUid] = useState<string | null>();
	const [inputValueId, setInputValueId] = useState<string>(id);
	const [inputValueName, setInputValueName] = useState<string>('');
	const [inputValueHost, setInputValueHost] = useState<string>('');
	const [inputValueLocation, setInputValueLocation] = useState<string>('');
	const [inputValueBrands, setInputValueBrands] = useState<string[]>([]);
	const [inputValueTeam, setInputValueTeam] = useState<string>(
		inputOptionsTeam ? inputOptionsTeam[0].value : 'default'
	);
	const [inputValueRegion, setInputValueRegion] = useState<string>(
		inputOptionsRegion ? inputOptionsRegion[0].value : 'default'
	);
	const [inputValuePlatform, setInputValuePlatform] = useState<string>(
		inputOptionsPlatform ? inputOptionsPlatform[0].value : 'default'
	);
	const [inputValueAbout, setInputValueAbout] = useState<string>('');
	const [inputValueDatetime, setInputValueDatetime] = useState<string>(
		dayjs().format('YYYY-MM-DDTHH:mm')
	);
	const [inputValueDuration, setInputValueDuration] = useState<number>(20);
	const inputSetters = {
		id: setInputValueId,
		name: setInputValueName,
		host: setInputValueHost,
		location: setInputValueLocation,
		brands: setInputValueBrands,
		team: setInputValueTeam,
		region: setInputValueRegion,
		platform: setInputValuePlatform,
		about: setInputValueAbout,
		datetime: setInputValueDatetime,
		duration: setInputValueDuration,
	};

	// Input errors
	const [error, setError] = useState<Validation>(false);
	const [errors, setErrors] = useState<{
		id: Validation;
		name: Validation;
		host: Validation;
		location: Validation;
		brands: Validation;
		team: Validation;
		region: Validation;
		platform: Validation;
		about: Validation;
		datetime: Validation;
		duration: Validation;
	}>({
		id: false,
		name: false,
		host: false,
		location: false,
		brands: false,
		team: false,
		region: false,
		platform: false,
		about: false,
		datetime: false,
		duration: false,
	});

	// Warnings
	const [warning, setWarning] = useState<string | false>(false);

	// Form states
	const [isFetching, setIsFetching] = useState<boolean>(false);
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

	/*----- Methods -----*/

	// Function - validateInput
	const validateInput = (name: string, value: any): Validation => {
		// Define error
		let error = false as Validation;

		// Switch - name
		switch (name) {
			case 'id':
				error = validateEventId(value);
				setErrors((prevState) => ({
					...prevState,
					id: error,
				}));
				return error;

			case 'name':
				error = validateEventName(value);
				setErrors((prevState) => ({
					...prevState,
					name: error,
				}));
				return error;

			case 'brands':
				error = validateEventBrands(value);
				setErrors((prevState) => ({
					...prevState,
					brands: error,
				}));
				return error;

			case 'team':
				error = validateEventTeam(value);
				setErrors((prevState) => ({
					...prevState,
					team: error,
				}));
				return error;

			case 'region':
				error = validateEventRegion(value);
				setErrors((prevState) => ({
					...prevState,
					region: error,
				}));
				return error;

			case 'datetime':
				error = validateEventDatetime(value);
				setErrors((prevState) => ({
					...prevState,
					datetime: error,
				}));
				return error;

			case 'duration':
				error = validateEventDuration(value);
				setErrors((prevState) => ({
					...prevState,
					duration: error,
				}));
				return error;

			default:
				break;
		}

		// Return
		return error;
	};

	// Function - validateAll
	const validateAll = () => {
		// Define errors
		const returnValue = {
			name: validateInput('name', inputValueName),
			brands: validateInput('brands', inputValueBrands),
			team: validateInput('team', inputValueTeam),
			region: validateInput('region', inputValueRegion),
			datetime: validateInput('datetime', inputValueDatetime),
			duration: validateInput('duration', inputValueDuration),
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
			...(inputValueUid ? {} : { uid }),
			id: inputValueId,
			name: inputValueName,
			host: inputValueHost,
			location: inputValueLocation,
			brands: inputValueBrands,
			team: inputValueTeam,
			region: inputValueRegion,
			platform: inputValuePlatform,
			about: inputValueAbout,
			datetime: inputValueDatetime,
			duration: inputValueDuration,
		};

		// Is submitting
		setIsSubmitting(true);

		// Submit values
		const response = await fetch(`/api/event/${id}/submit`, {
			method: 'POST',
			body: JSON.stringify(values),
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${authToken}`,
			},
		});

		// If success...
		if (response.ok) {
			// Get responseJson
			const responseJson = await response.json();

			// Go to responseJson.href
			window.location.href = responseJson.href;

			return;
		} else {
			// Set error
			setError({
				error: `error/api-${response.status}`,
				message: `Error submitting event (${response.statusText})`,
			});

			// Stop submitting
			setIsSubmitting(false);
		}
	};

	/*----- Lifecycle -----*/

	// Watch - generalType
	useEffect(() => {
		// If 'static'...
		if (generalType === 'static') {
			// Set warning
			setWarning(warnings['warning/snapshot/500']);
		} else {
			// Set warning
			setWarning(false);
		}
	}, [generalType]);

	// Watch - event
	useEffect(() => {
		// If no event...
		if (!event) {
			// Return
			return;
		}

		// If uid...
		if (event.uid) {
			// Set iid
			setInputValueUid(event.uid);
		}

		// If id...
		if (event.id) {
			// Set id
			setInputValueId(event.id);
		}

		// If name...
		if (event.name) {
			// Set name
			inputNameEl.current?.set(event.name);
		}

		// If host...
		if (event.host) {
			// Set host
			inputHostEl.current?.set(event.host);
		}

		// If location...
		if (event.location) {
			// Set location
			inputLocationEl.current?.set(event.location);
		}

		// If brands...
		if (event.brands) {
			// Set brands
			inputBrandsEl.current?.set(event.brands);
		}

		// If team...
		if (event.team) {
			// Set team
			inputTeamEl.current?.set(event.team);
		}

		// If region...
		if (event.region) {
			// Set region
			inputRegionEl.current?.set(event.region);
		}

		// If platform...
		if (event.platform) {
			// Set platform
			inputPlatformEl.current?.set(event.platform);
		}

		// If about...
		if (event.about) {
			// Set about
			inputAboutEl.current?.set(event.about);
		}

		// If datetime...
		if (event.datetime) {
			// Set datetime
			inputDatetimeEl.current?.set(event.datetime);
		}

		// If duration...
		if (event.duration) {
			// Set duration
			inputDurationEl.current?.set(event.duration);
		}
	}, [inputOptionsRegion, inputOptionsTeam, event]);

	/*----- Init -----*/

	// Return default
	return (
		<form
			className={classNames(`form text-left`, className)}
			data-name={name}
			onSubmit={handleSubmit}
		>
			<div className="form__container space-y-12">
				{isFetching || isSubmitting ? (
					<MessageRestricted code={'restricted/timeout'} />
				) : (
					<>
						{/* Heading */}
						<div className="form__row flex flex-col justify-between border-b pb-6 space-y-8 sm:flex-row sm:space-y-0 sm:space-x-6 sm:text-left">
							<div className="form__col flex flex-col justify-between items-start space-y-6 sm:text-left">
								<h2 className="form__title text-4xl font-bold tracking-tight">
									{event ? 'Edit' : 'Create a New'} {strCapitalize(names.event)}
								</h2>
								{event?.id && (
									<ButtonId
										id={event.id}
										className="inline-flex items-center"
									/>
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
						{(error || warning) && (
							<FormNotice error={error} warning={warning} />
						)}

						{/* Inputs */}
						<div className="form__row border-b border-gray-900/10 pb-12">
							<h3 className="form__subtitle text-base font-semibold leading-7 text-gray-900">
								General Information
							</h3>

							<p className="form__body mt-1 text-sm leading-6 text-gray-600">
								Tell us about your event.
							</p>

							<div className="form__input-wrapper mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
								{/* Name */}
								<div className="form__input space-y-2 sm:col-span-6">
									<InputText
										ref={inputNameEl}
										type="text"
										label={`${strCapitalize(names.event)} Name`}
										name="name"
										id="name"
										defaultValue={inputValueName}
										error={errors['name']}
										onChange={handleInputChange}
									/>
								</div>

								{/* Host */}
								<div className="form__input space-y-2 sm:col-span-3">
									<InputText
										ref={inputHostEl}
										type="text"
										label={`Host`}
										name="host"
										id="host"
										defaultValue={inputValueHost}
										error={errors['host']}
										onChange={handleInputChange}
									/>
								</div>

								{/* Location */}
								<div className="form__input space-y-2 sm:col-span-3">
									<InputText
										ref={inputLocationEl}
										type="text"
										label={`Location`}
										name="location"
										id="location"
										defaultValue={inputValueLocation}
										error={errors['location']}
										onChange={handleInputChange}
									/>
								</div>

								{/* Brands */}
								<div className="form__input space-y-2 sm:col-span-6">
									<FieldsetBrands
										ref={inputBrandsEl}
										legend="Brands"
										name="brands"
										id="brands"
										values={inputOptionsBrand}
										defaultValue={inputValueBrands}
										error={errors['brands']}
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
										defaultValue={inputValueTeam}
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
										// defaultValue={inputValueRegion}
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
										id="email"
										defaultValue={inputValueAbout}
										description={`Write a few sentences about the ${names.event}.`}
										error={errors['about']}
										onChange={handleInputChange}
									/>
								</div>

								{/* Platform */}
								<div className="form__input space-y-2 sm:col-span-3">
									<InputSelect
										ref={inputPlatformEl}
										label="Platform"
										name="platform"
										id="platform"
										defaultValue={inputValuePlatform}
										values={inputOptionsPlatform}
										error={errors['platform']}
										onChange={handleInputChange}
									/>
								</div>

								{/* Datetime */}
								<div className="form__input space-y-2 sm:col-span-2">
									<InputDatetime
										ref={inputDatetimeEl}
										label="Start Date / Time"
										name="datetime"
										id="datetime"
										defaultValue={inputValueDatetime}
										error={errors['datetime']}
										onChange={handleInputChange}
									/>
								</div>

								{/* Duration */}
								<div className="form__input space-y-2">
									<InputNumber
										ref={inputDurationEl}
										label={`Duration`}
										name="duration"
										id="duration"
										defaultValue={inputValueDuration}
										error={errors['duration']}
										onChange={handleInputChange}
									/>
								</div>
							</div>
						</div>

						{/* Buttons */}
						<div className="form__row flex items-center justify-end gap-x-4">
							<button
								className="form__button rounded-md px-3 py-2 font-semibold text-sm shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 bg-blue-600 text-white lg:hover:bg-blue-500 focus-visible:outline-blue-600"
								type="submit"
							>
								Save {names.event}
							</button>
						</div>
					</>
				)}
			</div>
		</form>
	);
}
