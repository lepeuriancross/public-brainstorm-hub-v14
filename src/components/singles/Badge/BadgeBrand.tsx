// Component: BadgeBrand
/*----------------------------------------------------------------------------------------------------*/

/*---------- Imports ----------*/

// Config
// ...

// Scripts (node)
// ...

// Scripts (local)
import { classNames, strGetInitials } from '@/lib/utils';
import { useCalendar } from '@/components/base/TheProviderCalendar';

// Components (node)
import Image from 'next/image';

// Components (local)
import IconLoading from '@/components/singles/Icon/IconLoading';

/*---------- Static Data ----------*/

// Name
const name = 'BadgeBrand';

/*---------- Template ----------*/

// Types
export type BadgeBrandProps = {
	id: string;
	className?: string;
	style?: React.CSSProperties;
};

export default function BadgeBrand(props: BadgeBrandProps) {
	/*----- Props -----*/

	// Get props
	const { id, className, style } = props;

	/*----- Store -----*/

	// Context - useCalendar
	const { brands } = useCalendar();

	/*----- Init -----*/

	// If no brands, return null
	if (!brands || brands.length <= 0) return null;

	// If object in brands with .id matches id, return brand
	const brand = brands.find((brand) => brand.id === id);

	// Return default
	return (
		<div
			className={classNames(
				`badge relative inline-flex justify-center items-center w-16 h-16 p-2 border rounded-full lg:w-20 lg:h-20 bg-white`,
				className
			)}
			style={style}
			data-name={name}
		>
			{!brand ? (
				<IconLoading className={className} />
			) : (
				<>
					{brand.name && (
						<span className="badge__label sr-only">{brand.name}</span>
					)}
					{brand.imageUrl ? (
						<span className="badge__image absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none">
							<Image
								className="badge__img"
								src={brand.imageUrl}
								alt={brand.name}
								width={100}
								height={10}
							/>
						</span>
					) : (
						<span className="badge__text inline-block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
							{strGetInitials(brand.name)}
						</span>
					)}
				</>
			)}
		</div>
	);
}
