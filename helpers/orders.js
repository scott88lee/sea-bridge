module.exports = {
   consolidateLineItems: (itemsArray) => {

      let payload = [];

      for (let i in itemsArray) {
         if (itemsArray[i].properties) {

            let properties = itemsArray[i].properties
            for (let j in properties) {
               // Move the parameters up one parent level
               if (properties[j].name == "Bundle") {
                  itemsArray[i].bundle = properties[j].value
               }
               if (properties[j].name == "Type") {
                  itemsArray[i].type = properties[j].value
               }
               if (properties[j].name == "prescription_type") {
                  itemsArray[i].prescription_type = properties[j].value
               }
            }
         } else if (itemsArray[i].sku == "128269" || itemsArray[i].name == "Gold Membership") {
            payload.push(
               {
                  package: itemsArray[i].name,
                  sku: itemsArray[i].sku
               })
         }
      }

      // Loop through and map Rx type and consolidate.
      for (let i in itemsArray) {
         for (let j in itemsArray) {
            if (itemsArray[i].bundle == itemsArray[j].bundle) {
               if (itemsArray[i].type == "Eyeglasses" || itemsArray[i].type == "Sunglasses") {
                  if (itemsArray[j].type == "Lens") {
                     let rxType = itemsArray[i].prescription_type;
                     let packageName = itemsArray[j].title;

                     // Make a module to fix this later on.
                     if (rxType == 'Single Vision' || rxType == 'With Power' || rxType == 'Frame with PC BLU Prescription Lenses' || rxType == '\r\n      Frame with Premium Anti glare Lenses\r\n       [Online Exclusive]' || rxType == 'Frame with Premium Anti glare Lenses') {
                        rxType = 'Single Vision'
                     }
                     if (rxType == 'Progressive / Bi-Focal' || rxType == 'Progresivo / Bi-Focal' || rxType == 'Bifocal/Progressive' || rxType == 'Progressive' || rxType == 'Bifocal / Progressive' || rxType == 'Progressive / Bifocal') {
                        rxType = 'Bifocal'
                     }
                     if (packageName == 'BLU Classic Super Thin' || packageName == 'Light Responsive' || packageName == 'Transitions' || packageName == 'BLU Classic Thin' || packageName == 'Anti Glare' || packageName == 'Anti Glare Thin' || packageName == 'BLU Classic Super Thin' || packageName == 'BLU Classic' || packageName == 'Tokai Blue Thinnest' || packageName == 'Tokai Blue' || packageName == 'Tokai Transitions') {
                        rxType = 'Single Vision'
                     }
                     if (packageName == 'Tokai Progressive Blue' || packageName == 'Tokai Progressive Transitions' || packageName == 'Premium Bifocal' || packageName == 'Progressive BLU Classic' || packageName == 'Progressive' || packageName == 'Progressive Light Responsive' || packageName == 'Bifocal Light Responsive') {
                        rxType = 'Bifocal'
                     }
                     if (packageName == "Zero power PC BLU Lenses"){
                        rxType = "Zero Power"
                     }

                     payload.push(
                        {
                           sku: itemsArray[i].sku,
                           prescription_type: rxType,
                           shopifyLensPackage: packageName
                        }
                     )
                  }
               }
            }
         }
      }

      console.log("Consolidated Line items: " + payload);
      return payload;
   }
}