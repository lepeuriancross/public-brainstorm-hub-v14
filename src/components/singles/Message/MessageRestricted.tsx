// Component: MessageRestricted
/*----------------------------------------------------------------------------------------------------*/

'use client';

/*---------- Imports ----------*/

// Config
import errorMessages, { ThemeErrorRestricted } from '@/data/errors';

// Scripts (node)
import { useState, useEffect } from 'react';

// Scripts (local)
import { classNames } from '@/lib/utils';

// Components (node)
// ...

// Components (local)
import IconLoading from '@/components/singles/Icon/IconLoading';

/*---------- Static Data ----------*/

// Name
const name = 'MessageRestricted';

/*---------- Template ----------*/

// Types
export type MessageRestrictedProps = {
	code?: ThemeErrorRestricted;
	message?: string;
	className?: string;
};

export default function MessageRestricted(props: MessageRestrictedProps) {
	/*----- Props -----*/

	// Get props
	const { code = 'restricted/forbidden', className } = props;

	/*----- Store -----*/

	// State - showMessage
	const [showMessage, setShowMessage] = useState<boolean>(false);

	/*----- Lifecycle -----*/

	// On mount
	useEffect(() => {
		// Set interval
		const interval = setInterval(() => {
			setShowMessage(true);
		}, 3000);

		// Return clenup
		return () => {
			// Clear interval
			clearInterval(interval);
		};
	}, []);

	/*----- Init -----*/

	// Return default
	return (
		<div className={classNames(`message`, className)} data-name={name}>
			{!showMessage ? <IconLoading /> : <p>{errorMessages[code]}</p>}
		</div>
	);
}
