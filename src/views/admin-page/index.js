// material-ui
// project imports
import React from 'react';
import MainCard from 'ui-component/cards/MainCard';
import { Button, Grid, Tab, Tabs} from '@mui/material';
import utils from '../../utils/helpers/utils';
import stakingIdl from '../../utils/helpers/staking.json';
import pools from '../../utils/helpers/pools.json';
import LaunchOutlinedIcon from '@mui/icons-material/LaunchOutlined';

import TokenOutlinedIcon from '@mui/icons-material/TokenOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import TabPanel, {a11yProps} from './TabPanel';
import { useTheme } from '@mui/material/styles';
import { Link } from 'react-router-dom';

import FormControl from 'ui-component/extended/Form/FormControl';
import FormControlSelect from 'ui-component/extended/Form/FormControlSelect';


import InitPanel from './InitPanel';
import FundingPanel from './FundingPanel';
import SettingPanel from './SettingPanel';

import * as web3 from "@solana/web3.js";
const anchor = require('@project-serum/anchor');




export default function AdminPage(){
    let wallet = null;
    if ("solana" in window && window.solana.isPhantom) {                
        wallet = window.solana;
    } else {
        window.open("https://phantom.app/", "_blank")
    }

    const [poolIdx, setPool] = React.useState(0);

    const provider = wallet;
    const network = pools[poolIdx].network;
    const stakeDataAddress = pools[poolIdx].stakeDataAddress;
    const programId = pools[poolIdx].programId;

    const [connectWalletText, setConnectWalletText] = React.useState("Connect Wallet");
    const [stakeData, setStakeData] = React.useState(null);


    const theme = useTheme();
    const [value, setValue] = React.useState(0);    
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const name = "admin";

    const isFunder = () =>  
    {
        if(stakeData == null)
            return false;
        if(!isConnectedWallet())
            return false;
        
        return stakeData.funderAuthority.toBase58() === provider.publicKey.toBase58();
    }

    const isAdmin = () =>  
    {
        if(stakeData == null)
            return false;
        if(!isConnectedWallet())
            return false;
        
        return stakeData.initializer.toBase58() === provider.publicKey.toBase58();
    }


    const isConnectedWallet = () =>{
        if(provider == null)
            return false;
        if(!provider.isConnected)
            return false;
        if(provider.publicKey == null)
            return false;
        return true;
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

            if(stakeDataAddress != "")
            {
                const stakeData = await utils.getStakingData(program, new web3.PublicKey(stakeDataAddress));
                setStakeData(stakeData);
            }
        }
        else
        {
            setConnectWalletText("Connect Wallet");
        }
    }

    const onChangePool = async(value) =>{
        setPool(Number(value));
    }


    return (
        <>
            <MainCard title="Admin">
                <Grid container spacing={2} justifyContent="flex-end">
                    { !isConnectedWallet() &&
                        <Grid item lg={4}>
                            <FormControlSelect 
                                currencies={pools} 
                                selected={pools[0].value} 
                                captionLabel="Staking Pools" 
                                onChange={onChangePool}
                            />                    
                        </Grid>
                    }
                    <Grid item>
                        <Button variant="contained" 
                            size="large" 
                            onClick={onConnectWallet} 
                            startIcon={<LaunchOutlinedIcon />}>
                            {connectWalletText}
                        </Button>
                    </Grid>
                </Grid>

                <Tabs
                    value={value}
                    variant="fullWidth"
                    onChange={handleChange}
                    textColor="primary"
                    TabIndicatorProps={{style: {background:'#5267e3'}}}
                    sx={{
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
                    {
                        isConnectedWallet() &&
                        <Tab
                        component={Link}
                        to="#"
                        icon={<TokenOutlinedIcon sx={{ fontSize: '1.3rem' }} />}
                        label="Initialize"
                        {...a11yProps(name, 0)}
                        />

                    }   
                    {
                        isFunder() &&
                        <Tab
                            component={Link}
                            to="#"
                            icon={<TokenOutlinedIcon sx={{ fontSize: '1.3rem' }} />}
                            label="Funding"
                            {...a11yProps(name, 1)}
                        />
                    }

                    {
                        isAdmin() &&
                        <Tab
                            component={Link}
                            to="#"
                            icon={<SettingsOutlinedIcon sx={{ fontSize: '1.3rem' }} />}
                            label="Setting"
                            {...a11yProps(name, 2)}
                        />
                    }
                </Tabs>
                {
                    isConnectedWallet() &&
                    <TabPanel prefix={name} value={value} index={0}>
                        <InitPanel 
                            network={network} 
                            programId={programId}                            
                            provider={provider} />
                    </TabPanel>
                }
                {
                    isFunder() &&
                    <TabPanel prefix={name} value={value} index={1}>
                        <FundingPanel 
                            network={network} 
                            programId={programId}
                            stakeDataAddress={stakeDataAddress}
                            provider={provider} />
                    </TabPanel>
                }
                {
                    isAdmin() &&
                    <TabPanel prefix={name} value={value} index={2}>
                        <SettingPanel 
                            network={network} 
                            programId={programId}
                            stakeDataAddress={stakeDataAddress}
                            provider={provider} />
                    </TabPanel>
                }
            </MainCard>
        </>        
    );
}

