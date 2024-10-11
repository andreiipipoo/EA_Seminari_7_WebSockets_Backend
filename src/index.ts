import express from 'express'
import cors from 'cors'
import { Server } from 'socket.io';
import userRouter from './routes/user'
//import { usersofDB } from './user/schema'
import experienciasRouter from './routes/experiencias'
import { run } from './database/mongo_conn'

const app = express()
app.use(express.json())
run();

app.use(cors());
//app.use(express.json() as RequestHandler);

const PORT = 3000;

app.get('/ping', (_req , res) => {
    console.log('ping recibido correctamente')
    res.send('pinged')
})

app.use('/user',userRouter)
app.use('/experiencias',experienciasRouter)

const server = app.listen(PORT, () => {
    console.log('el servidor esta escuchando en el puerto '+ PORT)
})

const io = new Server(server,  {
  cors: {
    origin: "*"
  }});

const connectedUser = new Set();


io.on('connection', (socket) => {
  console.log('**********************************************************Connected successfully', socket.id);
  connectedUser.add(socket.id);
  io.emit('connected-user', connectedUser.size);
  socket.on('disconnect', () => {
    console.log('Disconnected successfully', socket.id);
    connectedUser.delete(socket.id);
    io.emit('connected-user', connectedUser.size);
  });

  socket.on('manual-disconnect', () => {
    console.log('Manual disconnect requested', socket.id);
    socket.disconnect();
  });

  socket.on('message', async (data) => {
    console.log(data);
    socket.broadcast.emit('message-receive', data);
  });
});
