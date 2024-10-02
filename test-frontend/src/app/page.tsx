"use client";
import React, { useState } from 'react';
import { FaFacebookF, FaLinkedinIn, FaGoogle, FaRegEnvelope } from "react-icons/fa";
import { MdOutlineLock } from "react-icons/md";
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';

interface SignInFormValues {
  email: string;
  password: string;
}

interface SignUpFormValues {
  firstName: string;
  lastName: string;
  username: string;
  bio: string;
  email: string;
  password: string;
}

export default function Home() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' | null } | null>(null);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const toggleForm = () => {
    setIsSignUp((prev) => !prev);
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  });

  const handleSignIn = async (values: SignInFormValues) => {
    try {
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setAlert({ message: 'Login successful!', type: 'success' });
        setTimeout(() => {
          router.push('/welcome');
        }, 2000);
      } else {
        const errorData = await response.json();
        setAlert({ message: errorData.message || 'Login failed!', type: 'error' });
      }
    } catch (error) {
      console.error('Error:', error);
      setAlert({ message: 'An error occurred. Please try again.', type: 'error' });
    } finally {
      setTimeout(() => {
        setAlert(null);
      }, 5000);
    }
  };

  const handleSignUp = async (values: SignUpFormValues) => {
    try {
      const response = await fetch('http://localhost:8080/user/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: values.firstName,
          lastName: values.lastName,
          username: values.username,
          bio: values.bio,
          email: values.email,
          password: values.password,
          role: "admin",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setAlert({ message: 'User created successful!', type: 'success' });
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        const errorData = await response.json();
        setAlert({ message: errorData.message || 'User creation failed!', type: 'error' });
      }
    } catch (error) {
      console.error('Error:', error);
      setAlert({ message: 'An error occurred. Please try again.', type: 'error' });
    } finally {
      setTimeout(() => {
        setAlert(null);
      }, 5000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen py-2 bg-gray-100">
      <main className="flex flex-col items-center justify-center w-full flex-1 text-center">
        <div className="bg-white rounded-2xl shadow-2xl flex flex-col lg:flex-row w-4/5 lg:w-2/3 max-w-4xl">
          {/* Left Section */}
          <div className="w-full lg:w-3/5 p-5 overflow-y-auto max-h-screen">
            <div className="py-5">
              <h2 className="text-3xl font-bold text-green-500 mb-2">{isSignUp ? "Create an Account" : "Sign in to Account"}</h2>
              <div className="border-2 w-10 border-green-500 inline-block mb-2"></div>

              {alert && (
                <div className={`p-4 my-2 text-sm rounded-md ${alert.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {alert.message}
                </div>
              )}

              {isSignUp ? (
                <Formik
                  initialValues={{
                    email: '',
                    password: '',
                    bio: '',
                    username: '',
                    firstName: '',
                    lastName: '',
                    role: ''
                  }}
                  validationSchema={Yup.object({
                    email: Yup.string().email('Invalid email address').required('Required'),
                    password: Yup.string().min(6, 'Must be 6 characters or more').required('Required'),
                    bio: Yup.string().required('Required'),
                    username: Yup.string().required('Required'),
                    firstName: Yup.string().required('Required'),
                    lastName: Yup.string().required('Required'),
                  })}
                  onSubmit={(values, { setSubmitting }) => {
                    handleSignUp(values);
                    console.log(values);
                    setSubmitting(false);
                  }}
                >
                  {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                    <form onSubmit={handleSubmit}>
                      {/* First Name Field */}
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 w-full sm:w-64 m-2 flex flex-col mb-3">
                          <TextField
                            id="firstName"
                            name="firstName"
                            type="text"
                            placeholder="First Name"
                            variant="outlined"
                            size="small"
                            fullWidth
                            value={values.firstName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                "& fieldset": { border: "none" },
                                backgroundColor: "transparent",
                              },
                            }}
                          />
                          <ErrorMessage name="firstName">
                            {msg => <div className="text-red-500 text-xs mt-1 bg-white">{msg}</div>}
                          </ErrorMessage>
                        </div>
                      </div>

                      {/* Last Name Field */}
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 w-full sm:w-64 m-2 flex flex-col mb-3">
                          <TextField
                            id="lastName"
                            name="lastName"
                            type="text"
                            placeholder="Last Name"
                            variant="outlined"
                            size="small"
                            fullWidth
                            value={values.lastName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                "& fieldset": { border: "none" },
                                backgroundColor: "transparent",
                              },
                            }}
                          />
                          <ErrorMessage name="lastName">
                            {msg => <div className="text-red-500 text-xs mt-1 bg-white">{msg}</div>}
                          </ErrorMessage>
                        </div>
                      </div>

                      {/* Username Field */}
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 w-full sm:w-64 m-2 flex flex-col mb-3">
                          <TextField
                            id="username"
                            name="username"
                            type="text"
                            placeholder="Username"
                            variant="outlined"
                            size="small"
                            fullWidth
                            value={values.username}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                "& fieldset": { border: "none" },
                                backgroundColor: "transparent",
                              },
                            }}
                          />
                          <ErrorMessage name="username">
                            {msg => <div className="text-red-500 text-xs mt-1 bg-white">{msg}</div>}
                          </ErrorMessage>
                        </div>
                      </div>

                      {/* Bio Field */}
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 w-full sm:w-64 m-2 flex flex-col mb-3">
                          <TextField
                            id="bio"
                            name="bio"
                            type="text"
                            placeholder="Bio"
                            variant="outlined"
                            size="small"
                            fullWidth
                            value={values.bio}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                "& fieldset": { border: "none" },
                                backgroundColor: "transparent",
                              },
                            }}
                          />
                          <ErrorMessage name="bio">
                            {msg => <div className="text-red-500 text-xs mt-1 bg-white">{msg}</div>}
                          </ErrorMessage>
                        </div>
                      </div>

                      {/* Email Field */}
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 w-full sm:w-64 m-2 flex flex-col mb-3">
                          <TextField
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Email"
                            variant="outlined"
                            size="small"
                            fullWidth
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                "& fieldset": { border: "none" },
                                backgroundColor: "transparent",
                              },
                            }}
                          />
                          <ErrorMessage name="email">
                            {msg => <div className="text-red-500 text-xs mt-1 bg-white">{msg}</div>}
                          </ErrorMessage>
                        </div>
                      </div>

                      {/* Password Field */}
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 w-full sm:w-64 m-2 flex flex-col mb-3">
                          <Field
                            as={TextField}
                            name="password"
                            variant="outlined"
                            placeholder="Password"
                            size="small"
                            type={showPassword ? "text" : "password"}
                            fullWidth
                            onChange={handleChange}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <MdOutlineLock className="text-gray-400" />
                                </InputAdornment>
                              ),
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                  >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                  border: "none",
                                },
                                backgroundColor: "transparent",
                              },
                            }}
                          />
                          <ErrorMessage name="password">
                            {msg => <div className="text-red-500 text-xs mt-1 bg-white">{msg}</div>}
                          </ErrorMessage>
                        </div>
                      </div>

                      {/* Sign Up Button */}
                      <div className="flex flex-col items-center w-full">
                        <button
                          type="submit"
                          className="border-2 border-green-500 text-green-500 rounded-full px-12 py-2 inline-block font-semibold hover:bg-green-500 hover:text-white mt-5"
                          disabled={isSubmitting}
                        >
                          Sign Up
                        </button>
                      </div>
                    </form>
                  )}
                </Formik>

              ) : (
                <>
                  <Formik
                    initialValues={{ email: '', password: '' }}
                    validationSchema={validationSchema}
                    onSubmit={(values, { setSubmitting }) => {
                      handleSignIn(values);
                      setSubmitting(false);
                    }}
                  >
                    {({ isSubmitting, handleChange }) => (
                      <Form className="flex flex-col items-center">
                        {/* Email Field */}
                        <div className="bg-gray-100 w-full sm:w-64 m-2 flex flex-col mb-3">
                          <Field
                            as={TextField}
                            name="email"
                            variant="outlined"
                            placeholder="Email"
                            size="small"
                            fullWidth
                            onChange={handleChange}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <FaRegEnvelope className="text-gray-400" />
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                  border: "none",
                                },
                                backgroundColor: "transparent",
                              },
                            }}
                          />
                          <ErrorMessage name="email">
                            {msg => <div className="text-red-500 text-xs mt-1 bg-white">{msg}</div>}
                          </ErrorMessage>
                        </div>

                        {/* Password Field */}
                        <div className="bg-gray-100 w-full sm:w-64 m-2 flex flex-col mb-3">
                          <Field
                            as={TextField}
                            name="password"
                            variant="outlined"
                            placeholder="Password"
                            size="small"
                            type={showPassword ? "text" : "password"}
                            fullWidth
                            onChange={handleChange}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <MdOutlineLock className="text-gray-400" />
                                </InputAdornment>
                              ),
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                  >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                  border: "none",
                                },
                                backgroundColor: "transparent",
                              },
                            }}
                          />
                          <ErrorMessage name="password">
                            {msg => <div className="text-red-500 text-xs mt-1 bg-white">{msg}</div>}
                          </ErrorMessage>
                        </div>

                        {/* Remember Me and Forgot Password */}
                        <div className="w-full sm:w-64 flex justify-between items-center ml-4">
                          <FormControlLabel
                            control={
                              <Field type="checkbox" name="rememberMe" as={Checkbox} size="small" />
                            }
                            label="Remember Me"
                            sx={{
                              "& .MuiTypography-root": {
                                fontSize: "0.75rem",
                                color: "black",
                              },
                            }}
                          />
                          <a href="#" className='text-xs text-black whitespace-nowrap mr-2'>Forgot Password?</a>
                        </div>

                        {/* Submit Button */}
                        <button
                          type="submit"
                          className="border-2 border-green-500 text-green-500 rounded-full px-12 py-2 inline-block font-semibold hover:bg-green-500 hover:text-white mt-5"
                          disabled={isSubmitting}
                        >
                          Sign In
                        </button>
                      </Form>
                    )}
                  </Formik>

                </>
              )}

              {/* Toggle between Sign In and Sign Up */}
              <div className="mt-4">
                <button onClick={toggleForm} className="text-sm text-blue-500 underline">
                  {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
                </button>
              </div>
            </div>
          </div>

          {/* Right Section - hidden on small screens */}
          <div className="hidden lg:block w-full lg:w-2/5 bg-green-500 text-white rounded-tr-2xl rounded-br-2xl py-10 lg:py-36 px-8 lg:px-12">
            <h2 className="text-3xl font-bold mb-2">Welcome!</h2>
            <div className="border-2 w-10 border-white inline-block mb-2"></div>
            <p className="mb-10">Fill up personal information and start your journey with us.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
