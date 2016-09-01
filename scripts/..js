var scripts = document.getElementsByTagName('script');
var currentScriptPath = scripts[scripts.length - 1].src;
var templatePath = '';
if(currentScriptPath.indexOf('lib') !== -1){
  templatePath = currentScriptPath.substring(0, currentScriptPath.lastIndexOf('/lib') + 1) + '/templates/';
  }
 else{
  templatePath = currentScriptPath.substring(0, currentScriptPath.lastIndexOf('/scripts') + 1) + '/templates/';
  }
