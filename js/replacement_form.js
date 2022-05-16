
// utility functions

function removeOptions(selectElement) {
    var i, L = selectElement.options.length - 1;
    for(i = L; i >= 0; i--) {
       selectElement.remove(i);
    }
 }
 //


getItemCategories()

var machineNumberObject = document.getElementById('machineno')
       machineNumberObject.addEventListener("keypress", function(event) {
   if (event.key === 'Enter') {
       var machineNumber = machineNumberObject.value;
       getEquipmentDetails(machineNumber)
   }
})

var getImageforUpload = function(event, documentImageID) {
    var image = document.getElementById(documentImageID);
    image.src = URL.createObjectURL(event.target.files[0]);
 }


function getEquipmentDetails(machineNumber) {
   var url = "http://107.105.85.175:8021/equipment/" + machineNumber + "?format=json"
   $.ajax({
       url: url,
       method: "GET",
       contentType:'application/json',
       success: function(equipmentDetails) {
           displayEquipmentDetails(equipmentDetails);
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) { 
            window.alert("Details " + errorThrown);
       }       
   })
}
function displayEquipmentDetails(equipmentDetails) {
   var line = document.getElementById("line");
   var size = document.getElementById("size");
   line.value = equipmentDetails.line;
   size.value = equipmentDetails.size;
}

function getItemCategories() {
   var url = "http://107.105.85.175:8021/api/item-categories/?format=json"
   $.ajax({
       url: url,
       method: "GET",
       contentType:'application/json',
       success: function(itemCategoryList) {
           displayItemCategories(itemCategoryList);
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log(textStatus, errorThrown)
            window.alert("Details not found" + errorThrown );
       }       
   })
}

function displayItemCategories(itemCategoryList) {
    // filter item names only 
    itemNames = itemCategoryList.map(item => item.category_name)
    itemNames.unshift('---')

    function populateSelect(categoryId) {
        categoryReferenced = document.getElementById(categoryId)
        for (var i=0; i<itemNames.length; i++) {
            var option = document.createElement('option');
            option.value = itemNames[i]
            option.innerHTML = itemNames[i]
            categoryReferenced.appendChild(option)
        }
    }
    populateSelect("beforeItemCategory");
    populateSelect("afterItemCategory")   
}

function getItemsfromCategory(categoryName, ItemCategoryID) {
    var url = "http://107.105.85.175:8021/api/items/?category_name=" + categoryName + "&format=json"
    $.ajax({
        url: url,
        method: "GET",
        contentType: 'application/json',
        success: function(itemList) {
            displayItemList(itemList, ItemCategoryID);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log(textStatus, errorThrown)
            window.alert("Details not found" + errorThrown);
        }
    })
}

function displayItemList(itemList, ItemCategoryID) {
    var shortNames = itemList.map(item => item.short_name);
    var mdmCodes = itemList.map(item => item.mdm_code);
    console.log(mdmCodes)
    var categoryItemMapping = {
        "beforeItemCategory": "beforeItemName",
        "afterItemCategory": "afterItemName"
    }
    itemsId = categoryItemMapping[ItemCategoryID]
    var itemReferenced = document.getElementById(itemsId)
    
    function clearSelect() {
        removeOptions(itemReferenced);
    }

    function populateSelect() {
        for (var i=0; i<mdmCodes.length; i++) {
            var option = document.createElement('option');
            option.value = mdmCodes[i]
            option.innerHTML = shortNames[i]       
            itemReferenced.appendChild(option);
        }
    }
    clearSelect()
    populateSelect()
}

// event listeners once categories are changed

var beforeItemCategory = document.getElementById("beforeItemCategory");
var afterItemCategory = document.getElementById("afterItemCategory");
beforeItemCategory.addEventListener("change", function(){
    getItemsfromCategory(beforeItemCategory.value, beforeItemCategory.id)
})
afterItemCategory.addEventListener("change", function(){
    getItemsfromCategory(afterItemCategory.value, afterItemCategory.id)
})
