import React from 'react';
import { Link } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Tab, Tabs} from '@mui/material';

import FlexiblePoolPanel from './FlexiblePoolPanel';

// assets
import TokenOutlinedIcon from '@mui/icons-material/TokenOutlined';
import ContactSupportOutlinedIcon from '@mui/icons-material/ContactSupportOutlined';

import TabPanel, {a11yProps} from './TabPanel';
import pools from '../../utils/helpers/pools.json';

export default function MainTab() {
    const theme = useTheme();
    const [value, setValue] = React.useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const name = "main";

    const poolIdx = 1;
    const network = pools[poolIdx].network;
    const stakeDataAddress = pools[poolIdx].stakeDataAddress;
    const programId = pools[poolIdx].programId;

    return (
        <>
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
                <Tab
                    component={Link}
                    to="#"
                    icon={<TokenOutlinedIcon sx={{ fontSize: '1.3rem' }} />}
                    label="FlexiblePool"
                    {...a11yProps(name, 0)}
                />
                <Tab
                    component={Link}
                    to="#"
                    icon={<ContactSupportOutlinedIcon sx={{ fontSize: '1.3rem' }} />}
                    label="Help"
                    {...a11yProps(name, 1)}
                />
            </Tabs>
            <TabPanel prefix={name} value={value} index={0}>
                <FlexiblePoolPanel 
                    network={network} 
                    programId={programId}
                    stakeDataAddress={stakeDataAddress}/>
            </TabPanel>
            <TabPanel prefix={name} value={value} index={1}>
                Anim pariah&apos;s cliche reprehended, enid elusion high life accusals terry richardson ad squid. 3 wolf moon official auth,
                non cuspidate skateboard dolor brunch. Food truck quinoa nescient labarum elusion.
            </TabPanel>
        </>
    );
}
