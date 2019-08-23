/**
 * Created by ljunb on 16/8/21.
 */
import React, { Component } from 'react'
import { View,Text,Image } from 'react-native'

export default class Splash extends Component {
    componentDidMount() {
        const { navigation } = this.props
        this.timer = setTimeout(() => {
            navigation.navigate('TabBar')
        }, 2000)
    }

    componentWillUnmount() {
        clearTimeout(this.timer)
    }

    render() {
        return (
            <Image
                style={{width: gScreen.width, height: gScreen.height}}
                source={require('@resource/img_intro_4.png')}
            />
        )
    }
}