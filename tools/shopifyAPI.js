const Shopify = require('shopify-api-node');

const shopify = new Shopify({
   shopName: 'lenskartae.myshopify.com',
   apiKey: '808a242c7254a2c4d341951617ee6103',
   password: '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'
});

shopify.product
   .get(
       4855638720592
   ).then((product) => {
       console.log(product.options);
}).catch((err) => {
       console.log(err)
   }
)