// Componentes
import CListImage from "../components/components-complex/c-list-image";
import PageBase from "./p-base";

/**
 * @fecha 2025-01-12
 * @autor Omar Echavarria
 * @descripcion Este componente representa una página que muestra una lista de imágenes. 
 * Utiliza el componente `PageBase` para envolver la estructura de la página, que incluye la barra de navegación 
 * y la visualización de las imágenes a través del componente `CListImage`.
 * 
 * @returns {JSX.Element} - Retorna una página estructurada con la barra de navegación y la lista de imágenes.
 */

const PageListImage=()=>{
  return(
    <PageBase>
      <CListImage />
    </PageBase>
  )
}

export default PageListImage;