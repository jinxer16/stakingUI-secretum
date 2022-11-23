import PropTypes from 'prop-types';
import React, {useEffect} from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import SubCard from 'ui-component/cards/SubCard';
import { Button, IconButton, Grid, Alert, TextField, Typography, Divider } from '@mui/material';

// assets
import LayersTwoToneIcon from '@mui/icons-material/LayersTwoTone';
import DonutLargeOutlinedIcon from '@mui/icons-material/DonutLargeOutlined';
import CloseIcon from '@mui/icons-material/Close';
import PoolInfo from './PoolInfo';

import utils from '../../utils/helpers/utils';
import stakelibs from '../../utils/helpers/stakelibs';
import stakingIdl from '../../utils/helpers/staking.json';

import * as web3 from "@solana/web3.js";
const anchor = require('@project-serum/anchor');


export default function FundingPanel({network, programId, stakeDataAddress, provider}) {

    const theme = useTheme();
    const [fundAmount, setFundAmount] = React.useState(1.0);
    const [fundAmountText, setFundAmountText] = React.useState("1.0");

    const [mintInfo, setMintInfo] = React.useState(null);
    const [stakeData, setStakeData] = React.useState(null);

    const apy = (stakeData? stakeData.apyMax: 0) / 100;
    const [apyMax, setApyMax] = React.useState(apy);
    const [apyMaxText, setApyMaxText] = React.useState(apy.toString());

    const [myBalance, setMyBalance] = React.useState(0);
    const [status, setStatus] = React.useState({is_error: false, message: ''});
   

    const minTimeFrame = stakeData? stakeData.minTimeframeInSecond.toNumber(): 0;
    const [timeframe, setTimeFrame] = React.useState(minTimeFrame);
    const [timeframeText, setTimeFrameText] = React.useState(minTimeFrame);

    const [nowTs, setNowTs] = React.useState(0);

    const isPossibleFunding = () =>{
        if(apyMax < 100 || apyMax >= 10000)
            return false;
        if(fundAmount <= 0 || fundAmount > myBalance)
            return false;
        if(timeframe <=0)
            return false;
        return true;
    }

    const onFund = async() =>{
        if(!isPossibleFunding())
            return;

        const connection = new web3.Connection(network, 'confirmed');
        const anchorProvider = new anchor.Provider(connection, provider, 'confirmed');
        const program = new anchor.Program(stakingIdl, new web3.PublicKey(programId), anchorProvider);
        const amount = fundAmount * Math.pow(10, mintInfo.decimals);


        let res = await stakelibs.funding(program, connection, new web3.PublicKey(stakeDataAddress), amount, apyMax, timeframe, provider);
        if(res[0] !==null &&  res[0]=== amount){
            setStatus({is_error: false, message: 'Fund success!'});
            const stakeData = await utils.getStakingData(program, new web3.PublicKey(stakeDataAddress));
            setStakeData(stakeData);
            setNowTs(await utils.getNowTs(connection));
        }else{
            setStatus({is_error: true, message: res[1]});
        }
    }

    const onRefund =  async() =>{
        const connection = new web3.Connection(network, 'confirmed');
        const anchorProvider = new anchor.Provider(connection, provider, 'confirmed');
        const program = new anchor.Program(stakingIdl, new web3.PublicKey(programId), anchorProvider);
        let res = await stakelibs.refunding(program, connection, new web3.PublicKey(stakeDataAddress), provider);
        if(res[0] !==null){
            setStatus({is_error: false, message: 'Refund success!'});
            const stakeData = await utils.getStakingData(program, new web3.PublicKey(stakeDataAddress));
            setStakeData(stakeData);
            setNowTs(await utils.getNowTs(connection));
        }else{
            setStatus({is_error: true, message: res[1]});
        }
    }

    const onReawardCalc = async() =>{
        const connection = new web3.Connection(network, 'confirmed');
        const anchorProvider = new anchor.Provider(connection, provider, 'confirmed');
        const program = new anchor.Program(stakingIdl, new web3.PublicKey(programId), anchorProvider);
        let res = await stakelibs.rewardCalculation(program, connection, new web3.PublicKey(stakeDataAddress), provider);
        if(res[0] !==null){
            setStatus({is_error: false, message: 'Reward calculation success!'});
            const stakeData = await utils.getStakingData(program, new web3.PublicKey(stakeDataAddress));
            setStakeData(stakeData);
            setNowTs(await utils.getNowTs(connection));
        }else{
            setStatus({is_error: true, message: res[1]});
        }
    }
    
   
    useEffect(() => {
        const init = async () => {
            const connection = new web3.Connection(network, 'confirmed');
            const anchorProvider = new anchor.Provider(connection, provider, 'confirmed');
            const program = new anchor.Program(stakingIdl, new web3.PublicKey(programId), anchorProvider);
            const stakeData = await utils.getStakingData(program, new web3.PublicKey(stakeDataAddress));
            if(stakeData != null)
            {
                const mintInfo = await utils.getMintInfo(connection, stakeData.mintAddress);
                setMintInfo(mintInfo);
                setStakeData(stakeData);
                setNowTs(await utils.getNowTs(connection));
                const decimals = Math.pow(10, mintInfo? mintInfo.decimals: 0);
                const myTokenAddress = await utils.getAssociatedTokenAddress(stakeData.mintAddress, provider.publicKey);
                let myBalance = 0;                
                myBalance = (await utils.getTokenAccountBalance(connection, myTokenAddress)) / decimals;
                setMyBalance(myBalance);
            }
        };
        init();
    }, []);


    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <SubCard sx={{ boxShadow: 8 }}>
                        <PoolInfo mintInfo={mintInfo} stakeData={stakeData} nowTs={nowTs}></PoolInfo>
                    </SubCard>
                </Grid>

                <Grid item xs={12}>
                    <SubCard sx={{ boxShadow: 8 }}>
                        <Grid container spacing={2} justifyContent="center" alignItems="center">
                            <Grid item>
                                <h2>Fund</h2>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} justifyContent="center" alignItems="center" sx={{mb: 2}}>
                            <Grid item lg={4}>
                                <Grid container spacing={2} justifyContent="center" alignItems="center">
                                    <Grid item xs={6} sm={6} md={6} lg={6}>
                                        <Typography variant="subtitle2" align="center">
                                            My Balance
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6} sm={6} md={6} lg={6}>
                                        <Typography variant="h4" align="center">
                                            {myBalance}
                                        </Typography>
                                    </Grid>
                                </Grid>                                    
                            </Grid>
                        </Grid>

                        <Grid container spacing={1} justifyContent="center" alignItems="center">
                            <Grid item xs={12} lg={2}>
                                <TextField
                                    fullWidth
                                    id="fund_amount"
                                    name="fund_amount"
                                    label="Max APY(%)"
                                    type="number"
                                    InputProps={{ inputProps: { min: 100, max: 9999 } }}
                                    value={apyMaxText}
                                    onChange={(evt) => {
                                        setApyMax(Number(evt.target.value) ? Number(evt.target.value): 0);  
                                        setApyMaxText(evt.target.value);
                                    } }
                                    error={ apyMax < 100 }
                                />                                    
                            </Grid>

                            <Grid item xs={12} lg={2}>
                                <TextField
                                    fullWidth
                                    id="fund_amount"
                                    name="fund_amount"
                                    label="Fund Amount"
                                    type="number"
                                    InputProps={{ inputProps: { min: 0, max: myBalance } }}
                                    value={fundAmountText}
                                    onChange={(evt) => {
                                        setFundAmount(Number(evt.target.value) ? Number(evt.target.value): 0);  
                                        setFundAmountText(evt.target.value);
                                    } }
                                    error={ fundAmount <= 0 || fundAmount > myBalance }
                                />                                    
                            </Grid>
                            <Grid item xs={12} lg={2}>
                                <TextField
                                    fullWidth
                                    id="timeframe"
                                    name="timeframe"
                                    label="Stake timeframe"
                                    type="number"
                                    InputProps={{ inputProps: { min: minTimeFrame} }}
                                    value={timeframeText}
                                    onChange={(evt) => {
                                        setTimeFrame(Number(evt.target.value) ? Number(evt.target.value): 0);  
                                        setTimeFrameText(evt.target.value);
                                    } }
                                    error={ timeframe < minTimeFrame}
                                />                                    
                            </Grid>
                            <Grid item xs={12} lg={4}>
                                <Grid container spacing={1} justifyContent="center">
                                    <Grid item>
                                        <Button 
                                            variant="outlined" 
                                            startIcon={<DonutLargeOutlinedIcon />}
                                            onClick={() => {setFundAmountText(myBalance); setFundAmount(myBalance); }} >
                                            Max
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Button 
                                            variant="outlined" 
                                            endIcon={<LayersTwoToneIcon/>}
                                            onClick={onFund} 
                                            disabled={!isPossibleFunding()}>
                                            Fund
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>                              
                        </Grid>

                        <Grid item xs={12} sx={{mt: 2}}>
                            <Divider />
                        </Grid>
                        <Grid container spacing={1} justifyContent="center" sx={{mt: 2}}>
                            <Grid item xs={12} lg={2}>
                                <Button 
                                    variant="outlined" 
                                    endIcon={<LayersTwoToneIcon/>}
                                    onClick={onRefund}>
                                    Refund
                                </Button>
                            </Grid>
                            <Grid item xs={12} lg={2}>
                                <Button 
                                    variant="outlined" 
                                    endIcon={<LayersTwoToneIcon/>}
                                    onClick={onReawardCalc}>
                                    Reward Calculate
                                </Button>
                            </Grid>
                        </Grid>

                        <Grid container spacing={1} justifyContent="center" sx={{mt:1}}>
                            <Grid item>
                                {status.message !== '' &&
                                    <Alert
                                        severity={status.is_error? "error": "success"}
                                        icon={false}
                                        sx={ status.is_error? { color: theme.palette.error.main }: { color: theme.palette.success.main } }
                                        action={
                                            <>
                                                <IconButton 
                                                    size="small" 
                                                    aria-label="close" 
                                                    onClick={()=> {setStatus({is_error: false, message: ''})}}
                                                    color="inherit">
                                                    <CloseIcon fontSize="small" />
                                                </IconButton>
                                            </>
                                        }>
                                        {status.message}
                                    </Alert>
                                }
                            </Grid>
                        </Grid>
                    </SubCard>

                </Grid>
            </Grid>


        </>
    );
}

FundingPanel.propTypes = {
    network: PropTypes.string.isRequired,
    programId: PropTypes.string.isRequired,
    stakeDataAddress: PropTypes.string.isRequired,
    provider: PropTypes.any.isRequired,    
};
