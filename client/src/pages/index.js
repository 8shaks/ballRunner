
import { Link } from "gatsby"
import axios from 'axios'
import Layout from "../components/layout"
import SEO from "../components/seo"
import indexStyles from '../styles/index.module.css'
import React from 'react'

export default function index() {
  return (
    <Layout>
        <div className={indexStyles.homeCont}>
          <div className={indexStyles.header}>
            <h1 >Welcome to Ball Runner</h1>
            {/* <h3> What can you do here? What's the point of this site?</h3> */}
            <p> The goal of BallRunner is to make it easier for people to play basketball. We what two key features each of which play a key role in promoting local basketball.</p>
          </div>
          <div className={indexStyles.flexCont}>
            <div className={"container " + indexStyles.descCont}>
              <h2><Link to="/matchmaking">Matchmaking</Link></h2>
              <p>Matchmaking allows users to find other players to play basketball with. 
               We ensure the person is within your skill range to make it fun and competetive.
               This feature is still in beta and we are continually adding features. <Link to="/matchmaking">Take me there</Link>
              </p>
            </div>
            <div className={"container " + indexStyles.descCont}>
              <h2><Link to="/find-courts">Find a court</Link></h2>
              <p>
                Pretty self explanatory. All you have to do put in your address and we'll give you the nearest courts to you. Note we are
                curently only offering this feature in Ontario, we'll be expanding to more locations soon. <Link to='/find-courts'>Take me there</Link>
                <br/><br/><b>*NOTE Due to covid a lot of the courts are closed, results may be skewed at the moment*</b>
              </p>
            </div>
          </div>
          <div className={indexStyles.features}>
            <h2>Features we're currently adding</h2>
            <ul>
              <li>
                <h3>Find groups of people to play with</h3>
                <p>Currently there is no option to control the amount of people you want to play with when using our matchmaking feature. For example let's say you had a group of two people and wanted to find another two people to play against.
                  We want you to be able to choose how many people you want to be in the group you're playing with, no more no less. This allows you to customize your court experiance even more and allows more people to play in a game.
                </p>
              </li>
              <li>
                <h3>Control what time you play</h3>
                <p>Let's say you want to find a match beforehard with our matchmaking tool. We want to add a feature that allows you to select a time you want to play, this way you don't have to only search for a match when you're ready to play.
                  You can choose a select time and your match will also be someone avaible to play in that time frame. With this feautre we aim to reduce the amount of people who cancel there games and also allow more people to queue up beforehand.
                </p>
              </li>
              <li>
                <h3>Find people to play with that are closer to you</h3>
                <p>As traffic on the site increases, we want people to be able to find closer games to them. We're planning on weighing a user's location in the algorithim when finding a match for them. This way you can find games closer to you, 
                  easing the stress so all you have to worry about is having a good game!
                </p>
              </li>
            </ul>
          </div>
        </div>
    </Layout>
  )
}
