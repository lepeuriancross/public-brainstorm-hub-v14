// Component: LayoutIndex
/*----------------------------------------------------------------------------------------------------*/

/*---------- Imports ----------*/

// Config
import { staticMetadata } from '@/data/content';

// Scripts (node)
import type { Metadata } from 'next';

// Scripts (local)
// ...

// Components (node)
// ...

// Components (local)
import TheProviderAuth from '@/components/base/TheProviderAuth';
import ModalAuth from '@/components/singles/Modal/ModalAuth';
import TheHeader from '@/components/base/TheHeader';

// Fonts
import { Inter } from 'next/font/google';

// Styles
import '@/styles/globals.scss';

/*---------- Static Data ----------*/

// Fonts
const inter = Inter({ subsets: ['latin'] });

// Metadata
export const metadata: Metadata = staticMetadata;

/*---------- Template ----------*/

// Types
export type LayoutIndexProps = {
	children: React.ReactNode;
};

// Default component
export default function LayoutIndex({ children }: LayoutIndexProps) {
	/*----- Init -----*/

	// Return default
	return (
		<html lang="en">
			<body className={inter.className}>
				<TheProviderAuth>
					<div
						id="frame"
						className="frame flex w-full min-h-screen flex-col items-center justify-between text-center"
					>
						<ModalAuth className="z-90" />
						<TheHeader className="z-30" />
						<main className="relative flex flex-col z-10 w-full grow">
							{children}
						</main>
					</div>
				</TheProviderAuth>
			</body>
		</html>
	);
}
