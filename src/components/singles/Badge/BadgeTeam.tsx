// Component: BadgeTeam
/*----------------------------------------------------------------------------------------------------*/

/*---------- Imports ----------*/

// Config
// ...

// Scripts (node)
// ...

// Scripts (local)
import { classNames } from '@/lib/utils';
import { useCalendar } from '@/components/base/TheProviderCalendar';

// Components (node)
// ...

// Components (local)
// ...

/*---------- Static Data ----------*/

// Name
const name = 'BadgeTeam';

/*---------- Template ----------*/

// Types
export type BadgeTeamProps = {
	id: string;
	className?: string;
	style?: React.CSSProperties;
};

export default function BadgeTeam(props: BadgeTeamProps) {
	/*----- Props -----*/

	// Get props
	const { id, className, style } = props;

	/*----- Store -----*/

	// Context - useCalendar
	const { teams } = useCalendar();

	/*----- Init -----*/

	// If no teams, return null
	if (!teams || teams.length <= 0) return null;

	// If object in teams with .id matches id, return team
	const team = teams.find((team) => team.id === id);

	// Return default
	return (
		<p
			className={classNames(`badge inline-block`, className)}
			style={style}
			data-name={name}
		>
			{!team ? (
				<span className="badge__loading animate-pulse">...</span>
			) : (
				<span className="badge__label">{team.name}</span>
			)}
		</p>
	);
}
