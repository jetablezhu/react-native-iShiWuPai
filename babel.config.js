module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  "plugins": [
      [
        "@babel/plugin-proposal-decorators",
        {
          "legacy": true
        }
      ],
      [
				'module-resolver',
				{
					root:['./src'],
					alias:{
						'@common':'./src/common',
						'@components':'./src/components',
						'@pages':'./src/pages',
						'@store':'./src/store',
            '@resource':'./src/resource',
            '@foodHome':'./src/components/foodHome'
					}
				}
      ]
  ]
};
