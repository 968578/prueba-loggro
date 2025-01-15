import ITrash from "../../assets/icons/i-trash/i-trash";

/**
 * @fecha 2025-01-13
 * @autor Omar Echavarria
 * @descripcion Este componente presenta una tarjeta visual que muestra una imagen junto con 
 * información asociada a ella, como el propietario y la fecha de carga. Además, incluye un ícono de papelera 
 * que permite al usuario eliminar la imagen. Cuando el usuario hace clic en el ícono de la papelera, 
 * se activa un modal de confirmación para eliminar la imagen, pasando los datos correspondientes de la imagen a eliminar. 
 * La tarjeta tiene un diseño responsivo que se adapta al tamaño del contenedor y utiliza transiciones suaves al interactuar con el usuario.
 * 
 * @param {object} data - Los datos de la imagen que contiene la información sobre la imagen, su propietario y la fecha.
 * @param {function} setDataImageForDelete - Función que actualiza el estado con la imagen seleccionada para eliminación.
 * @param {function} setActiveModalDelete - Función que activa el modal de confirmación para eliminar la imagen.
 * 
 * @returns {JSX.Element} - Retorna una tarjeta que muestra la imagen y la información asociada a ella, junto con el ícono para eliminarla.
 */
const CardImage = ({ data, setDataImageForDelete, setActiveModalDelete }) => {

  return (
    <div className="border shadow-md rounded-lg flex flex-col items-center shadow-blue-100 hover:scale-105 duration-200" >
      <div className="flex justify-end w-full pr-1 pt-1">
        <span onClick={()=> {setDataImageForDelete(data); setActiveModalDelete(true)}} className="bg-red-100 hover:bg-red-200 cursor-pointer rounded duration-200">
          <ITrash />
        </span>
      </div>
      <div className="pt-2">
        <img src={`https://app-loggro.s3.us-east-2.amazonaws.com/${data?.key_image}`} alt="" className="w-32 h-32 object-contain" />
      </div>
      <div className="grid grid-rows-2 p-1">
        <span className="flex gap-x-1">
          <p className="font-bold text-sm">Propietario:</p>
          <p className="font-light text-sm">{data.user.name}</p>
        </span>
        <span className="flex gap-x-1">
          <p className="font-bold text-sm">Fecha:</p>
          <p className="font-light text-sm">{data.colombianDate}</p>
        </span>
      </div>
    </div>
  )
}

export default CardImage; 