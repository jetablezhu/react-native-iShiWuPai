/**
 * Created by ljunb on 2016/11/19.
 * 逛吃-知识
 */
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
    StyleSheet,
    View,
    FlatList,
    RefreshControl
} from 'react-native'
import {observer} from 'mobx-react/native'
import {reaction} from 'mobx'
import Loading from '@components/Loading'
import LoadMoreFooter from '@components/LoadMoreFooter'
import FeedSingleImageCell from '@components/FeedSingleImageCell'
import FeedMultiImageCell from '@components/FeedMultiImageCell'
import Toast from 'react-native-easy-toast'
import FeedBaseStore from '@store/feedBaseStore'

const DELICACY_ID = 4

@observer
export default class FeedDelicacyList extends Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.delicacyListStore = new FeedBaseStore(DELICACY_ID)
        this.state={
            refreshing:false
        }
    }

    componentDidMount() {
        reaction(
            () => this.delicacyListStore.page,
            () => this.delicacyListStore.fetchFeedList()
        );
    }

    componentWillReact() {
        const {errorMsg} = this.delicacyListStore
        errorMsg && this.toast.show(errorMsg)
    }

    _renderRow = ({item}) => {
        return  <DelicacyItem onPress={this._onPressCell} feed={item}/>
    }

    _onRefresh = () => {
        this.delicacyListStore.isRefreshing = true;
        this.delicacyListStore.fetchFeedList()
    };

    _onEndReach = () => this.delicacyListStore.page++

    _renderFooter = () => <LoadMoreFooter isNoMore={this.delicacyListStore.isNoMore}/>

    _onPressCell = feed => {
        this.props.navigation.push('FeedDetail',{feed})
    }

    render() {
        const {isRefreshing, isFetching, feedList} = this.delicacyListStore
        return (
            <View style={styles.listView}>
                {!isFetching &&
                <FlatList
                    data={feedList.slice(0)}
                    renderItem={this._renderRow}
                    keyExtractor={(item,index)=>index.toString()}
                    ListFooterComponent={this._renderFooter}
                    onEndReached={this._onEndReach}
                    onEndReachedThreshold={0.1}
                    onRefresh={()=>{this.delicacyListStore.page=1}}
                    refreshing={this.state.refreshing}
                />
                }
                <Loading isShow={isFetching}/>
                <Toast ref={toast => this.toast = toast}/>
            </View>
        )
    }
}

class DelicacyItem extends Component {

    static propTypes = {
        feed: PropTypes.object,
        onPress: PropTypes.func
    }

    _onPress = () => {
        const {feed, onPress} = this.props
        onPress && onPress(feed)
    }

    render() {
        const {feed: {title, source, tail, images}} = this.props
        const cellData = {title, source, images, viewCount: tail}

        if (images.length === 1) {
            return <FeedSingleImageCell {...cellData} onPress={this._onPress}/>
        }
        return <FeedMultiImageCell {...cellData} onPress={this._onPress}/>
    }
}

const styles = StyleSheet.create({
    listView: {
        flex: 1,
        backgroundColor: '#f5f5f5'
    }
})