import { Footer } from '@/components/help/Footer.jsx';
import { Price } from '@/components/subscription/Price.jsx';
import { Button } from '@a-type/ui/components/button';
import { Icon } from '@a-type/ui/components/icon';
import {
  PageContent,
  PageFixedArea,
  PageRoot,
  PageSectionGrid,
} from '@a-type/ui/components/layouts';
import { Divider } from '@a-type/ui/components/divider';
import { PaidFeature, apps, getAppUrl } from '@biscuits/apps';
import { graphql, useQuery } from '@biscuits/client';
import { Link } from '@verdant-web/react-router';
import classNames from 'classnames';

export interface JoinPageProps {}

const startingPriceQuery = graphql(`
  query StartingPrice {
    productInfo(lookupKey: "for_one") {
      price
      currency
    }
  }
`);

export function JoinPage({}: JoinPageProps) {
  return (
    <PageRoot className="bg-primary-wash">
      <PageContent>
        <div className="flex flex-col gap-6 w-full">
          <h1 className={classNames('text-gray-9')}>
            Join Biscuits to unlock features and collaboration in every app
          </h1>
          <p>
            Biscuits apps are always free to use, but members can sync data
            across devices, use fancy new features, and even share with family
            and friends. Plans start at <StartingPrice />.
          </p>
          <PageFixedArea className="flex flex-row gap-3 py-4 justify-between bg-transparent">
            <Button asChild color="default">
              <Link to="/">
                <Icon name="arrowLeft" />
                Back to apps
              </Link>
            </Button>
            <Button asChild color="primary">
              <Link to="/login?returnTo=/plan">Get started</Link>
            </Button>
          </PageFixedArea>
          {apps.map((app) => (
            <div key={app.id} className="w-full max-w-none">
              <div className="flex flex-row items-center gap-4">
                <img
                  src={`${getAppUrl(app)}/${app.iconPath}`}
                  alt={app.name}
                  width={48}
                />
                <h2>{app.name}</h2>
              </div>
              <p>{app.paidDescription}</p>
              <PageSectionGrid>
                {app.paidFeatures.map((feature, index) => (
                  <AppFeature key={index} feature={feature} />
                ))}
              </PageSectionGrid>
              <Divider className="my-8" />
            </div>
          ))}
        </div>
        <Footer />
      </PageContent>
    </PageRoot>
  );
}

const StartingPrice = () => {
  const { data } = useQuery(startingPriceQuery);
  return (
    <Price
      value={data?.productInfo.price}
      currency={data?.productInfo.currency}
      className="font-bold"
    />
  );
};

function AppFeature({ feature }: { feature: PaidFeature }) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start">
      <p className="text-md font-bold my-0 flex-1-0-0">{feature.description}</p>
      <img
        className="border border-solid border-1 border-black rounded-lg max-w-full flex-1-0-0 min-w-0"
        src={feature.imageUrl}
        alt="a visualization of the described feature"
      />
    </div>
  );
}

export default JoinPage;
