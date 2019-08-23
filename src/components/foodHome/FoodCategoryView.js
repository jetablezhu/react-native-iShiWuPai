import React,{Component} from 'react'
import {View,TouchableOpacity,Image,Text,StyleSheet} from 'react-native'

let title = '食物分类';

export default class FoodCategoryView extends Component{
    constructor(props)
    {
        super(props)
        let {foodCategory} = this.props
        if (foodCategory.kind === 'brand') {
            title = '热门品牌';
        } else if (foodCategory.kind === 'restaurant') {
            title = '连锁餐饮';
        }
    }

    render(){
        return (
            <View style={{backgroundColor: 'white', marginTop: 10, overflow: 'hidden'}}>
                <View style={styles.groupHeader}>
                    <Text style={{color: 'gray'}}>{title}</Text>
                    <View style={{width: gScreen.width - 16 * 2, height: 14, backgroundColor: '#f5f5f5'}}>
                        <Image style={{width: gScreen.width - 16 * 2, height: 14}}
                            source={require('@resource/img_home_list_bg.png')}
                        />
                    </View>
                </View>
                <View style={styles.categoryContainer}>
                    {this.props.foodCategory.categories.map((category) => {
                        return (
                            <TouchableOpacity
                                key={category.id}
                                activeOpacity={0.75}
                                style={styles.category}
                                onPress={() => this.props.onPress(this.props.foodCategory.kind, category)}
                            >
                                <Image
                                    style={styles.categoryIcon}
                                    source={{uri: category.image_url}}
                                    resizeMode="contain"
                                />
                                <Text style={styles.categoryTitle}>{category.name}</Text>
                            </TouchableOpacity>
                        )
                    })}
                </View>
            </View>
        )
    }
}

const styles=StyleSheet.create({
    groupHeader: {
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    category: {
        width: (gScreen.width - 16 * 2) / 3,
        height: 65,
        alignItems: 'center',
        marginBottom: 25,
    },
    categoryContainer: {
        backgroundColor: 'white',
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: gScreen.width - 16 * 2
    },
    categoryIcon: {
        width: 40,
        height: 40,
    },
    categoryTitle: {
        color: 'gray',
        fontSize: 12,
        marginTop: 5,
    }
})