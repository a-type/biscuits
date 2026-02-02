import { UserMenu } from '@/components/auth/UserMenu.js';
import { Footer } from '@/components/help/Footer.jsx';
import { AppGrid } from '@/components/promo/AppGrid.jsx';
import { LazyScroll } from '@/components/promo/LazyScroll.jsx';
import { Box, Button, H2, Icon, P, PageFixedArea } from '@a-type/ui';
import { visibleApps } from '@biscuits/apps';
import { Link } from '@verdant-web/react-router';
import classNames from 'classnames';
import { Suspense, lazy } from 'react';

const Paws = lazy(() => import('@/components/paws/Paws.jsx'));

export default function HomePage() {
	return (
		<Box
			full
			col
			gap
			p={{ default: 'xs', lg: 'sm' }}
			className="bg-primary-wash bg-darken-2"
		>
			<Box
				col
				items="center"
				p
				gap="xl"
				className="w-full flex-1 rounded-lg shadow-sm bg-white"
			>
				<Box className="z-1 w-full" col items="center">
					<PageFixedArea className="flex flex-col justify-stretch py-2 bg-transparent md:max-w-800px sm:flex-row sm:items-center sm:justify-between">
						<Box gap>
							<img
								src="/icon.png"
								alt="The Biscuits logo: an outlined 'B' with two cat paws overlaid"
								className="h-8 w-8 border-1 rounded-xs border-solid border-primary-dark"
							/>
							<h1
								className={classNames(
									'm-0 text-md font-semibold color-primary-ink color-darken-1',
									'rounded-lg p-2 leading-none bg-white',
								)}
							>
								Biscuits
							</h1>
						</Box>
						<Suspense>
							<UserMenu />
						</Suspense>
					</PageFixedArea>
				</Box>
				<Box col className="z-1 w-full" items="center" gap="xl">
					<Box
						col
						gap="xl"
						items="stretch"
						className="max-w-100vw flex-grow md:max-w-800px"
					>
						<div
							className={classNames(
								'font-fancy mx-sm mt-0 block text-10vmin leading-none color-black',
							)}
						>
							Made for you
							<br />
							&amp; yours
						</div>
						<Box
							col
							gap
							className="[flex:1_0_0] font-semibold color-primary-dark sm:mt-5"
						>
							<P className="mb-4 text-lg font-300 leading-relaxed color-gray-dark">
								Biscuits' <em className="font-fancy font-300">local-first</em>{' '}
								apps are designed to make life easier for you and your family.
								Free to use forever, no ads, no tracking.
							</P>
						</Box>
					</Box>
					<AppGrid />
					<Box className="max-w-100vw md:max-w-800px" col gap items="start">
						<P className="font-300 leading-loose color-gray-dark">
							No signup needed. No need to open the App Store. These are instant
							web apps, no installation required. Just click &quot;Open
							app&quot; to get started.
						</P>
					</Box>
					<Box
						p
						surface
						color="accent"
						className="theme max-w-90vw lg:max-w-800px"
						col
						gap
						items="start"
						container="reset"
						border
					>
						<H2 className="font-fancy font-semibold">Family Plan</H2>
						<P className="font-fancy font-300 italic">
							One subscription, every Biscuits app.
						</P>
						<LazyScroll>
							{visibleApps
								.map((app) =>
									app.paidFeatures.map((f) => f.imageUrl).filter(Boolean),
								)
								.flat()
								.map((url) => (
									<img
										key={url}
										src={url}
										alt=""
										className="h-full w-auto rounded-md"
									/>
								))}
						</LazyScroll>
						<P>
							Biscuits apps are free forever, but with the Family Plan you can
							share all your data with up to 3 other people. Plus, you get
							access to special features in every app.
						</P>
						<Button
							render={<Link to="/join" />}
							emphasis="primary"
							className="ml-auto"
						>
							Learn more <Icon name="arrowRight" />
						</Button>
					</Box>
					<Box
						className="max-w-100vw pb-xl md:max-w-800px"
						col
						gap
						items="start"
					>
						<H2 className="font-fancy font-semibold">
							What is <em className="font-fancy font-light">local-first?</em>
						</H2>
						<P>
							Local-first is kind of like how software used to work, only with a
							modern twist. Instead of relying on the cloud or mandating a user
							account, apps just download and run on your device for free. You
							don't even need to be online.
						</P>
						<P>
							Using cutting-edge technology, local-first extends this
							traditional model to incorporate seamless syncing between devices
							and live collaboration with others, like you'd expect with a cloud
							service like Google Docs. Biscuits apps support these extra
							features with a reasonably-priced plan.
						</P>
						<Link
							to="/about"
							className="ml-auto inline-flex items-center gap-sm"
						>
							Learn more <Icon name="new_window" />
						</Link>
					</Box>
				</Box>
			</Box>
			<Box className="z-1 mt-xl w-full" p="sm" col items="center">
				<Footer className="max-w-100vw md:max-w-800px" />
			</Box>
			<Suspense>
				<Paws />
			</Suspense>
		</Box>
	);
}
