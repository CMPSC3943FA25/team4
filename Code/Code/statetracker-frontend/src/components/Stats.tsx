import { useState, useEffect } from 'react'
import { getStats, StatsData } from '../services/api'

interface StatsProps {
  userId: number
}

export default function Stats({ userId }: StatsProps) {
  const [stats, setStats] = useState<StatsData>({ visited: 0, percentage: 0, badges: [] })

  useEffect(() => {
    getStats(userId).then(res => setStats(res.data))
  }, [userId])

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Your Stats</h2>
      <p><strong>{stats.visited} / 50</strong> States Visited</p>
      <p><strong>{stats.percentage.toFixed(1)}%</strong> of the USA!</p>
      <div>
        <h3>Badges</h3>
        {stats.badges.map((badge, i) => (
          <span key={i} style={{ margin: 5, padding: '5px 10px', background: '#007bff', color: 'white', borderRadius: 5 }}>
            {badge}
          </span>
        ))}
      </div>
    </div>
  )
}