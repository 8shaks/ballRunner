module.exports = {
  siteMetadata: {
    title: `Ball Runner`,
    description: `Find a court for you to play basketball in Canada!`,
    author: `@shakattack`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#48CF4D`,
        theme_color: `#48CF4D`,
        display: `minimal-ui`
        // icon: ``, // This path is relative to the root of the site.
      },
    },
 
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
    proxy: {
      prefix: "/api",
      url: "http://localhost:5000",
    }
}
