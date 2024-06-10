import { withClassName } from '@a-type/ui/hooks';
import { clsx } from '@a-type/ui';
import PhoneDemo from './PhoneDemo.jsx';
import { CSSProperties, forwardRef, ReactNode } from 'react';
import { H2 } from '@a-type/ui/components/typography';
import { Link } from '@verdant-web/react-router';
import { Button } from '@a-type/ui/components/button';
import { AppId, appsById } from '@biscuits/apps';

export const DemoGrid = withClassName(
  'div',
  'grid grid-cols-[1fr] gap-5 items-start md:(grid-cols-[repeat(2,1fr)])',
);
export const Demo = withClassName(
  PhoneDemo,
  'relative z-1 [grid-row-end:span_2]',
);
export const Highlight = withClassName(
  'img',
  'flex-1 [grid-row-end:span_2] min-w-0 w-full object-contain rounded-lg border-default',
);
export const TitleWrap = withClassName('div', 'md:[grid-column-end:span_2]');
export const Item = withClassName('p', 'flex items-start gap-2');
export const Emoji = withClassName('span', 'block');
export const ItemText = withClassName('span', 'block relative');

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
        'bg-primary-wash relative flex flex-col items-start mb-auto p-6 rounded-lg text-sm border border-solid border-primary-dark [line-height:1.5] color-black',
        color === 'white' && 'bg-white border-default',
        className,
      )}
      {...rest}
    />
  );
});

export function HeroTitle({ children }: { children: string }) {
  return (
    <h1 className="w-full m-0 mb-6 font-fancy [font-size:7vmax] color-black font-normal text-shadow-[0_0_16px_var(--color-primary-light)] md:[font-size:7vmin]">
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
      <DemoGrid className="max-w-800px w-full my-0 mx-auto p-6 relative z-1">
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
  items: { emoji: string; text: string }[];
}) => {
  return (
    <Section>
      <H2 className="gutter-bottom">{title}</H2>
      {items.map((item, index) => (
        <Item key={index}>
          <Emoji>{item.emoji}</Emoji>
          <ItemText>{item.text}</ItemText>
        </Item>
      ))}
    </Section>
  );
};

export const Footer = ({ className }: { className?: string }) => (
  <Content className={clsx('important:bg-primary-light pb-20vh', className)}>
    <div className="mt-6 gap-4 flex flex-col">
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

export const CallToAction = ({ className }: { className?: string }) => (
  <div
    className={clsx(
      'flex flex-col fixed bottom-0 bg-primary-light border-0 border-t border-solid border-t-primary-dark m-0 w-full p-6 items-center gap-3 z-2 transition-colors',
      className,
    )}
  >
    <Button asChild>
      <Link
        to="/"
        data-test="get-started"
        className="justify-center self-center"
        color="default"
      >
        Get Started
      </Link>
    </Button>

    <span className="text-sm">
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
  'fixed top-0 left-0 w-full h-80% pointer-events-none',
);

const AppNameText = withClassName(
  'h2',
  'font-fancy font-bold text-[4vmax] color-primary-dark',
);

export const AppName = ({ appId }: { appId: AppId }) => {
  const app = appsById[appId];

  return (
    <div className="row gap-4">
      <img src={`${app.url}/${app.iconPath}`} alt={app.name} width={80} />
      <AppNameText>{app.name}</AppNameText>
    </div>
  );
};
