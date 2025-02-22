import React from 'react';
import { ApiMinerReward } from 'src/types/Miner.types';
import { useActiveCoin } from 'src/rdx/localSettings/localSettings.hooks';
import {
  ChartContainer,
  responsiveRule,
} from 'src/components/Chart/ChartContainer';

import {
  color,
  NumberFormatter,
  create,
  Legend,
  XYChart,
  XYCursor,
  DateAxis,
  ValueAxis,
  ColumnSeries,
} from 'src/plugins/amcharts';
import { useTranslation } from 'react-i18next';
import { useLocalizedCurrencyFormatter } from 'src/utils/si.utils';

const RewardsChart: React.FC<{
  rewards: ApiMinerReward[];
  counterPrice: number;
  error?: any;
  isLoading: boolean;
}> = (props) => {
  const { rewards, counterPrice } = props;
  const coin = useActiveCoin();

  const { t } = useTranslation('dashboard');
  const currencyFormatter = useLocalizedCurrencyFormatter();

  React.useEffect(() => {
    if (!rewards || !counterPrice || !coin) return;

    let rewardsChart = create('rewards-chart', XYChart);

    rewardsChart.responsive.enabled = true;
    rewardsChart.responsive.useDefault = false;
    rewardsChart.responsive.rules.push(responsiveRule);
    rewardsChart.colors.list = [color('#0069ff')];
    const rewardsChartData = rewards.map((item) => {
      return {
        date: new Date(
          item.timestamp * 1000 + new Date().getTimezoneOffset() * 60 * 1000
        ),
        totalRewards: item.totalRewards / Math.pow(10, coin.decimalPlaces),
        countervaluedRewards: currencyFormatter(
          (item.totalRewards / Math.pow(10, coin.decimalPlaces)) * counterPrice
        ),
      };
    });

    rewardsChart.data = rewardsChartData.reverse();

    var rewardsAxis = rewardsChart.yAxes.push(new ValueAxis());
    rewardsAxis.numberFormatter = new NumberFormatter();
    rewardsAxis.renderer.grid.template.disabled = true;
    rewardsAxis.min = 0;
    let dateAxis = rewardsChart.xAxes.push(new DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.baseInterval = {
      timeUnit: 'day',
      count: 1,
    };

    let rewardSeries = rewardsChart.series.push(new ColumnSeries());

    rewardSeries.dataFields.dateX = 'date';
    rewardSeries.name = `${t(
      'rewards.earnings_chart.earnings'
    )} (${coin.ticker.toUpperCase()})`;
    rewardSeries.yAxis = rewardsAxis;
    rewardSeries.dataFields.valueY = 'totalRewards';

    rewardSeries.tooltipText = `${t(
      'rewards.earnings_chart.daily_income'
    )} {valueY.value.formatNumber("#.0000000")} ETH ({countervaluedRewards})`;

    rewardsChart.cursor = new XYCursor();
    rewardsChart.legend = new Legend();

    return () => {
      rewardsChart.dispose();
    };
    // eslint-disable-next-line
  }, [coin, rewards, counterPrice, t, currencyFormatter]);

  return (
    <>
      <ChartContainer
        title={t('rewards.earnings_chart.title')}
        dataState={{
          error: props.error,
          isLoading: props.isLoading,
          data: rewards,
        }}
      >
        <div id="rewards-chart" style={{ width: '100%', height: '250px' }} />
      </ChartContainer>
    </>
  );
};

export default RewardsChart;
