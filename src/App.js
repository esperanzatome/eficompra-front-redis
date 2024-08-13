import React from "react";
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import NoMatch from "./pages/no-match";
import HacerListaCompraContainer from './pages/hacer_lista_compra/hacer_lista_compra_container';
import HacerCompra from './pages/hacer_compra';
import HacerCompraCopyToShare from './pages/hacer_compra_copytoshare';
import HacerListaCompraTodos from './pages/hacer_lista_compra/hacer_lista_compra_todos';
import MiListaCompra from './pages/hacer_lista_compra/mi_lista_compra';
import Home from './pages/home';
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTrash, faSignOutAlt, faShareNodes } from "@fortawesome/free-solid-svg-icons";


library.add(faTrash, faSignOutAlt, faShareNodes);

function App() {

  return (
    <div className="container">
        
    <Router>
      <div >
       <Routes>
          <Route exact path="/" element={<Home/>}/>      
          <Route path="/hacer_lista_compra" element={<HacerListaCompraContainer/>} />
          <Route path="/hacer_compra" element={<HacerCompra/>}/>
          <Route path="/hacer_compra_copytoshare" element={<HacerCompraCopyToShare/>}/>
          <Route path="/hacer_lista_compra_todos"element={<HacerListaCompraTodos/>}/>
          <Route path="/mi_lista_compra"element={<MiListaCompra/>}/>
          <Route element={<NoMatch/>}/>

       </Routes>


         
   
      </div>
    </Router>
  </div>
  );
}

export default App;
