import { Footer } from '@/components/help/Footer.jsx';
import { Button, H1, H2, P, PageContent, PageRoot } from '@a-type/ui';
import { Link } from '@verdant-web/react-router';

export interface AboutPageProps {}

export function AboutPage({}: AboutPageProps) {
	return (
		<PageRoot>
			<PageContent>
				<div className="flex flex-col gap-8">
					<H1>What is Biscuits, anyway?</H1>
					<P>
						Biscuits is a collection of small, scratch-made apps designed to
						make your life easier. They&apos;re free to use forever, with no ads
						or tracking.
					</P>
					<P>
						You may have noticed how a lot of apps on the internet are getting
						worse over time. Seems like if something on the internet is free,
						it&apos;s exploiting us in some way... selling our data, loading up
						the page with ads, or (lately) gradually rolling back features
						behind subscriptions.
					</P>
					<P>
						Biscuits is designed differently from most other web apps. It&apos;s
						something called &quot;local-first,&quot; which basically means that
						even though you access these apps through the internet, they run on
						your device - not my servers. That makes it easier for me to keep
						costs down. And, importantly, it means &quot;free forever&quot; is
						actually sustainable. Biscuits apps are software you download
						through your browser, but they run on your device, and your data
						stays on your device, too.
					</P>
					<H2>Why are some things free, and others paid?</H2>
					<P>
						I&apos;ve tried to design Biscuits paid features to make sense, and
						make as much available for free as possible. The way it works out is
						basically this: anything that runs on your phone or laptop alone is
						free forever. Anything that requires use of the servers I maintain
						is part of the paid membership.
					</P>
					<P>
						I&apos;m not gonna lie and say I won&apos;t try to convince you to
						purchase a subscription to Biscuits apps. There&apos;s a lot of cool
						features that require a server, including big ones like device sync
						and collaboration with other people! But while you&apos;ll see the
						occasional upsell around these kinds of features, I hope you&apos;ll
						find the core free functionality satisfying and useful. I also hope
						it helps to know that those features will always be available to
						you. I&apos;m not going to put them behind a paywall for no reason.
					</P>
					<P>
						The modern internet has conditioned us to expect a bait-and-switch
						at some point, but it&apos;s not coming. It&apos;s fine with me if
						you never upgrade. I&apos;ll always try to keep it crystal clear
						what value membership provides and what you&apos;re always entitled
						to as a free user.
					</P>
					<H2>Why these apps?</H2>
					<P>
						Honestly, I&apos;m making Biscuits for me first! All the apps I make
						are ones I want to use in my own life. You may find them relevant,
						you may not. But hopefully at least some of them are useful to you -
						maybe even enough to join as a member?
					</P>
					<H2>Why &quot;Biscuits?&quot;</H2>
					<P>
						Biscuits was a throwaway name that kinda stuck. It has a few things
						going for it:
						<ul>
							<li>I live in Raleigh, NC; biscuits are a big deal here.</li>
							<li>
								I&apos;m a cat person, so I liked the imagery of cats
								&quot;making biscuits&quot;
							</li>
							<li>
								In the UK, &quot;biscuits&quot; are cookies, which is fun.
							</li>
							<li>Basically there&apos;s a lot of good associations.</li>
						</ul>
					</P>
					<P>Here&apos;s my own cat, Pashka, as a gift for reading all this:</P>
					<img
						className="w-full"
						src="https://resources.biscuits.club/images/pashka.jpg"
						alt="Pashka the cat"
					/>
					<Button asChild className="self-start" emphasis="primary">
						<Link to="/">Go home</Link>
					</Button>
				</div>
				<Footer />
			</PageContent>
		</PageRoot>
	);
}

export default AboutPage;
