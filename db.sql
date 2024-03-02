create database message;

use message;

CREATE TABLE
    Users (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        avatar_url VARCHAR(1000), 
        UNIQUE (username),
        UNIQUE (email)
    );

CREATE TABLE
    Rooms (
        room_id INT AUTO_INCREMENT PRIMARY KEY,
        room_name VARCHAR(255) NOT NULL,
        UNIQUE (room_name)
    );

-- CREATE TABLE
--     RoomMembers (
--         room_member_id INT AUTO_INCREMENT PRIMARY KEY,
--         user_id INT NOT NULL,
--         room_id INT NOT NULL,
--         FOREIGN KEY (user_id) REFERENCES Users (user_id),
--         FOREIGN KEY (room_id) REFERENCES Rooms (room_id),
--         UNIQUE (user_id, room_id)
--     );

CREATE TABLE
    Messages (
        message_id INT AUTO_INCREMENT PRIMARY KEY,
        sender_id INT NOT NULL,
        room_id INT NOT NULL,
        message_text TEXT NOT NULL,
        sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sender_id) REFERENCES Users (user_id),
        FOREIGN KEY (room_id) REFERENCES Rooms (room_id)
    );

CREATE TABLE
    PrivateMessages (
        message_id INT AUTO_INCREMENT PRIMARY KEY,
        sender_id INT NOT NULL,
        receiver_id INT NOT NULL,
        message_text TEXT NOT NULL,
        room_id int,
        sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sender_id) REFERENCES Users (user_id),
        FOREIGN KEY (room_id) REFERENCES Rooms (room_id),
        FOREIGN KEY (receiver_id) REFERENCES Users (user_id)
    );

CREATE TABLE
    UserTokens (
        token_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        token TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES Users (user_id)    );