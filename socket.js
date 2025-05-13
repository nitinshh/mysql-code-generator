module.exports=function(io){    
    io.on("connection", (socket) => {
        console.log("Client connected");
        socket.on("connect_user", () =>
            console.log("Client disconnected")
        );
    })
}