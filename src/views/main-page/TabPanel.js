import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';

export default function TabPanel({ children, prefix, value, index, ...other }) {
    return (
        <div role="tabpanel" hidden={value !== index} id={`${prefix}-tabpanel-${index}`} aria-labelledby={`${prefix}-tab-${index}`} {...other}>
            {value === index && (
                <Box
                    sx={{
                        //p: 3
                    }}
                >
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired
};

export function a11yProps(prefix, index) {
    return {
        id: `${prefix}-tab-${index}`,
        'aria-controls': `${prefix}-tabpanel-${index}`
    };
}
