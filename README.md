# 3Nets Code Challenge

Please make sure to install any dependencies and follow the instructions to run, for any inquiries feel free to email me at: clementecastejon3@gmail.com

## Install instructions

Open 2 terminals, change directories to Server on one and Client on the other and run:

### `npm install`

This apps runs fully locally and uses MongoDB's native JavaScript to run on a local MongoDB install. It uses the default MongoDB port: 27017

Typescript is already compiled for the server, but you can run:

### `tsc`

To compile it again.

The server is set to run on port 3000 by default, so make sure to run the client on another port (React will ask you to run it on another one if it notices this.)

The client should run on [Port 3001](http://localhost:3001)

## Database Configuration

This project will use your local installation of MongoDB, please create a new Database, default name for the Database used on the project is: myapp

To create a new Database and collection, you can run:

### `mongosh`

### `use myapp`

### `db.createCollection('products')`

## Screenshots

### Products Screen

![Products Screen](/screenshots/Capture-2023-05-31-190308.png)

### Reviews Screen

![Reviews Screen](/screenshots/Capture-2023-05-31-190340.png)

### Product Details Screen

![Product Details Screen](/screenshots/Capture-2023-05-31-190423.png)
