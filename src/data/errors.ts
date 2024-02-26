// Data: Errors
/*----------------------------------------------------------------------------------------------------
* A list of error descriptions used throughout the application. 
* i.e. error/invalid-input means "Please check the form for errors".
----------------------------------------------------------------------------------------------------*/

/*---------- Imports ----------*/

// Config
import names from '@/data/names';

// Scripts (local)
import { strCapitalize } from '@/lib/utils';

/*---------- Errors ----------*/

// Types
export type ThemeErrorRestricted =
	// Restricted
	| 'restricted/forbidden'
	| 'restricted/timeout'
	| 'restricted/firestore/500'
	| 'restricted/auth/token'
	| 'restricted/user/403'
	| 'restricted/user/404'
	| 'restricted/user/500'
	| 'restricted/user-submit/400'
	| 'restricted/brand/403'
	| 'restricted/brand/404'
	| 'restricted/brand/500'
	| 'restricted/region/403'
	| 'restricted/region/404'
	| 'restricted/region/500'
	| 'restricted/team/403'
	| 'restricted/team/404'
	| 'restricted/team/500'
	| 'restricted/event-options/403'
	| 'restricted/event-options/404'
	| 'restricted/events/403'
	| 'restricted/events/404'
	| 'restricted/events/500'
	| 'restricted/event/403'
	| 'restricted/event/404'
	| 'restricted/event/500'
	| 'restricted/event-submit/400'
	| 'restricted/event-submit/403'
	| 'restricted/user-submit/404'
	| 'restricted/event-submit/500'
	| 'restricted/timeslots-params/403'
	| 'restricted/timeslots-params/404'
	| 'restricted/timeslots/403'
	| 'restricted/timeslots/404'
	| 'restricted/timeslots/500'
	| 'restricted/timeslot/400'
	| 'restricted/timeslot/403'
	| 'restricted/timeslot/404'
	| 'restricted/timeslot/500'
	| 'restricted/activities/400'
	| 'restricted/activities/403'
	| 'restricted/activities/404'
	| 'restricted/activities/500'
	| 'restricted/activity/400'
	| 'restricted/activity/403'
	| 'restricted/activity/404'
	| 'restricted/activity/500'
	| 'restricted/activity-submit/400'
	| 'restricted/activity-submit/403'
	| 'restricted/activity-submit/500'
	| 'restricted/activity-delete/400'
	| 'restricted/activity-delete/404'
	| 'restricted/activity-delete/500'
	// General inputs
	| 'input/general/form/invalid-input'
	// User inputs
	| 'input/user/first-name/required'
	| 'input/user/first-name/length'
	| 'input/user/last-name/required'
	| 'input/user/last-name/length'
	| 'input/user/email/required'
	| 'input/user/email/invalid'
	| 'input/user/email/not-global'
	// Event inputs
	| 'input/event/uid/required'
	| 'input/event/id/required'
	| 'input/event/name/required'
	| 'input/event/brands/required'
	| 'input/event/brands/length'
	| 'input/event/team/required'
	| 'input/event/region/required'
	| 'input/event/platform/required'
	| 'input/event/datetime/required'
	| 'input/event/duration/required'
	| 'input/event/duration/negative-number'
	| 'input/event/datetime/so-last-year'
	// Action inputs
	| 'input/activity/uid/required'
	| 'input/activity/id/required'
	| 'input/activity/aid/required'
	| 'input/activity/note/required';

// Errors
const errors = {
	// Restricted
	'restricted/forbidden': 'You do not have permission to view this page',

	'restricted/timeout':
		'The content is taking a long time to load. If the problem persists please refresh the page',

	'restricted/firestore/500':
		'The server is having trouble fetching data (no firestore). Please refresh the page',

	'restricted/auth/token': 'No auth token was found. Please refresh the page',

	'restricted/users/400': `The application made a bad request fetching these ${names.users}. Please contact your administrator if the problem persists`,

	'restricted/user/400': `The application made a bad request fetching this ${names.user}. Please contact your administrator if the problem persists`,
	'restricted/user/403': `You do not have permission to view this ${names.user}`,
	'restricted/user/404': `It looks like this ${names.user} does not exist. Please check and try again`,
	'restricted/user/500': `The server is having trouble fetching your ${names.user} credentials. Please refresh the page`,

	'restricted/user-submit/400': `The application made a bad request submitting ${names.user}. Please contact your administrator if the problem persists`,
	'restricted/user-submit/403': `You do not have permission to edit this ${names.user}`,
	'restricted/user-submit/404': `It looks like this ${names.user} does not exist. Please check and try again`,

	'restricted/brand/400': `The application made a bad request fetching this ${names.brand}. Please contact your administrator if the problem persists`,
	'restricted/brand/403': `You do not have permission to view this ${names.brand}`,
	'restricted/brand/404': `It looks like this ${names.brand} does not exist. Please check and try again`,
	'restricted/brand/500': `The server is having trouble fetching this ${names.brand}. Please refresh the page`,

	'restricted/region/400': `The application made a bad request fetching this ${names.region}. Please contact your administrator if the problem persists`,
	'restricted/region/403': `You do not have permission to view this ${names.region}`,
	'restricted/region/404': `It looks like this ${names.region} does not exist. Please check and try again`,
	'restricted/region/500': `The server is having trouble fetching this ${names.region}. Please refresh the page`,

	'restricted/team/400': `The application made a bad request fetching this ${names.team}. Please contact your administrator if the problem persists`,
	'restricted/team/403': `You do not have permission to view this ${names.team}`,
	'restricted/team/404': `It looks like this ${names.team} does not exist. Please check and try again`,
	'restricted/team/500': `The server is having trouble fetching this ${names.team}. Please refresh the page`,

	'restricted/event-options/400': `The application made a bad request fetching these ${names.event} options. Please contact your administrator if the problem persists`,
	'restricted/event-options/403': `You do not have permission to view this event`,
	'restricted/event-options/404': `We're having trouble fetching the ${names.event} options (${names.response}, ${names.brands}, ${names.teams}). Please refresh the page`,
	'restricted/event-options/500': `The server is having trouble fetching the ${names.event} options. Please refresh the page`,

	'restricted/events/400': `The application made a bad request fetching these ${names.events}. Please contact your administrator if the problem persists`,
	'restricted/events/403': `You do not have permission to view these ${names.events}`,
	'restricted/events/404': `It looks like there aren't any ${names.events} for this month. Please create one`,
	'restricted/events/500': `The server is having trouble fetching your ${names.events}. Please refresh the page`,

	'restricted/event/400': `The application made a bad request fetching this ${names.event}. Please contact your administrator if the problem persists`,
	'restricted/event/403': `You do not have permission to view this ${names.event}`,
	'restricted/event/404': `It looks like this ${names.event} does not exist. Please check and try again`,
	'restricted/event/500': `The server is having trouble fetching this ${names.event}. Please refresh the page`,

	'restricted/event-submit/400': `The application made a bad request submitting this ${names.event}. Please contact your administrator if the problem persists`,
	'restricted/event-submit/403': `You do not have permission to edit this ${names.event}`,
	'restricted/event-submit/500': `The server is having trouble submitting your ${names.event}. Please refresh the page`,

	'restricted/timeslots-params/404': `We're having trouble fetching the ${names.timeslots} params (${names.team}, ${names.region}). Please contact your administrator if the problem persists`,

	'restricted/timeslots/400': `The application made a bad request fetching ${names.timeslots}. Please contact your administrator if the problem persists`,
	'restricted/timeslots/404': `It looks like there aren't any ${names.timeslots} for this ${names.event}`,
	'restricted/timeslots/500': `The server is having trouble fetching your ${names.timeslots}. Please refresh the page`,

	'restricted/timeslot/404': `It looks like this ${names.timeslot} does not exist. Please check and try again`,
	'restricted/timeslot/500': `The server is having trouble fetching this ${names.timeslot}. Please refresh the page`,

	'restricted/activities/400': `The application made a bad request fetching these ${names.activities}. Please contact your administrator if the problem persists`,
	'restricted/activities/403': `You do not have permission to view these ${names.activities}`,
	'restricted/activities/404': `It looks like there aren't any ${names.activities} for this ${names.event}. Please create one`,

	'restricted/activity/400': `The application made a bad request fetching this ${names.activity}. Please contact your administrator if the problem persists`,
	'restricted/activity/403': `You do not have permission to view this ${names.activity}`,
	'restricted/activity/404': `It looks like this ${names.activity} does not exist. Please check and try again`,
	'restricted/activity/500': `The server is having trouble fetching this ${names.activity}. Please refresh the page`,

	'restricted/activity-submit/400': `The application made a bad request submitting this ${names.activity}. Please contact your administrator if the problem persists`,
	'restricted/activity-submit/403': `You do not have permission to edit this ${names.activity}`,
	'restricted/activity-submit/500': `The server is having trouble submitting your ${names.activity}. Please refresh the page`,

	'restricted/activity-delete/400': `The application made a bad request deleting this ${names.activity}. Please contact your administrator if the problem persists`,
	'restricted/activity-delete/403': `You do not have permission to delete this ${names.activity}`,
	'restricted/activity-delete/404': `It looks like this ${names.activity} does not exist. Please check and try again`,
	'restricted/activity-delete/500': `The server is having trouble deleting this ${names.activity}. Please refresh the page`,

	// Inputs General
	'input/general/form/invalid-input': 'Please check the form for errors',

	// Inputs user
	'input/user/first-name/required': 'First name is required',
	'input/user/first-name/length':
		'First name must be at least 2 characters long',
	'input/user/last-name/required': 'Last name is required',
	'input/user/last-name/length': 'Last name must be at least 2 characters long',
	'input/user/email/required': 'Email is required',
	'input/user/email/invalid': 'Email is invalid',
	'input/user/email/not-global': 'Email must be a @global email address',

	// Event inputs
	'input/event/uid/required': 'UID is required',
	'input/event/id/required': 'ID is required',
	'input/event/name/required': `Please select at least one ${names.brand}`,
	'input/event/brands/required': `Please select at least one ${names.brand}`,
	'input/event/brands/length': `At least one ${names.brand} is required`,
	'input/event/team/required': `${strCapitalize(names.team)} is required`,
	'input/event/region/required': `${strCapitalize(names.region)} is required`,
	'input/event/platform/required': `${strCapitalize(
		names.platform
	)} is required`,
	'input/event/datetime/required': 'Date and time are required',
	'input/event/duration/required': 'Duration is required',
	'input/event/duration/negative-number': 'Duration must be a positive number',
	'input/event/datetime/so-last-year':
		'Date and time can not be more than a year in the past',

	// Activity inputs
	'input/activity/uid/required': 'Uid is required',
	'input/activity/id/required': 'Id is required',
	'input/activity/aid/required': 'Aid is required',
	'input/activity/note/required': 'Note is required',
};

/*---------- Exports ----------*/

export default errors;
