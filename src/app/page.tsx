'use client'

import dynamic from 'next/dynamic'

// Dynamically import the Strudel UI to avoid SSR issues with Web Audio API
const StrudelUI = dynamic(() => import('@/components/StrudelUI'), {
  ssr: false,
  loading: () => (
    <div className="loading-overlay">
      <div className="loading-spinner" />
      <p>Loading Strudel...</p>
    </div>
  ),
})

export default function Home() {
  return <StrudelUI />
}
