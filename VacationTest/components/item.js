import React, { Component , PureComponent } from 'react';
import { View, Text, Image, TouchableOpacity, Modal} from 'react-native';

import { styles } from "../../../styles/home";

import Constant from '../../../util/constatnt_variables';
import WebServiceManager from '../../../util/webservice_manager';
import DetailItemView from "./item_detail";

export default class ListItem extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            imageURI: null,
            isDetailViewModal: false,
        };
    }

    componentDidMount() {
        this.callGetRepairImageAPI(this.props.item).then((response) => {
            let reader = new FileReader();
            reader.readAsDataURL(response); //blob을 읽어줌 읽은 놈이 reader
            reader.onloadend = () => {
                this.setState({ imageURI: reader.result }) //base64를 imageURI에 집어넣어준다

            } //끝까지 다 읽었으면 
        });
    }
    async callGetRepairImageAPI() {
        let manager = new WebServiceManager(Constant.serviceURL + "/GetGoodsImage?id=" + this.props.id + "&position=1");
        let response = await manager.start();
        if (response.ok)
            return response.blob();
    }

    handleDetailViewModal=()=> {
        this.setState({isDetailViewModal:!this.state.isDetailViewModal});
    }

    render() {
        const item = this.props.item;
        const index = this.props.index;
        const separateColor = ['#e9e9e9','#ffffff']
        return (
            <>
            <TouchableOpacity onPress={this.handleDetailViewModal}>
                <View style={[styles.product,{backgroundColor:separateColor[index%2]}]}>
                    {/* 상품 이미지 */}
                    <View style={styles.productImageView}>
                        <Image
                            source={{ uri: this.state.imageURI }}
                            style={styles.productImage}/>
                    </View>
                    <View style={styles.productInfo}>
                        <View style={styles.productInfoLeft}>
                            
                            <Text style={styles.itemNameText}>{item.name}</Text>
                            <Text style={styles.itemPriceText}>{item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{"원"}</Text>
                            <Text style={styles.itemNumberText}>{item.number}</Text>
                           
                        </View>
                        <View style={styles.productInfoRight}>
                            <View style={styles.productDistance}>
                                <Text style={styles.itemDistanceText}>1km</Text> 
                            </View>
                            <View style={styles.productRegisterDate}>
                                <Text style={styles.itemRegisterDateText}>{item.registerDate.slice(5,10)}</Text>
                            </View>
                        </View>             
                    </View>
                </View>
            </TouchableOpacity>
             
            <Modal animationType="slide" transparent={true} visible={this.state.isDetailViewModal}>                    
                <DetailItemView detailViewModalListener={(value)=>{this.setState({isDetailViewModal:value})}} item={item} />
            </Modal>
       </>
        );
    }
}