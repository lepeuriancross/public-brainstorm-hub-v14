// Component: FormEventView
/*----------------------------------------------------------------------------------------------------*/

'use client';

/*---------- Imports ----------*/

// Config
import {
	BrandClient,
	TeamClient,
	RegionClient,
	EventClient,
	Role,
} from '@/types';
import names from '@/data/names';

// Scripts (node)
// ...

// Scripts (local)
import { classNames } from '@/lib/utils';
import { useAuth } from '@/components/base/TheProviderAuth';
import { useCalendar } from '@/components/base/TheProviderCalendar';

// Components (node)
import Link from 'next/link';
import { PencilIcon } from '@heroicons/react/24/solid';

// Components (local)
import MessageRestricted from '@/components/singles/Message/MessageRestricted';
import CardEvent from '@/components/singles/Card/CardEvent';
import FormActivity from './FormActivity';

/*---------- Static Data ----------*/

// Name
const name = 'FormEventView';

/*---------- Template ----------*/

// Types
export type FormEventViewProps = {
	id: string;
	role?: Role;
	className?: string;
};
export type FormEventViewPresenterProps = {
	role?: Role;
	brands?: BrandClient[];
	teams?: TeamClient[];
	regions?: RegionClient[];
	event?: EventClient;
	className?: string;
};

// FormEventView component
export default function FormEventView(props: FormEventViewProps) {
	/*----- Props -----*/

	// Get props
	const { id, role, className } = props;

	/*----- Store -----*/

	// Context - auth
	const auth = useAuth();

	// Context - useCalendar
	const { brands, teams, regions, event, getEvent } = useCalendar();

	/*----- Init -----*/

	// If no auth...
	if (!auth.token || !auth.currentUser) {
		// Return restricted access
		return (
			<MessageRestricted className="grow" code={'restricted/auth/token'} />
		);
	}

	// If no auth, brands, teams or regions...
	if (
		!brands ||
		brands?.length <= 0 ||
		!teams ||
		teams?.length <= 0 ||
		!regions ||
		regions?.length <= 0
	) {
		// Return
		return <MessageRestricted className="grow" code={'restricted/timeout'} />;
	}

	// If no event...
	if (!event) {
		// Return
		return <MessageRestricted code={'restricted/event/404'} />;
	}

	// Presenter props
	const presenterProps: FormEventViewPresenterProps = {
		brands,
		teams,
		regions,
		event,
		role,
		className,
	};

	// Return default
	return <FormEventViewPresenter {...presenterProps} />;
}

// FormEventViewPresenter component
export function FormEventViewPresenter(props: FormEventViewPresenterProps) {
	/*----- Props -----*/

	// Get props
	const { role, brands, teams, regions, event, className } = props;

	/*----- Store -----*/

	// Context - auth
	const auth = useAuth();
	const { token } = auth;

	/*----- Init -----*/

	// If no auth token, brands, teams or regions...
	if (
		!token ||
		!brands ||
		brands?.length <= 0 ||
		!teams ||
		teams?.length <= 0 ||
		!regions ||
		regions?.length <= 0
	) {
		// Return
		return <MessageRestricted className="grow" code={'restricted/timeout'} />;
	}

	// If no event...
	if (!event) {
		// Return
		return <>No event found</>;
	}

	// Return default
	return (
		<div className={classNames(`form`, className)} data-name={name}>
			<div className="form__container space-y-6">
				<CardEvent
					role={role}
					event={event}
					activity={
						<>
							<FormActivity id={event.id} />
						</>
					}
					className="form__card"
				/>
				{((auth.role === 'user' && event.uid === auth.currentUser?.uid) ||
					auth.role === 'moderator' ||
					auth.role === 'admin') && (
					<div className="form__edit flex justify-center items-center border-t pt-6 space-x-4 sm:justify-start">
						<Link href={`/calendar/${event.id}?edit=${auth.role}`}>
							<button
								className={classNames(
									`form__edit-button inline-flex justify-center items-center rounded-md h-10 px-3 py-2 space-x-2 font-semibold text-sm shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 text-white`,
									auth.role === 'admin'
										? 'bg-admin lg:hover:bg-admin-dark focus-visible:outline-admin-dark'
										: auth.role === 'moderator'
										? 'bg-moderator lg:hover:bg-moderator-dark focus-visible:outline-moderator-dark'
										: 'bg-user lg:hover:bg-user-dark focus-visible:outline-user-dark'
								)}
							>
								<span className="form__edit-button-text inline-block">
									{auth.role === 'admin' || auth.role === 'moderator'
										? `Edit as ${auth.role}`
										: `Edit ${names.event}`}
								</span>
								<PencilIcon className="form__edit-button-icon w-5 h-auto" />
							</button>
						</Link>
					</div>
				)}
			</div>
		</div>
	);
}
