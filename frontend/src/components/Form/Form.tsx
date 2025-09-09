import { useState } from 'react';
import api from '../../utils/api';
import { useNavigate } from 'react-router';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../../constants';
import styles from './Form.module.css';
import Input from '../Input/Input';
import Button from '../Button/Button';
import LoadingIndicator from '../LoadingIndicator/LoadingIndicator';

type FormProps = {
  route: string;
  method: string;
};

const Form = ({ route, method }: FormProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const name = method == 'login' ? 'Login' : 'Register';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post(route, { username, password });

      if (res.status !== 200 && res.status !== 201) {
        alert(res.data.detail);
        return;
      }

      if (method == 'login') {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
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
        placeholder='Username'
      />
      <Input
        id='password'
        type='password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder='Password'
      />
      {loading && <LoadingIndicator />}
      <Button type='submit'>{name}</Button>
    </form>
  );
};

export default Form;
