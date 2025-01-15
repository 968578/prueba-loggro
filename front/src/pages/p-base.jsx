// Componentes
import CNavigation from "../components/components-complex/c-navigation";


/**
 * @fecha 2025-01-12
 * @autor Omar Echavarria
 * @descripcion Este componente sirve como un contenedor base para páginas en la aplicación. 
 * Su función principal es envolver el contenido de una página junto con una barra de navegación.
 * Renderiza el componente `CNavigation` para mostrar la barra de navegación y luego muestra el contenido 
 * recibido a través de la propiedad `children`, lo que permite reutilizar este contenedor en diversas páginas con contenido dinámico.
 * 
 * @param {React.ReactNode} children - Los componentes o elementos que se renderizarán dentro de este contenedor, 
 * representando el contenido dinámico de cada página.
 * 
 * @returns {JSX.Element} - Retorna un elemento `<main>` que contiene la barra de navegación y el contenido de la página.
 */
const PageBase=({children})=>{
  return (
    <main >
      <section >
        <CNavigation />
      </section>
      <section>
        {children}  
      </section>
    </main>
  )  
}

export default PageBase;