function testSchemas() {
  var threads = GmailApp.search('from:"criduq@eltiempo.com"');
  //var threads = GmailApp.getInboxThreads(0, 2);
  var label = GmailApp.getUserLabelByName("Verificado");
  
  var ssNew = SpreadsheetApp.create("Listado de Tareas", 100, 17);
  
  skin(ssNew);
  for (var i = 0; i < threads.length; i++) {
    var threads = threads[i];
    var messages = threads.getMessages();
    var solution = "";
    var dateSolution = "";
    for (var i = 0; i < messages.length; i++) {
      solution = messages[i].getBody();
      dateSolution = messages[i].getDate();
      Logger.log(messages[i].getSubject());
      
    }
    Logger.log(threads.getFirstMessageSubject());
    var obj = {
      "subject": threads.getFirstMessageSubject(),
      "date": threads.getLastMessageDate(),
      "label": threads.getLabels()[0].getName(),
      "solution": solution,
      "dateSolution": dateSolution,
      "parent": threads
    }
    threads.addLabel(label)
    insertData(ssNew,obj);
  }
  
  SpreadsheetApp.flush();
  
  var file = DriveApp.getFileById(ssNew.getId());
  var url = file.getUrl()
  var mineType = file.getMimeType();
  GmailApp.sendEmail(Session.getActiveUser().getEmail(), 'Verificador de Tareas', 'Adjunto el pdf por favor verifique el documento en Drive: '+ url, {
    attachments: [file],
    name: 'Verificador de Tareas'
  });
  
  function insertData(sheet,obj) {
    sheet.appendRow([
      "",
      "Finalizado",
      "",
      obj.date.getMonth(),
      obj.date,
      obj.subject,
      Session.getActiveUser().getEmail(),
      "",
      "",
      obj.solution,
      obj.label,
      "Tipo Error",
      obj.dateSolution,
      obj.dateSolution,
      obj.date-obj.dateSolution,
      
    ]);
  }
  
  function skin(ssNew) {
    ssNew.appendRow([
      "No. Ticket", 
      "Estado", 
      "Usuario	Aplicación",
      "MES",
      "Fecha llegada Soporte",
      "Descripción Problema",
      "Ingeniero Responsable",
      "Fecha Estim Entrega",
      "Hora Estim Entrega",
      "Descripción Solución",
      "Observación Sistemas",
      "Tipo Error",
      "Fecha Entreg",
      "Hora Entrega",
      "Tiempo Tarea"
    ]);

    ssNew.setColumnWidth(1, 200);
    ssNew.setColumnWidth(2, 200);
    var sheet = ssNew.getSheets()[0];
    sheet.getRange("A1:O1").setFontWeight("bold").setHorizontalAlignment("center");;
    
  }
}
