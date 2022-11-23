import PropTypes from 'prop-types';
import React, {useEffect} from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import SubCard from 'ui-component/cards/SubCard';
import { Button, IconButton, Grid, Alert, TextField, Typography} from '@mui/material';

// assets
import LayersTwoToneIcon from '@mui/icons-material/LayersTwoTone';
import CopyAllOutlinedIcon from '@mui/icons-material/CopyAllOutlined';
import CloseIcon from '@mui/icons-material/Close';
import PoolInfo from './PoolInfo';

import utils from '../../utils/helpers/utils';
import stakelibs from '../../utils/helpers/stakelibs';
import stakingIdl from '../../utils/helpers/staking.json';

import * as web3 from "@solana/web3.js";
const anchor = require('@project-serum/anchor');


export default function InitPanel({network, programId, provider}) {

    const theme = useTheme();
    const [mintInfo, setMintInfo] = React.useState(null);

    const [stakeDataAddr, setStakeDataAddr] = React.useState("");
    const [stakeData, setStakeData] = React.useState(null);
    const [status, setStatus] = React.useState({is_error: false, message: ''});
   
    const [mintAddrText, setMintAddrText] = React.useState("");
    const [funderAuthorText, setFunderAuthorText] = React.useState("");

    const [minTimeFrame, setMinTimeFrame] = React.useState(86400);
    const [minTimeFrameText, setMinTimeFrameText] = React.useState("86400");

    const [minStakePeriod, setMinStakePeriod] = React.useState(86400);
    const [minStakePeriodText, setMinStakePeriodText] = React.useState("86400");



    const isPossibleInitialize=()=>{
        if(mintAddrText === "" || funderAuthorText =="")
            return false;
        if(minTimeFrame <= 0|| minStakePeriod <=0)
            return false;
        return true;
    }

    const onChangeMintAddr = async (mintAddr) =>{
        try{
            const stakeDataAddr = await utils.getStakingDataAccount(provider.publicKey, new web3.PublicKey(mintAddr), new web3.PublicKey(programId));
            const connection = new web3.Connection(network, 'confirmed');
            const anchorProvider = new anchor.Provider(connection, provider, 'confirmed');
            const program = new anchor.Program(stakingIdl, new web3.PublicKey(programId), anchorProvider);

            const stakeData = await utils.getStakingData(program, stakeDataAddr);

            const mintInfo = await utils.getMintInfo(connection, new web3.PublicKey(mintAddr));
            setStakeDataAddr(stakeDataAddr.toBase58());
            //setFunderAuthorText(stakeData.funderAuthority.toBase58());
            setMintInfo(mintInfo);            
            setStakeData(stakeData);
        }catch(e){
            console.log(e);
            setStakeDataAddr("");
            setStakeData(null);
            setMintInfo(null);
        }
    }

    const onInitialize = async() =>{
        if(!isPossibleInitialize())
            return;

        const connection = new web3.Connection(network, 'confirmed');
        const anchorProvider = new anchor.Provider(connection, provider, 'confirmed');
        const program = new anchor.Program(stakingIdl, new web3.PublicKey(programId), anchorProvider);

        let res = await stakelibs.initialize(
            program, 
            connection, 
            new web3.PublicKey(funderAuthorText), 
            new web3.PublicKey(mintAddrText),
            minTimeFrame, 
            minStakePeriod , 
            provider);

        if(res[0] !==null){
            setStatus({is_error: false, message: 'Initialize success!'});
            const stakeData = await utils.getStakingData(program, new web3.PublicKey(res[0]));
            setStakeData(stakeData);
        }else{
            setStatus({is_error: true, message: res[1]});
        }
    }

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <SubCard sx={{ boxShadow: 8 }}>
                        <Grid container spacing={2} justifyContent="center" alignItems="center">
                            <Grid item>
                                <h2>Initialize</h2>
                            </Grid>
                        </Grid>

                        <Grid container spacing={1} justifyContent="center" alignItems="center" sx={{mb: 2}}>
                            <Grid item xs={12} lg={10}>
                                <TextField
                                    fullWidth
                                    id="mint_address"
                                    name="mint_address"
                                    label="Mint Address"
                                    type="text"
                                    value={mintAddrText}
                                    onChange={(evt) => {                                        
                                        setMintAddrText(evt.target.value);
                                        onChangeMintAddr(evt.target.value);
                                    } }
                                />
                            </Grid>
                        </Grid>

                        <Grid container spacing={1} justifyContent="center" alignItems="center" sx={{mb: 2}}>
                            <Grid item xs={12} lg={10}>
                                <TextField
                                    fullWidth
                                    id="funder_author"
                                    name="funder_author"
                                    label="Fund Authority"
                                    type="text"
                                    value={funderAuthorText}
                                    onChange={(evt) => {                                        
                                        setFunderAuthorText(evt.target.value);
                                    } }
                                />
                            </Grid>
                        </Grid>

                        <Grid container spacing={1} justifyContent="center" alignItems="center">
                            <Grid item xs={12} lg={2}>
                                <TextField
                                    fullWidth
                                    id="minStakePeriod"
                                    name="minStakePeriod"
                                    label="Min Stake Period(secs)"
                                    type="number"
                                    InputProps={{ inputProps: { min: 1} }}
                                    value={minStakePeriodText}
                                    onChange={(evt) => {
                                        setMinStakePeriod(Number(evt.target.value) ? Number(evt.target.value): 0);
                                        setMinStakePeriodText(evt.target.value);
                                    } }
                                    error={ minStakePeriod < 1}
                                />
                            </Grid>
                            <Grid item xs={12} lg={2}>
                                <TextField
                                    fullWidth
                                    id="minTimeframe"
                                    name="minTimeframe"
                                    label="Min Timeframe (secs)"
                                    type="number"
                                    InputProps={{ inputProps: { min: 1} }}
                                    value={minTimeFrameText}
                                    onChange={(evt) => {
                                        setMinTimeFrame(Number(evt.target.value) ? Number(evt.target.value): 0);  
                                        setMinTimeFrameText(evt.target.value);
                                    } }
                                    error={ minTimeFrame < 1}
                                />
                            </Grid>
                            <Grid item xs={12} lg={4}>
                                <Grid container spacing={1} justifyContent="center">
                                    <Grid item>
                                        <Button 
                                            variant="outlined" 
                                            endIcon={<LayersTwoToneIcon/>}
                                            onClick={onInitialize} 
                                            disabled={!isPossibleInitialize()}>
                                            Initialize
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>                              
                        </Grid>

                        <Grid container spacing={1} justifyContent="center" sx={{mt:1}} alignItems="center">
                            <Grid item>
                                <Typography variant="subtitle2" align="center">
                                    Staking data account: 
                                </Typography>
                            </Grid>
                            <Grid item>
                                {stakeDataAddr !== '' &&
                                    <Alert
                                        severity="success"
                                        icon={false}
                                        sx={ { color: theme.palette.success.main } }
                                        action={
                                            <>
                                                <IconButton 
                                                    size="small" 
                                                    aria-label="Copy" 
                                                    onClick={()=> { 
                                                        //copy
                                                        navigator.clipboard.writeText(stakeDataAddr);
                                                    }}
                                                    color="inherit">
                                                    <CopyAllOutlinedIcon fontSize="small" />
                                                </IconButton>
                                            </>
                                        }>
                                        {stakeDataAddr}
                                    </Alert>
                                }
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
                {
                    stakeData !== null &&
                    <Grid item xs={12}>
                        <SubCard sx={{ boxShadow: 8 }}>
                            <PoolInfo mintInfo={mintInfo} stakeData={stakeData} ></PoolInfo>
                        </SubCard>
                    </Grid>
                }
            </Grid>


        </>
    );
}

InitPanel.propTypes = {
    network: PropTypes.string.isRequired,
    programId: PropTypes.string.isRequired,
    provider: PropTypes.any.isRequired,    
};
