import { UserMenu } from '@/components/auth/UserMenu.js';
import { Footer } from '@/components/help/Footer.jsx';
import { AppGrid } from '@/components/promo/AppGrid.jsx';
import { LazyScroll } from '@/components/promo/LazyScroll.jsx';
import { Box, Button, clsx, Heading, Icon, P, PageFixedArea } from '@a-type/ui';
import { visibleApps } from '@biscuits/apps';
import { Link } from '@biscuits/client';
import classNames from 'classnames';
import { lazy, Suspense } from 'react';
import cls from './HomePage.module.css';

const Paws = lazy(() => import('@/components/paws/Paws.jsx'));

export default function HomePage() {
	return (
		<Box
			full
			col
			gap
			p="sm"
			round={false}
			surface="secondary"
			className={cls.bg}
		>
			<Box
				col
				items="center"
				p
				gap="xl"
				full="width"
				round
				className={cls.main}
			>
				<Box
					full="width"
					className={cls.nav}
					render={<nav />}
					col
					items="center"
				>
					<PageFixedArea className={clsx('@mode-dense', cls.navFixed)}>
						<Box gap items="center">
							<img
								src="/icon.png"
								alt="The Biscuits logo: an outlined 'B' with two cat paws overlaid"
								className={cls.logo}
							/>
							<h1 className={cls.navTitle}>Biscuits</h1>
						</Box>
						<Suspense>
							<UserMenu />
						</Suspense>
					</PageFixedArea>
				</Box>
				<Box col full="width" items="center" gap="xl" style={{ zIndex: 1 }}>
					<Box
						col
						gap="lg"
						items="stretch"
						className={clsx('@mode-hero', cls.hero, cls.section)}
					>
						<div className={classNames('font-fancy', cls.heroTagline)}>
							Made for you
							<br /> &amp; yours
						</div>
						<Box col gap>
							<P className={cls.heroDescription}>
								Biscuits'{' '}
								<em className={clsx('font-fancy', cls.emphasis)}>
									local-first
								</em>{' '}
								apps are designed to make life easier for you and your family.
								Free to use forever, no ads, no tracking.
							</P>
						</Box>
					</Box>
					<AppGrid />
					<Box
						className={clsx(cls.section, cls.heroDescription)}
						col
						gap
						items="start"
						render={<P />}
					>
						No signup needed. No need to open the App Store. These are instant
						web apps, no installation required. Just click &quot;Open app&quot;
						to get started.
					</Box>
					<Box
						p
						surface="secondary"
						color="accent"
						className={cls.section}
						col
						gap
						items="start"
						border
					>
						<Heading emphasis="secondary" className="font-fancy">
							Family Plan
						</Heading>
						<P className={clsx('font-fancy', cls.emphasis)}>
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
										className={cls.carouselImage}
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
							style={{ marginLeft: 'auto' }}
						>
							Learn more <Icon name="arrowRight" />
						</Button>
					</Box>
					<Box className={cls.section} col gap items="start">
						<Heading emphasis="secondary" className="font-fancy">
							What is <em className={cls.emphasis}>local-first?</em>
						</Heading>
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
						<Link to="/about" className={cls.learnMore}>
							Learn more <Icon name="new_window" />
						</Link>
					</Box>
				</Box>
			</Box>
			<Box
				className={clsx('@mode-dense', cls.footer, cls.section)}
				p="xl"
				col
				full="width"
				items="center"
			>
				<Footer />
			</Box>
			<Suspense>
				<Paws />
			</Suspense>
		</Box>
	);
}
