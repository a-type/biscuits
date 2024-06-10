import {
  AppName,
  CallToAction,
  Content,
  DemoGrid,
  FeatureSection,
  Footer,
  HeroTitle,
  Root,
  TitleWrap,
} from '@/components/promo/layout.jsx';

export interface TripTickPageProps {}

export function TripTickPage({}: TripTickPageProps) {
  return (
    <Root className="theme-eggplant">
      <Content className="bg-wash">
        <TitleWrap>
          <AppName appId="trip-tick" />
          <HeroTitle>Never forget your socks again.</HeroTitle>
        </TitleWrap>
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
      </Content>
      <Footer />
      <CallToAction />
    </Root>
  );
}

export default TripTickPage;
