'use client';

// reactt
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

// next
import { signIn } from "next-auth/react";

// Third-party
import { Icon } from "@iconify/react";
import { toast } from "react-toastify";

type Inputs = {
  email: string;
  password: string;
}

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false); // 🔹 Tambahkan state loading

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setLoading(true);

    const result = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      toast.error("Email atau password salah.");
    } else {
      toast.success("Login berhasil!");
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    }

    setLoading(false);
  };

  return (
      <section className='auth bg-base d-flex flex-wrap justify-content-center align-items-center min-vh-100'>
        <div className='auth-right py-32 px-24 d-flex flex-column justify-content-center'>
          <div className='card border radius-16 shadow-sm p-32 max-w-464-px mx-auto w-100 bg-white'>
            <div className='text-center'>
              <h5 className='mb-12'>Penginapan Anisa</h5>
              <p className='mb-32 text-secondary-light text-lg'>
                Selamat datang, silahkan masuk untuk melanjutkan
              </p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className='icon-field mb-16'>
              <span className='icon top-50 translate-middle-y'>
                <Icon icon='mage:email' />
              </span>
                <input
                    type='email'
                    className={`form-control h-56-px bg-neutral-50 radius-12 ${errors.email ? 'is-invalid' : ''}`}
                    placeholder='Email'
                    {...register('email', { required: 'Email wajib diisi' })}
                />
                {errors.email && (
                    <small className='text-danger'>{errors.email.message}</small>
                )}
              </div>

              <div className='position-relative mb-20'>
                <div className='icon-field'>
                <span className='icon top-50 translate-middle-y'>
                  <Icon icon='solar:lock-password-outline' />
                </span>
                  <input
                      type={passwordVisible ? 'text' : 'password'}
                      className={`form-control h-56-px bg-neutral-50 radius-12 ${errors.password ? 'is-invalid' : ''}`}
                      id='your-password'
                      placeholder='Password'
                      {...register('password', { required: 'Password wajib diisi' })}
                  />
                </div>
                <span
                    className={`toggle-password ${passwordVisible ? 'ri-eye-off-line' : 'ri-eye-line'} cursor-pointer position-absolute end-0 top-50 translate-middle-y me-16 text-secondary-light`}
                    onClick={() => setPasswordVisible(!passwordVisible)}
                />
                {errors.password && (
                    <small className='text-danger d-block mt-1'>{errors.password.message}</small>
                )}
              </div>

              <button
                  type='submit'
                  className='btn btn-primary text-sm btn-sm px-12 py-16 w-100 radius-12 mt-32'
                  disabled={loading} // 🔹 Disable saat loading
              >
                {loading ? (
                    <div className='d-flex align-items-center justify-content-center gap-2'>
                      <span className='spinner-border spinner-border-sm' role='status' aria-hidden='true' />
                      <span>Loading...</span>
                    </div>
                ) : (
                    'Masuk'
                )}
              </button>
            </form>
          </div>
        </div>
      </section>
  );
};

export default Login;
