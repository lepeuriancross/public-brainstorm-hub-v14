// Component: InputDateSlot
/*----------------------------------------------------------------------------------------------------*/

'use client';

/*---------- Imports ----------*/

// Config
import names from '@/data/names';

// Scripts (node)
import { useEffect, useRef, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';

// Scripts (local)
import { classNames, strCapitalize } from '@/lib/utils';
import { TimeslotClient } from '@/app/api/timeslots/[did]/route';
import { useAuth } from '@/components/base/TheProviderAuth';

// Components (node)
// ...

// Components (local)
import MessageRestricted from '@/components/singles/Message/MessageRestricted';
import InputDate from '@/components/singles/Input/InputDate';

dayjs.extend(advancedFormat);

/*---------- Static Data ----------*/

// Name
const name = 'InputDateSlot';

/*---------- Template ----------*/

// Types
export type InputDateSlotProps = {
	label?: string;
	name?: string;
	id?: string;
	description?: string | false;
	inputValueTeam?: string;
	inputValueRegion?: string;
	inputValueDuration?: number;
	error?: Validation;
	className?: string;
	onChange?: (datetime: string) => void;
};

// Default component
export default function InputDateSlot(props: InputDateSlotProps) {
	/*----- Props -----*/

	// Get props
	const {
		label = '',
		name = '',
		id = '',
		description = false,
		inputValueTeam = 'default',
		inputValueRegion = 'default',
		inputValueDuration = 20,
		error = false,
		className,
		onChange = (datetime: string) => {},
	} = props;

	/*----- Refs -----*/

	// Ref - inputEl
	const inputEl = useRef<HTMLInputElement>(null);

	// Ref - inputDatetimeEl
	const inputDatetimeEl = useRef<HTMLInputElement>(null);

	// Ref - did
	const team = useRef<string | null>();
	const region = useRef<string | null>();
	const duration = useRef<number | null>();

	/*----- Store -----*/

	// State - isFetching
	const [isFetching, setIsFetching] = useState<boolean>(false);

	// State - date (default is today plus one day)
	const [datetime, setDatetime] = useState<Dayjs>(dayjs().add(1, 'day'));

	// State - timeslots
	const [timeslots, setTimeslots] = useState<TimeslotClient[]>([]);

	// Context - auth
	const auth = useAuth();
	const { currentUser, token } = auth;

	/*----- Methods -----*/

	// Function - handleInputChange
	const handleInputChange = (name: string, value: string) => {
		// Set datetime
		setDatetime(dayjs(value));
	};

	// Function - handleClickTimeslot
	const handleClickTimeslot = (timeslot: TimeslotClient) => {
		// Callback
		onChange(dayjs(timeslot.time).format('YYYY-MM-DD HH:mm:ss'));
	};

	/*----- Lifecycle -----*/

	// Watch -
	useEffect(() => {
		// If missing inputs...
		if (
			!currentUser ||
			!inputValueTeam ||
			!inputValueRegion ||
			!inputValueDuration
		) {
			// Return
			return;
		}

		// If no change...
		if (
			team.current === inputValueTeam &&
			region.current === inputValueRegion &&
			duration.current === inputValueDuration
		) {
			// Return
			return;
		}

		

		// Function - fetchTimeslots
		const fetchTimeslots = async () => {
			// Is fetching
			setIsFetching(true);

			// Fetch timeslots (passing did and params: team, region, duration)
			const response = await fetch(
				`/api/timeslots/${datetime.format('YYYY-MM-DD')}`,
				{
					method: 'POST',
					body: JSON.stringify({
						team: inputValueTeam,
						region: inputValueRegion,
						duration: inputValueDuration,
					}),
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
				}
			);

			// If success...
			if (response.ok) {
				// Get responseJson
				const responseJson = await response.json();

				// Set timeslots
				setTimeslots(responseJson.timeslots);
			} else {
			}

			// Is not fetching
			setIsFetching(false);
		};
		fetchTimeslots();
	}, [
		currentUser,
		datetime,
		inputValueDuration,
		inputValueRegion,
		inputValueTeam,
		token,
	]);

	/*----- Init -----*/

	// Return default
	return (
		<div className={classNames(`input`, className)} data-name={name}>
			<input className="input__input" ref={inputEl} type="hidden" />
			{isFetching ? (
				<MessageRestricted code={'restricted/timeout'} />
			) : (
				<div className="input rounded-md p-6 space-y-6 bg-gray-100">
					<h3 className="input__title text-base font-semibold leading-7 text-gray-900">
						{`Available ${strCapitalize(names.timeslots)} for ${datetime.format(
							'dddd, MMMM Do'
						)}:`}{' '}
					</h3>

					<div className="inout__datetime">
						<InputDate
							ref={inputDatetimeEl}
							label="Start Date / Time"
							name="date"
							id="date"
							defaultValue={datetime.format('YYYY-MM-DD')}
							onChange={handleInputChange}
						/>
					</div>

					<ul className="input__list grid gird-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
						{timeslots?.length === 0 ? (
							<>No timeslots remaining today</>
						) : (
							<>
								{timeslots.length > 0 && (
									<>
										{timeslots.map((timeslot, t) => (
											<li key={`input__item form-event-edit-timeslot-${t}`}>
												<button
													className="input__button flex justify-center items-center w-full border rounded-md px-3 py-2 font-semibold text-sm shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 bg-transparrent bg-white text-black lg:hover:bg-blue-500 lg:hover:border-blue-500 lg:hover:text-white focus-visible:outline-blue-600"
													onClick={() => {
														handleClickTimeslot(timeslot);
													}}
												>
													{dayjs(timeslot.time).format('h:mm A')}
												</button>
											</li>
										))}
									</>
								)}
							</>
						)}
					</ul>
				</div>
			)}
		</div>
	);
}
