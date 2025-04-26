import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import styles from '@/styles/Login.module.css';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    // Aqui você pode adicionar a lógica para registrar o usuário via API
    router.push('/chat'); // Redireciona para a página de chat após o cadastro
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Cadastro - Paggo OCR</title>
        <meta name="description" content="Página de cadastro para Paggo OCR" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.loginBox}>
          <h1 className={styles.title}>Paggo OCR</h1>
          <h2 className={styles.subtitle}>Cadastro</h2>

          {error && <p className={styles.error}>{error}</p>}

          <form onSubmit={handleRegister} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="name">Nome</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
                className={styles.input}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Seu email"
                className={styles.input}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password">Senha</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Sua senha"
                className={styles.input}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword">Confirme sua senha</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirme sua senha"
                className={styles.input}
                required
              />
            </div>

            <button type="submit" className={styles.button}>
              Cadastrar
            </button>
          </form>
            <button
                onClick={() => router.push('/')}
                className={styles.button}>
                Voltar para Login
            </button>
        </div>
      </main>
    </div>
  );
}
