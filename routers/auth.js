const express = require('express');
const qs = require('qs');
const jwt = require('jsonwebtoken');
const user = require('../modules/user');
const fetchuser = require('../Middleware/fetchuser');
// const fetch = require('node-fetch');
const router = express.Router();

router.get('/google',async (req, res, next)=>{
   const code = req.query.code;

   const url = `https://oauth2.googleapis.com/token`;

	const values = {
		code,
		client_id: process.env.CLIENT_ID,
		client_secret: process.env.CLIENT_SECRET,
		redirect_uri: process.env.REDIRECT_URI,
		grant_type: "authorization_code",
	};

   try{
      const response = await fetch(`${url}?${qs.stringify(values)}`,{
         method: "post",
			headers: {
				"Content-Type": "application/x-www-form-urlencoding",
			},
      });
      const data = await response.json();
      // console.log("data" , data);
      const {id_token, access_token} = data;


      // -------------------get google user---------------
		//1) in id token you will have all the details of google user just decode it
		// const googleUser = jwt.decode(id_token)
      const googleUserData = jwt.decode(id_token);

		//2) or you can send these ids to client(website) and from there m a http request and then get all google user details

		// const googleUserData = await fetch(
		// 	`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
		// 	{
		// 		headers: {
		// 			Authorization: `Bearer ${id_token}`,
		// 		},
		// 	}
		// );

      let User = await user.findOne({email: googleUserData.email});
      if(!User){
         User = await user.create({
            "name": googleUserData.name,
            "email": googleUserData.email,
            "role": "user",
            "authToken": id_token
         })
      }else{
         const filter = { _id: User.id };
         await user.updateOne(filter,{
            $set: {
               "authToken": id_token
             },
         })
      }

      res
			.status(200)
			.redirect(
				`http://localhost:3000?jsonData=${encodeURIComponent(
					JSON.stringify(User)
				)}&role=${User.role}&authToken=${id_token}`
			);

   }catch(e){
      console.log(e);
   }
})

router.get('/getuser', fetchuser, async (req, res) => {
   try {
      const user = req.User;
      res.status(302).send(user);
   } catch (errors) {
      res.status(500).send({errors:"internal server error"});
   }
})

router.get('/getuser/:id', async (req, res) => {
   try {
      const id = req.params.id;
      let users = await user.findById(id)
      if(!users){
         throw error({ message: "User not Found !!", code: 404 });
      }
      const data = jwt.decode(users.authToken);
      users['authToken']='';
      let User = {...users._doc, picture: data.picture};

      res.status(302).send(User);
   } catch (errors) {
      res.status(500).send({errors:"internal server error"});
   }
})

module.exports = router;