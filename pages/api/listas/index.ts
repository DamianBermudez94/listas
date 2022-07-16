import methods from 'micro-method-router';
import type { NextApiRequest, NextApiResponse } from 'next';

function getListas() {
    const arr = Array.from(Array(100).keys());
    return arr.map((v)=>{
        return{
            nombre:v
        }
        
    })
}
function getOffsetAndLimit(req:NextApiRequest, maxLimit, maxOffset){
    const queryLimit = parseInt(req.query.limit as string);
    const queryOffset = parseInt(req.query.offset as string);
    const limit = queryLimit <= maxLimit ? queryLimit : maxLimit;
    const offset = queryOffset < maxOffset ? queryOffset : 0;
    console.log(offset);
    
    return{
        limit,
        offset,
    }
}

export default function (req:NextApiRequest, res:NextApiResponse){
   const lista = getListas();
    const {offset, limit}= getOffsetAndLimit(req, 100, lista.length)
    console.log({offset, limit});
    
    const sliced = lista.slice(offset, offset + limit)
    res.send({
        results:sliced,
        pagination:{
            offset,
            limit,
            total:lista.length
        }
    })
}
