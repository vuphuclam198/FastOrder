define(['jquery', 
        'uiComponent', 
        'ko',
        'mage/url',
        'mage/storage',
        'Magento_Customer/js/customer-data'
    ], 
    function ($, Component, ko, urlBuilder, storage, customerData) {
    'use strict';

    return Component.extend({
        defaults: {
            template: 'AHT_FastOrder/order-knockout'
        },

        /** @inheritdoc */
        initialize: function () {
            this._super();
            return this;
        },

        search: ko.observable(),
        resultSearch: ko.observableArray([]),
        productList : ko.observableArray([]),
        total_product: ko.observable(),
        total_qty: ko.observable(),
        total_price: ko.observable(),
        // productListCheck: ko.observable(false),
        aas : ko.observable(),
        getProduct: function () {
            var self = this;
            var serviceUrl = urlBuilder.build('order/index/search');
            var data = self.search();
            return storage.post(
                serviceUrl,
                JSON.stringify({'keyword': data}),
                false
            ).done(function (response) {

                   var checked = response.forEach(element => {
                        element.productChecked = ko.observable();
                    });

                    self.resultSearch(response);
                    let exit;
                    self.resultSearch().map((data) => {
                        self.productList().map((data2) => {
                            if (data.entity_id == data2.entity_id) {
                                console.log("san pham ddax ton tai");
                                data.productChecked(true);
                            } 
                        });
                    });
                    self.changeChecked = (item) => { 
                        // item.productChecked = ko.observable();
                        item.exit = false;
                        console.log(item.exit);
                        if(item.exit == false && item.productChecked() == true) {
                            // số lượng sản phẩm mặc định
                            item.count = ko.observable(1);

                            item.increase = (item) => {
                                var currentValue = item.count();
                                return item.count(currentValue + 1);
                            }

                            item.decrease = (item) => {
                                var currentValue = item.count();
        
                                if (currentValue > 1) {
                                    return item.count(currentValue - 1);
                                }
                            }

                            item.checkked2 = () => {
                               return item.productChecked= ko.observable(false);
                            }

                            item.subtotal = ko.computed(() => {
                                return item.price * item.count();
                            });

                            item.removeItem = (item) => {
                                self.productList.remove(item);
                                item.productChecked(false);

                            }; 

                            self.total_product_computed = ko.computed(() => {
                                let lengths = self.productList().length;
                                self.total_product(lengths);
                            });

                            self.total_qty_computed = ko.computed(() => {
                                var total = 0;

                                self.productList().map((product) => {
                                    total = total + Number(product.count());
                                });

                                self.total_qty(total);
                            });

                            self.total_price_computed = ko.computed(() => {
                                var total = 0;
                                
                                self.productList().map((product) => {
                                    total = total + Number(product.subtotal());
                                });

                                self.total_price(total);
                            });

                            self.productList.push(item);
                            item.exit = true;
                        } else {
                            self.productList.remove(item);
                            item.exit = false;
                            // console.log('sản phẩm đã tồn tại');
                        }

                        console.log(item.productChecked());
                        console.log(item.exit);
                    };  
                }
            ).fail(function (response) {
                // code khi fail
                // console.log("không nhận được data");
                // self.resultSearch().map((data) => {
                //     if (item.entity_id == data.entity_id) {
                //         item.productChecked(false);
                //         console.log("đã xóa");
                //     }
                //     else {
                //         data['productChecked'] = ko.observable(false);
                //     }
                // });
            });
        },

        addtocart : function () {
            var self = this;
            var serviceUrl = urlBuilder.build('order/index/addtocart');
            var data = [];

            ko.utils.arrayFilter(self.productList(), function (product) {
                data.push({
                    'product': product.entity_id,
                    'qty' : product.count()
                })

            });
            console.log(data);

            var result = storage.post(
                serviceUrl,
                JSON.stringify(data),
                false
            ).done(
                function (response, status) {
                    if (status == 'success') {
                        alert('add cart success');
                        // location.reload();
                        self.productList([]);
                        self.resultSearch([]);
                        self.search('');
                        customerData.reload(['cart'], true);
                    }
                }
            ).fail(function () {
                alert('add cart fail');
            });
        },

        getProductCheked : (item) => {
            var getId = item.entity_id;
        },

    });

}
);

