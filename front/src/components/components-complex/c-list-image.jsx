// React
import { useEffect, useRef, useState } from "react";

// Servicios
import { deleteImage, getImages, getUsers } from "../../services/services-api";
import { handleCommon } from "../../services/handler-response";

// Componentes
import CardImage from "../components-simple/card-image";
import LblPrimary from "../components-simple/Lbl-primary";
import ModalConfirmOperation from "./c-modal-confirm";

//Librerias 
import * as echarts from "echarts";


const CListImage = () => {

  // Estados
  const [images, setImages] = useState([]);
  const [countImages, setCountImages] = useState(null);
  const [countImagesByUsers, setCountImagesByUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [activeModalDelete, setActiveModalDelete] = useState(false);
  const [dataImageForDelete, setDataImageForDelete] = useState(false);
  const [isOkDelete, setIsOkDelete] = useState(false);
  const [isUnauthorized, setIsUnauthorized] = useState(false);

  const [input, setInput] = useState({
    user_id: "",
    from: "",
    to: ""
  });

  // Referencias
  const inpFromRef = useRef();
  const inpToRef = useRef();
  const chartRef1 = useRef();
  const chartRef2 = useRef();


  /**
 * @fecha 2025-01-12
 * @autor Omar Echavarria
 * @descripcion Este `useEffect` se ejecuta al montar el componente. Realiza una solicitud a la API para obtener las imágenes, 
 * y luego procesa la respuesta. Si la respuesta es exitosa, actualiza los estados locales con los datos obtenidos. 
 * Específicamente, se actualizan los estados de `images`, `countImages`, y `countImagesByUser` con la información proporcionada 
 * en la respuesta de la API. 
 * Este efecto se ejecuta una sola vez al inicio, ya que el arreglo de dependencias está vacío.
 * @param {void} - No recibe parámetros directamente.
 * @returns {void} - No retorna ningún valor.
 */
  useEffect(() => {
    getImages()
      .then(r => r.json())
      .then(d => {
        handleCommon(d,
          () => {
            setImages(d.data.dataImages);
            setCountImages(d.data.countImages);
            setCountImagesByUser(d.data.countImagesByUsers);
          }
        )
      })
  }, []);


  /**
  * @fecha 2025-01-13
  * @autor Omar Echavarria
  * @descripcion Este `useEffect` se ejecuta cada vez que se actualiza el estado `countImages`. 
  * Se asegura de que el gráfico de barras se renderice correctamente, usando los datos de `countImages` 
  * para generar una visualización con la cantidad de imágenes por hora. El gráfico es inicializado y 
  * redimensionado si es necesario, y se configuran sus opciones, incluyendo el título, los ejes y los datos 
  * que serán mostrados en las barras del gráfico.
  * @param {void} 
  * @returns {void} - No retorna ningún valor.
  */
  useEffect(() => {
    if (chartRef1.current != null && countImages) {
      const chartBars = echarts?.init(chartRef1.current);
      chartBars?.resize()
      chartBars?.setOption({
        title: {
          text: 'Imágenes por hora',
          left: 'center'
        },
        xAxis: {
          axisLabel: {
            interval: 0
          },
          type: 'category',
          data: countImages.map(e => `${(e.hour < 10 ? `0` : "") + e.hour}:00`)
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: countImages.map(e => e.totalImages),
            type: 'bar'
          }
        ]
      });
    }
  }, [countImages]);


  /**
 * @fecha 2025-01-13
 * @autor Omar Echavarria
 * @descripcion Este `useEffect` se ejecuta cada vez que se actualiza el estado `countImagesByUsers`. 
 * Se encarga de inicializar y configurar un gráfico de pastel (pie chart) para mostrar la distribución de 
 * imágenes por usuario. Se ajusta el tamaño del gráfico y se configuran las opciones visuales como el 
 * título, las leyendas, el formato de los segmentos del pastel y las etiquetas. Los datos utilizados en el gráfico 
 * provienen del estado `countImagesByUsers`, que contiene la cantidad de imágenes por usuario.
 * @param {void} 
 * @returns {void} - No retorna ningún valor.
 */
  useEffect(() => {
    if (chartRef2.current != null && countImagesByUsers) {
      const chartPie = echarts?.init(chartRef2.current);
      chartPie?.resize()
      chartPie?.setOption({
        title: {
          text: 'Imágenes por usuario',
          left: 'center',
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '10%',
          left: 'center'
        },
        series: [
          {
            top: "8%",
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 40,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: countImagesByUsers.map(ele => {
              return {
                value: ele.totalImages,
                name: ele.user
              }
            })
          }
        ]
      });

    }
  }, [countImagesByUsers]);


  /**
 * @fecha 2025-01-13
 * @autor Omar Echavarria
 * @descripcion Este `useEffect` se ejecuta al montar el componente. Realiza una solicitud a la API para obtener la lista de usuarios, 
 * y luego procesa la respuesta. Si la respuesta es exitosa, actualiza el estado local `users` con los datos obtenidos. 
 * Esta lista de usuarios será utilizada para llenar un elemento `<select>` en la interfaz.
 * Este efecto se ejecuta una sola vez al inicio, ya que el arreglo de dependencias está vacío.
 * @param {void} - No recibe parámetros directamente.
 * @returns {void} - No retorna ningún valor.
 */
  useEffect(() => {
    getUsers()
      .then(r => r.json())
      .then(d => {
        handleCommon(d,
          () => {
            setUsers(d.data);
          }
        )
      });
  }, []);


  /**
   * @fecha 2025-01-13
   * @autor Omar Echavarria
   * @descripcion Esta función se ejecuta cuando el usuario selecciona un nuevo valor en el `select` de usuarios. 
   * Actualiza el estado `input` con el `user_id` seleccionado, manteniendo el resto de los valores anteriores en el estado.
   * Específicamente, actualiza la propiedad `user_id` con el valor seleccionado en el evento `e.target.value`.
   * @param {Object} e - El evento generado por el cambio en el `select`, contiene el valor seleccionado en `e.target.value`.
   * @returns {void} - No retorna ningún valor.
   */
  const changeUser = (e) => {
    setInput({
      ...input,
      user_id: e.target.value
    });
  }


  /**
 * @fecha 2025-01-13
 * @autor Omar Echavarria
 * @descripcion Esta función maneja los cambios en los campos de fecha (desde y hasta) del formulario. 
 * Cuando se actualiza un campo de fecha, la función valida que la fecha "desde" no sea mayor que la fecha "hasta" 
 * y viceversa. Si se detecta que la condición no se cumple, borra el valor del campo contrario y lo restablece en el estado.
 * La función también actualiza el estado `input` con el nuevo valor de la fecha seleccionada.
 * @param {Object} e - El evento generado por el cambio en el campo de fecha, contiene el nombre del campo y su nuevo valor en `e.target.name` y `e.target.value`.
 * @returns {void} - No retorna ningún valor.
 */
  const changeDate = (e) => {
    const copyInput = { ...input };
    const date = new Date(e.target.value);

    copyInput[e.target.name] = e.target.value;
    if (e.target.name == "from" && copyInput.to) {
      if (date > new Date(copyInput.to)) {
        console.log("desde es mayor")
        inpToRef.current.value = "";
        copyInput.to = "";
      }
    } else if (e.target.name == "to" && copyInput.from) {
      if (date < new Date(copyInput.from)) {
        console.log("desde es mayor")
        inpFromRef.current.value = "";
        copyInput.from = "";
      }

    }
    setInput(copyInput);
  }


  /**
 * @fecha 2025-01-13
 * @autor Omar Echavarria
 * @descripcion Esta función se encarga de enviar el filtro de búsqueda (almacenado en el estado `input`) a la API 
 * para obtener las imágenes y sus respectivos conteos. Una vez obtenida la respuesta, la función actualiza el estado 
 * de las imágenes y los conteos correspondientes en la interfaz de usuario.
 * @param {void} 
 * @returns {void} - No retorna ningún valor.
 */
  const submitFilter = () => {
    getImages(input)
      .then(r => r.json())
      .then(d => {
        handleCommon(d,
          () => {
            setImages(d.data.dataImages);
            setCountImages(d.data.countImages);
            setCountImagesByUser(d.data.countImagesByUsers);
          }
        )
      });
  }


  /**
   * @fecha 2025-01-14
   * @autor Omar Echavarria
   * @descripcion Esta función se ejecuta cuando el usuario hace clic en el botón para eliminar una imagen.
   * Realiza una solicitud a la API para eliminar la imagen correspondiente utilizando su ID. Si la eliminación 
   * es exitosa, actualiza el estado `isOkDelete` a `true` y vuelve a aplicar el filtro para actualizar la lista 
   * de imágenes. Si la eliminación falla debido a que el usuario no está autorizado, establece el estado 
   * `isUnauthorized` a `true`.
   * @param {void} 
   * @returns {void} - No retorna ningún valor.
   */
  const clickDeleteImage = () => {
    deleteImage(dataImageForDelete._id)
      .then(r => r.json())
      .then(d => {
        handleCommon(d,
          () => {
            setIsOkDelete(true);
            submitFilter();
          },
          () => {
            setIsUnauthorized(true);
          }
        )
      })
  }


  return (
    <div>
      <ModalConfirmOperation
        active={activeModalDelete}
        setActive={setActiveModalDelete}
        action={clickDeleteImage}
        dataImageForDelete={dataImageForDelete}
        isOkDelete={isOkDelete}
        setIsOkDelete={setIsOkDelete}
        isUnauthorized={isUnauthorized}
        setIsUnauthorized={setIsUnauthorized}
      />
      <section className="border mx-5 flex flex-col min-h-[400px] max-h-[400px] overflow-y-scroll shadow-md rounded-md">
        <div className="rounded-t-sm flex justify-center bg-gray-300 ">
          <div className="flex gap-y-2 pb-2 items-end gap-x-5">
            <div className="flex flex-col">
              <LblPrimary value="Propietario" />
              <select className="rounded-sm" name="user_id" id="user" onChange={changeUser}>
                <option value="0">-- Selecciona --</option>
                {
                  users.length > 0 && users.map((user) => {
                    return (
                      <option key={user._id} value={user._id}>{user.name}</option>
                    )
                  })
                }
              </select>
            </div>
            <div className="flex gap-x-5" >
              <div className="flex flex-col">
                <LblPrimary value="Desde" />
                <input onChange={changeDate} name="from" ref={inpFromRef} className="rounded" type="date" />
              </div>
              <div className="flex flex-col">
                <LblPrimary value="Hasta" />
                <input onChange={changeDate} name="to" ref={inpToRef} className="rounded" type="date" />
              </div>
            </div>
            <button onClick={submitFilter} type="button" className="border px-1 rounded bg-slate-200 hover:bg-slate-100 duration-150">
              Buscar
            </button>
          </div>
        </div>
        <section className="m-4 flex-1">
          <div className="grid grid-cols-5 gap-4 ">
            {
              images.length > 0 ? images.map((ele) => {
                return (
                  <CardImage key={ele._id} data={ele} setDataImageForDelete={setDataImageForDelete} setActiveModalDelete={setActiveModalDelete} />
                )
              })
                :
                <p className="text-red-800">No hay imagenes en el sistema</p>
            }
          </div>
        </section>
      </section>
      <section className="border mx-5 grid grid-cols-2 justify-items-center min-h-[350px] shadow-md rounded-md mt-2 pt-2 mb-4">
        <div ref={chartRef1} style={{ width: "400px", height: "350px" }}>
        </div>
        <div ref={chartRef2} style={{ width: "400px", height: "350px" }}>
        </div>
      </section>
    </div>
  )
}

export default CListImage;