import React from 'react'
import {
    TouchableOpacity
} from 'react-native'


export default class ReconnectView extends React.Component{
    render(){
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
                onPress={this.props.onPress}
            >
                <Text>网络出错，点击重试~</Text>
            </TouchableOpacity>
        )
    }
}