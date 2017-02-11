<?php
/**
 * Created by PhpStorm.
 * User: charles.jia
 * Date: 2016-11-23
 * Time: 18:30
 */
namespace Dist\Model;
use Common;

class MeiciModel extends \Common\Model\CommonModel
{
    private $spuModel;
    private $skuModel;
    private $imgModel;
    private $logModel;
    private $barcodeModel;
    /**
     * 提交待审核状态,未审核
     */
    const SKU_GOTO_MEICI_STATUS = 1;
    /**
     * 已上架
     */
    const MEICI_STATUS_PUT_ON = 2;
    /**
     * 已下架
     */
    const MEICI_STATUS_PUT_OFF = 3;
    /**
     * 未请求meici的api审核
     */
    const SKU_NOTGO_MEICI_STATUS =1;

    /**
     * 添加商品
     */
    const SKU_ADD_MEICI_API_PRODUCT =1;



    public function _initialize()
    {
        $this->tableName = 'lv_info_product_sku';
        $this->spuModel = M('lv_info_product_spu');
        $this->skuModel = M('lv_info_product_sku');
        $this->imgModel = M('lv_info_product_img');
        $this->logModel = M('lv_meici_api_logs');
        $this->barcodeModel = M('lv_info_wms_barcode');
        //$this->skuModel = M('lv_info_product_sku');
      }

    /**
     * @param string $spu
     * @return mixed
     */
    public function getSpuData($spu = ''){
        $where['id'] = array('in',$spu);
        if(empty($spu)){
            $data =  $this->spuModel->order('id desc')->select();
        }else{
            $data =  $this->spuModel->where($where)->order('id desc')->select();
        }
        return $data;

    }

    /**
     * @param string $sku
     * @return mixed
     */
    public function getSkuData($data = array()){
        $pagesize = intval($data['pagesize']);
        $page =  intval($data['page']) * $pagesize  - $pagesize;
        if($data != '' ){
            $data =  $this->skuModel->where($data)->order('id desc')->limit($page,$pagesize)->select();
        }else{
            $data =  $this->skuModel->order('id desc')->select();
        }
        log_message('getSkuData:' .$this->skuModel->getlastsql());
        return $data;

    }

    /**
     * 得到相关数量
     * @param $data
     * @return mixed
     */
    public function getSkuDataCount($data)
    {
        $total = $this->skuModel->where($data)->count();
        return  $total;
    }

    /**
     * 得到一些信息
     * @param $spu_ids
     * @return mixed
     */
    public function getSpuInfo($spu_id){
        $where['id']  = array('in',$spu_id);
        $data =  $this->spuModel->field('meici_spu as spu,id,item_number,material,brand_id,category_id,country_id,years,season,fit_person,name,series,external,internal')->where($where)->select();
        log_message('getSpuInfo:' .$this->spuModel->getlastsql());
        return  $data;
    }

    /**
     * 得到状态为1提交审核的数据
     * @param $spu_id
     * @return mixed
     */
    public function getNoAuditedSku($sku_id,$bill_type){
        $where['id'] =  $sku_id;
        $where['status'] =  self::SKU_NOTGO_MEICI_STATUS;
        if($bill_type == 1){
            $data =  $this->skuModel->field('spu,id as lv_sku,product_code,color_id,size_id,quantity,cost_price,public_price,imgs as images')->where($where)->select();
        }else{
            $data =  $this->skuModel->field('spu,id as lv_sku,product_code,color_id,size_id,quantity,price,public_price,imgs as images')->where($where)->select();
        }
        log_message('getNoAuditedSku:' . $this->skuModel->getlastsql());
        return $data;
    }

    /**
     * 得到商品图片
     * @param $skuId
     * @param $spu
     * @return string
     */
    public function getSkuImg($skuId,$spu){
        $where['sku'] =   $skuId;
        $where['spu'] =   $spu;
        $data = $this->imgModel->field('url')->where($where)->order('list_sort')->select();
        foreach($data as $v){
          $str .=  $v['url'] . ';';
        }
        $str = rtrim($str,';');
        return $str;
    }

    /**
     * 改变sku提交后的状态
     * @param $skuId
     * @return mixed
     */
    public function changeSkuGoToMeiciStaus($sku,$meici_sku,$meici_spu){
        $data['meici_status']  = self::SKU_GOTO_MEICI_STATUS;
        $data['meici_sku']  = $meici_sku;
        $data['meici_spu']  = $meici_spu;
        $where['id'] = $sku;
        $msg = $this->skuModel->where($where)->save($data);
        //保存成功之后，将barcode里面的meici_sku修改
        return $msg;
    }

    /**
     * 改变sku提交后的状态
     * @param $skuId
     * @return mixed
     */
    public function changeSpuGoToMeiciStaus($supplier_id,$item_number,$meici_spu){
        $data['meici_spu'] = $meici_spu;
        $where['item_number'] = $item_number;
        $where['supplier_id'] = $supplier_id;
        $msg = $this->spuModel->where($where)->save($data);
        //log_message('changeSpuGoToMeiciStaus:' . $this->getlastsql());
        return $msg;
    }



    /**
     * 记录日志
     * @param $log
     * @return mixed
     */
    public function  saveMeiciLog($log){
        $log['operate_type'] = self::SKU_ADD_MEICI_API_PRODUCT;
        $log['operate_time'] = time();
        $data =  $this->logModel->add($log);
        return  $data;
    }

    /**
     * 得到图片信息
     * @param $post
     * @return mixed
     */
    public function imgLists($post)
    {
        if(isset($post)){
            $image_list = $this->imgModel->where("spu='" . $post['id'] . "'")->select();
        }else{
            $image_list = $this->imgModel->select();
        }
        return $image_list;
    }

    /**
     * 得到相关状态
     * @param $id
     * @return mixed
     */
    public function getMeiciIdData($id){
        $where['id'] = $id;
        $data = $this->skuModel->field('spu,meici_sku,quantity,size_id,price,cost_price')->where($where)->select();
        log_message('getMeiciId:'. $this->skuModel->getlastsql());
        return $data;
    }

    public function saveSkuData($data){
        $where['meici_sku'] = $data['id'];
        if(isset($data['new_price']) && $data['new_price']){
            $r['new_price'] = $data['new_price'];
        }
        if(isset($data['new_cost_price']) && $data['new_cost_price']){
            $r['new_cost_price'] = $data['new_cost_price'];
        }
        if(isset($data['quantity']) && $data['quantity']){
            $r['quantity'] = $data['quantity'];
        }
        if(isset($data['meici_status']) && $data['meici_status']){
            $r['meici_status'] = $data['meici_status'];
        }

        $data = $this->skuModel->where($where)->save($r);
        log_message('sql:'. $this->skuModel->getlastsql());
        return $data;
    }

    /**
     * @param $sku
     * @return mixed
     */
    public function getSkuSizeId($sku){
        $where['id'] = $sku;
        $data = $this->skuModel->field('size_id')->where($where)->select();
        log_message('getSkuSizeId:'. $this->skuModel->getlastsql());
        return $data;

    }


    public function getBarcodeData($sku){
        $where['sku'] = $sku;
        $data = $this->barcodeModel->field('id,serial_no')->where($where)->order('serial_no asc')->select();
        //log_message('getBarcodeData:'. $this->skuModel->getlastsql());
        return $data;

    }

    public function saveBarcodeData($data){
        $where['id'] = $data['id'];
        $where['sku'] = $data['sku'];

        $r['meici_sku'] =$data['meici_sku'];
        $r['meici_barcode'] =$data['meici_barcode'];

        $data = $this->barcodeModel->where($where)->save($r);
        //log_message('saveBarcodeData:'. $this->barcodeModel->getlastsql());
        return $data;

    }

    public function list4dialog($data){

        $data = $this->skuModel->where($data)->select();
        return $data;
    }

}