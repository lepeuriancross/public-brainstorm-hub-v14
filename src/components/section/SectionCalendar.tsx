// Component: SectionCalendar
/*----------------------------------------------------------------------------------------------------*/

'use client';

/*---------- Imports ----------*/

// Config
import {
	RegionClient,
	TeamClient,
	PlatformClient,
	EventClient,
	Role,
	ThemeFetchStatus,
	ThemeCalendarView,
	Day,
	EventClient,
} from '@/types';
import names from '@/data/names';

// Scripts (node)
import { Fragment, useState, useEffect } from 'react';

// Scripts (local)
import { classNames, strCapitalize, strGenerateUid } from '@/lib/utils';
import dayjs, { Dayjs } from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';

// Components (node)
import Link from 'next/link';
import {
	AdjustmentsHorizontalIcon,
	ChevronDownIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	ClockIcon,
	EllipsisHorizontalIcon,
	PencilIcon,
} from '@heroicons/react/20/solid';
import { Menu, Transition } from '@headlessui/react';

// Components (local)
import { useAuth } from '@/components/base/TheProviderAuth';
import { useCalendar } from '@/components/base/TheProviderCalendar';
import InputDate from '@/components/singles/Input/InputDate';

dayjs.extend(advancedFormat);

/*---------- Static Data ----------*/

// Name
const name = 'SectionCalendar';

/*---------- Template ----------*/

// Types
export type SectionCalendarProps = {
	className?: string;
};
export type SectionCalendarHeaderProps = {
	regions?: RegionClient[];
	teams?: TeamClient[];
	platforms?: PlatformClient[];
	filterByRegion?: RegionClient;
	filterByTeam?: TeamClient;
	filterByPlatform?: PlatformClient;
	view?: ThemeCalendarView;
	date?: Dayjs;
	hrefCreate?: string;
	hrefMonth?: string;
	hrefWeek?: string;
	hrefDay?: string;
	className?: string;
	onClickFilterByRegion?: (region?: RegionClient) => void;
	onClickFilterByTeam?: (team?: TeamClient) => void;
	onClickFilterByPlatform?: (platform?: PlatformClient) => void;
	onClickPrev?: () => void;
	onClickToday?: () => void;
	onClickNext?: () => void;
	onClickView?: (view: ThemeCalendarView) => void;
};
export type SectionCalendarMonthProps = {
	uid?: string;
	role?: Role;
	days?: Day[];
	day?: Day;
	eventsStatus?: ThemeFetchStatus;
	events?: EventClient[];
	className?: string;
	onClickDay?: (date: Dayjs) => void;
	onClickView?: (view: ThemeCalendarView) => void;
};
export type SectionCalendarWeekProps = {
	uid?: string;
	role?: Role;
	days?: Day[];
	day?: Day;
	eventsStatus?: ThemeFetchStatus;
	events?: EventClient[];
	className?: string;
	onClickDay?: (date: Dayjs) => void;
};
export type SectionCalendarDayProps = {
	uid?: string;
	role?: Role;
	days?: Day[];
	day?: Day;
	eventsStatus?: ThemeFetchStatus;
	events?: EventClient[];
	className?: string;
	onClickDay?: (date: Dayjs) => void;
};
export type SectionCalendarEventsProps = {
	type?: 'month' | 'week' | 'day' | 'day-summary';
	uid?: string;
	role?: Role;
	dayName?: string;
	day?: Day;
	events?: EventClient[];
	className?: string;
	onClickDay?: (date: Dayjs) => void;
	onClickView?: (view: ThemeCalendarView) => void;
};

// Default component
export default function SectionCalendar(props: SectionCalendarProps) {
	/*----- Props -----*/

	// Get props
	const { className } = props;

	/*----- Store -----*/

	// State - filterByRegion
	const [filterByRegion, setFilterByRegion] = useState<
		RegionClient | undefined
	>();

	// State - filterByTeam
	const [filterByTeam, setFilterByTeam] = useState<TeamClient | undefined>();

	// State - filterByPlatform
	const [filterByPlatform, setFilterByPlatform] = useState<
		PlatformClient | undefined
	>();

	// State - eventsFiltered
	const [eventsFiltered, setEventsFiltered] = useState<EventClient[]>([]);

	// Context - auth
	const auth = useAuth();
	const { currentUser, role } = auth;

	// Context - calendar
	const calendar = useCalendar();
	const {
		regions,
		teams,
		platforms,
		date,
		view = 'month',
		days,
		day,
		eventsStatus,
		events,
		setView = (view: ThemeCalendarView) => {},
		setDate = (date: Dayjs) => {},
		getMonth = (mid: string) => {},
	} = calendar;

	/*----- Methods -----*/

	// Functon - getCreateUrl
	function getCreateUrl() {
		// Create a unique id using date time and a random 10 digit number
		const uid = strGenerateUid();

		// Get 'create new' url
		const url = `/calendar/${uid}?edit=${role ?? 'user'}`;

		// Return
		return url;
	}

	// Function - handleClickPrev
	function handleClickPrev() {
		// Switch view
		if (view === 'month') {
			// Set date
			if (date) setDate(date.subtract(1, 'month').startOf('month'));
		} else if (view === 'week') {
			// Set date
			if (date) setDate(date.subtract(1, 'week').startOf('week'));
		} else if (view === 'day') {
			// Set date
			if (date) setDate(date.subtract(1, 'day'));
		}
	}

	// Function - handleClickToday
	function handleClickToday() {
		// Set date
		setDate(dayjs());
	}

	// Function - handleClickNext
	function handleClickNext() {
		// Switch view
		if (view === 'month') {
			// Set date
			if (date) setDate(date.add(1, 'month').startOf('month'));
		} else if (view === 'week') {
			// Set date
			if (date) setDate(date.add(1, 'week').startOf('week'));
		} else if (view === 'day') {
			// Set date
			if (date) setDate(date.add(1, 'day'));
		}
	}

	// Function - handleClickDay
	function handleClickDay(date: Dayjs) {
		// Set date
		setDate(date);
	}

	// Function - handleClickView
	function handleClickView(view: ThemeCalendarView) {
		// Set view
		setView(view);
	}

	// Function - handleClickFilterByRegion
	function handleClickFilterByRegion(region?: RegionClient) {
		// Toggle filterByRegion
		if (region && filterByRegion?.name !== region.name) {
			// Set filterByRegion
			setFilterByRegion(region);
		} else {
			// Set undefined
			setFilterByRegion(undefined);
		}
	}

	// Function - handleClickFilterByTeam
	function handleClickFilterByTeam(team?: TeamClient) {
		// Toggle filterByTeam
		if (team && filterByTeam?.name !== team.name) {
			// Set filterByTeam
			setFilterByTeam(team);
		} else {
			// Set undefined
			setFilterByTeam(undefined);
		}
	}

	// Function - handleClickFilterByPlatform
	function handleClickFilterByPlatform(platfom?: PlatformClient) {
		// Toggle filterByPlatform
		if (platfom && filterByPlatform?.name !== platfom.name) {
			// Set filterByPlatform
			setFilterByPlatform(platfom);
		} else {
			// Set undefined
			setFilterByPlatform(undefined);
		}
	}

	/*----- Lifecycle -----*/

	// Watch - date, getMonth
	useEffect(() => {
		// If no date, getMonth...
		if (!date || !getMonth) {
			// Return
			return;
		}

		// Get events
		getMonth(date.format('YYYY-MM'));
	}, [date, getMonth]);

	// Watch - filterByRegion, filterByTeam, filterByPlatform
	useEffect(() => {
		// Declare new events
		let newEvents: EventClient[] = [];

		// Loop events
		events?.forEach((event) => {
			// If filterByRegion...
			if (filterByRegion && event.region !== filterByRegion.id) {
				// Return
				return;
			}

			// If filterByTeam...
			if (filterByTeam && event.team !== filterByTeam.id) {
				// Return
				return;
			}

			// If filterByPlatform...
			if (filterByPlatform && event.platform !== filterByPlatform.id) {
				// Return
				return;
			}

			// Add event
			newEvents.push(event);
		});

		// Set eventsFiltered
		setEventsFiltered(newEvents);
	}, [filterByRegion, filterByTeam, filterByPlatform, events]);

	/*----- Init -----*/

	// Header props
	const presenterCalendarHeaderProps: SectionCalendarHeaderProps = {
		regions,
		teams,
		platforms,
		filterByRegion,
		filterByTeam,
		filterByPlatform,
		view,
		date,
		hrefCreate: getCreateUrl(),
		onClickFilterByRegion: handleClickFilterByRegion,
		onClickFilterByTeam: handleClickFilterByTeam,
		onClickFilterByPlatform: handleClickFilterByPlatform,
		onClickPrev: handleClickPrev,
		onClickToday: handleClickToday,
		onClickNext: handleClickNext,
		onClickView: handleClickView,
	};

	// Month props
	const presenterCalendarMonthProps: SectionCalendarMonthProps = {
		uid: currentUser?.uid,
		role,
		days,
		day,
		eventsStatus,
		events: eventsFiltered,
		onClickDay: handleClickDay,
		onClickView: handleClickView,
	};

	// Week props
	const presenterCalendarWeekProps: SectionCalendarWeekProps = {
		uid: currentUser?.uid,
		role,
		days,
		day,
		eventsStatus,
		events: eventsFiltered,
		onClickDay: handleClickDay,
	};

	// Day props
	const presenterCalendarDayProps: SectionCalendarDayProps = {
		uid: currentUser?.uid,
		role,
		days,
		day,
		eventsStatus,
		events: eventsFiltered,
		onClickDay: handleClickDay,
	};

	// Return default
	return (
		<div
			className={classNames(`text-left grow flex flex-col h-full`, className)}
			data-name={name}
		>
			<SectionCalendarHeader {...presenterCalendarHeaderProps} />
			{view === 'month' && (
				<SectionCalendarMonth {...presenterCalendarMonthProps} />
			)}
			{view === 'week' && (
				<SectionCalendarWeek {...presenterCalendarWeekProps} />
			)}
			{view === 'day' && <SectionCalendarDay {...presenterCalendarDayProps} />}
		</div>
	);
}

// SectionCalendarHeader component
export function SectionCalendarHeader(props: SectionCalendarHeaderProps) {
	/*----- Props -----*/

	// Get props
	const {
		regions = [],
		teams = [],
		platforms = [],
		filterByRegion,
		filterByTeam,
		filterByPlatform,
		view = 'month',
		date,
		hrefCreate = '#',
		className,
		onClickFilterByRegion = (region?: RegionClient) => {},
		onClickFilterByTeam = (team?: TeamClient) => {},
		onClickFilterByPlatform = (platform?: PlatformClient) => {},
		onClickPrev = () => {},
		onClickToday = () => {},
		onClickNext = () => {},
		onClickView = (view: ThemeCalendarView) => {},
	} = props;

	/*----- Init -----*/

	// Return default
	return (
		<header
			className={classNames(
				`calendar__header relative z-20 flex items-center justify-between border-b px-6 py-4 lg:flex-none lg:px-8 border-gray-200`,
				className
			)}
			data-name={`${name}Header`}
		>
			<h1 className="calendar__header-title text-base font-semibold leading-6 text-gray-900">
				{date && (
					<time dateTime={date.format('YYYY-MM')}>
						{view === 'month'
							? date.format('MMMM YYYY')
							: date.format('MMMM DD, YYYY')}
					</time>
				)}
			</h1>
			<div className="calendar__header-menu flex items-center">
				<div className="calendar__header-menu-days relative flex items-center rounded-md shadow-sm md:items-stretch bg-white">
					<button
						type="button"
						className="flex h-9 w-12 items-center justify-center rounded-l-md border-y border-l pr-1 focus:relative md:w-9 md:pr-0 border-gray-300 text-gray-400 lg:hover:text-gray-500 md:hover:bg-gray-50"
						onClick={onClickPrev}
					>
						<span className="sr-only">Previous month</span>
						<ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
					</button>
					<button
						type="button"
						className="hidden border-y px-3.5 text-sm font-semibold focus:relative md:block border-gray-300 text-gray-900 lg:hover:bg-gray-50"
						onClick={onClickToday}
					>
						Today
					</button>
					<span className="relative -mx-px h-5 w-px md:hidden bg-gray-300" />
					<button
						type="button"
						className="flex h-9 w-12 items-center justify-center rounded-r-md border-y border-r focus:relative md:w-9 md:pl-0 border-gray-300 pl-1 text-gray-400 lg:hover:text-gray-500 md:hover:bg-gray-50"
						onClick={onClickNext}
					>
						<span className="sr-only">Next month</span>
						<ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
					</button>
				</div>

				<div className="calendar__header-menu-view hidden md:ml-4 md:flex md:items-center">
					<Menu as="div" className="relative">
						<Menu.Button
							className="calendar__header-menu-view-button flex items-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset bg-white text-gray-900 ring-gray-300 lg:hover:bg-gray-50"
							type="button"
						>
							{strCapitalize(view)} view
							<ChevronDownIcon
								className="-mr-1 h-5 w-5 text-gray-400"
								aria-hidden="true"
							/>
						</Menu.Button>

						<Transition
							as={Fragment}
							enter="transition ease-out duration-100"
							enterFrom="transform opacity-0 scale-95"
							enterTo="transform opacity-100 scale-100"
							leave="transition ease-in duration-75"
							leaveFrom="transform opacity-100 scale-100"
							leaveTo="transform opacity-0 scale-95"
						>
							<Menu.Items className="absolute right-0 z-10 mt-3 w-36 origin-top-right overflow-hidden rounded-md shadow-lg ring-1 ring-opacity-5 focus:outline-none bg-white ring-black">
								<div className="py-1">
									<Menu.Item>
										{({ active }) => (
											<button
												className={classNames(
													'block w-full px-4 py-2 text-sm text-left',
													active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
												)}
												type="button"
												onClick={() => onClickView('month')}
											>
												Month view
											</button>
										)}
									</Menu.Item>
									<Menu.Item>
										{({ active }) => (
											<button
												className={classNames(
													'block w-full px-4 py-2 text-sm text-left',
													active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
												)}
												type="button"
												onClick={() => onClickView('week')}
											>
												Week view
											</button>
										)}
									</Menu.Item>
									<Menu.Item>
										{({ active }) => (
											<button
												className={classNames(
													'block w-full px-4 py-2 text-sm text-left',
													active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
												)}
												type="button"
												onClick={() => onClickView('day')}
											>
												Day view
											</button>
										)}
									</Menu.Item>
								</div>
							</Menu.Items>
						</Transition>
					</Menu>

					<Menu
						as="div"
						className="calendar__header-menu-dropdown relative ml-4"
					>
						<Menu.Button className="calendar__header-menu-dropdown-button flex items-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset bg-white text-gray-900 ring-gray-300 lg:hover:bg-gray-50">
							<span className="sr-only">Open filters</span>
							<AdjustmentsHorizontalIcon
								className="h-5 w-5"
								aria-hidden="true"
							/>
						</Menu.Button>

						<Transition
							as={Fragment}
							enter="transition ease-out duration-100"
							enterFrom="transform opacity-0 scale-95"
							enterTo="transform opacity-100 scale-100"
							leave="transition ease-in duration-75"
							leaveFrom="transform opacity-100 scale-100"
							leaveTo="transform opacity-0 scale-95"
						>
							<Menu.Items className="calendar__header-menu-dropdown-items absolute right-0 z-10 mt-3 w-36 origin-top-right divide-y overflow-hidden rounded-md shadow-lg ring-1 ring-opacity-5 focus:outline-none divide-gray-100 bg-white ring-black">
								{teams.length > 0 && (
									<div className="calendar__header-menu-dropdown-items py-1">
										{teams.map((team) => (
											<Menu.Item
												key={`section-calendar-header-filter-team-${team.id}`}
											>
												<button
													className={classNames(
														'block w-full px-4 py-2 text-sm text-left',
														filterByTeam?.name === team.name
															? 'bg-gray-100 text-gray-900'
															: 'text-gray-700'
													)}
													type="button"
													onClick={() => onClickFilterByTeam(team)}
												>
													{team.name}
												</button>
											</Menu.Item>
										))}
									</div>
								)}
								{regions.length > 0 && (
									<div className="calendar__header-menu-dropdown-items py-1 text-left">
										{regions.map((region) => (
											<Menu.Item
												key={`section-calendar-header-filter-region-${region.id}`}
											>
												<button
													className={classNames(
														'block w-full px-4 py-2 text-sm text-left',
														filterByRegion?.name === region.name
															? 'bg-gray-100 text-gray-900'
															: 'text-gray-700'
													)}
													type="button"
													onClick={() => onClickFilterByRegion(region)}
												>
													{region.name}
												</button>
											</Menu.Item>
										))}
									</div>
								)}
								{platforms.length > 0 && (
									<div className="calendar__header-menu-dropdown-items py-1">
										{platforms.map((platform) => (
											<Menu.Item
												key={`section-calendar-header-filter-platform-${platform.id}`}
											>
												<button
													className={classNames(
														'block w-full px-4 py-2 text-sm text-left',
														filterByPlatform?.name === platform.name
															? 'bg-gray-100 text-gray-900'
															: 'text-gray-700'
													)}
													type="button"
													onClick={() => onClickFilterByPlatform(platform)}
												>
													{platform.name}
												</button>
											</Menu.Item>
										))}
									</div>
								)}
							</Menu.Items>
						</Transition>
					</Menu>

					<div className="ml-6 h-6 w-px bg-gray-300" />

					<Link
						className="ml-6 rounded-md px-3 py-2 font-semibold text-sm shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 bg-blue-600 text-white lg:hover:bg-blue-500 focus-visible:outline-blue-600"
						href={hrefCreate}
					>
						Create {names.event}
					</Link>
				</div>

				<Menu
					as="div"
					className="calendar__header-menu-dropdown relative md:hidden"
				>
					<Menu.Button className="calendar__header-menu-dropdown-button -mx-2 flex items-center rounded-full border border-transparent ml-6 p-2 text-gray-400 lg:hover:text-gray-500">
						<span className="sr-only">Open menu</span>
						<EllipsisHorizontalIcon className="h-5 w-5" aria-hidden="true" />
					</Menu.Button>

					<Transition
						as={Fragment}
						enter="transition ease-out duration-100"
						enterFrom="transform opacity-0 scale-95"
						enterTo="transform opacity-100 scale-100"
						leave="transition ease-in duration-75"
						leaveFrom="transform opacity-100 scale-100"
						leaveTo="transform opacity-0 scale-95"
					>
						<Menu.Items className="calendar__header-menu-dropdown-items absolute right-0 z-10 mt-3 w-36 origin-top-right divide-y overflow-hidden rounded-md shadow-lg ring-1 ring-opacity-5 focus:outline-none divide-gray-100 bg-white ring-black">
							<div className="calendar__header-menu-dropdown-items text-left">
								<Menu.Item>
									{({ active }) => (
										<Link
											className={classNames(
												'block w-full px-4 py-3 text-sm text-left',
												active
													? 'bg-blue-500 text-white'
													: 'bg-blue-600 text-white hover:bg-blue-500'
											)}
											href={hrefCreate}
										>
											Create {names.event}
										</Link>
									)}
								</Menu.Item>
							</div>
							<div className="calendar__header-menu-dropdown-items py-1">
								<Menu.Item>
									{({ active }) => (
										<button
											className={classNames(
												'calendar__header-menu-dropdown-item block w-full px-4 py-2 text-sm text-left',
												active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
											)}
											type="button"
											onClick={onClickToday}
										>
											Go to today
										</button>
									)}
								</Menu.Item>
							</div>
							<div className="calendar__header-menu-dropdown-items py-1">
								<Menu.Item>
									{({ active }) => (
										<button
											className={classNames(
												'calendar__header-menu-dropdown-item w-full block px-4 py-2 text-sm text-left',
												active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
											)}
											type="button"
											onClick={() => onClickView('month')}
										>
											Month view
										</button>
									)}
								</Menu.Item>
								<Menu.Item>
									{({ active }) => (
										<button
											className={classNames(
												'calendar__header-menu-dropdown-item w-full block px-4 py-2 text-sm text-left',
												active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
											)}
											type="button"
											onClick={() => onClickView('week')}
										>
											Week view
										</button>
									)}
								</Menu.Item>
								<Menu.Item>
									{({ active }) => (
										<button
											className={classNames(
												'calendar__header-menu-dropdown-item w-full block px-4 py-2 text-sm text-left',
												active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
											)}
											onClick={() => onClickView('day')}
										>
											Day view
										</button>
									)}
								</Menu.Item>
							</div>
							{teams.length > 0 && (
								<div className="calendar__header-menu-dropdown-items py-1">
									{teams.map((team) => (
										<Menu.Item
											key={`section-calendar-header-filter-team-${team.id}`}
										>
											<button
												className={classNames(
													'block w-full px-4 py-2 text-sm text-left',
													filterByTeam?.name === team.name
														? 'bg-gray-100 text-gray-900'
														: 'text-gray-700'
												)}
												type="button"
												onClick={() => onClickFilterByTeam(team)}
											>
												{team.name}
											</button>
										</Menu.Item>
									))}
								</div>
							)}
							{regions.length > 0 && (
								<div className="calendar__header-menu-dropdown-items py-1 text-left">
									{regions.map((region) => (
										<Menu.Item
											key={`section-calendar-header-filter-region-${region.id}`}
										>
											<button
												className={classNames(
													'block w-full px-4 py-2 text-sm text-left',
													filterByRegion?.name === region.name
														? 'bg-gray-100 text-gray-900'
														: 'text-gray-700'
												)}
												type="button"
												onClick={() => onClickFilterByRegion(region)}
											>
												{region.name}
											</button>
										</Menu.Item>
									))}
								</div>
							)}
							{platforms.length > 0 && (
								<div className="calendar__header-menu-dropdown-items py-1">
									{platforms.map((platform) => (
										<Menu.Item
											key={`section-calendar-header-filter-platform-${platform.id}`}
										>
											<button
												className={classNames(
													'block w-full px-4 py-2 text-sm text-left',
													filterByPlatform?.name === platform.name
														? 'bg-gray-100 text-gray-900'
														: 'text-gray-700'
												)}
												type="button"
												onClick={() => onClickFilterByPlatform(platform)}
											>
												{platform.name}
											</button>
										</Menu.Item>
									))}
								</div>
							)}
						</Menu.Items>
					</Transition>
				</Menu>
			</div>
		</header>
	);
}

// SectionCalendarMonth component
export function SectionCalendarMonth(props: SectionCalendarMonthProps) {
	/*----- Props -----*/

	// Get props
	const {
		uid,
		role,
		days,
		day,
		eventsStatus = 'idle',
		events = [],
		className,
		onClickDay = (date: Dayjs) => {},
		onClickView = (view: ThemeCalendarView) => {},
	} = props;

	/*----- Init -----*/

	// Header props
	// ...

	// Return default
	return (
		<div
			className={classNames(
				`calendar__month realtive z-10 shadow ring-1 ring-opacity-5 lg:flex lg:flex-auto lg:flex-col ring-black`,
				className
			)}
			data-name={`${name}Month`}
		>
			<div className="calendar__month-heading grid grid-cols-7 gap-px border-b border-gray-300 bg-gray-200 text-center text-xs font-semibold leading-6 text-gray-700 lg:flex-none">
				<div className="calendar__month-heading-day bg-white py-2">
					M<span className="sr-only sm:not-sr-only">on</span>
				</div>
				<div className="calendar__month-heading-day bg-white py-2">
					T<span className="sr-only sm:not-sr-only">ue</span>
				</div>
				<div className="calendar__month-heading-day bg-white py-2">
					W<span className="sr-only sm:not-sr-only">ed</span>
				</div>
				<div className="calendar__month-heading-day bg-white py-2">
					T<span className="sr-only sm:not-sr-only">hu</span>
				</div>
				<div className="calendar__month-heading-day bg-white py-2">
					F<span className="sr-only sm:not-sr-only">ri</span>
				</div>
				<div className="calendar__month-heading-day bg-white py-2">
					S<span className="sr-only sm:not-sr-only">at</span>
				</div>
				<div className="calendar__month-heading-day bg-white py-2">
					S<span className="sr-only sm:not-sr-only">un</span>
				</div>
			</div>
			<div className="calendar__month-days flex flex-col text-xs leading-6 lg:flex-auto lg:grow bg-gray-200 text-gray-700">
				<div className="calendar__month-days-cells--mobile isolate grid w-full grid-cols-7 grid-rows-6 gap-px lg:hidden">
					{days?.map((day) => (
						<button
							className={classNames(
								`calendar__month-day flex h-14 flex-col px-3 py-2 hover:bg-gray-100 focus:z-10`,
								day.isCurrentMonth
									? day.isCurrentWeek
										? 'bg-blue-50 text-blue-600'
										: 'bg-white'
									: 'bg-gray-50 text-gray-500'
							)}
							key={`section-calendar-day-mobile-${day.date.format(
								'YYYY-MM-DD'
							)}`}
							type="button"
							onClick={() => {
								onClickDay(day.date);
							}}
						>
							<time
								className={classNames(
									'ml-auto',
									day.isToday && 'font-semibold',
									day.isSelected
										? 'flex h-6 w-6 items-center justify-center rounded-full font-semibold bg-blue-600 text-white'
										: day.isToday &&
												'flex h-6 w-6 items-center justify-center rounded-full font-semibold text-blue-600'
								)}
								dateTime={day.date.format('YYYY-MM-DD')}
							>
								{day.date.format('DD')}
							</time>
							<span className="sr-only">{events.length} events</span>
							{(eventsStatus === 'idle' || eventsStatus === 'fetching') &&
							day.isCurrentMonth ? (
								<div className="-mx-0.5 mt-auto flex flex-wrap-reverse text-xs animate-pulses">
									...
								</div>
							) : (
								<SectionCalendarEventsList
									className="-mx-0.5 mt-auto"
									type="month"
									uid={uid}
									role={role}
									day={day}
									events={events}
									onClickDay={onClickDay}
									onClickView={onClickView}
								/>
							)}
						</button>
					))}
				</div>

				<div className="calendar__month-days-cells--desktop hidden w-full lg:grid lg:grid-cols-7 lg:grid-rows-6 lg:gap-px">
					{days?.map((day) => (
						<div
							className={classNames(
								'calendar__month-day relative min-h-[120px] px-3 py-2',
								day.isCurrentMonth
									? day.isCurrentWeek
										? 'bg-blue-50 text-blue-600'
										: 'bg-white'
									: 'bg-gray-50 text-gray-500'
							)}
							key={`section-calendar-day-desktop-${day.date.format(
								'YYYY-MM-DD'
							)}`}
						>
							<button
								className="calendar__month-day-hitstate absolute z-20 top-0 left-0 w-full h-full"
								type="button"
								onClick={() => {
									onClickDay(day.date);
								}}
							/>

							<time
								className={classNames(
									`calendar__month-day-time relative z-20`,
									day.isToday && 'font-semibold',
									day.isSelected
										? 'flex h-6 w-6 items-center justify-center rounded-full font-semibold bg-blue-600 text-white'
										: day.isToday &&
												'flex h-6 w-6 items-center justify-center rounded-full font-semibold text-blue-600'
								)}
								dateTime={day.date.format('YYYY-MM-DD')}
							>
								{day.date.format('DD')}
							</time>

							{(eventsStatus === 'idle' || eventsStatus === 'fetching') &&
							day.isCurrentMonth ? (
								<div className="mt-2 text-xs animate-pulses">Fetching...</div>
							) : (
								<SectionCalendarEventsList
									className="mt-2"
									type="month"
									uid={uid}
									role={role}
									day={day}
									events={events}
									onClickDay={onClickDay}
									onClickView={onClickView}
								/>
							)}
						</div>
					))}
				</div>

				<div className="calendar__month-day border-t lg:hidden bg-gray-50 text-gray-700">
					<SectionCalendarEventsList
						className="w-full -mx-0.5 mt-auto"
						type="day-summary"
						uid={uid}
						role={role}
						day={day}
						events={events}
						onClickDay={onClickDay}
						onClickView={onClickView}
					/>
				</div>
			</div>
		</div>
	);
}

// SectionCalendarWeek component
export function SectionCalendarWeek(props: SectionCalendarWeekProps) {
	/*----- Props -----*/

	// Get props
	const {
		uid,
		role,
		days,
		day,
		eventsStatus = 'idle',
		events = [],
		className,
		onClickDay = (date: Dayjs) => {},
	} = props;

	/*----- Init -----*/

	// Get filteredDays
	const filteredDays = days?.filter((day) => {
		return day.isCurrentWeek;
	});

	// Return default
	return (
		<div
			className={classNames(
				`calendar__week relative flex h-full flex-col grow`,
				className
			)}
		>
			<div className="calendar__week-container isolate absolute top-0 left-0 w-full h-full flex flex-auto flex-col overflow-auto bg-white">
				<div
					className="calendar__week-track flex max-w-full flex-none flex-col sm:max-w-none md:max-w-full"
					style={{ width: '165%' }}
				>
					<div className="calendar__week-heading sticky top-0 z-30 flex-none bg-white shadow ring-1 ring-black ring-opacity-5 sm:pr-8">
						<div className="calendar__week-heading-inner--mobile grid grid-cols-7 text-sm leading-6 text-gray-500 sm:hidden">
							{filteredDays?.map((day, d) => (
								<button
									key={`section-calendar-week-heading-mobile-${d}`}
									className="calendar__week-heading-day first-letter:flex flex-col items-center pb-3 pt-2"
									type="button"
									onClick={() => {
										onClickDay(day.date);
									}}
								>
									<span className="calendar__week-heading-day-name">
										{names.dayNames[d].split('')[0].toUpperCase()}{' '}
									</span>
									<span
										className={classNames(
											`calendar__week-heading-day-date mt-1 flex h-8 w-8 items-center justify-center font-semibold`,
											day.isSelected
												? 'rounded-full bg-blue-600 text-white'
												: 'text-gray-900'
										)}
									>
										{day.date.format('DD')}
									</span>
								</button>
							))}
						</div>

						<div className="calendar__week-heading-inner--desktop -mr-px hidden grid-cols-7 divide-x border-r text-xs font-semibold leading-6 sm:grid divide-gray-100 border-gray-100 text-gray-700">
							<div className="calendar__week-heading-spacer col-end-1 w-14" />
							{filteredDays?.map((day, d) => (
								<button
									key={`section-calendar-week-heading-desktop-${d}`}
									className="calendar__week-heading-day flex items-center justify-center py-3"
									type="button"
									onClick={() => {
										onClickDay(day.date);
									}}
								>
									<span className="calendar__week-heading-day-inner inline-flex justify-center items-center">
										<span className="calendar__week-heading-day-name">
											{names.dayNames[d].split('')[0].toUpperCase() +
												names.dayNames[d].split('')[1] +
												names.dayNames[d].split('')[2]}{' '}
										</span>
										<span
											className={classNames(
												`items-center justify-center ml-1.5 font-semibold`,
												day.isSelected
													? 'flex h-8 w-8 items-center justify-center rounded-full font-semibold bg-blue-600 text-white'
													: 'text-gray-900'
											)}
										>
											{day.date.format('DD')}
										</span>
									</span>
								</button>
							))}
						</div>
					</div>

					<div className="calendar__week-days flex flex-auto">
						<div className="calendar__week-days-margin sticky left-0 z-10 w-14 flex-none bg-white ring-1 ring-gray-100" />
						<div className="calendar__week-days-grid grid flex-auto grid-cols-1 grid-rows-1">
							{/* Horizontal lines */}
							<div
								className="calendar__week-days-lines--hotizontal col-start-1 col-end-2 row-start-1 grid divide-y divide-gray-100"
								style={{ gridTemplateRows: 'repeat(48, minmax(3.5rem, 1fr))' }}
							>
								<div className="row-end-1 h-7"></div>
								<div>
									<div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
										12AM
									</div>
								</div>
								<div />
								<div>
									<div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
										1AM
									</div>
								</div>
								<div />
								<div>
									<div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
										2AM
									</div>
								</div>
								<div />
								<div>
									<div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
										3AM
									</div>
								</div>
								<div />
								<div>
									<div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
										4AM
									</div>
								</div>
								<div />
								<div>
									<div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
										5AM
									</div>
								</div>
								<div />
								<div>
									<div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
										6AM
									</div>
								</div>
								<div />
								<div>
									<div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
										7AM
									</div>
								</div>
								<div />
								<div>
									<div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
										8AM
									</div>
								</div>
								<div />
								<div>
									<div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
										9AM
									</div>
								</div>
								<div />
								<div>
									<div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
										10AM
									</div>
								</div>
								<div />
								<div>
									<div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
										11AM
									</div>
								</div>
								<div />
								<div>
									<div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
										12PM
									</div>
								</div>
								<div />
								<div>
									<div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
										1PM
									</div>
								</div>
								<div />
								<div>
									<div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
										2PM
									</div>
								</div>
								<div />
								<div>
									<div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
										3PM
									</div>
								</div>
								<div />
								<div>
									<div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
										4PM
									</div>
								</div>
								<div />
								<div>
									<div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
										5PM
									</div>
								</div>
								<div />
								<div>
									<div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
										6PM
									</div>
								</div>
								<div />
								<div>
									<div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
										7PM
									</div>
								</div>
								<div />
								<div>
									<div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
										8PM
									</div>
								</div>
								<div />
								<div>
									<div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
										9PM
									</div>
								</div>
								<div />
								<div>
									<div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
										10PM
									</div>
								</div>
								<div />
								<div>
									<div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
										11PM
									</div>
								</div>
								<div />
							</div>

							{/* Vertical lines */}
							<div className="calendar__week-days-lines--vertical col-start-1 col-end-2 row-start-1 hidden grid-cols-7 grid-rows-1 divide-x sm:grid sm:grid-cols-7 divide-gray-100">
								<div className="row-span-full" />
								<div className="row-span-full" />
								<div className="row-span-full" />
								<div className="row-span-full" />
								<div className="row-span-full" />
								<div className="row-span-full" />
								<div className="row-span-full" />
								<div className="col-start-8 row-span-full w-8" />
							</div>

							{/* Events */}
							<ol
								className="col-start-1 col-end-2 row-start-1 grid grid-cols-1 sm:grid-cols-7 sm:pr-8"
								style={{
									gridTemplateRows: '1.75rem repeat(288, minmax(0, 1fr)) auto',
								}}
							>
								{filteredDays?.map((filteredDay, d) => (
									<SectionCalendarEventsList
										key={`section-calendar-week-events-${d}`}
										type="week"
										uid={uid}
										role={role}
										dayName={names.dayNames[d]}
										day={filteredDay}
										events={events}
										onClickDay={onClickDay}
									/>
								))}
							</ol>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

// SectionCalendarDay component
export function SectionCalendarDay(props: SectionCalendarDayProps) {
	/*----- Props -----*/

	// Get props
	const {
		uid,
		role,
		days,
		day,
		eventsStatus = 'idle',
		events = [],
		className,
		onClickDay = (date: Dayjs) => {},
	} = props;

	/*----- Init -----*/

	// Get filteredDays
	const filteredDays = days?.filter((day) => {
		return day.isCurrentWeek;
	});

	// Return default
	return (
		<div className="calendar__day isolate flex flex-auto overflow-hidden bg-white">
			<div className="calendar__day-track flex flex-auto flex-col overflow-auto">
				<div className="calendar__day-heading sticky top-0 z-30 flex-none bg-white shadow ring-1 ring-black ring-opacity-5">
					<div className="calendar__week-heading-inner grid grid-cols-7 text-sm leading-6 md:hidden text-gray-500">
						{filteredDays?.map((day, d) => (
							<button
								key={`section-calendar-week-heading-mobile-${d}`}
								className="calendar__week-heading-day first-letter:flex flex-col items-center pb-3 pt-2"
								type="button"
								onClick={() => {
									onClickDay(day.date);
								}}
							>
								<span className="calendar__week-heading-day-name">
									{names.dayNames[d].split('')[0].toUpperCase()}{' '}
								</span>
								<span
									className={classNames(
										`calendar__week-heading-day-date mt-1 flex h-8 w-8 items-center justify-center font-semibold`,
										day.isSelected
											? 'rounded-full bg-blue-600 text-white'
											: 'text-gray-900'
									)}
								>
									{day.date.format('DD')}
								</span>
							</button>
						))}
					</div>
				</div>

				<div className="calendar__day- flex w-full flex-auto">
					<div className="w-14 flex-none bg-white ring-1 ring-gray-100" />
					<div className="grid flex-auto grid-cols-1 grid-rows-1">
						{/* Horizontal lines */}
						<div
							className="col-start-1 col-end-2 row-start-1 grid divide-y divide-gray-100"
							style={{ gridTemplateRows: 'repeat(48, minmax(3.5rem, 1fr))' }}
						>
							<div className="row-end-1 h-7"></div>
							<div>
								<div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
									12AM
								</div>
							</div>
							<div />
							<div>
								<div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
									1AM
								</div>
							</div>
							<div />
							<div>
								<div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
									2AM
								</div>
							</div>
							<div />
							<div>
								<div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
									3AM
								</div>
							</div>
							<div />
							<div>
								<div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
									4AM
								</div>
							</div>
							<div />
							<div>
								<div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
									5AM
								</div>
							</div>
							<div />
							<div>
								<div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
									6AM
								</div>
							</div>
							<div />
							<div>
								<div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
									7AM
								</div>
							</div>
							<div />
							<div>
								<div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
									8AM
								</div>
							</div>
							<div />
							<div>
								<div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
									9AM
								</div>
							</div>
							<div />
							<div>
								<div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
									10AM
								</div>
							</div>
							<div />
							<div>
								<div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
									11AM
								</div>
							</div>
							<div />
							<div>
								<div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
									12PM
								</div>
							</div>
							<div />
							<div>
								<div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
									1PM
								</div>
							</div>
							<div />
							<div>
								<div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
									2PM
								</div>
							</div>
							<div />
							<div>
								<div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
									3PM
								</div>
							</div>
							<div />
							<div>
								<div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
									4PM
								</div>
							</div>
							<div />
							<div>
								<div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
									5PM
								</div>
							</div>
							<div />
							<div>
								<div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
									6PM
								</div>
							</div>
							<div />
							<div>
								<div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
									7PM
								</div>
							</div>
							<div />
							<div>
								<div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
									8PM
								</div>
							</div>
							<div />
							<div>
								<div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
									9PM
								</div>
							</div>
							<div />
							<div>
								<div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
									10PM
								</div>
							</div>
							<div />
							<div>
								<div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
									11PM
								</div>
							</div>
							<div />
						</div>

						{/* Events */}
						<ol
							className="col-start-1 col-end-2 row-start-1 grid grid-cols-1"
							style={{
								gridTemplateRows: '1.75rem repeat(288, minmax(0, 1fr)) auto',
							}}
						>
							<SectionCalendarEventsList
								className="-mx-0.5 mt-auto"
								type="day"
								uid={uid}
								role={role}
								day={day}
								events={events}
								onClickDay={onClickDay}
							/>
						</ol>
					</div>
				</div>
			</div>

			<div className="hidden w-1/2 max-w-md flex-none border-l px-8 py-10 md:block border-gray-100">
				<div className="flex items-center text-center text-gray-900">
					<InputDate />
				</div>
			</div>
		</div>
	);
}

// SectionCalendarEventsList component
export function SectionCalendarEventsList(props: SectionCalendarEventsProps) {
	/*----- Props -----*/

	// Get props
	const {
		type = 'month',
		uid,
		role,
		dayName,
		day,
		events,
		className,
		onClickDay = (date: Dayjs) => {},
		onClickView = (view: ThemeCalendarView) => {},
	} = props;

	/*----- Methods -----*/

	// Function - handleClickViewMore
	function handleClickViewMore() {
		// If no day, return
		if (!day) return;

		// Set date
		onClickDay(day.date);

		// Set view
		onClickView('day');
	}

	// Function - getGridRow
	const getGridRow = (datetime?: Dayjs | string) => {
		const timeAr = dayjs(datetime ?? dayjs())
			.format('HH:mm')
			.split(':');
		const hours = parseInt(timeAr[0]);
		const minutes = Math.round(parseInt(timeAr[1]) / 5) * 5;
		const padTop = 2;
		const hourRows = hours * 12;
		const minuteRows = (12 / 60) * minutes;
		const returnValue = padTop + hourRows + minuteRows;
		return returnValue;
	};

	// Function - getGridRowSpan
	const getGridRowSpan = (duration?: number) => {
		const minutes = Math.round((duration ?? 0) / 5) * 5;
		const returnValue = (12 / 60) * minutes;
		return returnValue;
	};

	/*----- Init -----*/

	// If no day / events, return null
	if (!day || !events || events.length === 0) return null;

	// Get filteredEvents
	const filteredEvents = events.filter((event) => {
		// Return events which match the day
		return day.date.format('YYYY-MM-DD') === event.did;
	});

	// Switch - style
	switch (type) {
		case 'day-summary':
			// Return day summary
			return (
				<div className="p-6 lg:px-8">
					{filteredEvents.length > 0 ? (
						<ul className="overflow-hidden rounded-lg text-sm shadow ring-1 ring-opacity-5 divide-y divide-gray-100 bg-white ring-black">
							{filteredEvents.map((event) => (
								<li
									className="relative flex p-4 pr-6 group"
									key={`section-calendar-events-list-day-summary-item-${event.id}`}
								>
									<div className="relative z-10 flex-auto">
										<p className="font-semibold text-gray-900 group-hover:text-blue-600">
											{event.name}
										</p>
										<time
											dateTime={event.datetime}
											className="mt-2 flex items-center text-gray-700"
										>
											<ClockIcon
												className="mr-2 h-5 w-5 text-gray-400"
												aria-hidden="true"
											/>
											{event.time}
										</time>
									</div>
									<Link
										className="absolute z-20 top-0 left-0 w-full h-full"
										href={`/calendar/${event.id}`}
									/>
									{((role === 'user' && event.uid === uid) ||
										role === 'moderator' ||
										role === 'admin') && (
										<>
											<Link
												className="relative z-30 inline-flex justify-end items-center lg:hidden"
												href={`/calendar/${event.id}?edit=${role}`}
											>
												<button
													className={classNames(
														`form__edit-button relative w-10 h-10 rounded-full transitio-color duration-300 ease-out text-white`,
														event.uid === uid
															? 'bg-user lg:hover:bg-user-dark'
															: role === 'moderator'
															? 'bg-moderator lg:hover:bg-moderator-dark'
															: 'bg-admin lg:hover:bg-admin-dark'
													)}
												>
													<span className="form__edit-button-text sr-only">
														{role === 'admin' || role === 'moderator'
															? `Edit as ${role}`
															: `Edit ${names.event}`}
													</span>
													<PencilIcon className="form__edit-button-icon absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5 h-auto" />
												</button>
											</Link>
											<Link
												className="relative z-30 hidden justify-end items-center lg:inline-flex"
												href={`/calendar/${event.id}?edit=${role}`}
											>
												<button
													className={classNames(
														`form__edit-button inline-flex justify-center items-center rounded-md h-10 px-3 py-2 space-x-2 font-semibold text-sm shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 text-white`,
														event.uid === uid
															? 'bg-user lg:hover:bg-user-dark focus-visible:outline-user-dark'
															: role === 'moderator'
															? 'bg-moderator lg:hover:bg-moderator-dark focus-visible:outline-moderator-dark'
															: 'bg-admin lg:hover:bg-admin-dark focus-visible:outline-admin-dark'
													)}
												>
													<span className="form__edit-button-text inline-block">
														{role === 'admin' || role === 'moderator'
															? `Edit as ${role}`
															: `Edit ${names.event}`}
													</span>
													<PencilIcon className="form__edit-button-icon w-5 h-auto" />
												</button>
											</Link>
										</>
									)}
								</li>
							))}
						</ul>
					) : (
						<div className="overflow-hidden rounded-lg text-sm shadow ring-1 ring-opacity-5 bg-white ring-black">
							<div className="p-4 text-left">
								<p className="text-gray-500">No {names.events} today</p>
							</div>
						</div>
					)}
				</div>
			);

		case 'day':
			// Return day
			return (
				<>
					{filteredEvents.map((event) => (
						<li
							className="relative mt-px"
							style={{
								gridRow: `${getGridRow(event.datetime)} / span ${getGridRowSpan(
									event?.duration ?? 20
								)}`,
							}}
							key={`section-calendar-events-list-week-item-${event.id}`}
						>
							<Link
								className="group absolute inset-1 flex flex-col overflow-y-auto rounded-lg px-2 py-1 text-xs leading-5 bg-blue-50 hover:bg-blue-100"
								href={`/calendar/${event.id}`}
							>
								<span className="flex justify-between items-center">
									<p className="font-semibold text-blue-700">{event.name}</p>
									<p className="text-blue-500 group-hover:text-blue-700">
										<time dateTime={event.datetime}>{event.time}</time>
									</p>
								</span>
							</Link>
						</li>
					))}
				</>
			);

		case 'week':
			// Return week
			return (
				<>
					{filteredEvents.map((event) => (
						<li
							className={classNames(
								`relative mt-px sm:col-start-3`,
								dayName === 'monday' && 'sm:col-start-1',
								dayName === 'tuesday' && 'sm:col-start-2',
								dayName === 'wednesday' && 'sm:col-start-3',
								dayName === 'thursday' && 'sm:col-start-4',
								dayName === 'friday' && 'sm:col-start-5',
								dayName === 'saturday' && 'sm:col-start-6',
								dayName === 'sunday' && 'sm:col-start-7',
								day.isSelected ? 'flex' : 'hidden sm:flex'
							)}
							style={{
								gridRow: `${getGridRow(event.datetime)} / span ${getGridRowSpan(
									event.duration
								)}`,
							}}
							key={`section-calendar-events-list-week-item-${event.id}`}
						>
							<Link
								className="group absolute inset-1 flex flex-col overflow-y-auto rounded-lg px-2 py-1 text-xs leading-5 bg-blue-50 hover:bg-blue-100"
								href={`/calendar/${event.id}`}
							>
								<span className="flex justify-between items-center">
									<p className="font-semibold text-blue-700">{event.name}</p>
									<p className="text-blue-500 group-hover:text-blue-700">
										<time dateTime={event.datetime}>{event.time}</time>
									</p>
								</span>
							</Link>
						</li>
					))}
				</>
			);

		case 'month':
		default:
			// Return month
			return (
				<>
					{filteredEvents.length > 1 && (
						<span className="calendar__month-day-list -mx-0.5 mt-auto flex flex-wrap-reverse lg:hidden">
							{filteredEvents.map((event) => (
								<span
									className="calendar__month-day-item mx-0.5 mb-1 h-1.5 w-1.5 rounded-full bg-blue-600"
									key={`section-calendar-event-mobile-${event.id}`}
								/>
							))}
						</span>
					)}
					<ol
						className={classNames(
							`calendar__month-day-list relative z-30 hidden flex-col items-stretch md:w-full lg:inline-flex xl:flex`,
							className
						)}
						data-name={`${name}EventsList`}
					>
						{filteredEvents.slice(0, 2).map((event) => (
							<>
								{day.date.format('YYYY-MM-DD') === event.did && (
									<li
										className="calendar__month-day-item"
										key={`section-calendar-event-desktop-${event.id}`}
									>
										<Link
											className="calendar__month-day-item-link flex group"
											href={`/calendar/${event.id}`}
										>
											<p className="calendar__month-day-item-name flex-auto truncate font-medium text-gray-900 group-hover:text-blue-600">
												{event.name}
											</p>
											<time
												className="calendar__month-day-item-time ml-3 hidden flex-none xl:block text-gray-500 group-hover:text-blue-600"
												dateTime={event.datetime}
											>
												{event.time}
											</time>
										</Link>
									</li>
								)}
							</>
						))}
						{filteredEvents.length > 2 && (
							<button
								className="cursor-pointer text-left text-gray-500 hover:text-blue-600"
								type="button"
								onClick={handleClickViewMore}
							>
								+ {events.length - 2} more
							</button>
						)}
					</ol>
				</>
			);
	}
}
