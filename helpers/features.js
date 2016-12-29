exports.payloadFeature = function(){
  if(process.env.payload){
    return process.env.payload;
  } else {
    return 'json';
  }
}
