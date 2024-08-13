
import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTrash, faSpinner } from "@fortawesome/free-solid-svg-icons";

import fondo from "../../libreta.png"

library.add(faTrash, faSpinner);


export default class HacerListaCompraTodos extends Component {
  
  constructor(props) {
    super()
    this.state={
        data:[],
        productsList:[],
        options:[],
        productSelected:[],
        placeholderBuscador:"Select a product",
        placeholderCantidad:1,
        hacerLista:[],
        product_list:[],
        botonComprar:"",
        pageTitle:<h2>Hacer lista de la compra</h2>,
        productsToBuy:[],
        isLoading:true,
        inputNotes:'',
        notes:[]
        
    }
    this.getProductsList=this.getProductsList.bind(this);
    this.handleOnClick=this.handleOnClick.bind(this);
    this.handleDelete=this.handleDelete.bind(this);
    this.handleComprar=this.handleComprar.bind(this);
    this.handleSelectCantidad=this.handleSelectCantidad.bind(this);
    this.teclaEnter=this.teclaEnter.bind(this);
    this.handleNotes=this.handleNotes.bind(this);
  }

  getProductsList() {

    axios
      .get("https://eficompra-back-redis.onrender.com/")
      .then(response=> {
        this.setState({
            data:response.data,
            isLoading:false,
          })
     
      })
     
    }
    
    getOptions(){
      if(this.state.productsList.length===0){
      
      this.state.data.map(product=>{
        this.state.productsList.push({
          id:product.key,
          productName:`${product.productData.productName.toLowerCase().replace(product.productData.trademark,"")} __ ${product.productData.price} €`,
          trademark:product.productData.trademark,
          price:product.productData.price,
          reference_price:product.productData.reference,
          supermarket:product.productData.supermarket
        })
      return(this.state.productsList)
      
    })
    

    this.state.productsList.sort(function(a,b){

      if(a.reference_price<b.reference_price){
      
        return 1
      
      }
      if(a.reference_price>b.reference_price){
        return -1
        
      }
      return 0
     
    })
      this.state.productsList.map(i=>{
       // this.state.productsList[this.state.productsList.indexOf(i)].reference_price=parseFloat(i.reference_price)
       return(
        parseFloat(i.reference_price),

        this.state.options.push(<option key={this.state.productsList.indexOf(i)}value={i.productName} price={i.price}></option>),
      
       
       
    this.setState({
      productsList:this.state.productsList,
      options:this.state.options
    })
  )
      })
   
}

}
teclaEnter(event){
  if(event.target.name==="buscadorProductos"&&event.keyCode ===13){
    this.handleOnClick(event);
}else if(event.target.name=== "notas"&&event.keyCode === 13){
  this.handleNotes(event)
}
}
  handleOnClick(event){
this.setState ({
  isLoading:true
})
if(this.state.data.length>0){
  return(
    this.state.productsList.map(i=>{

      if(event.target.value!==""&&event.target.value===i.productName&&this.state.productSelected.includes(i)===false){
     
   
     
        this.state.productSelected.unshift(i)
          this.setState({
            productSelected:this.state.productSelected,
            placeholder:"Select another product",
            product_list:this.state.product_list
          })
        
        this.hacerListaCompra()
     }
    
      
    return(
      this.state.productSelected,
      this.state.placeholder,
      this.state.product_list
     
    )  
    }),
        
      event.target.value=""
     
  )
}
  
   }
      
        
    
    
    
  



  hacerListaCompra(){
   
    

  if(this.state.productSelected.length>0){
 
    this.state.product_list.unshift([
      <div key={this.state.productSelected[0].id}>
      {this.state.productSelected[0].productName}
      <input type='number'id={this.state.productSelected[0].id} min='1' placeholder={this.state.placeholderCantidad} value={1} onChange={this.handleSelectCantidad} name={this.state.productSelected[0].productName}></input>
      
      <button id={this.state.productSelected[0].id} onClick={this.handleDelete} className="btn">
      </button>
      </div>,this.state.productSelected[0].price,this.state.productSelected[0].supermarket
    ])

    this.setState({
      product_list:this.state.product_list
    })  
 
  }
 
  if(this.state.product_list.length>0){ 
  
    this.setState({
      
      botonComprar:
      <Link to="../hacer_compra" onClick={this.handleComprar}>Comprar</Link>,
      inputNotes: 
      <div className="notas">
    NOTAS:
      <input key='notas' type='text'name="notas" placeholder='Escriba sus anotaciones aquí' 
    onClick={this.handleNotes} onKeyUp={this.teclaEnter} ></input>
    
      </div>
    })
  }  
  }
   
  handleSelectCantidad(event){

    this.state.productsToBuy.unshift(

    <div key={event.target.name}>
    {event.target.name}
    <input type='number'id={event.target.name} min='1' onChange={this.handleSelectCantidad} value={event.target.value}placeholder={event.target.value}name={event.target.name}></input>
    <button id={event.target.name} onClick={this.handleDelete} className="btn"></button>
    </div>  
    
    )

    this.setState({
      productsToBuy:this.state.productsToBuy
    
    })

    this.state.productsToBuy.map(i=>{
        
        if(this.state.productsToBuy[0].key===i.key&&this.state.productsToBuy.length>=1){
          
          const indx=this.state.productsToBuy.indexOf(i)
          if(indx>0)
            this.state.productsToBuy.splice(indx,1)
            this.setState({
              productsToBuy:this.state.productsToBuy
      
            })
    }
    
  return(
    this.state.productsToBuy
  )})

    this.state.productsToBuy.map(productoModificado=>{
     
      this.state.product_list.map(i=>{
        if(productoModificado.key===i[0].props.children[0]){
          
const indx=this.state.product_list.indexOf(i)
const productoAModificar= this.state.product_list[indx]
productoAModificar[0]=productoModificado

return(

  this.setState({
    product_list:this.state.product_list
   
})


)
        }
       

    return(
      this.state.product_list
      
    )
    
  })
  return(
    this.state.product_list
  )
  
})
   
  } 
  
  handleDelete(event){

  this.state.product_list.map(i=>{

   if(i!==undefined&&event.target.id===i[0].key){
    const idx=this.state.product_list.indexOf(i)
    this.state.product_list.splice(idx,1)
   
      this.setState({
        product_list:this.state.product_list
      })

    this.state.productSelected.map(i=>{
  
      if((i!==undefined&&event.target.id===i.id.toString())||(i!==undefined&&event.target.id===i.productName)){
        const idx=this.state.productSelected.indexOf(i)
        this.state.productSelected.splice(idx,1)

      this.setState({
      
        productSelected:this.state.productSelected
      })


  }
  return(
    this.state.productSelected
  )

})}
  return(
    this.state.product_list,
this.state.productSelected
  )


})}  

  handleComprar(){
if(this.state.productSelected.length>0){
  this.state.product_list.map(i=>{
return(
  axios
  .post("https://eficompra-back-redis.onrender.com/hacerCompra",{
    idHacerCompra:i[0].key,
    name:i[0].props.children[0],
    cantidad:parseInt(i[0].props.children[1].props.placeholder),
    price:i[1],
    supermarket:i[2]
    
})
)
   

})}


 }
 handleNotes(e){
  if(e.target.value!==""){
    this.state.notes.unshift(e.target.value)
    this.setState({
      notes: this.state.notes
    })
    return(
      this.state.notes,
      
    
    e.target.value="" 
    )
  }
    
   }
  componentDidMount(){
      
    this.getProductsList()
   
  }

  componentDidUpdate(){
   
      this.getOptions()

    if(this.state.isLoading===true){
      this.setState({
        isLoading:false
      })
    }
      
      
  }


 
  render(){
  this.getOptions()
 
  window.onbeforeunload = function(e) {
    return "You have some unsaved changes";
};
   return(
  
      <div className="content-wrapper">
        <div className="title-wrapper">
        {this.state.pageTitle}
        </div>
        <div className="buscador-wrapper">
    <input key='buscadorProductos' type='text'name="buscadorProductos" list="Products" placeholder={this.state.placeholderBuscador } 
    onClick={this.handleOnClick} onKeyUp={this.teclaEnter}>
    </input>
   
    <datalist key='Products'id="Products" className="dataList">
      {this.state.options.map(i=>{
        return (
        <div className="option" key={this.state.options.indexOf(i)}>

         { i}
        </div>
        )})}
    </datalist>

    </div>

    {this.state.isLoading&this.state.data.length===0?(
      <div className="loader">
     <FontAwesomeIcon icon="fa-solid fa-spinner" spin />
    </div>
    ):null}
    
    <div className="listaCompra"
    style={{backgroundImage:`url(${fondo})`}}>
<div className="productsList">
    {this.state.product_list.map(i=>{

    return (
    
    <div key={this.state.product_list.indexOf(i)} className="products">
    <div className="parteIzquierda">
    <div className="productName">
    {i[0].props.children[0]}
    </div>
    </div>

    <div className="parteDerecha">
    <div className="cantidad">
    {i[0].props.children[1]}
    </div>

    <div className="borrar">
    <div className="btn">
    {i[0].props.children[2]}
    <div className="icon">
    <FontAwesomeIcon icon="trash" />
    </div>
    </div>
    </div>
    </div>
    </div>
  )})}
   {this.state.inputNotes}
{this.state.notes.length>0?(
  <div className="anotaciones">
  {this.state.notes.map(i=>{
    return(
    
      <div className="nota">
        {i}
        </div>
      
    )
  })}
  </div>
):null
}


  <div className="comprar">

  {this.state.botonComprar}
  </div>
  </div>
  </div>

  </div>
)}


}


