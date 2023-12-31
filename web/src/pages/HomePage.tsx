import { AppsGrid } from '@/components/AppsGrid.jsx';
import { UserMenu } from '@/components/auth/UserMenu';
import {
  PageContent,
  PageFixedArea,
  PageRoot,
} from '@a-type/ui/components/layouts';
import { P } from '@a-type/ui/components/typography';
import classNames from 'classnames';
import { Suspense, lazy } from 'react';

const Paws = lazy(() => import('@/components/Paws.jsx'));

const innerProps = {
  className: 'flex flex-col gap-6 relative px-8',
};

export default function HomePage() {
  return (
    <PageRoot className="bg-primary">
      <Background />
      <Suspense>
        <Paws />
      </Suspense>
      <PageContent innerProps={innerProps}>
        <PageFixedArea className="bg-transparent flex flex-row justify-end py-2">
          <UserMenu />
        </PageFixedArea>
        <div className="flex flex-col gap-2 h-[30vh] my-10 text-primary-dark font-semibold">
          <h1
            className={classNames(
              '[font-family:"Noto_Serif",serif]',
              'text-[5vmin] m-0 font-900 text-accent text-shadow',
            )}
          >
            Biscuits
          </h1>
          <h2
            className={classNames(
              '[font-family:"Noto_Serif",serif]',
              '!text-[10vmin] text-black mt-0 mb-6 font-900 leading-none',
            )}
          >
            Scratch-made apps
          </h2>
          <P className="m-0 text-inherit">in Raleigh, NC</P>
        </div>
        <AppsGrid />
      </PageContent>
    </PageRoot>
  );
}

function Background() {
  // a wavy 2-bump blob in the upper right corner
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="absolute top-0 right-0 w-1/2 h-3/4 pointer-events-none"
    >
      <path
        d={`M 5.4313104,-0.52988403
          C 2.6857268,13.963806 6.556268,28.813172 20.665477,35.369759
          c 14.109208,6.556587 28.71589,-4.334327 40.138713,5.166369 11.422824,9.500696 -0.04547,17.716434 5.50578,29.604545 6.792338,14.54591 13.568365,19.601822 34.23552,25.635865
          l -0.52988,-95.90900901
          z`}
        className="fill-primary-light"
      />
    </svg>
  );
}
