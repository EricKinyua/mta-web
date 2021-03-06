import React, { Component } from 'react'
import ImageSlider from './components/imageslider'
import ProductDetails from './components/productDetails'
import axios from 'axios'
import URLS from '../config/settings'
import Header from '../common/header/header'
import Loader from '../common/loader'
import Related from './components/relatedComponent'


class Product extends Component {

  state = {}

  componentDidMount() {
    var id = this.props.match.params.id
    this.getItem(id)
  }

  getItem = async id => {
    await axios.get(`${URLS().CATALOG + id}/`)
      .then(res => {
        this.setState({
          item: { ...res.data }
        })
      })
  }

  render() {
    return (
      <>
        <Header />
        <div id="top-bar"></div>
        <div className="middle-section">
          <div className="product-container">
            {
              this.state.item ? (
                <>
                  <ImageSlider item={this.state.item} />
                  <ProductDetails item={this.state.item} />

                  <Related id={this.props.match.params.id} category={this.state.item.category} />
                </>
              ) : (
                  <Loader/>
                )
            }
          </div>
        </div>
      </>
    )
  }
}

export default Product
