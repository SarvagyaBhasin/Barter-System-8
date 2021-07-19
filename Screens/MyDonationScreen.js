import React ,{Component} from 'react'
import {View, Text,TouchableOpacity,ScrollView,FlatList,StyleSheet} from 'react-native';
import {Card,Icon,ListItem} from 'react-native-elements'
import MyHeader from '../Components/Myheader.js'
import firebase from 'firebase';
import db from '../Config.js'
import {SafeAreaProvider} from 'react-native-safe-area-context'
export default class MyDonationScreen extends Component {
  static navigationOptions = { header: null };

   constructor(){
     super()
     this.state = {
       userId : firebase.auth().currentUser.email,
       allDonations : [],
       donorName:''
     }
     this.requestRef= null
   }

   getDonorDetails=(ID)=>{
    db.collection("users").where('email_id', "==", ID).get().then((snapshot)=>{
      snapshot.forEach((doc)=>{
          this.setState({donorName:doc.data().first_name+" "+doc.data().last_name})
      })
  })   
 }
  sendBook=(Detials)=>{
    if(Detials.request_status=="Book Sent"){
      var status="donor interested";
      db.collection("all_donations").doc(Details.doc_id).update({
        request_status:status
      })
      this.sentNotification(Details, status)
    }else{
      var status="Book Sent";
      db.collection("all_donations").doc(Details.doc_id).update({
        request_status:status
      })
      this.sentNotification(Details, status)
    }
  }
  sentNotification=(Details, status)=>{
    var request_id=Details.request_id
    var donor_id=Details.donor_id
    db.collection("all_notifications").where("request_id", "==", request_id).where("donor_id", "==", donor_id).get()
    .then((snapshot)=>{
      snapshot.forEach((doc)=>{
        var message=""
        if(status=="Book Sent"){
          message=this.state.donorName+" send you a book"
        }else{
          message=this.state.donorName+" is interested in donating the book"
        }
        db.collection("all_notifications").doc(doc.id).update({
          message:message,
          notification_status:"Unread",
          date:firebase.firestore.FieldValue.serverTimestamp()
        })
      })
    })
  }
   getAllDonations =()=>{
     this.requestRef = db.collection("all_donations").where("donor_id" ,'==', this.state.userId)
     .onSnapshot((snapshot)=>{
       var allDonations = snapshot.docs.map(document => document.data());
       this.setState({
         allDonations : allDonations,
       });
     })
   }

   keyExtractor = (item, index) => index.toString()

   renderItem = ( {item, i} ) =>(
     <ListItem
       key={i}
       title={item.book_name}
       subtitle={"Requested By : " + item.requested_by +"\nStatus : " + item.request_status}
       leftElement={<Icon name="book" type="font-awesome" color ='#696969'/>}
       titleStyle={{ color: 'black', fontWeight: 'bold' }}
       rightElement={
           <TouchableOpacity style={styles.button} onPress={()=>{this.sendBook(item)}}>
             <Text style={{color:'#ffff'}}>{item.request_status=="Book Sent"?"Book Sent":"Send Book"}</Text>
           </TouchableOpacity>
         }
       bottomDivider
     />
   )


   componentDidMount(){
     this.getAllDonations()
   }

   componentWillUnmount(){
     this.requestRef=null;
   }

   render(){
     return(
       <SafeAreaProvider>
       <View style={{flex:1}}>
         <MyHeader navigation={this.props.navigation} title="My Donations"/>
         <View style={{flex:1}}>
           {
             this.state.allDonations.length === 0
             ?(
               <View style={styles.subtitle}>
                 <Text style={{ fontSize: 20}}>List of all item Donations</Text>
               </View>
             )
             :(
               <FlatList
                 keyExtractor={this.keyExtractor}
                 data={this.state.allDonations}
                 renderItem={this.renderItem}
               />
             )
           }
         </View>
       </View>
       </SafeAreaProvider>
     )
   }
   }


const styles = StyleSheet.create({
  button:{
    width:100,
    height:30,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:"#ff5722",
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8
     },
    elevation : 16
  },
  subtitle :{
    flex:1,
    fontSize: 20,
    justifyContent:'center',
    alignItems:'center'
  }
})
