import React, { Component } from "react";
import axios from "axios";
import fondo from "../hoja-arrugada.jpg";
import postIt from "../post-it.jpg";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTrash, faSpinner,faShareNodes } from "@fortawesome/free-solid-svg-icons";

library.add(faTrash, faSpinner, faShareNodes);

export default class HacerCompra extends Component {
  
  constructor(props){
    super()
    this.state={
      data:[],
      productsBySupermarket:[],
      supermarketsSelected:[],
      isLoading:true,
      productsBySupermarketOrdened:[],
      total: []
    }

    this.getProductsToBuy=this.getProductsToBuy.bind(this)
    this.handleSelectCantidad=this.handleSelectCantidad.bind(this)
    this.handleDelete=this.handleDelete.bind(this)
    this.handleNewList=this.handleNewList.bind(this)
    this.selectSupermarket=this.selectSupermarket.bind(this)
    this.productsBySupermarket=this.productsBySupermarket.bind(this)
    this.keysByCompraBySupermarkets=this.keysByCompraBySupermarkets.bind(this)
    this.getTotalProduct=this.getTotalProduct.bind(this)
    this.handleCompartir=this.handleCompartir.bind(this)

  }

  getProductsToBuy(){
 
    axios
    .get("https://eficompra-back.onrender.com/hacerCompra")
    .then((response) => {
      this.setState({
        data:response.data,
        isLoading:false
       
      }
    )
  })
  }
  selectSupermarket(){
  
    this.state.data.map(i=>{
     
      if(this.state.supermarketsSelected.length===0){
        return(
        this.state.supermarketsSelected.unshift(i.supermarket))
      }else if(this.state.supermarketsSelected.includes(i.supermarket)===false){
        return(
          this.state.supermarketsSelected.unshift(i.supermarket)
        )
        
      }
      return(this.state.supermarketsSelected)
    })
  
    return(this.state.supermarketsSelected)
  
  }

  productsBySupermarket(){
    
    this.state.supermarketsSelected.map(sm=>{
   
      this.state.productsBySupermarket.unshift(this.state.data.filter(i=>i.supermarket===sm))
    
      return(
        this.state.productsBySupermarket
      )
 
    })
  }

  keysByCompraBySupermarkets(){
 
    this.state.productsBySupermarket.map(i=>{
  
      const iOrdened=Object.groupBy(i, ({ supermarket }) => supermarket)
  return(
      this.state.productsBySupermarketOrdened.unshift(iOrdened)
    )})
    
    return(this.state.productsBySupermarketOrdened)
  }
  
  
  getTotalProduct(){
 
    this.state.data.map(i=>{
      return(
      i.total=i.cantidad*i.price
    )})

    this.state.productsBySupermarketOrdened.map(i=>{
    return(
      Object.values(i).map(products=>{
       return(
        products.map(product=>{
          return(
            product.total=product.cantidad*product.price
          )
         
        })
       )
        
      })
    )
    })
  
    this.state.total.unshift(`${this.state.data.reduce((a,b)=>a+b.total,0).toFixed(2) } €`)

    return(
      this.state.data,
      this.state.productsBySupermarketOrdened,
      this.state.total
     
    )
  }

  handleNewList(event){

    this.state.data.map(i=>{
     
    return(
        axios
       
     
              .post("https://eficompra-back.onrender.com/hacerCompra",{
                idHacerCompra:i.idHacerCompra,
                name:i.name,
                cantidad:parseInt(i.cantidad),
                price:i.price,
                supermarket:i.supermarket
            })
     
    )
          })
      
        event.preventDefault();
      
        window.onbeforeunload = null
      
        window.location.href="/mi_lista_compra"

        
      }
      
     
      
  
  handleSelectCantidad(event){
  

  this.state.data.map(i=>{

    if(event.target.name===i.name){
  
      i.cantidad=parseInt(event.target.value)
    }
    return(i.cantidad)
  })
  
this.state.productsBySupermarket.map(i=>{
i.map(product=>{
  if(event.target.name===product.name){
product.cantidad=parseInt(event.target.value)
  }
return(product.cantidad)
})
return(i)
})
return(

  this.setState({
  data:this.state.data,
  productsBySupermarket:this.state.productsBySupermarket
  })
)
  }


  

  handleDelete(event){
 
  
    this.state.data.map(i=>{

      if(event.target.id===i.idHacerCompra){

        this.state.data.splice(this.state.data.indexOf(i),1)
    
      }else if(event.target.id===i.name){
        this.state.data.splice(this.state.data.indexOf(i),1)
        
      }
   
    return(this.state.data)
    })
  
   
    Object.values(this.state.productsBySupermarketOrdened).map(i=>{
     
      Object.values(i).map(sm=>{
       
      
        sm.map(productLine=>{
         
          if(event.target.id===productLine.idHacerCompra){
            sm.splice(sm.indexOf(productLine),1)
           
          }else if(event.target.id===productLine.name){
            sm.splice(sm.indexOf(productLine),1)

          }
          return(sm)
        }
        
      )
      
      return(Object.values(this.state.productsBySupermarketOrdened))
    
      })
      
     if(Object.values(i)[0].length===0){

      this.state.productsBySupermarketOrdened.splice(this.state.productsBySupermarketOrdened.indexOf(i),1)
     }
    return(this.state.productsBySupermarketOrdened)
    })
   
      return(

        this.setState({
        data:this.state.data,
        productsBySupermarketOrdened:this.state.productsBySupermarketOrdened
        })
      )

  }

  handleCompartir(event){
   
    localStorage.setItem("dataCopy",JSON.stringify(this.state.data))
    localStorage.setItem("totalCopy",JSON.stringify(this.state.total))
    localStorage.setItem("productsBySupermarketOrdenedCopy",JSON.stringify(this.state.productsBySupermarketOrdened))
    
     
        return(
          navigator.share({
            title: "Eficompra",
            text: "Lista de la compra",
            url:"https://eficompra.netlify.app/hacer_compra_copytoshare"
          })
        )
        
        
      }
 componentDidMount(){
  this.getProductsToBuy()

  
      
 }
 
   componentDidUpdate(){
    if(this.state.data.length===0&&this.state.isLoading===false){
      this.setState({
        isLoading:true
      })
    }
    if(this.state.data.length>0){
    this.selectSupermarket()
   
   
   }
  
   if(this.state.supermarketsSelected.length>0){
    this.productsBySupermarket()
    
  
   }
   if(this.state.productsBySupermarket.length>0&&this.state.productsBySupermarketOrdened.length===0){
    
    this.keysByCompraBySupermarkets()
   
   
   }
    if(this.state.data.length>0&&this.state.productsBySupermarketOrdened.length>0){
    this.getTotalProduct()
  
   }
   
}
 

  render(){
    
    if(this.state.data.length===0&&this.state.supermarketsSelected.length===0){
      this.getProductsToBuy()
     
    }
   if(this.state.productsBySupermarketOrdened.length>0){
    this.getTotalProduct()
   } 

   if(this.state.data.length>0&&this.state.productsBySupermarketOrdened.length>0){
    
    this.state.data.map(i=>{
      return(
        axios
 
        .delete("https://eficompra-back-redis.onrender.com/hacerCompra")
       

      )
      
    })
   
   }
    
    return(
 
    <div className="content" style={{backgroundImage:`url(${fondo})`}}>

      <div className="title">
    
        <h1>Comprar</h1>
      </div>

      {this.state.isLoading?(
      
        <div className="loader">
          <FontAwesomeIcon icon="spinner" spin/>
        </div>
      ):null}
     
      
     <div className="listaCompraHacerCompra">
    
    {this.state.data.map(i=>{
      
     
       if(this.state.data.length>0&&this.state.productsBySupermarketOrdened.length>0){
          return(
  
            <div key={i.idHacerCompra} className="productsHacerCompra">
  
              <div className="parteIzquierdaHacerCompra">
                {i.name} 
              </div>
  
              <div className="parteDerechaHacerCompra">
                
                <div className="cantidadPrecioProducto">
  
                  <input 
                  type='number'
                  id={i.idHacerCompra} 
                  min='1' 
                  placeholder={i.cantidad}
                  value={i.cantidad}
                  onChange={this.handleSelectCantidad} 
              
                  name={i.name}
                  className="numberHacerCompra">
                  </input>
     
               _ {i.total.toFixed(2)}€ _ 
                </div>
                <div className="supermarket-borrar">
                <div className="supermarket">
        
                  {i.supermarket}
                </div>
  
                <div className="borrarHacerCompra">
                  <div className="btn">
                    <button id={i.idHacerCompra} onClick={this.handleDelete}className="btn"></button>
                    <div className="iconHacerCompra">
                      <FontAwesomeIcon icon="trash" />
                    </div>
                  </div>
                </div>
                </div>
              </div>
            </div>
          
        )
        }
      
      
      
     
     return('')
      })
    
    }

    </div>
    <div className="parteBaja">

      <div className="total">
        <div className="total-title">
          <h2>Total:  </h2>
        </div>

        <div className="total-cantidad">
       
  
      {this.state.total[0]}


       
          
          
        </div>
      </div>

      <div className="añadir-productos">

        <a href="/mi_lista_compra" onClick={this.handleNewList}>Añadir productos</a>
    
       
     
      </div>
      
      <div className="compartir">
        <button id="compartir" onClick={ this.handleCompartir}></button>
        <div className="iconCompartir">
        <FontAwesomeIcon icon="fa-solid fa-share-nodes" />
          </div>
         
       
      </div>
    </div>
    <div className="compra-by-supermarket-wrapper">
      
     
{this.state.productsBySupermarketOrdened.map(i=>{

 if(this.state.isLoading===false){

  if(Object.values(i)[0].length>0){
  
    return(
      <div className="compra-by-supermarket"style={{backgroundImage:`url(${postIt})`}}>
        <div key={Object.keys(1)} className="products-by-supermarket-title">
        {console.log(Object.keys, Object.keys(i),Object.keys(1))}
        <div className="selected-title">
        <h3> Su compra en:</h3>
        </div> 
      <div className="supermarketBySupermarket">
          <h3 style={{marginBottom:25}}>{Object.keys(i)} </h3>
          </div>
        </div>
    
        <div className="listaCompraBySupermarket">
        
       
        {Object.values(i)[0].map(product=>{
         
            
            return(
              <div key={product.idHacerCompra} className="productsBySupermarket">
              <div className="parteIzquierdaBySupermarket">
              
              {product.name}
                  </div>
                  
                      <div className="parteDerechaBySupermarket">
                      
                      <input type='number'id={product.id} min='1' placeholder={product.cantidad}onChange={this.handleSelectCantidad} value={product.cantidad}name={product.name}
                     
                    ></input>
                    _ {product.total.toFixed(2)}€ 
                    <div className="borrar">
             
                        <div className="btn">
                          <button id={product.name} onClick={this.handleDelete} className="btn"></button>
                          <div className="iconBySupermarket">
                            <FontAwesomeIcon icon="trash" />
                          </div>
                          
                          
                        </div>
                      </div>
                    </div>
                   
               </div>
             
            )
          })
          
         
    }
    
    
    <div className="total-by-supermarket">
            
         <h4>Total:  <i className="cantidadTotal" > 
         {Object.values(i)[0].reduce((a,b)=>a+b.total,0).toFixed(2)}  €</i> </h4>
       </div>
      </div>
    
      </div>
    )
  }
}
  
  return(i)
  
   
    
    })}
     
 
</div>
</div>)}}
  

