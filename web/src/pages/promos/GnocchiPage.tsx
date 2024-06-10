import { withClassName } from '@a-type/ui/hooks';
import { useLocalStorage, useOnVisible } from '@biscuits/client';
import classNames from 'classnames';
import {
  CSSProperties,
  forwardRef,
  lazy,
  ReactNode,
  Suspense,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Link, useSearchParams } from '@verdant-web/react-router';
import { H2, P } from '@a-type/ui/components/typography';
import { LoginButton, PromoteSubscriptionButton } from '@biscuits/client';
import { AutoRestoreScroll } from '@verdant-web/react-router';
import { Button } from '@a-type/ui/components/button';
import PhoneDemo from '@/components/promo/PhoneDemo.jsx';

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

  const [params] = useSearchParams();
  const jumpToUpgrade = params.get('upgrade') === 'true';
  useEffect(() => {
    if (jumpToUpgrade && upgradeSectionRef.current) {
      window.scrollTo(0, upgradeSectionRef.current.offsetTop);
    }
  }, [jumpToUpgrade]);

  return (
    <div className="bg-white color-black flex flex-col items-stretch">
      <AutoRestoreScroll />
      <div className="fixed top-0 left-0 w-full h-80% pointer-events-none">
        <Suspense>
          <Scene />
        </Suspense>
      </div>
      <Content className="bg-primary-light">
        <DemoGrid>
          <TitleWrap>
            <h2 className="font-fancy font-bold text-[4vmax] color-primary-dark mb-20vh">
              Gnocchi
            </h2>
            <Title>Your weekly cooking, in one place.</Title>
          </TitleWrap>
          <Section>
            <H2 className="gutter-bottom">How it works</H2>
            <Item>
              <Emoji>🧾</Emoji>
              <ItemText>
                Copy, paste, or share items directly into the app.
              </ItemText>
            </Item>
            <Item>
              <Emoji>🏷️</Emoji>
              <ItemText>
                Organize your run by aisle. Gnocchi will remember your
                categorizations!
              </ItemText>
            </Item>
            <Item>
              <Emoji>🛒</Emoji>
              <ItemText>
                Get helpful suggestions based on your past purchases.
              </ItemText>
            </Item>
          </Section>
          <Demo src="/images/gnocchi/list.png" type="image" />
          <Demo
            src="/images/gnocchi/recipes.png"
            type="image"
            direction="right"
          />
          <Section>
            <H2 className="gutter-bottom">Collect recipes</H2>
            <p>
              Gnocchi is a recipe app, too. You can save recipes from the web,
              or add your own.
            </p>
            <Item>
              <Emoji>📝</Emoji>
              <ItemText>
                Edit recipes to your liking. Add notes, change the serving size,
                or even swap out your own ingredients.
              </ItemText>
            </Item>
            <Item>
              <Emoji>➕</Emoji>
              <ItemText>
                Add recipe ingredients directly to your grocery list.
              </ItemText>
            </Item>
          </Section>
          <Section color="white">
            <H2 className="gutter-bottom">Less improv at the grocery store</H2>
            <p>
              If you're like me, you usually leave the grocery store with some
              foods you didn't plan on buying. But you also get home, start
              loading the fridge, and realize you forgot something, too.
            </p>
            <p>
              I built Gnocchi to plan grocery trips better, as a solo shopper or
              a family. It may seem like any old list app, but under the surface
              I've tried to design intentionally for the task at hand. Give it a
              shot this week (no account needed!) and let me know what you
              think.
            </p>
            <p>&ndash; Grant</p>
          </Section>
          <Demo src="/images/gnocchi/addBar.png" type="image" />
        </DemoGrid>
      </Content>
      <Content
        className={classNames(
          'bg-primary border-t-10vh border-b-20vh border-solid border-primary-light',
          'theme-leek',
        )}
        ref={upgradeSectionRef}
      >
        <DemoGrid className="mt-20vh">
          <TitleWrap className="bg-primary-wash border-1 border-solid border-primary-dark rounded-lg p-4">
            <H2 className="[font-size:5vmax] gutter-bottom">
              Upgrade to the world's most collaborative cooking app
            </H2>
            <P>
              Sync your list and recipes to all your devices, share your list
              with anyone you shop with, and coordinate with other chefs while
              cooking.
            </P>
          </TitleWrap>
          <img
            src="/images/gnocchi/groceries-collaboration.png"
            className="flex-1 [grid-row-end:span_2] min-w-0 w-full object-contain rounded-lg border-default"
          />
          <Section>
            <H2 className="gutter-bottom">Collaborative groceries</H2>
            <p>
              Team up with your family, roommates, or friends to plan and shop
            </p>
            <Item>
              <Emoji>☁️</Emoji>
              <ItemText>
                Sync your list and recipes to all your devices.
              </ItemText>
            </Item>
            <Item>
              <Emoji>👯</Emoji>
              <ItemText>Share your list with anyone you shop with.</ItemText>
            </Item>
            <Item>
              <Emoji>📌</Emoji>
              <ItemText>
                In-store collaboration, like claiming sections and planning a
                place to meet up.
              </ItemText>
            </Item>
          </Section>
          <img
            src="/images/gnocchi/recipe-collaboration.png"
            className="flex-1 [grid-row-end:span_2] min-w-0 w-full object-contain rounded-lg border-default"
          />
          <Section>
            <H2 className="gutter-bottom">Sous chef mode</H2>
            <p>Stay on task when cooking together</p>
            <Item>
              <Emoji>🖨️</Emoji>
              <ItemText>
                Scan a recipe page directly to the app to add all the
                ingredients to your list.
              </ItemText>
            </Item>
            <Item>
              <Emoji>🧑🏻‍🍳</Emoji>
              <ItemText>
                Assign tasks to each chef, and see who's done what.
              </ItemText>
            </Item>
          </Section>
          <div className="flex flex-row items-center justify-center gap-4 w-full py-8 md:[grid-column-end:span_2]">
            <Button asChild color="primary">
              <Link to="/join">Upgrade now</Link>
            </Button>
            <Button asChild>
              <Link to="/apps">See other included apps</Link>
            </Button>
          </div>
        </DemoGrid>
      </Content>
      <Content
        className={classNames(
          'theme-leek',
          'important:bg-primary-light pb-20vh',
        )}
      >
        <div className="mt-6 gap-4 flex flex-col">
          <Link to="/privacy-policy" newTab>
            Read the privacy policy
          </Link>
          <Link to="/tos" newTab>
            Terms and Conditions of usage
          </Link>
          <Link to="https://github.com/a-type/biscuits" newTab>
            Gnocchi is open source
          </Link>
        </div>
      </Content>
      <div
        className={classNames(
          'flex flex-col fixed bottom-0 bg-primary-light border-0 border-t border-solid border-t-primary-dark m-0 w-full p-6 items-center gap-3 z-2 transition-colors',
          staticSectionAccent ? 'theme-leek' : undefined,
        )}
      >
        {jumpToUpgrade && <LoginButton>Join the club</LoginButton>}
        <Button asChild>
          <Link
            to="/"
            data-test="get-started"
            className="justify-center self-center"
            color="default"
          >
            {jumpToUpgrade ? 'Use for free' : 'Get Started'}
          </Link>
        </Button>

        <span className="text-sm">
          Free, no signup required. By continuing you agree to{' '}
          <Link to="/tos" newTab>
            the terms and conditions of usage.
          </Link>
        </span>
      </div>
    </div>
  );
}

export default GnocchiPage;

const DemoGrid = withClassName(
  'div',
  'grid grid-cols-[1fr] gap-5 items-start md:(grid-cols-[repeat(2,1fr)])',
);
const Demo = withClassName(PhoneDemo, 'relative z-1 [grid-row-end:span_2]');
const TitleWrap = withClassName('div', 'md:[grid-column-end:span_2]');
const Item = withClassName('p', 'flex items-start gap-2');
const Emoji = withClassName('span', 'block');
const ItemText = withClassName('span', 'block relative');

const Section = forwardRef<
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
      className={classNames(
        'bg-primary-wash relative flex flex-col items-start mb-auto p-6 rounded-lg text-sm border border-solid border-primary-dark [line-height:1.5] color-black',
        color === 'white' && 'bg-white border-default',
        className,
      )}
      {...rest}
    />
  );
});

function Title({ children }: { children: string }) {
  return (
    <h1 className="w-full m-0 mb-6 font-fancy [font-size:7vmax] color-black font-normal text-shadow-[0_0_16px_var(--color-white)] md:[font-size:7vmin]">
      {children}
    </h1>
  );
}

const Content = forwardRef<
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
      className={classNames('w-full flex flex-col gap-6 bg-primary', className)}
      {...rest}
    >
      <div className="max-w-800px w-full my-0 mx-auto p-6 relative z-1">
        {children}
      </div>
    </div>
  );
});
