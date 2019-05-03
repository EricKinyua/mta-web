import React, { useState } from 'react'
import { CartTotals } from '../context'
import URLS from '../../config/settings'
import ApiGet, { ApiPost } from '../../config/axios'

const getAmount = () => {
  const context = JSON.parse(localStorage.getItem("Cart"))
  var cart = [...context]
  var totals = {
    subtotal: 0
  }
  if (cart.length > 0) {
    context.forEach(item => {
      totals.subtotal += item.price * item.quantity
    })
  }
  return Math.round(totals.subtotal + (.16 * totals.subtotal))
}

const makePayload = (payNumber, payMethod) => {

  var payload = {
    phone_number: payNumber,
    amount: getAmount(),
    payment_mode: payMethod,
    currency_code: 'KES'
  }
  return payload
}

const Payment = () => {
  var code = "+254"

  const [payMethod, setPayMethod] = useState(0)
  const [payNumber, setPayNumber] = useState(code)

  const getStatus = (kyc) => {
    ApiGet(`${URLS().PAYMENTS}?kyc=${kyc}`)
      .then(res => {
        var payStatus = {
          "status": res.data[0].status,
          "kyc": kyc
        }
        sessionStorage.setItem("payStatus", JSON.stringify(payStatus))
        console.log(payStatus)
      })
  }

  const handlePayMethod = method => {
    if (method === 'MPESA') {
      setPayMethod(1)
      const div = document.getElementById('mpesaDiv')
      div.classList.remove("radio-unchecked-div")
      div.classList.add("radio-checked-div")
      const div_ = document.getElementById('podDiv')
      div_.classList.remove("radio-checked-div")
      div_.classList.add("radio-unchecked-div")
    } else {
      setPayMethod(2)
      const div_ = document.getElementById('podDiv')
      div_.classList.remove("radio-unchecked-div")
      div_.classList.add("radio-checked-div")
      const div = document.getElementById('mpesaDiv')
      div.classList.remove("radio-checked-div")
      div.classList.add("radio-unchecked-div")
    }
    document.getElementById('payBtn').disabled = ''
    // setPayMethod(method)
  }

  const handlePayNumber = (e) => setPayNumber(e.target.value)

  const handlePayOrder = (e) => {
    e.preventDefault()
    e.stopPropagation()

    document.getElementById('mpesaDiv').style.pointerEvents = 'none'
    document.getElementById('podDiv').style.pointerEvents = 'none'
    document.getElementById('payBtn').disabled = 'disabled'
    document.getElementById('payNumberInput').disabled = 'disabled'
    document.getElementById('payBtn').innerText = 'Sending Payment Request'

    var payload = makePayload(payNumber, payMethod)

    ApiPost(`${URLS().PAYMENTS}`, payload)
      .then(res => {
        var data = res.data

        var payStatus = {
          "status": data.status,
          "kyc": data.kyc
        }

        sessionStorage.setItem("payStatus", JSON.stringify(payStatus))
        document.getElementById('payBtn').innerText = 'Confirming Payment...'

        var checkPayStatus = setInterval(() => {

          payStatus = JSON.parse(sessionStorage.getItem("payStatus"))

          if (payStatus.status === "success") {
            clearInterval(checkPayStatus)
            document.getElementById('payBtn').innerText = 'Payment Confirmed!'
          } else if (payStatus.status === "PendingConfirmation") {
            getStatus(data.kyc)
            setTimeout(() => {
              clearInterval(checkPayStatus)
              document.getElementById('payBtn').innerText = 'Payment Failed!'
            }, 60000)
          } else {
            clearInterval(checkPayStatus)
            document.getElementById('payBtn').innerText = 'Payment Failed!'
            setTimeout(() => {
              document.getElementById('payBtn').innerText = 'Make Payment'
              document.getElementById('payBtn').disabled = ''
              document.getElementById('payNumberInput').disabled = ''
              document.getElementById('mpesaDiv').style.pointerEvents = ''
              document.getElementById('podDiv').style.pointerEvents = ''
            }, 3000)
            console.log(payload)
          }
        }, 5000)

      })
      .catch(error => {
        document.getElementById('payBtn').innerText = 'Payment Failed, Try again.'
        setTimeout(() => {
          document.getElementById('payBtn').innerText = 'Make Payment'
          document.getElementById('payBtn').disabled = ''
          document.getElementById('payNumberInput').disabled = ''
          document.getElementById('mpesaDiv').style.pointerEvents = ''
          document.getElementById('podDiv').style.pointerEvents = ''
        }, 3000)
        console.log(error, payload)
      })
  }

  return (
    <div className="checkout-form">
      <h1 className="playfair-lg align-center">Confirm Payment</h1>
      <p className="lato-m i align-center mg-v-20">Pick your preffered method of payment</p>

      <form className="form" onSubmit={handlePayOrder}>

        <div className="mg-v-20" onClick={() => handlePayMethod('MPESA')} id="mpesaDiv">
          <h2 className="lato-m b radio radio-unchecked mg-v-10">Mpesa</h2>
          <p className="lato-m">Pay Ksh {CartTotals().total} via Mpesa paybill. Enter the phone number to make the payment.</p>

          <div className="input1">
            <label>Phone Number:</label>
            <input type="text" placeholder="Enter the phone number you'll use to pay" id="payNumberInput" value={payNumber} onChange={handlePayNumber} />
          </div>
        </div>

        <div className="" onClick={() => handlePayMethod('PAY_ON_DELIVERY')} id="podDiv">
          <h2 className="lato-m b radio radio-unchecked mg-v-10">Pay on Delivery</h2>
          <p className="lato-m">Pay Ksh {CartTotals().total} upon delivery.</p>
        </div>

        <button className="btn btn-full mg-v-50" disabled="disabled" id="payBtn">Make Payment</button>

      </form>
    </div>
  )
}

export default Payment