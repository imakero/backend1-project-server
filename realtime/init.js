const init = (io) => {
  const onlineUsers = {}

  const addUser = (socket, user) => {
    onlineUsers[socket.id] = user
  }

  const removeUser = (socket) => {
    delete onlineUsers[socket.id]
  }

  const getSockets = (userIds) =>
    Object.entries(onlineUsers)
      .filter(([_socketId, user]) => userIds.includes(user.userId))
      .map(([socketId]) => socketId)

  io.on("connection", (socket) => {
    // console.log("someone connected")
    socket.on("setUser", (data) => {
      addUser(socket, data)
      // console.log("set new user", onlineUsers)
    })

    socket.on("disconnect", () => {
      removeUser(socket)
      // console.log("someone disconnected", onlineUsers)
    })
  })

  return {
    getSockets,
    io,
  }
}

module.exports = { init }
