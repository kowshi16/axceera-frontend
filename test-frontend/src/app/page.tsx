"use client";
import React from 'react';
import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const goToLogin = () => {
    router.push('/auth/login');
  };

  return (
    <div className="bg-gray-100 h-screen flex flex-col justify-center items-center">
      <h1 className="text-black text-4xl mb-6">Welcome!</h1>
      <Button
        variant="contained"
        onClick={goToLogin}
        sx={{ fontSize: '16px', padding: '10px 20px' }}>
        Go to Login
      </Button>
    </div>
  );
}
