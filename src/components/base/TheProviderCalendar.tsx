// Component: TheProviderCalendar
/*----------------------------------------------------------------------------------------------------*/

'use client';

/*---------- Imports ----------*/

// Config
import {
	ThemeFetchStatus,
	ThemeCalendarView,
	Day,
	RegionClient,
	BrandClient,
	TeamClient,
	PlatformClient,
	EventClient,
	ActivityClient,
} from '@/types';

// Scripts (node)
import { createContext, useRef, useState, useContext, useEffect } from 'react';
import { query, collection, onSnapshot } from 'firebase/firestore';
import dayjs, { Dayjs } from 'dayjs';

// Scripts (local)
import { client } from '@/firebase/lib/client';
import { getDays } from '@/lib/calendar';

// Components (node)
// ...

// Components (local)
import { useAuth } from '@/components/base/TheProviderAuth';

/*---------- Static Data ----------*/

// Name
const name = 'TheProviderCalendar';

/*---------- Context ----------*/

// Types
export type TheContextCalendarProps = {
	generalType?: 'static' | 'snapshot';
	regions?: RegionClient[];
	brands?: BrandClient[];
	teams?: TeamClient[];
	platforms?: PlatformClient[];
	eventsStatus?: ThemeFetchStatus;
	eventsType?: 'static' | 'snapshot';
	events?: EventClient[];
	eventStatus?: ThemeFetchStatus;
	eventType?: 'static' | 'snapshot';
	event?: EventClient;
	activitiesStatus?: ThemeFetchStatus;
	activitiesType?: 'static' | 'snapshot';
	activities?: ActivityClient[];
	date?: Dayjs;
	view?: ThemeCalendarView;
	days?: Day[];
	day?: Day;
	setDate?: (date: Dayjs) => void;
	setView?: (view: ThemeCalendarView) => void;
	setActivities?: (activity: ActivityClient[]) => void;
	getMonth?: (mid: string) => void;
	getEvent?: (id: string) => void;
};

// Context
const TheContextCalendar = createContext<TheContextCalendarProps>({
	generalType: 'static',
	regions: [],
	brands: [],
	teams: [],
	platforms: [],
	eventsStatus: 'idle',
	eventsType: 'static',
	events: [],
	eventStatus: 'idle',
	eventType: 'static',
	event: undefined,
	activitiesStatus: 'idle',
	activitiesType: 'static',
	activities: undefined,
	date: dayjs(),
	view: 'month',
	days: getDays(dayjs()),
	day: undefined,
	setDate: (date: Dayjs) => {},
	setView: (view: ThemeCalendarView) => {},
	setActivities: (activity: ActivityClient[]) => {},
	getMonth: (mid: string) => {},
	getEvent: (id: string) => {},
});

// Hooks
export function useCalendar() {
	return useContext(TheContextCalendar);
}

/*---------- Template ----------*/

// Types
export type TheProviderCalendarProps = {
	regionsJson?: RegionClient[];
	brandsJson?: BrandClient[];
	teamsJson?: TeamClient[];
	platformsJson?: PlatformClient[];
	eventsJson?: EventClient[];
	eventJson?: EventClient;
	activitiesJson?: ActivityClient[];
	children?: React.ReactNode;
};

// Component
export default function TheProviderCalendar(props: TheProviderCalendarProps) {
	/*----- Props -----*/

	// Get props
	const {
		regionsJson,
		brandsJson,
		teamsJson,
		platformsJson,
		eventsJson,
		eventJson,
		activitiesJson,
		children,
	} = props;

	/*----- Refs -----*/

	// Ref - monthSnapshot
	// Array of months events, where YYYY-MM' matches each documents 'mid'
	// Returns only events with qualifying 'access' field
	const monthMidPrev = useRef<string | null>();
	const monthDebounceTimer = useRef(-1);
	const monthSnapshot = useRef<any>();

	// Ref - eventSnapshot
	// Single event, where 'id' matches the documents unique id
	// Returns only events with qualifying 'access' field
	const eventIdPrev = useRef<string | null>();
	const eventDebounceTimer = useRef(-1);
	const eventSnapshot = useRef<any>();

	// Ref - activitiesSnapshot
	// Array of activities, where 'id' matches the matching event documents unique id
	// Returns only activities with qualifying 'access' field
	const activitiesSnapshot = useRef<any>();

	/*----- Store: General -----*/

	// State - generalStatus
	const [generalStatus, setGeneralStatus] = useState<ThemeFetchStatus>('idle');

	// State - generalType
	const [generalType, setGeneralType] = useState<'static' | 'snapshot'>(
		'static'
	);

	/*----- Store: Calendar -----*/

	// State - date
	const [date, setDate] = useState<Dayjs>(dayjs());

	// State - view
	const [view, setView] = useState<ThemeCalendarView>('month');

	// State - days
	const [days, setDays] = useState<Day[]>(getDays(date));

	// State - day
	const [day, setDay] = useState<Day | undefined>(undefined);

	// State - monthMid
	// const monthMid = useRef<string | null>();
	const [monthMid, setMonthMid] = useState<string | null>();

	// State - eventId
	const [eventId, setEventId] = useState<string | null>(null);

	/*----- Store: Options -----*/

	// State - regions
	const [regions, setRegions] = useState<RegionClient[] | undefined>(
		regionsJson
	);

	// State - brands
	const [brands, setBrands] = useState<BrandClient[] | undefined>(brandsJson);

	// State - teams
	const [teams, setTeams] = useState<TeamClient[] | undefined>(teamsJson);

	// State - platforms
	const [platforms, setPlatforms] = useState<PlatformClient[] | undefined>(
		platformsJson
	);

	/*----- Store: Events -----*/

	// State - events
	const [eventsStatus, setEventsStatus] = useState<ThemeFetchStatus>('idle');
	const [eventsType, setEventsType] = useState<'static' | 'snapshot'>('static');
	const [events, setEvents] = useState<EventClient[] | undefined>(eventsJson);

	// State - event
	const [eventStatus, setEventIdStatus] = useState<ThemeFetchStatus>('idle');
	const [eventType, setEventType] = useState<'static' | 'snapshot'>('static');
	const [event, setEvent] = useState<EventClient | undefined>(eventJson);

	// State - activity
	const [activitiesStatus, setActivitiesStatus] =
		useState<ThemeFetchStatus>('idle');
	const [activitiesType, setActivitiesType] = useState<'static' | 'snapshot'>(
		'static'
	);
	const [activities, setActivities] = useState<ActivityClient[] | undefined>(
		activitiesJson
	);

	/*----- Store: Calendar -----*/

	// Context - auth
	const auth = useAuth();
	const { token } = auth;

	/*----- Methods -----*/

	// Method - getMonth
	// Initially fetches static data of months events, where 'mid' is 'YYYY-MM'
	// If found, establishes a snapshot
	// If snapshot fetch fails, does not declare events type as 'snapshot'
	function getMonth(mid: string) {
		// If no change, return
		if (mid === monthMid) return;

		// Set monthMid
		setMonthMid(mid);
	}

	// Method - getEvent
	// Initially fetches static data of months event, where 'id' is the documents unique id
	// If found, establishes a snapshot
	// If snapshot fetch fails, does not declare event type as 'snapshot'
	function getEvent(id: string) {
		// If no change, return
		if (id === eventId) return;

		// Set eventId
		setEventId(id);
	}

	/*----- Lifecycle -----*/

	// Watch - eventsType, eventsStatus
	useEffect(() => {
		// Set generalStatus
		setGeneralStatus(
			eventsStatus === 'error' || eventStatus === 'error'
				? 'error'
				: eventsStatus === 'fetching' || eventStatus === 'fetching'
				? 'fetching'
				: eventsStatus === 'idle' || eventStatus === 'idle'
				? 'idle'
				: 'success'
		);
	}, [eventsStatus, eventStatus]);

	// Watch - eventsType, eventType
	useEffect(() => {
		// Set generalType
		setGeneralType(
			eventsType === 'static' || eventType === 'static' ? 'static' : 'snapshot'
		);
	}, [eventsType, eventType]);

	// Watch - currentUser, monthMid
	useEffect(() => {
		// If no token / no change...
		if (!token || monthMidPrev.current === monthMid) {
			// Return
			return;
		}

		// Is idle
		setEventsStatus('idle');

		// Set monthMidPrev
		monthMidPrev.current = monthMid;

		// Declare monthDebounceTimer interval
		let interval: NodeJS.Timeout | undefined;

		// Function - fetchUsers
		const fetchUsers = async () => {
			// Is fetching
			setEventsStatus('fetching');

			// Fetch events (passing authToken)
			const response = await fetch(`/api/events?mid=${monthMid}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			// If success...
			if (response.ok) {
				const eventsJson = await response.json();
				if (eventsJson && eventsJson.length > 0) {
					// Set users
					setEvents(eventsJson);
				}

				// Is success
				setEventsStatus('success');
			} else {
				// Is error
				setEventsStatus('error');
			}
		};

		// Function - debounceTick
		const debounceTick = () => {
			// If monthDebounceTimer is ticking
			if (monthDebounceTimer.current >= 0) {
				monthDebounceTimer.current--;
			}

			if (monthDebounceTimer.current === 0) {
				// If monthMid...
				if (monthMid) {
					// Fetch users
					fetchUsers();
				}
			}
		};

		// If monthMid ...
		if (monthMid) {
			// Clear monthDebounceTimer interval
			if (monthDebounceTimer) {
				clearInterval(monthDebounceTimer.current);
			}

			// Set monthDebounceTimer interval
			interval = setInterval(() => {
				debounceTick();
			}, 1);

			// Reset monthDebounceTimer
			monthDebounceTimer.current = 100;
		} else {
			// Reset monthDebounceTimer
			monthDebounceTimer.current = -1;
		}

		// Return cleanup
		return () => {
			// Clear interval
			if (interval) {
				clearInterval(interval);
			}
		};
	}, [token, monthMid]);

	// Watch - currentUser, eventId
	useEffect(() => {
		// If no token, client / no change...
		if (!token || !client || eventIdPrev.current === eventId) {
			return;
		}

		// Set eventIdPrev
		eventIdPrev.current = eventId;

		// If eventSnapshot...
		if (eventSnapshot.current) {
			// Kill eventSnapshot
			eventSnapshot.current();
		}

		// If activitiesSnapshot...
		if (activitiesSnapshot.current) {
			// Kill activitiesSnapshot
			activitiesSnapshot.current();
		}

		// Get 'events' docs as snapshot
		// eventSnapshot.current = onSnapshot(
		// 	query(
		// 		collection(client.db, 'events')
		// 		where('id', '==', eventId)
		// 	),
		// 	(snapshot) => {
		// 		// If no docs...
		// 		if (snapshot.empty) {
		// 			// Return
		// 			return;
		// 		}

		// 		// Get docs
		// 		const docs = snapshot.docs;

		// 		// Get data
		// 		const data = docs.map((doc) => doc.data());
		// 	}
		// );

		// Get 'activities' docs as snapshot
		// activitiesSnapshot.current = onSnapshot(
		// 	query(
		// 		collection(client.db, 'activities')
		// 		where('id', '==', eventId)
		// 	),
		// 	(snapshot) => {
		// 		// If no docs...
		// 		if (snapshot.empty) {
		// 			// Return
		// 			return;
		// 		}

		// 		// Get docs
		// 		const docs = snapshot.docs;

		// 		// Get data
		// 		const data = docs.map((doc) => doc.data());
		// 	}
		// );
	}, [token, eventId]);

	// Watch - date
	useEffect(() => {
		// Set days
		setDays(getDays(date));
	}, [date]);

	// Watch - days
	useEffect(() => {
		// Set day
		setDay(days.find((day) => day.isSelected) ?? undefined);
	}, [days]);

	/*----- Init -----*/

	// Return default
	return (
		<TheContextCalendar.Provider
			value={{
				// General
				generalType,
				// Calendar
				date,
				view,
				days,
				day,
				// Options
				regions,
				brands,
				teams,
				platforms,
				// Events
				eventsStatus,
				eventsType,
				events,
				eventStatus,
				eventType,
				event,
				// Activities
				activitiesStatus,
				activitiesType,
				activities,
				// Methods
				setDate,
				setView,
				setActivities,
				getMonth,
				getEvent,
			}}
		>
			{children}
		</TheContextCalendar.Provider>
	);
}
