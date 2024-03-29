# Img-repo
img-repo is an image repository that allows users to upload multiple images from their machine and have them auto-tagged using Google cloud's vision API.

## Getting started
Requirements:
* [node.js](https://nodejs.org/en/)
* [react.js](https://reactjs.org/)
* optional: [MySQL Workbench](https://www.mysql.com/products/workbench/)

## Running the app
1. create .env file in the `backend` folder with the correct database credentials
2. open a shell session and start the server:
`cd backend && node app.js`
3. start the client in another shell session:
`cd frontend && npm start`
4. to run locally, navigate to `localhost:3000`

## App overview
![alt text](https://raw.githubusercontent.com/patlai/img-repo/master/archdiagram.png?token=ADSBLAKWVSMQY3LPFCLJV6S5G7FMY)

## Known Issues
* sometimes multer will assign the same name to 2 files that are being uploaded in the same batch. As a temporary fix, one of them will be stored on the server's filesystem but not in the database, so the user will only see one of those 2 files after uploading that batch
