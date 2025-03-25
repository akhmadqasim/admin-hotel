'use client';

// React
import {useState} from "react";

// Components
import {signIn} from "next-auth/react";

// Third-party
import {useForm, SubmitHandler} from "react-hook-form";
import {Icon} from "@iconify/react/dist/iconify.js";

// Types
type Inputs = {
  email: string;
  password: string;
}

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirectTo: '/',
    });
  }

  return (
    <section className='auth bg-base d-flex flex-wrap'>
      <div className='auth-left d-lg-block d-none'>
        <div className='d-flex align-items-center flex-column h-100 justify-content-center'>
          <img src='/images/auth/login/resort.jpg' alt=''/>
        </div>
      </div>
      <div className='auth-right py-32 px-24 d-flex flex-column justify-content-center'>
        <div className='max-w-464-px mx-auto w-100'>
          <div>
            <h4 className='mb-12'>Penginapan Anisa</h4>
            <p className='mb-32 text-secondary-light text-lg'>
              Selamat datang, silahkan masuk untuk melanjutkan
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='icon-field mb-16'>
              <span className='icon top-50 translate-middle-y'>
                <Icon icon='mage:email'/>
              </span>
              <input
                type='text'
                className='form-control h-56-px bg-neutral-50 radius-12'
                placeholder='Email'
                {...register('email')}
              />
            </div>
            <div className='position-relative mb-20'>
              <div className='icon-field'>
                <span className='icon top-50 translate-middle-y'>
                  <Icon icon='solar:lock-password-outline'/>
                </span>
                <input
                  type={passwordVisible ? 'text' : 'password'}
                  className='form-control h-56-px bg-neutral-50 radius-12'
                  id='your-password'
                  placeholder='Password'
                  {...register('password')}
                />
              </div>
              <span
                className={`toggle-password ${passwordVisible ? 'ri-eye-off-line' : 'ri-eye-line'} cursor-pointer position-absolute end-0 top-50 translate-middle-y me-16 text-secondary-light`}
                data-toggle='#your-password'
                onClick={() => setPasswordVisible(!passwordVisible)}
              />
            </div>
            <button
              type='submit'
              className='btn btn-primary text-sm btn-sm px-12 py-16 w-100 radius-12 mt-32'
            >
              {" "}
              Masuk
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;
