
//Librerias
const { Router } = require("express");
const multer = require("multer");
const sharp = require("sharp");
const { ObjectId } = require("mongodb");

// Servicios
const { uploadFile, deleteFile } = require("../services/S3");
const { getConnection } = require("../services/mongo-connection");

// Respuestas
const { responseOk, responseErrorServer, responseUnauthorizedOperation } = require("../services/responses");

// Middlewares
const { verifyToken } = require("../middlewares/verify-user");


const upload = multer();
const router = Router();

/**
 * @Controlador
 * @autor Omar Echavarria
 * @fecha 2025-01-12
 * @params Este controlador recibe desde el frontend las propiedades "user" y "date" en el cuerpo de la solicitud (body).
 * @descripcion Este controlador tiene como objetivo almacenar una imagen en S3 y registrar en MongoDB la información del usuario que la sube junto con la fecha de subida. Además, se encarga de convertir imágenes en formato JPG o JPEG a PNG antes de ser almacenadas.
 */
router.post("/", verifyToken ,upload.single("image"), async (req, res) => {
  const { user, date } = req.body;
  const image = req.file

  try {
    const connection = await getConnection();
    const imageCollection = connection.collection("images");

    // busca el propietario de la imagen
    const userCollection = connection.collection("users");
    const userMongo = await userCollection.findOne({ name: user });
    const data = {
      user_id: userMongo._id,
      date: new Date((parseFloat(date))),
      name_image: image.originalname,
      key_image: null,
    }
    // se crea el registro en Mongo
    const responseMongo = await imageCollection.insertOne(data);
    let rowId = responseMongo?.acknowledged ? responseMongo?.insertedId : null;

    // se convierte la imagen a PNG
    const imageToPngBuffer = await sharp(image.buffer).png().toBuffer();
    image.buffer = imageToPngBuffer

    // se envia la imagen a S3
    const keyImage = `images/${rowId}.png`
    const responseS3 = await uploadFile(image, keyImage);

    // si el guardado de la imagen es exitoso que agregue la key al documento de mongo 
    if (responseS3) {
      await imageCollection.updateOne({ _id: rowId }, {
        $set: { key_image: keyImage }
      });
    } else {
      await imageCollection.deleteOne({ _id: rowId });
    }

    responseOk(res);
  } catch (error) {
    console.log(error)
    responseErrorServer(res);
  }
});


/**
 * @Controlador
 * @autor Omar Echavarria
 * @fecha 2025-01-12
 * @params Este controlador recibe un objeto denominado "filter" con las siguientes propiedades:
 * - "from": una fecha en formato yyyy-mm-dd que indica el inicio del rango de búsqueda de registros.
 * - "to": una fecha en formato yyyy-mm-dd que especifica el final del rango de búsqueda de registros.
 * - "user_id": el identificador de un usuario en la colección "users".
 * @descripcion Este controlador devuelve tres tipos de información:
 * 1. Las imágenes que cumplen con los criterios de búsqueda.
 * 2. Una agregación de las imágenes agrupadas por hora.
 * 3. Una agregación de las imágenes agrupadas por usuario.
 */

router.get("/", verifyToken,  async (req, res) => {
  const filter = req?.query?.filter;
  let filterParse = null;
  if (filter) {
    filterParse = JSON.parse(filter);
  }

  try {
    const connection = await getConnection();
    const imageCollection = connection.collection("images");
    const matchFilter = {};
    if (filterParse?.from) {
      matchFilter.date = matchFilter.date || {}
      matchFilter.date.$gte = new Date(`${filterParse.from} 00:00:00`)
    }

    if (filterParse?.to) {
      matchFilter.date = matchFilter.date || {}
      matchFilter.date.$lte = new Date(`${filterParse.to} 23:59:00`)
    }

    if (filterParse?.user_id && filterParse?.user_id != "0") {
      matchFilter.user_id = Number(filterParse?.user_id)
    }

    const dataImages = await imageCollection.aggregate([
      {
        $match: matchFilter
      },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user"
        },
      },
      {
        $unwind: "$user"
      },
      {
        $project: {
          "user_id": 0,
          "user.password": 0,
        }
      },
      {
        $project: {
          key_image: 1,
          "user.name": 1,
          date: 1,
          colombianDate: {
            $dateToString: {
              format: "%Y-%m-%d %H:%M:%S",
              date: {
                $add: [
                  "$date",
                  -5 * 60 * 60 * 1000
                ]
              }
            }
          }
        }
      },
    ]).toArray();

    const countImages = await imageCollection.aggregate([
      {
        $match: matchFilter
      },
      {
        $group: {
          _id: {
            hour: {
              $hour: {
                date: {
                  $add: [
                    "$date",
                    -5 * 60 * 60 * 1000
                  ]
                }
              }
            }
          },
          totalImages: { $sum: 1 },
        }
      },
      {
        $project: {
          hour: "$_id.hour",
          totalImages: 1,
          _id: 0
        }
      }
    ]).toArray();

    const countImagesByUsers = await imageCollection.aggregate([
      {
        $match: matchFilter
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $group: {
          _id: '$user_id',
          totalImages: { $sum: 1 }, 
          user: { $first: '$user.name' }
        }
      },
      {
        $project: {
          user_id: '$_id',
          totalImages: 1,  
          user: 1,     
          _id: 0          
        }
      }
    ]).toArray();
    
    responseOk(res, { dataImages, countImages, countImagesByUsers });

  } catch (error) {
    //Sonsole.log(error);
    responseErrorServer(res);
  }
});


/**
 * @Controlador
 * @autor Omar Echavarria
 * @fecha 2025-01-14
 * @params Este controlador recibe un parámetro denominado "id" desde la URL de la petición, que corresponde al identificador de la imagen que se eliminará.
 * @descripcion Este controlador realiza la eliminación del registro de la imagen en MongoDB y también elimina el archivo .png correspondiente en S3.
 * Antes de proceder con la eliminación, se verifica que el usuario que realiza la solicitud sea el propietario de la imagen.
 */
router.delete("/:id", verifyToken ,async (req, res)=>{
  const {id} = req.params;
  const {user} = req
  try {
    const connection = await getConnection();
    const imageCollection = connection.collection("images");
    const userCollection = connection.collection("users");

    const userRequest =  await userCollection.findOne({name: user});
    const image = await imageCollection.findOne({_id: new ObjectId(id)});
    if(image.user_id != userRequest._id){
      return responseUnauthorizedOperation(res);
    }
    
    if(image?.key_image){
      await deleteFile(image.key_image);
      await imageCollection.deleteOne({_id: new ObjectId(id)});
    }
    
    responseOk(res);
  } catch (error) {
    console.log(error);
    responseErrorServer(res);
  }
});

module.exports = router;