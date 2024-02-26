// Component: LogoMain
/*----------------------------------------------------------------------------------------------------*/

/*---------- Imports ----------*/

// Config
import { staticMetadata } from '@/data/content';

// Scripts (node)
// ...

// Scripts (local)
import { classNames } from '@/lib/utils';

// Components (node)
import Image from 'next/image';

// Components (local)
// ...

// Images
import imgLogoMain from '../../../../public/img/logo/logo_main.svg';

/*---------- Static Data ----------*/

// Name
const name = 'LogoMain';

/*---------- Template ----------*/

// Types
export type LogoMainProps = {
	className?: string;
};

export default function LogoMain(props: LogoMainProps) {
	/*----- Props -----*/

	// Get props
	const { className } = props;

	/*----- Init -----*/

	// Return default
	return (
		<div
			className={classNames(`logo inline-block h-8 w-auto`, className)}
			data-name={name}
		>
			<span className="sr-only">{staticMetadata.title}</span>
			<Image
				className="h-full w-auto"
				src={imgLogoMain.src}
				width={imgLogoMain.width}
				height={imgLogoMain.height}
				alt=""
			/>
		</div>
	);
}
