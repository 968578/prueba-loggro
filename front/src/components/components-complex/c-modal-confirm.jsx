// React
import { useRef, useState } from "react";

// Componentes
import BtnPrimary from "../components-simple/btn-primary";

// Iconos
import ICancel from "../../assets/icons/i-cancel/i-cancel";


/**
 * @fecha 2025-01-14
 * @autor Omar Echavarria
 * @descripcion Este componente muestra un modal de confirmación para la eliminación de una imagen. 
 * Cuando el usuario interactúa con el modal, puede confirmar o cancelar la operación de eliminación.
 * Si se confirma, ejecuta una acción definida en el prop `action`. Además, muestra mensajes de estado dependiendo 
 * de la operación, como "Imagen Eliminada" o "No puedes eliminar una imagen de otra persona".
 * 
 * @param {boolean} active - Estado que determina si el modal está activo o no.
 * @param {function} setActive - Función para actualizar el estado de activación del modal.
 * @param {function} action - Función a ejecutar cuando el usuario confirma la eliminación.
 * @param {object} dataImageForDelete - Datos de la imagen que se va a eliminar.
 * @param {boolean} isOkDelete - Estado que indica si la imagen fue eliminada correctamente.
 * @param {function} setIsOkDelete - Función para actualizar el estado de eliminación exitosa.
 * @param {boolean} isUnauthorized - Estado que indica si el usuario tiene permiso para eliminar la imagen.
 * @param {function} setIsUnauthorized - Función para actualizar el estado de autorización.
 * 
 * @returns {JSX.Element} Renderiza el modal con las opciones de confirmación de eliminación.
 */
const ModalConfirmOperation = ({
  active,
  setActive,
  action,
  dataImageForDelete,
  isOkDelete,
  setIsOkDelete,
  isUnauthorized,
  setIsUnauthorized,
}) => {

  // Estados
  const [hideBtns, setHideBtns] = useState(false);

  // Referencias
  const c_modal = useRef(null);

  /**
 * @fecha 2025-01-14
 * @autor Omar Echavarria
 * @descripcion Esta función se encarga de desactivar un modal cuando el usuario hace clic fuera de él.
 * Si el clic ocurre fuera del modal (es decir, si el clic no está dentro de `c_modal`), la función
 * restablece varios estados: `active` a `false`, `hideBtns` a `false`, `isOkDelete` a `false`, 
 * e `isUnauthorized` a `false`, lo que sirve para cerrar el modal y limpiar cualquier mensaje de error o éxito.
 * @param {object} e - El evento de clic.
 * @returns {void} - No retorna ningún valor.
 */
  const desactiveModal = (e) => {
    if (c_modal.current) {
      if (e.target && !c_modal.current.contains(e.target)) {
        setActive(false);
        setHideBtns(false);
        setIsOkDelete(false);
        setIsUnauthorized(false);
      }
    }
  }

  const clickSi = () => {
    setHideBtns(true);
    action();
  }

  if (active) {
    return (
      <div onClick={desactiveModal} className="fixed w-screen h-screen bg-[rgba(0,0,0,0.5)] left-0 top-0 z-10">
        <div className="grid grid-cols-1 w-full h-full ">
          <div className="flex flex-row justify-center items-center">
            <div ref={c_modal} className="bg-slate-50 h-[50%] sm:w-[50%] w-[70%] rounded flex flex-col ">
              <div className="flex justify-end pr-2 pt-2">
                <span className="cursor-pointer" onClick={() => { setActive(false); setHideBtns(false); setIsOkDelete(false); setIsUnauthorized(false) }}>
                  <ICancel />
                </span>
              </div>
              <div className="flex-1 flex  justify-center ">
                <div className="m-5  flex flex-row items-center">
                  <div className="flex flex-col justify-center items-center gap-y-2">
                    <p>¿Quieres eliminar la imagen?</p>
                    {
                      isOkDelete ?
                        <p className="text-blue-500 border-b border-blue-500">Imagen Eliminada</p>
                        :
                        isUnauthorized ?
                          <p className="text-red-500 border-b border-red-500">No puedes eliminar una imagen de otra persona</p>
                          :
                          hideBtns ?
                            <p className="text-slate-500 border-b border-slate-500">Eliminando...</p>
                            :
                            <div className="border w-40 h-40">
                              <img className="w-40 h-40 object-contain" src={`https://app-loggro.s3.us-east-2.amazonaws.com/${dataImageForDelete?.key_image}`} alt="" />
                            </div>
                    }
                    {
                      hideBtns ?
                        <div></div>
                        : <div className="flex flex-row gap-x-4 justify-center ">
                          <div className="w-10 h-10">
                            <BtnPrimary value="Si" active={true} click={clickSi} type="buttom" typeBol="blue" />
                          </div>
                          <div className="w-10">
                            <BtnPrimary value="No" active={true} click={() => { setActive(false); setHideBtns(false); setIsOkDelete(false); setIsUnauthorized(false) }} type="buttom" typeBol="red" />
                          </div>
                        </div>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ModalConfirmOperation;