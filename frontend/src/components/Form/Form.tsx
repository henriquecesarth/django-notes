import { useState } from 'react';
import { api } from '../../utils/api';
import { useNavigate } from 'react-router';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../../constants';
import Input from '../Input/Input';
import Button from '../Button/Button';
import LoadingIndicator from '../LoadingIndicator/LoadingIndicator';
import RouterLink from '../RouterLink/RouterLink';
import styles from './Form.module.css';

type FormProps = {
  route: string;
  method: string;
};

const Form = ({ route, method }: FormProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(
    localStorage.getItem('remember') === 'true'
  );

  const [errorUsername, setErrorUsername] = useState('');
  const [errorPassword, setErrorPassword] = useState('');
  const [errorConfirmPassword, setErrorConfirmPassword] = useState('');

  const [usernameColor, setUsernameColor] = useState('');
  const [passwordColor, setPasswordColor] = useState('');
  const [confirmPasswordColor, setConfirmPasswordColor] = useState('');

  const validate = () => {
    if (username.length >= 8) {
      setErrorUsername('');
      setUsernameColor('');
    } else {
      setErrorUsername('Username must be 8 letters long at minimum');
      setUsernameColor('red');
    }

    if (password.length >= 6) {
      setErrorPassword('');
      setPasswordColor('');
    } else {
      setErrorPassword('Password must be 6 characters long at minimum');
      setPasswordColor('red');
    }

    if (password != '' && password === confirmPassword) {
      setErrorConfirmPassword('');
      setConfirmPasswordColor('');
    } else {
      setErrorConfirmPassword("The confirmation password doesn't match");
      setConfirmPasswordColor('red');
    }

    if (
      errorConfirmPassword == '' &&
      errorPassword == '' &&
      errorUsername == ''
    ) {
      return true;
    } else {
      return false;
    }
  };
  const navigate = useNavigate();

  const name = method == 'login' ? 'Login' : 'Register';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    try {
      if (method === 'register' && !validate()) {
        setLoading(false);
        throw new Error('Invalid registration');
      }

      const res = await api.post(route, { username, password });

      if (res.status !== 200 && res.status !== 201) {
        alert(res.data.detail);
        return;
      }

      if (method == 'login') {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);

        console.log(remember);

        if (remember)
          await api.post('/api/session/token/', {
            username,
            password,
            remember_me: 'True',
          });

        navigate('/');
      } else {
        navigate('/login');
      }
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <h1>{name}</h1>
      <Input
        id='username'
        type='text'
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ borderColor: usernameColor }}
        placeholder='Username'
      />
      <p className={styles.error}>{errorUsername}</p>
      <Input
        id='password'
        type='password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ borderColor: passwordColor }}
        placeholder='Password'
      />
      <p className={styles.error}>{errorPassword}</p>
      {method == 'register' && (
        <Input
          id='confirm-password'
          type='confirm-password'
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={{ borderColor: confirmPasswordColor }}
          placeholder='Confirm Password'
        />
      )}
      {method == 'register' && (
        <p className={styles.error}>{errorConfirmPassword}</p>
      )}
      {loading && <LoadingIndicator />}
      <Button type='submit'>{name}</Button>
      {method == 'login' && (
        <div className={styles.remember}>
          <Input
            type='checkbox'
            name='remember'
            id='remember'
            onChange={(e) => setRemember(e.target.checked)}
          />
          <span> Remember me</span>
        </div>
      )}
      {method == 'register' && (
        <p>
          Already have an account? <RouterLink href='/login'>Login</RouterLink>
        </p>
      )}
      {method == 'login' && (
        <p>
          Don't have an account?{' '}
          <RouterLink href='/register'>Register</RouterLink>
        </p>
      )}
    </form>
  );
};

export default Form;
