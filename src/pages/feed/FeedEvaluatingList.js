/**
 * Created by ljunb on 2016/11/19.
 * 逛吃-评测
 */
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    Image,
    ImageBackground,
    TouchableOpacity,
    RefreshControl
} from 'react-native';
import {observer} from 'mobx-react/native'
import {reaction} from 'mobx'
import Loading from '@components/Loading'
import LoadMoreFooter from '@components/LoadMoreFooter'
import Toast from 'react-native-easy-toast'
import FeedBaseStore from '@store/feedBaseStore'

const EVALUATING_ID = 2

@observer
export default class FeedEvaluatingList extends Component {

    constructor(props) {
        super(props);
        this.evaluatingListStore = new FeedBaseStore(EVALUATING_ID)
        this.state = {
            refreshing:false
        };
    }
    componentDidMount() {
        reaction(
            () => this.evaluatingListStore.page,
            () => this.evaluatingListStore.fetchFeedList()
        )
    }

    componentWillReact() {
        const {errorMsg} = this.evaluatingListStore
        errorMsg && this.toast.show(errorMsg)
    }

    _onRefresh = () => {
        this.evaluatingListStore.isRefreshing = true
        this.evaluatingListStore.fetchFeedList()
    }

    _onEndReach = () => this.evaluatingListStore.page ++

    _onPressCell = feed => {
        this.props.navigation.push('FeedDetail',{feed})
    }

    _renderRow = ({item}) => {
        return <EvaluatingItem onPress={this._onPressCell} feed={item}/>
    }

    _renderFooter = () => <LoadMoreFooter isNoMore={this.evaluatingListStore.isNoMore}/>

    render() {
        const {isFetching, isRefreshing, feedList} = this.evaluatingListStore
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
                    onEndReachedThreshold={0.01}
                />
                }
                <Loading isShow={isFetching}/>
                <Toast ref={toast => this.toast = toast}/>
            </View>
        )
    }
}

class EvaluatingItem extends Component {

    static propTypes = {
        feed: PropTypes.object,
        onPress: PropTypes.func
    }

    _onPress = () => {
        const {feed, onPress} = this.props
        onPress && onPress(feed)
    }

    render() {
        const {feed} = this.props
        return (
            <TouchableOpacity
                activeOpacity={0.75}
                style={{width: gScreen.width, paddingHorizontal: 15, marginTop: 15}}
                onPress={this._onPress}
            >
                <ImageBackground style={styles.image} source={{uri: feed.background}}>
                    <Text style={{color: '#fff', fontSize: 13}}>{feed.source}</Text>
                    <Text style={styles.feedTitle} numberOfLines={2}>{feed.title}</Text>
                    <View style={styles.imageContentWrapper}>
                        <Image
                            style={{width: 12, height: 12, marginRight: 3}}
                            source={require('@resource/ic_feed_read.png')}
                        />
                        <Text style={{color: '#fff', fontSize: 13}}>{feed.tail}</Text>
                    </View>
                </ImageBackground>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    listView: {
        flex: 1,
        backgroundColor: '#f5f5f5'
    },
    image: {
        width: gScreen.width - 15 * 2,
        height: gScreen.height * 0.3,
        paddingVertical: 20,
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'transparent'
    },
    feedTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        width: gScreen.width * 0.62,
        textAlign: 'center',
        lineHeight: 20,
        backgroundColor: 'rgba(1,1,1,0)'
    },
    imageContentWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    }
})