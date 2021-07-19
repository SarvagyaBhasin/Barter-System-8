import React,{Component}from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity} from 'react-native';
import { Avatar } from 'react-native-elements';
import *as ImagePicker from 'expo-image-picker';
import *as Permissions from 'expo-permissions'
import {DrawerItems} from 'react-navigation-drawer'
import firebase from 'firebase';
import db from '../Config'
import { ScreenStackHeaderBackButtonImage } from 'react-native-screens';
//import axios from 'axios'

export default class Sidebar extends Component{
constructor(){
    super();
    this.state={userID:firebase.auth().currentUser.email, image:'#', name:'', docID:''}

}
getUserProfile(){
    db.collection("users").where('email_id', "==", this.state.userID).get().then((snapshot)=>{
        snapshot.forEach((doc)=>{
            this.setState({name:doc.data().first_name+" "+doc.data().last_name, docID:doc.id, image:doc.data().image})
        })
    })
}
fetchImage=(imageName)=>{
    var storageref=firebase.storage().ref().child("user_profiles/"+imageName);
    storageref.getDownloadURL().then((url)=>{
        this.setState({image:url})
    }).catch((error)=>{
        this.setState({image:'#'})
    })
}
componentDidMount(){
    this.fetchImage(this.state.userID);
    this.getUserProfile()
}
selectPicture=async()=>{
    const {cancelled, uri}=await ImagePicker.launchImageLibraryAsync({
        mediaTypes:ImagePicker.MediaTypeOptions.All, allowsEditing:true, aspect:[4, 3], quality:1
    })
    if(!cancelled){
        this.uploadImage(uri, this.state.userID)
        
    }
}
uploadImage=async(uri, imageName)=>{
    var response= await fetch(uri);
    var blob= await response.blob();
    var ref= firebase.storage().ref().child("user_profiles/"+imageName);
    return ref.put(blob).then((responds)=>{
        this.fetchImage(imageName)
    })
}
    render(){
        return(
            <View style={{flex:1}}>
                <View style={{flex:0.5, alignItems:'center', backgroundColor:"orange"}}>
                    <Avatar rounded source={{uri:this.state.image}}
                    size="medium"
                    onPress={()=>this.selectPicture()}
                    containerStyle={{flex:0.75, width:'40%', height:'20%', marginLeft:20, marginTop:30, borderRadius:40}}
                    showEditButton
                    ></Avatar>
                    <Text style={{fontWeight:'bold',fontSize:20, paddingTop:10 }}>{this.state.name}</Text>
                </View>
                <View style={{flex:0.8}}>
                    <DrawerItems {...this.props}></DrawerItems>
                </View>
                <View style={{flex:0.2, justifyContent:'flex-end', paddingBottom:30}}>
                    <TouchableOpacity style={{height:30, width:'100%', justifyContent:'center', padding:10}}
                    onPress={()=>{
                        this.props.navigation.navigate('LoginScreen');
                        firebase.auth().signOut()
                    }}>
                        <Text style={{fontWeight:'bold', fontSize:25}}>Log Out</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}