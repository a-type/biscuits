import { H1, P } from '@a-type/ui/components/typography';
import { Explainer as ExplainerBase } from '@biscuits/client';

import screen1 from './screen1.png';
import screen2 from './screen2.png';
import screen3 from './screen3.png';

export function Explainer() {
  return <ExplainerBase stages={stages} />;
}

const stages = [
  <>
    <H1>How to use Trip Tick</H1>
    <P>
      Trip Tick has two parts: <b>Trips</b> and <b>Lists</b>.
    </P>
    <img src={screen1} alt="Trip Tick screenshot" className="w-full" />
    <P>
      Here's what a trip looks like with some lists added ("Grant" and
      "Pashka").
    </P>
  </>,
  <>
    <H1>Lists</H1>
    <P>
      Lists are collections of items that you can add to a trip. You make a list
      once, then use it each time you plan a new trip.
    </P>
    <img src={screen2} alt="Trip Tick screenshot" className="w-full" />
    <P>
      Your lists let Trip Tick do the math for you. Configure item quantities
      like "1 per 3 days" and the app will tell you how many to pack based on
      your trip length.
    </P>
    <P>
      You can create a list for anything you want to keep track of while
      packing, like a packing list or a to-do list.
    </P>
  </>,
  <>
    <H1>Trips</H1>
    <P>
      Trips are collections of lists that you can use to keep track of your
      packing progress.
    </P>
    <img src={screen3} alt="Trip Tick screenshot" className="w-full" />
    <P>
      Each time you plan a new trip, you choose a date range and select which
      lists you need to pack.
    </P>
    <P>
      When it's time to start packing, you check off items from those lists as
      you add them to your bag.
    </P>
    <P>That's it. Save travels!</P>
  </>,
];
