
import resultsStyles from './results.module.css'
import React from 'react'
import { Link } from "gatsby"
export default function Result(location) {
    const {loc} = location
    if(loc.website){
        return (
            <div className={resultsStyles.result_loc}>
                <div>{loc.name}<br/><a href={loc.website}>Schedule</a><br/>{loc.vicinity}<br/>{loc.desc}</div><a target='_blank' rel="noopener noreferrer" href={`https://www.google.com/maps/place/?q=place_id:${loc.place_id}`}><button>Take Me there</button></a>
            </div>
        )
    }else{
        return (
            <div className={resultsStyles.result_loc}>
                <div>{loc.name}<br/>{loc.vicinity}</div><a target='_blank' rel="noopener noreferrer" href={`https://www.google.com/maps/place/?q=place_id:${loc.place_id}`}><button>Take Me there</button></a>
            </div>
        )
    }
  
}
