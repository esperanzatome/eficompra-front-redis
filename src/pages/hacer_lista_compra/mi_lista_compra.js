import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import fondo from "../../libreta.png";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";




export default class MiListaCompra extends Component {

  constructor(props) {
  
    super()
    this.state={
    data:[],
    buscador:'',
    placeholderBuscador:'Select a product',
    options:[],
    dataTotal:[],
    productsList:[],
    productSelected:[],
    product_list:[],
    añadirButton:'',
    isLoading:true

    }
  
  this.handleAñadirProducto=this.handleAñadirProducto.bind(this)
  this.handleOnClick=this.handleOnClick.bind(this)
  this.handleSelectCantidad=this.handleSelectCantidad.bind(this)
  this.handleDelete=this.handleDelete.bind(this)
  this.handleComprar=this.handleComprar.bind(this)
  this.getTotalProduct=this.getTotalProduct.bind(this)
  this.getProductSelected=this.getProductSelected.bind(this)
  this.getOptions=this.getOptions.bind(this)
  this.deleteDataBase=this.deleteDataBase.bind(this)
  this.teclaEnter=this.teclaEnter.bind(this)
 
    
  }

  getProductsToBuy(){
 

    return(
    axios
    .get("https://eficompra-back-redis.onrender.com/hacerCompra")
    .then(response => {

  this.setState({
    data:response.data,
    isLoading:false
   
   
    
  })
    })
    )
  }
  
 
getProductsList() {
   
  axios
  .get("https://eficompra-back-redis.onrender.com/")
  .then(response => {
 
    this.setState({
        dataTotal:response.data,
        isLoading:false

      }
    )

} )

}  

getAñadirButton(){
 
  return(
    this.setState({
      añadirButton: 
        <div>
      <div className="añadir-producto">
      <button id="Añadir producto" onClick={this.handleAñadirProducto} className="añadirProductoButton">Añadir producto</button>
      </div>
      </div>
    })
  )
  

}

getProductSelected(){

  this.state.data.map(i=>{
    if(this.state.productSelected.includes(i.name)===false){
      this.state.productSelected.unshift(i.name)
      return(
       this.state.productSelected
        )
    }
    
    
return(
  this.state.productSelected
)
  })

  }
  
getOptions(){

  this.state.dataTotal.map(i=>{
   
      this.state.productsList.push({
        id:i.key,
        productName:`${i.productData.productName.toLowerCase().replace(i.productData.trademark,"")} __ ${i.productData.price} €`,
        trademark:i.productData.trademark,
        price:i.productData.price,
        reference_price:i.productData.reference_price,
        supermarket:i.productData.supermarket
      })
      return(
        this.state.productsList
    )
    
  }
)




this.state.productsList.map(i=>{
 
  
    this.state.options.push(<option key={this.state.productsList.indexOf(i)}value={i.productName} price={i.price}></option>)
  
    return(
    
      this.state.options
    )
})


}

deleteDataBase(){

  this.state.data.map(i=>{
    return(
      axios
      .delete("https://eficompra-back-redis.onrender.com/hacerCompra")
    )
    })
    
}

teclaEnter(event){
 
  if(event.target.name=== "buscadorProductos"&&event.keyCode === 13){
    
      this.handleOnClick(event)
    
  

    
}else if(event.target.name=== "notas"&&event.keyCode === 13){
  this.handleNotes(event)
}

}
    
  


   
 
  handleSelectCantidad(event){

 
    this.state.data.map(i=>{
   
      if(event.target.id===i.idHacerCompra){
        
      i.cantidad=event.target.value
    return(
      this.setState({
        data:this.state.data
    })
    )

    }
  return(this.state.data)
  })
   
    
   }
  getTotalProduct(){

  this.state.data.map(i=>{
  
    i.total=i.cantidad*i.price

   return(
    i.total
   )
})


return(
  this.state.data
 
)


  
}   
  

  handleOnClick(event){
    const eventValue=event.target.value

    this.state.productsList.map(i=>{      
      const product=i.productName


      if(event.target.value!==' '&&eventValue===product&&this.state.productSelected.includes(product)===false){
        this.state.productSelected.unshift(product)
       
        this.state.data.unshift({idHacerCompra:(i.id).toString(),name:i.productName,cantidad:1,price:i.price,supermarket:i.supermarket})
     
        this.setState({
        productSelected:this.state.productSelected,
        placeholderBuscador:"Select another product",
        data:this.state.data
  
        })

       
      
    
      }

      return (event.target.value='')
    })

    this.state.data.map(i=>{
      if(this.state.data[0].name===i.name&&this.state.data.indexOf(i)!==0){
        this.state.data.splice(0,1)
      }
    return(this.state.data)
    })
        
    this.setState({
      data:this.state.data
    })}
        
  
   
  handleAñadirProducto(event){
    this.setState({
      buscador:  <div className="buscador-wrapper-MiListaCompra">
      <input key='buscadorProductos' type='text'name="buscadorProductos" list="Products" placeholder={this.state.placeholderBuscador } 
      onClick={this.handleOnClick}  onKeyUp={this.teclaEnter}>
      </input>
     
      <datalist key='Products'id="Products" className="dataList">
        {this.state.options.map(i=>{
          return (
          <div className="option" key={this.state.options.indexOf(i)}>
  
           { i}
          </div>
          )})}
      </datalist>
  
      </div>,
  
     añadirButton:''
  })

}
  
    
  handleDelete(event){
 
    this.state.data.map(i=>{
   

  
      if(event.target.id===i.idHacerCompra){

      this.state.data.splice(this.state.data.indexOf(i),1)
      this.state.productSelected.map(pS=>{
 
     if(i.name===pS){
      this.state.productSelected.splice(this.state.productSelected.indexOf(pS),1)
   
     }
        
       

   return(this.state.productSelected)
    })
    return(
      
      this.setState({
      data:this.state.data,
      productSelected:this.state.productSelected
      })
    )}
    return(this.state.data,
      this.state.productSelected
    )
  })
    

   
  
  }    
          
  
  
   
 

  handleComprar(){          
     
          


  this.state.data.map(i=>{
    return(
    axios
    
    .post("https://eficompra-back-redis.onrender.com/hacerCompra",{
      idHacerCompra:i.idHacerCompra,
      name:i.name,
      cantidad:parseInt(i.cantidad),
      price:i.price,
      supermarket:i.supermarket
    })
    )
  })
 

   
      
          
      
     
        
    }
  
  
  
           
  componentDidMount(){
        
    this.getProductsToBuy()
    this.getProductsList()
    this.getAñadirButton()
   

   
   
  }

  componentDidUpdate(){
  

  this.getProductSelected()
  

  this.getOptions()
  
if(this.state.productsList.length>0)
  this.deleteDataBase()

  }
  

  render(){

  window.onbeforeunload = function(e) {
    return "You have some unsaved changes";
  }

           
    
    return(
     
      <div className="content-wrapper">
    
        <div className="titleMiListaCompra">
          <h2>Mi lista de la compra</h2>
        </div>
        <div className="miListaCompra"style={{backgroundImage:`url(${fondo})`}}>
        {this.state.isLoading?(
      
      <div className="loader">
        <FontAwesomeIcon icon="spinner" spin/>
      </div>
    ):null}

<div className="añadirWrapper">
{this.state.añadirButton}

<div className="buscadorMiListaCompra">
{this.state.buscador}

</div>
</div>

<div className="listaMiListaCompra">



{this.state.data.map(i=>{
if(this.state.data.length>0){
  i.total=i.cantidad*i.price

  return(
   
    <div key={i.idHacerCompra} className="productsMiListaCompra">
    <div className="parteIzquierdaMiListaCompra">
    
    {i.name} 
    </div>
    
    <div className="parteDerechaMiListaCompra">
    
    <input type='number'id={i.idHacerCompra} min='1' placeholder={i.cantidad}value={i.cantidad}onChange={this.handleSelectCantidad} name={i.name}></input>
    
   {/*_ {i.total.toFixed(2)}€*/}
    
    <div className="borrarMiListaCompra">
    
    <div className="btn">
    <button id={i.idHacerCompra} onClick={this.handleDelete} className="btn"></button>
    <div className="iconMiListaCompra">
    <FontAwesomeIcon icon="trash" />
    </div>
    </div>
    </div>
    </div>
    </div>
    )
}
 
return(this.state.data)
}

  
  )}

  


 <div className="total-cantidad-miListaCompra">


  
      TOTAL:  { `${this.state.data.reduce((a,b)=>a+b.total,0).toFixed(2)} €`}
 
      
        </div>
</div>

<div className="comprarMiListaCompra">
  

          <Link to="../hacer_compra" onClick={this.handleComprar}>Comprar</Link>
        </div>
        </div>
       
      </div>
      )
    }
  }


      