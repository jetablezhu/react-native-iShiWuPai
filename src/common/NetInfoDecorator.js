/**
 * Created by ljunb on 2017/1/7.
 */
import React, {Component} from 'react'
import NetInfo from '@react-native-community/netinfo'

const NetInfoDecorator = WrappedComponent => class extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isConnected: true,
        }
    }

    componentDidMount() {
        const unsbuscribe=NetInfo.addEventListener(state=>
            this.setState({isConnected:state.isConnected})
        )
    }
    

    componentWillUnmount() {
        unsbuscribe()
    }

    render() {
        return <WrappedComponent {...this.props} {...this.state}/>
    }
}

export default NetInfoDecorator