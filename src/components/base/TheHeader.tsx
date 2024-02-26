// Component: TheHeader
/*----------------------------------------------------------------------------------------------------*/

'use client';

/*---------- Imports ----------*/

// Config
import { staticNavHeader as navigation } from '@/data/content';

// Scripts (node)
import { useState } from 'react';
import { usePathname } from 'next/navigation';

// Scripts (local)
import { classNames } from '@/lib/utils';

// Components (node)
import Link from 'next/link';
import { Dialog } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

// Components (local)
import LogoMain from '@/components/singles/Logo/LogoMain';
import ButtonAuth from '@/components/singles/Button/ButtonAuth';

/*---------- Static Data ----------*/

// Name
const name = 'TheHeader';

/*---------- Template ----------*/

// Types
export type TheHeaderProps = {
	className?: string;
};

// Default component
export default function TheHeader(props: TheHeaderProps) {
	/*----- Props -----*/

	// Get props
	const { className } = props;

	// Get pathname
	const pathname = usePathname();

	/*----- Store -----*/

	// State - mobileMenuOpen
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	/*----- Init -----*/

	// Return default
	return (
		<>
			<header
				className={classNames(
					`header sticky z-20 top-0 w-full shadow bg-white`,
					className
				)}
				data-name={name}
			>
				<div className="header__container relative z-10 flex justify-center items-center h-[80px] px-6 lg:px-8">
					<nav
						className="header__container-inner flex items-center justify-between w-full mx-auto"
						aria-label="Global"
					>
						<div className="flex lg:flex-1">
							<Link href="/" className="-m-1.5 p-1.5">
								<LogoMain />
							</Link>
						</div>
						<div className="flex lg:hidden">
							<button
								type="button"
								className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
								onClick={() => setMobileMenuOpen(true)}
							>
								<span className="sr-only">Open main menu</span>
								<Bars3Icon className="h-6 w-6" aria-hidden="true" />
							</button>
						</div>
						<div className="hidden lg:flex lg:gap-x-12">
							{navigation.map((item) => (
								<Link
									key={`the-header-link-desktop-${item.name}`}
									href={item.href}
									target={item.target ?? '_self'}
									className="text-sm font-semibold leading-6 text-gray-900"
								>
									{item.name}
								</Link>
							))}
						</div>
						<div className="hidden lg:flex lg:flex-1 lg:justify-end">
							<ButtonAuth className="text-sm font-semibold leading-6 text-gray-900" />
						</div>
					</nav>
				</div>
			</header>

			<Dialog as="div" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
				<div className="fixed inset-0 z-10" />
				<Dialog.Panel className="fixed inset-y-0 right-0 z-30 w-full overflow-y-auto px-6 py-6 sm:max-w-sm sm:ring-1 bg-white sm:ring-gray-900/10">
					<div className="flex items-center justify-between">
						<Link href="/" className="-m-1.5 p-1.5">
							<LogoMain />
						</Link>
						<button
							type="button"
							className="-m-2.5 rounded-md p-2.5 text-gray-700"
							onClick={() => setMobileMenuOpen(false)}
						>
							<span className="sr-only">Close menu</span>
							<XMarkIcon className="h-6 w-6" aria-hidden="true" />
						</button>
					</div>
					<div className="mt-6 flow-root">
						<div className="-my-6 divide-y divide-gray-500/10">
							<div className="space-y-2 py-6">
								{navigation.map((item) => (
									<Link
										key={`the-header-link-mobile-${item.name}`}
										href={item.href}
										target={item.target ?? '_self'}
										className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 lg:hover:bg-gray-50"
										onClick={() => setMobileMenuOpen(false)}
									>
										{item.name}
									</Link>
								))}
							</div>
							<div className="py-6">
								<ButtonAuth className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 lg:hover:bg-gray-50" />
							</div>
						</div>
					</div>
				</Dialog.Panel>
			</Dialog>
		</>
	);
}
