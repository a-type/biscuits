import {
	AppName,
	Background,
	CallToAction,
	Content,
	Demo,
	FeatureSection,
	Footer,
	HeroTitle,
	Highlight,
	Root,
	Section,
	TitleWrap,
} from '@/components/promo/layout.jsx';
import { Button, H2, P } from '@a-type/ui';
import { useLocalStorage, useOnVisible } from '@biscuits/client';
import { Link } from '@verdant-web/react-router';
import classNames from 'classnames';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';

// dynamically import Scene
const Scene = lazy(() => import('@/components/promo/gnocchi/Scene.jsx'));

export function GnocchiPage() {
	const [_, setHasSeen] = useLocalStorage('hasSeenWelcome', true);
	useEffect(() => {
		setHasSeen(true);
	}, []);

	const upgradeSectionRef = useRef<HTMLDivElement>(null);
	const [staticSectionAccent, setStaticSectionAccent] = useState(false);
	useOnVisible(upgradeSectionRef, setStaticSectionAccent, {
		threshold: 0.05,
	});

	return (
		<Root>
			<Background>
				<Suspense>
					<Scene />
				</Suspense>
			</Background>
			<Content className="bg-primary-light">
				<TitleWrap>
					<AppName appId="gnocchi" />
					<HeroTitle>Your weekly cooking, in one place.</HeroTitle>
				</TitleWrap>
				<FeatureSection
					title="How it works"
					items={[
						{
							emoji: '🧾',
							text: 'Copy, paste, or share items directly into the app.',
						},
						{
							emoji: '🏷️',
							text: 'Organize your run by aisle. Gnocchi will remember your categorizations!',
						},
						{
							emoji: '🛒',
							text: 'Get helpful suggestions based on your past purchases.',
						},
					]}
				/>
				<Demo src="/images/gnocchi/list.png" type="image" />
				<Demo
					src="/images/gnocchi/recipes.png"
					type="image"
					direction="right"
				/>
				<FeatureSection
					title="Collect recipes"
					items={[
						{
							emoji: '🔪',
							text: 'Gnocchi is a recipe app, too. You can save recipes from the web, or write your own.',
						},
						{
							emoji: '📝',
							text: 'Edit recipes to your liking. Add notes, change the serving size, or even swap out your own ingredients.',
						},
						{
							emoji: '➕',
							text: 'Add recipe ingredients directly to your grocery list.',
						},
					]}
				/>
				<Section color="white">
					<H2 className="gutter-bottom">Less improv at the grocery store</H2>
					<p>
						If you're like me, you usually leave the grocery store with some
						foods you didn't plan on buying. But you also get home, start
						loading the fridge, and realize you forgot something, too.
					</p>
					<p>
						I built Gnocchi to plan grocery trips better, as a solo shopper or a
						family. It may seem like any old list app, but under the surface
						I've tried to design intentionally for the task at hand. Give it a
						shot this week (no account needed!) and let me know what you think.
					</p>
					<p>&ndash; Grant</p>
				</Section>
				<Demo src="/images/gnocchi/addBar.png" type="image" />
			</Content>
			<Content
				className={classNames(
					'bg-primary border-t-10dvh border-b-20dvh border-solid border-primary-light pt-20dvh',
					'theme-leek',
				)}
				ref={upgradeSectionRef}
			>
				<TitleWrap className="bg-primary-wash border-1 border-solid border-primary-dark rounded-lg p-4">
					<H2 className="[font-size:5vmax] gutter-bottom">
						Upgrade to the world's most collaborative cooking app
					</H2>
					<P>
						Sync your list and recipes to all your devices, share your list with
						anyone you shop with, and coordinate with other chefs while cooking.
					</P>
				</TitleWrap>
				<Highlight src="/images/gnocchi/groceries-collaboration.png" />
				<FeatureSection
					title="Collaborative groceries"
					items={[
						{
							emoji: '☁️',
							text: 'Sync your list and recipes to all your devices.',
						},
						{
							emoji: '👯',
							text: 'Share your list with anyone you shop with.',
						},
						{
							emoji: '📌',
							text: 'In-store collaboration, like claiming sections and planning a place to meet up.',
						},
					]}
				/>
				<Highlight src="/images/gnocchi/recipe-collaboration.png" />
				<FeatureSection
					title="Sous chef mode"
					items={[
						{
							emoji: '🖨️',
							text: 'Scan unlimited web recipes directly to the app to add all the ingredients to your list.',
						},
						{
							emoji: '🧑🏻‍🍳',
							text: "Assign tasks to each chef, and see who's done what.",
						},
					]}
				/>
				<div className="flex flex-row flex-wrap items-center justify-center gap-4 w-full py-8 md:[grid-column-end:span_2]">
					<Button asChild color="primary">
						<Link to="/join">Upgrade now</Link>
					</Button>
					<Button asChild>
						<Link to="/apps">See other included apps</Link>
					</Button>
				</div>
			</Content>
			<Footer className="theme-leek" />
			<CallToAction
				appId="gnocchi"
				className={staticSectionAccent ? 'theme-leek' : undefined}
			/>
		</Root>
	);
}

export default GnocchiPage;
