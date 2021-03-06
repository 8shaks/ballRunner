
import { Link } from "gatsby";
import axios from 'axios';
import Layout from "../../components/layout";
import SEO from "../../components/seo";
import React, { Component } from 'react';
import findCourtsStyles from './find-courts.module.css';
import ResultsFeed from '../../components/results/resultsFeed';
class IndexPage extends Component {
  constructor(){
    super()
    this.state={
      streetAddress:'',
      city:'',
      province:'',
      country:'Canada',
      results:[],
      errors:{
        city:false,
        province:false,
        streetAddress:false
      },
      apple:''
    }
  }
  isValid = () => {
    const {city, streetAddress, province} = this.state
    let cityNotValid = false
    let provinceNotValid = false;
    let streetAddressNotValid = false;
    if (city === ''){
      cityNotValid = true
    }
    if (streetAddress === ''){
      streetAddressNotValid = true
    }
    if (province === ''){
      provinceNotValid = true
    }
    if( streetAddress  !== '' && city !== '' && province !== ''){

      let errors = {
        city:cityNotValid,
        province:provinceNotValid,
        streetAddress:streetAddressNotValid
      }
      this.setState({errors:errors})
      return true
    }else{
      let errors = {
        city:cityNotValid,
        province:provinceNotValid,
        streetAddress:streetAddressNotValid
      }
      this.setState({errors:errors})
      return false
    }
  }
  onClick= () =>{
    if(this.isValid()){
      axios.post('/api/courts',{
        streetAddress:this.state.streetAddress,
        city:this.state.city,
        province:this.state.province,
        country:'Canada'
      }).then((data)=>{
        console.log(data)
        this.setState({results:data.data.locations})
        
      })
    }
  }
  onChange = (e) =>{
    console.log(e.target.value)
    this.setState({
      [e.target.name]:e.target.value
    })
  }
  onShare = (e) =>{
    if (navigator.share) {
      const url = document.querySelector('link[rel=canonical]') ? document.querySelector('link[rel=canonical]').href : document.location.href;
      navigator.share({
        title: 'BallRunner',
        url: url
      }).then(() => {
        console.log('Thanks for sharing!');
      })
      .catch(console.error);
    } else {  
      this.setState({apple:'sds'})
    }
  }

  render() {
    let results;
    if(this.state.results.length === 0){
      results = (<div className={findCourtsStyles.results}><h1 style={{margin:'1em 1em'}}>Fill out the form to find the nearest courts!</h1></div>)
    }else{
      results = <ResultsFeed locations={this.state.results}/>
    }

    return (
      <Layout>
        <SEO title="Home" description='Find a basketball court!'/>
        <div className={findCourtsStyles.home}>
          <div className={findCourtsStyles.topbar}/>
          <h1 className={findCourtsStyles.header}>Trying to find some courts?</h1>
          <h2 className={findCourtsStyles.sub_header}>We'll help you out</h2>
          <i style={{textAlign:'center'}}>Make an account and try out our matchmaking feature to find someone to play with!<br/><b>*NOTE Due to covid a lot of the courts are closed, results may be skewed at the moment*</b></i>
          <div className={findCourtsStyles.flex_container}> 
            <div className={findCourtsStyles.form}>
              <div className={findCourtsStyles.input_group}>
                <span>Street Address</span>< input onChange={this.onChange} value={this.state.streetAddress} name='streetAddress'/><br/>
                <span className={findCourtsStyles.error}>{this.state.errors.streetAddress ? 'You must put an address' : null}</span>
              </div>
              <div className={findCourtsStyles.input_group}>
                <span>City</span><input  onChange={this.onChange} value={this.state.city} name='city'/><br/>
                <span className={findCourtsStyles.error}>{this.state.errors.city ? 'You must put a city' : null}</span>
              </div>
              <div className={findCourtsStyles.input_group}>
                <span>Province</span>
                  <select value={this.state.province} onChange = {this.onChange} onBlur={this.onChange} name='province'>
                    <option value="Alberta">Alberta</option>
                    <option value="British Colombia">British Colombia</option>
                    <option value="Manitoba">Manitoba</option>
                    <option value="New Brunswick">New Brunswick</option>
                    <option value="Newfoundland and Labrador">Newfoundland and Labrador</option>
                    <option value="Northwest Territories">Northwest Territories</option>
                    <option value="Nova Scotia">Nova Scotia</option>
                    <option value="Nunavut">Nunavut</option>
                    <option value="Ontario">Ontario</option>
                    <option value="Prince Edward Island">Prince Edward Island</option>
                    <option value="Quebec">Quebec</option>
                    <option value="Saskatchewan">Saskatchewan</option>
                    <option value="Yukon">Yukon</option>
                  </select><br/>
                  <span className={findCourtsStyles.error}>{this.state.errors.province ? 'You must put a province' : null}</span>
              </div>
              <div className={findCourtsStyles.input_group}>
                <span>Country</span><input id={findCourtsStyles.input_country} value='Canada'disabled/><br/><i>Court search is only available in Canada at the moment</i>
              </div>
              <button onClick={this.onClick}>Find</button>
            </div>
            {results}
          </div>
          {/* <span onClick={this.onShare}>test 1</span> */}
          {this.state.apple}
        </div>
      </Layout>   
    )
  }
}

export default IndexPage
