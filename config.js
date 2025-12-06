require('dotenv').config();
module.exports = {
  port: process.env.PORT || 4000,
  mongoUri: process.env.MONGO_URI,
  pgUri: process.env.PG_URI,
  mqttBroker: process.env.MQTT_BROKER || 'mqtt://localhost:1883',
  googleMapsKey: process.env.GOOGLE_MAPS_API_KEY || '',
  jwtSecret: process.env.JWT_SECRET || 'change_this'
};
