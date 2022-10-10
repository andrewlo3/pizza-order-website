# README

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Getting Things Running

- Run `npm run prep` to install dependencies
- Run `npm run start` to launch the website on localhost:3000

## Notes about the project

- The API does not seem to have localhost:3000 listed as an Allowed Origin within its CORS policy. You will have to temporarily disable CORS in the browser you run this in in order for the API calls to work.
- When you login with the correct API credentials, the auth token will be stored in local storage. This auth token appears to last 15 minutes. Each API call pulls the token from local storage and checks to make sure it is still active. If it is not, you will get an error message in the browser console and will need to refresh your page to go back and login again. Normally refreshing the page should not force you to login again, but this is a demo and it makes it easy to re-auth.
- When I designed the 'New Order' page, I didn't realize the API only allowed a single POST per combination of Flavor, Crust, Size, and Table. This is the reason I have a 'Quantity' field. I went ahead and left it in because I think it's a cool feature if the API supported it, but I coded it to always be set to 1. It's not broken.
