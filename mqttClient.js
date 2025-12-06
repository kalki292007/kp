const mqtt = require('mqtt');
const Bin = require('../models/Bin');
const config = require('../config');
let client = null;
function startMqtt(io) {
  client = mqtt.connect(config.mqttBroker);
  client.on('connect', () => {
    console.log('MQTT connected to', config.mqttBroker);
    client.subscribe('harithon/bin/+/telemetry', err => {
      if (err) console.error('MQTT subscribe error', err);
    });
  });
  client.on('message', async (topic, payload) => {
    try {
      const msg = JSON.parse(payload.toString());
      const parts = topic.split('/');
      const binId = parts[2] || `BIN-${Math.floor(Math.random()*10000)}`;
      const update = {
        binId,
        fillLevel: Number(msg.fillLevel) || 0,
        lastUpdated: new Date(msg.timestamp || Date.now()),
        status: (Number(msg.fillLevel) || 0) > 90 ? 'FULL' : 'OK',
        metadata: { battery: msg.battery || null }
      };
      const bin = await Bin.findOneAndUpdate({ binId }, {
        $set: {
          fillLevel: update.fillLevel,
          lastUpdated: update.lastUpdated,
          status: update.status,
          metadata: update.metadata
        },
        $setOnInsert: {
          location: { type: 'Point', coordinates: [msg.lng || 78.568, msg.lat || 18.673] }
        }
      }, { upsert: true, new: true });
      if (io) io.emit('bin:update', bin);
    } catch (e) {
      console.error('Error processing MQTT message', e);
    }
  });
  client.on('error', (err) => { console.error('MQTT error', err); });
}
module.exports = { startMqtt, client: () => client };
