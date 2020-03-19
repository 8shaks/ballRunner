
import Result from './result'
import resultsStyles from './results.module.css'
import React, { Component } from 'react'



export default class ResultsFeed extends Component {
    constructor(){
        super()
        this.state={
            btnLabel:'Show More',
            resultsLength:5
        }
    }
    onClick= () => {
        if(this.state.resultsLength !== 5){
            this.setState({btnLabel:'Show More' ,resultsLength:5})    
        }else{
            this.setState({btnLabel:'Show Less' ,resultsLength:this.props.locations.length})
        }
    }
    render() {
        let limitResults = []
        for(let i =0; i<this.state.resultsLength;i++){
            limitResults.push(this.props.locations[i])
        }
        return (<div className={resultsStyles.results}>{limitResults.map((location) => <Result loc={location}/>)} <button onClick={this.onClick} className={resultsStyles.show}>{this.state.btnLabel}</button></div>)
    }
}
