import { io } from "./http";

interface RoomUser {
    socket_id: string;
    username: string;
    room: string;
}

interface Message {
    room: string;
    text: string;
    createdAt: Date;
    username: string;
}

const users: RoomUser[] = [];
const messages: Message[] = [];

io.on("connection", socket => {
    socket.on("select_room", (data, callback) => {
        socket.join(data.room);

        const userInRoom = users.find(
            user => user.username === data.userName && user.room === data.room
        );

        if(userInRoom) {
            userInRoom.socket_id = socket.id;
        } else {
            users.push({
                room: data.room,
                username: data.userName,
                socket_id: socket.id
            });
        }

        const messagesRoom = getMessagesRoom(data.room);
        callback(messagesRoom);
        // console.log(users);
    });

    socket.on("message", data => {
        // Salvar a mensagem, [Todo: substituir por um banco de dados]
        const message: Message = {
            room: data.room,
            username: data.userName,
            text: data.message,
            createdAt: new Date()
        }

        messages.push(message);

        // Enviar para os usuário da sala
        io.to(data.room).emit("message", message);
    });
});

const getMessagesRoom = (room: string) => {
    return messages.filter(item => item.room === room);
}