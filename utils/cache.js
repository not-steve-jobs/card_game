const NodeCache = require( "node-cache" );
const myCache = new NodeCache( { stdTTL: 100, checkperiod: 120 } );
const set = (key,data)=>{
    return myCache.set( key, data, 10000 );
}
const get = (key,)=>{
   return  myCache.get( key );
}
module.exports = {
    set,
    get
}