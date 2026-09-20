'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const response = await fetch(`${apiUrl}/api/v1/auth/me`, {
          credentials: 'include', // Important to send the HttpOnly cookie
        });

        if (!response.ok) {
          throw new Error('Not authenticated');
        }

        const data = await response.json();
        setUser(data.data);
      } catch (error) {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      await fetch(`${apiUrl}/api/v1/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      router.push('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) return null;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
      
      <div className="p-6 bg-white rounded shadow-md">
        <h2 className="mb-4 text-xl font-semibold">User Information</h2>
        <p><strong>Name:</strong> {user.first_name} {user.last_name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role?.name}</p>
        
        <h3 className="mt-6 mb-2 text-lg font-semibold">Permissions</h3>
        <ul className="list-disc list-inside">
          {user.permissions?.map((p: any, i: number) => (
            <li key={i}>{p.action}:{p.resource}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
