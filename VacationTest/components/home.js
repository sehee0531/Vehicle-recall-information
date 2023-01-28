import React, { Component , PureComponent } from 'react';
import { ScrollView, Pressable, TextInput, ImageBackground, View, Text, 
    Image, FlatList, TouchableOpacity, Modal, Animated, BackHandler, Alert, NativeModules } from 'react-native';

import Constant from "../../../util/constatnt_variables";
import WebServiceManager from "../../../util/webservice_manager";
import Icon from 'react-native-vector-icons/MaterialIcons';
import CarIcon from 'react-native-vector-icons/Ionicons';
import { styles } from "../../../styles/home";


class Home extends Component {
    constructor(props) {
        super(props);
        this.carnumber="112고8128";

        this.state = {

            repairscontent:"",
            recallscontent:"",
        };
    }

    componentDidMount() {
       
        BackHandler.addEventListener("hardwareBackPress", this.backPressed); //뒤로가기 이벤트
    }

    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.backPressed);
    }    
    


    // 품번인식 카메라로 이동 goCameraButtonClicked
    goCameraButtonClicked = () => {
        this.props.navigation.push("PartsNoCamera", { onResultListener: this.goPartsNo });
    }

    // 품번 가지고오는 함수
    goPartsNo = () => {
        this.callPartsNoAPI().then((response)=> {  
            console.log(response.recalls[0].content)
           this.setState({repairscontent:response.repairs[0].content, recallscontent:response.recalls[0].content})       
        });
    } 

    //Web Service 시작
     //사진으로부터 품번 인식 서비스 API
     async callPartsNoAPI() {
        let manager = new WebServiceManager("http://203.241.251.177/recall/GetReport?carNo=112고8128");
        let response = await manager.start();
        if(response.ok)
            return response.json();
    }

    //뒤로가기 했을 때 앱 종료
    backPressed = () => {
        Alert.alert(
            '',
            '앱을 종료하시겠습니까?',
            [
                { text: '취소', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                { text: '확인', onPress: () => BackHandler.exitApp() },
            ],
            { cancelable: false });
        return true;
    }


    render() {
        return (
            <>
                <View style={{ flex: 1, alignItems: 'center' ,backgroundColor: '#4B89DC'}}>
                    <View style={{ backgroundColor: '#4B89DC', height: "30%", width: "100%", justifyContent: 'center', alignContent: 'center', flexDirection: 'row' }}>

                        <Icon style={{ marginTop: "25%" }} name='build-circle' size={45} color={'lightgrey'}></Icon>
                        <Text style={{ fontSize: 30, color: 'white', marginTop: "25%" }}> Check My Car</Text>
                    </View>
                    <View style={{ backgroundColor: '#FFFF', height: "80%", width: "100%",borderRadius:30 }}>
                        <View style={{flexDirection:'row',justifyContent:'center'}}>
                            {/* 카메라로 검색 */}
                            <Text style={styles.recallText}>자동차 번호판 사진을 찍어주세요</Text>
                            <Icon style={{ marginTop: "3%" }} name='arrow-right' size={35} color={'black'}></Icon>
                            
                            <TouchableOpacity
                                style={styles.cameraSearchButton}
                                onPress={this.goCameraButtonClicked}>
                                <Image
                                    source={require('../../../images/icon/camera-icon/camera-icon.png')}
                                />
                            </TouchableOpacity>
                           
                        </View>
                        <Text>   ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ </Text>
                        <View style={{marginTop:"3%"}}>
                        
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={styles.confirmbigText}>번호판</Text>
                                    <Icon name='expand-more' size={20} color={'#bdbebd'}></Icon>
                                </View>
                                <Text style={styles.confirmsmallText}>{this.carnumber}{"\n"}</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={styles.confirmbigText}>리콜현황</Text>
                                    <Icon name='expand-more' size={20} color={'#bdbebd'}></Icon>
                                </View>
                                <Text style={styles.confirmsmallText}>{this.state.recallscontent}{"\n"}</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={styles.confirmbigText}>무상점검수리</Text>
                                    <Icon name='expand-more' size={20} color={'#bdbebd'}></Icon>

                                </View>
                                <Text style={styles.confirmsmallText}>{this.state.repairscontent}{"\n"}</Text>



                            </ScrollView>
                        </View>
                    </View>
                </View>
            </>
        );
    }
}

export default Home;