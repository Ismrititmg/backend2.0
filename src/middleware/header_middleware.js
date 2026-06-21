export const checkXRoleHeaderMiddle = (req, res, next)=>{
    let headers = req.headers
    let xRole = headers["x-role"]
    console.log("header:", headers)
    if(!xRole){
        res.status(400).json({
            error:"X Role header must be present"
        })
        return
    }
    next()
}

export let checkApiKeyInHeader = (req, res, next)=>{
    let apiKey = req.headers["x-api-key"]
    if(!apiKey){
        res.status(400).json({
            error: 'api key not found in header'
        })
        return
    }
    if(apiKey !== "NodeJs-ApiKey"){
        res.status(400).json({
            error:'api key invalid'
        })
        return
    }
    next()
}