// Component: CardEvent
/*----------------------------------------------------------------------------------------------------*/

/*---------- Imports ----------*/

// Config
// ...

// Scripts (node)
// ...

// Scripts (local)
import { EventClient, Role } from '@/types';
import { classNames, strCapitalize } from '@/lib/utils';

// Components (node)
import {
	Bars3BottomLeftIcon,
	CalendarIcon,
	ChatBubbleBottomCenterTextIcon,
	ClockIcon,
	GlobeEuropeAfricaIcon,
	MapPinIcon,
	UserIcon,
	UserGroupIcon,
	WrenchScrewdriverIcon,
} from '@heroicons/react/24/solid';

// Components (local)
import ButtonId from '@/components/singles/Button/ButtonId';
import BadgeBrand from '@/components/singles/Badge/BadgeBrand';
import BadgeTeam from '@/components/singles/Badge/BadgeTeam';
import BadgeRegion from '@/components/singles/Badge/BadgeRegion';
import BadgePlatform from '@/components/singles/Badge/BadgePlatform';

/*---------- Static Data ----------*/

// Name
const name = 'CardEvent';

/*---------- Template ----------*/

// Types
export type CardEventProps = {
	role?: Role;
	event?: EventClient;
	activity?: React.ReactNode | false;
	className?: string;
};

export default function CardEvent(props: CardEventProps) {
	/*----- Props -----*/

	// Get props
	const { role, event, activity = false, className } = props;

	/*----- Init -----*/

	// If no event...
	if (!event) {
		// Return
		return <>No event found</>;
	}

	// Return default
	return (
		<div className={classNames(`card`, className)} data-name={name}>
			<div className="card__container space-y-6">
				{/* Heading */}
				<div className="form__row flex flex-col justify-between border-b pb-6 space-y-8 sm:flex-row sm:space-y-0 sm:space-x-6 sm:text-left">
					<div className="form__col space-y-6">
						{event.name && (
							<h2 className="form__title text-4xl font-bold tracking-tight">
								{event.name}
							</h2>
						)}
						{event?.id && (
							<ButtonId id={event.id} className="inline-flex items-center" />
						)}
						<div className="form__datetime flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:space-x-6">
							<div className="form__datetime-date flex justify-center items-center space-x-4 font-semibold sm:justify-start text-gray-900">
								<span className="form__datetime-date-icon">
									<h3 className="form__datetime-date-label sr-only">Date</h3>
									<CalendarIcon className="w-5 h-5 text-gray-400" />
								</span>
								<span className="form__datetime-date-text">
									{strCapitalize(event.date ?? 'TBC')}
								</span>
							</div>
							<div className="form__datetime-time flex justify-center items-center space-x-4 font-semibold sm:justify-start text-gray-900">
								<span className="form__datetime-time-icon">
									<h3 className="form__datetime-time-label sr-only">Time</h3>
									<ClockIcon className="w-5 h-5 text-gray-400" />
								</span>
								<span className="form__datetime-time-text">
									{strCapitalize(event.time ?? 'TBC')}
									{event.timeend && (
										<>
											<span className="text-gray-400 px-2">-</span>
											{event.timeend}
										</>
									)}
								</span>
							</div>
						</div>
					</div>
					<div className="form__col flex flex-col justify-between items-center space-y-4 sm:items-end sm:text-right">
						{event.brands && (
							<div className="form__brands-container flex flex-wrap justify-center items-center gap-2 sm:justify-end md:gap-0 md:-space-x-6">
								{event.brands.map((brand) => (
									<BadgeBrand
										key={`form-event-view-brand-${brand}`}
										id={brand}
									/>
								))}
							</div>
						)}
						{role === 'moderator' && (
							<span className="inline-flex justify-center items-center rounded-full px-6 text-sm tracking-normal bg-moderator text-white">
								Moderator
							</span>
						)}
						{role === 'admin' && (
							<span className="inline-flex justify-center items-center rounded-full px-6 py-2 text-sm tracking-normal bg-admin text-white">
								Admin
							</span>
						)}
					</div>
				</div>

				{/* Info */}
				<div
					className={classNames(
						`form__row grid grid-cols-1 gap-8 lg:gap-12 sm:text-left`,
						activity && 'lg:grid-cols-2'
					)}
				>
					<div className="form__col divide-y">
						{event.creator && (
							<div className="form__host space-y-4 py-6 first:pt-0 last:pb-0">
								<div className="form__host flex justify-center items-center space-x-4 font-bold sm:justify-start">
									<span className="form__host-title-icon">
										<h3 className="form__host-title-label sr-only">Creator</h3>
										<WrenchScrewdriverIcon className="w-5 h-5 text-gray-400" />
									</span>
									<span className="form__host-title-text">
										<span className="hidden sm:inline-block">Created by</span>
										<span className="sm:pl-1">{event.creator}</span>
									</span>
								</div>
							</div>
						)}
						{event.host && (
							<div className="form__host space-y-4 py-6 first:pt-0 last:pb-0">
								<div className="form__host flex justify-center items-center space-x-4 font-bold sm:justify-start">
									<span className="form__host-title-icon">
										<h3 className="form__host-title-label sr-only">Host</h3>
										<UserIcon className="w-5 h-5 text-gray-400" />
									</span>
									<span className="form__host-title-text">
										<span className="hidden sm:inline-block">Hosted by</span>
										<span className="sm:pl-1">{event.host}</span>
									</span>
								</div>
							</div>
						)}
						{event.location && (
							<div className="form__location space-y-4 py-6 first:pt-0 last:pb-0">
								<div className="form__location flex justify-center items-center space-x-4 font-bold sm:justify-start">
									<span className="form__location-title-icon">
										<h3 className="form__location-title-label sr-only">
											Location
										</h3>
										<MapPinIcon className="w-5 h-5 text-gray-400" />
									</span>
									<span className="form__location-title-text">
										{event.location}
									</span>
								</div>
							</div>
						)}
						{event.team && (
							<div className="form__team space-y-4 py-6 first:pt-0 last:pb-0">
								<div className="form__team flex justify-center items-center space-x-4 font-bold sm:justify-start">
									<span className="form__team-title-icon">
										<h3 className="form__team-title-label sr-only">Team</h3>
										<UserGroupIcon className="w-5 h-5 text-gray-400" />
									</span>
									<span className="form__team-title-text">
										<BadgeTeam id={event.team} />
									</span>
								</div>
							</div>
						)}
						{event.region && (
							<div className="form__region space-y-4 py-6 first:pt-0 last:pb-0">
								<div className="form__region-title flex justify-center items-center space-x-4 font-bold sm:justify-start">
									<span className="form__region-title-icon">
										<h3 className="form__region-title-label sr-only">Region</h3>
										<GlobeEuropeAfricaIcon className="w-5 h-5 text-gray-400" />
									</span>
									<span className="form__region-title-text">
										<BadgeRegion id={event.region} />
									</span>
								</div>
							</div>
						)}
						{event.platform && (
							<div className="form__region space-y-4 py-6 first:pt-0 last:pb-0">
								<div className="form__region-title flex justify-center items-center space-x-4 font-bold sm:justify-start">
									<span className="form__region-title-icon">
										<h3 className="form__region-title-label sr-only">
											Platform
										</h3>
										<ChatBubbleBottomCenterTextIcon className="w-5 h-5 text-gray-400" />
									</span>
									<span className="form__region-title-text">
										<BadgePlatform id={event.platform} />
									</span>
								</div>
							</div>
						)}
						{event.about && (
							<div className="form__description space-y-4 py-6 first:pt-0 last:pb-0">
								<div className="form__description-title flex justify-center items-start space-x-4 sm:justify-start">
									<span className="form__description-title-icon">
										<h3 className="form__description-title-label sr-only">
											About
										</h3>
										<Bars3BottomLeftIcon className="w-6 h-6 text-gray-400" />
									</span>
									<p className="form__description-text text-base tracking-normal">
										{event.about}
									</p>
								</div>
							</div>
						)}
					</div>
					{activity && <div className="form__col divide-y">{activity}</div>}
				</div>
			</div>
		</div>
	);
}
