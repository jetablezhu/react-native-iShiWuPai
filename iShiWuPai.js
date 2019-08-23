/**
 * Created by ljunb on 2017/5/25.
 */
import React from 'react'
import {StatusBar,Animated, StyleSheet, View,SafeAreaView, Text, AppRegistry} from 'react-native'
import {Provider} from 'mobx-react/native'
import stores from '@store'
import NetInfoDecorator from '@common/NetInfoDecorator'
import AppContainer from "@pages/AppContainer"

if (!__DEV__) {
    global.console = {
        log: () => {}
    }
}

@NetInfoDecorator
export default class Root extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            promptPosition: new Animated.Value(0)
        }
    }

    componentWillReceiveProps(nextProps) {
        const {isConnected} = nextProps
        // 无网络
        if (!isConnected) {
            Animated.timing(this.state.promptPosition, {
                toValue: 1,
                duration: 200
            }).start(() => {
                setTimeout(() => {
                    Animated.timing(this.state.promptPosition, {
                        toValue: 0,
                        duration: 200
                    }).start()
                }, 2000);
            })
        }
    }

    render() {
        let positionY = this.state.promptPosition.interpolate({
            inputRange: [0, 1],
            outputRange: [-30, __IOS__ ? 20 : 0]
        });
        return (
            <SafeAreaView style={{flex: 1,backgroundColor:'#fff'}}>
                <Provider {...stores}>
                    <View style={{flex:1}}>
                        <StatusBar barStyle={stores.app.barStyle} animated />
                        <AppContainer />
                    </View>
                </Provider>
                <Animated.View style={[styles.netInfoView, {top: positionY}]}>
                    <Text style={styles.netInfoPrompt}>网络异常，请检查网络稍后重试~</Text>
                </Animated.View>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    netInfoView: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 30,
        position: 'absolute',
        right: 0,
        left: 0,
        backgroundColor: gColors.theme
    },
    netInfoPrompt: {
        color: 'white',
        fontWeight: 'bold'
    }
})

AppRegistry.registerComponent('new_version', () => Root)