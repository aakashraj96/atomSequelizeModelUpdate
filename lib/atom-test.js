'use babel';


import { CompositeDisposable } from 'atom';
let fs = require('fs');
export default {


  subscriptions: null,

  activate() {


    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-test:toggle': () => this.toggle()
    }));
    console.log('Chelllo');
  },

  deactivate() {

    this.subscriptions.dispose();

  },



  toggle() {
    console.log('AtomTest was toggled!');
    editor = atom.workspace.getActivePaneItem()
    file = editor.buffer.file
    filePath = file.path
    let modelFilepath = filePath.replace("migrations", "models")
    let modelSplit = modelFilepath.split("models/")
    let timeStampRemoved = modelSplit[1].split("create-")
    let modelPath = modelSplit[0]+"models/"+timeStampRemoved[1];
    let migrationContent = fs.readFileSync(filePath)
    let modelsContent = fs.readFileSync(modelPath)
    let migrationArray = migrationContent.toString().split(/}(.+)/)
    console.log(migrationArray);
    let modelsContentRemove = modelsContent.toString().split("define")[1];
    let startIndex = modelsContentRemove.indexOf("{");
    let endIndex = modelsContentRemove.indexOf("}");
    let contentToBeRemoved = modelsContent.toString().replace(modelsContentRemove.substring(startIndex+1,endIndex),"");
    console.log(contentToBeRemoved);
    let modelsContentUpdate = contentToBeRemoved.toString().split("define(")[1];
    startIndex = modelsContentUpdate.indexOf("{");
    let finalString = modelsContentUpdate.slice(0,startIndex+1);
    let startIndexCopy = startIndex;
    for(let i=2;i<migrationArray.length-9;i+=2)
    {
      let attributes = migrationArray[i].split(/:(.+)/);
      let attributeName = attributes[0].replace(/\s/g,'');
      let attributeType;
      attributes.forEach((element)=>{
        // console.log(element, element.includes("Sequelize"));


        if(element.includes("Sequelize"))
        {
          attributeType = element.split(".")[1];
        }




      })
      let stringtoBeAdded = attributeName+": DataTypes."+attributeType+',\n';
      finalString += stringtoBeAdded;
      startIndex+= stringtoBeAdded.length;





    }
    let finalS=contentToBeRemoved.toString().split("define(")[0]+"define("+finalString+modelsContentUpdate.slice(startIndexCopy+1);
    console.log(finalS);
    fs.writeFileSync(modelPath, finalS);

    // return (
    //   this.modalPanel.isVisible() ?
    //   this.modalPanel.hide() :
    //   this.modalPanel.show()
    // );
  }

};
