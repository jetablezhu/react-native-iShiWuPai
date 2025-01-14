/**
 * Created by ljunb on 16/5/26.
 */
import React, {Component} from 'react'
import {observer, inject} from 'mobx-react/native'
import Feed from '@pages/feed/Feed'
import FoodEncyclopedia from '@pages/home/FoodEncyclopedia'
import Profile from '@pages/profile/Profile'
import TabBar from '@components/TabBar'
import ScrollableTabView from 'react-native-scrollable-tab-view'

const tabTitles = ['食物百科', '逛吃', '我的']
const tabIcons = [
    require('@resource/ic_tab_search.png'),
    require('@resource/ic_tab_homepage.png'),
    require('@resource/ic_tab_my.png')
]
const tabSelectedIcon = [
    require('@resource/ic_tab_search_select.png'),
    require('@resource/ic_tab_homepage_select.png'),
    require('@resource/ic_tab_my_select.png')
]

@inject('app')
@observer
export default class TabBarView extends Component {

    onChangeTab = ({i}) => {
        const {app} = this.props
        if (i === 1) {
            app.updateBarStyle('default')
        } else {
            app.updateBarStyle('light-content')
        }
    }

    renderTabBar = () => {
        return (
            <TabBar
                tabNames={tabTitles}
                tabIconNames={tabIcons}
                selectedTabIconNames={tabSelectedIcon}
            />
        )
    }

    render() {
        return (
            <ScrollableTabView
                locked
                scrollWithoutAnimation
                renderTabBar={this.renderTabBar}
                tabBarPosition='bottom'
                onChangeTab={this.onChangeTab}
            >
                <FoodEncyclopedia tabLabel="Food" navigation={this.props.navigation}/>
                <Feed tabLabel="Home" navigation={this.props.navigation}/>
                <Profile tabLabel="Profile" navigation={this.props.navigation}/>
            </ScrollableTabView>
        )
    }
}