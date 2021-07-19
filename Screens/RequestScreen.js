import React,{Component}from 'react';
import {
    View,
    Text,
    TextInput,
    Modal,
    KeyboardAvoidingView,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ScrollView} from 'react-native';

import Myheader from '../Components/Myheader';
import db from '../Config';
import firebase from 'firebase';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default class RequestScreen extends Component{
    constructor(){
        super();
        this.state={
            userID:firebase.auth().currentUser.email,
            bookName:'',
            Reason:'',
            isBookRequestActive:'',
            bookStatus:'',
            requestID:'',
            userdocID:'',
            docID:'',
            requestedBookName:''
        }
    }
    createUniqueID(){
        return Math.random().toString(36).substring(7);
    }
    addrequest= async (bookName, Reason)=>{
        var userID=this.state.userID;
        var requestID=this.createUniqueID();
        db.collection('requestedBooks').add({
            "userID":userID,
            "requestID":requestID,
            "bookName":bookName,
            "Reason":Reason, 
            "bookStatus":"requested",
            "date":firebase.firestore.FieldValue.serverTimestamp()
        })
        await this.getBookRequest()
        db.collection('users').where('email_id', "==", userID).get().then((snapshot)=>{
          snapshot.forEach((doc)=>{
            db.collection('users').doc(doc.id).update({isBookRequestActive:true})
          })
        })
        this.setState({bookName:'', Reason:'', requestID:requestID});
        Alert.alert("Book Requested successfully")
    }
     getBookRequest=()=>{
      var bookRequest = db.collection('requestedBooks').where("userID", "==", this.state.userID).get().then((snapshot)=>{
        snapshot.forEach((doc)=>{
          if(doc.data().bookStatus!=="received"){
            this.setState({
              requestID:doc.data().requestID,
              requestedBookName:doc.data().bookName,
              bookStatus:doc.data().bookStatus,
              docID:doc.id
            })
          }
        })
      })
    }
    isBookRequestActive=()=>{
      db.collection('users').where('email_id', "==", this.state.userID).onSnapshot(qs=>{
        qs.forEach(doc=>{
          this.setState({isBookRequestActive:doc.data().isBookRequestActive, userdocID:doc.id})
        })
      })
    }
    componentDidMount(){
      this.getBookRequest()
      this.isBookRequestActive()

    }
    sendNotification=()=>{
      db.collection('users').where('email_id', "==", this.state.userID).onSnapshot(qs=>{
        qs.forEach((doc)=>{
          var name=doc.data().first_name
          var lastName=doc.data().last_name
          db.collection('all_notifications').where('request_id', '==', this.state.requestID).get().then((snapshot)=>{
            snapshot.forEach((doc)=>{
              var donorID= doc.data().donor_id
              var bookName=doc.data().book_name
              db.collection('all_notifications').add({
                targeted_user_id:donorID, 
                message:name+" "+lastName+" received the book "+bookName,
                notification_status:"unread",
                book_name:bookName
              })
            })
          })
          
        })
      })
    }
    receivedBooks=(bookName)=>{
      var userID=this.state.userID
      var requestID = this.state.requestID
      db.collection('receivedBooks').add({
        userID:userID,
        bookName:bookName,
        requestID:requestID,
        bookStatus:"received"
      })
    }
    updateBookStatus=()=>{
      db.collection('requestedBooks').doc(this.state.docID).update({bookStatus:'received'})
      db.collection('users').where('email_id', "==", this.state.userID).onSnapshot(qs=>{
        qs.forEach(doc=>{
          db.collections('users').doc(doc.id).update({isBookRequestActive:false})
        })
      })
    }
    render(){
      if(this.state.isBookRequestActive==true){
        <View>
          <View>
            <Text>Book Name: {this.state.requestedBookName}</Text>
            <Text>Book Status: {this.state.bookStatus}</Text>
            <TouchableOpacity style={styles.button} 
             onPress={()=>{
              this.sendNotification()
              this.updateBookStatus()
              this.receivedBooks(this.state.requestedBookName)
            }}>
              <Text>I received the item</Text>
            </TouchableOpacity>
          </View>
        </View>
      }else{
        return(
          <SafeAreaProvider>
            <View style={{flex:1}}>
                <Myheader title="Request Book" navigation={this.props.navigation}/>
                <KeyboardAvoidingView style={styles.KeyboardAvoidingView}>
                    <TextInput style={styles.formTextInput}
                    placeholder={"BookName"}
                    onChangeText={(text)=>{this.setState({bookName:text})}}
                    value={this.state.bookName}
                    />
                     <TextInput
                    placeholder={"reason"}
                    onChangeText={(text)=>{this.setState({Reason:text})}}
                    value={this.state.Reason}
                    />
                    <TouchableOpacity
           style={styles.button}
           onPress = {()=>{
             this.addrequest(this.state.bookName, this.state.Reason)
           }}
           >
           <Text style={styles.buttonText}>Request</Text>
         </TouchableOpacity>
                </KeyboardAvoidingView>
            </View>
            </SafeAreaProvider>
        )
      }
        
    }
}
const styles = StyleSheet.create({
   KeyboardAvoidingView:{
     flex:1,
     justifyContent:'center',
     alignItems:'center'
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
     width:300,
     height:50,
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