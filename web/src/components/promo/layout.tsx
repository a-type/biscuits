import {
	Box,
	Button,
	clsx,
	H2,
	Icon,
	withClassName,
	withProps,
} from '@a-type/ui';
import { AppId, appsById } from '@biscuits/apps';
import { Link } from '@biscuits/client';
import { CSSProperties, forwardRef, ReactNode } from 'react';
import PhoneDemo from './PhoneDemo.jsx';
import classes from './layout.module.css';

export const DemoGrid = withClassName('div', classes.demoGrid);
export const Demo = withClassName(
	withProps(PhoneDemo, { size: 'large' }),
	classes.demo,
);
export const Highlight = withClassName('img', classes.highlight);
export const TitleWrap = withClassName('div', classes.titleWrap);
export const Hero = withClassName('div', '@mode-hero', classes.hero);
const Emoji = withClassName('span', classes.emoji);
const ItemText = withClassName('span', classes.itemText);

export const Description = withClassName('p', classes.description);

export const Section = forwardRef<
	HTMLDivElement,
	{
		color?: 'white' | 'default';
		className?: string;
		children: ReactNode;
		style?: CSSProperties;
	}
>(function Section({ color = 'default', className, ...rest }, ref) {
	return (
		<Box
			ref={ref}
			p
			rounded
			border
			surface={color === 'white' ? 'ambient' : 'secondary'}
			render={<section />}
			className={clsx(classes.section, className)}
			{...rest}
		/>
	);
});

export function HeroTitle({ children }: { children: string }) {
	return <h1 className={clsx('font-fancy', classes.heroTitle)}>{children}</h1>;
}

export const Content = forwardRef<
	HTMLDivElement,
	{
		children: ReactNode;
		className?: string;
		style?: CSSProperties;
	}
>(function Content({ children, className, ...rest }, ref) {
	return (
		<div ref={ref} className={clsx(classes.content, className)} {...rest}>
			<DemoGrid className={classes.contentInner}>{children}</DemoGrid>
		</div>
	);
});

export const FeatureSection = ({
	title,
	items,
}: {
	title: string;
	items: { emoji: string; text: string; premium?: boolean }[];
}) => {
	return (
		<Section>
			<H2 className={classes.gutterBottom}>{title}</H2>
			{items.map((item, index) => (
				<div className={classes.featureItem} key={index}>
					<div className={classes.featureRow}>
						<Emoji>{item.emoji}</Emoji>
						<ItemText>{item.text}</ItemText>
					</div>
					{item.premium && (
						<Link to="/join" className={classes.premiumBadge}>
							Premium feature
						</Link>
					)}
				</div>
			))}
		</Section>
	);
};

export const Footer = ({ className }: { className?: string }) => (
	<Content className={clsx('@mode-dense', className)}>
		<div className={classes.footerLinks}>
			<Link to="/privacy" newTab>
				Read the privacy policy
			</Link>
			<Link to="/tos" newTab>
				Terms and Conditions of usage
			</Link>
			<a
				href="https://github.com/a-type/biscuits"
				target="_blank"
				rel="noopener noreferrer"
			>
				Biscuits is open source
			</a>
		</div>
	</Content>
);

export const CallToAction = ({
	className,
	appId,
}: {
	className?: string;
	appId: AppId;
}) => (
	<div className={clsx(classes.cta, className)}>
		<div className={classes.ctaButtons}>
			<Button
				render={<a href={appsById[appId].url} data-test="get-started" />}
				emphasis="primary"
				className={classes.ctaGetStarted}
			>
				Get Started
			</Button>
			<Button render={<Link to="/" />} emphasis="default">
				<Icon name="arrowLeft" />
				More Biscuits apps
			</Button>
		</div>

		<span className={classes.ctaDisclaimer}>
			Free, no signup required. By continuing you agree to{' '}
			<Link to="/tos" newTab>
				the terms and conditions of usage.
			</Link>
		</span>
	</div>
);

export const Root = withClassName('div', classes.root);

export const Background = withClassName('div', classes.background);

const AppNameText = withClassName(
	'h2',
	clsx('font-fancy', classes.appNameText),
);

export const AppName = ({ appId }: { appId: AppId }) => {
	const app = appsById[appId];

	return (
		<div className={clsx('@mode-heading', classes.appNameRow)}>
			<img src={`${app.url}/${app.iconPath}`} alt={app.name} width={80} />
			<AppNameText>{app.name}</AppNameText>
		</div>
	);
};
