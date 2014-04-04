com.wuxuan.fromwheretowhere.deleteHistory=function(){
  var pub={};
  
  pub.browserHistory = Components.classes["@mozilla.org/browser/nav-history-service;1"]
                     .getService(Components.interfaces.nsIBrowserHistory);
                     
                     
  pub.delete=function(main){
    var sel = main.getCurrentSelectedwithIndex();
    var idx = [];
    for(var i in sel){
      idx.push(i);
    }
    idx.sort();
    for(var id=idx.length-1;id>=0;id--){
      var i=idx[id];
      console.log(JSON.stringify(sel[i]));
      console.log("to delete:"+i+" open?"+sel[i].isFolded);
      //fold it if not
      if(sel[i].isFolded){
        main.treeView.toggleOpenState(Number(i));
      }
      pub.deleteAll(sel[i]);
      main.treeView.visibleData.splice(i,1);
      main.treeView.treeBox.rowCountChanged(i+1,-1);
    }
    main.treeView.selection.clearSelection();
  };
  
  pub.deleteAll = function(node){
    console.log("removeVisitsByTimeframe: "+node.label+" "+node.visit_date);
    pub.browserHistory.removeVisitsByTimeframe(node.visit_date,node.visit_date);
    var ch = node.children;
    if(ch==null)
      return;
    for(var i=0;i<ch.length;i++){
      pub.deleteAll(ch[i]);
    }
  };
  
  return pub;
}();