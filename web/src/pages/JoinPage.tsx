import {
  PageContent,
  PageFixedArea,
  PageRoot,
  PageSection,
  PageSectionGrid,
} from '@a-type/ui/components/layouts';
import { Button } from '@a-type/ui/components/button';
import { Icon } from '@a-type/ui/components/icon';
import { graphql, useLocalStorage, useQuery } from '@biscuits/client';
import { Link, useNavigate } from '@verdant-web/react-router';
import { useEffect } from 'react';
import classNames from 'classnames';
import { Price } from '@/components/subscription/Price.jsx';

export interface JoinPageProps {}

const startingPriceQuery = graphql(`
  query StartingPrice {
    productInfo(lookupKey: "for_two") {
      price
      currency
    }
  }
`);

export function JoinPage({}: JoinPageProps) {
  const [seen] = useLocalStorage('seenBefore', false);
  const navigate = useNavigate();
  useEffect(() => {
    if (seen) {
      navigate(`/login`, { replace: true });
    }
  }, [seen, navigate]);

  return (
    <PageRoot className="bg-gray-1">
      <PageContent>
        <div className="flex flex-col gap-6">
          <h1 className={classNames('text-gray-9')}>
            Join Biscuits to unlock features and collaboration in every app
          </h1>
          <p>
            Biscuits apps are always free to use, but members can sync and share
            data with family or friends. Plans start at <StartingPrice />.
          </p>
          <PageFixedArea className="flex flex-row gap-3 py-4 justify-between">
            <Button asChild color="default">
              <Link to="/">
                <Icon name="arrowLeft" />
                Back to apps
              </Link>
            </Button>
            <Button asChild color="primary">
              <Link to="/login">Get started</Link>
            </Button>
          </PageFixedArea>
          <PageSection>
            <h2>Gnocchi</h2>
            <p>
              Your personal cooking app becomes a family groceries list and
              recipe box.
            </p>
            <PageSectionGrid>
              <div>TODO: screenshots</div>
            </PageSectionGrid>
          </PageSection>
          <PageSection>
            <h2>Trip Tick</h2>
            <p>
              Now everyone can be on the same page when packing. Plus, get a
              weather forecast and more powerful trip planning tools.
            </p>
          </PageSection>
        </div>
      </PageContent>
    </PageRoot>
  );
}

const StartingPrice = () => {
  const [{ data }] = useQuery({ query: startingPriceQuery });
  return (
    <Price
      value={data?.productInfo.price}
      currency={data?.productInfo.currency}
      className="font-bold"
    />
  );
};

export default JoinPage;
