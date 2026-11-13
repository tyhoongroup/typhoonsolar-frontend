'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, RefreshCw } from 'lucide-react';

export function BackendStatusBadge() {
  const [status, setStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [details, setDetails] = useState<string>('');

  const checkConnection = async () => {
    setStatus('checking');
    try {
      const res = await fetch('/api/v1/health');
      if (res.ok) {
        try {
          const data = await res.json();
          setStatus('connected');
          setDetails(`API: OK • DB: ${data.data?.database || 'connected'}`);
        } catch {
          setStatus('disconnected');
          setDetails('API starting up...');
        }
      } else {
        setStatus('disconnected');
        setDetails('API responded with error');
      }
    } catch {
      setStatus('disconnected');
      setDetails('Backend offline (port 4000)');
    }
  };

  useEffect(() => {
    checkConnection();
    // Ping every 10 seconds
    const interval = setInterval(checkConnection, 10000);
    return () => clearInterval(interval);
  }, []);

  if (status === 'checking') {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
        <RefreshCw className="w-3 h-3 animate-spin" />
        <span>Checking backend connection...</span>
      </div>
    );
  }

  if (status === 'connected') {
    return (
      <div 
        onClick={checkConnection}
        title={details}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 cursor-pointer hover:bg-emerald-100 transition"
      >
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        <span className="font-semibold">Backend Connected 🟢</span>
        <span className="text-[10px] text-emerald-600/80 hidden sm:inline">({details})</span>
      </div>
    );
  }

  return (
    <div 
      onClick={checkConnection}
      title="Click to re-check"
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-rose-50 text-rose-800 border border-rose-200 cursor-pointer hover:bg-rose-100 transition"
    >
      <XCircle className="w-3.5 h-3.5 text-rose-600" />
      <span className="font-semibold">Backend Offline 🔴</span>
      <span className="text-[10px] text-rose-600/80 hidden sm:inline">(Port 4000)</span>
    </div>
  );
}

