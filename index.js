// server.js
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const morgan = require('morgan');
const bodyParser = require('body-parser');
require('dotenv').config();
var cors = require('cors')
var cookieParser = require('cookie-parser');
const socketIo = require('socket.io');
const io = socketIo(server);
app.use(cookieParser());
//server
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));


// Sử dụng body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//set morgan log
app.use(morgan("dev"));



let userOnline = {};
io.on('connection', (socket) => {
    console.log('New client connected', socket.id);

    socket.on('online', data => {
        userOnline[data.myId] = socket.id; // Lưu trữ socket.id dựa trên myId của người dùng
        console.log(userOnline);
    });

    socket.on('messagePrivate', (data) => {
        console.log('Received messagePrivate:', data);
       
        // Gửi tin nhắn cho người gửi (nếu cần)
        io.to(userOnline[data.sender_id]).emit("messagePrivate", { messagePrivate: `Tin nhắn từ số ${data.sender_id} gửi cho số ${data.receiver_id}` });

        // Gửi tin nhắn cho người nhận
        if(userOnline[data.receiver_id]) { // Kiểm tra xem người nhận có online không
            io.to(userOnline[data.receiver_id]).emit("messagePrivate", { messagePrivate: `Tin nhắn từ số ${data.sender_id} gửi cho số ${data.receiver_id}` });
        } else {
            console.log("Người nhận không online.");
        }
    });

    socket.on('disconnect', () => {
        // Xóa người dùng khỏi danh sách online khi họ ngắt kết nối
        let disconnectedUserId = Object.keys(userOnline).find(key => userOnline[key] === socket.id);
        if(disconnectedUserId) {
            delete userOnline[disconnectedUserId];
        }
        console.log('Client disconnected');
    });
});





// Import RouterMain and pass 'app' as parameter
import RouterMain from './src/router/router';
RouterMain(app);


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
