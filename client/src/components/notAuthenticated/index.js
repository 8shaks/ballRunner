import React, { Component } from 'react'
import noAuthStyles from './notAuth.module.css'

class NotAuth extends Component {
   constructor(props){
       super(props)
       this.state={}
   }
    render() {

        return (
            <div className={this.state.notAuth_page}> 
                You must be logged in to view this page!<br/>
                Please sign in or login in the navbar above to view this page.
            </div>
        )
    }
}

  export default NotAuth
  