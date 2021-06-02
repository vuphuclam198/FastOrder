<?php

namespace AHT\FastOrder\Controller\Index;
 
class Search extends \Magento\Framework\App\Action\Action
{
    protected $json;
    protected $resultJsonFactory;
        /**
     * @param \Magento\Catalog\Model\ResourceModel\Product\CollectionFactory
     */
    private $collectionFactory;

    /**
     * @param \Magento\Catalog\Helper\Image
     */
    private $imageHelper;
    
    public function __construct(
        \Magento\Framework\App\Action\Context $context,
        \Magento\Framework\Serialize\Serializer\Json $json,
        \Magento\Framework\Controller\Result\JsonFactory $resultJsonFactory,
        \Magento\Catalog\Model\ResourceModel\Product\CollectionFactory $collectionFactory,
        \Magento\Catalog\Helper\Image $imageHelper

    )
    {
        $this->json = $json;
        $this->resultJsonFactory = $resultJsonFactory;
        $this->collectionFactory = $collectionFactory;
        $this->imageHelper = $imageHelper;
        parent::__construct($context);
    }
 
    public function execute()
    {
        $data = $this->getRequest()->getContent();

        $response = $this->json->unserialize($data);
        
        /** @var \Magento\Framework\Controller\Result\Json $resultJson */
        $resultJson = $this->resultJsonFactory->create();
        // var_dump($response) ;
        return $resultJson->setData($this->getProducts($response['keyword']));
    }

    public function getProducts($data) {
        $product= $this->collectionFactory->create();
        $product
        ->addAttributeToFilter('name',['like' => '%'.$data.'%'])
        ->addAttributeToSelect('*')
        ->setPageSize(3)
        ->setCurPage(1);
        // var_dump($product);
        foreach ($product as $value) {
            $value['src'] = $this->imageHelper
            ->init($value, 'product_base_image')
            ->getUrl();
        }

        return array_values($product->toArray());
    }
}