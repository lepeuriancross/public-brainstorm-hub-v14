// Component: BadgePlatform
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
import Link from 'next/link';

// Components (local)
// ...

/*---------- Static Data ----------*/

// Name
const name = 'BadgePlatform';

/*---------- Template ----------*/

// Types
export type BadgePlatformProps = {
	id: string;
	className?: string;
	style?: React.CSSProperties;
};

export default function BadgePlatform(props: BadgePlatformProps) {
	/*----- Props -----*/

	// Get props
	const { id, className, style } = props;

	/*----- Store -----*/

	// Context - useCalendar
	const { platforms } = useCalendar();

	/*----- Init -----*/

	// If no platforms, return null
	if (!platforms || platforms.length <= 0) return null;

	// If object in platforms with .id matches id, return platform
	const platform = platforms.find((platform) => platform.id === id);

	// Return default
	return (
		<p
			className={classNames(`badge inline-block`, className)}
			style={style}
			data-name={name}
		>
			{!platform || !platform.teamsUrl ? (
				<span className="badge__loading animate-pulse">...</span>
			) : (
				<Link
					className="badge__label inline-flex justify-start items-center space-x-2 underline lg:hover:text-blue-600"
					href={platform.teamsUrl}
					target="_blank"
				>
					{platform.name} (opens teams)
				</Link>
			)}
		</p>
	);
}
