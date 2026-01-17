import { Button, clsx, H2, Icon, withClassName, withProps } from '@a-type/ui';
import { AppId, appsById } from '@biscuits/apps';
import { Link } from '@verdant-web/react-router';
import { CSSProperties, forwardRef, ReactNode } from 'react';
import PhoneDemo from './PhoneDemo.jsx';

export const DemoGrid = withClassName(
	'div',
	'grid grid-cols-[1fr] gap-5 items-start md:(grid-cols-[repeat(2,1fr)])',
);
export const Demo = withClassName(
	withProps(PhoneDemo, { size: 'large' }),
	'relative z-1 [grid-row-end:span_2]',
);
export const Highlight = withClassName(
	'img',
	'flex-1 [grid-row-end:span_2] min-w-0 w-full object-contain rounded-lg border-default',
);
export const TitleWrap = withClassName('div', 'md:[grid-column-end:span_2]');
const Emoji = withClassName('span', 'block');
const ItemText = withClassName('span', 'block relative');

export const Description = withClassName(
	'p',
	'font-light text-xl my-6 color-black',
);

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
		<section
			ref={ref}
			className={clsx(
				'[line-height:1.5] relative mb-auto flex flex-col items-start border rounded-lg border-solid p-6 text-sm color-black bg-primary-wash border-primary-dark',
				color === 'white' && 'border-default bg-white',
				className,
			)}
			{...rest}
		/>
	);
});

export function HeroTitle({ children }: { children: string }) {
	return (
		<h1 className="font-fancy [font-size:7vmax] m-0 mb-6 w-full font-normal text-shadow-[0_0_16px_var(--color-primary-light)] color-black md:[font-size:7vmin]">
			{children}
		</h1>
	);
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
		<div
			ref={ref}
			className={clsx('w-full flex flex-col gap-6 bg-primary', className)}
			{...rest}
		>
			<DemoGrid className="relative z-1 mx-auto my-0 max-w-800px w-full p-6">
				{children}
			</DemoGrid>
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
			<H2 className="gutter-bottom">{title}</H2>
			{items.map((item, index) => (
				<div className="col gap-0" key={index}>
					<div className="my-2 row items-start">
						<Emoji>{item.emoji}</Emoji>
						<ItemText>{item.text}</ItemText>
					</div>
					{item.premium && (
						<Link
							to="/join"
							className="relative ml-auto rounded-full px-3 py-1 text-xs font-bold color-white bg-primary-dark -top-2"
						>
							Premium feature
						</Link>
					)}
				</div>
			))}
		</Section>
	);
};

export const Footer = ({ className }: { className?: string }) => (
	<Content className={clsx('pb-20dvh important:bg-primary', className)}>
		<div className="mt-6 flex flex-col gap-4">
			<Link to="/privacy-policy" newTab>
				Read the privacy policy
			</Link>
			<Link to="/tos" newTab>
				Terms and Conditions of usage
			</Link>
			<Link to="https://github.com/a-type/biscuits" newTab>
				Biscuits is open source
			</Link>
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
	<div
		className={clsx(
			'fixed bottom-0 z-2 m-0 w-full flex flex-col items-center gap-3 border-0 border-t border-solid p-3 transition-colors bg-primary-wash border-t-primary-dark',
			className,
		)}
	>
		<div className="w-full flex flex-col items-center justify-between gap-xs sm:flex-row-reverse md:justify-center sm:gap-lg">
			<Button
				render={<Link to={appsById[appId].url} data-test="get-started" />}
				emphasis="primary"
				className="self-center justify-center"
			>
				Get Started
			</Button>
			<Button render={<Link to="/" />} emphasis="default">
				<Icon name="arrowLeft" />
				More Biscuits apps
			</Button>
		</div>

		<span className="text-xxs">
			Free, no signup required. By continuing you agree to{' '}
			<Link to="/tos" newTab>
				the terms and conditions of usage.
			</Link>
		</span>
	</div>
);

export const Root = withClassName(
	'div',
	'bg-white color-black flex flex-col items-stretch',
);

export const Background = withClassName(
	'div',
	'layer-components:(fixed top-0 left-0 w-full h-80% pointer-events-none)',
);

const AppNameText = withClassName(
	'h2',
	'font-fancy font-bold text-[4vmax] color-primary-dark m-0',
);

export const AppName = ({ appId }: { appId: AppId }) => {
	const app = appsById[appId];

	return (
		<div className="row items-center gap-4 py-2">
			<img src={`${app.url}/${app.iconPath}`} alt={app.name} width={80} />
			<AppNameText>{app.name}</AppNameText>
		</div>
	);
};
