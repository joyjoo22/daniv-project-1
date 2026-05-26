// 로그인 / 회원가입 — react-hook-form + zod 검증 + authStore 연동.
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Button,
  Wordmark,
  Segmented,
  Field,
  FieldLabel,
  OAuthButton,
  GoogleEmoji,
} from '@/components/ui';
import { PageContainer } from '@/components/layout/PageContainer';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';

const DEPARTMENTS = ['컴퓨터공학과', '경영학과', '국어국문학과', '디자인학과', '영문과'] as const;

// 로그인 스키마 — 이메일 형식 + 비밀번호 최소 길이.
// 단국대 메일 도메인 검증은 PHASE 5 이후 정책 확정되면 강화 예정.
const loginSchema = z.object({
  email: z.string().min(1, '이메일을 입력해주세요.').email('올바른 이메일 형식이 아니에요.'),
  password: z.string().min(6, '비밀번호는 6자 이상이어야 해요.'),
});

const signupSchema = loginSchema.extend({
  nickname: z.string().min(2, '닉네임은 2자 이상이어야 해요.').max(12, '닉네임은 12자 이하예요.'),
  department: z.string().min(1, '학과를 선택해주세요.'),
  studentId: z
    .string()
    .min(2, '학번을 입력해주세요.')
    .regex(/^\d+$/, '숫자만 입력해주세요.'),
});

type LoginForm = z.infer<typeof loginSchema>;
type SignupForm = z.infer<typeof signupSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, signup, isLoading, error: authError, clearError } = useAuthStore();
  const pushToast = useUIStore((s) => s.pushToast);
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  return mode === 'login' ? (
    <LoginForm
      isLoading={isLoading}
      authError={authError}
      switchToSignup={() => {
        clearError();
        setMode('signup');
      }}
      onSubmit={async (values) => {
        clearError();
        try {
          await login(values);
          pushToast('환영해요! 👋', 'success');
          navigate('/');
        } catch {
          /* error in store */
        }
      }}
    />
  ) : (
    <SignupForm
      isLoading={isLoading}
      authError={authError}
      switchToLogin={() => {
        clearError();
        setMode('login');
      }}
      onSubmit={async (values) => {
        clearError();
        try {
          await signup(values);
          pushToast('가입을 환영해요! 🎉', 'success');
          navigate('/');
        } catch {
          /* error in store */
        }
      }}
    />
  );
}

type SharedProps = {
  isLoading: boolean;
  authError: string | null;
};

function Shell({
  title,
  subtitle,
  mode,
  switchMode,
  children,
  submitButton,
}: {
  title: string;
  subtitle: string;
  mode: 'login' | 'signup';
  switchMode: () => void;
  children: React.ReactNode;
  submitButton: React.ReactNode;
}) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '20px 24px 0', flexShrink: 0, maxWidth: 480, margin: '0 auto', width: '100%' }}>
        <Wordmark size={24} />
      </div>

      <PageContainer variant="narrow" style={{ flex: 1, padding: '32px 24px 24px', maxWidth: 480 }}>
        <h1
          style={{
            fontSize: 26,
            fontWeight: 800,
            margin: 0,
            letterSpacing: '-0.03em',
            lineHeight: 1.25,
            whiteSpace: 'pre-line',
          }}
        >
          {title}
        </h1>
        <p style={{ fontSize: 14, color: 'var(--ink-3)', marginTop: 10, marginBottom: 28 }}>{subtitle}</p>

        <Segmented
          options={[
            { value: 'login', label: '로그인' },
            { value: 'signup', label: '회원가입' },
          ]}
          value={mode}
          onChange={switchMode as () => void}
          style={{ marginBottom: 22 }}
        />

        {children}

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
          <span style={{ fontSize: 12, color: 'var(--ink-4)' }}>또는</span>
          <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
        </div>

        <OAuthButton
          name="Google로 계속하기"
          color="#fff"
          ink="var(--ink)"
          border
          emoji={<GoogleEmoji />}
        />

        <p
          style={{
            fontSize: 11,
            color: 'var(--ink-4)',
            textAlign: 'center',
            marginTop: 22,
            lineHeight: 1.5,
          }}
        >
          계속하면 <span style={{ textDecoration: 'underline' }}>이용약관</span>과{' '}
          <span style={{ textDecoration: 'underline' }}>개인정보처리방침</span>에 동의하게 됩니다.
        </p>
      </PageContainer>

      <div style={{ padding: '16px 24px 24px', maxWidth: 480, margin: '0 auto', width: '100%' }}>
        {submitButton}
      </div>
    </div>
  );
}

function ErrorText({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      style={{ margin: '6px 4px 0', fontSize: 11, color: 'oklch(0.42 0.14 18)', fontWeight: 500 }}
    >
      {message}
    </p>
  );
}

function AuthErrorBanner({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      style={{
        margin: '8px 0 0',
        padding: '10px 12px',
        borderRadius: 12,
        background: 'oklch(0.94 0.04 18)',
        color: 'oklch(0.42 0.14 18)',
        fontSize: 12,
      }}
    >
      {message}
    </p>
  );
}

type LoginFormProps = SharedProps & {
  switchToSignup: () => void;
  onSubmit: (values: LoginForm) => Promise<void>;
};

function LoginForm({ isLoading, authError, switchToSignup, onSubmit }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Shell
        title={'다시 만나서\n반가워요'}
        subtitle="단국대학교 메일로 로그인하세요."
        mode="login"
        switchMode={switchToSignup}
        submitButton={
          <Button variant="primary" type="submit" disabled={isLoading || !isValid}>
            {isLoading ? '로그인 중...' : '로그인'}
          </Button>
        }
      >
        <div style={{ marginBottom: 14 }}>
          <FieldLabel>학교 이메일</FieldLabel>
          <Field placeholder="32250000@dankook.ac.kr" type="email" {...register('email')} />
          <ErrorText message={errors.email?.message} />
        </div>

        <div style={{ marginBottom: 14 }}>
          <FieldLabel>비밀번호</FieldLabel>
          <Field placeholder="••••••••" type="password" {...register('password')} />
          <ErrorText message={errors.password?.message} />
        </div>

        <AuthErrorBanner message={authError} />
      </Shell>
    </form>
  );
}

type SignupFormProps = SharedProps & {
  switchToLogin: () => void;
  onSubmit: (values: SignupForm) => Promise<void>;
};

function SignupForm({ isLoading, authError, switchToLogin, onSubmit }: SignupFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    mode: 'onBlur',
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Shell
        title={'환영해요,\n신입생 👋'}
        subtitle="단국대학교 이메일로 가입해주세요."
        mode="signup"
        switchMode={switchToLogin}
        submitButton={
          <Button variant="primary" type="submit" disabled={isLoading || !isValid}>
            {isLoading ? '가입 중...' : '가입 완료'}
          </Button>
        }
      >
        <div style={{ marginBottom: 14 }}>
          <FieldLabel>닉네임</FieldLabel>
          <Field placeholder="예: 단풍이" {...register('nickname')} />
          <ErrorText message={errors.nickname?.message} />
        </div>

        <div style={{ marginBottom: 14 }}>
          <FieldLabel>학교 이메일</FieldLabel>
          <Field placeholder="32250000@dankook.ac.kr" type="email" {...register('email')} />
          <ErrorText message={errors.email?.message} />
        </div>

        <div style={{ marginBottom: 14 }}>
          <FieldLabel>비밀번호</FieldLabel>
          <Field placeholder="••••••••" type="password" {...register('password')} />
          <ErrorText message={errors.password?.message} />
        </div>

        <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
          <div style={{ flex: 1 }}>
            <FieldLabel>학과</FieldLabel>
            <select className="field" defaultValue="" style={{ width: '100%' }} {...register('department')}>
              <option value="" disabled>
                선택
              </option>
              {DEPARTMENTS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
            <ErrorText message={errors.department?.message} />
          </div>
          <div style={{ flex: 1 }}>
            <FieldLabel>학번</FieldLabel>
            <Field mono placeholder="2025" {...register('studentId')} />
            <ErrorText message={errors.studentId?.message} />
          </div>
        </div>

        <AuthErrorBanner message={authError} />
      </Shell>
    </form>
  );
}
