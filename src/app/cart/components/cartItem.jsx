import React, { useContext } from 'react'
import format from '../../common/functions/formatter'
import { CartContext } from '../context'


const CartItem = ({ item }) => {

  const context = useContext(CartContext)
  var cart = [...context.cart]

  const updateItem = (method, id) => {
    var ids = []
    cart.forEach(item => {
      ids.push(item.id)
    })
    if (method === 'add') {
      cart[ids.indexOf(item.id)].quantity += 1
    } else if (method === 'sub') {
      if (cart[ids.indexOf(item.id)].quantity === 1) {
      } else {
        cart[ids.indexOf(item.id)].quantity -= 1
      }
    } else if (method === 'remove') {
      cart.splice([ids.indexOf(item.id)], 1)
    }
    context.setCart(cart)
    localStorage.setItem("Cart", JSON.stringify(cart))
  }

  const add = (id) => {
    updateItem('add', id)
  }

  const sub = (id) => {
    updateItem('sub', id)
  }

  const remove = (id) => {
    updateItem('remove', id)
  }

  return (
    <>
      <div className="item-container mg-v-20">
        <div className="item-desc flex">
          <div className="image-container img-wrap mg-h-10">
            <img src={item.images[0].path} alt="img" />
          </div>
          <div className="details-container mg-h-20">
            <p className="lato-lg">{item.name}</p>
            <span className="subQty" onClick={() => sub(item.id)}></span>
            <span className="lato-sm b"> {item.quantity}</span>
            <span className="addQty" onClick={() => add(item.id)}></span>
            &nbsp;&nbsp;
            <span className="delete" onClick={() => remove(item.id)}></span>
          </div>
        </div>
        <div className="price-container">
          <p className="playfair-lg gold">Ksh {format(item.price * item.quantity)}</p>
        </div>
      </div>
    </>
  )
}

export default CartItem