exports.payloadFeature = function(){
  if(process.env.payload){
    return process.env.payload;
  } else {
    return 'json';
  }
}

exports.dobFeature = function(){
  if(process.env.dob){
    return process.env.dob;
  } else {
    return 'boolean';
  }
}
