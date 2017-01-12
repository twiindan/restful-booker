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

exports.indexFeature = function() {
  if(process.env.index){
    return process.env.index;
  } else {
    return 'full';
  }
}

exports.editFeature = function(){
  if(process.env.edit){
    return process.env.edit;
  } else {
    return 'full';
  }
}

exports.validateFeature = function(){
  if(process.env.validation){
    return process.env.validation;
  } else {
    return 'server';
  }
}

exports.authFeature = function(){
  if(process.env.auth){
    return process.env.auth;
  } else {
    return 'query';
  }
}
