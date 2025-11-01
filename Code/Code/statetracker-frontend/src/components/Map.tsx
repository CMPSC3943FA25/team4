import { useState, useEffect } from 'react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
import { updateState, getStates, StateData } from '../services/api'

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json"

interface MapProps {
  userId: number
}

export default function Map({ userId }: MapProps) {
  const [states, setStates] = useState<Record<string, StateData>>({})
  const [selected, setSelected] = useState<{ code: string; name: string } | null>(null)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    getStates(userId).then(res => {
      const map: Record<string, StateData> = {}
      res.data.forEach((s: StateData) => (map[s.stateCode] = s))
      setStates(map)
    })
  }, [userId])

  const handleClick = (geo: any) => {
    const code = geo.properties.name
    setSelected({ code, name: geo.properties.name })
    setNotes(states[code]?.notes || '')
  }

  const saveVisit = async () => {
  if (selected) {
    await updateState(userId, selected.code, { visited: true, notes })
    setStates(prev => ({
      ...prev,
      [selected.code]: { stateCode: selected.code, visited: true, notes }
    }))
  }
}

  return (
    <div>
      <ComposableMap projection="geoAlbersUsa">
        <Geographies geography={geoUrl}>
          {({ geographies }: { geographies: any[] }) =>
            geographies.map(geo => {
              const code = geo.properties.name
              const isVisited = states[code]?.visited
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={() => handleClick(geo)}
                  style={{
                    default: { fill: isVisited ? "#28a745" : "#ddd", outline: "none" },
                    hover: { fill: "#007bff", outline: "none" },
                    pressed: { fill: "#dc3545", outline: "none" }
                  }}
                />
              )
            })
          }
        </Geographies>
      </ComposableMap>

      {selected && (
        <div style={{ marginTop: 20, textAlign: 'center' }}>
          <h3>Mark {selected.name} as Visited</h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notes"
            style={{ width: '80%', height: 80 }}
          />
          <br />
          <button onClick={saveVisit} style={{ marginTop: 10 }}>Save</button>
        </div>
      )}
    </div>
  )
}