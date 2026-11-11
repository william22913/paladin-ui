import { useRef, useState, type FormEvent } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { ApiError } from '../core/api/types';
import { safeNext, useAuth } from '../core/auth/AuthProvider';
import { Button } from '../components/ui/Button';
import { Field, PasswordField } from '../components/ui/Field';
import { InlineNotice } from '../components/ui/InlineNotice';
import { ArtImage } from '../components/ui/ArtImage';
import { Wordmark } from '../components/app/Wordmark';
import { cx } from '../helpers/cx';
import styles from './pages.module.css';

const LOGIN_STILL = 'https://picsum.photos/seed/paladin-login/2400/1350';

function usernameError(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return 'Enter your username.';
  if (trimmed.length < 3 || trimmed.length > 50) return 'Username must be 3 to 50 characters.';
  return '';
}

function passwordError(value: string): string {
  if (!value) return 'Enter your password.';
  if (value.length < 8) return 'Password must be at least 8 characters.';
  return '';
}

export function LoginPage() {
  const { status, login } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = safeNext(params.get('next'));
  const expired = params.get('reason') === 'expired';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [errors, setErrors] = useState({ username: '', password: '' });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  if (status === 'authenticated') return <Navigate to={next} replace />;

  const focusFirstInvalid = () => {
    window.requestAnimationFrame(() => {
      formRef.current?.querySelector<HTMLInputElement>('[aria-invalid="true"]')?.focus();
    });
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const userMessage = usernameError(username);
    const passwordMessage = passwordError(password);
    setErrors({ username: userMessage, password: passwordMessage });
    setFormError('');
    if (userMessage || passwordMessage) {
      focusFirstInvalid();
      return;
    }

    setSubmitting(true);
    try {
      await login(username.trim(), password);
      navigate(next, { replace: true });
    } catch (error) {
      setPassword('');
      setFormError(
        error instanceof ApiError && (error.status === 401 || error.code === 'INVALID_CREDENTIALS')
          ? 'Invalid username or password.'
          : error instanceof ApiError && error.status === 0
            ? error.message
            : 'Sign in failed. Try again.',
      );
      setSubmitting(false);
      window.requestAnimationFrame(() => {
        formRef.current?.querySelector<HTMLInputElement>('input[autocomplete="username"]')?.focus();
      });
    }
  }

  return (
    <div className={styles.login}>
      <div className={styles.loginMedia}>
        <ArtImage src={LOGIN_STILL} alt="" eager />
      </div>
      <div className={styles.loginScrim} aria-hidden="true" />

      <header className={styles.loginHeader}>
        <Wordmark linked={false} />
      </header>

      <main className={styles.loginMain}>
        <div className={styles.loginStack}>
          <p className={styles.eyebrow}>Paladin account</p>
          <h1 className={styles.loginTitle}>Sign in</h1>
          <p className={styles.loginIntro}>
            Reach your catalog, cart and license keys.
          </p>

          {expired ? (
            <InlineNotice tone="info">Your session expired. Sign in to continue.</InlineNotice>
          ) : null}

          <form ref={formRef} className={styles.loginForm} noValidate onSubmit={handleSubmit}>
            <Field
              label="Username"
              name="username"
              autoComplete="username"
              value={username}
              disabled={submitting}
              error={errors.username}
              onChange={(event) => {
                setUsername(event.target.value);
                if (errors.username) setErrors((current) => ({ ...current, username: '' }));
              }}
            />
            <PasswordField
              label="Password"
              name="password"
              autoComplete="current-password"
              value={password}
              disabled={submitting}
              error={errors.password}
              revealed={revealed}
              onToggleReveal={() => setRevealed((current) => !current)}
              onChange={(event) => {
                setPassword(event.target.value);
                if (errors.password) setErrors((current) => ({ ...current, password: '' }));
              }}
            />

            {formError ? (
              <p className={cx(styles.loginError)} role="alert">
                {formError}
              </p>
            ) : null}

            <Button type="submit" block disabled={submitting}>
              {submitting ? 'Signing in' : 'Sign in'}
            </Button>
          </form>

          <p className={styles.accountNote}>Accounts are issued by Paladin.</p>
        </div>
      </main>
    </div>
  );
}
