# Headless Commerce React
Headless Commerce React is designed to showcase the capabilities of the Salesforce Commerce API and these API's could be utilized to build a headless shopping experience. 
In order to fully demenstrate the capabilities, the app is running all API's as a community user. This ensures that all API calls are made in the context of a user / account, which enables add to cart and getting cart information. 
With that said, you will need to make sure you have a fully setup B2B Commerce (Aura or LWR) instance setup in order for this app to function correctly.

# Usage
_:warning: The source code for this repository is provided for reference and educational purposes only. Please consider carefully before utilizing any of the code for production implementations._

## Organization
This package is made up of two primary sections, the Node Server & React engine. 
Node
* **[routes](routes/)**: This folder holds all of the available routes that are needed to load the product detail page

React
* **[commerce_cart](client/src/comonents)**: Main listing of components that are used to render the product detail page
* **[commerce_cart](client/src/landmarks)**: Header rendering component
* **[commerce_cart](client/src/services)**: React functions that are used to fetch and post information from the frontend to the node routes

## Features
* Load product detail page based on product id in parameter
* Load the mini cart with items based on what's actually in your cart
* Add an item to the cart based on the button click


## Known Items
* Effective Account is currently just a parameter that can be passed through a query parameter, this in a real life situation should be gather by the login event of the user
* Only the product detail page has been built out, so there is no home page, cart, or checkout page available 
