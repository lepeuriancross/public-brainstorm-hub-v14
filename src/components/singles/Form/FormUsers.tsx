// Component: FormUsers
/*----------------------------------------------------------------------------------------------------*/

'use client';

/*---------- Imports ----------*/

// Config
import { User } from '@/types';
import names from '@/data/names';

// Scripts (node)
import { useEffect, useRef, useState } from 'react';

// Scripts (local)
import { classNames, strCapitalize } from '@/lib/utils';
import { useAuth } from '@/components/base/TheProviderAuth';

// Components (node)
import Link from 'next/link';
import Image from 'next/image';
import { PencilIcon } from '@heroicons/react/24/outline';

// Components (local)
import MessageRestricted from '@/components/singles/Message/MessageRestricted';

/*---------- Static Data ----------*/

// Name
const name = 'FormUsers';

/*---------- Template ----------*/

// Types
export type FormUsersProps = {
	className?: string;
};

// Default component
export default function FormUsers(props: FormUsersProps) {
	/*----- Props -----*/

	// Get props
	const { className } = props;

	/*----- Refs -----*/

	// Ref - debounceTimer
	const debounceTimer = useRef(-1);

	/*----- Store -----*/

	// State - inputSearch
	const [inputSearch, setInputSearch] = useState<string>('');

	// State - users
	const [users, setUsers] = useState<User[]>([
		// 	{
		// 		uid: '0',
		// 		role: 'admin',
		// 		name: 'Richard Cross',
		// 		email: 'lepeuriancross@gmail.com',
		// 		imageUrl: imgPlaceholderUser.src,
		// 		lastSeen: '3h ago',
		// 		lastSeenDateTime: '2023-01-23T13:23Z',
		// 	},
		// 	{
		// 		uid: '1',
		// 		name: 'Hannah Davies',
		// 		role: 'moderator',
		// 		email: 'richard.cross@global.com',
		// 		imageUrl: imgPlaceholderUser.src,
		// 		lastSeen: '3h ago',
		// 		lastSeenDateTime: '2023-01-23T13:23Z',
		// 	},
		// 	{
		// 		uid: '2',
		// 		name: 'Dries Vincent',
		// 		role: 'user',
		// 		imageUrl: imgPlaceholderUser.src,
		// 		lastSeen: false,
		// 		lastSeenDateTime: false,
		// 	},
	]);

	// Context - auth
	const auth = useAuth();
	const { token } = auth;

	/*----- Methods -----*/

	// Function - handleChangeInput
	const setter = {
		search: setInputSearch,
	};
	const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		// Set value
		setter[e.target.name as keyof typeof setter](e.target.value);
	};

	/*----- Lifecycle -----*/

	// Watch - inputSearch
	useEffect(() => {
		// If no token...
		if (!token) {
			// Return
			return;
		}

		// Declare debounceTimer interval
		let interval: NodeJS.Timeout | undefined;

		// Function - fetchUsers
		const fetchUsers = async () => {
			// If inputSearch...
			if (inputSearch !== '') {
				// Fetch users (passing authToken)
				const response = await fetch(`/api/users?search=${inputSearch}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});

				// If success...
				if (response.ok) {
					const usersJson = await response.json();
					if (usersJson && usersJson.length > 0) {
						// Set users
						setUsers(usersJson);
					}
				}
			}
		};

		// Function - debounceTick
		const debounceTick = () => {
			// If debounceTimer is ticking
			if (debounceTimer.current >= 0) {
				debounceTimer.current--;
			}

			if (debounceTimer.current === 0) {
				// If inputSearch...
				if (inputSearch !== '') {
					// Fetch users
					fetchUsers();
				}
			}
		};

		// If inputSearch...
		if (inputSearch !== '') {
			// Clear debounceTimer interval
			if (debounceTimer) {
				clearInterval(debounceTimer.current);
			}

			// Set debounceTimer interval
			interval = setInterval(() => {
				debounceTick();
			}, 1);

			// Reset debounceTimer
			debounceTimer.current = 300;
		} else {
			// Reset debounceTimer
			debounceTimer.current = -1;
		}

		// Clear users
		setUsers([]);

		// Return cleanup
		return () => {
			// Clear interval
			if (interval) {
				clearInterval(interval);
			}
		};
	}, [inputSearch, token]);

	/*----- Init -----*/

	// If no auth...
	if (!token) {
		// Return restricted access
		return <MessageRestricted code={'restricted/auth/token'} />;
	}

	// Return default
	return (
		<div className={classNames(`form space-y-6`, className)} data-name={name}>
			<div className="form__row space-y-6">
				<div className="form__title flex flex-col justify-between space-y-8 sm:flex-row sm:space-y-0 sm:space-x-6 sm:text-left">
					<h2 className="text-4xl font-bold tracking-tight">Users</h2>
					{auth.role === 'moderator' && (
						<span className="inline-flex justify-center items-center rounded-full px-6 text-sm tracking-normal bg-moderator text-white">
							Moderator
						</span>
					)}
					{auth.role === 'admin' && (
						<span className="inline-flex justify-center items-center rounded-full px-6 py-2 text-sm tracking-normal bg-admin text-white">
							Admin
						</span>
					)}
				</div>
				<div className="form__input rounded-md px-3 pb-1.5 pt-2.5 text-left shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-blue-600">
					<label
						className="form__label block text-xs font-medium text-gray-900"
						htmlFor="search"
					>
						Search users
					</label>
					<input
						className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
						type="text"
						name="search"
						id="search"
						placeholder="Richard Cross"
						onChange={handleChangeInput}
					/>
				</div>
			</div>

			<div className="form__row">
				<ul className="form__list divide-y divide-gray-100" role="list">
					{users.map((user) => (
						<li
							className="form__item flex justify-between gap-x-6 py-5"
							key={user.uid}
						>
							<div className="form__item-col flex min-w-0 gap-x-4 text-left">
								{user.imageUrl && (
									<Image
										className="h-12 w-12 flex-none rounded-full bg-gray-50"
										src={user.imageUrl}
										width={500}
										height={500}
										alt=""
									/>
								)}
								<div className="min-w-0 flex-auto">
									<p className="text-sm font-semibold leading-6 text-gray-900">
										{user.name}
									</p>
									<p className="mt-1 truncate text-xs leading-5 text-gray-500">
										{user.email}
									</p>
								</div>
							</div>

							<div className="form__item-col inline-flex justify-center items-center space-x-4 lg:space-x-8">
								<div className="form__lastseen hidden shrink-0 sm:flex sm:flex-col sm:items-end">
									{user.role && (
										<p className="text-sm leading-6 text-gray-900">
											{strCapitalize(user.role)}
										</p>
									)}
									{user.lastSeen && user.lastSeenDateTime ? (
										<p className="mt-1 text-xs leading-5 text-gray-500">
											Last seen{' '}
											<time dateTime={user.lastSeenDateTime}>
												{user.lastSeen}
											</time>
										</p>
									) : (
										<div className="mt-1 flex items-center gap-x-1.5">
											<div className="flex-none rounded-full bg-emerald-500/20 p-1">
												<div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
											</div>
											<p className="text-xs leading-5 text-gray-500">Online</p>
										</div>
									)}
								</div>
								{((auth.role === 'user' &&
									user.uid === auth.currentUser?.uid) ||
									auth.role === 'moderator' ||
									auth.role === 'admin') && (
									<>
										<Link
											className="inline-flex justify-end items-center lg:hidden"
											href={`/user/${user.uid}?edit=${auth.role}`}
										>
											<button
												className={classNames(
													`form__edit-button relative w-10 h-10 rounded-full transitio-color duration-300 ease-out text-white`,
													auth.role === 'admin'
														? 'bg-admin lg:hover:bg-admin-dark'
														: auth.role === 'moderator'
														? 'bg-moderator lg:hover:bg-moderator-dark'
														: 'bg-user lg:hover:bg-user-dark'
												)}
											>
												<span className="form__edit-button-text sr-only">
													{auth.role === 'admin' || auth.role === 'moderator'
														? `Edit as ${auth.role}`
														: `Edit ${names.user}`}
												</span>
												<PencilIcon className="form__edit-button-icon absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5 h-auto" />
											</button>
										</Link>
										<Link
											className="hidden justify-end items-center lg:inline-flex"
											href={`/user/${user.uid}?edit=${auth.role}`}
										>
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
														: `Edit ${names.user}`}
												</span>
												<PencilIcon className="form__edit-button-icon w-5 h-auto" />
											</button>
										</Link>
									</>
								)}
							</div>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}
