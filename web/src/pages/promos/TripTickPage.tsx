import {
	AppName,
	Background,
	CallToAction,
	Content,
	Demo,
	Description,
	FeatureSection,
	Footer,
	Hero,
	HeroTitle,
	Root,
} from '@/components/promo/layout.jsx';
import classes from './TripTickPage.module.css';

export interface TripTickPageProps {}

export function TripTickPage({}: TripTickPageProps) {
	return (
		<Root className="@mode-eggplant">
			<Background>
				<img
					src="/images/trip-tick/hero1.svg"
					className={classes.backgroundImage}
				/>
			</Background>
			<Content>
				<Hero>
					<AppName appId="trip-tick" />
					<HeroTitle>Never forget your socks again.</HeroTitle>
					<Description>Trip Tick is a smarter packing list.</Description>
				</Hero>
				<FeatureSection
					title="The power of a spreadsheet; the simplicity of your notes app"
					items={[
						{
							emoji: '📝',
							text: 'Stop reinventing the wheel. Make your list once and reuse it every trip.',
						},
						{
							emoji: '🧮',
							text: 'Trip Tick automatically calculates how many of each thing you need to pack based on the length of your trip.',
						},
					]}
				/>
				<Demo src="/images/trip-tick/list.png" type="image" />
				<Demo src="/images/trip-tick/trip.png" type="image" direction="right" />
				<FeatureSection
					title="Check off as you go"
					items={[
						{
							emoji: '😌',
							text: "Ever go through a packed bag again to make sure you packed your charger? Enjoy the peace of mind knowing, yup, it's checked off.",
						},
						{
							emoji: '🌧️',
							text: 'See the weather forecast for your destination during your trip. You can even configure items based on weather!',
							premium: true,
						},
						{
							emoji: '👨‍👩‍👧',
							text: 'Subscribers share lists and trip progress with other members of their plan.',
							premium: true,
						},
					]}
				/>
			</Content>
			<Footer />
			<CallToAction appId="trip-tick" />
		</Root>
	);
}

export default TripTickPage;
