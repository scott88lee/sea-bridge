const axios = require('axios');

module.exports = {

  // Get session token from POS-API
  getSessionToken: async () => {
    console.log("Getting POS session token.");

    let head = {
      "Content-Type": "application/json",
      "X-Lenskart-API-Key": process.env.LENSKART_API_KEY,
      "X-Lenskart-App-Id": process.env.LENSKART_APP_ID
    }

    let body = {
      "isEncodingRequired": false,
      userName: process.env.POSAUTH_USERNAME,
      password: process.env.POSAUTH_PASSWORD
    }

    let config = {
      method: "post",
      url: process.env.POSAPI_URL + "/auth",
      headers: head,
      data: body
    }

    try {
      let response = await axios(config)
      console.log("POS session token: " + response.data.sessionToken);

      //next feature, cache the token.
      return response.data
    }
    catch (err) {
      console.log("Error: " + err)
      return false;
    }
  },

  getProductDetail: async (POStoken, sku) => {
    let URL = process.env.POSAPI_URL + '/products?q=' + req.sku;

    let head = {
      'X-Lenskart-Session-Token': POStoken,
      'X-Lenskart-Distinct-Id': process.env.POS_DISTINCT_ID,
      "x-lenskart-api-key": process.env.LENSKART_API_KEY,
      "x-lenskart-app-id": process.env.LENSKART_APP_ID
    }

    try {
      let response = await axios.get(URL, { headers: head });
      if (response) {
        let payload = {};

        payload.storeQty = response.data.products[0].storeQty
        payload.webQty = response.data.products[0].wareHouseQty
        payload.frameType = encodeURIComponent(response.data.products[0].c2c_frametype_value)
        payload.classificationId = response.data.products[0].c2c_classification

        return payload;
      }
    } catch (err) {
      console.log("POS>getProductDetail Error: " + err)
      return false;
    }
  },

  getPackageDetail: async (JSONBody) => {
    let result = {}

    let classificationId = JSONBody.classificationId;
    let prescriptionType = JSONBody.prescriptionType;
    let frameType = JSONBody.frameType;
    let storeQty = JSONBody.storeQty;
    let webQty = JSONBody.webQty;
    let sku = JSONBody.sku;
    let POSToken = JSONBody.POSToken

    let url = process.env.POS_PACKAGE_URL + 'product/' + sku + '/packages?audience_type=high_end&buffer_applied=false&classification_id=' + classificationId + '&frame_type=' + frameType + '&is_express=false&is_true_last_piece=false&power_type=' + prescriptionType + '&store_qty=' + storeQty + '&web_qty=' + webQty;

    let head = {
      'X-Lenskart-Session-Token': POSToken,
      'X-Lenskart-Distinct-Id': process.env.POS_DISTINCT_ID,
      "x-lenskart-api-key": process.env.LENSKART_API_KEY,
      "x-lenskart-app-id": process.env.LENSKART_APP_ID,
      "X-Country-Code": process.env.POS_ORDER_COUNTRY
    }

    let response = axios.get(url, { headers: head })
    result.packagesArray = response.data.result.packages;
  },

  PackageMapping: (JSONBody) => {
    var result = {}
    var packageArray = JSONBody.packageArray;
    var customerPackage = JSONBody.customerPackage;
    
    for (let value of packageArray) {
      //console.log('Inside for loop of map package pos');
      if (value.name == 'Thin Anti-Glare_sg' && customerPackage == 'Anti Glare' && (value.id == '60f5981d139df54fcc096501' || value.id == '60f5a4d6139df54fcc09660b' || value.id == '60f5a4cdc42cf4529837738d' || value.id == '60f598c752e9807d0861adad')) {
        if (result.packageId == '') {
          console.log('inside match');
          console.log('Package id got:', value.id)
          result.packageId = value.id;
          result.coating = '';
        }
      } else if (value.name == 'Transition_SG' && customerPackage == 'Transitions' && (value.id == '60f5a435139df54fcc0965f8' || value.id == '60f5a42694525402997e0e14')) {
        if (result.packageId == '') {
          result.packageId = value.id;
          result.coating = '';
        }
      } else if (value.name == 'Photochromatic Pack_SG' && customerPackage == 'Light Responsive' && (value.id == '60f59d9daec0851715fa6d37' || value.id == '60f637c14973e109fa1133ab' || value.id == '60f59df4fa57ee6eb5c305c8' || value.id == '60f6381452e9807d0861b325')) {
        if (result.packageId == '') {
          result.packageId = value.id;
          result.coating = '';
        }
      } else if (value.name == 'Photochromatic Pack HR_SG' && customerPackage == 'Light Responsive' && (value.id == '60f59dd0a467f40a8b34e5c1' || value.id == '60f637e8c42cf45298377821')) {
        if (result.packageId == '') {
          result.packageId = value.id;
          result.coating = '';
        }
      } else if (value.name == 'Transition HR_SG' && customerPackage == 'Transitions' && value.id == '60f5a43094525402997e0e17') {
        if (result.packageId == '') {
          result.packageId = value.id;
          result.coating = '';
        }
      } else if (value.name == 'Best-Seller: Thin Lens with Blu-Ray block & all coatings_sg' && customerPackage == 'BLU Classic Thin' && (value.id == '60f59a3fa467f40a8b34e56f' || value.id == '60f636d28a760918bf5c13e5' || value.id == '60f59a44aec0851715fa6cec' || value.id == '60f6377c52e9807d0861b320')) {
        if (result.packageId == '') {
          result.packageId = value.id;
          result.coating = '';
        }
      } else if (value.name == 'Best-Seller: Thin Lens with Blu-Ray block & all coatings HR_sg' && customerPackage == 'BLU Classic Thin' && (value.id == '60f59a41139df54fcc096535' || value.id == '60f637124973e109fa1133a3')) {
        if (result.packageId == '') {
          result.packageId = value.id;
          result.coating = '';
        }
      } else if (value.name == 'Thin Anti-Glare_sg' && customerPackage == 'Anti Glare' && (value.id == '60f5981d139df54fcc096501' || value.id == '60f5a4d6139df54fcc09660b' || value.id == '60f5a4cdc42cf4529837738d' || value.id == '60f598c752e9807d0861adad')) {
        if (result.packageId == '') {
          result.packageId = value.id;
          result.coating = '';
        }
      } else if (value.name == 'Thin Anti-Glare HR_sg' && customerPackage == 'Anti Glare' && (value.id == '60f5987652e9807d0861ada3' || value.id == '60f5a4d1139df54fcc096608')) {
        if (result.packageId == '') {
          result.packageId = value.id;
          result.coating = '';
        }
      } else if (value.name == 'Thin Premium Anti-Glare_sg' && customerPackage == 'Anti Glare Thin' && (value.id == '60f59986fa57ee6eb5c30562' || value.id == '60f59a3fc42cf452983772a1')) {
        if (result.packageId == '') {
          result.packageId = value.id;
          result.coating = '';
        }
      } else if (value.name == 'Thin Premium Anti-Glare HR_sg' && customerPackage == 'Anti Glare Thin' && value.id == '60f599afaec0851715fa6cdb') {
        if (result.packageId == '') {
          result.packageId = value.id;
          result.coating = '';
        }
      } else if (value.name == 'Blu Super Thin_SG' && customerPackage == 'BLU Classic Super Thin' && (value.id == '60f59c7a139df54fcc096561' || value.id == '60f59d53aec0851715fa6d30')) {
        if (result.packageId == '') {
          result.packageId = value.id;
          result.coating = '';
        }
      } else if (value.name == 'Blu Super Thin HR_SG' && customerPackage == 'BLU Classic Super Thin' && value.id == '60f59ccbc42cf452983772da') {
        if (result.packageId == '') {
          result.packageId = value.id;
          result.coating = '';
        }
      } else if (value.name == 'Blu Essential HR_SG' && customerPackage == 'BLU Classic' && (value.id == '60f5985f8a760918bf5c0ec1' || value.id == '60f6366752e9807d0861b317')) {
        if (result.packageId == '') {
          result.packageId = value.id;
          result.coating = '';
        }
      } else if (value.name == 'Blu Essential_SG' && customerPackage == 'BLU Classic' && (value.id == '60f5985ac42cf45298377278' || value.id == '60f6361ea467f40a8b34ead8' || value.id == '60f59867fa57ee6eb5c30548' || value.id == '60f6368852e9807d0861b31a')) {
        if (result.packageId == '') {
          result.packageId = value.id;
          result.coating = '';
        }
      } else if (value.name == 'Tokai_SG' && customerPackage == 'Tokai Blue Thinnest') {
        if (result.packageId == '') {
          result.packageId = value.id;
          result.coating = '609ebb570177493cb42f47c3'
        }
      } else if (value.name == 'Tokai_HR_SG' && customerPackage == 'Tokai Blue Thinnest') {
        if (result.packageId == '') {
          result.packageId = value.id;
          result.coating = '609ebb570177493cb42f47c3'
        }
      } else if (value.name == 'Tokai_SG' && customerPackage == 'Tokai Blue') {
        if (result.packageId == '') {
          result.packageId = value.id;
          result.coating = '';
        }
      } else if (value.name == 'Tokai_SG' && customerPackage == 'Tokai Transitions') {
        if (result.packageId == '') {
          result.packageId = value.id;
          result.coating = '609ebb570177493cb42f47c2'
        }
      } else if (value.name == 'Tokai_HR_SG' && customerPackage == 'Tokai Transitions') {
        if (result.packageId == '') {
          result.packageId = value.id;
          result.coating = '609ebb570177493cb42f47c2'
        }
      } else if (value.name == 'Tokai Progressive_SG' && customerPackage == 'Tokai Progressive Blue') {
        if (result.packageId == '') {
          result.packageId = value.id;
          result.coating = '';
        }
      } else if (value.name == 'Tokai Progressive_HR_SG' && customerPackage == 'Tokai Progressive Blue') {
        if (result.packageId == '') {
          result.packageId = value.id;
          result.coating = '';
        }
      } else if (value.name == 'Tokai Progressive_SG' && customerPackage == 'Tokai Progressive Transitions') {
        if (result.packageId == '') {
          result.packageId = value.id;
          result.coating = '609ebb570177493cb42f47c2'
        }
      } else if (value.name == 'Tokai Progressive_HR_SG' && customerPackage == 'Tokai Progressive Transitions') {
        if (result.packageId == '') {
          result.packageId = value.id;
          result.coating = '609ebb570177493cb42f47c2'
        }
      } else if (value.name == 'Premium Bi-Focal Lens (Circular/KT)_sg' && customerPackage == 'Premium Bifocal') {
        if (result.packageId == '') {
          result.packageId = value.id;
          result.coating = '';
        }
      } else if (value.name == 'Normal Corridor Progressive_sg' && customerPackage == 'Progressive BLU Classic') {
        if (result.packageId == '') {
          result.packageId = value.id;
          result.coating = '5c681d9dcf9c4079d6327269'
        }
      } else if (value.name == 'Normal Corridor Progressive_sg' && customerPackage == 'Progressive') {
        if (result.packageId == '') {
          result.packageId = value.id;
          result.coating = '';
        }
      } else if (value.name == 'Normal Corridor Progressive_sg' && customerPackage == 'Progressive Light Responsive') {
        if (result.packageId == '') {
          result.packageId = value.id;
          result.coating = '5c681d9dcf9c4079d6327268';
        }
      } else if (value.name == 'Premium Bi-Focal Lens (Circular/KT)_sg' && customerPackage == 'Bifocal Light Responsive') {
        if (result.packageId == '') {
          result.packageId = value.id;
          result.coating = '5c681d9dcf9c4079d6327268';
        }
      }
    }
    return result;
  },
}
