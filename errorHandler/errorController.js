const errorController = (err, req,res,next)=>{
   res.status(err.statusCode).json({
		status: err.status,
		payload: err.payload,
      status:err.status
	});
}

module.exports =  errorController;