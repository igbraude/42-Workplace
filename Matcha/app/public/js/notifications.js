socket.on("notifications", (notification) => {
  // console.log("HERE")
  $.notify({
    message: `${notification}`
  });
});