import React, { Component } from 'react';
import { ScrollView, StyleSheet, View, Animated, Text, Platform, FlatList, Dimensions,TextInput, TouchableOpacity, Image } from 'react-native';

import Constant from "../../../util/constatnt_variables";
import WebServiceManager from "../../../util/webservice_manager";
import { styles } from "../../../styles/home_style";

const Header_Maximum_Height = 300;
const Header_Minimum_Height = 60;

class CollapsibleHome extends Component {
    constructor(props) {
        super(props)

        this.AnimatedHeaderValue = new Animated.Value(0);
        this.textArray =["Sample Text 1","Sample Text 2","Sample Text 3","Sample Text 4","Sample Text 5","Sample Text 6","Sample Text 7",
        "Sample Text 8","Sample Text 9","Sample Text 10","Sample Text 11","Sample Text 12","Sample Text 13","Sample Text 14","Sample Text 15",
        "Sample Text 16","Sample Text 17","Sample Text 18","Sample Text 19","Sample Text 20"]

        this.state={goodsContent: [],}
    }

    componentDidMount() {
        this.callGetRepairAPI().then((response) => {
            this.Contents = response;
            //console.log(response);//response는 json자체
            this.setState({ goodsContent: response });
        });
    }

    async callGetRepairAPI() {
        let manager = new WebServiceManager(Constant.serviceURL + "/GetGoods");
        let response = await manager.start();
        if (response.ok)
            return response.json();
        else
            Promise.reject(response);
    }

    render() {
        const AnimateHeaderBackgroundColor = this.AnimatedHeaderValue.interpolate(
            {
                inputRange: [0, (Header_Maximum_Height - Header_Minimum_Height)],
                outputRange: ['#009688', '#00BCD4'],
                extrapolate: 'clamp'
            });

        const AnimateHeaderHeight = this.AnimatedHeaderValue.interpolate(
            {
                inputRange: [0, (Header_Maximum_Height - Header_Minimum_Height)],
                outputRange: [Header_Maximum_Height, Header_Minimum_Height],
                extrapolate: 'clamp'
            });
            
        
        const renderHeader = this.AnimatedHeaderValue.interpolate(
            {
                inputRange: [0, Header_Maximum_Height],
                outputRange: [0, -Header_Maximum_Height],
            });

        const renderSearchBar = this.AnimatedHeaderValue.interpolate(
            {
                inputRange:[0, Header_Maximum_Height],
                outputRange:[Header_Maximum_Height, 0],
                extrapolate: 'clamp'
            });

        return (
            <View style={styles.MainContainer}>
                <FlatList
                    data={this.state.goodsContent}
                    renderItem={({ item }) => <GetImages item={item} id={item.id} navigation={this.props.navigation} />}
                    scrollEventThrottle={16}
                    contentContainerStyle={{ paddingTop: Header_Maximum_Height + 60 }}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: this.AnimatedHeaderValue } } }]
                    )}
                />
                <Animated.View style={[styles.SearchBarStyle, { height:60 ,transform :[{translateY:renderSearchBar}]}]}>
                    <TextInput style={styles.HeaderInsideTextStyle} />
                </Animated.View>
                <Animated.View style={[styles.HeaderStyle, { transform :[{translateY:renderHeader}]}]}>
                    <Text style={styles.TextViewStyle}>HIHIHIHIHI</Text>
                    <Text style={styles.TextViewStyle}>HIHIHIHIHI</Text>
                    <Text style={styles.TextViewStyle}>HIHIHIHIHI</Text>
                    <Text style={styles.TextViewStyle}>HIHIHIHIHI</Text>
                    <Text style={styles.TextViewStyle}>HIHIHIHIHI</Text>
                    <Text style={styles.TextViewStyle}>HIHIHIHIHI</Text>
                </Animated.View>
            </View>
        );
    }
}
class GetImages extends Component {
    constructor(props) {
        super(props);

        this.state = {
            imageURL: null,
        };
    }
    componentDidMount() {
        this.callGetRepairImageAPI(this.props.item).then((response) => {
            let reader = new FileReader();
            reader.readAsDataURL(response); //blob을 읽어줌 읽은 놈이 reader
            reader.onloadend = () => {
                this.setState({ imageURL: reader.result }) //base64를 imageURL에 집어넣어준다
            } //끝까지 다 읽었으면 
        });
    }
    async callGetRepairImageAPI(id) {

        let manager = new WebServiceManager(Constant.serviceURL + "/GetGoodsImage?id=" + this.props.id + "&position=1");
        let response = await manager.start();
        if (response.ok)
            return response.blob();
    }

    render() {
        const item = this.props.item;
        return (
            <>
                <TouchableOpacity style={styles.homebottom} onPress={this.handleModal}>
                    <View style={styles.row}>
                        <Image source={{ uri: this.state.imageURL }} style={styles.logo} />
                        <Text style={styles.TextLo}>
                            {"품명 : "}{item.name}{"\n"}
                            <TouchableOpacity onPress={() => this.props.navigation.push("WebView", { itemNum: item.number })}>
                                <Text style={{ color: '#0076D1' }}>{"부품번호 : " + item.number}</Text>
                            </TouchableOpacity>{"\n"}
                            {"가격 : "}{item.price}{"\n"}
                            {"해시태그 : "}{item.hashTag.length < 10 ? item.hashTag : item.hashTag.slice(0, 9) + '...'}{"\n"}
                            {"판매개수 : "}{item.quantity}
                        </Text>
                    </View>
                </TouchableOpacity >
            </>
        );
    }
}

/*const styles = StyleSheet.create(
    {
        MainContainer:
        {
            flex: 1,
            //paddingTop: (Platform.OS == 'ios') ? 20 : 0
        },

        HeaderStyle:
        {
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            left: 0,
            right: 0,
            top: (Platform.OS == 'ios') ? 20 : 0,
        },

        SearchBarStyle:
        {
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            left: 0,
            right: 0,
            backgroundColor:'blue',
            top: (Platform.OS == 'ios') ? 20 : 0,
        },

        HeaderInsideTextStyle:
        {
            height: 50,
            width:"100%",
            backgroundColor: 'white',
            borderRadius: 10,
            fontSize: 15,
            textAlign: 'center'
        },

        TextViewStyle:
        {
            textAlign: 'center',
            color: "#000",
            fontSize: 18,
            margin: 5,
            padding: 7,
            backgroundColor: "#ECEFF1"
        }
});*/

export default CollapsibleHome;