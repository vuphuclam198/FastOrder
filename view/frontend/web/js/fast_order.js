define(['jquery', 
        'uiComponent', 
        'ko',
        'mage/url',
        'mage/storage',
    ], 
    function ($, Component, ko, urlBuilder, storage) {
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
        // productChecked: ko.observable(),
        resultSearch: ko.observableArray([]),
        productList : ko.observableArray([]),
        // count : ko.observable(1),

        getProduct: function () {
            var self = this;
            var serviceUrl = urlBuilder.build('order/index/search');
            var data = self.search();
            return storage.post(
                serviceUrl,
                JSON.stringify({'keyword': data}),
                false
            ).done(function (response) {
                    self.resultSearch(response);
                    self.changeChecked = (item) => { 
                        if(self.productChecked == true ) {
                            // số lượng sản phẩm mặc định
                            item.count = ko.observable(1);

                            item.increase = () => {
                                var currentValue = item.count();
                                return item.count(currentValue + 1);
                            }

                            item.decrease = () => {
                                var currentValue = item.count();
        
                                if (currentValue > 1) {
                                    return item.count(currentValue - 1);
                                }
                            }

                            item.subtotal = ko.computed(() => {
                                return item.price * item.count();
                            });
                            
                            self.productList.push(item);
                        } else {
                            console.log("sản phẩm chưa được chọn");
                        }

        
                        // self.productList.forEach(element => {
                        //     element.count = ko.observable(1);
                        //     element.increase(self.count()) =  () => {
                                
                        //         var currentValue = self.count();
                        //         return element.count(currentValue + 1);
                        //     }
                        // });

                        // console.log(item);

        


                    };  

                    // self.increase = () => {
                    //     var currentValue = self.count();
                    //     return self.count(currentValue + 1);
                    // }


                }
            ).fail(function (response) {
                // code khi fail
            });
        },
        
        getProductCheked : (item) => {
            var getId = item.entity_id;

        },

        product : function() {
            self.product_list = ko.observableArray([]);
        }, 

    });

}

);

