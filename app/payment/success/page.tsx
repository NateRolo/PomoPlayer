"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function PaymentSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate payment verification
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-base-100 p-8 rounded-lg shadow-lg">
        {loading ? (
          <div className="text-center">
            <div className="loading loading-spinner loading-lg"></div>
            <p className="mt-4">Verifying your payment...</p>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-success text-5xl mb-4">✓</div>
            <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
            <p className="mb-6">You now have access to all premium themes.</p>
            <button 
              className="btn btn-primary"
              onClick={() => router.push("/")}
            >
              Return to Timer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
