class BillModel {
    constructor() {
      this.items = [];
      this.total = 0.00;
    }
  
    addItem(item) {
      this.items.push(item);
      this.total += item.price;
    }
  
    getTotal() {
      return this.total.toFixed(2);
    }
  
    getItems() {
      return this.items;
    }
  }
  
  export default BillModel;
  