import pkg from "jsonwebtoken";


const adminAuth = async (req,res,next) => {
    try {
       
        if(req.session.IsLoggedIn == true){
            next();
        }else{
            res.redirect('/login');
        }
        // const token = req.headers.authorization.split(" ")[1];
        // const isCustomAuth = token.length < 500;
        // let decodedData;
      
        // if (token) {
        //     if(isCustomAuth){
        //         decodedData = pkg.verify(token,'test');
        //         req.userId = decodedData?.id;
        //     }else{
        //         decodedData = pkg.decode(token);
        //         req.userId = decodedData?.sub;
        //     }
        //     
        // } else {
        //     res.status(403).json({message:'You are not allowed to perform this action'});
        // }
        

    } catch (error) {
        console.log(error);
    }
}

export default adminAuth;