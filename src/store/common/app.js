/**
 * Created by ljunb on 2017/5/25.
 */
import {observable, action} from 'mobx'

class App {
    @observable barStyle = 'default'

    @action
    updateBarStyle = style => {
        // this.barStyle = style
        this.barStyle=this.barStyle
    }
}

export default new App()