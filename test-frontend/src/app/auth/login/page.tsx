"use client";
import React, { useState } from 'react';
import { FaRegEnvelope } from "react-icons/fa";
import { MdOutlineLock } from "react-icons/md";
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

interface SignInFormValues {
    email: string;
    password: string;
}

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' | null } | null>(null);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email').required('Email is required'),
        password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    });

    const handleSignIn = async (values: SignInFormValues) => {
        setLoading(true);
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
                const responseData = await response.json();

                // Check if the response contains the expected data
                if (responseData.data && responseData.data.data) {
                    const { token, refreshToken } = responseData.data.data;

                    // Store tokens and role in sessionStorage
                    sessionStorage.setItem('authToken', token);
                    sessionStorage.setItem('refreshToken', refreshToken);

                    setAlert({ message: 'Login successful!', type: 'success' });
                    setTimeout(() => {
                        router.push('/dentist');
                    }, 2000);
                } else {
                    setAlert({ message: 'Invalid response from server', type: 'error' });
                }
            } else {
                const errorData = await response.json();
                setAlert({ message: errorData.message || 'Login failed!', type: 'error' });
            }
        } catch (error) {
            console.error('Error:', error);
            setAlert({ message: 'An error occurred. Please try again.', type: 'error' });
        } finally {
            setLoading(false);
            setTimeout(() => {
                setAlert(null);
            }, 5000);
        }
    };

    const handleForm = () => {
        router.push('/auth/signup');
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen py-2 bg-gray-100 bg-[url('/images/full-bg-2.jpg')] bg-cover bg-center">
            <Backdrop open={loading} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <main className="flex flex-col items-center justify-center w-full flex-1 text-center">
                <div className="bg-white rounded-2xl shadow-2xl flex flex-col lg:flex-row w-4/5 lg:w-2/3 max-w-4xl">
                    {/* Left Section */}
                    <div className="w-full lg:w-3/5 p-5 overflow-y-auto max-h-screen">
                        <div className="py-5">
                            <h2 className="text-3xl font-bold text-blue-800 mb-2">Sign in to Account</h2>
                            <div className="border-2 w-10 border-blue-800 inline-block mb-2"></div>

                            {alert && (
                                <div className={`p-4 my-2 text-sm rounded-md ${alert.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {alert.message}
                                </div>
                            )}

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
                                            className="border-2 border-blue-800 text-blue-800 rounded-full px-12 py-2 inline-block font-semibold hover:bg-blue-800 hover:text-white mt-5"
                                            disabled={isSubmitting}
                                        >
                                            Sign In
                                        </button>
                                    </Form>
                                )}
                            </Formik>

                            <div className="mt-4">
                                <button onClick={handleForm} className="text-sm text-blue-800 underline">
                                    Don't have an account? Sign Up
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="hidden lg:block w-full lg:w-2/5  text-white rounded-tr-2xl rounded-br-2xl py-10 lg:py-36 px-8 lg:px-12 relative">
                        <Image
                            src="/images/bg-1.jpg"
                            alt="Welcome Image"
                            layout="fill"
                            objectFit="cover"
                            className="rounded-lg"
                        />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Login;