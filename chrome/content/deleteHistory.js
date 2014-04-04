com.wuxuan.fromwheretowhere.deleteHistory=function(){
  var pub={};
  
  pub.delete=function(nodes){
    for(var i=0;i<nodes.length;i++)
      console.log("called in clear history by thread: "+nodes[i].label);
  };
  
  return pub;
}();