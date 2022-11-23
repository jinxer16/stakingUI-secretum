import PropTypes from 'prop-types';
import { Grid, Typography } from '@mui/material';
import utils from '../../utils/helpers/utils';

export default function MyInfo({myBalance, myStaked, myClaimable, myClaimableInPool, myLockedBy}) {
    return (
        <>
            <Grid container spacing={1} justifyContent="center" alignItems="center">
                <Grid item>
                    <h2>My Balance</h2>
                </Grid>
            </Grid>

            <Grid container spacing={1}>                            
                <Grid item xs={12} sm={12} md={12} lg={2}>
                    <Grid container spacing={1}>
                        <Grid item xs={6} sm={6} md={6} lg={12}>
                            <Typography variant="subtitle2" align="center">
                                SER Tokens
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sm={6} md={6} lg={12}>
                            <Typography variant="h4" align="center">
                                {utils.formatNumber(myBalance)}
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12} sm={12} md={12} lg={2}>
                    <Grid container spacing={1}>
                        <Grid item xs={6} sm={6} md={6} lg={12}>
                            <Typography variant="subtitle2" align="center">
                                xSER Tokens
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sm={6} md={6} lg={12}>
                            <Typography variant="h4" align="center">
                                {utils.formatNumber(myStaked)}
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12} sm={12} md={12} lg={4}>
                    <Grid container spacing={1}>
                        <Grid item xs={6} sm={6} md={6} lg={12}>
                            <Typography variant="subtitle2" align="center">
                                Locked by
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sm={6} md={6} lg={12}>
                            <Typography variant="h4" align="center">
                                {myLockedBy}
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12} sm={12} md={12} lg={2}>
                    <Grid container spacing={1}>
                        <Grid item xs={6} sm={6} md={6} lg={12}>
                            <Typography variant="subtitle2" align="center">
                                Claimable Rewards
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sm={6} md={6} lg={12}>
                            <Typography variant="h4" align="center">
                                {
                                    utils.formatNumber(myClaimable)
                                }
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12} sm={12} md={12} lg={2}>
                    <Grid container spacing={1}>
                        <Grid item xs={6} sm={6} md={6} lg={12}>
                            <Typography variant="subtitle2" align="center">
                                Earned Rewards
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sm={6} md={6} lg={12}>
                            <Typography variant="h4" align="center">
                                {                                    
                                    utils.formatNumber(myClaimableInPool)
                                }                                
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>                

            </Grid>
        </>
    );
}

MyInfo.propTypes = {
    myBalance: PropTypes.number, 
    myStaked: PropTypes.number, 
    myClaimable: PropTypes.number,
    myClaimableInPool: PropTypes.number,
    myLockedBy: PropTypes.string,        
};
