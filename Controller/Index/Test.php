<?php
namespace AHT\FastOrder\Controller\Index;

class Test extends \Magento\Framework\App\Action\Action
{
    /**
     * @var \Magento\Framework\View\Result\PageFactory
     */
    protected $_pageFactory;

    /**
     * @param \Magento\Customer\Model\ResourceModel\Customer\CollectionFactory
     */
    private $collectionFactory;

    /**
     * @param \Magento\Customer\Model\Session
     */
    private $_session;

    /**
     * @param \Magento\Catalog\Model\ResourceModel\ProductFactory
     */
    private $_productCollectionFactory;

    /**
     * @param \Magento\Sales\Model\OrderFactory
     */
    private $_orderFactory;

    /**
     * @param \Magento\Framework\App\Action\Context $context
     */
    public function __construct(
       \Magento\Framework\App\Action\Context $context,
       \Magento\Framework\View\Result\PageFactory $pageFactory,
        \Magento\Customer\Model\ResourceModel\Customer\CollectionFactory $collectionFactory,
        \Magento\Customer\Model\Session $session,
        \Magento\Catalog\Model\ProductFactory $productCollectionFactory,
        \Magento\Sales\Model\OrderFactory $orderFactory
    )
    {
        $this->_pageFactory = $pageFactory;
        $this->collectionFactory = $collectionFactory;
        $this->_session = $session;
        $this->_productCollectionFactory = $productCollectionFactory;
        $this->_orderFactory = $orderFactory;
        return parent::__construct($context);
    }
    /**
     * View page action
     *
     * @return \Magento\Framework\Controller\ResultInterface
     */
    public function execute()
    {
        // $user = $this->_session->getCustomer()->getId();
        // $customers = $this->_productCollectionFactory->create()->addAttributeToFilter('sale_agent_id', $user)->addAttributeToSelect('*');
        $order = $this->_orderFactory->create()->load(19);
        foreach ($order->getAllVisibleItems() as $key => $value) {
            $product2 = $this->_productCollectionFactory->create()->getCollection()
            ->addAttributeToFilter("entity_id", $value->getProductId())
            ->addAttributeToSelect('*')->load();
            foreach ($product2 as $item) {
                var_dump($item->getId());
            }
            // if(!($value->getCommissionType() =='') && !($value->getIsSalesAgent() =='') ) {

        //     echo "<pre>";
        //     $product = $this->_productCollectionFactory->create()->load($value->getId());
        //     var_dump($product->getId());
        }
        // var_dump($order->getAllItems());
        // foreach ($customers as $key => $value) {
        //     var_dump($value->getCommissionType());
        // }
        // var_dump($this->_session->getCustomer()->getId());
        // return $this->getAllOptions();
    }

    public function getAllOptions() 
    {
        $type = [];
        $type[] = [
                'value' => '',
                'label' => '--Select--'
            ];
        $customerFactory= $this->collectionFactory->create()->addAttributeToFilter('is_sales_agent', 1);

        foreach($customerFactory as $c)
        {
            $text = $c->getFirstname() .' ' .$c->getMiddlename().' ' .$c->getLastname();
            $type[] = [
                'value' => $c->getId(),
                'label' => $text
            ];
        }
       
        var_dump($type);
    }
    
}
