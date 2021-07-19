import React ,{Component} from 'react'
import {View, Text,TouchableOpacity,ScrollView,FlatList,StyleSheet} from 'react-native';
import {Card, Header, Icon} from 'react-native-elements';
import firebase from 'firebase'
import db from '../Config'

export default class ReceiverDetailsScreen extends Component{
    constructor(props){
        super(props);
        this.state={
            userID:firebase.auth().currentUser.email,
            receiverID:this.props.navigation.getParam("details")["userID"],
            requestID:this.props.navigation.getParam("details")["requestID"],
            bookName:this.props.navigation.getParam("details")["bookName"],
            Reason:this.props.navigation.getParam("details")["Reason"],
            receiverName:'',
            receiverContact:'',
            receiverAddress:'',
            receiverdocID:'',
            name:'',
            userID:firebase.auth().currentUser.email
        }
    }
    getUserDetails=(ID)=>{
        db.collection("users").where('email_id', "==", ID).get().then((snapshot)=>{
            snapshot.forEach((doc)=>{
                this.setState({name:doc.data().first_name+" "+doc.data().last_name})
            })
        })
    }
    getReceiverdetails=()=>{
        db.collection('users').where('email_id', '==', this.state.receiverID).get().then(snapshot=>{
            snapshot.forEach(doc=>{
                this.setState({
                    receiverName:doc.data().first_name,
                    receiverContact:doc.data().contact,
                    receiverAddress:doc.data().address,
                    
                })
            })
        })
        db.collection("requestedBooks").where('requestID', '==', this.state.requestID).get().then(snapshot=>{
            snapshot.forEach(doc=>{
                this.setState({
                    receiverdocID:doc.id
                })
            })
        })
    }
    updatebookstatus=()=>{
        db.collection('all_donations').add({
             book_name:this.state.bookName,
             request_id:this.state.requestID,
             requested_by:this.state.receiverName,
             donor_id:this.state.userID,
             request_status:"donor interested"
        })
    }
    componentDidMount(){
        this.getReceiverdetails();
        this.getUserDetails(this.state.userID)
    }
    addNotification=()=>{
        var message=this.state.name+" Has shown interest in donating the book";
        db.collection("all_notifications").add({
            targeted_user_id:this.state.receiverID, 
            donor_id:this.state.userID,
            request_id:this.state.requestID,
            book_name:this.state.bookName,
            date:firebase.firestore.FieldValue.serverTimestamp(),
            notification_status:"unread",
            message:message
        })
    }
    render(){
        return(
            <View style={styles.container}>
                <View style={{flex:0.1}}>
                    <Header
                    leftComponent={<Icon name='arrow-left' type='feather' color='#abc123' onPress={()=>this.props.navigation.goBack()} />}
                    centerComponent={{text:"Receiver Details", style:{color:'#abc123', fontSize:20, fontWieght:'bold'}}}
                    backgroundColor='#6e2c00'
                    />
                </View>
                <View style={{flex:0.3}}>
                    <Card title={"Book Information"} titleStyle={{fontSize:20}}>
                        <Card>
                            <Text style={{fontWeight:'bold'}}>Name : {this.state.bookName}</Text>
                        </Card> 
                        <Card>
                            <Text style={{fontWeight:'bold'}}>Reason : {this.state.Reason}</Text>
                        </Card>
                    </Card>
                </View>
                <View style={{flex:0.3}}>
                    <Card title={"Receiver Information"} titleStyle={{fontSize:20}}>
                        <Card>
                            <Text style={{fontWeight:'bold'}}>Name : {this.state.receiverName}</Text>
                        </Card> 
                        <Card>
                            <Text style={{fontWeight:'bold'}}>Contact : {this.state.receiverContact}</Text>
                        </Card>
                        <Card>
                            <Text style={{fontWeight:'bold'}}>Address : {this.state.receiverAddress}</Text>
                        </Card>
                    </Card>
                </View>
                <View>
                    {this.state.receiverID!=this.state.userID?(
                        <TouchableOpacity style={styles.button} onPress={()=>{
                            this.updatebookstatus();
                            this.addNotification()
                            this.props.navigation.navigate('Mydonations')
                        }}>
                            <Text>I want to donate</Text>
                        </TouchableOpacity>
                    ):null}
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container:{
      flex:1,
      justifyContent:'center',
      alignItems:'center',
      fontSize:20
    },
    formTextInput:{
      width:"75%",
      height:35,
      alignSelf:'center',
      borderColor:'#ffab91',
      borderRadius:10,
      borderWidth:1,
      marginTop:20,
      padding:10
    },
    button:{
      width:100,
      height:30,
      justifyContent:'center',
      alignItems:'center',
      borderRadius:25,
      backgroundColor:"#ff9800",
      shadowColor: "#000",
      shadowOffset: {
         width: 0,
         height: 8,
      },
      shadowOpacity: 0.30,
      shadowRadius: 10.32,
      elevation: 16,
      padding: 10
    },
    buttonText:{
      color:'#ffff',
      fontWeight:'200',
      fontSize:20
    }
   })