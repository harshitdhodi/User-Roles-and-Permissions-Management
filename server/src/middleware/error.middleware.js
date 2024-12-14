exports.errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  if (err.code === 'P2002') {
    return res.status(400).json({
      message: 'A unique constraint violation occurred'
    });
  }
  
  res.status(500).json({
    message: 'Something went wrong on the server'
  });
};