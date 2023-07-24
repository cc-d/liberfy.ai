import React, { useState } from 'react';
import { useAuthContext } from '../AuthContext';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, user, setUser } = useAuthContext();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await login({ email, password });
    } catch (error) {
      // Handle error...
    }
  };


  if (!user) {
    return (
      <form onSubmit={handleSubmit}>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit">Log in</button>
      </form>
    )
    } else {
      return (
        <div>
          <h1>Logged in as, {user.email}!</h1>
        </div>
      )
    }

  return (<></>)

};
