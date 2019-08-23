/**
 * Created by ljunb on 2016/12/9.
 * 食物百科页面
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
} from 'react-native'
import {observer, inject} from 'mobx-react/native'
import FoodEncyclopediaStore from '@store/foodEncyclopediaStore'
import NetInfoDecorator from '@common/NetInfoDecorator'
import Toast from 'react-native-easy-toast'
import Loading from '@components/Loading'
import FoodCategoryView from '@foodHome/FoodCategoryView'
import HeaderView from '@foodHome/HeaderView'
import FoodHandleView from '@foodHome/FoodHandleView'
import ReconnectView from '@foodHome/ReconnectView'

@NetInfoDecorator
@inject('account', 'app')
@observer
export default class FoodEncyclopedia extends Component {
    constructor(props){
        super(props)
        this.foodEncyclopediaStore = new FoodEncyclopediaStore()
    }

    componentWillReact() {
        const {errorMsg} = this.foodEncyclopediaStore
        errorMsg && this.toast && this.toast.show(errorMsg)
    }

    componentWillReceiveProps(nextProps) {
        const {isConnected} = nextProps
        const {isNoResult} = this.foodEncyclopediaStore
        if (isConnected && isNoResult) {
            this.foodEncyclopediaStore.fetchCategoryList()
        }
    }

    searchAction(){
        alert('search')
    }

    resetBarStyl(){
        this.props.app.updateBarStyle('light-content')
    }

    foodHandleAction(handleTitle){
        const {account: {name}, app} = this.props
        switch (handleTitle) {
            case '饮食分析':
                if (name) {
                    alert(name)
                } else {
                    this.props.navigation.push('Login',{onResetBarStyle: this.resetBarStyle})
                }
                break;
            case '搜索对比':
                if (name) {
                    alert(name)
                } else {
                    this.props.navigation.push('Login',{onResetBarStyle: this.resetBarStyle})
                }
                break
            case '扫码对比':
                this.props.navigation.push('Scanner',{
                        onBarCodeRead: obj => alert(JSON.stringify(obj))
                    })
                break
        }
    }

    _onPressCategoryItem(kind, category){
        const {app, navigation} = this.props
        app.updateBarStyle('default')
        navigation.push('Foods',{
                kind,
                category,
                onResetBarStyle: this.resetBarStyle
            }
        )
    }

    _reconnectHandle(){
        this.foodEncyclopediaStore.fetchCategoryList()
    }

    render() {
        const {foodCategoryList, isFetching} = this.foodEncyclopediaStore
        const {isConnected} = this.props

        return (
            <View style={{flex: 1}}>
                <ScrollView
                    bounces={false}
                    showsVerticalScrollIndicator={false}
                    automaticallyAdjustContentInsets={false}
                    removeClippedSubviews
                    style={{width: gScreen.width, height: gScreen.height}}
                    contentContainerStyle={{alignItems: 'center', backgroundColor: '#f5f5f5', paddingBottom: 10}}
                >
                    <HeaderView searchAction={this.searchAction}/>
                    <FoodHandleView handleAction={this.foodHandleAction.bind(this)}/>
                    {isConnected ?
                        <View>
                            {foodCategoryList.map(foodCategory => {
                                return (
                                    <FoodCategoryView
                                        key={`FoodCategory-${foodCategory.kind}`}
                                        foodCategory={foodCategory}
                                        onPress={this._onPressCategoryItem.bind(this)}
                                    />
                                )
                            })}
                        </View> : <ReconnectView onPress={this._reconnectHandle.bind(this)}/>}
                </ScrollView>
                <Loading isShow={isFetching}/>
                <Toast ref={toast => this.toast = toast}/>
            </View>
        )
    }
}
