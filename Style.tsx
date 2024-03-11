import {Platform, StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
      },
      containerChessMoves: {
       
       marginBottom:hp(1)
      },
      buttonStyle: { justifyContent: 'center', alignItems: 'center', backgroundColor: '#94E6F0', paddingHorizontal: 10, paddingVertical: 5, marginTop: 70, borderRadius: 5, },
      titleContainer: {
        width: '100%',
        padding: 15,
        backgroundColor: '#94E6F0',
        marginBottom: 100
      },
      title: {
        fontSize: 15,
        fontWeight: '900',
        color: 'black'
      },
      buttonStyle1: { justifyContent: 'flex-end', alignItems: 'flex-end', },
      buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10
      },
      moveContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        paddingHorizontal: 10,
        
      },
      moveStyle:{ color: 'white',paddingRight:wp(25) ,fontSize:wp(3.5),paddingVertical:wp(0.5)},
      moveTitle:{ color: 'white',paddingLeft:wp(3),fontSize:wp(4),paddingVertical:hp(2) },
    
    });

export default styles;
