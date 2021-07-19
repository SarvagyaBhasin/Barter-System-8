import React,{Component} from 'react';
import {Header, Icon, Badge} from 'react-native-elements';
import {View, Text, StyleSheet} from 'react-native';
import { patchWebProps } from 'react-native-elements/dist/helpers';
import db from '../Config';
import { render } from 'react-dom';

export default class Myheader extends Component{
    constructor(props){
        super(props);
        this.state={value:''}

    }
getNotifications(){
    db.collection('all_notifications').where('notification_status', '==', 'unread').onSnapshot((snapshot)=>{
        var unread=snapshot.docs.map((doc)=>doc.data())
        this.setState({value:unread.length})
    })
}
componentDidMount(){
    this.getNotifications()
}
BellIconWithBadge=()=>{
    return(
        <View>
            <Icon name='bell' type='font-awesome' color='#393939' size={25}
            onPress={()=>this.props.naviagtion.navigate('Notification')}/>
            <Badge value={this.state.value} containerStyle={{position:'absolute', top:-4, right:-4}}></Badge>
        </View>
    )
}
render(){
    return(
        <Header
        leftComponent={<Icon name='bars' type='font-awesome' color='#393939' onPress={()=>{this.props.navigation.toggleDrawer()}}/>}
        centerComponent={{text:this.props.title, style:{color:'#90a5a9', fontSize:20, fontWeight:'bold'}}}
        rightComponent={<this.BellIconWithBadge{...this.props}/>}
        backgroundColor='#eaf8fe'
        
        />
    )
}
}