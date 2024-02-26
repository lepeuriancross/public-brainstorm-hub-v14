// Api Route: Fetch Timeslots (by did, team, region, duration)
/*----------------------------------------------------------------------------------------------------*/

/*---------- Imports ----------*/

// Config
import errors from '@/data/errors';
import { Team, Event, EventClient, Timeslot, TimeslotClient } from '@/types';

// Scripts (node)
import { NextRequest, NextResponse } from 'next/server';
import { DecodedIdToken } from 'firebase-admin/auth';
import dayjs from 'dayjs';

// Scripts (local)
import { firestore, auth } from '@/firebase/lib/server';
import {
	filterTeamFetch,
	filterEventFetch,
	filterTimeslotFetch,
} from '@/firebase/lib/filters';

/*---------- Methods ----------*/

// Function - generateTimeslots
const generateTimeslots = (did: string, duration: number) => {
	// Declare timeslots
	const timeslots = [] as Timeslot[];

	// Get number of timeslots
	const numberOfTimeslots = Math.floor(1440 / 10);

	// Loop timeslots
	for (let i = 0; i < numberOfTimeslots; i++) {
		timeslots.push({
			did: did,
			time: dayjs(did)
				.startOf('day')
				.add(i * 10, 'minute')
				.format(),
			duration: duration,
		});
	}

	// Return timeslots
	return timeslots;
};

/*---------- Route ----------*/

// Route
export async function POST(
	request: NextRequest,
	{ params }: { params: { did: string } }
) {
	try {
		// Get body
		const body = await request.json();

		// If no body...
		if (!body || !body.team || !body.region || !body.duration) {
			// Return error - no body
			return new NextResponse(`Internal Server Error`, {
				status: 500,
				statusText: errors['restricted/timeslots/400'],
			});
		}

		// If no firestore...
		if (!firestore) {
			// Return error - no firestore
			return new NextResponse(`Internal Server Error`, {
				status: 500,
				statusText: errors['restricted/firestore/500'],
			});
		}

		// Get authToken
		const authToken =
			request.headers.get('authorization')?.split('Bearer ')[1] || null;

		// Get user token
		let user: DecodedIdToken | null = null;
		if (auth && authToken)
			try {
				// Get user
				user = await auth.verifyIdToken(authToken);
			} catch (error) {
				// Return error - no firestore
				return new NextResponse(`Internal Server Error`, {
					status: 500,
					statusText: errors['restricted/user/500'],
				});
			}

		// Get user access privilages
		const isUser =
			user?.role === 'user' ||
			user?.role === 'moderator' ||
			user?.role === 'admin';
		const isModerator = user?.role === 'moderator' || user?.role === 'admin';
		const isAdmin = user?.role === 'admin';

		// Get team from collection
		const teamResponse = await firestore
			.collection('teams')
			.where('id', '==', body.team)
			.get();

		// If no team...
		if (!teamResponse.docs[0].exists) {
			// Return error - no team
			return new NextResponse(`Internal Server Error`, {
				status: 500,
				statusText: errors['restricted/timeslots-params/404'],
			});
		}

		// Get events from collection (to see which existing events overlap)
		const eventsResponse = await firestore
			.collection('events')
			.where('did', '==', params.did) // <-- only events on this day can overlap other events on this day
			.where('region', '==', body.region) // <-- only events in this region can overlap other events in this region
			.get();

		// Get team data
		const teamData = teamResponse.docs[0].data() as Team;

		// Get events data
		const eventsData =
			eventsResponse.docs.length > 0
				? eventsResponse.docs.map((event) => event.data() as Event)
				: undefined;

		// Get timeslots data, based on duration
		let timeslots = generateTimeslots(params.did, body.duration);

		// Filter team data
		const teamServerData = filterTeamFetch(teamData).data;

		// Filter events data
		const eventsServerData = eventsData?.map((event) => {
			// Filter event
			const filteredEvent = filterEventFetch(event);
			// If not error...
			if (!filteredEvent.error) {
				// Return event
				return filteredEvent.data;
			} else {
				return null;
			}
		}) as EventClient[];

		// Filter timeslots data - create an array of TimeslotClient
		const filteredData = [] as TimeslotClient[];
		timeslots.forEach((timeslot) => {
			// Get filteredTimeslot
			const filteredTimeslot = filterTimeslotFetch(timeslot, {
				did: params.did,
				team: teamServerData,
				events: eventsServerData,
			});
			// If not error...
			if (!filteredTimeslot.error && filteredTimeslot.data) {
				// Add to filteredData
				filteredData.push(filteredTimeslot.data);
			}
		});

		// Return timeslots
		return new NextResponse(
			JSON.stringify({
				message: 'Timeslots fetched successfully',
				timeslots: filteredData,
			}),
			{
				status: 200,
			}
		);
	} catch (error) {
		// Return error - generic
		return new NextResponse('Internal Server Error', { status: 500 });
	}
}
