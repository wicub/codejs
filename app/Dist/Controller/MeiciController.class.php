<?php
/**
 * @Author: 
 * @Date:   2016-11-07 10:52:22
 * 对接美西平台
 */

namespace Dist\Controller;

class MeiciController extends \Controller\BaseController
{         private $field_sel = array( //此验证规则用于查询
    'sku'               =>array('name'=>'商品SKU',           '_validate'=>'allowEmpty|isIntIds|maxLength:2048'),
    'spu'               =>array('name'=>'商品SPU',           '_validate'=>'allowEmpty|isIntIds|maxLength:2048'),
    'supplier_id'       =>array('name'=>'供应商ID',          '_validate'=>'allowEmpty|isIntId|maxLength:11'),
    'item_number'       =>array('name'=>'原厂货号',          '_validate'=>'allowEmpty|maxLength:60'),
    'name'              =>array('name'=>'商品名称',          '_validate'=>'allowEmpty|maxLength:90'),
    'brand_id'          =>array('name'=>'品牌ID',            '_validate'=>'allowEmpty|isIntId|maxLength:8'),
    'category_id'       =>array('name'=>'品类ID',            '_validate'=>'allowEmpty|isIntId|maxLength:8'),
    'category_ids'      =>array('name'=>'品类IDS',           '_validate'=>'allowEmpty|isIntIds|maxLength:60'),
    'color_id'          =>array('name'=>'颜色字典ID',        '_validate'=>'allowEmpty|isIntId|maxLength:5'),
    'fit_person'        =>array('name'=>'适用人群',          '_validate'=>'allowEmpty|numeric|maxLength:3'),
    'price_section'     =>array('name'=>'价格区间',          '_validate'=>'allowEmpty|isIntIds'),
    'is_cbs'            =>array('name'=>'境外商品',          '_validate'=>'unsetEmpty|numeric|maxLength:1'),
    'status'            =>array('name'=>'上架状态',          '_validate'=>'unsetEmpty|numeric|maxLength:1'),
    'is_bargains'      =>array('name'=>'活动商品',          '_validate'=>'unsetEmpty|numeric|maxLength:1'),
    'apply_by'          =>array('name'=>'申请人uid',         '_validate'=>'allowEmpty|isIntId|maxLength:11'),
    'start_time'        =>array('name'=>'提交申请开始时间',  '_validate'=>'allowEmpty|maxLength:22'),
    'end_time'          =>array('name'=>'提交申请结束时间',  '_validate'=>'allowEmpty|maxLength:50'),
    'export'            =>array('name'=>'导出',               '_validate'=>'allowEmpty|maxLength:1'),

    'sort_field'        =>array('name'=>'排序字段',      '_validate'=>'default:id|isFields'),
    'sort_order'        =>array('name'=>'排序顺序',      '_validate'=>'default:desc|isLetter'),
    'page'              =>array('name'=>'页码',              '_validate'=>'default:1|isUnsignedInt'),
    'pagesize'          =>array('name'=>'每页条数',          '_validate'=>'default:20|isUnsignedInt'),
    'list_index'    =>array('name'=>'列表索引键字段',      '_validate'=>'fixed:id'),
);


    private $field_up=array( //编辑参数验证规则
        'id'                =>array('name'=>'商品SKU',           '_validate'=>'require|isIntId|maxLength:20'),
        'supplier_id'       =>array('name'=>'供应商ID',          '_validate'=>'unsetEmpty|isIntId|maxLength:11'),
        'item_number'       =>array('name'=>'原厂货号',          '_validate'=>'unsetEmpty|maxLength:60'),
        'brand_id'          =>array('name'=>'品牌ID',            '_validate'=>'unsetEmpty|isIntId|maxLength:5'),
        'category_id'       =>array('name'=>'品类ID',            '_validate'=>'unsetEmpty|isIntId|maxLength:5'),
        'country_id'       =>array('name'=>'产地（国家）',      '_validate'=>'unsetEmpty|maxLength:10'),
        'years'             =>array('name'=>'年份',               '_validate'=>'unsetEmpty|isIntId|maxLength:4'),
        'season'            =>array('name'=>'季节',                '_validate'=>'unsetEmpty|isIntId|maxLength:1'),
        'fit_person'        =>array('name'=>'适用人群',          '_validate'=>'unsetEmpty|numeric|maxLength:3'),
        'sku_num'           =>array('name'=>'SKU数',            '_validate'=>'unsetEmpty|numeric|maxLength:5'),
        'is_cbs'            =>array('name'=>'境外商品',          '_validate'=>'unsetEmpty|numeric|maxLength:1'),
        'hs_code'           =>array('name'=>'海关编码',          '_validate'=>'unsetEmpty|maxLength:20'),
        'name'              =>array('name'=>'商品名称',            '_validate'=>'unsetEmpty|maxLength:255'),
        'series'            =>array('name'=>'系列',               '_validate'=>'unsetEmpty|maxLength:30'),
        'external'          =>array('name'=>'商品外部',          '_validate'=>'unsetEmpty|maxLength:600'),
        'internal'         =>array('name'=>'商品内部',            '_validate'=>'unsetEmpty|maxLength:600'),
        'brief'             =>array('name'=>'商品简述',          '_validate'=>'unsetEmpty|maxLength:255'),
        'discription'      =>array('name'=>'商品描述',          '_validate'=>'unsetEmpty'),
        'ext'               =>array('name'=>'私有属性',           '_validate'=>'unsetEmpty|isArray'),
        'labels'            => array('name'=>'标签名',           '_validate'=> 'unsetEmpty|isArray'),
    );

    private $field_checkinfo = array(//商品审核
        'spu'                =>array('name'=>'商品SPU',       '_validate'=>'require|isIntId|maxLength:20'),
        'pass'               =>array('name'=>'审核状况',      '_validate'=>'require|isIntId|maxLength:1'),
        'reject_reason'     =>array('name'=>'未通过原因',    '_validate'=>'require_if:pass:eq:0|maxLength:600'),
    );

    private $field_checkimg = array(//商品审核
        'spu'                =>array('name'=>'商品SPU',       '_validate'=>'require|isIntId|maxLength:20'),
        'checkImg'          =>array('name'=>'审核状况',       '_validate'=>'isArray'),
        'pass'               =>array('name'=>'审核状况',      '_validate'=>'require|isIntId|maxLength:1'),
        'reject_reason'     =>array('name'=>'未通过原因',    '_validate'=>'require_if:pass:eq:0|maxLength:600'),
    );

    private $field_batcheck = array(//商品批量审核
        'ids'              =>array('name'=>'商品SPU',       '_validate'=>'require|isIntIds|maxLength:2048'),
    );

    private $field_editimg = array(//商品审核
        'spu'                =>array('name'=>'商品SPU',       '_validate'=>'require|isIntId|maxLength:20'),
        'editImg'           =>array('name'=>'图片',           '_validate'=>'require|isArray'),
    );
    private $field_apply_list = array(
        'name'              =>array('name'=>'商品名称',           '_validate'=>'allowEmpty|isName|maxLength:60'),
        'spu'               =>array('name'=>'商品SPU',           '_validate'=>'allowEmpty|isIntIds|maxLength:2048'),
        'supplier_id'       =>array('name'=>'供应商ID',          '_validate'=>'allowEmpty|isIntId|maxLength:11'),
        'brand_id'          =>array('name'=>'品牌ID',            '_validate'=>'allowEmpty|isIntId|maxLength:5'),
        'category_id'       =>array('name'=>'品类ID',            '_validate'=>'allowEmpty|isIntId|maxLength:5'),
        'unaudit_type'      =>array('name'=>'待审类型',         '_validate'=>'allowEmpty|isIntId|maxLength:1'),
        'start_date'        =>array('name'=>'提交申请开始日期',  '_validate'=>'allowEmpty|isDate|maxLength:20'),
        'end_date'          =>array('name'=>'提交申请结束日期',  '_validate'=>'allowEmpty|isDate|maxLength:20'),

        'fields'            =>array('name'=>'字段',              '_validate'=>'default:*|isFields'),
        'sort_field'        =>array('name'=>'排序字段',          '_validate'=>'default:apply_time|isFields'),
        'sort_order'        =>array('name'=>'排序方式',          '_validate'=>'default:desc|isLetter'),
        'page'              =>array('name'=>'页码',              '_validate'=>'default:1|isUnsignedInt'),
        'pagesize'          =>array('name'=>'每页条数',          '_validate'=>'default:20|isUnsignedInt'),
        'show_all'          =>array('name'=>'全部显示',          '_validate'=>'default:0|isInt'),
        'list_index'        =>array('name'=>'列表索引键字段',  '_validate'=>'default:|isFields'),
        'cache_expire'      =>array('name'=>'缓存时间',  '_validate'=>'default:3600|isInt'),
        'status'             =>array('name'=>'缓存时间',  '_validate'=>'allowEmpty'),
        'meici_status'      =>array('name'=>'缓存时间',   '_validate'=>'allowEmpty'),
        'item_number'      =>array('name'=>'缓存时间',   '_validate'=>'allowEmpty'),
        'meici_sku'      =>array('name'=>'缓存时间',   '_validate'=>'allowEmpty'),
        'meici_spu'      =>array('name'=>'缓存时间',   '_validate'=>'allowEmpty'),
        'product_code'      =>array('name'=>'缓存时间',   '_validate'=>'allowEmpty'),
        'other_meici_status'      =>array('name'=>'缓存时间',   '_validate'=>'allowEmpty'),
        'params'      =>array('name'=>'缓存时间',   '_validate'=>'allowEmpty'),
    );
    private $field_status=array( //审核
        'ids'                =>array('name'=>'商品SKU',          '_validate'=>'require|isIntIds|maxLength:2048'),
        'status'            =>array('name'=>'审核状态',          '_validate'=>'require|isInt|maxLength:1'),
    );

    function _filter($data){
        if(isset($data['sort_field']) && $data['sort_field']){
            $where['sort_by'] = $data['sort_field'].''. ($data['sort_order']=='asc'?'asc':'desc');
        }
        isset($data['page'])       && $where['page']     = $data['page'];
        isset($data['pagesize'])   && $where['pagesize'] = $data['pagesize'];
        if(isset($data['product_code']) && $data['product_code']){
            $where['product_code'] = $data['product_code'];
        }
        if(isset($data['item_number']) && $data['item_number']){
            $where['item_number'] = $data['item_number'];
        }
        if(isset($data['meici_sku']) && $data['meici_sku']){
            $where['meici_sku'] = $data['meici_sku'];
        }
        if(isset($data['meici_spu']) && $data['meici_spu']){
            $where['meici_spu'] = $data['meici_spu'];
        }
        if(isset($data['category_id']) && $data['category_id']){
            $where[] = 'FIND_IN_SET('.$data['category_id']. ',category_ids)';
            //$where['category_id'] = $data['category_id'];
        }
        if(isset($data['brand_id']) && $data['brand_id']){
            $where['brand_id'] = $data['brand_id'];
        }

        if(isset($data['status']) && $data['status']){
            $where['status'] = $data['status'];
        }
        if(isset($data['meici_status']) && $data['meici_status'] && !isset($data['other_meici_status'])){
            if($data['meici_status'] == 9){
                $where['meici_status'] = 0;
            }else{
                $where['meici_status'] = $data['meici_status'];
            }
        }
        if(isset($data['spu']) && $data['spu']){
            $where['spu'] = $data['spu'];
        }
        if(isset($data['other_meici_status']) && $data['other_meici_status']){
            $where['_string'] = 'meici_status='.$data['meici_status'] . ' OR meici_status=' . $data['other_meici_status'];
        }
        return $where;
    }




    public $meiciModel;

    public function _initialize()
    {
        $this->meiciModel = D('Meici');
    }

    //
    public function index() {
        $supplier = $this->meiciModel->supplier();
        $categorys = $this->meiciModel->Category($supplier);
         //品牌
        $brands = $this->meiciModel->brand($supplier);

        $this->assign('categorys', $categorys);
        $this->assign('suppliers', $suppliers);
        $this->assign('brands', $brands);

        $this->display();
    }

    /**
     * 列表
     */
    public function lists() {
        $r = \Org\Util\Validate::validParams($_POST,$this->field_apply_list);
        if($r!==true) {
            $this->assign('errMsg',$r);
        }
        else {
            //log_message('POST:' .json_encode($_POST));
            if(isset($_POST['params']) && $_POST['params']){
                $meiciStatus =  $_POST['params'];
            }
            $color= $this->meiciModel->color();
            $colors = $this->toAssocArr($color);
            $size=$this->meiciModel->size();
            $sizes = $this->toAssocArr($size);
            $brand = $this->meiciModel->brand();
            $brands = $this->toAssocArr($brand);
            $category = $this->meiciModel->Categories();
            $categorys = $this->toAssocArr($category);

            $r = $this->getDataRow($_POST,'spu');
            $rows  = empty($r) ? array() : $r;
            $bill_type = $this->getSupplierInfo('bill_type');
            //log_message('$r:'.json_encode($rows));
            $pagenation['page'] = $_POST['page'];
            $pagenation['pagesize'] = $_POST['pagesize'];
            $pagenation['sort_by'] = $_POST['sort_by'];
            $pagenation['total'] = $rows['skuListCount'];
            unset($rows['skuListCount']);
            $pagenation['page_total'] = ceil($pagenation['total']/$pagenation['pagesize']);
            //log_message('$pagenation:' . json_encode($pagenation));



            $this->assign('bill_type', $bill_type);
            $this->assign('pagenation',     $pagenation);
            $this->assign('spuList',$rows);
            $this->assign('status',$_POST['status']);
            $this->assign('params',$_POST['params']);
            $this->assign('meiciStatus',$meiciStatus);
            $this->assign('sizes',      $sizes);
            $this->assign('brands',     $brands);
            $this->assign('categorys',     $categorys);
            $this->assign('colors',     $colors);

        }
        $this->display();
    }

    /**
     * 得到相关的信息
     * @param $data
     * @param string $str
     * @return bool
     */
    public function getDataRow($data,$str = '1'){
        //1、先查询sku，然后在得到spu的相关信息
        if (method_exists($this, '_filter')) {
            $map =   $this->_filter($data);
        }
        if(empty($map)){
            return false;
        }
        $map['supplier_id'] = $this->getSupplierInfo('supplier_id');
        //log_message('$map:' . json_encode($map));
        $skuList = $this->meiciModel->getSkuData($map);
        $skuListCount =  $this->meiciModel->getSkuDataCount($map);
        //log_message('$skuList:' .json_encode($skuList));
        if($skuList == NULL){
            return false;
        }
        //组装img
        foreach($skuList as $k=>$val){
            $imgs = explode(';',$val['imgs']);
            $skuList[$k]['imgs']  = $imgs[0];
        }

        $sku = $this->toAssocArr($skuList,$index = 'spu,id');
        /*if($str == 'skuAttr'){
            return $skuList;
        }*/
        $data['skuList'] =  $skuList;

       //2、for循环sku,如果spu相同则跳过，得到spu的数组信息
        $spus = array();
        foreach($sku as $k=>$v){
            if(!in_array($k,$spus)){
                array_push($spus,$k);
            }
        }
        $spuList = $this->meiciModel->getSpuData($spus);
        $spu = $this->toAssocArr($spuList);
        foreach ($spu as  $k => $val) {
            $spu[$k]['sku'] = $sku[$val['id']];
        }
        $spu['skuListCount']  = $skuListCount;
        if($str == 'spu'){
            return $spu;
        }
        $data['spuList'] =  $spu;
        return   $data;

    }

    /**
     * 商品提交审核
     */
    public function checkinfo(){
        if(empty($_POST['dosubmit'])){
            $r = api('dict', 'api/category/list', array('level' => 1, 'show_all' => 1));
            $firstCategory= empty($r['data']['rows']) ? array() : $r['data']['rows'];
            //品牌
            $brand = api('dict','api/brand/list',array('show_all'=>1,'flag'=>1));
            $brands = empty($brand['data']['rows']) ? array() : $brand['data']['rows'];
            //品类
            $category = api('dict','api/category/list',array('show_all'=>1,'flag'=>1));
            $categories = empty($category['data']['rows']) ? array() : $category['data']['rows'];
            //人群
            $res_fit_person = api('dict','api/fitperson/list',array('show_all'=>1,'flag'=>1));
            $fit_person= empty($res_fit_person['data']['rows'])?array():$res_fit_person['data']['rows'];
            //产地
            $country = api('dict','api/country/list',array('show_all'=>1,'flag'=>1));
            $countries= empty($country['data']['rows'])?array():$country['data']['rows'];
            //颜色
            $color = api('dict','api/color/list',array('show_all'=>1,'flag'=>1));
            $colors= empty($color['data']['rows'])?array():$color['data']['rows'];
            //尺码
            $size = api('dict','api/size/list',array('show_all'=>1,'flag'=>1));
            $sizes= empty($size['data']['rows'])?array():$size['data']['rows'];
            $data['id'] = $_POST['spu'];
            $product_spu = D('lv_info_product_spu');
            $spu_list = $product_spu->find($data);
            $product_sku =  D('lv_info_product_sku');
            $skuList = $product_sku->where("spu='" . $_POST['spu'] . "'")->select();
            $product_Img = D('lv_info_product_img');
            $productImg =$product_Img->select();
            $productsImgs = $this->toAssocArr($productImg,$index = 'sku');
            $skuAttr['colors']=$colors;
            $skuAttr['sizes']=$sizes;
            $this->assign('skuAttr', $skuAttr);
            $this->assign('brands', $brands);
            $this->assign('sizes', $sizes);
            $this->assign('colors', $colors);
            $this->assign('brands', $brands);
            $this->assign('skuList', $skuList);
            $this->assign('productsImgs', $productsImgs);
            $this->assign('categories', $categories);
            $this->assign('countries', $countries);
            $this->assign('fit_person', $fit_person);
            $this->assign('firstCategory', $firstCategory);
            $this->assign('spuInfo',$spu_list);
            $this->display();

        }
    }

    /**
     * 修改价格和库存
     */
    public function editdata(){
        if(empty($_POST['dosubmit'])){
            $data['meici_status'] = $_POST['meici_status'];
            //$data['status'] = 1;
            $data['spu'] = $_POST['spu'];
            //log_message('editdata:' . json_encode($_POST));

            $r = $this->getDataRow($data);
            $rows  = empty($r) ? array() : $r;
            $color= $this->meiciModel->color();
            $colors = $this->toAssocArr($color);
            $size = $this->meiciModel->size();
            $sizes = $this->toAssocArr($size);
            $spu_name = $rows['spuList'][$data['spu']]['name'];
            $bill_type = $this->getSupplierInfo('bill_type');
            //$bill_type =1;
            //log_message('$r:'.json_encode($rows));

            $this->assign('meici_status',  $data['meici_status']);
            $this->assign('spu_name',      $spu_name);
            $this->assign('sizes',      $sizes);
            $this->assign('colors',     $colors);
            $this->assign('bill_type', $bill_type);
            $this->assign('skuList', $rows['skuList']);
            $this->assign('spuList', $rows['spuList']);
            $this->display();
        }else{
            $data = json_decode($_POST['data'],true);
            log_message('$data:' .json_encode($data));
            try{
                foreach($data as $v) {
                    //1、循环数组,得到数据
                    $skuId = $v['sku_id'];
                    //log_message('$v:'.$skuId);
                    if(empty($skuId)){
                        throw new \Exception('商品[SKU:] 信息错误');
                    }
                    $meiciData  = $this->meiciModel->getMeiciIdData($skuId);
                    $meiciId = $meiciData[0]['meici_sku'];
                    $old_quantity = $meiciData[0]['quantity'];
                    $size_id = $meiciData[0]['size_id'];
                    $old_price = intval($meiciData[0]['price']);
                    $old_cost_price = intval($meiciData[0]['cost_price']);
                    $new_quantity = empty($v['quantity']) ? 0 : $v['quantity'];

                    //判断结算价还是美西价
                    if(isset($v['cost_price']) && $v['cost_price'] ==1 ){
                        $v['new_cost_price'] = $v['new_price'];
                        unset($v['new_price']);
                    }

                    if(empty($meiciId)){
                        throw new \Exception('商品[MEICISKU:] 信息错误');
                    }
                    $v['supplier_id'] =  $this->getSupplierInfo('supplier_id');
                    $v['edit_by'] = getLoginedUid();
                    //组装数据请求接口
                    unset($v['cost_price']);
                    unset($v['sku_id']);
                    $v['id'] = $meiciId;
                    //处于未提交状态的修改价格和库存
                    if($v['meici_status'] == 1 ){
                        $r = $this->meiciModel->saveSkuData($v);
                        if($r === false ){
                            throw new \Exception('保存商品[SKU: '.$skuId.'] 出错');
                        }else{
                            $this->ajaxSuccess('操作成功!');
                        }
                    }

                    $data = api('pms','api/productsku/edit', $v);

                    //4、保存API日志
                    $msg = $this->saveChangeLog($skuId,$data,$data['msg'],$v,'api/productsku/edit');
                    if($msg === false){
                        throw new \Exception('保存日志[SKU: '. $skuId.'] 出错');
                    }
                    if($data['status'] ==1){
                        //5、修改该spu下各个sku的状态，价格升高去待审核，降低则不用审核,对应修改状态,注：4的状态看js,不是meici数据库的状态
                        if($v['meici_status'] == 4 ) {
                            if(isset($v['new_price']) && intval($v['new_price']) > $old_price){
                                $v['meici_status'] = 1;
                            }
                            if(isset($v['cost_price']) && intval($v['cost_price']) > $old_cost_price){
                                $v['meici_status'] = 1;
                            }
                        }
                        $r = $this->meiciModel->saveSkuData($v);
                        //6、如果修改了相关的库存,则修改barcode相关信息
                        if($new_quantity !== $old_quantity && $new_quantity){
                            $this->changeStockBarcode($skuId,$size_id,$old_quantity,$new_quantity,$meiciId);
                        }
                        if($r === false ){
                            throw new \Exception('保存商品[SKU: '.$skuId.'] 出错');
                        }else{
                            isset($v['new_price'])  && $str .= '修改商品价格:'.$old_price .'至' . $v['new_price'];
                            isset($v['new_cost_price'])  && $str .= '修改商品结算价格:'.$old_cost_price .'至' . $v['new_cost_price'];
                            isset($v['quantity'])  && $str .= '修改库存:'.$old_quantity .'至' . $v['quantity'];

                            $addProductLogs = $this->addProductLogs($meiciData[0]['spu'],$skuId,$str);
                            if(!$addProductLogs){
                                throw new \Exception('商品[SKU: '.$skuId.']记录日志失败');
                            }

                            $this->ajaxSuccess('操作成功!');
                        }
                    }else{
                        throw new \Exception('请求数据[SKU: '.$skuId.'] 出错,' . $data['msg']);
                    }
                }
            }catch(\Exception $e){
                    $this->ajaxError($e->getMessage());
            }
        }
    }

    /**
     * 修改库存后修改barcode
     * @param $sku
     * @param $size_id
     * @param $old_quantity
     * @param $new_quantity
     * @param $meici_sku
     * @throws \Exception
     */
    public function changeStockBarcode($sku,$size_id,$old_quantity,$new_quantity,$meici_sku){
        $meici_data['meici_eidt'] = 1;
        $meici_data['meici_sku'] = $meici_sku;
        $data['sku'] = $sku;
        $data['size_id'] = $size_id;
        $data['old_quantity'] = $old_quantity;
        $data['new_quantity'] = $new_quantity;
        $data['meici_sku'] = $meici_data;
        //log_message('changeStockBarcode:'. json_encode($data));

        $data = $this->meiciModel->updateBarcode($sku,$size_id,$old_quantity,$new_quantity,$meici_data);
        if($data === false){
            throw new \Exception('修改[SKU: '.$sku.'] Barcode出错');
        }
    }


    /**
     * 批量提交审核
     */
    public function setstatus() {
        $r = \Org\Util\Validate::validParams($_POST,$this->field_status);
        if($r!==true) $this->ajaxError($r);
        else {
            $params =  $_POST;
            $_POST['status_chg_by'] = getLoginedUid();
            //得到供应商的ID和类型，不同类型传的价格不一样
            $bill_type = $this->getSupplierInfo('bill_type');
            $sku_ids = explode(',',$params['ids'] );
            $signAddSpuOrSku = false;
            try {
                foreach ($sku_ids as $val) {
                    //1、先查询sku存在，得到spu相关数据
                    $skuData = $this->meiciModel->getNoAuditedSku($val, $bill_type);
                    if (empty($skuData)) {
                        throw new \Exception('商品[SKU: ' . $val . '] 信息错误');
                    }
                    $spuList = $this->meiciModel->getSpuInfo($skuData[0]['spu']);
                    //log_message('$spuList:' . json_encode($spuList));
                    //如果不存在meici_spu则删除，存在则重新组装数据请求其他接口
                    if ($spuList[0]['spu'] == 0) {
                        $signAddSpuOrSku = true;
                        unset($spuList[0]['spu']);
                        if (empty($spuList)) {
                            throw new \Exception('商品[SKU: ' . $val . '] SPU错误');
                        }
                        //2、整合接口数据
                        unset($skuData[0]['spu']);
                        //log_message('$skuData:' . json_encode($skuData));
                        $sendData = $spuList[0];
                        $sendData['supplier_id'] = $this->getSupplierInfo('supplier_id');
                        $sendData['external'] = '1';
                        $sendData['skus'] = json_encode($skuData);
                        //3、存在meici_spu则从新组装数据，请求接口/api/Productsku/add

                        //4、数据组装完成请求接口,成功后修改商品状态，并保存日志
                        $data = api('pms', 'api/productspu/add', $sendData);
                    } else {
                        unset($skuData[0]['spu']);
                        $sendData = $skuData[0];
                        $sendData['spu'] = $spuList[0]['spu'];
                        //log_message('$sendData:' . json_encode($sendData));
                        $data = api('pms', 'api/productsku/add', $sendData);
                    }

                    //5、保存日志
                    $msg = $this->saveChangeLog($val, $data, $data['msg'], $sendData, '/api/productspu/add');
                    if ($msg === false) {
                        throw new \Exception('保存日志[SKU: ' . $val . '] 出错');
                    }

                    if ($data['status'] == 1) {
                        //6、修改该spu下各个sku的状态
                        if ($signAddSpuOrSku === true) {
                            $r = $this->changeMeiciStatus($data['data'], 'spu');
                        } else {
                            $r = $this->changeMeiciStatus($data['data']);
                        }

                        if ($r['error'] === true) {
                            throw new \Exception('保存商品[SKU: ' . $r['skuid'] . '] 出错' . $r['msg']);
                        }else{
                            $addProductLogs = $this->addProductLogs($skuData[0]['spu'],$skuData[0]['lv_sku'],'提交至美西审核');
                            if($addProductLogs){
                                throw new \Exception('商品[SKU: '.$skuData[0]['lv_sku'].']记录日志失败');
                            }
                        }
                    } else {
                        throw new \Exception('请求数据[SKU: ' . $val . '] 出错,' . $data['msg']);
                    }
                }
                $this->ajaxSuccess('操作成功!');
            }catch(\Exception $e){
                $this->ajaxError($e->getMessage());
            }
        }
    }


    /**
     * 修改相关状态
     * @param $data
     * @param $str
     * @return mixed
     */
    public function changeMeiciStatus($data,$str){
        //先修改spu,根据item_number，supplier_id
        if($str === 'spu'){
            //新增spu
            $msg = $this->meiciModel->changeSpuGoToMeiciStaus($data['supplier_id'],$data['item_number'],$data['spu']);
            if($msg === false){
                $data['error'] = true;
                $data['msg'] = '修改spu相关信息失败';
                return $data;
            }
        }

        //在修改sku
        foreach($data['skus'] as $k=>$v){
            $msg = $this->meiciModel->changeSkuGoToMeiciStaus($k,$v,$data['spu']);
            //修改对应的barcode,传meici_id
            $this->changeBarcode($k,$v);
            $data['skuid'] = $k;
            if($msg === false){
                $data['error'] = true;
                $data['msg'] = '修改sku' .  $k .'相关信息失败';
                return $data;
            }
        }
    }

    /**
     * 修改barcodemeici_sku和meici_barcode
     * @param $sku
     * @param $meici_sku
     * @throws \Exception
     */

    public function changeBarcode($sku,$meici_sku){
        //$barcode = $code.$supplier_id.$sku.$sizes.str_pad($serial_no,3,'0',STR_PAD_LEFT);
        //1、查询size
        $size_id = $this->meiciModel->getSkuSizeId($sku);
        if(empty($size_id)){
            throw new \Exception('查询商品[SKU: '.$sku.'] 尺寸出错');
        }
        $arr['id'] = $size_id[0]['size_id'];
        $size_detail= $this->meiciModel->sizeDetail($arr);
        $size = $size_detail['value'];
        $size = str_replace(array("."),"",$size);
        $sizes = str_pad($size, 3, '0', STR_PAD_LEFT);
        //2.插入出barcode表相关内容
        $skuBarcodeData =  $this->meiciModel->getBarcodeData($sku);
        if(empty($skuBarcodeData)){
            throw new \Exception('查询商品[SKU: '.$sku.'] Barcode出错');
        }
        $supplier_id = $this->getSupplierInfo('supplier_id');
        //3、for循环生成meici_barcode,将meici_barcode和meici_sku保存
        foreach($skuBarcodeData as $k=>$v){
            $data['id'] = $v['id'];
            $data['sku'] = $sku;
            $data['meici_sku'] = $meici_sku;
           // $meici_barcode = 'D'.$supplier_id.$sku.$sizes.str_pad($v['serial_no'],3,'0',STR_PAD_LEFT);
            $data['meici_barcode'] =  'D'.$supplier_id.$meici_sku.$sizes.str_pad($v['serial_no'],3,'0',STR_PAD_LEFT);
            $r =  $this->meiciModel->saveBarcodeData($data);
            if($r === false){
                throw new \Exception('保存商品[SKU: '.$sku.'] Barcode信息出错');
            }
        }
    }


    /**
     * 记录日志
     * @param $spu
     * @param $skus
     * @param $content
     * @return mixed
     */
    public function saveChangeLog($sku,$data,$msg,$sendData,$remark){
        $log['sku'] =  $sku;
        $log['supplier_id'] =  getLoginedUid();
        $log['operate_content'] = json_encode($data);
        $log['send_content'] = json_encode($sendData);
        $log['operate_time'] = time();
        $log['remark'] = $remark;
        $log['reject_reason'] = $msg;
        $r = $this->meiciModel->saveMeiciLog($log);
        return  $r;
    }

    /**
     * 记录日志
     */

    public function list4dialog()
    {
        $data['sku'] =  $_POST['sku'];
        $data['meici_status'] =   $_POST['operate_type'];

        if($data['meici_status'] == 4) {
            //此是显示错误日志，未通过显示最后一条日志即可
            $r = $this->meiciModel->list4dialog($data);
            $data = $r[0];
            if ($data['meici_audit_info_status'] == 2) {
                $rows[] = array('msg' => $data['meici_audit_info_status_msg']);
            }
            if ($data['meici_audit_pic_status'] == 2) {
                $rows[] = array('msg' => $data['meici_audit_pic_status_msg']);
            }
            if ($data['meici_audit_price_status'] == 2) {
                $rows[] = array('msg' => $data['meici_audit_price_status_msg']);
            }
            //log_message('$rows:' . json_encode($rows));
        }

        if($data['meici_status'] == 3){
            //显示商品日志
            $rows = $this->findProductLogs($data['sku'],$_POST);
            $rows = empty($rows)? array() : $rows;
            $pagenation['page'] = $_POST['page'];
            $pagenation['pagesize'] = $_POST['pagesize'];
            $pagenation['sort_by'] = $_POST['sort_by'];
            $pagenation['total'] = $rows['count'];
            $pagenation['page_total'] = ceil($pagenation['total']/$pagenation['pagesize']);
            $pagenation = empty($pagenation)? array() : $pagenation;

            $rows =   $rows['data'];
            $this->assign('pagenation',$pagenation);
        }

        $this->assign('rows',$rows);
        $this->assign('meici_status',$data['meici_status']);
        $this->display();
    }


}