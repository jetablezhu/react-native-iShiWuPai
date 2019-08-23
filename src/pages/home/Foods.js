/**
 * Created by ljunb on 2017/3/15.
 * 首页->分类->食物列表
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Animated,
  ScrollView,
  ActivityIndicator
} from "react-native";
import { observer } from "mobx-react/native";
import { reaction } from "mobx";
import Header from "@components/Header";
import Loading from "@components/Loading";
import LoadMoreFooter from "@components/LoadMoreFooter";
import FoodsStore from "@store/foodsStore";

@observer
export default class Foods extends Component {
  constructor(props) {
    super(props);
    this.pageParams = this.props.navigation.state.params;
    this.foodsStore = new FoodsStore(
      this.pageParams.kind,
      this.pageParams.category.id
    );
    this.state = {
      sortTypes: [],
      subCategory: "全部",
      sortCode: "calory",
      refreshing: false
    };
  }

  componentDidMount() {
    this.dispose = reaction(
      () => [
        this.foodsStore.page,
        this.foodsStore.orderBy,
        this.foodsStore.orderAsc,
        this.foodsStore.sub_value
      ],
      () => this.foodsStore.fetchFoods()
    );
    this._fetchSortTypes();
  }

  componentWillUnmount() {
    this.dispose();
  }

  async _fetchSortTypes() {
    const URL = "http://food.boohee.com/fb/v1/foods/sort_types";
    try {
      const result = await fetch(URL).then(response => response.json());
      this.setState({ sortTypes: result.types });
    } catch (error) {
      alert(`[Foods] fetch sort types error: ${error}`);
    }
  }

  _onBack() {
    const { onResetBarStyle, navigation } = this.props;
    navigation.pop();
    onResetBarStyle && onResetBarStyle();
  }

  _onPressFoodItem(food) {
    alert(JSON.stringify(food));
  }

  _onSelectSortType(type) {
    this.setState({ sortCode: type.code });
    this.foodsStore.orderBy = type.index;
    this.foodsStore.page = 1;
  }

  _onChangeOrderAsc(orderAsc) {
    this.foodsStore.orderAsc = orderAsc;
    this.foodsStore.page = 1;
  }

  _onPressRightItem() {
    this.subCategory.show();
  }

  _onSelectSubCategory(subCategory) {
    const {
      category: { id }
    } = this.pageParams;
    this.foodsStore.sub_value = subCategory.id == id ? "" : subCategory.id;
    this.foodsStore.page = 1;
    this.setState({ subCategory: subCategory.name });
  }

  _onLoadMore() {
    if (!this.foodsStore.isNoMore) {
      this.foodsStore.page++;
    }
  }

  _renderRightItem() {
    const {
      category: { sub_categories }
    } = this.pageParams;
    if (sub_categories.length == 0) return null;

    const { subCategory } = this.state;
    return (
      <TouchableOpacity
        activeOpacity={0.75}
        style={{ flexDirection: "row", alignItems: "center" }}
        onPress={this._onPressRightItem.bind(this)}
      >
        <Text style={{ color: "gray", fontSize: 12, marginRight: 3 }}>
          {subCategory}
        </Text>
        <Image
          source={require("../../resource/ic_bullet_down_gray.png")}
          style={{ width: 13, height: 16 }}
          resizeMode="contain"
        />
      </TouchableOpacity>
    );
  }

  _renderRow = ({ item }) => {
    const { sortCode } = this.state;
    return (
      <FoodItem
        food={item}
        onPress={this._onPressFoodItem}
        sortCode={sortCode}
      />
    );
  };

  _renderFooter() {
    const { foods } = this.foodsStore;
    if (foods.length == 0) return null;

    return <LoadMoreFooter isNoMore={this.foodsStore.isNoMore} />;
  }

  render() {
    const {
      category: { id, name, sub_categories }
    } = this.pageParams;
    const { foods } = this.foodsStore;
    const { sortTypes } = this.state;

    return (
      <View style={{ flex: 1, backgroundColor: gColors.background }}>
        <Header
          title={name}
          onBack={this._onBack.bind(this)}
          style={{ zIndex: 3 }}
          renderRightItem={this._renderRightItem.bind(this)}
        />
        {sub_categories.length > 0 && (
          <FoodSubCategoryHandleView
            ref={r => (this.subCategory = r)}
            categoryId={id}
            subCategories={sub_categories}
            onSelectSubCategory={this._onSelectSubCategory.bind(this)}
          />
        )}
        <FoodSiftHandleView
          sortTypes={sortTypes}
          onSelectSortType={this._onSelectSortType.bind(this)}
          onChangeOrderAsc={this._onChangeOrderAsc.bind(this)}
        />
        <FlatList
          style={{ backgroundColor: "rgba(220, 220, 220, 0.2)" }}
          data={foods.slice()}
          keyExtractor={(item, index) => index.toString()}
          renderItem={this._renderRow}
          ListFooterComponent={this._renderFooter.bind(this)}
          onRefresh={() => {this.foodsStore.page=1}}
          refreshing={this.state.refreshing}
          onEndReached={this._onLoadMore.bind(this)}
          onEndReachedThreshold={0.01}
        />
        <Loading isShow={this.foodsStore.isFetching} />
      </View>
    );
  }
}

class FoodSubCategoryHandleView extends Component {
  static propTypes = {
    subCategories: PropTypes.object,
    categoryId: PropTypes.number,
    onSelectSubCategory: PropTypes.func
  };
  constructor(props) {
    super(props);
    this.heightValue = new Animated.Value(0);
    this.state = {
      isShow: false,
      subCategories: []
    };
  }

  componentWillReceiveProps(nextProps) {
    const { subCategories, categoryId } = nextProps;
    this.setState({
      subCategories: [{ id: categoryId, name: "全部" }, ...subCategories]
    });
  }

  show() {
    this.setState({ isShow: true }, () => {
      Animated.spring(this.heightValue, {
        toValue: 1,
        duration: 250
      }).start();
    });
  }

  _close() {
    Animated.spring(this.heightValue, {
      toValue: 0,
      duration: 250
    }).start(() => this.setState({ isShow: false }));
  }

  _onPress(subCategory) {
    const { onSelectSubCategory } = this.props;
    Animated.spring(this.heightValue, {
      toValue: 0,
      duration: 250
    }).start(() => {
      onSelectSubCategory && onSelectSubCategory(subCategory);
      this.setState({ isShow: false });
    });
  }

  _renderSubCategory(subCategory, key) {
    const { name } = subCategory;
    const { subCategories } = this.state;
    const isLastItem = key == subCategories.length - 1;

    return (
      <TouchableOpacity
        key={`${name}-${key}`}
        activeOpacity={0.75}
        style={[styles.subcategoryItem, isLastItem && { borderBottomWidth: 0 }]}
        onPress={() => this._onPress(subCategory)}
      >
        <Text style={{ color: "#fff", fontSize: 13 }}>{name}</Text>
      </TouchableOpacity>
    );
  }

  render() {
    if (!this.state.isShow) return null;
    const { subCategories } = this.state;
    const top = this.heightValue.interpolate({
      inputRange: [0, 1],
      outputRange: [-34 * subCategories.length, 0]
    });

    return (
      <View
        style={{
          zIndex: 2,
          position: "absolute",
          top: gScreen.navBarHeight,
          left: 0
        }}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.subcategoryWrapper}
          onPress={this._close.bind(this)}
        >
          <Animated.View style={[styles.subcategoryAnimatedWrapper, { top }]}>
            {subCategories.map(this._renderSubCategory.bind(this))}
          </Animated.View>
        </TouchableOpacity>
      </View>
    );
  }
}

class FoodSiftHandleView extends Component {
  static propTypes = {
    sortTypes: PropTypes.array,
    onSelectSortType: PropTypes.func,
    onChangeOrderAsc: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.orderByModalYValue = new Animated.Value(0);
    this.state = {
      isShow: false,
      currentType: "常见",
      orderAsc: 1
    };
  }

  show = () => {
    this.setState({ isShow: true }, () => {
      Animated.timing(this.orderByModalYValue, {
        toValue: 1,
        duration: 250
      }).start();
    });
  };

  _close = () => {
    Animated.timing(this.orderByModalYValue, {
      toValue: 0,
      duration: 250
    }).start(() => this.setState({ isShow: false }));
  };

  _onChangeOrderAsc = () => {
    const { orderAsc } = this.state;
    const { onChangeOrderAsc } = this.props;
    this.setState({ orderAsc: orderAsc == 0 ? 1 : 0 }, () => {
      onChangeOrderAsc && onChangeOrderAsc(orderAsc);
    });
  };

  _onPressSortTypeCell = type => {
    const { onSelectSortType } = this.props;
    this.setState({ currentType: type.name });
    Animated.timing(this.orderByModalYValue, {
      toValue: 0,
      duration: 250
    }).start(() => {
      onSelectSortType && onSelectSortType(type);
      this.setState({ isShow: false });
    });
  };

  _renderSortTypeCell = (type, key) => {
    const { sortTypes } = this.props;
    const { currentType } = this.state;
    const isLast = sortTypes.length - 1 == key;
    const titleStyle = [{ fontSize: 13, color: "#333" }];
    if (currentType == type.name) titleStyle.push({ color: "rgb(253,84,94)" });
    return (
      <TouchableOpacity
        key={`${type.name}-${key}`}
        activeOpacity={0.75}
        style={[styles.sortTypeItem, isLast && { width: gScreen.width }]}
        onPress={() => this._onPressSortTypeCell(type)}
      >
        <Text style={titleStyle}>{type.name}</Text>
      </TouchableOpacity>
    );
  };

  render() {
    const { sortTypes } = this.props;
    const { isShow, currentType, orderAsc } = this.state;
    const backgroundColor = this.orderByModalYValue.interpolate({
      inputRange: [0, 1],
      outputRange: ["transparent", "rgba(1,1,1,0.3)"]
    });

    const contentHeight = gScreen.height * 0.4;
    const contentYPosition = this.orderByModalYValue.interpolate({
      inputRange: [0, 1],
      outputRange: [-contentHeight, 0]
    });

    const rotate = isShow ? "180deg" : "0deg";
    const orderAscSrc =
      orderAsc == 1
        ? require("../../resource/ic_food_ordering_down.png")
        : require("../../resource/ic_food_ordering_up.png");
    const orderAscStr = orderAsc == 1 ? "由高到低" : "由低到高";

    return (
      <View style={{ zIndex: 1 }}>
        <View
          style={[
            styles.siftWrapper,
            { zIndex: 1 },
            isShow && { borderBottomWidth: StyleSheet.hairlineWidth }
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.75}
            style={styles.siftCell}
            onPress={this.show}
          >
            <Text style={styles.orderByFont}>{currentType}</Text>
            <Image
              style={{ width: 16, height: 16, transform: [{ rotate }] }}
              source={require("../../resource/ic_food_ordering.png")}
            />
          </TouchableOpacity>
          {currentType == "常见" ? (
            <View style={styles.siftCell} />
          ) : (
            <TouchableOpacity
              activeOpacity={0.75}
              style={styles.siftCell}
              onPress={this._onChangeOrderAsc}
            >
              <Text style={{ color: "rgb(253,84,94)", fontSize: 13 }}>
                {orderAscStr}
              </Text>
              <Image style={{ width: 16, height: 18 }} source={orderAscSrc} />
            </TouchableOpacity>
          )}
        </View>
        {isShow && (
          <Animated.View style={[styles.animatedCover, { backgroundColor }]}>
            <TouchableOpacity
              activeOpacity={1}
              style={{ flex: 1 }}
              onPress={this._close}
            >
              <Animated.View
                style={[
                  styles.animatedContent,
                  { top: contentYPosition, height: contentHeight }
                ]}
              >
                {sortTypes.length == 0 ? (
                  <LoadingProgressView style={{ height: contentHeight }} />
                ) : (
                  <ScrollView
                    style={{ backgroundColor: "#fff" }}
                    contentContainerStyle={{
                      flexDirection: "row",
                      flexWrap: "wrap"
                    }}
                  >
                    {sortTypes.map(this._renderSortTypeCell)}
                  </ScrollView>
                )}
              </Animated.View>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    );
  }
}

class LoadingProgressView extends Component{
  render(){
    return (
      <View style={[styles.loadingProgress, this.props.style]}>
        <ActivityIndicator />
      </View>
    )
  }
}

class FoodItem extends Component {
  static propsTypes = {
    food: PropTypes.object,
    sortCode: PropTypes.string,
    onPress: PropTypes.func
  };

  _onPress = () => {
    const { onPress, food } = this.props;
    onPress && onPress(food);
  };

  render() {
    const { food, sortCode } = this.props;
    let lightStyle = [styles.healthLight];
    if (food.health_light == 2) {
      lightStyle.push({ backgroundColor: gColors.healthYellow });
    } else if (food.health_light == 3) {
      lightStyle.push({ backgroundColor: gColors.healthRed });
    }

    const defaultImg = require("../../resource/img_default_food_thumbnail.png");
    const imgSrc = food.thumb_image_url
      ? { uri: food.thumb_image_url }
      : defaultImg;

    return (
      <TouchableOpacity
        activeOpacity={0.75}
        style={styles.foodItem}
        onPress={this._onPress}
      >
        <Image
          style={{
            width: 40,
            height: 40,
            marginHorizontal: 10,
            borderRadius: 4
          }}
          source={imgSrc}
          defaultSource={defaultImg}
        />
        <View style={styles.foodNameWrapper}>
          <View
            style={{ justifyContent: "center", width: gScreen.width - 60 - 30 }}
          >
            <Text style={{ color: "#666", marginBottom: 5 }} numberOfLines={1}>
              {food.name}
            </Text>
            <Text style={{ color: "red", fontSize: 13 }}>
              {food[sortCode]}
              <Text style={{ color: "#666" }}>{` ${
                gSortTypeUnitMapper[sortCode]
              }/${food.weight}克`}</Text>
            </Text>
          </View>
          <View style={lightStyle} />
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  foodItem: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10
  },
  foodNameWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgb(194,194,198)",
    height: 60,
    width: gScreen.width - 60,
    paddingRight: 10
  },
  healthLight: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: gColors.healthGreen,
    marginRight: 0
  },
  siftWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    height: gScreen.navBarHeight + 44,
    marginTop: -gScreen.navBarHeight,
    paddingTop: gScreen.navBarHeight,
    borderBottomColor: gColors.border
  },
  siftCell: {
    height: 44,
    flexDirection: "row",
    alignItems: "center"
  },
  orderByFont: {
    fontSize: 13,
    marginRight: 5
  },
  sortTypeItem: {
    borderBottomColor: gColors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    height: 40,
    width: gScreen.width / 3,
    paddingLeft: 10,
    justifyContent: "center"
  },
  loadingProgress: {
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center"
  },
  animatedCover: {
    position: "absolute",
    top: 44,
    left: 0,
    right: 0,
    height: gScreen.height - gScreen.navBarHeight - 44
  },
  animatedContent: {
    position: "absolute",
    left: 0,
    right: 0
  },
  subcategoryWrapper: {
    flexDirection: "row",
    paddingHorizontal: 10,
    width: gScreen.width,
    height: gScreen.height - gScreen.navBarHeight,
    justifyContent: "flex-end",
    zIndex: 1
  },
  subcategoryAnimatedWrapper: {
    backgroundColor: "rgba(83, 83, 83, 0.85)",
    position: "absolute",
    right: 10,
    borderRadius: 4
  },
  subcategoryItem: {
    height: 34,
    justifyContent: "center",
    alignItems: "center",
    borderBottomColor: "rgba(255,255,255,0.6)",
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 20
  },
  loadingContainer: {
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row"
  },
  title: {
    fontSize: 13,
    marginLeft: 8,
    color: "#333"
  }
});
