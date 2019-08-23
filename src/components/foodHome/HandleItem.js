import React from 'react'
import {
    StyleSheet,
    TouchableOpacity,
    Image,
    Text
} from 'react-native'

export default class HandleItem extends React.Component{
    render(){
        return (
            <TouchableOpacity
                activeOpacity={0.75}
                style={styles.handelItem}
                onPress={this.props.onPress}
            >
                <Image style={{width: 28, height: 28}} source={this.props.imageName}/>
                <Text style={{fontSize: 13, color: 'gray'}}>{this.props.title}</Text>
            </TouchableOpacity>
        )
    }
}

const styles=StyleSheet.create({
    handelItem: {
        flex: 1,
        height: 60,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 5
    }
})