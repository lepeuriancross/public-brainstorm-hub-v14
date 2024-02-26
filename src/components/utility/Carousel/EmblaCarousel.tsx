// Component: EmblaCarousel
/*----------------------------------------------------------------------------------------------------*/

'use client';

/*---------- Imports ----------*/

// Config
// ...

// Scripts (node)
import {
	Children,
	useCallback,
	useEffect,
	useImperativeHandle,
	forwardRef,
} from 'react';
import { EmblaOptionsType } from 'embla-carousel';
import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';

// Scripts (local)
import { classNames } from '@/lib/utils';

// Components (node)
// ...

/*---------- Static Data ----------*/

// Name
const name = 'EmblaCarousel';

/*---------- Template ----------*/

// Types
type EmblaCarouselProps = {
	options?: EmblaOptionsType;
	autoplay?: boolean;
	className?: string;
	classNameSlide?: string;
	children?: React.ReactNode;
	defaultSlide?: number;
	onSelect?: (index: number) => void;
};

// Default component
const EmblaCarousel = (props: EmblaCarouselProps, ref: any) => {
	/*----- Props -----*/

	// Get props
	const {
		options,
		autoplay,
		className = 'overflow-hidden w-full mx-auto flex items-center justify-center',
		classNameSlide = 'relative w-full',
		children,
		defaultSlide = 0,
		onSelect = (index: any) => {},
	} = props;

	/*----- Refs -----*/

	// Ref - emblaRef
	const [emblaRef, emblaApi] = useEmblaCarousel(
		{
			...options,
		},
		[...(autoplay ? [Autoplay()] : [])]
	);

	/*----- Methods -----*/

	// Function - scrollPrev
	const scrollPrev = useCallback(
		() => emblaApi && emblaApi.scrollPrev(),
		[emblaApi]
	);

	// Function - scrollNext
	const scrollNext = useCallback(
		() => emblaApi && emblaApi.scrollNext(),
		[emblaApi]
	);

	// Function - scrollTo
	const scrollTo = useCallback(
		(index: number) => emblaApi && emblaApi.scrollTo(index),
		[emblaApi]
	);

	// Expose custom handles as a ref
	useImperativeHandle(ref, () => ({
		scrollPrev,
		scrollNext,
		scrollTo,
	}));

	/*----- Lifecycle -----*/

	// Watch - scrollTo
	useEffect(() => {
		// If no emblaApi, return
		if (!emblaApi) return;

		// Scroll to default slide
		emblaApi.scrollTo(defaultSlide);
	}, [defaultSlide, emblaApi]);

	// Watch - emblaApi, onSelect, handleSelect
	useEffect(() => {
		// If no emblaApi, return
		if (!emblaApi) return;

		// Event handlers
		emblaApi.on('reInit', () => {
			onSelect(emblaApi.selectedScrollSnap());
		});
		emblaApi.on('select', () => {
			onSelect(emblaApi.selectedScrollSnap());
		});

		// Init
		onSelect(emblaApi.selectedScrollSnap());
	}, [emblaApi, onSelect]);

	/*----- Init -----*/

	// Return default
	return (
		<div
			className={classNames(`embla`, className)}
			ref={emblaRef}
			data-name={name}
		>
			<div className="embla__container flex">
				{Children.map(children, (child, c) => (
					<div
						className={classNames(`embla__slide`, classNameSlide)}
						key={`embla-carousel-slide-${c}`}
					>
						{child}
					</div>
				))}
			</div>
		</div>
	);
};
export default forwardRef(EmblaCarousel);
