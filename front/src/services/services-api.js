
const urlApiImage = `${import.meta.env.VITE_APP_BASE_URL_API}/${import.meta.env.VITE_APP_API_IMAGE}`
const urlApiUser = `${import.meta.env.VITE_APP_BASE_URL_API}/${import.meta.env.VITE_APP_API_USER}`

/**
 * @fecha 2025-01-12
 * @autor Omar Echavarria
 * @descripcion Esta función crea y devuelve los encabezados (headers) necesarios para realizar una solicitud 
 * HTTP autenticada. Verifica si el token de autenticación está presente en el `localStorage` y, si no lo está, 
 * redirige al usuario a la página principal ("/"). Si el token está disponible, lo agrega al encabezado como 
 * un campo `authorization`. Además, si el parámetro `isJosn` es `true`, se agrega el encabezado `Content-Type` 
 * con el valor `application/json`, lo que indica que el cuerpo de la solicitud estará en formato JSON.
 * 
 * @param {boolean} isJosn - Indica si se debe incluir el encabezado `Content-Type` con el valor 
 *                            `application/json`. Si es `true`, se incluirá.
 * 
 * @returns {Headers} - Retorna un objeto `Headers` con los encabezados necesarios para la solicitud.
 */
const createHeaders = (isJosn) => {

  const headers = new Headers();

  const token = window.localStorage.getItem("token-prueba-loggro");
  const parseToken = JSON.parse(token)
  if (!token || !parseToken?.token) {
    return window.location.href = "/"
  }
  headers.append("authorization", parseToken.token)
  if (isJosn) {
    headers.append("Content-Type", "application/json")
  }

  return headers
}


/**
 * @fecha 2025-01-12
 * @autor Omar Echavarria
 * @descripcion Esta función realiza una solicitud HTTP `POST` a la API de autenticación para iniciar sesión 
 * con las credenciales proporcionadas en el parámetro `data`. El parámetro `data` debe contener el nombre 
 * de usuario y la contraseña del usuario que está intentando iniciar sesión. La solicitud se envía con el 
 * encabezado `Content-Type` configurado como `application/json` y los datos se incluyen en el cuerpo de 
 * la solicitud como un objeto JSON.
 * 
 * @param {Object} data - Un objeto que contiene las credenciales de inicio de sesión, típicamente con las 
 *                         propiedades `name` (usuario) y `password` (contraseña).
 * 
 * @returns {Promise} - Retorna una promesa que se resuelve con la respuesta de la API de autenticación, 
 *                      la cual puede incluir un token de sesión o un mensaje de error dependiendo de las 
 *                      credenciales enviadas.
 */
export const authLogin = (data) => {
  return fetch(urlApiUser + "/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
}


/**
 * @fecha 2025-01-12
 * @autor Omar Echavarria
 * @descripcion Esta función realiza una solicitud HTTP `GET` a la API para obtener una lista de usuarios. 
 * La solicitud incluye un encabezado de autorización con el token almacenado en `localStorage` para 
 * autenticar al usuario que realiza la petición. El token se extrae utilizando la función `createHeaders`, 
 * que se asegura de incluir el encabezado de autorización en la solicitud.
 * 
 * @returns {Promise} - Retorna una promesa que se resuelve con la respuesta de la API, la cual contiene 
 *                      la lista de usuarios o un mensaje de error si la autenticación falla o si hay 
 *                      algún problema con la solicitud.
 */
export const getUsers = () => {
  return fetch(urlApiUser, {
    method: "GET",
    headers: createHeaders(true),
  });
}

/**
 * @fecha 2025-01-12
 * @autor Omar Echavarria
 * @descripcion Esta función realiza una solicitud HTTP `POST` a la API para agregar una nueva imagen. 
 * La solicitud incluye los datos de la imagen en el cuerpo de la petición, que se pasan como un objeto `FormData`. 
 * Los encabezados de la solicitud son configurados utilizando la función `createHeaders`, 
 * pero en este caso no se agrega el encabezado `Content-Type`, ya que el cuerpo contiene datos de formulario, 
 * lo cual es manejado automáticamente por el navegador.
 * 
 * @param {FormData} data - Los datos de la imagen a ser enviados, empaquetados como un objeto `FormData`.
 * 
 * @returns {Promise} - Retorna una promesa que se resuelve con la respuesta de la API, 
 *                      que indica el resultado de la operación (por ejemplo, si la imagen se añadió correctamente).
 */
export const addImage = (data) => {
  return fetch(urlApiImage, {
    method: "POST",
    headers: createHeaders(false),
    body: data
  })
}


/**
 * @fecha 2025-01-12
 * @autor Omar Echavarria
 * @descripcion Esta función realiza una solicitud HTTP `GET` a la API para obtener imágenes. 
 * La solicitud puede incluir un filtro que se pasa como parámetro opcional. Si el parámetro `filter` es proporcionado, 
 * este se convierte en una cadena JSON y se adjunta como un parámetro de consulta en la URL de la solicitud. 
 * Los encabezados de la solicitud son configurados utilizando la función `createHeaders` para incluir el token de autenticación.
 * 
 * @param {object} [filter] - Un objeto opcional que contiene los criterios de filtrado para la consulta de imágenes.
 *                            Si no se proporciona, la solicitud recupera todas las imágenes disponibles.
 * 
 * @returns {Promise} - Retorna una promesa que se resuelve con la respuesta de la API, 
 *                      que contiene la lista de imágenes obtenidas (según el filtro especificado, si es aplicable).
 */
export const getImages = (filter) => {
  return fetch(urlApiImage + (filter ? `?filter=${JSON.stringify(filter)}` : ""), {
    method: "GET",
    headers: createHeaders(true),
  })
}


/**
 * @fecha 2025-01-12
 * @autor Omar Echavarria
 * @descripcion Esta función realiza una solicitud HTTP `DELETE` a la API para eliminar una imagen específica 
 * identificada por su `id`. La URL de la solicitud se construye utilizando el `id` proporcionado, y los encabezados 
 * de la solicitud se configuran mediante la función `createHeaders` para incluir el token de autenticación. 
 * La eliminación de la imagen será procesada por el servidor, y la respuesta de la API determinará si la operación fue exitosa o no.
 * 
 * @param {string} id - El `id` único de la imagen que se desea eliminar.
 * 
 * @returns {Promise} - Retorna una promesa que se resuelve con la respuesta de la API después de intentar eliminar la imagen.
 */
export const deleteImage = (id) => {
  return fetch(urlApiImage + `/${id}`, {
    method: "DELETE",
    headers: createHeaders(true),
  })
}
