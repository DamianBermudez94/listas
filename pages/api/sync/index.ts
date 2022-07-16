import methods from 'micro-method-router';
import type { NextApiRequest, NextApiResponse } from 'next';
import {getOffsetAndLimit} from "lib/request";
import { airtableBase} from 'lib/airtable';
import {productsIndex} from "lib/algolia";


export default function (req:NextApiRequest, res:NextApiResponse){
   
    const {offset, limit}= getOffsetAndLimit(req, 100, 1000);
    airtableBase('Furniture').select({
        // Selecting the first 3 records in All furniture:
       pageSize:10
    }).eachPage(
        async function(records, fetchNextPage) {
        // This function (`page`) will get called for each page of records
        for(const r of records) {
            const objects = records.map(r=>{
                return{
                    objectID: r.id,
                    ...r.fields
                }
            })
            await  productsIndex.saveObjects(objects)
        
            console.log("siguiente pagina");
        };
        
        // To fetch the next page of records, call `fetchNextPage`.
        // If there are more records, `page` will get called again.
        // If there are no more records, `done` will get called.
        fetchNextPage();
    
    }, function done(err) {
        if (err) { console.error(err); return; }
        console.log("termino");
        res.send("termino")
    });
    
}
