import PropTypes from 'prop-types';
import React, {useEffect} from 'react';

import { Link } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import SubCard from 'ui-component/cards/SubCard';
import { Button, IconButton, Grid, Alert, TextField, Tab, Tabs,Divider } from '@mui/material';

// assets
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import LayersTwoToneIcon from '@mui/icons-material/LayersTwoTone';
import CreditScoreOutlinedIcon from '@mui/icons-material/CreditScoreOutlined';
import LaunchOutlinedIcon from '@mui/icons-material/LaunchOutlined';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
import DonutLargeOutlinedIcon from '@mui/icons-material/DonutLargeOutlined';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import RestartAltOutlinedIcon from '@mui/icons-material/RestartAltOutlined';
import CloseIcon from '@mui/icons-material/Close';
import PlaylistRemoveOutlinedIcon from '@mui/icons-material/PlaylistRemoveOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import PoolInfo from './PoolInfo';
import MyInfo from './MyInfo';

import TabPanel, {a11yProps} from './TabPanel';

import utils from '../../utils/helpers/utils';
import stakelibs from '../../utils/helpers/stakelibs';
import stakingIdl from '../../utils/helpers/staking.json';

import * as web3 from "@solana/web3.js";
const anchor = require('@project-serum/anchor');


////////////////////////////////
export default function FlexiblePoolPanel({network, programId, stakeDataAddress}) {

    let wallet = null;
    if ("solana" in window && window.solana.isPhantom) {                
        wallet = window.solana;
    } else {
        window.open("https://phantom.app/", "_blank")
    }
    const provider = wallet;


    const theme = useTheme();
    const [tabIdx, setTabIdx] = React.useState(0);
    const [stakeAmount, setStakeAmount] = React.useState(1.0);
    const [stakeAmountText, setStakeAmountText] = React.useState("1.0");
    const [connectWalletText, setConnectWalletText] = React.useState("Connect Wallet");

    const [unstakeAmount, setUnstakeAmount] = React.useState(0);
    const [unstakeAmountText, setUnstakeAmountText] = React.useState("0");
    const [claimAmount, setClaimAmount] = React.useState(0);
    const [claimAmountText, setClaimAmountText] = React.useState("0");

    const [mintInfo, setMintInfo] = React.useState(null);
    const [stakeData, setStakeData] = React.useState(null);
    const [nowTs, setNowTs] = React.useState(0);

    const [myStaked, setMyStaked] = React.useState(0);
    const [myClaimable, setMyClaimable] = React.useState(0);
    const [myClaimableInPool, setMyClaimableInPool] = React.useState(0);
    const [myBalance, setMyBalance] = React.useState(0);
    const [myLockedBy, setMyLockedBy] = React.useState("~");

    const [status, setStatus] = React.useState({is_error: false, message: ''});
    
    const name = "staking";
    const isConnectedWallet = () =>{
        if(provider == null)
            return false;
        if(!provider.isConnected)
            return false;
        if(provider.publicKey == null)
            return false;
        return true;
    }

    const isPossibleStaking = () =>{
        if(!isConnectedWallet()) 
            return false;
        if(stakeAmount <= 0 || stakeAmount > myBalance)
            return false;
        return true;
    }

    const isPossibleUnstaking = () =>{
        if(!isConnectedWallet()) 
            return false;
        if(unstakeAmount <= 0 || unstakeAmount > myStaked)
            return false;
        return true;
    }

    const isPossibleClaiming = () =>{
        if(!isConnectedWallet()) 
            return false;
        if(claimAmount <= 0 || claimAmount > myClaimable)
            return false;
        return true;
    }

    const onStake = async() =>{
        if(!isPossibleStaking())
            return;

        const connection = new web3.Connection(network, 'confirmed');
        const anchorProvider = new anchor.Provider(connection, provider, 'confirmed');
        const program = new anchor.Program(stakingIdl, new web3.PublicKey(programId), anchorProvider);
        const amount = stakeAmount * Math.pow(10, mintInfo.decimals);
        let res = await stakelibs.staking(program, connection, new web3.PublicKey(stakeDataAddress), amount, provider);
        if(res[0] !==null &&  res[0]=== amount){
            await onAccountsUpdate();
            setStatus({is_error: false, message: 'Stake success!'});
        }else{
            setStatus({is_error: true, message: res[1]});
        }
    }

    const onUnstake = async() =>{
        if(!isPossibleUnstaking())
            return;

        const connection = new web3.Connection(network, 'confirmed');
        const anchorProvider = new anchor.Provider(connection, provider, 'confirmed');
        const program = new anchor.Program(stakingIdl, new web3.PublicKey(programId), anchorProvider);
        const amount = unstakeAmount * Math.pow(10, mintInfo.decimals);
        let res = await stakelibs.unstaking(program, connection, new web3.PublicKey(stakeDataAddress), amount, provider);
        if(res[0] !==null &&  res[0]=== amount){
            await onAccountsUpdate();
            setStatus({is_error: false, message: 'Unstake success!'});
        }else{
            setStatus({is_error: true, message: res[1]});
        }
    }

    const onClaim = async() =>{
        if(!isPossibleClaiming())
            return;

        const connection = new web3.Connection(network, 'confirmed');
        const anchorProvider = new anchor.Provider(connection, provider, 'confirmed');
        const program = new anchor.Program(stakingIdl, new web3.PublicKey(programId), anchorProvider);
        const amount = claimAmount * Math.pow(10, mintInfo.decimals);
        let res = await stakelibs.claimReward(program, connection, new web3.PublicKey(stakeDataAddress), amount, provider);
        if(res[0] !==null &&  res[0]=== amount){
            await onAccountsUpdate();
            setStatus({is_error: false, message: 'Claiming success!'});
        }else{
            setStatus({is_error: true, message: res[1]});
        }
    }


    const onConnectWallet = async () => {
        if(provider === null)
            return;
        if(isConnectedWallet() === true)
        {
            provider.disconnect();
        }else{
            provider.on('connect', onAccountsUpdate);
            provider.on('disconnect', onAccountsUpdate);
            provider.connect({ onlyIfTrusted: false });
        }
    };
    
    
    const onAccountsUpdate = async() => {    
        if(isConnectedWallet())
        {
            setConnectWalletText("Disconnect Wallet");

            //get stake state
            const connection = new web3.Connection(network, 'confirmed');
            const anchorProvider = new anchor.Provider(connection, provider, 'confirmed');
            const program = new anchor.Program(stakingIdl, new web3.PublicKey(programId), anchorProvider);
            const stakeData = await utils.getStakingData(program, new web3.PublicKey(stakeDataAddress));
            const stakeStateAccount = await utils.getStakingStateAccount(new web3.PublicKey(stakeDataAddress), provider.publicKey, new web3.PublicKey(programId));
            const stakeState = await utils.getStakingState(program, stakeStateAccount);

            let myBalance = 0;
            const decimals = Math.pow(10, mintInfo? mintInfo.decimals: 9);
            if(stakeData !==null)
            {
                const myTokenAddress = await utils.getAssociatedTokenAddress(stakeData.mintAddress, provider.publicKey);
                myBalance = (await utils.getTokenAccountBalance(connection, myTokenAddress)) / decimals;
            }
            let myStaked = 0;
            let myClaimable = 0;
            let myClaimableInPool = 0;            
            let myLockedBy = "~";
            const nowTs = await utils.getNowTs(connection);
            const curTime = Math.floor(Date.now() / 1000);
            const diffTime = curTime - nowTs;        

            if(stakeData!==null && stakeState !==null)
            {
                myStaked = stakeState.totalStaked.toNumber() / decimals;
                myClaimable = utils.getGainedReward(stakeData, stakeState) / decimals;  

                let lastStaked = stakeState.lastStaked.toNumber() + diffTime;
                let lockedBy = lastStaked + stakeData.minStakePeriod.toNumber();
                myLockedBy = utils.unixTime2UTC(lockedBy);

                let timeFrameStart = stakeData.timeframeStarted.toNumber();
                let timeFrameEnd = timeFrameStart + stakeData.timeframeInSecond.toNumber();

                //locked by can't exceed the pool end timeframe.
                if(stakeData.timeframeInSecond.toNumber() > 0)
                {
                    if((timeFrameEnd +  diffTime) < lockedBy)
                        myLockedBy = utils.unixTime2UTC(timeFrameEnd +  diffTime);
                }

                //find stakerState
                let stakerState = utils.getStakerState(stakeData, stakeState.myCrc);
                if(stakerState !== null && stakeData.timeframeInSecond > 0){
                    //check totaol staked time is big than min_stake_period
                    let totalStakedInSeconds = nowTs - stakerState.stakedTime;

                    if (totalStakedInSeconds > stakeData.minStakePeriod.toNumber()){
                        let lastCalcTime = stakerState.lastCalcTime.toNumber();
                        if(lastCalcTime < timeFrameStart)
                            lastCalcTime = timeFrameStart;
                        
                        let stakedInSeconds = 0;
                        if(nowTs > timeFrameEnd)
                            stakedInSeconds = timeFrameEnd - lastCalcTime;
                        else
                            stakedInSeconds = nowTs - lastCalcTime;

                        if(stakedInSeconds > 0)
                        {
                            myClaimableInPool = utils.calculateReward(stakeData.apyMax, 
                                stakeData.totalStaked.toNumber(), stakeData.poolReward.toNumber(), 
                                stakeData.timeframeStarted.toNumber(), 
                                stakeData.timeframeStarted.toNumber() + stakeData.timeframeInSecond.toNumber(),
                                stakerState.stakedAmount.toNumber(),  stakedInSeconds) / decimals;    
                        }

                    }
                }
            }

            setStakeData(stakeData);
            setNowTs(nowTs);
            setMyStaked(myStaked);
            setMyClaimable(myClaimable);
            setMyClaimableInPool(myClaimableInPool);
            setMyBalance(myBalance);
            setMyLockedBy(myLockedBy);
        }
        else
        {
            setConnectWalletText("Connect Wallet");
            setMyStaked(0);
            setMyClaimable(0);
            setMyBalance(0);
        }
        //window.dispatchEvent(new Event('user-wallet:changed'))
        //this.updateTargets()
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
            }
        };
        init();

        setInterval(async () => {
            try{
                await onAccountsUpdate();
            }catch(e){}
        }, 5 * 60000);

    }, []);


    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Alert  icon={<InfoOutlinedIcon sx={{color: '#5267e3'}}/>} severity="info" sx={{ color: "#bdc8f0" }}>
                        Please note that you are agreeing to stake your tokens for minimum of 8 weeks. Unstaking your tokens before the 8 week window will incur a 20% charge.
                    </Alert>
                </Grid>

                <Grid item xs={12}>
                    <SubCard >
                        <PoolInfo mintInfo={mintInfo} stakeData={stakeData} nowTs={nowTs}></PoolInfo>
                    </SubCard>
                </Grid>

                <Grid item xs={12}>
                    <SubCard >

                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <MyInfo 
                                    myStaked={myStaked} 
                                    myClaimable = {myClaimable} 
                                    myBalance={myBalance} 
                                    myClaimableInPool = {myClaimableInPool} 
                                    myLockedBy={myLockedBy}>
                                </MyInfo>
                            </Grid>            
                            <Grid item xs={12}>
                                <Divider />
                            </Grid>                

                            <Grid item xs={12}>
                                <Tabs
                                    value={tabIdx}
                                    variant="fullWidth"
                                    onChange={(event, newValue) => {setTabIdx(newValue)}}
                                    textColor="primary"
                                    TabIndicatorProps={{style: {background:'#5267e3'}}}
                                    sx={{
                                        mt: 3,
                                        mb: 3,
                                        '& a': {
                                            minHeight: 'auto',
                                            minWidth: 10,
                                            py: 1.5,
                                            px: 1,
                                            mr: 2.2,
                                            color: theme.palette.grey[600],
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        },
                                        '& a.Mui-selected': {
                                            color: '#d7dcec'
                                        },
                                        '& a > svg': {
                                            mb: '0px !important',
                                            mr: 1.1
                                        }
                                    }}
                                >
                                    <Tab
                                        component={Link}
                                        to="#"
                                        icon={<AccountBalanceWalletOutlinedIcon sx={{ fontSize: '1.3rem' }} />}
                                        label="Staking"
                                        {...a11yProps(name, 0)}
                                    />
                                    <Tab
                                        component={Link}
                                        to="#"
                                        icon={<ExitToAppOutlinedIcon sx={{ fontSize: '1.3rem' }} />}
                                        label="UnStake"
                                        {...a11yProps(name, 1)}
                                    />
                                    <Tab
                                        component={Link}
                                        to="#"
                                        icon={<EmojiEventsOutlinedIcon sx={{ fontSize: '1.3rem' }} />}
                                        label="Claim"
                                        {...a11yProps(name, 2)}
                                    />
                                </Tabs>
                                <TabPanel prefix={name} value={tabIdx} index={0}>
                                    <Grid container spacing={1} justifyContent="center" alignItems="center">
                                        <Grid item xs={12} lg={2}>
                                            <TextField
                                                fullWidth
                                                id="stake_amount"
                                                name="stake_amount"
                                                label="Stake Amount"
                                                type="number"
                                                InputProps={{ inputProps: { min: 0, max: myBalance } }}
                                                value={stakeAmountText}
                                                onChange={(evt) => {
                                                    setStakeAmount(Number(evt.target.value) ? Number(evt.target.value): 0);  
                                                    setStakeAmountText(evt.target.value);
                                                } }
                                                error={ stakeAmount <= 0 || stakeAmount > myBalance }
                                            />                                    
                                        </Grid>
                                        <Grid item xs={12} lg={4}>
                                            <Grid container spacing={1} justifyContent="center">
                                                <Grid item>
                                                    <Button 
                                                        variant="outlined" sx={{color: "#d7dcec", borderBlockColor: "#5267e3", borderRadius: 50}}
                                                        startIcon={<DonutLargeOutlinedIcon />}
                                                        onClick={() => {setStakeAmountText(myBalance); setStakeAmount(myBalance); }} >
                                                        Max
                                                    </Button>
                                                </Grid>
                                                <Grid item>
                                                    <Button                                                     
                                                        variant="outlined" sx={{color: "#d7dcec", borderBlockColor: "#5267e3", borderRadius: 50}} 
                                                        endIcon={<LayersTwoToneIcon/>}
                                                        onClick={onStake} 
                                                        disabled={!isPossibleStaking()}>
                                                        Stake
                                                    </Button>
                                                </Grid>
                                                <Grid item>
                                                    <Button 
                                                        variant="outlined" sx={{color: "#d7dcec", borderBlockColor: "#5267e3", borderRadius: 50}}
                                                        onClick={() => {
                                                            setStakeAmount(1.0);
                                                            setStakeAmountText("1.0");
                                                        }} >
                                                        <RestartAltOutlinedIcon />
                                                        Reset
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </Grid>                              
                                    </Grid>
                                </TabPanel>
                                <TabPanel prefix={name} value={tabIdx} index={1}>
                                    <Grid container spacing={1} justifyContent="center" alignItems="center">
                                        <Grid item xs={12} lg={2}>
                                            <TextField
                                                fullWidth
                                                id="unstake_amount"
                                                name="unstake_amount"
                                                label="Unstake Amount"
                                                type="number"
                                                InputProps={{ inputProps: { min: 0, max: myStaked } }}
                                                value={unstakeAmountText}
                                                onChange={(evt) => {
                                                    setUnstakeAmount(Number(evt.target.value) ? Number(evt.target.value): 0);  
                                                    setUnstakeAmountText(evt.target.value);
                                                } }
                                                error={ unstakeAmount <= 0 || unstakeAmount > myStaked }
                                            />                                    
                                        </Grid>
                                        <Grid item xs={12} lg={4}>
                                            <Grid container spacing={1} justifyContent="center">
                                                <Grid item>
                                                    <Button 
                                                        variant="outlined" sx={{color: "#d7dcec", borderBlockColor: "#5267e3", borderRadius: 50}} 
                                                        startIcon={<DonutLargeOutlinedIcon />}
                                                        onClick={() => {setUnstakeAmountText(myStaked); setUnstakeAmount(myStaked); }} >
                                                        Max
                                                    </Button>
                                                </Grid>
                                                <Grid item>
                                                    <Button 
                                                        variant="outlined" sx={{color: "#d7dcec", borderBlockColor: "#5267e3", borderRadius: 50}} 
                                                        endIcon={<PlaylistRemoveOutlinedIcon />}
                                                        onClick={onUnstake} 
                                                        disabled={!isPossibleUnstaking()}>
                                                        Unstake
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </Grid>                         
                                    </Grid>                            
                                </TabPanel>
                                <TabPanel prefix={name} value={tabIdx} index={2}>
                                    <Grid container spacing={1} justifyContent="center" alignItems="center">
                                        <Grid item xs={12} lg={2}>
                                            <TextField
                                                fullWidth
                                                id="claim_amount"
                                                name="claim_amount"
                                                label="Claim Amount"
                                                type="number"
                                                InputProps={{ inputProps: { min: 0, max: myClaimable } }}
                                                value={claimAmountText}
                                                onChange={(evt) => {
                                                    setClaimAmount(Number(evt.target.value) ? Number(evt.target.value): 0);  
                                                    setClaimAmountText(evt.target.value);
                                                } }
                                                error={ claimAmount <= 0 || claimAmount > myClaimable }
                                            />                                    
                                        </Grid>
                                        <Grid item xs={12} lg={4}>
                                            <Grid container spacing={1} justifyContent="center">
                                                <Grid item>
                                                    <Button 
                                                        variant="outlined" sx={{color: "#d7dcec", borderBlockColor: "#5267e3", borderRadius: 50}} 
                                                        startIcon={<DonutLargeOutlinedIcon />}
                                                        onClick={() => {setClaimAmountText(myClaimable); setClaimAmount(myClaimable); }} >
                                                        Max
                                                    </Button>
                                                </Grid>
                                                <Grid item>
                                                    <Button 
                                                        variant="outlined" sx={{color: "#d7dcec", borderBlockColor: "#5267e3", borderRadius: 50}} 
                                                        endIcon={<CreditScoreOutlinedIcon />}
                                                        onClick={onClaim} 
                                                        disabled={!isPossibleClaiming()}>
                                                        Claim
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </Grid>                         
                                    </Grid>                            
                                </TabPanel>
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

                            <Grid item>
                                <Button 
                                    variant="contained" sx={{background: "#5267e3", borderRadius: 50}}
                                    size="large" 
                                    onClick={onConnectWallet} 
                                    startIcon={<LaunchOutlinedIcon />}>
                                    {connectWalletText}
                                </Button>
                            </Grid>
                        </Grid>
                    </SubCard>

                </Grid>
            </Grid>


        </>
    );
}

FlexiblePoolPanel.propTypes = {
    network: PropTypes.string.isRequired,
    programId: PropTypes.string.isRequired,
    stakeDataAddress: PropTypes.string.isRequired,
};
