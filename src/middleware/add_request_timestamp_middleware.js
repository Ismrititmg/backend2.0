//attached time stamp to the request fot those routes that used this middleware

export let addRequestTimeStampMiddleware = (req, res, next)=>{
    req.requestTimeStamp = new Date().toISOString()
    console.log("request timestamp:", req.requestTimeStamp)
    next()
}


//midddleware for the response : error formatting
export let customErrorMiddleware = (err, req, res, next)=>{
    res.status(500).json({
        message: "something went wrong",
        error:err.message

    })
    next()
}
//custom success response with middleware
export let customSuccessMiddleware = (dataObj,
    req, res, next)=>{
        res.status(200).json({
            message: dataObj.msg,
            data: dataObj.data,
            trace: dataObj.trace
        })
    }