"use client";
import React, { useState } from 'react';
import { FaRegEnvelope, FaRegUser, FaRegUserCircle, FaUserEdit } from "react-icons/fa";
import { MdOutlineLock } from "react-icons/md";
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface SignUpFormValues {
    firstName: string;
    lastName: string;
    username: string;
    bio: string;
    email: string;
    password: string;
}

const Signup = () => {
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' | null } | null>(null);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
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
                    router.push('/auth/login');
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

    const handleForm = () => {
        router.push('/auth/login');
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen py-2 bg-gray-100 bg-[url('/images/full-bg-2.jpg')] bg-cover bg-center">
            <main className="flex flex-col items-center justify-center w-full flex-1 text-center">
                <div className="bg-white rounded-2xl shadow-2xl flex flex-col lg:flex-row w-4/5 lg:w-2/3 max-w-4xl">
                    {/* Left Section */}
                    <div className="w-full lg:w-3/5 p-5 overflow-y-auto max-h-screen">
                        <div className="py-5">
                            <h2 className="text-3xl font-bold text-blue-800 mb-2">Create an Account</h2>
                            <div className="border-2 w-10 border-blue-800 inline-block mb-2"></div>

                            {alert && (
                                <div className={`p-4 my-2 text-sm rounded-md ${alert.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {alert.message}
                                </div>
                            )}

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
                                        {/* First Name and Last Name Fields in One Row */}
                                        <div className="flex flex-col sm:flex-row sm:justify-between mb-3">
                                            <div className="bg-gray-100 w-full sm:w-1/2 m-2 flex flex-col">
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
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <FaRegUser className="text-gray-400" />
                                                            </InputAdornment>
                                                        ),
                                                    }}
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
                                            <div className="bg-gray-100 w-full sm:w-1/2 m-2 flex flex-col">
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
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <FaRegUser className="text-gray-400" />
                                                            </InputAdornment>
                                                        ),
                                                    }}
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
                                        <div className="flex flex-col sm:flex-row sm:justify-between mb-3">
                                            <div className="bg-gray-100 w-full sm:w-full m-2 flex flex-col">
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
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <FaRegUserCircle className="text-gray-400" />
                                                            </InputAdornment>
                                                        ),
                                                    }}
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
                                        <div className="flex flex-col sm:flex-row sm:justify-between mb-3">
                                            <div className="bg-gray-100 w-full sm:w-full m-2 flex flex-col">
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
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <FaUserEdit className="text-gray-400" />
                                                            </InputAdornment>
                                                        ),
                                                    }}
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

                                        {/* Email and Password Fields in One Row */}
                                        <div className="flex flex-col sm:flex-row sm:justify-between mb-3">
                                            <div className="bg-gray-100 w-full sm:w-1/2 m-2 flex flex-col">
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
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <FaRegEnvelope className="text-gray-400" />
                                                            </InputAdornment>
                                                        ),
                                                    }}
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
                                            <div className="bg-gray-100 w-full sm:w-1/2 m-2 flex flex-col">
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
                                                className="border-2 border-blue-800 text-blue-800 rounded-full px-12 py-2 inline-block font-semibold hover:bg-blue-800 hover:text-white mt-5"
                                                disabled={isSubmitting}
                                            >
                                                Sign Up
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </Formik>

                            <div className="mt-4">
                                <button onClick={handleForm} className="text-sm text-blue-800 underline">
                                    Already have an account? Sign In
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

export default Signup;