// Librerias
const {S3Client, PutObjectCommand, DeleteObjectCommand} = require("@aws-sdk/client-s3");
require("dotenv").config();


/**
 * @Cliente S3
 * @autor Omar Echavarria
 * @fecha 2025-01-12
 * @descripcion Este cliente S3 se configura para interactuar con el servicio de S3 
 * de AWS utilizando las credenciales y la región configuradas en las variables de entorno. 
 * Se utiliza para realizar operaciones en el almacenamiento de S3, como cargar y eliminar archivos.
 */
const clientS3 = new S3Client({
  region: process.env.REGION_S3,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_S3, 
    secretAccessKey: process.env.SECRET_KEY_S3 
  }
});


/**
 * @autor Omar Echavarria
 * @fecha 2025-01-12
 * @descripcion Esta función guarda un archivo en un bucket de S3 y devuelve un valor booleano 
 * que indica si la operación fue exitosa. La función toma el archivo que se desea cargar y 
 * su respectiva clave (key) para ser almacenado en el servicio S3.
 * @param {Object} file - El archivo que será cargado a S3, debe contener la propiedad `buffer`.
 * @param {string} key - La clave única que identificará el archivo en el bucket de S3.
 * @returns {boolean} - Retorna `true` si el archivo fue guardado correctamente, `false` en caso contrario.
 */
const uploadFile= async (file, key)=>{
  
    const command = new PutObjectCommand({
      Bucket: process.env.BUCKET_S3,
      Key: key,
      Body: file.buffer,
      ContentType: "image/png",
    });

    const response = await clientS3.send(command);    
    return response.$metadata.httpStatusCode == 200
}


/**
 * @autor Omar Echavarria
 * @fecha 2025-01-14
 * @descripcion Esta función elimina un archivo de un bucket de S3 utilizando la clave proporcionada.
 * La función retorna un valor booleano que indica si la eliminación fue exitosa.
 * @param {string} key - La clave única del archivo en el bucket de S3 que se desea eliminar.
 * @returns {boolean} - Retorna `true` si el archivo fue eliminado correctamente, `false` en caso contrario.
 */
const deleteFile = async (key) =>{
  const command = new DeleteObjectCommand({
    Bucket: process.env.BUCKET_S3,
    Key: key,
  });
  const response = await clientS3.send(command);    
  return response.$metadata.httpStatusCode == 200
}

module.exports ={
  uploadFile,
  deleteFile,
}