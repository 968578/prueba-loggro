// React
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

// Iconos
import IAddImage from "../../assets/icons/i-add-image/i-add-image";

// Componentes
import ErrorForm from "../components-simple/error-form";
import BtnPrimary from "../components-simple/btn-primary";

// Servicios
import { addImage } from "../../services/services-api";
import { handleCommon } from "../../services/handler-response";


const CFormImage = () => {

  // Estados
  const [error, setError] = useState("");
  const [loadedImage, setloadedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [imageIsSent, setImageIsSent] = useState(false);
  const [activeBtn, setActiveBtn] = useState(false);

  // Referencias
  const inputFileRef = useRef(null);
  const navigate = useNavigate();

  //Funciones 
  /**
 * @fecha 2025-01-12 
 * @autor Omar Echavarria 
 * @descripcion Esta función valida si la imagen cargada cumple con los requisitos de tipo y tamaño. 
 * Si la imagen no cumple con las condiciones establecidas (tipo de archivo JPEG/JPG y tamaño máximo de 3MB),
 * se elimina la imagen y se establece un mensaje de error para mostrar en pantalla.
 * @param {File} image - El archivo de imagen que será validado.
 * @returns {boolean} - Retorna `true` si la imagen cumple con las validaciones, de lo contrario retorna `false`.
 */
  const validateImage = (image) => {
    // se valida el tipo de archivo
    if (!["image/jpeg", "image/jpg"].includes(image.type)) {
      deleteImage();
      setError("La imagen debe ser jpg o jpeg");
      return false;
    }

    // se valida el peso del archivo, maximo 4 mb
    if (image.size > 4000000) {
      deleteImage();
      setError("EL tamaño es mayor a 4mb");
      return false;
    }

    return true;
  }

/**
 * @fecha 2025-01-12 
 * @autor Omar Echavarria 
 * @descripcion Esta función elimina la imagen cargada, restablece los estados asociados (como el error, la imagen cargada y la previsualización), 
 * y limpia el valor del campo de entrada de archivo.
 * @param {void} - No recibe parámetros.
 * @returns {void} - No retorna ningún valor.
 */
  const deleteImage = () => {
    // limpia los estados
    setError("");
    setloadedImage(null);
    setPreviewImage(null);

    // limpia el input
    inputFileRef.current.value = null;
  }

/**
 * @fecha 2025-01-12 
 * @autor Omar Echavarria 
 * @descripcion Esta función maneja el error cuando la imagen no puede ser mostrada, indicando que el archivo no es válido (dañado o incorrecto). 
 * Al producirse el error, elimina la imagen cargada, muestra un mensaje de error y desactiva el botón de envío.
 * @param {Event} e - El evento que se dispara cuando ocurre un error al mostrar la imagen.
 * @returns {void} - No retorna ningún valor.
 */
  const errorShowImage = (e) => {
    deleteImage();
    setError("La imagen está dañada");
    setActiveBtn(false);
  }

/**
 * @fecha 2025-01-12 
 * @autor Omar Echavarria 
 * @descripcion Esta función se ejecuta cada vez que el usuario cambia el archivo en el formulario. 
 * Valida si la imagen cargada cumple con los criterios de tamaño y tipo. Si la imagen es válida, 
 * establece los estados necesarios para la previsualización de la imagen y habilita el botón de envío. 
 * Si la imagen no es válida, resetea los estados relacionados.
 * @param {Event} e - El evento que se dispara cuando el usuario selecciona un archivo.
 * @returns {void} - No retorna ningún valor.
 */
  const changeImage = (e) => {
    setError("");
    const image = e.target.files[0];

    if (!image || !validateImage(image)) {
      setloadedImage(null);
      return
    }

    setloadedImage(image)
    setPreviewImage(URL.createObjectURL(image));
    setActiveBtn(true);
  }


/**
 * @fecha 2025-01-12 
 * @autor Omar Echavarria 
 * @descripcion Esta función se encarga de enviar la imagen cargada a la API. 
 * Primero valida si hay algún error, si no se ha cargado la imagen o si no hay una previsualización disponible. 
 * Luego obtiene el token de usuario desde el almacenamiento local, valida que el usuario exista y esté autenticado.
 * Si todo es correcto, crea un formulario con los datos necesarios (usuario, fecha y la imagen) 
 * y realiza una solicitud a la API para agregar la imagen. 
 * Si la solicitud es exitosa, limpia los estados y marca la imagen como enviada.
 * @param {void} - No recibe parámetros directamente.
 * @returns {void} - No retorna ningún valor.
 */
  const submitForm = () => {
    if (error != "" || loadedImage === null || previewImage === null) {
      return
    }

    const user = window.localStorage.getItem("token-prueba-loggro");
    if (!user) {
      return navigate("/")
    }

    const userParse = JSON.parse(user);
    if (!userParse?.user) {
      window.localStorage.removeItem("token-prueba-loggro");
      return navigate("/")
    }
    setActiveBtn(false);

    const formData = new FormData();
    formData.append("user", userParse?.user);
    formData.append("date", Date.now());
    formData.append("image", loadedImage);

    addImage(formData)
      .then(r => r.json())
      .then(d => {
        handleCommon(d,
          () => {
            deleteImage();
            setImageIsSent(true);
          }
        )
      })
      .catch((err) => console.log(err));
  }


  return (
    <section className="w-screen flex items-center justify-center mt-16">
      <div className="shadow-lg border-2 border-slate-400 rounded-md w-96 h-96 flex flex-col items-center justify-start py-2">
        <div className="grid grid-rows-2 justify-items-center gap-y-1">
          <div className="border-slate-400 border-2 rounded-md w-48">
            <label className="font-work xl:text-md text-sm hover:cursor-pointer" htmlFor="image">
              <input ref={inputFileRef} type="file" id="image" name='image' hidden accept=".jpg, .jpeg" onChange={changeImage} />
              <div className="flex items-center justify-center">
                <IAddImage />
                <p className="font-Roboto text-base">Agregar Imagen</p>
              </div>
            </label>
          </div>
        </div>
        <div className="border border-gray-300 w-56 h-56 flex justify-center items-center">
          {
            previewImage ?
              <img className="w-full h-full object-contain" src={previewImage} onError={errorShowImage} alt="" />
              :
              imageIsSent ?
                <p className="text-blue-500 border-b border-blue-500">Imagen Guardada</p>
                :
                <p className="text-sm"></p>
          }
        </div>
        <div className="flex gap-3 mt-1">
          <BtnPrimary type="buttom" value="Guardar" typeBol="blue" click={submitForm} active={activeBtn} />
          <BtnPrimary type="buttom" value="Eliminar" typeBol="red" click={() => { deleteImage(); setActiveBtn(false) }} />
        </div>
        <div className="mt-2">
          <ErrorForm value={error} />
        </div>
      </div>
    </section>
  )
}

export default CFormImage;
