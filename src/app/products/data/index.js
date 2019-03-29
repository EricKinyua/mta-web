import React, { useState, useEffect } from 'react'
import axios from 'axios'

const CategoriesContext = React.createContext({})

export const CatProvider = CategoriesContext.Provider
export const CatConsumer = CategoriesContext.Consumer


const Counts = () => {
  const [categories, setCategories] = useState([])

  const Fetchdata = async () => {
    const response = await axios.get(
      'http://localhost:8000/categories/'
    )
    setCategories(response.data)
  }

  useEffect(() => {
    Fetchdata()
  }, [])

  return (
    <>
      <CatProvider categories={categories}>
        <CatConsumer>
          {categories}
        </CatConsumer>
      </CatProvider>
    </>

  )
}

export default Counts