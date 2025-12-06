import useSWR from 'swr';
import io from 'socket.io-client';
import { useEffect, useState } from 'react';

const fetcher = url => fetch(url).then(r=>r.json());
let socket;
export default function Home(){
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const { data: bins } = useSWR(apiBase + '/api/bins', fetcher);
  const [liveBins, setLiveBins] = useState([]);

  useEffect(() => {
    socket = io(apiBase);
    socket.on('bin:update', b => {
      setLiveBins(prev => {
        const idx = prev.findIndex(x => x.binId === b.binId);
        if (idx === -1) return [b, ...prev].slice(0,50);
        const copy = [...prev]; copy[idx] = b; return copy;
      });
    });
    return () => socket.disconnect();
  }, []);

  return (
    <div style={{fontFamily: 'Inter, Arial', padding: 24, maxWidth: 1000, margin: 'auto'}}>
      <header style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
        <h1>IoT-Enabled E-Waste Collection System (Harithon 2025)</h1>
        <div style={{textAlign:'right'}}>
          <div style={{fontWeight:600}}>Innovating for E-Waste</div>
          <div style={{color:'#555'}}>Smart Collection for a Greener Nizamabad</div>
        </div>
      </header>
      <section style={{marginTop:24}}>
        <h2>Project Overview & Problem Statement</h2>
        <p>Nizamabad faces increasing challenges in collecting and managing electronic waste. Inefficient collection systems, low citizen engagement, and lack of real-time bin monitoring lead to improper disposal. Our IoT-enabled system optimizes collection logistics and boosts participation through smart technology.</p>
      </section>

      <section style={{marginTop:24}}>
        <h2>Live Bin Feed</h2>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
          <div style={{background:'#f6f9fb', padding:12, borderRadius:8}}>
            <h3>Latest from API</h3>
            <pre style={{whiteSpace:'pre-wrap'}}>{JSON.stringify(bins || [], null, 2)}</pre>
          </div>
          <div style={{background:'#f6f9fb', padding:12, borderRadius:8}}>
            <h3>Realtime Updates (via MQTT → API → Socket.io)</h3>
            <ul>
              {(liveBins || []).map(b => (
                <li key={b._id}>{b.binId} — fill: {b.fillLevel}% — {new Date(b.lastUpdated).toLocaleTimeString()}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section style={{marginTop:24}}>
        <h2>Core Modules</h2>
        <div style={{display:'flex', gap:12}}>
          <div style={{flex:1, background:'#e8f8ef', padding:12, borderRadius:8}}>
            <h4>Citizen User App (Scheduler)</h4>
            <ul>
              <li>Pickup Scheduling</li>
              <li>Smart Bin GPS Locator</li>
              <li>Incentive Tracking</li>
            </ul>
          </div>
          <div style={{flex:1, background:'#eef6ff', padding:12, borderRadius:8}}>
            <h4>Collector Driver App (Optimizer)</h4>
            <ul>
              <li>Route Optimization</li>
              <li>Navigation</li>
              <li>Pickup Logging</li>
            </ul>
          </div>
          <div style={{flex:1, background:'#f6fff5', padding:12, borderRadius:8}}>
            <h4>Agency Dashboard (Monitor)</h4>
            <ul>
              <li>IoT Fill-Level Map</li>
              <li>Collection Analytics</li>
              <li>Fleet Management</li>
            </ul>
          </div>
        </div>
      </section>

      <section style={{marginTop:24}}>
        <h2>Technology Stack</h2>
        <table style={{width:'100%', borderCollapse:'collapse'}}>
          <thead>
            <tr style={{background:'#0b3a66', color:'white'}}>
              <th style={{padding:8}}>Layer</th><th>Technology</th><th>Purpose</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style={{padding:8}}>Front-End (Mobile)</td><td>Flutter / React Native</td><td>Cross-platform apps</td></tr>
            <tr><td style={{padding:8}}>Back-End / API</td><td>Node.js (Express)</td><td>Real-time API & logic</td></tr>
            <tr><td style={{padding:8}}>Database</td><td>MongoDB / PostgreSQL</td><td>IoT & geospatial data</td></tr>
            <tr><td style={{padding:8}}>Realtime</td><td>MQTT / WebSockets</td><td>Sensor telemetry & push updates</td></tr>
            <tr><td style={{padding:8}}>Key Services</td><td>Google Maps Platform</td><td>Geolocation & routing</td></tr>
          </tbody>
        </table>
      </section>

      <footer style={{marginTop:32, paddingTop:12, borderTop:'1px solid #eee'}}>
        <button onClick={()=>window.open('/pitch.pdf','_blank')} style={{padding:'10px 18px', background:'#16a34a', color:'white', border:'none', borderRadius:6}}>Pitch Deck Available</button>
        <button onClick={()=>alert('Prototype demo coming soon')} style={{marginLeft:12, padding:'10px 18px', borderRadius:6}}>See Prototype Demonstration</button>
      </footer>
    </div>
  );
}
