// Typings: Global
/*----------------------------------------------------------------------------------------------------*/

/*---------- Imports ----------*/

// Scripts (local)
import { type Timestamp } from 'firebase-admin/firestore';
import { Dayjs } from 'dayjs';

/*---------- Client UI ----------*/

// Themes
export type ThemeFetchStatus = 'idle' | 'fetching' | 'success' | 'error';
export type ThemeCalendarView = 'month' | 'week' | 'day';

// Auth
export type Role = 'guest' | 'user' | 'moderator' | 'admin';

// Navigation
export type NavItem = {
	name: string;
	href: string;
	target?: '_self' | '_blank';
};

// Validation
export type Validation =
	| {
			error: string;
			message: string;
	  }
	| false;

// Day
export type Day = {
	date: Dayjs;
	isCurrentMonth?: boolean;
	isCurrentWeek?: boolean;
	isToday?: boolean;
	isSelected?: boolean;
	events: {
		id: string;
		name: string;
		time: string;
		datetime: string;
		href: string;
	}[];
};

/*---------- Firebase Misc ----------*/

export type Duration = {
	label: string;
	value: number;
};
export type Time = {
	id: string;
	timeStart: string;
	timeEnd: string;
};

/*---------- Firebase Users ----------*/

export type User = {
	// System data
	uid?: string;
	role?: 'admin' | 'moderator' | 'user' | 'guest';
	lastSeen?: string | false;
	lastSeenDateTime?: string | false;
	// Editable data
	name?: string;
	nameToLowerCase?: string;
	email?: string;
	team?: string;
	region?: string;
	about?: string;
	optinComments?: boolean;
	imageUrl?: string | false;
};
export type UserClient = {
	// System data
	uid?: string;
	role?: 'admin' | 'moderator' | 'user' | 'guest';
	lastSeen?: string | false;
	lastSeenDateTime?: string | false;
	// Editable data
	firstName?: string;
	lastName?: string;
	email?: string;
	team?: string;
	region?: string;
	about?: string;
	optinComments?: boolean;
};

/*---------- Firebase Brands ----------*/

// Types
export type Brand = {
	// System data
	id: string;
	name: string;
	// Editable data
	imageUrl?: string;
	teams?: string[];
	access: Role;
};
export type BrandClient = {
	// System data
	id: string;
	name: string;
	// Editable data
	imageUrl?: string;
	teams?: string[];
	access: Role;
};

/*---------- Firebase Teams ----------*/

export type Team = {
	// System data
	id: string;
	access: 'admin' | 'moderator' | 'user' | 'public';
	// Editable data
	name: string;
	imageUrl?: string;
	brands?: string[];
	platforms?: string[];
	duration?: Duration[];
	times?: Time[];
};
export type TeamClient = {
	// System data
	id: string;
	access: 'admin' | 'moderator' | 'user' | 'public';
	// Editable data
	name: string;
	imageUrl?: string;
	brands?: string[];
	platforms?: string[];
	duration?: Duration[];
	times?: Time[];
};

/*---------- Firebase Regions ----------*/

// Types
export type Region = {
	// System data
	id: string;
	// Editable data
	name: string;
	platforms?: string[];
};
export type RegionClient = {
	// System data
	id: string;
	// Editable data
	name: string;
	platforms?: string[];
};

/*---------- Firebase Platform ----------*/

// Types
export type Platform = {
	// System data
	id: string;
	// Editable data
	name: string;
	teamsUrl?: string;
};
export type PlatformClient = {
	// System data
	id: string;
	// Editable data
	name: string;
	teamsUrl?: string;
};

/*---------- Firebase Events ----------*/

// Types
export type Event = {
	// System data
	uid?: string; // <-- Creator uid
	id?: string; // <-- Event id
	yid?: string; // <-- Year id (YYYY)
	mid?: string; // <-- Month id (YYYY-MM)
	did?: string; // <-- Day id (YYYY-MM-DD)
	access?: Role;
	// Editable data
	name?: string;
	nameToLowerCase?: string;
	creator?: string;
	host?: string;
	location?: string;
	brands?: string[];
	team?: string;
	region?: string;
	platform?: string;
	about?: string;
	time?: string;
	datetime?: Timestamp;
	duration?: number;
};
export type EventClient = {
	// System data
	uid?: string; // <-- Creator uid
	id?: string; // <-- Event id
	yid?: string; // <-- Year id
	mid?: string; // <-- Month id
	did?: string; // <-- Day id
	access?: Role;
	href?: string;
	// Editable data
	name?: string;
	host?: string;
	creator?: string;
	location?: string;
	brands?: string[];
	team?: string;
	region?: string;
	platform?: string;
	about?: string;
	datetime?: string;
	date?: string;
	time?: string;
	duration?: number;
	datetimeEnd?: string;
	dateend?: string;
	timeend?: string;
};

/*---------- Firebase Activity ----------*/

// Types
export type Activity = {
	uid?: string; // <-- Creator uid
	id?: string; // <-- Activity id, matches Event id
	aid?: string; // <-- Activity unique id
	yid?: string; // <-- Year id
	mid?: string; // <-- Month id
	did?: string; // <-- Day id
	access?: Role;
	creator?: string;
	editor?: string;
	datetime?: Timestamp;
	datetimeEdited?: Timestamp;
	note?: string;
};
export type ActivityClient = {
	uid?: string; // <-- Creator uid
	id?: string; // <-- Activity id, matches Event id
	aid?: string; // <-- Activity unique id
	yid?: string; // <-- Year id
	mid?: string; // <-- Month id
	did?: string; // <-- Day id
	access?: Role;
	creator?: string;
	editor?: string;
	datetime?: string;
	date?: string;
	time?: string;
	datetimeEdited?: string;
	dateEdited?: string;
	timeEdited?: string;
	note?: string;
};

/*---------- Firebase Timeslots ----------*/

// Types
export type Timeslot = {
	// System data
	did: string;
	time: string;
	duration: number;
};
export type TimeslotClient = {
	// System data
	did: string;
	time: string;
	duration: number;
};
