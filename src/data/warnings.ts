// Data: Warnings
/*----------------------------------------------------------------------------------------------------
* A list of warning descriptions used throughout the application. 
* i.e. warning/event-snapshot/500 means "An event snapshot has not been established".
----------------------------------------------------------------------------------------------------*/

/*---------- Imports ----------*/

// Config
import names from '@/data/names';

// Scripts (local)
import { strCapitalize } from '@/lib/utils';

/*---------- Warnings ----------*/

// Types
export type ThemeWarningRestricted = 'warning/event-snapshot/500';

// Warnings
const warnings = {
	// General snapshots
	'warning/snapshot/500': `One or more 'snapshots' have not been established. Info may not update in real-time`,
	// Event snapshots
	'warning/events-snapshot/500': `${strCapitalize(
		names.events
	)} 'snapshot' has not been established. Info may not update in real-time`,
	'warning/event-snapshot/500': `${strCapitalize(
		names.event
	)} 'snapshot' has not been established. Info may will not update in real-time`,
};

/*---------- Exports ----------*/

export default warnings;
