const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function createOnlineDonation(payload: any, idempotencyKey: string) {
  const res = await fetch(`${API_URL}/api/v1/donations/online`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify(payload),
  });
  
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to create donation');
  return data.data;
}

export async function verifyOnlineDonation(payload: any) {
  const res = await fetch(`${API_URL}/api/v1/donations/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to verify donation');
  return data.data;
}
