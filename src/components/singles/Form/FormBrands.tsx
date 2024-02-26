// Component: FormBrands
/*----------------------------------------------------------------------------------------------------*/

'use client';

/*---------- Imports ----------*/

// Config
import { staticBrands } from '@/data/content';

// Scripts (node)
import { useState } from 'react';

// Scripts (local)
import { classNames } from '@/lib/utils';
import { useAuth } from '@/components/base/TheProviderAuth';

// Components (node)
import Image from 'next/image';

// Components (local)
import LinkTeam from '@/components/singles/Link/LinkTeam';

/*---------- Static Data ----------*/

// Name
const name = 'FormBrands';

/*---------- Template ----------*/

// Types
export type FormBrandsProps = {
	className?: string;
};

// Default component
export default function FormBrands(props: FormBrandsProps) {
	/*----- Props -----*/

	// Get props
	const { className } = props;

	/*----- Store -----*/

	// State - brands
	const [brands] = useState(staticBrands);

	// Context - auth
	const auth = useAuth();

	/*----- Lifecycle -----*/

	/*----- Init -----*/

	// Return default
	return (
		<div className={classNames(`form space-y-6`, className)} data-name={name}>
			<div className="form__row space-y-8">
				<div className="form__title flex flex-col justify-between space-y-8 sm:flex-row sm:space-y-0 sm:space-x-6 sm:text-left">
					<h2 className="text-4xl font-bold tracking-tight">Brands</h2>
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
						htmlFor="name"
					>
						Search Brands
					</label>
					<input
						className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
						type="text"
						name="name"
						id="name"
						placeholder="Brand name"
					/>
				</div>
			</div>

			<div className="form__row">
				<ul className="form__list divide-y divide-gray-100" role="list">
					{brands.map((brand) => (
						<li
							className="form__item flex justify-between gap-x-6 py-5"
							key={brand.id}
						>
							<div className="form__item-col flex min-w-0 gap-x-4 text-left">
								{brand.imageUrl && (
									<Image
										className="h-12 w-12 flex-none rounded-full object-contain bg-gray-50"
										src={brand.imageUrl}
										width={500}
										height={500}
										alt=""
									/>
								)}
								<div className="min-w-0 flex flex-col justify-center">
									<p className="text-sm font-semibold leading-6 text-gray-900">
										{brand.name}
									</p>
									{brand.teams && brand.teams.length > 0 && (
										<p className="form__brands mt-1 truncate text-xs leading-5 text-gray-500">
											{brand.teams.map((id) => (
												<>
													<LinkTeam key={`form-brands-team-${id}`} id={id} />
													<span
														key={`form-brands-comma-${id}`}
														className="last:hidden"
													>
														,{' '}
													</span>
												</>
											))}
										</p>
									)}
								</div>
							</div>
							<div className="form__item-col hidden shrink-0 sm:flex sm:flex-col sm:items-end"></div>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}
