<script runat=server>
  Platform.Load("core","1");
  var version = "0.1.1";
  var data = [];
  var result = {};
  var fieldsdetail = [];
  try{
    var keyword = Platform.Request.GetQueryStringParameter('keyword');
    if(keyword){
      var list = DataExtension.Retrieve({Property:"Name",SimpleOperator:"like",Value:keyword});
      if(list.length > 8){
        throw('too many results(' + list.length + ')' );
      }
      for(var i = 0;i < list.length;i++){
        var current = list[i];
        var path = [current.Name];
        var folders = Folder.Retrieve({Property:"Id",SimpleOperator:"equals",Value:current.CategoryID});
        
        var DEname = DataExtension.Init(current.Name);
        var fields = DEname.Fields.Retrieve();

        current = folders[0];
        path.unshift(current.Name);
        while(current.ParentFolder.ID){
          folders = Folder.Retrieve({Property:"Id",SimpleOperator:"equals",Value:current.ParentFolder.ID});
          current = folders[0];
          path.unshift(current.Name);
        }
        data.push(path);

        fieldsdetail.push(fields);
        fieldsdetail.push(fields.Name ,fields.FieldType ,fields.IsPrimaryKey ,fields.MaxLength);
      }
    }
    result = {
      result : "success",
      status_code : 200,
      version : version,

      // aaa : current,
      // bbb : folders,
      // ccc : list,
      // ddd : DEname,
      // eee : fields,
      field : fieldsdetail,

      list : data
    };
  }catch(e){
    result = {
      result : "failed",
      status_code : 500,
      version : version,
      message : e
    };
  }
  Write(Platform.Function.Stringify(result));
</script>