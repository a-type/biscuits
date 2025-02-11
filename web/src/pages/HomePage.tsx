import { UserMenu } from '@/components/auth/UserMenu.js';
import { Footer } from '@/components/help/Footer.jsx';
import { AppDemo } from '@/components/promo/AppDemo.jsx';
import { Box, P, PageFixedArea } from '@a-type/ui';
import { Link } from '@verdant-web/react-router';
import classNames from 'classnames';
import { Suspense, lazy } from 'react';

const Paws = lazy(() => import('@/components/paws/Paws.jsx'));

export default function HomePage() {
	return (
		<>
			<Box d="col" items="center" p className="w-full flex-1 bg-white">
				{/* <Background /> */}

				<Box className="w-full z-1" d="col" items="center">
					<PageFixedArea className="bg-transparent flex flex-row justify-between items-center py-2 max-w-800px">
						<h1
							className={classNames(
								'text-2xl sm:text-4xl m-0 font-bold text-gray-9 text-shadow',
								'bg-white p-2 rounded-lg leading-none',
							)}
						>
							Biscuits
						</h1>
						<Suspense>
							<UserMenu />
						</Suspense>
					</PageFixedArea>
				</Box>
				<Box d="col" className="z-1">
					<Box
						d="col"
						gap="xl"
						items="stretch"
						className="flex-grow max-w-800px"
					>
						<div
							className={classNames(
								'text-lg sm:text-xl text-gray-7 mt-0 block font-light mx-sm leading-none italic font-fancy',
							)}
						>
							Scratch-made apps to organize your life
						</div>
						<AppDemo className="[flex:2_0_0]" />
						<Box
							d="col"
							gap
							className="min-h-[30dvh] sm:mt-5 text-primary-dark font-semibold [flex:1_0_0]"
						>
							<P className="text-black text-lg leading-loose font-normal mb-4">
								Biscuits' <em className="font-fancy">local-first</em> apps are
								designed to make your life easier. Free to use forever, no ads,
								no tracking. <Link to="/about">Learn how</Link>.
							</P>
							<P className="text-black leading-loose font-normal">
								No signup needed. No need to open the App Store. These are
								instant web apps, no installation required. Just click
								&quot;Open app&quot; to get started.
							</P>
						</Box>
					</Box>
				</Box>
				<Box className="w-full z-1 mt-300px" d="col" items="center">
					<Footer className="max-w-800px" />
				</Box>
			</Box>
			<Suspense>
				<Paws />
			</Suspense>
		</>
	);
}

function Background() {
	// a wavy 2-bump blob in the upper right corner
	return (
		<svg
			viewBox="0 0 100 100"
			preserveAspectRatio="none"
			className="absolute top-0 right-0 w-1/2 h-3/4 pointer-events-none"
		>
			<path
				d={`M 5.4313104,-0.52988403
          C 2.6857268,13.963806 6.556268,28.813172 20.665477,35.369759
          c 14.109208,6.556587 28.71589,-4.334327 40.138713,5.166369 11.422824,9.500696 -0.04547,17.716434 5.50578,29.604545 6.792338,14.54591 13.568365,19.601822 34.23552,25.635865
          l -0.52988,-95.90900901
          z`}
				className="fill-primary-light opacity-20"
			/>
		</svg>
	);
}
