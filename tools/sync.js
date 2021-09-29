const db = require('../config/db')
main()


async function main1(){
   let result = await db.query("DELETE FROM shopify_webhook_orders WHERE shopify_order_number=14067;")
   console.log(result)
}

async function main(){
   let result = await db.query("SELECT * FROM shopify_webhook_orders ORDER BY shopify_order_number DESC;");
   let arr = result.rows;
   console.log(result.rows.length)

   for (let i=0; i<arr.length-1; i++) {
      // console.log(arr[i].shopify_order_number)
      let interval = Number(arr[i].shopify_order_number)-(arr[i+1].shopify_order_number);
      if (interval>1){
         console.log(arr[i].shopify_order_number + " - " +  arr[i+1].shopify_order_number)
      }
   }
}
