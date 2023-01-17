// Navigate back to creating new order page
function neworder(){
	window.open("https://script.google.com/macros/s/AKfycbxxyJYrj3mXZbmwVOHoV6BqciC3m68XafJeWFgrfSvDsQ5hW1KcV4BJuPk-ackccK4B/exec","_top");
}

// ############################
// #       Info Section       #
// ############################

// Define basic info
var orderInfo = [];
var subtotal = 0;
var total = 0;
var shipfee = 0;
var discountamt = 0;

document.getElementById('shipfee').addEventListener('input',updatetotal);
document.getElementById('cpamount').addEventListener('input',updatetotal);

function updatetotal(){
	total = 0;
	shipfee = document.getElementById('shipfee').value;
	discountamt = document.getElementById('cpamount').value;
	if (shipfee!=="" && discountamt!==""){
		total = subtotal + parseFloat(shipfee) - parseFloat(discountamt);
	} else if (shipfee!=="" && discountamt==""){
		total = subtotal + parseFloat(shipfee);
	} else if (shipfee=="" && discountamt!==""){
		total = subtotal - parseFloat(discountamt);
	} else {
		total = subtotal;
	}
	document.getElementById('total').innerText = (Math.round(total * 100) / 100).toFixed(2) + " $";
}

function updateInfo(){
		var tempInfo = [];
		tempInfo[0] = document.getElementById('sdt1').value;
		tempInfo[1] = document.getElementById('name1').value;
		tempInfo[2] = document.getElementById('name2').value;
		tempInfo[3] = document.getElementById('sdt2').value;
		tempInfo[4] = document.getElementById('address').value;
		tempInfo[5] = document.getElementById('postcode').value;
		tempInfo[6] = subtotal;
		tempInfo[7] = document.getElementById('shipfee').value;
		tempInfo[8] = document.getElementById('cpamount').value;
		tempInfo[9] = total;
		tempInfo[10] = document.getElementById('cpcode').value;
		tempInfo[11] = document.getElementById('ordernote').value;
		tempInfo[12] = document.getElementById('emailadd').value;
		tempInfo[13] = document.getElementById('adminname').value;
		tempInfo[14] = document.getElementById('address2').value;
		console.log(tempInfo);
		orderInfo = tempInfo;
		console.log(cartArray);
}

function printbill(){
	updateInfo();
	billprint(orderInfo, cartArray);
}

// ############################
// #       Cart Section       #
// ############################
var cartArray = {};
var rmvArray = [];
var addProdCount = 0;

function updatesubtotal(){
		subtotal = 0;
		var cartLines = Object.keys(cartArray);
		cartLines.forEach(key =>{
						subtotal += cartArray[key][5];
				}
		)
		document.getElementById('subtotal').innerText = (Math.round(subtotal * 100) / 100).toFixed(2) + " $";
};

// Make current ID
function makeid(length1, length2) {
	var vnTime = new Date().toLocaleString('en-US',{timeZone:'Asia/Ho_Chi_Minh',timestyle:'short',hourCycle:'h24'});
	var day = new Date(vnTime).getDate();
	var year = new Date(vnTime).getFullYear().toString().slice(-2);
	var month = new Date(vnTime).getMonth()+1;
	var hour = ("0"+(new Date(vnTime).getHours())).slice(-2);
	var minute = ("0"+(new Date(vnTime).getMinutes())).slice(-2);
	var second = ("0"+(new Date(vnTime).getSeconds())).slice(-2);
	var charResult       = '';
	var numbResult       = '';
	var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	var charactersLength = characters.length;
	var numberLength     = characters.length;
	for ( var i = 0; i < length1; i++ ) {
		charResult += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	for ( var i = 0; i < length2; i++ ) {
		numbResult += characters.charAt(Math.floor(Math.random() * numberLength));
	}
	return result=year+month+day+'-'+charResult+hour+numbResult+minute+second;
}

// Place order
function placeOrder(){
	updateInfo();
	var searchorderid = document.getElementById('searchinput').value;
	if (searchorderid==''){
		alert('Bạn chưa điền mã đơn');
	} else {
		if(orderInfo[0]!=='' && orderInfo[12]!=='' && Object.keys(cartArray).length>0){
			var orderID = makeid(1,1);
			orderInfo.unshift(orderID);
			var cart = JSON.stringify(cartArray);
			google.script.run.saveNewOrder(orderInfo,cart);
			function reLoad() {
				google.script.run
				.withSuccessHandler(function(url){
					window.open(url,'_top');
				})
				.getScriptURL();
			}
			reLoad(`https://script.google.com/macros/s/AKfycbxxyJYrj3mXZbmwVOHoV6BqciC3m68XafJeWFgrfSvDsQ5hW1KcV4BJuPk-ackccK4B/exec`);
			searchorderid = searchorderid.replace(/\s+/g, '');
			google.script.run.cancelOldOrder(searchorderid);
		} else {
			alert('Not enough information: phone number and email fields are needed.');
		}
	}
}

// Product list object
function collectassign(prosearClass,inputid,packageid,prodpriceid,cartKey){
	var collect = document.querySelectorAll("."+prosearClass);
	collect.forEach(item => item.addEventListener('mousedown', (event) => {
		setProduct(item.id,inputid,packageid,prosearClass,prodpriceid,cartKey);}
	));
}

// Set value on search product input
function setProduct(idatag,inputid,packageid,prosearClass,prodpriceid,cartKey){
	console.log(idatag);
	var productName = document.querySelector("."+prosearClass+"#"+idatag).innerText;
	document.getElementById(inputid).value = productName;
	document.getElementById(packageid).innerText = productList[idatag][1];
	document.getElementById(prodpriceid).innerText = productList[idatag][2];
	console.log(productName, productList[idatag][1], idatag, productList[idatag][2],cartKey);
	catchInputEvent(productName, productList[idatag][1], idatag, cartKey);
}

google.script.run.withSuccessHandler(addProdClick).loadproducts();

function updateproducts(){
	google.script.run.withSuccessHandler(getProducts).loadproducts();
}

function getProducts(prodlist){
	productList = JSON.parse(prodlist);
}

var productList = {};

// Show dropdown list when typing and click 1st time
function addProdClick(prodlist){
	productList = JSON.parse(prodlist);
	if(productList==null){
		alert('undefined');
	} else {
	addProdCount+=1;
	var currentProdName = `line-${addProdCount}`;

	// Create new row
	var numsofchild = document.getElementById('selectProdTab').rows.length;
	var nextRowEl = document.getElementById('selectProdTab').insertRow(numsofchild);
	var newDiv = document.createElement('div');
	newDiv.classList.add('dropdown');
	var inputid = 'myInput'+(addProdCount);
	var dropid = 'myDropdown'+(addProdCount);
	var prosearClass = 'prodsearch'+(addProdCount);
	var aTag = '';
	
	for(i=0;i<Object.keys(productList).length;i++){
			var currentKey = Object.keys(productList)[i];
			aTag+=`<a class=${prosearClass} id=${currentKey}>${productList[currentKey][0]}</a>`;
	}

	var productLine = `
			<input type="text" placeholder="tìm sản phẩm" id="${inputid}"  class="myInput">
			<div id="${dropid}" class="dropdown-content">
					${aTag}
			</div>
	`;

	newDiv.innerHTML = productLine;
	nextRowEl.insertCell(0).appendChild(newDiv);
	nextRowEl.insertCell(1).id = `package${addProdCount}`;
	nextRowEl.insertCell(2).classList.add("quantity");
	nextRowEl.insertCell(3).id = `prodprice-${addProdCount}`;
	nextRowEl.insertCell(4).classList.add("quantity");
	nextRowEl.insertCell(5).id = `subtotal-${addProdCount}`;
	nextRowEl.insertCell(6).classList.add("aligntext");
	nextRowEl.cells[2].innerHTML = `<input type="number" id="quantity-${addProdCount}" min="1"  oninput="this.value = !!this.value && Math.abs(this.value) >= 1 ? Math.abs(this.value) : 1">`;
	nextRowEl.cells[4].innerHTML = `<input type="number" id="offerprice-${addProdCount}">`;
	nextRowEl.cells[6].innerHTML = `<button class="deletebtn" id="delete-${addProdCount}" onclick="deleterow(this,${addProdCount},'${currentProdName}');">&times;</button>`;

	// Display dropdown list
	document.getElementById(inputid).addEventListener('click', event =>{myFunction(inputid, dropid);});
	document.getElementById(inputid).addEventListener('input', event =>{myFunction(inputid, dropid);});
	collectassign(prosearClass,inputid,nextRowEl.cells[1].id,nextRowEl.cells[3].id,currentProdName);
	blurdropdown(inputid,dropid);
	nextRowEl.cells[1].classList.add('aligntext');
	nextRowEl.cells[2].classList.add('aligntext');
	nextRowEl.cells[3].classList.add('aligntext');
	nextRowEl.cells[4].classList.add('aligntext');
	nextRowEl.cells[5].classList.add('aligntext');
	}
}
function myFunction(idtag,dropid) {
	document.getElementById(dropid).classList.toggle("show");
	filterFunction(dropid,idtag);
}

// Search from search box
function filterFunction(dropid, inputid) {
	document.getElementById(dropid).style.display = 'block';
	var input, filter, ul, li, a, i;
	input = document.getElementById(inputid);
	filter = input.value.toUpperCase();
	div = document.getElementById(dropid);
	a = div.getElementsByTagName("a");
	for (i = 0; i < a.length; i++) {
		txtValue = a[i].textContent || a[i].innerText;
		if (txtValue.toUpperCase().indexOf(filter) > -1) {
		a[i].style.display = "";
		} else {
		a[i].style.display = "none";
		}
	}
}

function deleterow(btn,rowid,lineid){
	if(rowid > 0){
		var row = btn.parentNode.parentNode;
		row.parentNode.removeChild(row);
		delete cartArray[lineid];
		rmvArray.push(lineid);
	}
	updatesubtotal();
	updatetotal();
}

function clearCart(){
	rmvArray = [];
	cartArray = {};
	var curRows = document.getElementById('selectProdTab').rows.length;
	for (i=1;i<curRows;i++){
		document.getElementById('selectProdTab').deleteRow(1);
	}
}

function blurdropdown(inputid, dropid){
		document.getElementById(inputid).addEventListener('blur', event => {
		document.getElementById(dropid).style.display = 'none';
	}, true);
}

document.getElementById('addProduct').addEventListener('click', function(){
		addProdClick(JSON.stringify(productList));
	}
);

function catchInputEvent(cartName, cartPackage, cartSKU, cartKey){
	var linenum = parseInt(cartKey.substring(cartKey.indexOf('-')+1,cartKey.length));
	console.log(linenum);
	var qtyInput = document.querySelectorAll('.quantity.aligntext');
	qtyInput.forEach(item => item.addEventListener("input",function(){
		if(rmvArray.indexOf(cartKey)==-1){
			var statedprice = parseFloat(document.getElementById('prodprice-'+linenum).innerText);
			var quantity = document.getElementById('quantity-'+linenum).value;
			var offerprice = document.getElementById('offerprice-'+linenum).value;
			if (offerprice==null || offerprice==""){
				offerprice=statedprice;
			}
			var subtolal = quantity * offerprice;
			document.getElementById('subtotal-'+linenum).innerText = (Math.round(subtolal * 100) / 100).toFixed(2) + " $";
			if((quantity!=="" || quantity>0)){
				var tempCart = [cartName,cartPackage,quantity,cartSKU,offerprice,subtolal];
				cartArray[cartKey]=tempCart;
			}
			updatesubtotal();
			updatetotal();
		}
	}))
}

// Search Order
document.getElementById('searchicon').addEventListener('click',loadMatchOrder);
function loadMatchOrder(){
	var searchorderid = document.getElementById('searchinput').value;
	if (searchorderid==''){
		return;
	} else {
		searchorderid = searchorderid.replace(/\s+/g, '');
		google.script.run.withSuccessHandler(searchorder).filterorder(searchorderid);
	}
}

function searchorder(orderArray){
	var result = JSON.parse(orderArray);
	document.getElementById('sdt1').value = result[0][1];
	document.getElementById('name1').value = result[0][2];
	document.getElementById('name2').value = result[0][3];
	document.getElementById('sdt2').value = result[0][4];
	document.getElementById('postcode').value = result[0][6];
	document.getElementById('emailadd').value = result[0][13];
	document.getElementById('address').value = result[0][5];
	document.getElementById('ordernote').innerText = result[0][12];
	document.getElementById('shipfee').value = result[0][8];
	document.getElementById('cpamount').value = result[0][9];
	document.getElementById('cpcode').value = result[0][11];
	document.getElementById('adminname').value = result[0][14];
	document.getElementById('address2').value = result[0][15];
	clearCart();
	var numsofline = 0;
	var curProdlist = JSON.stringify(productList);
	while (numsofline < result.length){
		var curQty = result[numsofline][20];
		var curPrice = result[numsofline][22];
		var curSubtotal = result[numsofline][23];
		loadItems(curProdlist, result[numsofline][18], result[numsofline][19], parseFloat(curQty), result[numsofline][21], parseFloat(curPrice), parseFloat(curSubtotal));
		numsofline++;
	}
}

function loadItems(prodlist, prodname, prodpack, prodqty, prodsku, prodprice, prodlinesub){
		productList = JSON.parse(prodlist);
		if(productList==null){
			alert('undefined');
		} else {
		addProdCount+=1;
		var currentProdName = `line-${addProdCount}`;

		// Create new row
		var numsofchild = document.getElementById('selectProdTab').rows.length;
		var nextRowEl = document.getElementById('selectProdTab').insertRow(numsofchild);
		var newDiv = document.createElement('div');
		newDiv.classList.add('dropdown');
		var dropid = 'myDropdown'+(addProdCount);
		var prosearClass = 'prodsearch'+(addProdCount);

		var inputid = 'myInput'+(addProdCount); // Id của input tên sản phẩm

		var aTag = '';
		for(i=0;i<Object.keys(productList).length;i++){
				var currentKey = Object.keys(productList)[i];
				aTag+=`<a class=${prosearClass} id=${currentKey}>${productList[currentKey][0]}</a>`;
		}
		var productLine = `
				<input type="text" placeholder="tìm sản phẩm" id="${inputid}" class="myInput" value="${prodname}">
				<div id="${dropid}" class="dropdown-content">
						${aTag}
				</div>
		`;

		newDiv.innerHTML = productLine;
		nextRowEl.insertCell(0).appendChild(newDiv);
		nextRowEl.insertCell(1).id = `package${addProdCount}`;
		nextRowEl.insertCell(2).classList.add("quantity");
		nextRowEl.insertCell(3).id = `prodprice-${addProdCount}`;
		nextRowEl.insertCell(4).classList.add("quantity");
		nextRowEl.insertCell(5).id = `subtotal-${addProdCount}`;
		nextRowEl.insertCell(6).classList.add("aligntext");
		nextRowEl.cells[2].innerHTML = `<input type="number" id="quantity-${addProdCount}" min="1"  oninput="this.value = !!this.value && Math.abs(this.value) >= 1 ? Math.abs(this.value) : 1" value="${prodqty}">`;
		nextRowEl.cells[4].innerHTML = `<input type="number" id="offerprice-${addProdCount}" value="${prodprice}">`;
		nextRowEl.cells[6].innerHTML = `<button class="deletebtn" id="delete-${addProdCount}" onclick="deleterow(this,${addProdCount},'${currentProdName}');">&times;</button>`;
		setProduct(prodsku,inputid,`package${addProdCount}`,prosearClass,`prodprice-${addProdCount}`,currentProdName);

		// Display dropdown list
		document.getElementById(inputid).addEventListener('click', event =>{myFunction(inputid, dropid);});
		document.getElementById(inputid).addEventListener('input', event =>{myFunction(inputid, dropid);});
		collectassign(prosearClass,inputid,nextRowEl.cells[1].id,nextRowEl.cells[3].id,currentProdName);
		blurdropdown(inputid,dropid);
		nextRowEl.cells[1].classList.add('aligntext');
		nextRowEl.cells[2].classList.add('aligntext');
		nextRowEl.cells[3].classList.add('aligntext');
		nextRowEl.cells[4].classList.add('aligntext');
		nextRowEl.cells[5].classList.add('aligntext');
		}
		updateCart(prodname, prodpack, prodsku, currentProdName);
		catchInputEvent(prodname, prodpack, prodsku, currentProdName);
}

// Update cart after search
function updateCart(cartName, cartPackage, cartSKU, cartKey){
	var linenum = parseInt(cartKey.substring(cartKey.indexOf('-')+1,cartKey.length));
	if(rmvArray.indexOf(cartKey)==-1){
		var statedprice = parseFloat(document.getElementById('prodprice-'+linenum).innerText);
		var quantity = document.getElementById('quantity-'+linenum).value;
		var offerprice = document.getElementById('offerprice-'+linenum).value;
		if (offerprice==null || offerprice==""){
			offerprice=statedprice;
		}
		var subtolal = quantity * offerprice;
		document.getElementById('subtotal-'+linenum).innerText = (Math.round(subtolal * 100) / 100).toFixed(2) + " $";
		if((quantity!=="" || quantity>0)){
			var tempCart = [cartName,cartPackage,quantity,cartSKU,offerprice,subtolal];
			cartArray[cartKey]=tempCart;
		}
		updatesubtotal();
		updatetotal();
	}
}