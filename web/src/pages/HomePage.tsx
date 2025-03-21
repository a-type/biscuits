import { UserMenu } from '@/components/auth/UserMenu.js';
import { Footer } from '@/components/help/Footer.jsx';
import { AppDemo } from '@/components/promo/AppDemo.jsx';
import { LazyScroll } from '@/components/promo/LazyScroll.jsx';
import { Box, Button, H2, Icon, P, PageFixedArea } from '@a-type/ui';
import { visibleApps } from '@biscuits/apps';
import { Link } from '@verdant-web/react-router';
import classNames from 'classnames';
import { Suspense, lazy } from 'react';

const Paws = lazy(() => import('@/components/paws/Paws.jsx'));

export default function HomePage() {
	return (
		<>
			<Box d="col" items="center" p className="w-full flex-1 bg-white">
				<Box className="w-full z-1" d="col" items="center">
					<PageFixedArea className="bg-transparent flex flex-row justify-between items-center py-2 md:max-w-800px">
						<h1
							className={classNames(
								'text-2xl sm:text-4xl m-0 font-bold color-black text-shadow',
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
				<Box d="col" className="w-full z-1" items="center" gap="xl">
					<Box
						d="col"
						gap="xl"
						items="stretch"
						className="flex-grow max-w-100vw md:max-w-800px"
					>
						<div
							className={classNames(
								'text-lg sm:text-xl color-gray-dark mt-0 block font-light mx-sm leading-none italic font-fancy',
							)}
						>
							Free scratch-made apps to organize your life
						</div>
						<AppDemo className="[flex:2_0_0]" />
						<Box
							d="col"
							gap
							className="sm:mt-5 color-primary-dark font-semibold [flex:1_0_0]"
						>
							<P className="color-black text-lg leading-loose font-300 mb-4">
								Biscuits' <em className="font-fancy font-300">local-first</em>{' '}
								apps are designed to make your life easier. Free to use forever,
								no ads, no tracking. <Link to="/about">Learn how</Link>.
							</P>
							<P className="color-black leading-loose font-300">
								No signup needed. No need to open the App Store. These are
								instant web apps, no installation required. Just click
								&quot;Open app&quot; to get started.
							</P>
						</Box>
					</Box>
					<Box
						p
						surface="primary"
						className="max-w-100vw md:max-w-800px"
						d="col"
						gap
						items="start"
					>
						<H2 className="font-fancy font-semibold">Family Plan</H2>
						<P className="italic font-fancy font-300">
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
						<Button asChild color="primary">
							<Link to="/join">Join the Family Plan</Link>
						</Button>
					</Box>
					<Box className="max-w-100vw md:max-w-800px" d="col" gap items="start">
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
						<Link to="/about" className="inline-flex items-center gap-sm">
							Learn more <Icon name="new_window" />
						</Link>
					</Box>
				</Box>
				<Box className="w-full z-1 mt-300px" d="col" items="center">
					<Footer className="max-w-100vw md:max-w-800px" />
				</Box>
			</Box>
			<Suspense>
				<Paws />
			</Suspense>
		</>
	);
}
