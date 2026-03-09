import {Cashfree, CFEnvironment} from "cashfree-pg"

export const createCashfreeClient = (env:Env)=>{
  let client = new Cashfree(CFEnvironment.SANDBOX,env.CASHFREE_CLIENT_ID,env.CASHFREE_CLIENT_SECRET);
  return client
}
