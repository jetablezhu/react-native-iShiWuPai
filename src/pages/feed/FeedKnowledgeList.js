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
    RefreshControl,
} from 'react-native'
import {observer} from 'mobx-react/native'
import {reaction} from 'mobx'
import Loading from '@components/Loading'
import LoadMoreFooter from '@components/LoadMoreFooter'
import FeedSingleImageCell from '@components/FeedSingleImageCell'
import FeedMultiImageCell from '@components/FeedMultiImageCell'
import Toast from 'react-native-easy-toast'
import FeedBaseStore from '@store/feedBaseStore'

const KNOWLEDGE_ID = 3

@observer
export default class FeedKnowledgeList extends Component {
    constructor(props){
        super(props)
        this.state={
            refreshing:false
        }
    }

    knowledgeListStore = new FeedBaseStore(KNOWLEDGE_ID)

    componentDidMount() {
        reaction(
            () => this.knowledgeListStore.page,
            () => this.knowledgeListStore.fetchFeedList()
        )
    }

    componentWillReact() {
        const {errorMsg} = this.knowledgeListStore
        errorMsg && this.toast.show(errorMsg)
    }

    _renderRow = ({item}) => {
        return <KnowledgeItem onPress={this._onPressCell} feed={item}/>
    }

    _onPressCell = feed => {
        this.props.navigation.push('FeedDetail',{feed})
    }

    _onRefresh = () => {
        this.knowledgeListStore.isRefreshing = true
        this.knowledgeListStore.fetchFeedList()
    }

    _onEndReach = () => this.knowledgeListStore.page ++

    _renderFooter = () => <LoadMoreFooter isNoMore={this.knowledgeListStore.isNoMore}/>

    render() {
        const {feedList, isRefreshing, isFetching} = this.knowledgeListStore
        return (
            <View style={styles.listView}>
                {!isFetching &&
                <FlatList
                    data={feedList.slice(0)}
                    keyExtractor={(item,index)=>index.toString()}
                    renderItem={this._renderRow}
                    ListFooterComponent={this._renderFooter}
                    onRefresh={()=>{}}
                    refreshing={this.state.refreshing}
                    onEndReached={this._onEndReach}
                    onEndReachedThreshold={0.1}
                />
                }
                <Loading isShow={isFetching}/>
                <Toast ref={toast => this.toast = toast}/>
            </View>
        )
    }
}

class KnowledgeItem extends Component {
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

        if (images.length == 1) {
            return <FeedSingleImageCell {...cellData} onPress={this._onPress}/>
        }
        return <FeedMultiImageCell {...cellData} onPress={this._onPress}/>
    }
}

const styles = StyleSheet.create({
    listView: {
        flex: 1,
        backgroundColor: '#f5f5f5'
    },
    loadingContainer: {
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    }
})