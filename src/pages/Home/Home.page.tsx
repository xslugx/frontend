import { Content } from 'src/components/layout/Content';
import { HeroBlue } from 'src/components/layout/Hero/HeroBlue';
import { Page } from 'src/components/layout/Page';
import { CoinsWeMineSection } from 'src/pages/Home/CoinsWeMine.section';
import { GetStartedSection } from 'src/pages/Home/GetStarted.section';
import { NewsSection } from './News.section';
import styled from 'styled-components/macro';
import { SearchAddressBar } from 'src/components/SearchAddressBar/SearchAddressBar';
import { Helmet } from 'react-helmet-async';
import { Spacer } from 'src/components/layout/Spacer';
import { CoinEarnings } from './CoinEarnings';
import { WhyFlexpool } from './WhyFlexpool';
import React from 'react';
import { useDispatch } from 'react-redux';
import { poolCoinsFullGet } from 'src/rdx/poolCoinsFull/poolCoinsFull.actions';
import { useTranslation } from 'react-i18next';

const Hero = styled(HeroBlue)`
  min-height: 40vh;
  padding-top: 10rem;
  padding-bottom: 10rem;
  position: relative;
  @media screen and (max-width: 800px) {
    margin-bottom: 0;
    padding-bottom: 3rem;
  }
`;

const SearchWrapper = styled.div`
  max-width: 600px;
  width: 100%;
  margin-top: 2rem;
  border-radius: 5px;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.3);
`;

const PageContainer = styled(Page)`
  background: var(--bg-secondary);
`;

export const HomePage = () => {
  const d = useDispatch();
  React.useEffect(() => {
    d(poolCoinsFullGet());
  }, [d]);
  const { t } = useTranslation('home');

  return (
    <PageContainer>
      <Helmet>
        <title>{t('head_title')}</title>
      </Helmet>
      <Hero>
        <Content contentCenter style={{ position: 'relative', zIndex: 100 }}>
          <h1>{t('title')}</h1>
          <p>{t('description')}</p>
          <SearchWrapper>
            <SearchAddressBar />
          </SearchWrapper>
        </Content>
        <Spacer />
        <CoinEarnings />
        <Spacer />
        <NewsSection />
      </Hero>
      <CoinsWeMineSection />
      <WhyFlexpool />
      <GetStartedSection />
    </PageContainer>
  );
};

export default HomePage;
