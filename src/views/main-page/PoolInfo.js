import PropTypes from 'prop-types';
import { Grid, Typography } from '@mui/material';
import utils from '../../utils/helpers/utils';

export default function PoolInfo({mintInfo, stakeData, nowTs}) {
    const decimals = mintInfo? mintInfo.decimals: 0;
    const rewardPool = utils.formatNumber( (stakeData? stakeData.poolReward: 0) / Math.pow(10, decimals));
    const totalStaked = utils.formatNumber((stakeData? stakeData.totalStaked.toNumber(): 0) / Math.pow(10, decimals));
    const apyMax = (stakeData? stakeData.apyMax: 0);
    const curTimeFrame = stakeData? stakeData.timeframeInSecond.toNumber(): 0;

    const curTime = Math.floor(Date.now() / 1000);
    const diffTime = curTime - nowTs;

    const timeframeStarted = (stakeData? stakeData.timeframeStarted.toNumber(): 0) + diffTime;
    const rewardPoolExpires = utils.unixTime2UTC(timeframeStarted + curTimeFrame);

    return (
        <>
            <Grid container spacing={1} justifyContent="center" alignItems="center">
                <Grid item>
                    <h2>Pool info</h2>
                </Grid>
            </Grid>

            <Grid container spacing={1}>                            
                <Grid item xs={12} sm={12} md={12} lg={3}>
                    <Grid container spacing={1}>
                        <Grid item xs={6} sm={6} md={6} lg={12}>
                            <Typography variant="subtitle2" align="center">
                                Reward Pool
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sm={6} md={6} lg={12}>
                            <Typography variant="h4" align="center">
                                {rewardPool}
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={3}>
                    <Grid container spacing={1}>
                        <Grid item xs={6} sm={6} md={6} lg={12}>
                            <Typography variant="subtitle2" align="center">
                                Reward Pool Expires
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sm={6} md={6} lg={12}>
                            <Typography variant="h4" align="center">
                                {rewardPoolExpires}
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>                

                <Grid item xs={12} sm={12} md={12} lg={3}>
                    <Grid container spacing={1}>
                        <Grid item xs={6} sm={6} md={6} lg={12}>
                            <Typography variant="subtitle2" align="center">
                                Total xSER Tokens
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sm={6} md={6} lg={12}>
                            <Typography variant="h4" align="center">
                                {totalStaked}
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12} sm={12} md={12} lg={3}>
                    <Grid container spacing={1}>
                        <Grid item xs={6} sm={6} md={6} lg={12}>
                            <Typography variant="subtitle2" align="center">
                                Est.APY
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sm={6} md={6} lg={12}>
                            <Typography variant="h4" align="center">
                                {apyMax} %
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>

            </Grid>
        </>
    );
}

PoolInfo.propTypes = {
    mintInfo: PropTypes.any,
    stakeData: PropTypes.any,
    nowTs: PropTypes.number,
};
