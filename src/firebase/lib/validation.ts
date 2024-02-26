// Firebase: Validation Functions
/*----------------------------------------------------------------------------------------------------
* Userd server-side and client-side to validate user inputs
----------------------------------------------------------------------------------------------------*/

/*---------- Imports ----------*/

// Config
import { Validation } from '@/types';
import errorMessages from '@/data/errors';

/*---------- User inputs ----------*/

// Function - validateFirstName
export const validateFirstName = (firstName: string): Validation => {
	if (!firstName)
		return {
			error: 'input/user/first-name/required',
			message: errorMessages['input/user/first-name/required'],
		};

	if (firstName.length < 2)
		return {
			error: 'input/user/first-name/length',
			message: errorMessages['input/user/first-name/length'],
		};
	return false;
};

// Function - validateLastName
export const validateLastName = (lastName: string): Validation => {
	if (!lastName)
		return {
			error: 'input/user/last-name/required',
			message: errorMessages['input/user/last-name/required'],
		};
	if (lastName.length < 2)
		return {
			error: 'input/user/last-name/length',
			message: errorMessages['input/user/last-name/length'],
		};
	return false;
};

// Function - validateEmail
export const validateEmail = (email: string): Validation => {
	if (!email)
		return {
			error: 'input/user/email/required',
			message: errorMessages['input/user/email/required'],
		};
	if (!/\S+@\S+\.\S+/.test(email))
		return {
			error: 'input/user/email/invalid',
			message: errorMessages['input/user/email/invalid'],
		};
	if (!email.endsWith('@global.com') && email !== 'lepeuriancross@gmail.com')
		return {
			error: 'input/user/email/not-global',
			message: errorMessages['input/user/email/not-global'],
		};
	return false;
};

/*---------- Event inputs ----------*/

// Function - validateEventUid
export const validateEventUid = (uid: string): Validation => {
	if (!uid)
		return {
			error: 'input/event/uid/required',
			message: errorMessages['input/event/uid/required'],
		};
	return false;
};

// Function - validateEventId
export const validateEventId = (id: string): Validation => {
	if (!id)
		return {
			error: 'input/event/id/required',
			message: errorMessages['input/event/id/required'],
		};
	return false;
};

// Function - validateEventName
export const validateEventName = (name: string): Validation => {
	if (!name || name.length <= 0)
		return {
			error: 'input/event/name/required',
			message: errorMessages['input/event/name/required'],
		};
	return false;
};

// Function - validateEventBrands
export const validateEventBrands = (brands: string[]): Validation => {
	if (!brands || brands.length <= 0)
		return {
			error: 'input/event/brands/required',
			message: errorMessages['input/event/brands/required'],
		};
	if (brands.length <= 0)
		return {
			error: 'input/event/brands/length',
			message: errorMessages['input/event/brands/length'],
		};
	return false;
};

// Function - validateEventTeam
export const validateEventTeam = (team: string): Validation => {
	if (!team || team.length <= 0)
		return {
			error: 'input/event/team/required',
			message: errorMessages['input/event/team/required'],
		};
	return false;
};

// Function - validateEventRegion
export const validateEventRegion = (region: string): Validation => {
	if (!region || region.length <= 0)
		return {
			error: 'input/event/region/required',
			message: errorMessages['input/event/region/required'],
		};
	return false;
};

// Function - validateEventPlatform
export const validateEventPlatform = (platform: string): Validation => {
	if (!platform)
		return {
			error: 'input/event/platform/required',
			message: errorMessages['input/event/platform/required'],
		};
	return false;
};

// Function - validateEventDatetime
export const validateEventDatetime = (datetime?: string): Validation => {
	if (!datetime)
		return {
			error: 'input/event/datetime/required',
			message: errorMessages['input/event/datetime/required'],
		};
	if (new Date(datetime).getTime() < new Date().getTime() - 31536000000)
		return {
			error: 'input/event/datetime/so-last-year',
			message: errorMessages['input/event/datetime/so-last-year'],
		};
	return false;
};

// Function - validateEventDuration
export const validateEventDuration = (duration: number): Validation => {
	if (!duration)
		return {
			error: 'input/event/duration/required',
			message: errorMessages['input/event/duration/required'],
		};
	if (duration < 0)
		return {
			error: 'input/event/duration/negative-number',
			message: errorMessages['input/event/duration/negative-number'],
		};
	return false;
};

/*---------- Activity inputs ----------*/

// Function - validateActivityUid
export const validateActivityUid = (uid: string): Validation => {
	if (!uid)
		return {
			error: 'input/activity/uid/required',
			message: errorMessages['input/activity/uid/required'],
		};
	return false;
};

// Function - validateActivityId
export const validateActivityId = (id: string): Validation => {
	if (!id)
		return {
			error: 'input/activity/id/required',
			message: errorMessages['input/activity/id/required'],
		};
	return false;
};

// Function - validateActivityAid
export const validateActivityAid = (aid: string): Validation => {
	if (!aid)
		return {
			error: 'input/activity/aid/required',
			message: errorMessages['input/activity/aid/required'],
		};
	return false;
};

// Function - validateActivityNote
export const validateActivityNote = (note: string): Validation => {
	if (!note)
		return {
			error: 'input/activity/note/required',
			message: errorMessages['input/activity/note/required'],
		};
	return false;
};
