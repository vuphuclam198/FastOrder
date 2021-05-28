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
        // getProduct: function () {
        //     console.log(this.search());
        // },

        getProduct: function () {
            var self = this;
            var serviceUrl = urlBuilder.build('order/index/search');
            var data = self.search();
            return storage.post(
                serviceUrl,
                JSON.stringify({'keyword': data}),
                false
            ).done(function (response) {
                    console.log(response);
                }
            ).fail(function (response) {
                // code khi fail
            });
        }

    });

}
);

