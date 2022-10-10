import { useState } from 'react';
import axios from 'axios';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Dispatch, SetStateAction, FC } from 'react';
import { Alert, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
}

export const Login: FC<LoginProps> = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [errorSnackbarMessage] = useState('Login failed');

  const navigate = useNavigate();

  const handleUsernameChange = (event: any) => {
    setUsername(event.target.value);
  };
  const handlePasswordChange = (event: any) => {
    setPassword(event.target.value);
  };

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const response = await axios.post(
        'https://order-pizza-api.herokuapp.com/api/auth',
        {
          username,
          password,
        }
      );
      const token = response.data.access_token;
      localStorage.setItem('jwt', JSON.stringify(token));
      setIsLoggedIn(true);
      navigate('/order');
    } catch (err: any) {
      setOpenErrorSnackbar(true);
      console.log(err.message);
    } finally {
      setIsLoggingIn(false);
      setUsername('');
      setPassword('');
    }
  };

  const closeErrorSnackbar = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenErrorSnackbar(false);
  };

  return (
    <Container component='main' maxWidth='xs'>
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Sign In
        </Typography>
        <Box sx={{ mt: 1 }}>
          <TextField
            margin='normal'
            required
            fullWidth
            label='Username'
            name='username'
            autoFocus
            onChange={handleUsernameChange}
          />
          <TextField
            margin='normal'
            required
            fullWidth
            name='password'
            label='Password'
            type='password'
            onChange={handlePasswordChange}
          />
          <Button
            type='submit'
            fullWidth
            variant='contained'
            sx={{ mt: 3, mb: 2 }}
            onClick={handleLogin}
            disabled={isLoggingIn}
          >
            Sign In
          </Button>
        </Box>
      </Box>
      <Snackbar
        open={openErrorSnackbar}
        autoHideDuration={5000}
        onClose={closeErrorSnackbar}
        message={errorSnackbarMessage}
      >
        <Alert
          onClose={closeErrorSnackbar}
          severity='error'
          sx={{ width: '100%' }}
        >
          {errorSnackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};
