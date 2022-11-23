import PropTypes from 'prop-types';
import React, {useEffect} from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import SubCard from 'ui-component/cards/SubCard';
import { Button, IconButton, Grid, Alert, TextField} from '@mui/material';

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


export default function SettingPanel({network, programId, stakeDataAddress, provider}) {

    const theme = useTheme();

    const [mintInfo, setMintInfo] = React.useState(null);
    const [stakeData, setStakeData] = React.useState(null);
    const [nowTs, setNowTs] = React.useState(0);

    const minStakePeriod0 = stakeData? stakeData.minStakePeriod: 1;
    const [minStakePeriod, setMinStakePeriod] = React.useState(minStakePeriod0);
    const [minStakePeriodText, setMinStakePeriodText] = React.useState(minStakePeriod0.toString());


    const [status, setStatus] = React.useState({is_error: false, message: ''});
    


    const isPossibleSetting = () =>{
        if(minStakePeriod <= 0)
            return false;
        return true;
    }

    const onSetting = async() =>{
        if(!isPossibleSetting())
            return;

        const connection = new web3.Connection(network, 'confirmed');
        const anchorProvider = new anchor.Provider(connection, provider, 'confirmed');
        const program = new anchor.Program(stakingIdl, new web3.PublicKey(programId), anchorProvider);

        let res = await stakelibs.changeSetting(program, connection, new web3.PublicKey(stakeDataAddress), minStakePeriod, provider);
        if(res[0] !==null){
            setStatus({is_error: false, message: 'Setting success!'});
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
                                <h2>Setting</h2>
                            </Grid>
                        </Grid>

                        <Grid container spacing={1} justifyContent="center" alignItems="center">
                            <Grid item xs={12} lg={2}>
                                <TextField
                                    fullWidth
                                    id="timeframe"
                                    name="timeframe"
                                    label="Min Stake Period (secs)"
                                    type="number"
                                    InputProps={{ inputProps: { min: 1} }}
                                    value={minStakePeriodText}
                                    onChange={(evt) => {
                                        setMinStakePeriod(Number(evt.target.value) ? Number(evt.target.value): 0);  
                                        setMinStakePeriodText(evt.target.value);
                                    } }
                                    error={ minStakePeriod <= 0}
                                />                                    
                            </Grid>
                            <Grid item xs={12} lg={4}>
                                <Grid container spacing={1} justifyContent="center">
                                    <Grid item>
                                        <Button 
                                            variant="outlined" 
                                            startIcon={<DonutLargeOutlinedIcon />}
                                            onClick={() => {
                                                setMinStakePeriod(minStakePeriod0); 
                                                setMinStakePeriodText(minStakePeriod0);
                                            }} >
                                            Reset
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Button 
                                            variant="outlined" 
                                            endIcon={<LayersTwoToneIcon/>}
                                            onClick={onSetting} 
                                            disabled={!isPossibleSetting()}>
                                            Setting
                                        </Button>
                                    </Grid>
                                </Grid>
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

SettingPanel.propTypes = {
    network: PropTypes.string.isRequired,
    stakeDataAddress: PropTypes.string.isRequired,
    provider: PropTypes.any.isRequired,
    programId: PropTypes.string.isRequired,
};
