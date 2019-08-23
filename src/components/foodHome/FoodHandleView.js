import React from 'react'
import {
    StyleSheet,
    View
} from 'react-native'
import HandleItem from '@foodHome/HandleItem'

export default class FoodHandleView extends React.Component{
    render(){
        return (
            <View style={styles.foodHandleContainer}>
                <HandleItem title="饮食分析"
                            imageName={require('@resource/ic_home_analyse.png')}
                            onPress={() => this.props.handleAction('饮食分析')}
                />
                <View style={styles.line}/>
                <HandleItem title="搜索对比"
                            imageName={require('@resource/ic_search_compare.png')}
                            onPress={() => this.props.handleAction('搜索对比')}/>
                <View style={styles.line}/>
                <HandleItem title="扫码对比"
                            imageName={require('@resource/ic_scan_compare.png')}
                            onPress={() => this.props.handleAction('扫码对比')}/>
            </View>
        )
    }
}

const styles=StyleSheet.create({
    foodHandleContainer: {
        height: 60,
        width: gScreen.width - 16 * 2,
        backgroundColor: 'white',
        marginTop: 10,
        alignItems: 'center',
        flexDirection: 'row',
        shadowColor: 'gray',
        shadowOpacity: 0.3,
        shadowOffset: {width: 1, height: -1},
        shadowRadius: 2,
    }
})