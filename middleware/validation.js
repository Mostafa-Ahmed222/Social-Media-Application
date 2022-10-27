const dataMethod = ['body', 'query', 'params', 'file', 'files', 'headers']
const validation = (Schema)=>{
    return (req,res, next)=>{
        const validationArr = []
        dataMethod.forEach(key => {
            if(Schema[key]) {
                const validationResult = Schema[key].validate(req[key],{
                    abortEarly : false
                })
                if (validationResult?.error?.details) {
                    validationArr.push(validationResult.error.details)
                }
            }
        })
        if (validationArr.length) {
            res.status(400).json({message : 'validation error', validationArr})
        } else {
            next()
        }
    }
}
export default validation