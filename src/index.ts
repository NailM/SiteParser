import { Page } from './models/page'
class StartApp {

    constructor() {
        const dvach = new Page('https://2ch.hk/b/arch/2020-08-03/res/225828565.html')
        dvach.downloadAll()
    }

}

const app = new StartApp()