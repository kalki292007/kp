const mqtt = require('mqtt');
const BROKER = process.env.MQTT_BROKER || 'mqtt://localhost:1883';
const client = mqtt.connect(BROKER);
function randomFill() { return Math.floor(Math.random()*100); }
const bins = [
  { id: 'BIN-1001', lat: 18.6731, lng: 78.5682 },
  { id: 'BIN-1002', lat: 18.6762, lng: 78.5690 },
  { id: 'BIN-1003', lat: 18.6720, lng: 78.5665 },
  { id: 'BIN-1004', lat: 18.6705, lng: 78.5701 }
];
client.on('connect', () => {
  console.log('Simulator connected to', BROKER);
  setInterval(() => {
    const b = bins[Math.floor(Math.random()*bins.length)];
    const payload = JSON.stringify({
      binId: b.id,
      fillLevel: randomFill(),
      battery: Math.floor(Math.random()*100),
      timestamp: new Date().toISOString(),
      lat: b.lat,
      lng: b.lng
    });
    client.publish(`harithon/bin/${b.id}/telemetry`, payload);
    console.log('published', b.id, payload);
  }, 3000);
});
