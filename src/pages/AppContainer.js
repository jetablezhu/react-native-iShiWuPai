import React from "react"
import {
  createStackNavigator,
  createAppContainer,
  StackViewTransitionConfigs
} from "react-navigation"
import TabBarViewScreen from "@pages/TabBarView"
import SplashScreen from "@pages/Splash"
import LoginScreen from "@pages/Login"
import ScannerScreen from "@components/Scanner"
import FoodsScreen from "@pages/home/Foods"
import FeedDetailScreent from "@pages/feed/FeedDetail"

const IOS_MODAL_ROUTES = ["Login"];

let dynamicModalTransition = (transitionProps, prevTransitionProps) => {
  const isModal = IOS_MODAL_ROUTES.some(
    screenName =>
      screenName === transitionProps.scene.route.routeName ||
      (prevTransitionProps &&
        screenName === prevTransitionProps.scene.route.routeName)
  );
  return StackViewTransitionConfigs.defaultTransitionConfig(
    transitionProps,
    prevTransitionProps,
    isModal
  );
};

const AppStack = createStackNavigator(
  {
    Splash: { screen: SplashScreen },
    TabBar: { screen: TabBarViewScreen },
    Login: { screen: LoginScreen },
    Scanner: { screen: ScannerScreen },
    Foods: { screen: FoodsScreen },
    FeedDetail: { screen: FeedDetailScreent }
  },
  {
    transitionConfig: dynamicModalTransition,
    defaultNavigationOptions: () => ({
      header: null
    })
  }
);

export default createAppContainer(AppStack);
