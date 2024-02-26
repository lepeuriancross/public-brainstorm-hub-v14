// Firebase: Filter Functions
/*----------------------------------------------------------------------------------------------------
* Used server-side to filter GET / POST data
----------------------------------------------------------------------------------------------------*/

/*---------- Imports ----------*/

// Scripts (node)
import { Timestamp } from 'firebase-admin/firestore';
import dayjs, { Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import {
	User,
	UserClient,
	Team,
	TeamClient,
	Region,
	RegionClient,
	Platform,
	PlatformClient,
	Event,
	EventClient,
	Activity,
	ActivityClient,
	Timeslot,
	TimeslotClient,
	Validation,
} from '@/types';

// Scripts (local)
import { strGenerateUid } from '@/lib/utils';
import {
	// User validation
	validateFirstName,
	validateLastName,
	validateEmail,
	// Event validation
	validateEventUid,
	validateEventId,
	validateEventName,
	validateEventBrands,
	validateEventTeam,
	validateEventRegion,
	validateEventDatetime,
	validateEventDuration,
	validateEventPlatform,
	// Activity validation
	validateActivityUid,
	validateActivityId,
	validateActivityAid,
	validateActivityNote,
} from '@/firebase/lib/validation';
import errors from '@/data/errors';

dayjs.extend(isBetween);

/*---------- Client to Server ----------*/

// Function - filterUserSubmit
export const filterUserSubmit = (
	clientData: UserClient
): {
	error: Validation;
	data?: User;
} => {
	/*----- Client Data -----*/

	// Get clientData
	const { firstName, lastName, email, team, region, about, optinComments } =
		clientData;

	/*----- Validation -----*/

	// If firstName...
	if (firstName) {
		// Validate firstName
		const firstNameValidation = validateFirstName(firstName);
		// If firstName is invalid...
		if (firstNameValidation)
			// Return error
			return {
				error: firstNameValidation,
			};
	}

	// If lastName...
	if (lastName) {
		// Validate lastName
		const lastNameValidation = validateLastName(lastName);
		// If lastName is invalid...
		if (lastNameValidation)
			// Return error
			return {
				error: lastNameValidation,
			};
	}

	// If email...
	if (email) {
		// Validate email
		const emailValidation = validateEmail(email);
		// If email is invalid...
		if (emailValidation)
			// Return error
			return {
				error: emailValidation,
			};
	}

	// If team...
	// if (team) {
	// 	// Validate team
	// 	const teamValidation = validateEventTeam(team);
	// 	// If team is invalid...
	// 	if (teamValidation)
	// 		// Return error
	// 		return {
	// 			error: teamValidation,
	// 		};
	// }

	// If region...
	// if (region) {
	// 	// Validate region
	// 	const regionValidation = validateEventRegion(region);
	// 	// If region is invalid...
	// 	if (regionValidation)
	// 		// Return error
	// 		return {
	// 			error: regionValidation,
	// 		};
	// }

	// If about...
	// if (about) {
	// 	// Validate about
	// 	const aboutValidation = validateAbout(about);
	// 	// If about is invalid...
	// 	if (aboutValidation)
	// 		// Return error
	// 		return {
	// 			error: aboutValidation,
	// 		};
	// }

	// If optinComments...
	// if (optinComments) {
	// 	// Validate optinComments
	// 	const optinCommentsValidation = validateOptinComments(optinComments);
	// 	// If optinComments is invalid...
	// 	if (optinCommentsValidation)
	// 		// Return error
	// 		return {
	// 			error: optinCommentsValidation,
	// 		};
	// }

	/*----- Server Data -----*/

	// Declare dataParsed
	let dataParsed = {} as User;

	// Add name (firstName + lastName)
	if (firstName && lastName) dataParsed['name'] = `${firstName} ${lastName}`;

	// Add nameToLowerCase (firstName + lastName, to lower case)
	if (dataParsed['name'])
		dataParsed['nameToLowerCase'] = dataParsed['name'].toLowerCase();

	// Add email
	if (email) dataParsed['email'] = email;

	// Add team
	if (team) dataParsed['team'] = team;

	// Add region
	if (region) dataParsed['region'] = region;

	// Add about
	if (about) dataParsed['about'] = about;

	// Add optinComments
	if (optinComments) dataParsed['optinComments'] = optinComments ?? false;

	// Return false
	return {
		error: false,
		data: dataParsed,
	};
};

// Function - filterEventSubmit
export const filterEventSubmit = (
	clientData: EventClient
): {
	error: Validation;
	data?: Event;
} => {
	/*----- Client Data -----*/

	// Get clientData
	const {
		uid,
		id,
		name,
		creator,
		host,
		location,
		brands,
		team,
		region,
		platform,
		about,
		datetime,
		duration,
	} = clientData;

	/*----- Validation -----*/

	// If uid...
	if (uid) {
		// Validate uid
		const uidValidation = validateEventUid(uid);
		// If uid is invalid...
		if (uidValidation)
			// Return error
			return {
				error: uidValidation,
			};
	}

	// If id...
	if (id) {
		// Validate id
		const idValidation = validateEventId(id);
		// If id is invalid...
		if (idValidation)
			// Return error
			return {
				error: idValidation,
			};
	}

	// If name...
	if (name) {
		// Validate name
		const nameValidation = validateEventName(name);
		// If name is invalid...
		if (nameValidation)
			// Return error
			return {
				error: nameValidation,
			};
	}

	// If brands...
	if (brands) {
		// Validate brands
		const brandsValidation = validateEventBrands(brands);
		// If brands is invalid...
		if (brandsValidation)
			// Return error
			return {
				error: brandsValidation,
			};
	}

	// If team...
	if (team) {
		// Validate team
		const teamValidation = validateEventTeam(team);
		// If team is invalid...
		if (teamValidation)
			// Return error
			return {
				error: teamValidation,
			};
	}

	// If region...
	if (region) {
		// Validate region
		const regionValidation = validateEventRegion(region);
		// If region is invalid...
		if (regionValidation)
			// Return error
			return {
				error: regionValidation,
			};
	}

	// If platform...
	if (platform) {
		// Validate platform
		const platformValidation = validateEventPlatform(platform);
		// If platform is invalid...
		if (platformValidation)
			// Return error
			return {
				error: platformValidation,
			};
	}

	// If datetime...
	if (datetime) {
		// Validate datetime
		const datetimeValidation = validateEventDatetime(datetime);
		// If datetime is invalid...
		if (datetimeValidation)
			// Return error
			return {
				error: datetimeValidation,
			};
	}

	// If duration...
	if (duration) {
		// Validate duration
		const durationValidation = validateEventDuration(duration);

		// If duration is invalid...
		if (durationValidation)
			// Return error
			return {
				error: durationValidation,
			};
	}

	// If duration...
	if (clientData?.duration) {
		// Validate duration
		const durationValidation = validateEventDuration(clientData.duration);
		// If duration is invalid...
		if (durationValidation)
			// Return error
			return {
				error: durationValidation,
			};
	}

	/*----- Server Data -----*/

	// Declare dataParsed
	let dataParsed = {} as Event;

	// Add uid
	if (uid) dataParsed['uid'] = uid;

	// Add id
	dataParsed['id'] = clientData?.id ?? strGenerateUid();

	// Add access
	dataParsed['access'] = clientData?.access ?? 'user';

	// Add name
	dataParsed['name'] = clientData?.name ?? dataParsed['id'];

	// Add creator
	if (creator) dataParsed['creator'] = host;

	// Add host
	if (host) dataParsed['host'] = host;

	// Add location
	if (location) dataParsed['location'] = location;

	// Add brands
	if (brands) dataParsed['brands'] = brands;

	// Add team
	if (team) dataParsed['team'] = team;

	// Add region
	if (region) dataParsed['region'] = region;

	// Add platform
	if (platform) dataParsed['platform'] = platform;

	// Add about
	dataParsed['about'] = about ?? '';

	// Add datetime (as Timestamp)
	if (datetime) {
		const day = dayjs(datetime);
		dataParsed['yid'] = day.format('YYYY');
		dataParsed['mid'] = day.format('YYYY-MM');
		dataParsed['did'] = day.format('YYYY-MM-DD');
		dataParsed['datetime'] = Timestamp.fromDate(new Date(datetime));
	}

	// Add duration
	if (duration) dataParsed['duration'] = duration;

	// Return false
	return {
		error: false,
		data: dataParsed,
	};
};

// Function - filterActivitySubmit
export const filterActivitySubmit = (
	clientData: ActivityClient
): {
	error: Validation;
	data?: Activity;
} => {
	/*----- Client Data -----*/

	// Get clientData
	const {
		uid,
		id,
		aid,
		yid,
		mid,
		did,
		access,
		creator,
		editor,
		datetime,
		datetimeEdited,
		note,
	} = clientData;

	/*----- Validation -----*/

	// ...

	/*----- Server Data -----*/

	// Declare dataParsed
	let dataParsed = {} as Activity;

	// Add uid
	if (uid) dataParsed['uid'] = uid;

	// Add id
	if (id) dataParsed['id'] = id;

	// Add aid
	if (aid) dataParsed['aid'] = aid;

	// Add creator
	if (creator) dataParsed['creator'] = creator;

	// Add editor
	if (editor) dataParsed['editor'] = editor;

	// Add datetime (as Timestamp)
	if (datetime) {
		const day = dayjs(datetime);
		dataParsed['yid'] = day.format('YYYY');
		dataParsed['mid'] = day.format('YYYY-MM');
		dataParsed['did'] = day.format('YYYY-MM-DD');
		dataParsed['datetime'] = Timestamp.fromDate(new Date(datetime));
	}

	// Add datetimeEdited (as Timestamp)
	if (datetimeEdited) {
		dataParsed['datetimeEdited'] = Timestamp.fromDate(new Date(datetimeEdited));
	}

	// Add note
	if (note) dataParsed['note'] = note;

	// Return false
	return {
		error: false,
		data: dataParsed,
	};
};

/*---------- Server to Client ----------*/

// Function - filterUserFetch
export const filterUserFetch = (
	serverData: User
): {
	error: Validation;
	data?: UserClient;
} => {
	/*----- Client Data -----*/

	// Declare dataParsed
	let dataParsed = {} as UserClient;

	// Add uid
	if (serverData?.uid) dataParsed['uid'] = serverData.uid ?? undefined;

	// Add role
	if (serverData?.role) dataParsed['role'] = serverData.role ?? undefined;

	// Add lastSeen
	if (serverData?.lastSeen)
		dataParsed['lastSeen'] = serverData.lastSeen ?? false;

	// Add lastSeenDateTime
	if (serverData?.lastSeenDateTime)
		dataParsed['lastSeenDateTime'] = serverData.lastSeenDateTime ?? false;

	// Add firstName
	if (serverData?.name?.split(' ')[0])
		dataParsed['firstName'] = serverData.name.split(' ')[0] ?? undefined;

	// Add lastName
	if (serverData?.name?.split(' ')[1])
		dataParsed['lastName'] = serverData.name.split(' ')[1] ?? undefined;

	// Add email
	if (serverData?.email) dataParsed['email'] = serverData.email ?? undefined;

	// Add team
	if (serverData?.team) dataParsed['team'] = serverData.team ?? undefined;

	// Add region
	if (serverData?.region) dataParsed['region'] = serverData.region ?? undefined;

	// Add about
	if (serverData?.about) dataParsed['about'] = serverData.about ?? undefined;

	// Add optinComments
	if (serverData?.optinComments)
		dataParsed['optinComments'] = serverData.optinComments ?? undefined;

	// Return false
	return {
		error: false,
		data: dataParsed,
	};
};

// Function - filterTeamFetch
export const filterTeamFetch = (
	serverData: Team
): {
	error: Validation;
	data?: TeamClient;
} => {
	/*----- Client Data -----*/

	// Declare dataParsed
	let dataParsed = {} as TeamClient;

	// Add id
	if (serverData?.id) dataParsed['id'] = serverData.id ?? undefined;

	// Add access
	if (serverData?.access) dataParsed['access'] = serverData.access ?? undefined;

	// Add name
	if (serverData?.name) dataParsed['name'] = serverData.name ?? undefined;

	// Add imageUrl
	if (serverData?.imageUrl)
		dataParsed['imageUrl'] = serverData.imageUrl ?? undefined;

	// Add brands
	if (serverData?.brands) dataParsed['brands'] = serverData.brands ?? undefined;

	// Add duration
	if (serverData?.duration)
		dataParsed['duration'] = serverData.duration ?? undefined;

	// Add times
	if (serverData?.times) dataParsed['times'] = serverData.times ?? undefined;

	// Return false
	return {
		error: false,
		data: dataParsed,
	};
};

// Function - filterRegionFetch
export const filterRegionFetch = (
	serverData: Region
): {
	error: Validation;
	data?: RegionClient;
} => {
	/*----- Client Data -----*/

	// Declare dataParsed
	let dataParsed = {} as RegionClient;

	// Add id
	if (serverData?.id) dataParsed['id'] = serverData.id ?? undefined;

	// Add name
	if (serverData?.name) dataParsed['name'] = serverData.name ?? undefined;

	// Return false
	return {
		error: false,
		data: dataParsed,
	};
};

// Function - filterPlatformFetch
export const filterPlatformFetch = (
	serverData: Platform
): {
	error: Validation;
	data?: PlatformClient;
} => {
	/*----- Client Data -----*/

	// Declare dataParsed
	let dataParsed = {} as PlatformClient;

	// Add id
	if (serverData?.id) dataParsed['id'] = serverData.id ?? undefined;

	// Add name
	if (serverData?.name) dataParsed['name'] = serverData.name ?? undefined;

	// Add teamsUrl
	if (serverData?.teamsUrl)
		dataParsed['teamsUrl'] = serverData.teamsUrl ?? undefined;

	// Return false
	return {
		error: false,
		data: dataParsed,
	};
};

// Function - filterEventFetch
export const filterEventFetch = (
	serverData: Event
): {
	error: Validation;
	data?: EventClient;
} => {
	/*----- Client Data -----*/

	// Declare dataParsed
	let dataParsed = {} as EventClient;

	// Add uid
	if (serverData?.uid) dataParsed['uid'] = serverData.uid;

	// Add id
	if (serverData?.id) {
		dataParsed['id'] = serverData.id ?? undefined;
		dataParsed['href'] = `/events/${serverData.id}` ?? undefined;
	}

	// Add access
	if (serverData?.access) dataParsed['access'] = serverData.access ?? undefined;

	// Add name
	if (serverData?.name) dataParsed['name'] = serverData.name ?? undefined;

	// Add creator
	if (serverData?.creator)
		dataParsed['creator'] = serverData.creator ?? undefined;

	// Add host
	if (serverData?.host) dataParsed['host'] = serverData.host ?? undefined;

	// Add location
	if (serverData?.location)
		dataParsed['location'] = serverData.location ?? undefined;

	// Add brands
	if (serverData?.brands) dataParsed['brands'] = serverData.brands ?? undefined;

	// Add team
	if (serverData?.team) dataParsed['team'] = serverData.team ?? undefined;

	// Add region
	if (serverData?.region) dataParsed['region'] = serverData.region ?? undefined;

	// Add platform
	if (serverData?.platform)
		dataParsed['platform'] = serverData.platform ?? undefined;

	// Add about
	if (serverData?.about) dataParsed['about'] = serverData.about ?? undefined;

	// Add datetime / time
	if (serverData?.datetime) {
		const day = dayjs(serverData.datetime.toDate());
		dataParsed['yid'] = day.format('YYYY') ?? undefined;
		dataParsed['mid'] = day.format('YYYY-MM') ?? undefined;
		dataParsed['did'] = day.format('YYYY-MM-DD') ?? undefined;
		dataParsed['datetime'] = day.format('YYYY-MM-DDTHH:mm') ?? undefined;
		dataParsed['date'] = day.format('YYYY-MM-DD') ?? undefined;
		dataParsed['time'] = day.format('HH:mm') ?? undefined;

		// Add duration / datetimeEnd
		if (serverData?.duration) {
			dataParsed['duration'] = serverData.duration;
			dataParsed['datetimeEnd'] =
				day.add(dataParsed['duration'], 'minute').format('YYYY-MM-DDTHH:mm') ??
				undefined;
			dataParsed['dateend'] =
				day.add(dataParsed['duration'], 'minute').format('YYYY-MM-DD') ??
				undefined;
			dataParsed['timeend'] =
				day.add(dataParsed['duration'], 'minute').format('HH:mm') ?? undefined;
		}
	}

	// Return false
	return {
		error: false,
		data: dataParsed,
	};
};

// Function - filterActivityFetch
export const filterActivityFetch = (
	serverData: Activity
): {
	error: Validation;
	data?: ActivityClient;
} => {
	/*----- Server Data -----*/

	// Get serverData
	const { uid, id, aid, creator, editor, datetime, datetimeEdited, note } =
		serverData;

	/*----- Client Data -----*/

	// Declare dataParsed
	let dataParsed = {} as ActivityClient;

	// Add uid
	if (uid) dataParsed['uid'] = uid;

	// Add id
	if (id) dataParsed['id'] = id;

	// Add aid
	if (aid) dataParsed['aid'] = aid;

	// Add creator
	if (creator) dataParsed['creator'] = creator;

	// Add editor
	if (editor) dataParsed['editor'] = editor;

	// Add datetime
	if (datetime) {
		const day = dayjs(datetime.toDate());
		dataParsed['yid'] = day.format('YYYY') ?? undefined;
		dataParsed['mid'] = day.format('YYYY-MM') ?? undefined;
		dataParsed['did'] = day.format('YYYY-MM-DD') ?? undefined;
		dataParsed['datetime'] = day.format('YYYY-MM-DDTHH:mm') ?? undefined;
		dataParsed['date'] = day.format('YYYY-MM-DD') ?? undefined;
		dataParsed['time'] = day.format('HH:mm') ?? undefined;
	}

	// Add datetimeEdited
	if (datetimeEdited) {
		const day = dayjs(datetimeEdited.toDate());
		dataParsed['datetimeEdited'] = day.format('YYYY-MM-DDTHH:mm') ?? undefined;
	}

	// Add note
	if (note) dataParsed['note'] = note;

	// Return false
	return {
		error: false,
		data: dataParsed,
	};
};

// Function - filterTimeslotFetch
export const filterTimeslotFetch = (
	serverData: Timeslot,
	params?: {
		did?: string;
		events?: EventClient[];
		team?: TeamClient;
	}
): {
	error: Validation;
	data?: TimeslotClient;
} => {
	/*----- Server Data -----*/

	// Get serverData
	const { did, time, duration } = serverData;

	/*----- Validation -----*/

	// If params...
	if (params) {
		// If events...
		if (params.events && params.events.length) {
			// Get timeslot timeStart
			const timeStart = dayjs(serverData.time);

			// Get timeslot timeEnd
			const timeEnd = dayjs(serverData.time).add(serverData.duration, 'minute');

			// Loop through events
			params.events.forEach((event) => {
				// Get event timeStart
				const eventTimeStart = dayjs(event.datetime);

				// Get event timeEnd
				const eventTimeEnd = dayjs(event.datetime).add(
					event.duration ?? 20,
					'minute'
				);

				// If timeslot timeStart is between event timeStart and timeEnd...
				if (timeStart.isBetween(eventTimeStart, eventTimeEnd)) {
					// Return error
					return {
						error: `Timeslot start is overlapped by event (${eventTimeStart.format(
							'HH:mm'
						)} - ${eventTimeEnd.format('HH:mm')})`,
					};
				}

				// If timeslot timeEnd is between event timeStart and timeEnd...
				if (timeEnd.isBetween(eventTimeStart, eventTimeEnd)) {
					// Return error
					return {
						error: `Timeslot end is overlapped by event (${eventTimeStart.format(
							'HH:mm'
						)} - ${eventTimeEnd.format('HH:mm')})`,
					};
				}
			});
		}

		// If team...
		if (params.did && params.team) {
			// Get current datetime
			const currentDate = dayjs();

			// Get tomorrows datetime (start and end of day)
			const tomorrowDateStart = dayjs().add(1, 'day').startOf('day');
			const tomorrowDateEnd = dayjs().add(1, 'day').endOf('day');

			// Get time using did
			const timeId = dayjs(params.did).format('dddd').toLowerCase();
			const time = params.team.times?.find((time) => time.id === timeId);

			// If no time...
			if (!time) {
				// Return error
				return {
					error: {
						error: 'restricted/timeslots/400',
						message: errors['restricted/timeslots/400'],
					},
				};
			}

			// If timeslotTimeStart is before tomorrow...
			if (dayjs(serverData.time).isBefore(tomorrowDateStart)) {
				// Return error
				return {
					error: {
						error: 'restricted/timeslots/400',
						message: errors['restricted/timeslots/400'],
					},
				};
			}

			// If timeslotTimeStart is tomorrow...
			if (
				dayjs(serverData.time).isBetween(tomorrowDateStart, tomorrowDateEnd)
			) {
				// If current time is after 2pm (tomorrows cut off)...
				if (currentDate.isAfter(tomorrowDateStart.add(14, 'hour'))) {
					// Return error
					return {
						error: {
							error: 'restricted/timeslots/400',
							message: errors['restricted/timeslots/400'],
						},
					};
				}
			}

			// Get timeslot start / end
			const timeslotTimeStart = dayjs(serverData.time);
			const timeslotTimeEnd = dayjs(serverData.time).add(
				serverData.duration,
				'minute'
			);

			// Get team start / end
			const teamTimeStartSplit = time.timeStart.split(':');
			const teamTimeEndSplit = time.timeEnd.split(':');
			const teamTimeStart = dayjs(params.did)
				.startOf('day')
				.add(parseInt(teamTimeStartSplit[0]), 'hour')
				.add(parseInt(teamTimeStartSplit[1]), 'minute');
			const teamTimeEnd = dayjs(params.did)
				.startOf('day')
				.add(parseInt(teamTimeEndSplit[0]), 'hour')
				.add(parseInt(teamTimeEndSplit[1]), 'minute');

			// If not inside team times...
			if (
				!(
					timeslotTimeStart.isBetween(
						dayjs(teamTimeStart).subtract(1, 'second'),
						teamTimeEnd.add(1, 'second')
					) &&
					timeslotTimeEnd.isBetween(
						dayjs(teamTimeStart).subtract(1, 'second'),
						teamTimeEnd.add(1, 'second')
					)
				)
			) {
				// Return error
				return {
					error: {
						error: 'restricted/timeslots/400',
						message: errors['restricted/timeslots/400'],
					},
				};
			}
		}
	}

	/*----- Client Data -----*/

	// Declare dataParsed
	let dataParsed = {} as TimeslotClient;

	// Add did
	if (did) dataParsed['did'] = did;

	// Add time
	if (time) dataParsed['time'] = time;

	// Add duration
	if (duration) dataParsed['duration'] = duration;

	// Return false
	return {
		error: false,
		data: dataParsed,
	};
};
