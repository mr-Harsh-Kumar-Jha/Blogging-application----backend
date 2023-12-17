const jwt = require('jsonwebtoken');
const user = require('../modules/user');

const fetchuser = async(req, res, next) => {
   // get the user from JWT token and add user to req object
   const token = req.header('auth-token');
   if (token === 'null' ) {
      return res.status(404).send({ error: "Please authenticate again" });
   }
   try {
      const data = jwt.decode(token);
      let User = await user.findOne({email: data.email});
      id = User.id
      if(User.authToken!==token){
         throw { message: "Unauthorized Access !! Please Login Again", code: 401 };
      }
      User = {...User, picture: data.picture, authorID: id};
      req.User = User;
      next();
   } catch (e) {
      res.status(e.code).send(e.message);
   }
}

module.exports = fetchuser;