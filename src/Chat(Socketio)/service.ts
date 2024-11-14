import { Server } from "socket.io";

const connectedUser = new Set();

const socketService = (io: Server) => {
  io.on('connection', (socket) => {
    console.log('Connected successfully', socket.id);
    socket.join("some room");
    connectedUser.add(socket.id);
    io.to("some room").emit('connected-user', connectedUser.size);

    socket.on('disconnect', () => {
      console.log('Disconnected successfully', socket.id);
      connectedUser.delete(socket.id);
      io.to("some room").emit('connected-user', connectedUser.size);
    });

    socket.on('manual-disconnect', () => {
      console.log('Manual disconnect requested', socket.id);
      socket.disconnect();
    });

    socket.on('message', async (data: string) => {
      const messageSchema = createMessageSchema(data);
      console.log(messageSchema);
      socket.to("some room").emit('message-receive', messageSchema);
    });

    socket.on('sendMessage', async (data: string) => {
      const messageSchema = createMessageSchema(data);
      console.log(messageSchema);
      io.to("some room").emit('message-receive', messageSchema);
    });
  });
};

function createMessageSchema(data: any): { date: Date; message: any } {
  return {
    date: new Date(),
    message: data // Permetem que "data" sigui un JSON
  };
}

export default socketService;