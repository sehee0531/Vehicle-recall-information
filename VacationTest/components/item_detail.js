import React, { Component , PureComponent } from 'react';
import { ScrollView, Pressable, View, Text, 
    Image, FlatList, TouchableOpacity, Button } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';

import GestureRecognizer from 'react-native-swipe-gestures';
import IconDelete from 'react-native-vector-icons/Ionicons';

import { styles } from "../../../styles/home";
import IconRadio from 'react-native-vector-icons/MaterialIcons';
import IconPopup from 'react-native-vector-icons/EvilIcons';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Constant from '../../../util/constatnt_variables';
import WebServiceManager from '../../../util/webservice_manager';

export default class DetailItemView extends Component {
    constructor(props) {
        super(props);
        this.hashTagRef = React.createRef();

        this.item = this.props.item;
        const hashTag = this.item.hashTag.split(',').map(tag => tag);
     
        this.state = {
            imageLength: 0,
            images: [],

            editGoodsViewVisible : false,
            defaultquantity:this.item.quantity,
            
            quantity: 1, // 상품갯수 기본값
            editquantity: this.item.quantity, // 수정할 상품갯수

            tagName: '',
            hashTag: hashTag,

            quality : 1, // 상품상태
            check_genuine: true, // 정품 
            check_non_genuine: false, // 비정품

            dipsbuttonclicked:false,//찜하기
            togglebuttonclicked:false,

        }
    }

    componentDidMount() {
        this.callimageLengthAPI().then((response) => {
            console.log(response);
            this.setState({ imageLength: response.length });
            for (let i = 1; i <= response.length; i++) {
                this.callGetImageAPI(i).then((response) => {
                    let reader = new FileReader();
                    reader.readAsDataURL(response); //blob을 읽어줌 읽은 놈이 reader
                    reader.onloadend = () => {
                        const images = this.state.images;
                        images.push(reader.result.replace("application/octet-stream", "image/jpeg"));
                        console.log(images.length);
                        this.setState({ images: images });
                    }
                })
            }
        })
    }


    async callimageLengthAPI() {
        let manager = new WebServiceManager(Constant.serviceURL + "/GetGoodsImageLength?id=" + this.item.id)
        let response = await manager.start();
        if (response.ok) {
            return response.json();
        }
    }

    async callGetImageAPI(position) {
        let manager = new WebServiceManager(Constant.serviceURL + "/GetGoodsImage?id=" + this.item.id + "&position=" + position);
        let response = await manager.start();
        if (response.ok)
            return response.blob();
    }

    qulityValueText = (value) => {
        let qulityText = ["새제품이에요 📦","깨끗해요 🙂","쓸만해요 👍"];
        return qulityText[value-1];
    }

    genuineValueText = (value) => {
        let genuineText = ["정품","비정품"];
        return genuineText[value-1];
    }

    closeModal =()=> {
        this.props.detailViewModalListener(false);
    }

    // 수정 버튼 클릭
    showEditGoodsView =()=>{
        if(this.state.editGoodsViewVisible == true){
            this.setState({editGoodsViewVisible:true});
        }
        else{
            this.setState({editGoodsViewVisible:true});
        }
    }

    // 수정완료 버튼 클릭
    editCompleteButtonClicked =()=>{
        if(this.state.editGoodsViewVisible == true){
            this.setState({editGoodsViewVisible:false});
        }
    }

    //해시태그 등록버튼을 누를때
    addTag = () => {
        if (this.state.hashTag.length < 7) {
            if (this.state.tagName != "") {
                this.setState({ hashTag: this.state.hashTag.concat(this.state.tagName) });
            }
        }
        else {
            this.setState({ hashTagError: false }) // add_goods에서 hashTagError 변수선언 안되있던데 왜필요한가요??
        }

        this.state.tagName = ""

        this.hashTagRef.clear();
    }

    //해시태그 삭제할 때
    hashTagRemove = (index) => {
        this.setState({
            hashTag: this.state.hashTag.filter((_, indexNum) => indexNum !== index),
        })
        console.log("해쉬태그 index", index)
    }

    // 판매수량 수정 버튼 클릭
    // -버튼 클릭
    minusNum = (quantity) => {
        if(quantity<=1){
            this.setState({ quantity: 1 })
        }
        else {
            this.setState({ quantity: quantity - 1 });
        }
        
        
        
    }

    // +버튼 클릭
    plusNum = () => {
        if (this.state.defaultquantity > this.state.quantity) {
            this.setState({ quantity: this.state.quantity + 1 })
        }
        
    }

    editminus=(editquantity)=>{
        if(editquantity<=1){
            this.setState({ editquantity: 1 })
        }
        else {
            this.setState({ editquantity: editquantity - 1 });
        }
    }

    editplus=(editquantity)=>{
       
        this.setState({editquantity:this.state.editquantity+1})
        
    }
    

    //정품 클릭
    genuineCheck = () => {
        this.setState({ check_genuine: true, check_non_genuine: false, genuine: 1 });
    }
    //비정품 클릭
    non_genuineCheck = () => {
        this.setState({ check_non_genuine: true, check_genuine: false, genuine: 2 });
    }

    dipsButtonClicked=()=>{
        this.setState({dipsbuttonclicked: !this.state.dipsbuttonclicked})

    }

    render() {
        // 값 변환
        const hashTags = this.item.hashTag.split(',').map(tag => `#${tag}`);
        const price = this.item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return (
            <>
                <GestureRecognizer
                    style={{flex: 1}}
                    onSwipeDown={this.closeModal}>

                    <View style={styles.modalView}>
                        <TouchableOpacity
                            onPress={this.closeModal}
                            style={styles.modalCloseButton}>
                            <IconDelete name="close" color="black" size={35}></IconDelete>
                        </TouchableOpacity>

                        <View style={styles.wrap}>
                            <ScrollView style={styles.productDetailView}>
                                {/* 이미지 리스트 */}
                                <View style={styles.slideImageView}>
                                    {/* 수정 */}
                                    <TouchableOpacity onPress={this.showEditGoodsView} style={{alignItems:'flex-end'}}>
                                        <Text>수정</Text>
                                    </TouchableOpacity>
                                    <FlatList
                                        data={this.state.images}
                                        renderItem={item => (
                                            <ImageView image={item.item} />
                                        )}
                                        horizontal={true}
                                    />
                                </View>

                                {/*  상품 디테일 */}
                                <View style={styles.productDetail}>
                                    {/* 인증 마크 => TODO 인증 업체일 경우에만 뜨도록 설정 */}
                                    <View style={styles.certificationMark}>
                                        <Text style={styles.certificationMarkText}>인증업체</Text>
                                    </View>

                                    {/* 부품 번호 */}
                                    <View style={styles.detailProductNumber}>
                                        <Text style={styles.detailProductNumberText}>
                                            {this.item.number}
                                        </Text>
                                    </View>

                                    {/* 부품 이름 */}
                                    <View style={styles.detailProductName}>
                                        <Text style={styles.detailProductNameText}>
                                            {this.item.name}
                                        </Text>
                                    </View>

                                    {/* 해시 태그 리스트 */}
                                    {!this.state.editGoodsViewVisible && <View style={styles.detailHashTags}>
                                        {hashTags.map((tag, index) => (
                                            <View style={styles.detailHashTag} key={index}>
                                                <Text style={styles.detailHashTagText}>{tag}</Text>
                                            </View>
                                        ))}
                                    </View>}

                                    {/* 해시 태그 리스트 수정 */}
                                    {this.state.editGoodsViewVisible && <View style={styles.keywordView}>< View style={styles.textInput}>
                                        <View style={styles.rowLayout}>
                                            <View style={styles.textLayout}>
                                                <Text>키워드
                                                    {this.state.hashTagError == false ? (
                                                        <Text style={styles.errorMessage}>
                                                            * 1 - 7개 입력
                                                        </Text>
                                                    ) : null}
                                                </Text>
                                                <TextInput
                                                    ref={(c) => { this.hashTagRef = c; }}
                                                    returnKeyType="next"
                                                    onSubmitEditing={this.addTag}
                                                    onChangeText={(value) => this.setState({ tagName: value })}
                                                    value={this.state.tagName}
                                                />
                                            </View>
                                            <View style={styles.btnLayout}>
                                                <TouchableOpacity style={styles.btn_tag} onPress={this.addTag}>
                                                    <Text>추가</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={styles.tagLayout}>
                                        {this.state.hashTag.map((item, i) =>
                                            <View style={styles.tagStyle} key={i}>
                                                <Text>#{item}</Text>
                                                <TouchableOpacity onPress={() => this.hashTagRemove(i)}>
                                                    <IconPopup name="close" size={15} color="black" />
                                                </TouchableOpacity>
                                            </View>
                                        )}
                                        </View></View>}

                                    {/* 금액 */}
                                    <View style={styles.detailPriceWrap}>
                                        {!this.state.editGoodsViewVisible &&<View style={styles.detailPrice}>
                                            <Text style={styles.detailPriceText}>{price}</Text>
                                        </View>}                                       

                                        {/* 금액 수정 */}
                                        {this.state.editGoodsViewVisible && <View style={styles.editGoodsPriceInput}>
                                            <TextInput style={styles.detailPriceText}>{price}</TextInput>
                                        </View>}

                                        {/* 단위 */}
                                        <View style={styles.detailUnit}>
                                            <Text style={styles.detailUnitText}>원</Text>
                                        </View>

                                        {/* 구매 수량 선택 => TODO 여러 개일 경우에만 보이도록*/}
                                        <View style={styles.quantityView}>
                                            {/* 남은 수량 */}
                                            <View style={styles.remaining}>
                                                <Text style={styles.remainingText}>
                                                    {this.state.defaultquantity}개 남음
                                                </Text>
                                            </View>

                                            {/* 남은수량 수정 */}
                                            {this.state.editGoodsViewVisible && <View style={styles.selectQuantityView}>
                                                <Pressable onPress={()=>this.editminus(this.state.editquantity)} style={styles.quantityItem}>
                                                    <Text style={styles.quantityItemText}>-</Text>
                                                </Pressable>

                                                <View style={[styles.quantityItem, styles.quantityCount]}>
                                                    <Text style={styles.quantityItemText}>{this.state.editquantity}</Text>
                                                </View>

                                                <Pressable onPress={()=>this.editplus(this.state.editquantity)} style={styles.quantityItem}>
                                                    <Text style={styles.quantityItemText}>+</Text>
                                                </Pressable>
                                            </View>}

                                            {/* 카운트 */}
                                            {!this.state.editGoodsViewVisible && <View style={styles.selectQuantityView}>
                                                <Pressable onPress={() => this.minusNum(this.state.quantity)} style={styles.quantityItem}>
                                                    <Text style={styles.quantityItemText}>-</Text>
                                                </Pressable>

                                                <View style={[styles.quantityItem, styles.quantityCount]}>
                                                    <Text style={styles.quantityItemText}>{this.state.quantity}</Text>
                                                </View>

                                                <Pressable onPress={this.plusNum} style={styles.quantityItem}>
                                                    <Text style={styles.quantityItemText}>+</Text>
                                                </Pressable>
                                            </View>
                                            }
                                        </View>
                                    </View>
                                </View>

                                {/* 토글 디테일 */}
                                <View style={styles.toggleDetailView}>
                                    <View style={styles.toggleDetailTitle}>
                                        <Text style={styles.toggleDetailTitleText}>상품 정보</Text>
                                        <TouchableOpacity onPress={()=> this.setState({togglebuttonclicked: !this.state.togglebuttonclicked})}>
                                            <Image
                                                source={require('../../../images/icon/select-icon/select-icon.png')}
                                                resizeMode="center"
                                                style={styles.toggleDetailTitleIcon}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    {this.state.togglebuttonclicked ?
                                        <>
                                            <View style={styles.toggleDetailItem}>
                                                <View style={styles.toggleDetailItemTItle}>
                                                    <Text style={styles.toggleDetailItemTItleText}>제목</Text>
                                                </View>
                                                <View style={styles.toggleDetailItemValue}>
                                                    <Text style={styles.toggleDetailItemValueText}>
                                                        {this.item.name}
                                                    </Text>
                                                </View>
                                            </View>
                                            {/* 품번 */}
                                            <View style={styles.toggleDetailItem}>
                                                <View style={styles.toggleDetailItemTItle}>
                                                    <Text style={styles.toggleDetailItemTItleText}>품번</Text>
                                                </View>

                                                <View style={styles.toggleDetailItemValue}>
                                                    <Text style={styles.toggleDetailItemValueText}>
                                                        {this.item.number}
                                                    </Text>
                                                </View>
                                            </View>

                                            {/* 제품 상태 */}
                                            {!this.state.editGoodsViewVisible && <View style={styles.toggleDetailItem}>
                                                <View style={styles.toggleDetailItemTItle}>
                                                    <Text style={styles.toggleDetailItemTItleText}>
                                                        제품 상태
                                                    </Text>
                                                </View>
                                                <View style={styles.toggleDetailItemValue}>
                                                    <Text style={styles.toggleDetailItemValueText}>
                                                        {this.qulityValueText(this.item.quality)}
                                                    </Text>
                                                </View>
                                            </View>}

                                            {/*정품 비정품*/}
                                            {!this.state.editGoodsViewVisible && <View style={styles.toggleDetailItem}>
                                                <View style={styles.toggleDetailItemTItle}>
                                                    <Text style={styles.toggleDetailItemTItleText}>정품 유무</Text>
                                                </View>
                                                <View style={styles.toggleDetailItemValue}>
                                                    <Text style={styles.toggleDetailItemValueText}>
                                                        {this.genuineValueText(this.item.genuine)}
                                                    </Text>
                                                </View>
                                            </View>}

                                            {!this.state.editGoodsViewVisible && <View style={styles.toggleDetailTextArea}>
                                                <View style={styles.toggleDetailItemTItle}>
                                                    <Text style={styles.toggleDetailItemTItleText}>
                                                        상품 설명
                                                    </Text>
                                                </View>
                                                {/* TODO 추가 하기 */}
                                                <Text style={styles.toggleDetailTextAreaText}>
                                                    {this.item.spec}
                                                </Text>
                                            </View>}
                                        </>

                                        : null}

                                    {/* 수정 모아보기 */}
                                    {/* 제품 상태 수정 */}
                                    {this.state.editGoodsViewVisible && <View style={styles.toggleDetailItem}>
                                        <View style={styles.toggleDetailItemTItle}>
                                            <Text style={styles.toggleDetailItemTItleText}>
                                                제품 상태
                                            </Text>
                                        </View>
                                        <View style={styles.editGoodsQuality}>
                                            <Picker
                                                selectedValue={this.state.quality}
                                                onValueChange={(value, index) => { this.setState({ quality: value }) }}>
                                                <Picker.Item label='새제품이에요 📦' value="1" />
                                                <Picker.Item label='깨끗해요 🙂' value="2" />
                                                <Picker.Item label='쓸만해요 👍' value="3" />
                                            </Picker>
                                        </View>
                                    </View>}
                                    
                                    

                                    {/*정품 비정품 수정*/}
                                    {this.state.editGoodsViewVisible && <View style={styles.g_rowLayout}>
                                        <View style={styles.toggleDetailItemTItle}>
                                            <Text style={styles.toggleDetailItemTItleText}>정품 유무</Text>
                                        </View>
                                        <View style={styles.status_item}>
                                            <TouchableOpacity activeOpacity={0.8} onPress={this.genuineCheck}>
                                                <View style={styles.genuine_row}>
                                                    <IconRadio name={this.state.check_genuine ? "check-box" : "check-box-outline-blank"} size={30} color={'black'} />
                                                    <Text style={styles.text} > 정품</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={styles.status_item}>
                                            <TouchableOpacity activeOpacity={0.8} onPress={this.non_genuineCheck}>
                                                <View style={styles.genuine_row}>
                                                    <IconRadio name={this.state.check_non_genuine ? "check-box" : "check-box-outline-blank"} size={30} color={'black'} />
                                                    <Text style={styles.text}> 비정품</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>}

                                    {/* 그 외 내용 */}
                                    

                                    {/* 상품설명 수정 */}
                                    {this.state.editGoodsViewVisible && <View style={styles.toggleDetailTextArea}>
                                        <View style={styles.toggleDetailItemTItle}>
                                            <Text style={styles.toggleDetailItemTItleText}>
                                                상품 설명
                                            </Text>
                                        </View>
                                        <View style={styles.editGoodsExplainInput}>
                                            <TextInput multiline={true} style={styles.toggleDetailTextAreaText}>{this.item.spec}</TextInput>
                                        </View>
                                    </View>}
                                </View>
                            </ScrollView>
                            {/* 구매하기 버튼 */}
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity style={{backgroundColor:"white",width:"15%",alignItems:'center',justifyContent:'center'}} onPress ={this.dipsButtonClicked}>
                                    <Icon name="favorite" color={this.state.dipsbuttonclicked ? "red" : "lightgrey"} size={35}></Icon>
                                </TouchableOpacity>
                                {!this.state.editGoodsViewVisible && <TouchableOpacity style={styles.buyButton}>
                                    <Text style={styles.buyButtonText}>구매하기</Text>
                                </TouchableOpacity>}
                                {/* 수정완료 버튼 */}
                                {this.state.editGoodsViewVisible && <TouchableOpacity onPress={this.editCompleteButtonClicked} style={styles.editCompleteButton}>
                                <Text style={styles.editCompleteButtonText}>수정완료</Text>
                            </TouchableOpacity>}
                            </View>

                            
                            
                        </View>
                           
                       
                    </View>
                </GestureRecognizer>
            </>
        )
    }
}

class ImageView extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            imageSource: null,
        };
    }

    componentDidMount() {
        this.setState({ imageSource: this.props.image });
    }
    render() {
        return (
            <View style={styles.allImages}>
                <Image
                    source={{ uri: this.state.imageSource }}
                    style={styles.allImagesImage}
                />
            </View>
        );
    }
}