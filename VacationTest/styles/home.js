//Home Style
import { Dimensions, StyleSheet } from 'react-native';
export const styles = StyleSheet.create({ //export를 해주어야 다른 곳에서 사용할 수 있음

  cameraSearchButton: {
    marginTop:5,
    marginLeft: 10,
    width: 54,
    height: 54,
    backgroundColor: '#4B89DC',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  headerText:{
    
    fontSize:30,
    marginLeft:'14%',
    color: 'white'
  },
  recallText:{
    fontFamily: "Cochin",
    fontSize:15,
    color: 'black',
    marginTop:"5%"
  },
  confirmbigText:{
    fontSize: 15,
    marginLeft: "2%", 
    color: "#bdbebd", 
    fontWeight: 'bold'
  },
  confirmsmallText:{
    marginTop:"1%",
    fontSize: 13,
    marginLeft: "2%", 
    color: "black", 
    fontWeight: 'bold'
  }


  
});