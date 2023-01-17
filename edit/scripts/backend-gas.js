// this file uses google app script library
function doGet(){
  var source_sheet = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1O4JbxbMPT03eKA5hRV4nBiZpnJLvkPLGCYX4YN-sReA/edit#gid=1065469929');
  var productSheet = source_sheet.getSheetByName('product');
  var productRowNums = productSheet.getRange('B1').getValue();
  var productArrayFS = productSheet.getRange(3,1,productRowNums,11).getValues();
  var categorySheet = source_sheet.getSheetByName('productCategory');
  var categoryRowNums = categorySheet.getRange('B1').getValue();
  var categoryArrayFS = categorySheet.getRange(3,1,categoryRowNums,2).getValues();
  var categoryArray = {};
  for (categ=0;categ<categoryArrayFS.length;categ++){
    var tempObject = new Object();
    tempObject['categoryName']=categoryArrayFS[categ][1];
    tempObject['subProduct']= [];
    categoryArray[categoryArrayFS[categ][0]]=tempObject;
    for (prod=0;prod<productArrayFS.length;prod++){
      if (productArrayFS[prod][8]==Object.keys(categoryArray)[categ]){
        tempObject['subProduct'].push(productArrayFS[prod]);
      }
    }
  }
  var tmp = HtmlService.createTemplateFromFile('index');
  tmp.categoryArray = categoryArray;
  return tmp.evaluate().setTitle('Tohfish - Admin');
}

function loadorders(){
    var source_sheet = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1adjBtCEkB4L_X535egWGWHdKNQEdNmWg80hcGWJWiUg/edit#gid=1656395183');
    var order_sheet = source_sheet.getSheetByName('order');
    var numsofrow = order_sheet.getRange('C1').getValue();
    var numsofcol = 24;
    var allorders = order_sheet.getRange(3,1,numsofrow,numsofcol).getValues();
    return allorders;
  }

function filterorder(searchId){
  var orders = loadorders();
  var orderLoc = {}; // order with index in array and numbers of row orderLoc = {'order 1': [0,4], 'order2': [4,2]}
  var orderId = orders[0][0];
  var curIndex = 0;
  var orderR = 0;
  for (i=0;i<orders.length;i++){
    if (orders[i][0]!==orderId) {
      orderId = orders[i][0];
      curIndex = i;
      orderR = 0;
    }
    orderR++;
    orderLoc[orderId] = [curIndex,curIndex+orderR];
  }
  var curLoc = orderLoc[searchId];
  var result = orders.slice(curLoc[0],curLoc[1]);
  return JSON.stringify(result);
}

function loadproducts(){
  var source_sheet = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1O4JbxbMPT03eKA5hRV4nBiZpnJLvkPLGCYX4YN-sReA/edit#gid=1065469929');
  var productSheet = source_sheet.getSheetByName('product');
  var productRowNums = productSheet.getRange('B1').getValue() - 5;
  var skuArray = productSheet.getRange(8,1,productRowNums,1).getValues();
  var prodArray = productSheet.getRange(8,2,productRowNums,2).getValues();
  var priceArray = productSheet.getRange(8,6,productRowNums,1).getValues();
  var productList = {};
  for(i=0;i<skuArray.length;i++){
    productList[skuArray[i]]=[`${prodArray[i][0]} ${prodArray[i][1]}`,prodArray[i][1],priceArray[i][0]];
  }
  return JSON.stringify(productList);
}

// Save order to database
function saveNewOrder(arrayInfo, cart){
  var cartArray = JSON.parse(cart);
  var arrayProduct = [];
  Object.keys(cartArray).forEach(line => arrayProduct.push(cartArray[line]));
  var source_sheet = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1O4JbxbMPT03eKA5hRV4nBiZpnJLvkPLGCYX4YN-sReA/edit#gid=934191456');
  var vietnamTime = new Date().toLocaleString('en-US',{timeZone:'Asia/Ho_Chi_Minh',timestyle:'long',hourCycle:'h24'});
  vietnamTime = vietnamTime.replace(',','');
  var order_sheet = source_sheet.getSheetByName('order');
  var nextrow = order_sheet.getRange('B1').getValue();

  if(arrayInfo==null || arrayProduct==null){
    return
  } else if (arrayInfo[0]==null || arrayProduct[0]==null){
      return
  } else {
    arrayInfo.push(vietnamTime);
    arrayInfo.push('No');
    var lastArrayInfo = [];
    for (i=0;i<arrayProduct.length;i++){
      lastArrayInfo.push(arrayInfo);
    }
    order_sheet.getRange(nextrow,19,arrayProduct.length,6).setValues(arrayProduct);
    order_sheet.getRange(nextrow,1,lastArrayInfo.length,18).setValues(lastArrayInfo);
  }
}

// Reload the page when save new order
function getScriptURL() {
  // return ScriptApp.getService().getUrl();
  return "https://script.google.com/macros/s/AKfycbxxyJYrj3mXZbmwVOHoV6BqciC3m68XafJeWFgrfSvDsQ5hW1KcV4BJuPk-ackccK4B/exec";
}

// Update cancel status to old order which was editted
function cancelOldOrder(orderid){
  var orders = loadorders();
  var orderLoc = {}; // order with index in array and numbers of row orderLoc = {'order 1': [0,4], 'order2': [4,2]}
  var orderId = orders[0][0];
  var curIndex = 0;
  var orderR = 0;
  for (i=0;i<orders.length;i++){
    if (orders[i][0]!==orderId) {
      orderId = orders[i][0];
      curIndex = i;
      orderR = 0;
    }
    orderR++;
    orderLoc[orderId] = [curIndex+3,orderR];
  }
  var source_sheet = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1adjBtCEkB4L_X535egWGWHdKNQEdNmWg80hcGWJWiUg/edit#gid=1656395183');
  var order_sheet = source_sheet.getSheetByName('order');
  var cancelRange = [];
  var curLoc = orderLoc[orderid];
  for (i=0;i<curLoc[1];i++){
    cancelRange.push(["Yes"]);
  }
  order_sheet.getRange(curLoc[0],18,curLoc[1],1).setValues(cancelRange);
}








