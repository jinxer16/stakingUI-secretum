import PropTypes from 'prop-types';
import { Grid, Typography, Divider} from '@mui/material';
import utils from '../../utils/helpers/utils';


export default function PoolInfo({mintInfo, stakeData, nowTs}) {
    const decimals = mintInfo? mintInfo.decimals: 0;
    const totalSupply = utils.formatNumber( (mintInfo? mintInfo.supply: 0) / Math.pow(10, decimals));
    const totalStaked = utils.formatNumber((stakeData? stakeData.totalStaked.toNumber(): 0) / Math.pow(10, decimals));
    const apyMax = (stakeData? stakeData.apyMax: 0);
    const stakers = stakeData? stakeData.stakers.length: 0;
    const poolReward = utils.formatNumber(stakeData? stakeData.poolReward.toNumber() / Math.pow(10, decimals): 0);
    const minTimeFrame = stakeData? stakeData.minTimeframeInSecond.toNumber(): 0;
    const minStakePeriod = stakeData? stakeData.minStakePeriod.toNumber(): 0;

    const curTimeFrame = stakeData? stakeData.timeframeInSecond.toNumber(): 0;

    const curTime = Math.floor(Date.now() / 1000);
    const diffTime = curTime - nowTs;

    const timeframeStarted = (stakeData? stakeData.timeframeStarted.toNumber(): 0) + diffTime;
    const strTimeframeStarted = utils.unixTime2UTC(timeframeStarted);
    const strTimeframeEnd = utils.unixTime2UTC(timeframeStarted + curTimeFrame);


    
    let   poolStatus = 1;
    if(curTimeFrame === 0)
        poolStatus = 0;
    else if(curTime > (timeframeStarted + curTimeFrame))
        poolStatus = 2;

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
                                Total SER Tokens
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sm={6} md={6} lg={12}>
                            <Typography variant="h4" align="center">
                                {totalSupply}
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
                <Grid item xs={12} sm={12} md={12} lg={3}>
                    <Grid container spacing={1}>
                        <Grid item xs={6} sm={6} md={6} lg={12}>
                            <Typography variant="subtitle2" align="center">
                                Stakers
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sm={6} md={6} lg={12}>
                            <Typography variant="h4" align="center">
                                {stakers}
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12}>
                    <Divider />
                </Grid>

                <Grid item xs={12} sm={12} md={12} lg={3}>
                    <Grid container spacing={1}>
                        <Grid item xs={6} sm={6} md={6} lg={12}>
                            <Typography variant="subtitle2" align="center">
                                Pool Reward
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sm={6} md={6} lg={12}>
                            <Typography variant="h4" align="center">
                                {poolReward}
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12} sm={12} md={12} lg={3}>
                    <Grid container spacing={1}>
                        <Grid item xs={6} sm={6} md={6} lg={12}>
                            <Typography variant="subtitle2" align="center">
                                Min Time Frame
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sm={6} md={6} lg={12}>
                            <Typography variant="h4" align="center">
                                {utils.formatDuration(minTimeFrame)}
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12} sm={12} md={12} lg={3}>
                    <Grid container spacing={1}>
                        <Grid item xs={6} sm={6} md={6} lg={12}>
                            <Typography variant="subtitle2" align="center">
                                Min Stake Period
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sm={6} md={6} lg={12}>
                            <Typography variant="h4" align="center">
                                {utils.formatDuration(minStakePeriod)}
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>


                <Grid item xs={12} sm={12} md={12} lg={3}>
                    <Grid container spacing={1}>
                        <Grid item xs={6} sm={6} md={6} lg={12}>
                            <Typography variant="subtitle2" align="center">
                                Current Time Frame
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sm={6} md={6} lg={12}>
                            <Typography variant="h4" align="center">
                                {utils.formatDuration(curTimeFrame)}
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12}>
                    <Divider />
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Grid container spacing={1}>

                        <Grid item xs={12} sm={12} md={12} lg={6}>
                            <Grid container spacing={1}>
                                <Grid item xs={6} sm={6} md={6} lg={6}>
                                    <Typography variant="subtitle2" align="center">
                                        Status
                                    </Typography>
                                </Grid>
                                <Grid item xs={6} sm={6} md={6} lg={6}>
                                    {
                                        poolStatus===0 && 
                                        <Typography variant="h4" align="center" color="warning.dark" >Not Started</Typography>
                                    }
                                    {
                                        poolStatus===1 && 
                                        <Typography variant="h4" align="center" color="success.dark" >In Progress</Typography>
                                    }
                                    {
                                        poolStatus===2 && 
                                        <Typography variant="h4" align="center" color="orange.dark" >Finished</Typography>
                                    }                            
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12} sm={12} md={12} lg={6}>
                            <Grid container spacing={1}>
                                <Grid item xs={12} sm={12} md={12} lg={6}>
                                    <Typography variant="h4" align="center">
                                        {strTimeframeStarted} ~ 
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={6}>
                                    <Typography variant="h4" align="center">
                                        {strTimeframeEnd}
                                    </Typography>                                        
                                </Grid>
                            </Grid>
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
