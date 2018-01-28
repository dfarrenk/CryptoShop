import React, {Component} from "react";
import axios from 'axios';

class realtime extends Component{
  constructor(props){
    super(props);

    this.state = {
      exchangeRateBTC : 0
    };
  }

  updateRate = ()=>{
    let that = this;
    setInterval(function(){ 
     axios.get("https://api.coinmarketcap.com/v1/ticker/?limit=4")
     .then(data =>{
      console.log(data)
      that.setState({ exchangeRateBTC:data.data["0"].price_usd  });
    })
   }, that.props.timeout);
  }


  render(){
    return (
      <div>Current BTC rate:{this.updateRate()} {this.state.exchangeRateBTC}</div>
      )
  }
}
export default realtime;
