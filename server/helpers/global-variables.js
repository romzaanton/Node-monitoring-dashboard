global.$variables = { 
    'app': null,
};

function setGlobalVariable(prop, payload) {
   if (!global.$variables && !(prop in global.$variables)){
       throw new Error(`Not valid global variable property name is set function`);
   } else {
       global.$variables[prop] = payload;
   }

}

function getGlobalVariable(prop) {
    if (!global.$variables && !(prop in global.$variables)){
        throw new Error(`Not valid global variable property name is get function`);
    } else {
        return global.$variables[prop];
    }
}

module.exports = { setGlobalVariable, getGlobalVariable };
