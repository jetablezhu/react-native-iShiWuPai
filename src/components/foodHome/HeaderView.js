import React,{Component} from 'react'
import {
    StyleSheet,
    View,
    Text,
    Image,
    ImageBackground,
    TouchableOpacity
} from 'react-native'

export default class HeaderView extends Component {

    render(){
        return (
            <ImageBackground
                style={styles.headerContainer}
                source={require('@resource/img_home_bg.png')}
            >
                <Image
                    style={styles.headerLogo}
                    source={require('@resource/ic_head_logo.png')}
                    resizeMode="contain"
                />
                <View style={{alignItems: 'center'}}>
                    <Text style={{color: 'white', marginBottom: 15, fontSize: 15}}>查 询 食 物
                        信 息</Text>
                    <TouchableOpacity
                        activeOpacity={0.75}
                        style={styles.headerSearchContainer}
                        onPress={this.props.searchAction}
                    >
                        <Image style={{width: 20, height: 20, marginHorizontal: 5}}
                            source={require('@resource/ic_home_search.png')}/>
                        <Text style={{color: 'rgba(222, 113, 56, 0.8)', fontSize: 15}}>请输入食物名称</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        )
    }
}

const styles=StyleSheet.create({
    headerContainer: {
        height: 220,
        width: gScreen.window,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 15,
        paddingBottom: 28,
        paddingHorizontal: 16,
        backgroundColor: 'rgba(1,1,1,0)',
        overflow: 'hidden'
    },
    headerLogo: {
        width: 66,
        height: 24,
    },
    headerSearchContainer: {
        height: 50,
        width: gScreen.width - 16 * 2,
        backgroundColor: 'white',
        borderRadius: 4,
        alignItems: 'center',
        flexDirection: 'row'
    }
})