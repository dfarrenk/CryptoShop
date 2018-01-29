import React, {Component} from 'react'
import {render} from 'react-dom'
import Auth from '../../src'

class Demo extends Component {
  render() {
    return <Auth />
  }
}

render(<Demo/>, document.querySelector('#demo'))
