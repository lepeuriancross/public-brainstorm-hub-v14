// Scripts: Calendar Functions
/*----------------------------------------------------------------------------------------------------*/

'use client';

/*---------- Imports ----------*/

// Config
import { Day, EventClient } from '@/types';
import names from '@/data/names';

// Scripts (node)
import dayjs, { Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

/*---------- Generators ----------*/

// Function - getDays
export function getDays(dateDaySelected: Dayjs): Day[] {
	// Declare days
	const days = [] as Day[];

	// Get first day of month
	const dateDayFirst = dateDaySelected.startOf('month');

	// Get day of month (0 = monday)
	const dayOfMonth = names.dayNames.indexOf(
		dateDayFirst.startOf('month').format('dddd').toLowerCase()
	);

	// Loop days
	for (let i = 0; i < 42; i++) {
		// Get dateDayCell
		const dateDayCell = dateDayFirst.subtract(dayOfMonth, 'day').add(i, 'day');

		// Get day
		const day = getDay(dateDaySelected, dateDayCell);

		// Push day
		days.push(day);
	}

	// Return
	return days;
}

// Function - getDay
export function getDay(dateDaySelected: Dayjs, dateDayCell: Dayjs): Day {
	// Get first /  date of week selected
	const dateWeekSelectedFirst = dateDaySelected.startOf('week').add(1, 'day');
	const dateWeekSelectedLast = dateDaySelected.endOf('week').add(1, 'day');

	// Get dateDayToday
	const dateDayToday = dayjs();

	// Declare day
	const day = {
		date: dateDayCell,
		isCurrentMonth:
			dateDaySelected.format('YYYY-MM') === dateDayCell.format('YYYY-MM'),
		isCurrentWeek: dateDayCell.isBetween(
			dateWeekSelectedFirst,
			dateWeekSelectedLast,
			'day',
			'[]'
		),
		isToday:
			dateDayToday.format('YYYY-MM-DD') === dateDayCell.format('YYYY-MM-DD'),
		isSelected:
			dateDaySelected.format('YYYY-MM-DD') === dateDayCell.format('YYYY-MM-DD'),
	} as Day;

	// Return
	return day;
}
