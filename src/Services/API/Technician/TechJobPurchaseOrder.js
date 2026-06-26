import BaseApiService from "Services/BaseApiService";

class TechJobPurchaseOrder extends BaseApiService {

  static async GetJobPurchaseOrders(param_job) {
    const url = `/purchase_order/list`;
    return await super.POST(url, param_job);
  }

 static async GetSuppliers(param) {
    const url = `/supplier/list`;
    return await super.POST(url, param);
  }

static async GetProducts(param) {
    const url = `/product/list`;
    return await super.POST(url, param);
  }

static async CreatePurchaseOrder(param) {
    const url = `/purchase_order`;
    return await super.POST(url, param);
  }

  static async GetReeceBranches(param) {
    const url = `/inventory_integration/f_t/branches-reece`;
    return await super.POST(url, param);
  }
}








export default TechJobPurchaseOrder;
