// Component: TheProviderAuth
/*----------------------------------------------------------------------------------------------------*/

'use client';

/*---------- Imports ----------*/

// Config
import { Role, UserClient } from '@/types';

// Scripts (node)
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import {
	User,
	OAuthProvider,
	GoogleAuthProvider,
	signInWithPopup,
} from 'firebase/auth';
import Cookies from 'js-cookie';

// Scripts (local)
import { auth } from '@/firebase/lib/client';

// Components (node)
// ...

// Components (local)
// ...

/*---------- Static Data ----------*/

// Name
const name = 'TheProviderAuth';

/*---------- Cookies ----------*/

// Function - getAuthToken
export function getAuthToken(): string | undefined {
	// Access the 'Cookies' object from 'js-cookie'
	return Cookies.get('firebaseIdToken');
}

// Function - setAuthToken
export function setAuthToken(token: string): string | undefined {
	// Securely set the 'Cookies' object with 'js-cookie'
	return Cookies.set('firebaseIdToken', token, { secure: true });
}

// Function - removeAithToken
export function removeAuthToken(): void {
	return Cookies.remove('firebaseIdToken');
}

/*---------- Context ----------*/

// Types
export type TheContextAuthProps = {
	currentUser?: User | null;
	currentUserClient?: UserClient | null;
	token: string | null | undefined;
	role: Role;
	isUser: boolean;
	isModerator: boolean;
	isAdmin: boolean;
	isShowingModal: boolean;
	loginMicrosoft: () => Promise<void>;
	loginGoogle: () => Promise<void>;
	logout: () => Promise<void>;
	showModal: (value: boolean) => void;
};

// Context
const TheContextAuth = createContext<TheContextAuthProps>({
	currentUser: null,
	currentUserClient: null,
	token: null,
	role: 'guest',
	isUser: false,
	isModerator: false,
	isAdmin: false,
	isShowingModal: false,
	loginMicrosoft: async () => {},
	loginGoogle: async () => {},
	logout: async () => {},
	showModal: (value: boolean) => {},
});

// Hooks
export const useAuth = () => useContext(TheContextAuth);

/*---------- Template ----------*/

// Types
export type TheProviderAuthProps = {
	children?: React.ReactNode;
};

// Default component
export default function TheProviderAuth(props: TheProviderAuthProps) {
	/*----- Props -----*/

	// Get props
	const { children } = props;

	/*----- Refs -----*/

	// Ref - timeoutCounter
	const timeoutCounter = useRef<number>(0);

	/*----- Store -----*/

	// State - isShowingModal
	const [isShowingModal, setIsShowingModal] = useState<boolean>(false);

	// State - currentUser
	const [currentUser, setCurrentUser] = useState<User | null>(null);

	// State - currentUserClient
	const [currentUserClient, setCurrentUserClient] =
		useState<UserClient | null>();

	// State - token
	const [token, setToken] = useState<string | null | undefined>();

	// State - role
	const [role, setRole] = useState<Role>('guest');

	// State - isUser
	const [isUser, setIsUser] = useState<boolean>(false);

	// State - isModerator
	const [isModerator, setIsModerator] = useState<boolean>(false);

	// State - isAdmin
	const [isAdmin, setIsAdmin] = useState<boolean>(false);

	/*----- Lifecycle -----*/

	// Watch - onAuthStateChanged
	useEffect(() => {
		if (!auth) return;

		// Add event listener - auth state changed
		return auth.onAuthStateChanged(async (user) => {
			// If no user...
			if (!user) {
				// Clear timeout
				timeoutCounter.current = 0;

				// Clear current user
				setCurrentUser(null);
				setCurrentUserClient(null);
				setRole('guest');
				setIsUser(false);
				setIsModerator(false);
				setIsAdmin(false);

				// Remove authToken cookie
				removeAuthToken();
			} else {
				// Get authToken
				try {
					// Get authToken
					const authToken = await user.getIdToken();

					// Set authToken as cookie
					setAuthToken(authToken);

					// Set currentUser
					setCurrentUser(user);
				} catch (error) {
					// Set currentUser
					setCurrentUser(null);
				}
			}
		});
	}, []);

	// Watch - currentUser
	useEffect(() => {
		// Function - checkCalims
		const checkClaims = async () => {
			// If logged in...
			if (currentUser) {
				// If timout...
				if (timeoutCounter.current > 10) {
					// Log error
					console.error('Token Check Fail - time out');

					// Clear interval
					clearInterval(interval);
				}

				// Inc timeoutCounter
				timeoutCounter.current++;

				// Force refresh of token values
				await currentUser.getIdToken(true);

				// Get tokenValues
				const tokenValues = await currentUser.getIdTokenResult();

				// If role...
				if (tokenValues.token && tokenValues.claims.role) {
					// Set token
					setToken(tokenValues.token);

					// Set role
					setRole((tokenValues.claims.role ?? 'guest') as Role);
					setIsUser(
						tokenValues.claims.role === 'admin' ||
							tokenValues.claims.role === 'moderator' ||
							tokenValues.claims.role === 'user'
					);
					setIsModerator(
						tokenValues.claims.role === 'admin' ||
							tokenValues.claims.role === 'moderator'
					);
					setIsAdmin(tokenValues.claims.role === 'admin');

					// Fetch user data (passing authToken)
					const response = await fetch(`/api/users/${currentUser.uid}`, {
						headers: {
							Authorization: `Bearer ${tokenValues.token}`,
						},
					});
					if (response.ok) {
						// Parse json
						const userJson = await response.json();

						// Set currentUserClient
						setCurrentUserClient(userJson);

						// Clear interval
						clearInterval(interval);
					}
				}
			} else {
				// Clear interval
				clearInterval(interval);
			}
		};

		// Set interval
		let interval = setInterval(checkClaims, 1000);

		// Return cleanup
		return () => {
			// Clear interval
			clearInterval(interval);
		};
	}, [currentUser]);

	/*----- Methods -----*/

	// Function - loginMicrosoft
	const loginMicrosoft = () => {
		// Return promise
		return new Promise<void>((resolve, reject) => {
			// If no auth...
			if (!auth) {
				// Reject
				reject();
				return;
			}

			// Get provider
			const provider = new OAuthProvider('microsoft.com');

			// Set custom parameters
			// ...

			signInWithPopup(auth, provider)
				.then((result) => {
					// User is signed in.
					// IdP data available in result.additionalUserInfo.profile.

					// Get the OAuth access token and ID Token
					// const credential = OAuthProvider.credentialFromResult(result);
					// const accessToken = credential.accessToken;
					// const idToken = credential.idToken;

					// Resolve
					resolve();

					// Reload page
					location.reload();
				})
				.catch((error) => {
					// Reject with error
					reject(error);
				});
		});
	};

	// Function - loginGoogle
	const loginGoogle = () => {
		// Return promise
		return new Promise<void>((resolve, reject) => {
			// If no auth...
			if (!auth) {
				// Reject
				reject();
				return;
			}

			// Get provider
			const provider = new GoogleAuthProvider();

			// Set custom parameters
			// ...

			// Sign in with popup
			signInWithPopup(auth, provider)
				.then(() => {
					// Resolve
					resolve();

					// Reload page
					location.reload();
				})
				.catch((error) => {
					// Reject with error
					reject(error);
				});
		});
	};

	// Function - logout
	const logout = () => {
		// Return promise
		return new Promise<void>((resolve, reject) => {
			// If no auth...
			if (!auth) {
				// Reject
				reject();
				return;
			}

			// Sign out
			auth
				.signOut()
				.then(() => {
					// Resolve
					resolve();

					location.reload();
				})
				.catch((error) => {
					// Reject with error
					reject(error);
				});
		});
	};

	// Function - showModal
	const showModal = (value: boolean) => {
		setIsShowingModal(value);
	};

	/*----- Init -----*/

	// Return default
	return (
		<TheContextAuth.Provider
			value={{
				isShowingModal,
				currentUser,
				currentUserClient,
				token,
				role,
				isUser,
				isModerator,
				isAdmin,
				loginMicrosoft,
				loginGoogle,
				logout,
				showModal,
			}}
		>
			{children}
		</TheContextAuth.Provider>
	);
}
