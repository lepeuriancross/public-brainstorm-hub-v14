// Component: ButtonUid
/*----------------------------------------------------------------------------------------------------*/

'use client';

/*---------- Imports ----------*/

// Config
// ...

// Scripts (node)
import { useState, useEffect } from 'react';

// Scripts (local)
import { classNames } from '@/lib/utils';

// Components (node)
import { ClipboardIcon, CheckIcon } from '@heroicons/react/24/outline';

// Components (local)
// ...

/*---------- Static Data ----------*/

// Name
const name = 'ButtonUid';

/*---------- Template ----------*/

// Types
export type ButtonUidProps = {
	uid: string;
	className?: string;
};

export default function ButtonUid(props: ButtonUidProps) {
	/*----- Props -----*/

	// Get props
	const { uid, className } = props;

	/*----- Store -----*/

	// State - isCopied
	const [isCopied, setIsCopied] = useState<boolean>(false);

	/*----- Methods -----*/

	// Function - copyUid
	function copyUid() {
		// If not copied...
		if (!isCopied) {
			// Copy uid to clipboard
			navigator.clipboard.writeText(uid);

			// Is copied
			setIsCopied(true);
		}
	}

	/*----- Lifecycle -----*/

	// Watch - isCopied
	useEffect(() => {
		// If isCopied...
		if (isCopied) {
			// Set timeout
			const timeout = setTimeout(() => {
				// Not copied
				setIsCopied(false);
			}, 1000);

			// Return cleanup
			return () => {
				// Clear timeout
				clearTimeout(timeout);
			};
		}
	}, [isCopied]);

	/*----- Init -----*/

	// Return default
	return (
		<button
			className={classNames(
				`font-normal inline-flex justify-center items-center space-x-2 text-xs opacity-50 md:text-xs`,
				className
			)}
			type="button"
			onClick={copyUid}
		>
			{!isCopied ? (
				<>
					<ClipboardIcon className="w-4 h-4" />
					<span>UID: {uid}</span>
				</>
			) : (
				<>
					<CheckIcon className="w-4 h-4" />
					<span>Copied!</span>
				</>
			)}
		</button>
	);
}
