Backend.

To launch server:

npm install -g typescript ts-node

npm install

npm run dev

Port: 8999

Api:

/api/login -> login, method: POST, example json:

{
    "name" : "username",
    "password" : "password"
}

/api/register -> register, method: POST, example json:

{
    "name" : "username",
    "password" : "password"
}

Websockets:

Connect to parent ("/") url. Then send a message with your username -> you will receive list of users waiting for players (as a string, use split to get names).

To join game: send message with username who you want to play and yourself (you have to filter this list).

The server will send to the clients updates with list of users.