import pkg from "jsonwebtoken";


const auth = async (req,res,next) => {
    try {
        const { jwt,decode } = pkg;
       if(typeof req.headers.authorization != 'undefined'){ 
        const token = req.headers.authorization.split(" ")[1];
        const isCustomAuth = token.length < 500;
        let decodedData;
      
        if (token) {
            if(isCustomAuth){
                decodedData = pkg.verify(token,'test');
                req.userId = decodedData?.id;
            }else{
                decodedData = pkg.decode(token);
                req.userId = decodedData?.sub;
            }
            next();
        } else {
            res.status(403).json({message:'You are not allowed to perform this action'});
        }

        }else{ res.status(403).json({message:'You are not allowed to perform this action'}); }
       
        

    } catch (error) {
        console.log(error);
    }
}

export default auth;