// material-ui
import { Link, Typography, Stack } from '@mui/material';

// ==============================|| FOOTER - AUTHENTICATION 2 & 3 ||============================== //

const AuthFooter = () => (
    <Stack direction="row" justifyContent="space-between">
        <Typography variant="subtitle2" component={Link} href="https://staking.scrtm.cloud" target="_blank" underline="hover">
        staking.scrtm.cloud
        </Typography>
        <Typography variant="subtitle2" component={Link} href="https://staking.scrtm.cloud" target="_blank" underline="hover">
            &copy; codedthemes.com
        </Typography>
    </Stack>
);

export default AuthFooter;
