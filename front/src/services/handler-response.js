export const handleCommon = (res, callback, cbUnauthorized ) => {
  if (res.message == "fail token") {
    window.localStorage.removeItem("token-prueba-loggro");
    window.location.href = "/";
  } else if (res.message == "server error") {
    alert("Hubo un problema, contacte a soporte")
  } else if(res.message == "Unauthorized"){
    if(cbUnauthorized){
      cbUnauthorized()
    }

  } else if (res.message == "ok") {
    callback()
  }
}