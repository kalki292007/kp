let ioInstance = null;
function initSocket(server) {
  const { Server } = require('socket.io');
  ioInstance = new Server(server, { cors: { origin: '*' } });
  ioInstance.on('connection', socket => {
    console.log('Socket connected', socket.id);
    socket.on('subscribe:bins', () => { console.log('Client subscribed to bins', socket.id); });
    socket.on('disconnect', () => { console.log('Socket disconnected', socket.id); });
  });
  return ioInstance;
}
function io() { return ioInstance; }
module.exports = { initSocket, io };
