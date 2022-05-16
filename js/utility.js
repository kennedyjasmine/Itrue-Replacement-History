function removeOptions(selectElement) {
    var i,  L = selectElement.options.length - 1;
    for(i = L; i >= 0; i--) {
       selectElement.remove(i);
    }
 }

 [0, 1, 2, 3, 4, 5]