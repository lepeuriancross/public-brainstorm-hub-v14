// Component: Example
/*----------------------------------------------------------------------------------------------------*/

'use client';

/*---------- Imports ----------*/

// Config
// ...

// Scripts (node)
// ...

// Scripts (local)
import { classNames, strCapitalize } from '@/lib/utils';
import { useAuth } from '@/components/base/TheProviderAuth';

// Components (node)
import Link from 'next/link';
import Image from 'next/image';

// Components (local)
// ...

/*---------- Static Data ----------*/

// Name
const name = 'Example';

/*---------- Template ----------*/

// Types
export type ExampleProps = {
	className?: string;
};

export default function Example(props: ExampleProps) {
	/*----- Props -----*/

	// Get props
	const { className } = props;

	/*----- Store -----*/

	// Context - auth
	const auth = useAuth();

	/*----- Methods -----*/

	// Function - handleClickLogin
	const handleClickLogin = async (
		e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
	) => {
		// Prevent default action
		e.preventDefault();

		// Show modal
		auth.showModal(true);
	};

	// Function - handleClickLogout
	const handleClickLogout = async (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		// Prevent default action
		e.preventDefault();

		// Log out
		auth.logout().catch((error) => {
			// Log error
			console.error(error);
		});
	};

	/*----- Init -----*/

	// If user is logged out
	if (!auth.currentUser) {
		// Return logged in
		return (
			<Link
				href="/auth"
				className={classNames(`button`, className)}
				onClick={handleClickLogin}
			>
				Log in{' '}
				<span className="hidden lg:inline-block" aria-hidden="true">
					&rarr;
				</span>
			</Link>
		);
	}

	// Return default
	return (
		<div
			className={classNames(`button flex items-center space-x-4`, className)}
		>
			<div className="button__col flex flex-col justify-center items-start text-left lg:items-end lg:text-right">
				<p>{auth?.currentUser?.displayName ?? 'Welcome'}</p>
				<button
					className="font-normal text-xs lg:hover:underline"
					type="button"
					data-name={name}
					onClick={handleClickLogout}
				>
					Log out
				</button>
			</div>
			<div className="button__col flex flex-col justify-center items-start">
				<div className="button__icon relative inline-block w-9 h-9 rounded-full bg-current bg-gray-50">
					{auth?.currentUser?.photoURL && (
						<Image
							className="button__icon absolute z-10 top-0 left-0 w-full h-full rounded-full object-cover inline-block"
							src={auth.currentUser.photoURL}
							width={300}
							height={300}
							alt=""
						/>
					)}
					<button
						className={classNames(
							`button__icon-role absolute z-20 bottom-0 right-0 inline-block rounded-full w-2.5 h-2.5 group`,
							auth?.currentUserData?.role === 'admin'
								? 'bg-admin'
								: auth?.currentUserData?.role === 'moderator'
								? 'bg-moderator'
								: auth?.currentUserData?.role === 'user'
								? 'bg-user'
								: 'bg-transparent'
						)}
						type="button"
					>
						<span
							className={classNames(
								`sr-only absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/3 inline-block rounded-full text-xs font-medium shadow text-white`,
								auth?.currentUserData?.role === 'admin'
									? 'bg-admin lg:group-hover:not-sr-only'
									: auth?.currentUserData?.role === 'moderator'
									? 'bg-moderator lg:group-hover:not-sr-only'
									: auth?.currentUserData?.role === 'user'
									? 'bg-user lg:group-hover:not-sr-only'
									: 'bg-transparent'
							)}
						>
							<p className="inline-block px-2 py-1">
								{strCapitalize(auth?.currentUserData?.role ?? 'guest')}
							</p>
						</span>
					</button>
				</div>
			</div>
		</div>
	);
}
