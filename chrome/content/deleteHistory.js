
com.wuxuan.fromwheretowhere.deleteHistory=function(){
  var pub={};
  
  Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");
  XPCOMUtils.defineLazyModuleGetter(this, "Task",
                                    "resource://gre/modules/Task.jsm");
  XPCOMUtils.defineLazyModuleGetter(this, "PlacesUtils",
                                    "resource://gre/modules/PlacesUtils.jsm");

  pub.getCurrentSelectedwithIndex = function(main){
    var selectCount = main.treeView.selection.count;
    var selectedIndex = main.UIutils.getAllSelectedIndex(main.treeView);
    //verify 
    if(selectCount!=selectedIndex.length){
      console.log("Error when getting selected rows");
    }
    var selected = {};
    for(var i in selectedIndex){
      var node = main.treeView.visibleData[selectedIndex[i]];
      
      selected[selectedIndex[i]]=main.utils.cloneObject(node);
    }
    return selected;
  };

  pub.delete=function(main){
    var sel = pub.getCurrentSelectedwithIndex(main);
    var idx = [];
    for(var i in sel){
      idx.push(i);
    }
    idx.sort();
    for(var id=idx.length-1;id>=0;id--){
      var i=idx[id];
      //console.log(JSON.stringify(sel[i]));
      //console.log("to delete:"+i+" open?"+sel[i].isFolded);
      //fold it if not, and just need to delete one row
      if(sel[i].isFolded){
        main.treeView.toggleOpenState(Number(i));
      }
      pub.deleteAll(sel[i]);
      main.treeView.visibleData.splice(i,1);
      main.treeView.treeBox.rowCountChanged(i+1,-1);
      //if it was the only child, fold the parent node
      //console.log(sel[i]+" go up from "+sel[i].level);
      if(sel[i].level>0){
        var p = main.treeView.visibleData[i-1];
        //console.log(JSON.stringify(p));
        if(p.level==sel[i].level-1 && p.children.length==1){
          p.isContainer=false;
          //p.isFolded=false;
        }
      }
    }
    main.treeView.selection.clearSelection();
  };
  
  pub.deleteAll = function(node){
    //console.log("removeVisitsByTimeframe: "+node.label+" "+node.visit_date);
    Task.async(function* () {
      let filter = {
        beginDate: new Date(node.visit_date/1000),
        endDate: new Date(node.visit_date/1000 + 1)
      };
      yield PlacesUtils.history.removeVisitsByFilter(filter);
      }
    )();
    var ch = node.children;
    if(ch==null)
      return;
    for(var i=0;i<ch.length;i++){
      pub.deleteAll(ch[i]);
    }
  };
  
  return pub;
}();