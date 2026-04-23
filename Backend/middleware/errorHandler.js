const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        message: "Internal Server Error", 
        error: err.message ,
        stack: err.stack,
        status:err.status,
        success:false}
    );
};

export default errorHandler;