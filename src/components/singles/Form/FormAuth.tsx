// Component: FormAuth
/*----------------------------------------------------------------------------------------------------*/

'use client';

/*---------- Imports ----------*/

// Config
import { staticMetadata } from '@/data/content';

// Scripts (node)
import { useAuth } from '@/components/base/TheProviderAuth';

// Scripts (local)
import { classNames } from '@/lib/utils';

// Components (node)
import Image from 'next/image';
import { CheckIcon, UserIcon } from '@heroicons/react/24/outline';

// Components (local)
import imgLogoMicrosoft from '../../../../public/img/logo/logo_microsoft.svg';

/*---------- Static Data ----------*/

// Name
const name = 'FormAuth';

/*---------- Template ----------*/

// Types
export type FormAuthProps = {
	isModal?: boolean;
	className?: string;
};

export default function FormAuth(props: FormAuthProps) {
	/*----- Props -----*/

	// Get props
	const { isModal = false, className } = props;

	/*----- Store -----*/

	// Context - auth
	const auth = useAuth();
	const { loginMicrosoft, loginGoogle } = auth;

	/*----- Methods -----*/

	// Function - handleClickLoginMicrosoft
	const handleClickLoginMicrosoft = async (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		// Prevent default action
		e.preventDefault();

		// Log in with Microsoft
		loginMicrosoft()
			.then(() => {
				// Hide modal
				auth.showModal(false);
			})
			.catch((error) => {
				// Log error
				console.error(error);
			});
	};

	// Function - handleClickLoginGoogle
	const handleClickLoginGoogle = async (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		// Prevent default action
		e.preventDefault();

		// Log in with Google
		loginGoogle()
			.then(() => {
				// Hide modal
				auth.showModal(false);
			})
			.catch((error) => {
				// Log error
				console.error(error);
			});
	};

	// Function - handleClickLogout
	const handleClickLogout = async (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		// Prevent default action
		e.preventDefault();

		// Log out
		auth
			.logout()
			.then(() => {
				// Hide modal
				auth.showModal(false);
			})
			.catch((error) => {
				// Log error
				console.error(error);
			});
	};

	/*----- Init -----*/

	// If user is logged in
	if (auth.currentUser) {
		// Return logged in
		return (
			<div className={classNames(`form`, className)} data-name={name}>
				<div className="form__row">
					<div className="form__icon mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
						<CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
					</div>
					<div className="form__intro mt-3 text-center sm:mt-5">
						{isModal ? (
							<h3 className="text-base font-semibold leading-6 text-gray-900">
								You are already logged in to {staticMetadata.title}
							</h3>
						) : (
							<h3 className="text-base font-semibold leading-6 text-gray-900">
								You are already logged in to {staticMetadata.title}
							</h3>
						)}
						<div className="mt-2">
							<p className="text-sm text-gray-500">Click below to sign out</p>
						</div>
					</div>
				</div>
				<div className="form__row mt-5 sm:mt-6">
					<button
						className="form__button inline-flex w-full justify-center rounded-md px-3 py-2 font-semibold text-sm shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 bg-blue-600 text-white lg:hover:bg-blue-500 focus-visible:outline-blue-600"
						type="button"
						onClick={handleClickLogout}
					>
						Log out
					</button>
				</div>
			</div>
		);
	}

	// Return default
	return (
		<div className={classNames(`form`, className)} data-name={name}>
			<div className="form__row">
				<div className="form__icon mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
					<UserIcon className="h-6 w-6 text-blue-600" aria-hidden="true" />
				</div>
				<div className="form__intro mt-3 text-center sm:mt-5">
					{isModal ? (
						<h3 className="text-base font-semibold leading-6 text-gray-900">
							Log in to {staticMetadata.title}
						</h3>
					) : (
						<h3 className="text-base font-semibold leading-6 text-gray-900">
							Log in to {staticMetadata.title}
						</h3>
					)}
					<div className="mt-2">
						<p className="text-sm text-gray-500">
							You need to be logged in to continue.
						</p>
						<p className="text-sm text-gray-500">Sign in or register below</p>
					</div>
				</div>
			</div>
			<div className="form__row mt-5 space-y-3 sm:mt-6">
				<button
					className="form__button flex justify-start items-center space-x-3 min-w-[180px] mx-auto border rounded px-3 py-2"
					type="button"
					onClick={handleClickLoginMicrosoft}
				>
					<Image
						className="form__button-icon w-5 h-5"
						src={imgLogoMicrosoft.src}
						width={imgLogoMicrosoft.width}
						height={imgLogoMicrosoft.height}
						alt=""
					/>
					<span className="form__button-text text-xs font-semibold leading-6 text-gray-900">
						Sign in with Microsoft
					</span>
				</button>
				{/* <button
					className="form__button flex justify-start items-center space-x-3 min-w-[180px] mx-auto border rounded px-3 py-2"
					type="button"
					onClick={handleClickLoginGoogle}
				>
					<svg
						className="form__button-icon w-5 h-5"
						version="1.1"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 48 48"
						xmlnsXlink="http://www.w3.org/1999/xlink"
						style={{ display: 'block' }}
					>
						<path
							fill="#EA4335"
							d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
						></path>
						<path
							fill="#4285F4"
							d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
						></path>
						<path
							fill="#FBBC05"
							d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
						></path>
						<path
							fill="#34A853"
							d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
						></path>
						<path fill="none" d="M0 0h48v48H0z"></path>
					</svg>
					<span className="form__button-text text-xs font-semibold leading-6 text-gray-900">
						Sign in with Google
					</span>
				</button> */}
			</div>
		</div>
	);
}
